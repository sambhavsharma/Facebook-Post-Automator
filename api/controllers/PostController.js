module.exports = {
	create: function(req, res) { 

		Sequence.find({doc_id: 1}).exec(
			function(err, doc){

				if(err){
					errString = JSON.stringify(err);
					return res.view('post-add',{error: errString});
				}

				console.log(JSON.stringify(doc));

				currSeq = doc[0].seq;
				newSeq = currSeq.slice(1, currSeq.length).concat(currSeq.slice(0, 1));

				req.body.seq = currSeq;

				Post.create(req.body).exec(
					function(err, persistedPost) {
						if(err) {
							console.log("Error Adding Post: "+JSON.stringify(err));
							errString = JSON.stringify(err);
							return res.view('post-add',{error: errString});
						}

						Sequence.native(
							function(err, collection){
								if(err){
									var errString = JSON.stringify(err);
									return res.view('post-add',{error: errString});
								}

								collection.update(
									{
										doc_id: 1
									},
									{ 
										$set: { "seq": newSeq }
									},
									{ multi: false, upsert: true},
									function(err, result){
										if(err){
											var errString = JSON.stringify(err);
											return res.view('post-add',{error: errString});
										} else {

											return res.view('post-add',{message: 'Post added!'});
										}
									}
								);
							}
						);
					}
				);
			}
		);
	},

	list: function(req, res){

		Post.find().exec(
			function(err, posts){
				if(err) {
					console.log("Error Retrieving Post: "+JSON.stringify(err));
					errString = JSON.stringify(err);
					return res.view('post-list',{error: errString});
				}
				return res.view('post-list',{posts: posts});
			}
		);
	},

	delete: function(req, res){
		
		var id = req.param('id');

		Post.destroy({
			id: id
		}).exec(function(err, response){
			if(err) {
				console.log("Error Deleting Post: "+JSON.stringify(err));
				errString = JSON.stringify(err);
				return res.view('post-list',{error: errString});
			}

			Post.find().exec(
				function(err, posts){
					if(err) {
						console.log("Error Retrieving Post: "+JSON.stringify(err));
						errString = JSON.stringify(err);
						return res.view('post-list',{error: errString});
					}
					return res.view('post-list',{posts: posts, message: "Post Deleted!"});
				}
			);
		});
	}

}