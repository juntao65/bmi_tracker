var helpers = require('helpers');
var moment = require('alloy/moment');

this.getTheView = function(e){
	var entries = Alloy.Collections.entries;
	var id = e.model.alloy_id;

	
	// get current entry from DB/mode/whatever the fuck
	var entry = entries.get(id);	
	var jsString;
	
	
	// set field values
	$.win_entry.addEventListener('focus',function(){
		
		var weight = entry.get('weight');
		var height_ft = Ti.App.Properties.getString('height_ft','').replace("'","");
		var height_in = Ti.App.Properties.getString('height_in','').replace('"',"");
		var bmi = helpers.calculateBMI(weight);
		
		// function to draw on canvas
		jsString = "window.onload = draw(" + weight + ',' + height_ft + ',' + height_in + ',' + bmi + ");";
		
		// fill in fields 
		// TODO: look into using collections + 
		// recycling tracker_entry.xml

		$.weight.text = weight + " lbs";
		$.bmi.text = "BMI: " + bmi;
		$.date.text = moment(entry.get('date'),'YYYYMMDDHHmmss').format('MMMM Do YYYY');
		
		
		$.webview.reload();
		
	});
	
	// have to do onload otherwise canvas wont
	// execute for some reason
	$.webview.addEventListener('load',function(){
		// evaluate jsString inside the webviewa
		$.webview.evalJS(jsString);
	});
	
	$.webview.reload();
	
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