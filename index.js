
var dgram = require('dgram');
var byline = require('byline');
var commandLineArgs = require('command-line-args')
var faker = require('faker');



const optionDefinitions = [
    { name: 'fake', alias: 'f', type: Boolean },
    { name: 'host', alias:'h', type: String },
    { name: 'port', alias: 'p', type: Number },
    { name: 'channel', alias:'c', type:String, defaultOption:true}
]

const options = commandLineArgs(optionDefinitions)


if (!options.channel){
    options.channel = faker.hacker.adjective() + '-' + faker.hacker.noun() + '-' + faker.hacker.verb()
}

console.log(options)

var PORT = options.port || 41234;
var HOST = options.host || '127.0.0.1';

process.stdin.resume();
process.stdin.setEncoding('utf8');

var stream = byline(process.stdin);
var client = dgram.createSocket('udp4');

stream.on('data', function(line) {
    const mess_json = {'channel':options.channel,'line':line,'timestamp':Date.now()}
    const mess = new Buffer(JSON.stringify(mess_json));
 
    client.send(mess, 0, mess.length, PORT, HOST, function(err, bytes) {
        if (err) throw err;
     });
  });

process.stdin.on('end', function() {
    console.log('END')
    client.close();
});
