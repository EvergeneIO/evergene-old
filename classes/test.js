const Endpoint = require('./Endpoint');
const UserEndpoint = require("./UserEndpoint");
const Log = require('./Log');

new UserEndpoint({}, function() {
    console.log("runned!");
},"1234", ["1","2","3"]);