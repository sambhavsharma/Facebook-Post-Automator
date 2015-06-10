module.exports = {
 
  	attributes: {
    	content: {
      		type: "string",
      		required: true
    	},
    	link: {
    		type: "string",
    		required: true,
    		unique: true
    	},
      seq: {
        type: "array",
        required: true,
        defaultsTo: []
      }
    }
}
