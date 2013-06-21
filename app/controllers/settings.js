var helpers = require('helpers');

// Load settings from app properties any time Settings window comes into focus
$.Settings.addEventListener("focus",function(e){
	$.label_age.text = Ti.App.Properties.getString('age','Click to set your age');
	$.label_gender.text = Ti.App.Properties.getString('gender','Click to set your gender');
	$.label_height.text = Ti.App.Properties.getString('height_ft','Click to set your height') + Ti.App.Properties.getString('height_in','');
});


/**
 * 	onClick functions
 */
function showGenderPicker(e){
	
	var modal_picker = Alloy.createController('modal_picker');
	
	var callback = function(a){
		//alert(a.title);
		helpers.setPropertyString('gender',a.title);
	}
	

	modal_picker.showPicker({
		winTitle:"Select Gender",
		rowTitle:"Gender",
		pickerData:['Male','Female'],
		selectedValue:Ti.App.Properties.getString('gender',''),
		callBack:callback
	});
	
}

function showHeightPicker(){
	
	var modal_picker = Alloy.createController('modal_picker');
	
	var callback = function(a){
		helpers.setPropertyString('height_ft',a[0].title);
		helpers.setPropertyString('height_in',a[1].title);
	}
	
	modal_picker.showPicker({
		winTitle:"Select Height (ft/in)",
		rowTitle:"Height",
		selectedValue:[Ti.App.Properties.getString('height_ft',''),Ti.App.Properties.getString('height_in','')],
		pickerData:[
			["3'","4'","5'","6'","7'","8'","9'"],
			['1"','2"','3"','4"','5"','6"','7"','8"','9"','10"','11"','12"']
		],
		callBack:callback,
	});
	
	
}

function showAgePicker(){
	
	var modal_picker = Alloy.createController('modal_picker');
	
	var callback = function(a){
		helpers.setPropertyString('age',a.title);
		
	}
	
	// build age data
	var data = [];
	for(var i=12; i<80; i++){
		data.push(''+i+'');
	}

	modal_picker.showPicker({
		winTitle:"Select age (years)",
		rowTitle:"Age",
		selectedValue:Ti.App.Properties.getString('age',''),
		pickerData:data,
		callBack:callback,

	});
	
}

