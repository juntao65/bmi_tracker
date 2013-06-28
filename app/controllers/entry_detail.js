var helpers = require('helpers');
var moment = require('alloy/moment');

this.getTheView = function(e){
	var entries = Alloy.Collections.entries;
	var id = e.model.alloy_id;

	// declare vars so scope is in entire fxn
	var entry;
	var weight;
	var height_ft;
	var height_in;
	var bmi;
	var jsString;
	
	var setAllVars = function(){
		// get current entry from DB/mode/whatever the fuck
		entry = entries.get(id);	
		
		weight = entry.get('weight');
		height_ft = Ti.App.Properties.getString('height_ft','').replace("'","");
		height_in = Ti.App.Properties.getString('height_in','').replace('"',"");
		bmi = helpers.calculateBMI(weight);
		
		// function to draw on canvas
		jsString = "window.onload = draw(" + weight + ',' + height_ft + ',' + height_in + ',' + bmi + ");";
		
	}
	
	// set field values
	$.win_entry.addEventListener('focus',function(){
		
		// To make sure the variables are fresh
		// incase user edited them
		setAllVars();
		
		// fill in fields 
		// TODO: look into using collections + 
		// recycling tracker_entry.xml

		$.weight.text = weight + " lbs";
		$.bmi.text = "BMI: " + bmi;
		$.date.text = moment(entry.get('date'),'YYYYMMDDHHmmss').format('MMMM Do YYYY');
		
		$.webview.fireEvent('load',null);		// so can reload if user edits
		
	});
	
	// have to do onload otherwise canvas wont
	// execute for some reason
	$.webview.addEventListener('load',function(){
		// evaluate jsString inside the webviewa
		setAllVars();
		$.webview.evalJS(jsString);

	});
	
	
	// edit listener
	$.edit.addEventListener('click',function(){
		var edit_win = Alloy.createController('add_edit');
		edit_win.showAddEntryModal({
			edit:true,
			id:id
			
		});
		
	});
	
	////////
	// if current entry gets deleted, clsoe this view
	var listener = function(){
		$.win_entry.close();
		
	}
	Ti.App.addEventListener('deleteEntry',listener);
	
	// to prevent memory leak for above listener
	$.win_entry.addEventListener('close',function(){
		Ti.App.removeEventListener('deleteEntry',listener);
		
	})
	
	return this.getView();
}