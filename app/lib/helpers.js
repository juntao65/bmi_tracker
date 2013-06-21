/**
 * 
 *	Helper functions 
 */


// in: date object
// out: readable string (Jan 7, 2013)
exports.dateToReadableString = function(a){
	var weekday= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    
    return monthNames[a.getMonth()] + " " + a.getDate() + ", " + a.getFullYear();
}

exports.setPropertyString = function(key,string){
	
	Ti.App.Properties.setString(key,string);
}

// validation... for numbers lol
// wtf kidna framework doenst have built in validation?
exports.liveValidate = function(e){
	
	e.textfield.addEventListener('change',function(){
		
		var the_limit = e.limit	// how many digits num can go 
		e.textfield.value = e.textfield.value.slice(0,the_limit);
		
	});
	
}

exports.calculateBMI = function(weight){
	var height_ft = Ti.App.Properties.getString('height_ft','').replace("'","");
	var height_in = Ti.App.Properties.getString('height_in','').replace('"',"");
	
	var bmi = (weight / Math.pow((height_ft*12 + height_in*1),2))*703;
	var bmi = Math.round(bmi);
	return bmi;
}


exports.removeItemByID = function(collection, id) {
	var model = collection.get(id);

	// remove the model from the collection
	collection.remove(model);

	// destroy the model from persistence
	model.destroy();

  	// update views from sql storage
  	collection.fetch();
};

exports.removeItem = function(collection, index) {
	var model = collection.at(index);

	// remove the model from the collection
	collection.remove(model);

	// destroy the model from persistence
	model.destroy();

  	// update views from sql storage
  	collection.fetch();
};


