// Express is the web framework 
var express = require('express');
var pg = require('pg');

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
  app.use(allowCrossDomain);
});


app.use(express.bodyParser());

var car = require("./car.js");
var Car = car.Car;

var carList = new Array(
	new Car("Ford", "Escape", "2013", "V4 engine, 30mpg, Gray", "18000"),
	new Car("BMW", "323", "2013", "V6 engine, 22mpg, White", "35000"),
	new Car("Toyota", "Corolla", "2012", "V4 engine, 32mpg, Black", "16000"),
	new Car("Ford", "F-150", "2013", "V8 engine, 18mpg, Charcoal", "24000"),
	new Car("Nissan", "Pathfinder", "2012", "V6 engine, 20mpg, Pearl", "32000")	
);
 var carNextId = 0;
 
for (var i=0; i < carList.length;++i){
	carList[i].id = carNextId++;
}
 
var conString = "pg://course:course@localhost:5432/coursedb";


// REST Operations
// Idea: Data is created, read, updated, or deleted through a URL that 
// identifies the resource to be created, read, updated, or deleted.
// The URL and any other input data is sent over standard HTTP requests.
// Mapping of HTTP with REST 
// a) POST - Created a new object. (Database create operation)
// b) GET - Read an individual object, collection of object, or simple values (Database read Operation)
// c) PUT - Update an individual object, or collection  (Database update operation)
// d) DELETE - Remove an individual object, or collection (Database delete operation)



// REST Operation - HTTP GET to read all cars
app.get('/ClassDemo4Srv/cars', function(req, res) {
	console.log("GET");
	//var tom = {"make" : "Ford", "model" : "Escape", "year" : "2013", "description" : "V4 engine, 30mpg, Gray", "price" : "$18,000"};
	//var tom = new Car("Ford", "Escape", "2013", "V4 engine, 30mpg, Gray", "$18,000");
	//console.log("tom: " + JSON.stringify(tom));
	
	var client = new pg.Client(conString);
	client.connect();

	var query = client.query("SELECT * from cars");
	
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var response = {"cars" : result.rows};
		client.end();
  		res.json(response);
 	});
});

// REST Operation - HTTP GET to read a car based on its id
app.get('/ClassDemo4Srv/cars/:id', function(req, res) {
	var id = req.params.id;
	console.log("GET car: " + id);
	
	var client = new pg.Client(conString);
	client.connect();

	var query = client.query("SELECT * from cars where cid = $1", [id]);
	
	query.on("row", function (row, result) {
    	result.addRow(row);
	});
	query.on("end", function (result) {
		var len = result.rows.length;
		if (len == 0){
			res.statusCode = 404;
			res.send("Car not found.");
		}
		else {	
  			var response = {"car" : result.rows[0]};
			client.end();
  			res.json(response);
  		}
 	});

/*
	if ((id < 0) || (id >= carNextId)){
		// not found
		res.statusCode = 404;
		res.send("Car not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < carList.length; ++i){
			if (carList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Car not found.");
		}
		else {
			var response = {"car" : carList[target]};
  			res.json(response);	
  		}	
	}
	*/
});

// REST Operation - HTTP PUT to updated a car based on its id
app.put('/ClassDemo4Srv/cars/:id', function(req, res) {
	var id = req.params.id;
		console.log("PUT car: " + id);

	if ((id < 0) || (id >= carNextId)){
		// not found
		res.statusCode = 404;
		res.send("Car not found.");
	}
	else if(!req.body.hasOwnProperty('make') || !req.body.hasOwnProperty('model')
  	|| !req.body.hasOwnProperty('year') || !req.body.hasOwnProperty('price') || !req.body.hasOwnProperty('description')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for car.');
  	}
	else {
		var target = -1;
		for (var i=0; i < carList.length; ++i){
			if (carList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Car not found.");			
		}	
		else {
			var theCar= carList[target];
			theCar.make = req.body.make;
			theCar.model = req.body.model;
			theCar.year = req.body.year;
			theCar.price = req.body.price;
			theCar.description = req.body.description;
			var response = {"car" : theCar};
  			res.json(response);		
  		}
	}
});

// REST Operation - HTTP DELETE to delete a car based on its id
app.del('/ClassDemo4Srv/cars/:id', function(req, res) {
	var id = req.params.id;
		console.log("DELETE car: " + id);

	if ((id < 0) || (id >= carNextId)){
		// not found
		res.statusCode = 404;
		res.send("Car not found.");
	}
	else {
		var target = -1;
		for (var i=0; i < carList.length; ++i){
			if (carList[i].id == id){
				target = i;
				break;	
			}
		}
		if (target == -1){
			res.statusCode = 404;
			res.send("Car not found.");			
		}	
		else {
			carList.splice(target, 1);
  			res.json(true);
  		}		
	}
});

// REST Operation - HTTP POST to add a new a car
app.post('/ClassDemo4Srv/cars', function(req, res) {
	console.log("POST");

  	if(!req.body.hasOwnProperty('make') || !req.body.hasOwnProperty('model')
  	|| !req.body.hasOwnProperty('year') || !req.body.hasOwnProperty('price') || !req.body.hasOwnProperty('description')) {
    	res.statusCode = 400;
    	return res.send('Error: Missing fields for car.');
  	}

  	var newCar = new Car(req.body.make, req.body.model, req.body.year, req.body.description, req.body.price);
  	console.log("New Car: " + JSON.stringify(newCar));
  	newCar.id = carNextId++;
  	carList.push(newCar);
  	res.json(true);
});


// Server starts running when listen is called.
app.listen(process.env.PORT || 3412);
console.log("server listening");
