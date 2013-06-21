// used to know if the modal window is open, to avoid opening twice together
var open = false;

var moment = require('alloy/moment');

function closeModal(){
	open = false; // very important!!! (not sure why i just ripped this from somewhere else teehee)
	$.modal_picker_window.close();
}

/**
 * 	e.winTitle
 * 		title of modal window
 * 
 * 	e.rowTitle
 * 		title of tablerow that displays what they picked
 * 
 * 	e.selectedValue 
 * 		default string value. if multi column, pass array with indexes matcheing up with e.data
 * 
 * 	e.pickerData
 * 		picker rwos. pass array if want multi column picker
 * 
 * 	e.callBack(a)
 * 		function that gets callde when user hit's "done"
 * 		-a will pass the row if it's a single col picker
 * 		-a will pass array of row object if multi col
 * 		-a will pass date string if is date picker
 * 
 * 	e.returnView (boolean)	| default: false
 * 		if true, will return view object instead of opening modal
 * 
 * 	e.closeOnDone (boolean) | default: true
 * 		if false, wont close on done. (incase using navgroup with next button)
 * 
 */

this.showPicker = function(e){
	
	 // only open the new modal if there aren't open ones
    if(open)
        return
        
	var type = e.type === undefined ? Ti.UI.PICKER_TYPE_PLAIN : e.type;
	var returnView = e.returnView === undefined ? false : e.returnView;
	var closeOnDone = e.closeOnDone === undefined ? true : e.closeOnDone;
	
	////////////
	//	picker settings
	$.modal_picker_window.title = e.winTitle;
	$.modal_picker_picker.type = type;
	
	
	///////
	// Nav buttons
	
	//	DONE or custom button for when user is done entering data
	if(typeof e.doneButton !== "undefined"){
		var doneBtn = e.doneButton;
		$.modal_picker_window.rightNavButton = doneBtn;
	}else{
		var doneBtn = Ti.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.SAVE });
		$.modal_picker_window.rightNavButton = doneBtn;
	}
	
	if(!returnView){
		var cancelBtn = Ti.UI.createButton({ systemButton:Titanium.UI.iPhone.SystemButton.CANCEL });
		$.modal_picker_window.leftNavButton = cancelBtn;
		cancelBtn.addEventListener('click', closeModal);
	}
	
	/////
	// Convert pickerData to picker Rows
	if (type !== Ti.UI.PICKER_TYPE_DATE) {
		if(typeof e.pickerData[0] === 'string'){
			for (var i in e.pickerData) {
				$.modal_picker_picker.add(Ti.UI.createPickerRow({title:e.pickerData[i]}));	
			}
			
		}else{
			var colCount = 0;
			// must be array, therefore multi column
			for(var i in e.pickerData){
				colCount++;
				var pickercol = Ti.UI.createPickerColumn();
				for(var k in e.pickerData[i]){
					pickercol.addRow(Ti.UI.createPickerRow({title:e.pickerData[i][k]}));
				}
				$.modal_picker_picker.add(pickercol);
				
			}
		}
	}
	
	//////////
	// set call back
	if (typeof e.callBack === 'undefined') {
		Titanium.API.info('missing callback function for modal picker widnow');
	}else{
		doneBtn.addEventListener('click', function(a) {
			if (type === Ti.UI.PICKER_TYPE_DATE) {
				e.callBack($.modal_picker_picker.value);
				
			} else if(colCount > 0) {
				// for multiple columns 
				var callbackArray = [];
				for(var i=0; i < colCount; i++){
					callbackArray.push($.modal_picker_picker.getSelectedRow(i));
				}
				
				e.callBack(callbackArray);
				
			} else {	
				e.callBack($.modal_picker_picker.getSelectedRow(0));
			}
			
			if(closeOnDone){
				$.modal_picker_window.close();
			}
		});

	}
	
	// set tableviewrow title
	$.trow_mp.title = e.rowTitle;
	
	// change label_sub text when picker changes values
	$.modal_picker_picker.addEventListener('change',function(k){
		if (type === Ti.UI.PICKER_TYPE_DATE) {
			var date = moment($.modal_picker_picker.value).format("dddd, MMMM Do YYYY");
			$.label_sub.text = date;
			
		}else if(colCount > 0){
			// for multi columns, add all selected rows together in a string. pray it works
			// TODO: possibly add a callback fxn that deals with this?
			var text = "";
			for(var i=0; i < colCount; i++){
				text += ($.modal_picker_picker.getSelectedRow(i).title);
			}
			$.label_sub.text = text;
			
		}else{

			$.label_sub.text = $.modal_picker_picker.getSelectedRow(i).title;

		}
		$.tableview_modalpicker.selectRow(0);	// tablerow gets unselected once modified for some reason
	});
	
	// return view instead of opening window if desired
	if(e.returnView === true){
		
		// set defaults once window is open
		$.modal_picker_window.addEventListener('open',function(){
			setPickerDefaults(type,e,colCount);
		});
		
		
		
		return this.getView();
	}
	
	
	// show modal window with picker
	open = true;
	$.modal_picker_window.open({modal:true});
	
	// select tableviewrow
	$.tableview_modalpicker.selectRow(0);
	
	setPickerDefaults(type,e,colCount);

}

function setPickerDefaults(type,e,colCount){
	
	// set defeualt rows
	if (type === Ti.UI.PICKER_TYPE_DATE) {
		$.modal_picker_picker.value = e.selectedValue;
		
		// fire on change event to set todays date if no default val
		$.modal_picker_picker.fireEvent('change');
		
	}else{
		if(colCount > 0){
			// multi col picker
			for(var i=0; i<colCount; i++){
				var selectedIndex = e.pickerData[i].indexOf(e.selectedValue[i]);
				$.modal_picker_picker.setSelectedRow(i, selectedIndex, false);
			}
		}else{
			
			// single col picker
			var selectedIndex = e.pickerData.indexOf(e.selectedValue);
			$.modal_picker_picker.setSelectedRow(0, selectedIndex, false);
		}
	}
}
