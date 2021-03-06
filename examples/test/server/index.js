/**
 * Created by ticup on 08/03/14.
 */
var CloudTypes = require('../../../server/main.js');
var makeThings = require('./app');

var server = CloudTypes.createServer();
var port = process.env.PORT || 8080;

/* publish grocery cloudtypes through the http server */
makeThings(server).publish(port, __dirname + '/../../../');

console.log("#### CloudTypes Test Example server running on " + port + " ####");

console.log(server.state.auth.guest);
// server.state.print();
