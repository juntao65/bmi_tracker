exports.definition = {
	config: {
		"columns":{
			"date":"text",
			"weight":"weight"
		},
		
		"adapter":{
			"type":"sql",
			"collection_name":"entries"
		}
	},
	
	extendCollection: function(Collection) {		
        _.extend(Collection.prototype, {
			
            // Implement the comparator method. Sorts by date descending
    	    comparator : function(entry) {
        	    return -entry.get('date');
            }

        }); // end extend
		
        return Collection;
    }
}
