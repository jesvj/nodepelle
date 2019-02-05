const config = require('config');
// Use export NODE_ENV=config_sample before calling node pellemain.js

//console.log('chId: ' + config.get('ThingSpeak.channelId') + ', config.get('ThingSpeak.apiRead'): ' + config.get('ThingSpeak.apiRead') + 'config.get('ThingSpeak.apiWrite'): ' + config.get('ThingSpeak.apiWrite'))

var can = require('socketcan');
var fs = require('fs');
var channel = can.createRawChannel("can0", true);
var network = can.parseNetworkDescription("igneo.kcd");
var db_main = new can.DatabaseService(channel, network.buses["Main"]);

var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();



console.log('channelId  is ' + config.get('ThingSpeak.channelId'));

client.attachChannel(config.get('ThingSpeak.channelId'), { writeKey:config.get('ThingSpeak.apiWrite'), readKey:config.get('ThingSpeak.apiRead')}, function(err, resp)
{
    if (!err && resp > 0)
    {
        console.log('attached successfully. response was: ' + resp);
    }
});

// Log any message
//channel.addListener("onMessage", function(msg) { console.log(msg); } );

channel.start();

db_main.messages["FanSpeed"].signals["FanSpeed"].onChange(function(s) {
   console.log("FanSpeed " + s.value);
   client.updateChannel(config.get('ThingSpeak.channelId'), {field8: s.value}, function(err, resp)
   {
       if (!err && resp > 0)
       {
           console.log('update successfully. Entry number was: ' + resp);
       }
   });
});

db_main.messages["Temp1"].signals["BoilerTemp"].onChange(function(s) {
   console.log("BoilerTemp " + s.value);
});

db_main.messages["Feeder"].signals["FeederState"].onChange(function(s) {
   console.log("FeederState " + s.value);
});
