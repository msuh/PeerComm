var http = require('http');
var express = require('express');
var path = require('path');
// var ExpressPeerServer = require('peer').ExpressPeerServer;
var ExpressPeerServer = require('./lib/peerServer').ExpressPeerServer; //contains my modified code
// var EventEmitter = require('eventemitter3');
// var bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser');
// var session = require('express-session');
// var mongo = require('mongodb');
// var mongoose = require('mongoose');
// var connection_string = 'mongodb://localhost/interviews';

var Server = function() {
    var self = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = "127.0.0.1";
        self.port      = 9000;

        console.log("IP address: ",self.ipaddress,":",self.port);
    };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating server ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        // self.app.use(bodyParser.json());
        // self.app.use(bodyParser.urlencoded({extended: true}));
        // self.app.use(cookieParser());
        var routes = require('./routes/index');
        self.app.use('/', routes);


    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();

        self.server = http.createServer(self.app);
        self.initializePeer();
    };

    self.initializePeer = function(){
    	var options = {
        debug: true
  		}

  		var peerServer = ExpressPeerServer(self.server, options);
  		self.app.use('/peerServer', peerServer);

      //id peer with new connection
  		peerServer.on("connection",function(newId){

        //// ** to connect to all peers in url
        //// loop through each id connected to the url of newId

        // for(var connId in peers){
        //   if(connId === newId){
        //     continue;
        //   }
        //
        //   var serverMessage = peerServer.formServerMessage('REQUEST',newId,{});
        //
        //   try{
        //     //peerjs defined sockets
        //     if(peers[connId].socket){
        //         peers[connId].socket.send(JSON.stringify(serverMessage));
        //     }else if(peers[connId].res){
        //       peers[connId].res.write(JSON.stringify(serverMessage));
        //     }else{
        //       //peer with id disconnected during the loop?
        //       console.log("Peer dead");
        //     }
        //   }catch (e) { //taken from peerjs-sever/lib/server.js
        //     console.log(e);
        //   }
        // }

  			// console.log(peerServer._outstanding);
  		});

  		self.server.on('disconnect', function(id) {
  		});
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
    	self.app = express();
      self.setupVariables();
      self.setupTerminationHandlers();
      self.initializeServer();

      self.app.set('views', path.join(__dirname, 'views'));
  		self.app.set('view engine', 'ejs');
  		self.app.use(express.static(path.join(__dirname, 'public')));
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.server.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};





/************* Main **************/
var s = new Server();
s.initialize();
s.start();
