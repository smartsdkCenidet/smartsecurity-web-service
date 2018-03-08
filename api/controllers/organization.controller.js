'use strict';
var organizationModel = require('../models/organization.model');
var organizationDAO = require('../dao/organization.dao');

function isEmpty (object) {
    if (object == undefined ) return true;
    if (object == null) return true;
    if (object.length === 0)  return true;
    if (typeof object === 'string' && object === "") return true;
    return false;
}

exports.addOrganization = function (req, res){
	var body = req.body;
	if (!isEmpty(body)) {
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1; //Months are zero based
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_minute = d.getMinutes();
		var curr_seconds = d.getSeconds();

		organizationModel.name = body.name;
		organizationModel.dateCreated = curr_year + "/" + curr_month + "/" + curr_date + " " + curr_hour + ":" + curr_minute + ":" +curr_seconds;
		organizationModel.dateModified = curr_year + "/" + curr_month + "/" + curr_date + " " + curr_hour + ":" + curr_minute + ":" +curr_seconds;
		if((organizationModel.name === null || /^\s*$/.test(organizationModel.name) || organizationModel.name.length === 0)){
			res.status(400).json({message: "Empty fields required"});
		}else{
			organizationDAO.addOrganization(organizationModel, async function(status, data){
				if(status === "success"){
					console.log(data);
					res.status(201).json(data);
				}else{
					res.status(400).json({message: "Error inserting"});
				}
			});
		}
	}else{
		res.status(400).json({message: "Bad request"});
	}
}

exports.updateOrganization = function(req, res){
	var body = req.body;
	if(!isEmpty(body)){
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1; //Months are zero based
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_minute = d.getMinutes();
		var curr_seconds = d.getSeconds();
		organizationModel.idOrganization = body.idOrganization;
		organizationModel.name = body.name;
		organizationModel.dateModified = curr_year + "/" + curr_month + "/" + curr_date + " " + curr_hour + ":" + curr_minute + ":" +curr_seconds;
		if((organizationModel.name === null || /^\s*$/.test(organizationModel.name)) || 
				(organizationModel.idOrganization === null || /^\s*$/.test(organizationModel.idOrganization))){
			res.status(400).json({message: "Empty fields required"});
		}else{
			organizationDAO.updateOrganization(organizationModel, async function(status, data){
				if (status=="success" && !isEmpty(data)) {
					res.status(200).json(data);
				}else{
					res.status(404).json({message: "The entity cannot be updated"});
				}
			});
		}
	}else{
		res.status(400).json({message: "Bad request"});
	}
}

exports.deleteOrganization = function(req, res){
	var body = req.body;
	if(!isEmpty(body)){
		var d = new Date();
		var curr_date = d.getDate();
		var curr_month = d.getMonth() + 1; //Months are zero based
		var curr_year = d.getFullYear();
		var curr_hour = d.getHours();
		var curr_minute = d.getMinutes();
		var curr_seconds = d.getSeconds();
		organizationModel.idOrganization = body.idOrganization;
		organizationModel.status = 0;
		organizationModel.dateModified = curr_year + "/" + curr_month + "/" + curr_date + " " + curr_hour + ":" + curr_minute + ":" +curr_seconds;
		if((organizationModel.idOrganization === null || /^\s*$/.test(organizationModel.idOrganization))){
			res.status(400).json({message: "Empty fields required"});
		}else{
			organizationDAO.deleteOrganization(organizationModel, async function(status, data){
				if (status=="success" && !isEmpty(data)) {
					res.status(200).json(data);
				}else{
					res.status(404).json({message: "The entity cannot be updated"});
				}
			});
		}
	}else{
		res.status(400).json({message: "Bad request"});
	}
}

exports.getAllActive = function (req, res){
	var status = 1;
	organizationDAO.getAllOrganization(status,async function(status, data){
		if(status=="success"){
			res.status(200).json(data);
		}else{
			res.status(400).json({message: "An error has ocurred"});
		}
	});
}

exports.getAllInactive = function (req, res){
	var status = 0;
	organizationDAO.getAllOrganization(status, async function(status, data){
		if(status=="success"){
			res.status(200).json(data);
		}else{
			res.status(400).json({message: "An error has ocurred"});
		}
	});
}

exports.getByIdOrganization = function (req, res){
	var query = req.query;
	if (!isEmpty(query)){
		var id = query.idOrganization;
		organizationDAO.getByIdOrganization(id, async function(status, data){
			if(status == "success"){
				res.status(200).json(data);
			}else{
				res.status(400).json({message: "An error has ocurred"});
			}
		});
	}else{
		res.status(400).json({message: "Bad request"});
	}
}