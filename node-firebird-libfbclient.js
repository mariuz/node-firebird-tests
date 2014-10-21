var cfg = require("./config").cfg;
var fb = require('firebird');
var util = require('util');
var events = require('events');

var http = require('http');

var con = fb.createConnection();
    con.connectSync(cfg.db, cfg.user, cfg.password, cfg.role);
    

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    
    function doTr(){
     if(!con.inTransaction){
          con.startTransaction(doTr);
          return;
     }     
     con.query('select * from test',function(err,rs){
     var rows = rs.fetchSync("all",false); 
     con.commit();
     
     res.write('[');
     rows.forEach(function(r){
     res.write(JSON.stringify(r)+',');
     });
     res.end(']');
    });    
    }

    doTr();
    
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');

process.on('exit',function(){
   con.disconnect();
});
