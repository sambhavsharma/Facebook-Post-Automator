module.exports = {
 
  	attributes: {
    	name: {
      		type: "string",
      		required: true
    	},
    	group_id: {
    		type: "string",
    		required: true,
    		unique: true
    	}
    }
}
