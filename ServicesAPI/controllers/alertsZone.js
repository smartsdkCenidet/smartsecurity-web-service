var Zone = require('../../DataModelsAPI/models/zone.model');
var cb = require('ocb-sender');
var ngsi = require('ngsi-parser');
const { DateTime } = require('luxon');

/**
 * Retrieve the history alerts into the Orion on a specific zone from the orion
 * @param req
 * @param res
 */
exports.getHistory = async function (req,res) {
    await Zone.findOne({where : { 'idZone': req.params.idZone }})
    .then( async (zone) => {
	  	if (zone != null){
			let jsonQuery = {
				type : "Alert",
				options : "count",
				georel :"coveredBy",
				geometry:"polygon",
				coords : zone.location
			}
			if(req.query.id != undefined)
				jsonQuery["id"] = req.query.id
			let queryToCount = ngsi.createQuery(jsonQuery);
			/**
			 * Retreive the total count of hitory alerts on the zone
			 */
            await cb.getWithQuery(queryToCount)
			.then(async (response) => {
				let off = Number(response["headers"]["_headers"]["fiware-total-count"][0])
				let params  = {
					type : "Alert",
					options : "keyValues",
					georel :"coveredBy",
					geometry:"polygon",
					coords : zone.location,
					limit : 10,
				}
				if(req.query.id != undefined)
					params["id"] = req.query.id

				if (off > 10){
					params.offset = off - 10
				}
				let query = ngsi.createQuery(params);
				/**
				 * Retreive the las 10 alerts of the history alerts on the zone from the orion
				 */
				await cb.getWithQuery(query)
				.then((result) => {
					res.status(200).json(result.body.reverse())
				})
				.catch((error) =>{
					res.status(500).send("eeror 1");
                })
			})
			.catch((error) =>{
				res.status(500).send("error");
			})
				
	  	}  	
	});
} 

/**
 * Retrieve the current last 10 alerts on a specific zone on the day from the orion
 * @param req
 * @param res
 */
exports.getCurrent = async function (req,res) {
    await Zone.findOne({where : { 'idZone': req.params.idZone }})
    .then( async (zone) => {
	  	if (zone != null){
			/**
			 * Use the DateTime to create the limit time
			 */
			//var dt = DateTime.utc()
			//var dt = DateTime.local();
			var dt = DateTime.local().setZone('America/Mexico_City');
			let midnight = dt.minus({ days: 1 }).endOf('day');
			let jsonQuery = {
				type : "Alert",
				options : "count",
				georel :"coveredBy",
				geometry:"polygon",
				coords : zone.location,
				dateObserved: `>=${midnight}`
			}

			if(req.query.id != undefined)
				jsonQuery["id"] = req.query.id

			let queryToCount = ngsi.createQuery(jsonQuery);
			
			/**
			 * Retrieve the total count of alerts on the zone of the day from the orion
			 */
            await cb.getWithQuery(queryToCount)
			.then(async (response) => {

				let count = Number(response["headers"]["_headers"]["fiware-total-count"][0])  

				let jsonQuery2 = {
					type : "Alert",
					options : "keyValues",
					georel :"coveredBy",
					geometry:"polygon",
					coords : zone.location,
					dateObserved: `>=${midnight}`,
					limit : 10
				}
				
				if(req.query.id != undefined)
					jsonQuery2["id"] = req.query.id

				if(count >= 20)
					jsonQuery2["offset"] = count - 10;
		    		if(count < 20)
					jsonQuery2["limit"] = count;
		    		console.log(count)
		    		console.log(jsonQuery2["offset"])

				let query = ngsi.createQuery(jsonQuery2);

				/**
				 * Retreive the current last alerts on the zone of the day from the orion
				 */
				await cb.getWithQuery(query)
				.then((result) => {
					res.status(200).json(result.body.reverse())
				})
				.catch((error) =>{
					res.status(error.status).send(error);
				})
				
			})
			.catch((error) =>{
				console.log("segundo")
				res.status(500).send(error);
			})
				
	  	}  	
	});
} 

/**
 * Retrieve the last alerts on the a specific zone of the last hour from the orion
 * @param req
 * @param res
 */
exports.getCurrentHour = async function (req,res) {
    await Zone.findOne({where : { 'idZone': req.params.idZone }})
    .then( async (zone) => {
	  	if (zone != null){
			/**
			 * Use Date time to create the limit time
			 */
			var dtLocal = DateTime.local().setZone('America/Mexico_City');
			var date = DateTime.utc(
				dtLocal.year,
				dtLocal.month,
				dtLocal.day,
				dtLocal.hour,
				dtLocal.minute
			)

			let midnight = date.minus({ hours : 1 }).endOf("minutes");

			let jsonQuery = {
				type : "Alert",
				options : "count",
				georel :"coveredBy",
				geometry:"polygon",
				coords : zone.location,
				dateObserved: `>=${midnight}`
			}

			if(req.query.id != undefined)
				jsonQuery["id"] = req.query.id

			let queryToCount = ngsi.createQuery(jsonQuery);
			
			/**
			 * Retrieve the total count of alerts on the zone of the last hour
			 */
            await cb.getWithQuery(queryToCount)
			.then(async (response) => {

				let count = Number(response["headers"]["_headers"]["fiware-total-count"][0])  
				
				let jsonQuery2 = {
					type : "Alert",
					options : "keyValues",
					georel :"coveredBy",
					geometry:"polygon",
					coords : zone.location,
					dateObserved: `>=${midnight}`,
					limit : 10
				}
				
				if(req.query.id != undefined)
					jsonQuery2["id"] = req.query.id

				if(count > 20)
					jsonQuery2["offset"] = count - 10;

				let query = ngsi.createQuery(jsonQuery2);

				/**
				 * Retrieve the last alerts on the zone of the last hour  from the orion
				 */
				await cb.getWithQuery(query)
				.then((result) => {
					
					res.status(200).json(result.body.reverse())
					
				})
				.catch((error) =>{
					res.status(error.status).send(error);
				})
				
			})
			.catch((error) =>{
				console.log("segundo")
				res.status(500).send(error);
			})
				
	  	}  	
	});
} 










