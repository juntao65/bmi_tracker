var moment = require('alloy/moment');
var entries = Alloy.Collections.entries;
var helpers = require('helpers');


/////
// Initailization

(function(){
	// delete listener for entries
	$.table_entries.addEventListener('delete',function(e){
		helpers.removeItem(entries, e.index);
	});
	
	//show entry_detail screen when click on tableviewrow
	$.table_entries.addEventListener('click',function(e){
		var entry_detail = Alloy.createController('entry_detail').getTheView({model:e.row.model});
		$.tab_tracker.open(entry_detail);
		
	});

	// show tutorial if no entries
	entries.on('fetch',function(){
		if(entries.length == 0){
			$.imgTutorial.visible = true;
			$.table_entries.visible = false;
		
		}else{
			// otherwise show entries as usual
			$.imgTutorial.visible = false;
			$.table_entries.visible = true
		}
	
	});
	
	// If new entry added, show its details
	entries.on('add',function(model){

		var out = {alloy_id:model.get('alloy_id')};
		var entry_detail = Alloy.createController('entry_detail').getTheView({model:out});
		$.tab_tracker.open(entry_detail);
		
	});
	
	// load the entries
	entries.fetch();
})();


/**
 * 	Functions
 */

// shows "addedit" window
function showAddModal(){
	
	var add_win = Alloy.createController('add_edit');
	add_win.showAddEntryModal();
	
}


// this function goes through each entry
function doTransform(model) {
	var transform = model.toJSON();
	
	// the date 
	if( transform.date == null){
		transform.dateSince  = "Dun goofed";
	}else{
		transform.dateSince  = "al good";
		transform.dateSince = moment(transform.date,'YYYYMMDDHHmmss').format('MMMM Do YYYY');
	}
	
	transform.bmi = helpers.calculateBMI(transform.weight);
	
	// add text to ouput, cause can't do it in the view itself(wtfark)
	transform.bmi = "BMI: " + transform.bmi;
	transform.weight = "" + transform.weight + " lbs";
	
	return transform;
}


	