'use strict';

var request = require('request');
var cheerio = require('cheerio');
var q = require('q');

// Takes a Zoopla ID. Returns a promise for the current estimated value.
function get_zoopla_property_value(zoopla_id) {
	var deferred = q.defer();
	
	// todo: check id is in right format so we don't request something crazy.
	var url = 'http://www.zoopla.co.uk/property/' + zoopla_id;

	request(url, function(err, resp, body) {
		if(err) {
			deferred.reject(new Error(err));
		}
		else
		{
			var contents_dom = cheerio.load(body);
			// todo: check the dom is well-formed.
			var value_text = contents_dom('#estimate-property ul li p span strong').text();
			// todo: check the element exists. HTML could have changed.
			var value = Number(value_text.replace(/[^0-9\.]+/g,""));
			// todo: check value is sensible/well-formed.
			deferred.resolve(value);
		}
	});
	
	return deferred.promise;
}

// Run the script.
// if(process.argv.length != 3)
// {
// 	console.error("Need to pass Zoopla id in as command line argument");
// 	return;
// }

// var zoopla_id = process.argv[2];

// get_zoopla_property_value(zoopla_id, function(err, value){
// 	if(err) {
// 		console.error(err);
// 	}
// 	else {
// 		console.log(value);
// 	}
// });

module.exports.get_zoopla_property_value = exports = get_zoopla_property_value;
