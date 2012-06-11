var cfg = require("./config").cfg;
var fb = require('./node-firebird/lib/index.js');
var util = require('util');
var events = require('events');
var http = require('http');

var con =  new fb.Database('127.0.0.1', 3050, cfg.db, cfg.user, cfg.password, 
    function(){
    
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    
    function doReq(){

    con.execute("select * from test", function(rs){
    
    res.write('[');
    rs.data.forEach(function(r){
     res.write(JSON.stringify(r)+',');
    });
    res.end(']');

    
    },function(err){ console.log(err);});
    }
    doReq();
    
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');

});

process.on('exit',function(){
   con.detach();
});