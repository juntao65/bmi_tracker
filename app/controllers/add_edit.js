// used to know if the modal window is open, to avoid opening twice together
var open = false;
var edit = false;
var id;

var moment = require('alloy/moment');
var helpers = require('helpers');
var entries = Alloy.Collections.entries;


function closeAddModal(){
	open = false; 
	$.add_entry.close();
}

// no actually modal lolol. had to use navgroups to get flip from right animation
function showDateModal(){
	var modal_picker = Alloy.createController('modal_picker');

	var callback = function(a){
		// modify date_label with the selected date
		var outputDate = helpers.dateToReadableString(a);
		$.label_date.setText(outputDate);
		$.label_date.value = a;		// so can fetch later
		
		$.navgroup.close(picker_win);
	}
	
	var picker_win = modal_picker.showPicker({
		winTitle:"Select Date",
		rowTitle:"Date",
		type:Ti.UI.PICKER_TYPE_DATE,
		selectedValue:$.label_date.value,
		callBack:callback,
		returnView:true
	});

	$.navgroup.open(picker_win);
	
}



function addEntry(){
	
	// format date for moment
	var d = $.label_date.value;
	var entryDate = (d.getMonth()+1) + "-" + d.getDate() + "-" + d.getFullYear();
	var weight = $.textfield_weight.value;
	
	////////
	// Validate weight
	if(weight == ""){
		//alert('Even the moon has gravity.');
		// TODO: getting New layout set while view warning 
		//	in console. but doesnt eem to break the app
		
		var animation = require('alloy/animation');
		animation.shake($.textfield_weight)
		return;
	}

	
	if(edit){
		// fidn the entry by id
		var editEntry = entries.get(id);
		editEntry.set({
			"weight":weight,
			"date":moment(entryDate,"MM-DD-YYYY").format('YYYYMMDDHHmmss')
			
		}).save();
		
	}else{
		// create a new model instance based on user input
	    var newEntry = Alloy.createModel('Entries', {
	        weight : weight,
	        date: moment(entryDate,"MM-DD-YYYY").format('YYYYMMDDHHmmss')
	    });
	    
	    // Save the entry to persistence, which will re-render
	    // the UI based on the binding.
	    newEntry.save();
	    
	    // Add new model to the collection, use silent=true
	    // so that a "change" event is not fired and the
	    // UI is re-rendered.
	    entries.add(newEntry, {hurr:"durr"});
	    
	    //NOTE: add event has been fired so we can display
	    // this shit's details
	    
	    // not necessary but if i dont fire this one it wont fire
	    // any event for showing tutorial img
	    entries.fetch();
	    
	    
	    
		
	}
	

    
    closeAddModal();
}


$.trow_weight.addEventListener('click',function(){
	// when user clicks anywhere on the table, focus the textfield
	$.textfield_weight.focus();
	
});



/**
 * 	Sets the label_date text field whenever window is focused on.
 * 	This is a workaround for some retarded bug
 * 
 * 	Normally would set this in the modal picker's callback function, but whenever u modify the 
 * 	label's text attribute, the tablerow gets some phantom element that covers everything except
 * 	for the row's title. '
 */
$.add_entry.addEventListener('focus',function(){
	
	var outputDate = helpers.dateToReadableString($.label_date.value);
	$.label_date.text = outputDate;
	
})



this.showAddEntryModal = function(e){
	if(open)
		return
	
	if(typeof e === "object"){	// prevent crash when you pass this fxn no properties
		edit = e.edit === undefined ? false : e.edit;
	}
	
	if(edit){
		///////
		// EDIT
		var entry = entries.get(e.id);
		var date = new Date(moment(entry.get('date'),'YYYYMMDDHHmmss').format('MMMM D, YYYY'));
		$.win1.title = "Edit entry";
		$.textfield_weight.value = entry.get('weight');
		$.label_date.value = date;		// so is easy to fetch
		id = e.id;
		
		
		// TODO: once tableviewsection/row's hide/show
		// functions actually work we can use those. for
		// now stuck with this hack
		
		//////////
		// DELETE button for edit - add and set event handler
		(function(){
			
			var row = Ti.UI.createTableViewRow({
				backgroundColor:"#f00",
				//selectionStyle:"#8C1717",
				height:50
			});
			var label = Ti.UI.createLabel({
				id:"label_delete",
				color:"#fff",
				text:"Delete Entry",
				font: {
					fontSize:20,
					fontWeight:"bold"
				}
			});
			
			row.add(label);
			$.section1.add(row);
			
		
			row.addEventListener('click',function(){
				
				// load are you sure? dialog box
				var dialogs = require('alloy/dialogs');
				var callback = function(e){		// only gets called on "yes"
					helpers.removeItemByID(entries,id);
				
					// to close the entry_detail since
					// this entry will no longer exist
					Ti.App.fireEvent('deleteEntry');	
					closeAddModal();
				}
				dialogs.confirm({callback:callback});
	
			});
				
		})();
		
	}else{
		/////////
		//	ADD 
		
		// set today's date as default on date_label
		var today = new Date();
		$.label_date.text = helpers.dateToReadableString(today);
		$.label_date.value = today;		// so is easy to fetch
		
	}
	
	helpers.liveValidate({textfield:$.textfield_weight,limit:3});
	
	
	// show the window
	open = true;
	$.add_entry.open({modal:true});
	
	// focus the weight field
	if(!edit){
		$.win1.addEventListener('open',function(){
			$.textfield_weight.focus();
		});
	}
}

