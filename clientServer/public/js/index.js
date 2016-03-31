
var peer = new Peer({
  // Set API key for cloud server (you don't need this if you're running your
  // own.
  // key: 'x7fwx2kavpy6tj4i',

  debug: 3, // Set highest debug level (log everything!).
  host: "localhost",
  port: 9000,

  // Set a logging function:
  logFunction: function() {
    //Where does the arguments call from?

    var copy = Array.prototype.slice.call(arguments).join(' ');
    $('.log').append(copy + '<br>');

    if(arguments[0]=="Invalid server message"){
        // console.log(JSON.parse(arguments[1]));
    }
    if(arguments.length > 2){
      try{
          if(arguments[2].type === 'REQUEST'){
            connectToPeer(arguments[2].src);
          }else if(arguments[2].type === 'LEADER'){
            //code for making this peer a leader
          }
      }catch(e){
        console.log(arguments);
      }

    }
  }
});

var connectedPeers = {};
var clientId = "";

// Show this peer's ID.
peer.on('open', function(id){
  console.log("id: ",id);
  console.log("peer.options: ",peer.options);
  $('#pid').text(id);
  clientId = id;
});

// Await connections from others
peer.on('connection', connect);

peer.on('error', function(err) {
  console.log(err);
})

////////////////// helper functions //////////////////
function connectToPeer(requestedPeer){
  if (!connectedPeers[requestedPeer]) {
    // Create a connection
    var c = peer.connect(requestedPeer, {
      label: 'data',
      serialization: 'none',
      metadata: {message: 'new connection!'}
    });
    c.on('open', function() {
      connect(c);
    });
    c.on('error', function(err) { alert(err); });
  }
  connectedPeers[requestedPeer] = 1;
}
// Handle a connection object.
function connect(c) {
  console.log("connect:",c);
  // Handle a chat connection.
  if (c.label === 'data') {
    c.on('data', function(data) {
      console.log("data: ",data);
        c.on('close', function() {
          alert(c.peer + ' has left the chat.');
          console.log("close: ",close);
          delete connectedPeers[c.peer];
          return;
        });
    });
  }
  connectedPeers[c.peer] = 1;
}

$(document).ready(function() {
  // Connect to a peer
  $('#connect').click(function() {
    var requestedPeer = $('#rid').val();
    connectToPeer(requestedPeer);
    // if (!connectedPeers[requestedPeer]) {
      // Create a connection
      connectToPeer(requestedPeer);
    //   var c = peer.connect(requestedPeer, {
    //     label: 'data',
    //     serialization: 'none',
    //     metadata: {message: 'new connection!'}
    //   });
    //   c.on('open', function() {
    //     connect(c);
    //   });
    //   c.on('error', function(err) { alert(err); });
    // }
    // connectedPeers[requestedPeer] = 1;
  });

  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  // Send a message to all active connections.
  $('#send').submit(function(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    eachActiveConnection(function(c, $c) {
      console.log("c: ",c);
      if (c.label === 'data') {
        c.send(msg);
        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
          + '</div>');
      }
    });
    $('#text').val('');
    $('#text').focus();
  });

  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
  var checkedIds = {};
    for(pid in connectedPeers){
      if (!checkedIds[pid]) {
        var conns = peer.connections[pid];
        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }
      checkedIds[pid] = 1;
    }

  }

  // Show browser version
  $('#browsers').text(navigator.userAgent);
});

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};
