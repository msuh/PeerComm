var http = require('http');
var express = require('express');
var path = require('path');
var ExpressPeerServer = require('peer').ExpressPeerServer;
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
        self.connectionStatus = {};

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
        self.app.use(bodyParser.json());
        self.app.use(bodyParser.urlencoded({extended: true}));
        self.app.use(cookieParser());
        var routes = require('./routes/index');
        self.app.use('/', routes);
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        // self.createRoutes();

        self.server = http.createServer(self.app);
        self.initializePeer();
    };

    self.initializePeer = function(){
    	var options = {
        debug: true
  		}

  		var peerServer = ExpressPeerServer(self.server, options);
  		self.app.use('/', peerServer);

      //id peer with new connection
  		peerServer.on("connection",function(newId){
        //peerjs-server/lib/index.js
        var peers = peerServer._clients['peerjs'];
        for(var id in peers){
          if(id === newId){
            continue;
          }
          console.log(id);
          // console.log("socket - ",peers[id]['socket']);

          var serverMessage = {
            src : newId,
            type: 'OFFER',
            payload: {
              type: 'data',
              // connectionId: newId, --> automatically set by DataConnection()
              label: 'data',
              serialization: 'none',
              reliable: false,
              browser: 'Chrome' //taken from l.262 in peerjs/dist/peer.js this._peerBrowser = payload.browser;
            }
          }
          //peerjs defined sockets
          peers[id]['socket'].send(JSON.stringify(serverMessage));
        }
        // { peerjs:
        //  { '29xdofpb34k7qfr0':
        //     { token: '4wr56k5alftmfxtywu9ykfbt9',
        //       ip: '127.0.0.1',
        //       res: [Object],
        //       socket: [Object] },
        //    nhvfmj5khk9be290:
        //     { token: 'k5if1yd15zus76cudenv4e7b9',
        //       ip: '127.0.0.1',
        //       socket: [Object] } } }

  			// console.log(peerServer._outstanding);


  			//this seems to be the indicator of the domain..?
  			// console.log(id.domain);
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
