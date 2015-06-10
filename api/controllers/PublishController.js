var FB = require('fb');
var fs = require('fs');
var ObjectId = require('mongodb').ObjectID;

var access_token = sails.config.properties.facebook_access_token;
var app_id = sails.config.properties.facebook_app_id;
var app_secret = sails.config.properties.facebook_app_secret;
var redirect_uri = sails.config.properties.facebook_redirect_uri;

FB.setAccessToken(access_token);

module.exports = {
	publish: function(req, res) { 

		Post.native(
			function(err, collection){
				if(err){
					return res.status(200).json({message:"Error Publishing Posts: \n"+JSON.stringify(err)});
				}

				collection.find({seq: { $ne: [] } }).toArray(
					function(err, posts){
						if(err){
							return res.status(200).json({message:"Error Publishing Posts: \n"+JSON.stringify(err)});
						}

						for(var i=0; i<posts.length; i++){
							
							sails.controllers.publish.publishToFacebook(
								posts[i],i,
								function(id, group_id){

									Post.native(
										function(err, collection){
											if(err){
												var errString = JSON.stringify(err);
												console.log("Error updating Sequence: "+errString);
											}

											collection.update(
												{
													_id: new ObjectId(id.toString())
												},
												{
													$pull: { 
														"seq": group_id
													}
												},
												{ multi: false},
												function(err, result){
													if(err){
														var errString = JSON.stringify(err);
														console.log("Error updating Sequence: "+errString);
													}

													return;
												}
											);
										}
									);
								}
							)
						}

						return res.status(200).json({message: "Started Publishing!"});
					}
				);
			}
		);
	},
	auth: function(req, res){
		var code = req.param('code');

		if(code){
			FB.api('oauth/access_token', {
			    client_id: app_id,
			    client_secret: app_secret,
			    redirect_uri: redirect_uri,
			    code: code
			}, function (response) {

			    if(!response || response.error) {
			        return res.view('token',{error: "Error receving token: "+ JSON.stringify(response.error)});
			    }
			    var access_token = response.access_token;

			    fs.writeFile("access_token", access_token, function(err) {
				    if(err) {
				        return res.view('token',{error: "Error saving token: "+JSON.saving(err)});		    
				    }
				    return res.view('token',{message: "Token: "+access_token+"\nToken saved to file access_token\nExpires in "
				    	+ response.expires + " seconds.\nYou will have to manually replace the old one with this in config/properties.js file"})
				});
			}); 	
		} else {
			return res.view('token',{message: "Get Facebook User Access Token"})
		}
		
	},
	publishToFacebook: function(post, index, cb){
	
		var params = {
			message: post.content,
			link: post.link
		};

		var group_id = post.seq[0];

		FB.api( group_id+'/feed', 'post', params, function (response) {
		  	if(!response || response.error) {
		    	console.log('Error Posting: \n' + JSON.stringify(response.error));
		    	//return res.status(200).json({message: 'error'});
		  	}
		  	
		  	//return res.status(200).json({message:'ok'});

		  	cb(post._id, group_id);

		});
	}
}