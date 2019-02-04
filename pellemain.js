var can = require('socketcan');
var fs = require('fs');

var channel = can.createRawChannel("can0", true);

var network = can.parseNetworkDescription("igneo.kcd");


var db_main = new can.DatabaseService(channel, network.buses["Main"]);

// Log any message
//channel.addListener("onMessage", function(msg) { console.log(msg); } );

channel.start();

db_main.messages["FanSpeed"].signals["FanSpeed"].onChange(function(s) {
   console.log("FanSpeed " + s.value);
});

db_main.messages["Temp1"].signals["BoilerTemp"].onChange(function(s) {
   console.log("BoilerTemp " + s.value);
});

db_main.messages["Feeder"].signals["FeederState"].onChange(function(s) {
   console.log("FeederState " + s.value);
});
