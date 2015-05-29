var http = require('http');
var ipConfig = require('../../config/ipConfig.js');

var hostname = "dynupdate.no-ip.com";
var path = "/nic/update";
var userAgent = "";

var params = "hostname="+ipConfig.domain;

var headers = {
	"User-Agent": "MDMA Update Agent AWS/1.0 "+ipConfig.adminMail,
	"Authorization": "Basic " + ipConfig.base64auth
};

// Todo https ???

var updateIp = function() {
	var options = {
		hostname: hostname,
		method: 'GET',
		headers: headers
	};
	
	var hostIp;

	var trueReqFct = function() {
		options.path = path+'?'+params;
		
		//console.log("Requesting "+options.path);
		var req = http.request(options, function(res) {
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
				  var resultTrue = chunk.split(' ');
				  if(resultTrue[0] === "good") {
					  hostIp = resultTrue[1];
					  console.log("Request successful");
					  console.log("Host ip : " + hostIp);
					  // todo return promise
				  }
				  else {
					  console.log("Error while updating IP (true step)", resultTrue);
				  }
				
			  });
		});
		req.end();
	};
	
	var i = 1;
	var fakeReqFct = function() {
		options.path = path+'?'+params + "&myip=1.1.1." + i;
		
		//console.log("Requesting "+options.path);
		var req = http.request(options, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			  //console.log(chunk);
			  var resultFake = chunk.split(' ');
			  if(resultFake[0] === "good") {
				  trueReqFct();
			  }
			  else if(resultFake[0] === "nochg") {
				  i++;
				  fakeReqFct();
			  }
			  else {
				  console.log("Error while updating IP (fake step)");
			  }
		  });
		});
		req.end();
	};
	
	console.log("Querying No-ip to set and get current host ip...");
	fakeReqFct();
};

module.exports = {
	updateIp: updateIp
};
