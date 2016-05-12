

class peerComm{
  constructor(host, serverPath, port, dataCallback){
    this.host = host;
    this.serverPath = serverPath;
    this.port = port;
    this.dataCallback = dataCallback;
    this.connectedPeers = {};
    this.clientId = "";
    this.isLeader = false;
    this.peer;
  }

  initializePeer(){
    var self = this;
    var peer = new Peer({
      // Set API key for cloud server (you don't need this if you're running your
      // own.
      // key: 'x7fwx2kavpy6tj4i',

      debug: 3, // Set highest debug level (log everything!).
      host: this.host,
      path: this.serverPath,
      port: this.port,

      // Set a logging function:
      logFunction: function() {
        //Where does the arguments call from?

        var copy = Array.prototype.slice.call(arguments).join(' ');
        $('.log').append(copy + '<br>');

        if(arguments.length > 2){
          try{
              if(arguments[2].type === 'REQUEST'){
                self.connectToPeer(arguments[2].src);
              }else if(arguments[2].type === 'LEADER'){
                self.initiateLeader();
              }
          }catch(e){
            console.log(arguments);
          }

        }
      }
    });

    // Show this peer's ID.
    peer.on('open', function(id){
      console.log("id: ",id);
      $('#pid').text(id);
      self.clientId = id;
      self.contactServer('url', JSON.stringify({type:'URL',url:window.location.href, id:id}));
    });

    // Await connections from others
    peer.on('connection', self.connect(this.dataCallback));

    peer.on('error', function(err) {
      console.log(err);
    })

    peer.on('url', function(url){
      console.log("peer getting url");
    });

    this.peer = peer;
  }//initializePeer

  ////////////////// helper functions //////////////////
  initiateLeader(){
    console.log("I AM A LEADER!");
    this.isLeader = true;
  }

  contactServer(type, message){
    //message should be a valid stringified JSON object
    //._socket is the webServerSocket peer is connected to
    this.peer.socket._socket.send(message);

    //** Native WebSocket DOES NOT have a function called emit
    //unlike a lot of socket libraries (socket.io)
    //Only available in send(), which is automatically typed to 'message'
    // peer.socket._socket.emit(type, message);
  };

  connectToPeer(requestedPeer){
    var self = this;
    if (!this.connectedPeers[requestedPeer]) {
      // Create a connection
      var c = this.peer.connect(requestedPeer, {
        label: 'data',
        serialization: 'none',
        metadata: {message: 'new connection!'}
      });
      c.on('open', function() {
        self.connect(self.dataCallback)(c);
      });
      c.on('error', function(err) { alert(err); });
    }
    this.connectedPeers[requestedPeer] = 1;
  }


  // Handle a connection object.
  // this method every time a message from a connection came
  connect(callback) {
    var self = this;
    function innerConnect(c){
      // Handle a chat connection.
      if (c.label === 'data') {
        // console.log(connectedPeers);
        c.on('data', function(data) {
          self.connectedPeers[c.peer] = 1;
          // console.log(data);
          data = JSON.parse(data);
          data.peer = c.peer;
          callback(data);
          if(self.isLeader){
            self.sendToPeersPrivate(data, self.connectedPeers, self.peer);
          }
            c.on('close', function() {
              // $('#received').append('<p>----'+c.peer+' disconnected -----</p>');
              // alert(c.peer + ' has left the chat.');
              delete self.connectedPeers[c.peer];
              return;
            });
        });
      }
      self.connectedPeers[c.peer] = 1;
    }
    return innerConnect;
  }


  //private - assume data is in JSON form
  sendToPeersPrivate(data, connectedPeers, peer){
    console.log("into sendToPeers", connectedPeers);
    var checkedIds = {};
    for(var pid in connectedPeers){
      if (!checkedIds[pid]) {
        var conns = peer.connections[pid];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var c = conns[i];
          if (c.label === 'data') {
            c.send(JSON.stringify(data));
          }
        }
      }
      checkedIds[pid] = 1;
    }
  }

  //PUBLIC - assume data is in JSON form
  sendToPeers(data){
    console.log("into sendToPeers | connectedPeers: ", this.connectedPeers);
    var checkedIds = {};
    for(var pid in this.connectedPeers){
      if (!checkedIds[pid]) {
        var conns = this.peer.connections[pid];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var c = conns[i];
          if (c.label === 'data') {
            c.send(JSON.stringify(data));
          }
        }
      }
      checkedIds[pid] = 1;
    }
  }

  //PUBLIC - close connection with a specific peer
  closeConnection(peerId){
    var conns = this.peer.connections[pid];
    if(conns){
      for (var i = 0, ii = conns.length; i < ii; i += 1) {
        var c = conns[i];
        c.close();
      }
    }
  }

  //PUBLIC - close connections with all peer
  closeAllConnection(){
    var checkedIds = {};
    for(pid in this.connectedPeers){
      if (!checkedIds[pid]) {
        var conns = this.peer.connections[pid];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var c = conns[i];
          c.close();
        }
      }
      checkedIds[pid] = 1;
    }
  }



}//end of class
