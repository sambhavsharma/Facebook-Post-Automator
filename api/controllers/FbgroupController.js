module.exports = {
	create: function(req, res) { 
		Fbgroup.create(req.body).exec(
			function(err, persistedGroup) {
				if(err) {
					console.log("Error Adding Group: "+JSON.stringify(err));
					errString = JSON.stringify(err);
					return res.view('group-add',{error: errString});
				}

				Sequence.native(
					function(err, collection){
						if(err){
							var errString = JSON.stringify(err);
							return res.view('group-add',{error: errString});
						}

						collection.update(
							{
								doc_id: 1
							},
							{
								$addToSet: { 
									"seq": req.body.group_id
								}
							},
							{ multi: false, upsert: true},
							function(err, result){
								if(err){
									var errString = JSON.stringify(err);
									return res.view('group-add',{error: errString});
								} else {

									return res.view('group-add',{message: 'Group added!'});
								}
							}
						);
					}
				);
			}
		);
	},

	list: function(req, res){

		Fbgroup.find().exec(
			function(err, groups){
				if(err) {
					console.log("Error Retrieving Group: "+JSON.stringify(err));
					errString = JSON.stringify(err);
					return res.view('group-list',{error: errString});
				}
				return res.view('group-list',{groups: groups});
			}
		);
	},

	delete: function(req, res){
		
		var id = req.param('id');

		Fbgroup.destroy({
			id: id
		}).exec(function(err, response){
			if(err) {
				console.log("Error Deleting Group: "+JSON.stringify(err));
				errString = JSON.stringify(err);
				return res.view('group-list',{error: errString});
			}

			Fbgroup.find().exec(
				function(err, groups){
					if(err) {
						console.log("Error Retrieving Group: "+JSON.stringify(err));
						errString = JSON.stringify(err);
						return res.view('group-list',{error: errString});
					}
					return res.view('group-list',{groups: groups, message: "Group Deleted!"});
				}
			);
		});
	}

}