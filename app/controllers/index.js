// app initializatin 
(function(){

	// start app as usual
	$.index.open();

	// make sure the settings are set, orelse ask user to set it
	var age = Titanium.App.Properties.getString('age',false);
	if(!age || true){
		// show setup screen
		alert('Welcome to ' + Alloy.Globals.app.name + '. We need you to enter some info for your first time settings. These figures will help you with the calculuations.');
		var modal_settings = Alloy.createController('modal_settings').getView();
		modal_settings.open();
		
	}	
	
})();


