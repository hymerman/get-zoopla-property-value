'use strict';

var fs = require('fs');
var q = require('q');
var get_zoopla_property_value = require('./get-zoopla-property-value.js');

function readFilePromise(file_name) {
	var deferred = q.defer();
	console.log("Read requested");

	fs.readFile(file_name, {encoding:"utf-8"}, function (error, file_contents) {
		if(error) {
			console.log("Read error");
			deferred.reject(new Error(error));
		} else {
			console.log("Read success");
			deferred.resolve(file_contents);
		}
	});
	
	return deferred.promise;
}

function writeFilePromise(file_name, file_contents) {
	var deferred = q.defer();
	console.log("Write requested");

	fs.writeFile(file_name, file_contents, {encoding:"utf-8"}, function (error) {
		if(error) {
			console.log("Write error");
			deferred.reject(new Error(error));
		} else {
			console.log("Write success");
			deferred.resolve();
		}
	});
	
	return deferred.promise;
}

function read_or_init_transactions(file_name) {
	console.log("Trying to read account");

	return readFilePromise(file_name)
		.then(function(file_contents) {
			console.log("Reading existing account from file");
			console.log(file_contents);
			console.log("Parsing as json");
			var account = JSON.parse(file_contents);
			console.log("Parsing succeeded");
			console.log(account);
			return account;
		})
		.fail(function(error) {
			console.log("Creating new account");
			var account = new Object();
			account.Transactions = new Array();
			account.ClosingBalance = Number(0);
			account.StartDate = new Date();
			account.EndDate = account.StartDate;
			return account;
		});
}

function update_account_file(value, file_name) {
	return read_or_init_transactions(file_name)
		.then(function(account) {
			console.log("Before");

			console.log(JSON.stringify(account, null, " "));
			console.log("Modifying");
			if(account.Transactions.length == 0)
			{
				console.log("Adding initial transaction");
				account.Transactions.push(new Object());
				account.Transactions[0].amount = value;
				account.Transactions[0].date = new Date();
				account.Transactions[0].name = "Initial value of property";
				account.ClosingBalance = value;
				account.EndDate = new Date();
			}
			else
			{
				var change = value - account.ClosingBalance;
				if(change != 0)
				{
					console.log("Adding new transaction to account for change in value: " + change);
					account.Transactions.push(new Object());
					account.Transactions[account.Transactions.length-1].amount = change;
					account.Transactions[account.Transactions.length-1].date = new Date();
					account.Transactions[account.Transactions.length-1].name = "Change in value of " + change;
					account.ClosingBalance = value;
					account.EndDate = new Date();
				}
				else
				{
					console.log("No change in value; not adding any new transactions");
				}
			}

			console.log("After");
			console.log(JSON.stringify(account, null, " "));
			
			return account;
		})
		.then(function(account) {
			return writeFilePromise(file_name, JSON.stringify(account, null, " "));
		});
}

if(process.argv.length != 4)
{
	console.error("Need to pass Zoopla id as argument 1, and file path as argument 2");
	return;
}

var zoopla_id = process.argv[2];
var file_name = process.argv[3];

get_zoopla_property_value.get_zoopla_property_value(zoopla_id)
	.then(function(value){
		// Multiply the value by 100 since our json file is in pence, and zoopla deals with pounds.
		return update_account_file(value * 100, file_name);
	})
	.fail(function(error){
		console.log("Failed: " + error);
	})
	.done();
