
$(document).ready(function() {

  var peerCom = new peerComm("localhost", "/peerServer", 9000, dataCallback);
  peerCom.initializePeer();

  function dataCallback(data){
    $('#received').append('<p>'+data.peer+' :  ' + data.data + '</p>');
  }

  // // Example: Connect to a peer
  // $('#connect').click(function() {
  //   var requestedPeer = $('#rid').val();
  //   peerCom.connectToPeer(requestedPeer);
  //
  // });
  //
  // // Example:  of closing connection.
  // $('#close').click(function() {
  //   peerCom.closeAllConnection();
  // });

  $('#send').submit(function(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    $('#received').append('<p class="you">You :  ' + msg + '</p>');
    peerCom.sendToPeers({type:'text' , data: msg});
    $('#text').val('');
    $('#text').focus();
  });

  // Show browser version
  $('#browsers').text(navigator.userAgent);
});

// Make sure things clean up properly.
window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};
