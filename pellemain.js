const config = require('config');
const https = require('https');
// Use export NODE_ENV=config_sample before calling node pellemain.js


var can = require('socketcan');
var fs = require('fs');
var channel = can.createRawChannel("can0", true);
var network = can.parseNetworkDescription("igneo.kcd");
var db_main = new can.DatabaseService(channel, network.buses["Main"]);

let tempCalc = require('./temperature')

var apiReadKey = config.get('ThingSpeak.apiRead').trim();
var apiWriteKey = config.get('ThingSpeak.apiWrite').trim();
var channelId = config.get('ThingSpeak.channelId').trim();


console.log('channelId  is ' + channelId +  ', apiReadKey:' + apiReadKey + ', apiWriteKey:' + apiWriteKey );

// Log any message, comment in for debugging etc
//channel.addListener("onMessage", function(msg) { console.log(msg); } );

channel.start();

db_main.messages["FanSpeed"].signals["FanSpeed"].onChange(function(s)
  {
    console.log("FanSpeed " + s.value);
    sendDataTS(channelId, "field8", apiWriteKey, s.value);
  });

db_main.messages["Temp1"].signals["BoilerTemp"].onUpdate(function(s) {
  temperature = tempCalc.temp('CT2a', s.value);
  console.log("BoilerTemp " + temperature);
});

db_main.messages["Feeder"].signals["FeederState"].onChange(function(s) {
   console.log("FeederState " + s.value);
});

function sendDataTS(chId, fieldId, apiWriteKey, val)
{
    try
    {
        https.get('https://api.thingspeak.com/update.json?api_key' + '=' + apiWriteKey + '&' + fieldId + '=' +  val);
    }
    catch(err)
    {
        console.log(err.message);
    }

}
