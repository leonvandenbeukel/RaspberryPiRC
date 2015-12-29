var http = require('http');
var url  = require('url');
var fs   = require('fs'); 
var gpio = require('gpio');

var gpio27; // up
var gpio22; // down
var gpio17; // left
var gpio18; // right

var up = 0;
var down = 0;
var left = 0;
var right = 0;

var intervalTimer;

// Create and start webserver on port 3000
var server = http.createServer(function (request, response) {
	
	// enable cors
	response.writeHead(200, {
		'Content-Type': 'text/plain',
		'Access-Control-Allow-Origin' : '*',
		'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
	});
	
	// console.log(request.url);
	
	if (request.url == '/up-on') {
		up = 1;
	} else if (request.url == '/up-off') {
		up = 0;
	} else if (request.url == '/down-on') {
		down = 1;
	} else if (request.url == '/down-off') {
		down = 0;
	} else if (request.url == '/left-on') {
		left = 1;
	} else if (request.url == '/left-off') {
		left = 0;
	} else if (request.url == '/right-on') {
		right = 1;
	} else if (request.url == '/right-off') {
		right = 0;
	}

	response.end();
	
}); 

server.listen(3000, null, null, function() {
	
	// Enable gpio 
	gpio22 = gpio.export(22, { ready: function() { } });	
	gpio27 = gpio.export(27, { ready: function() { } });	
	gpio17 = gpio.export(17, { ready: function() { } });	
	gpio18 = gpio.export(18, { ready: function() { } });	

	// Set timer 
	intervalTimer = setInterval(function() {
		
		if (up == 1) {
			gpio22.set();        
		} else if (up == 0) {
			gpio22.reset();        
		}      

		if (down == 1) {
			gpio27.set();        
		} else if (down == 0) {
			gpio27.reset();        
		}

		if (left == 1) {
			gpio17.set();        
		} else if (left == 0) {
			gpio17.reset();        
		}

		if (right == 1) {
			gpio18.set();        
		} else if (right == 0) {
			gpio18.reset();        
		}
		
	}, 200);	
	
});

// Cleanup on exit
process.on('SIGINT', function() {
	console.log('\nexit, cleaning up...');
	clearInterval(intervalTimer);
	
	// Reset and release gpio port
	gpio22.reset();                
    	gpio22.unexport(function () {  
		console.log('...io 22 done...');	
		
		gpio27.reset();                
		gpio27.unexport(function () {  
			console.log('...io 27 done.');	
				
			gpio17.reset();                
			gpio17.unexport(function () {  
				console.log('...io 17 done.');	
					
				gpio18.reset();                
				gpio18.unexport(function () {  
					console.log('...io 18 done.');	
					
					// exit
					process.exit(0);						
				});					
			});
		});				
	});                     
});


