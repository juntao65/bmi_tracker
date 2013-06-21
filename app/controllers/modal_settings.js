var helpers = require('helpers');

(function(){
if (OS_IOS || OS_MOBILEWEB) {
	
	/**
	 * 	Navgroup
	 * 	-3 pages
	 * 		- age (textfield)
	 * 		- gender (picker)
	 * 		- height (picker)
	 */
	
	// attach the navgroup to Alloy.CFG so it can be accessed globally
	Alloy.CFG.navgroup = $.navgroup;		/// kinda pointless but just left it here
											// 	cause nice to know
	var mp_gender_cont = Alloy.createController('modal_picker');
	var mp_height_cont = Alloy.createController('modal_picker');
	
	var mp_gender_callback = function(a){
		helpers.setPropertyString('gender',a.title);
		
		// show next win
		$.navgroup.open(mp_height_view);
	}
	
	var mp_height_callback = function(a){
		helpers.setPropertyString('height_ft',a[0].title);
		helpers.setPropertyString('height_in',a[1].title);
		
		// close all navgroups
		$.navgroup.close($.win1);		
		$.navgroup.close(mp_gender_view);
		$.navgroup.close(mp_height_view);
		
		// close parent window of navgroup
		$.win_container.close();
	}
	
	var mp_gender_next = Ti.UI.createButton({ title: 'Next'});
	var mp_gender_view = mp_gender_cont.showPicker({
		winTitle:"Gender",
		rowTitle:"Gender",
		pickerData:['Male','Female'],
		selectedValue:Ti.App.Properties.getString('gender',"Male"),
		doneButton:mp_gender_next,
		callBack:mp_gender_callback,
		closeOnDone:false,
		returnView:true
	});
	
	var mp_height_view = mp_height_cont.showPicker({
		winTitle:"Height",
		rowTitle:"Height",
		selectedValue:[Ti.App.Properties.getString('height_ft',"5'"),Ti.App.Properties.getString('height_in','8"')],
		pickerData:[
			["3'","4'","5'","6'","7'","8'","9'"],
			['1"','2"','3"','4"','5"','6"','7"','8"','9"','10"','11"','12"']
		],
		callBack:mp_height_callback,
		returnView:true
	});
		
	var next1 = Ti.UI.createButton({ title: 'Next'});
	next1.addEventListener('click', function(a) {
		
		// age validation
		if($.textfield_age.value > 120){
			alert("Yes and I'm sure you were friends with Jesus too.");
			return;
			
		}else if($.textfield_age.value  == ""){
			var animation = require('alloy/animation');
			animation.shake($.textfield_age)
			return;
		}
		
		helpers.setPropertyString('age',$.textfield_age.value);
		$.navgroup.open(mp_gender_view);
		
	});
	
	// live validation for mac input
	helpers.liveValidate({textfield:$.textfield_age,limit:3});
	
	$.win1.rightNavButton = next1;
}
})();

$.win1.addEventListener('focus',function(){
	
	
	$.textfield_age.focus();
});


