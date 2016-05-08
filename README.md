public git repository for the general peer-to-peer real-time communication framework.

Author: Michelle Suh
email: michsuh1@gmail.com

1. peerServer
A node server that acts as a handshake center to connect the peers using this peer-to-peer real-time framework. This server is a modified version of the peerjs-server (https://github.com/peers/peerjs-server) offered by peerjs.com, to provide a more general-purpose peer-to-peer framework.

  How to try the peer-to-peer communication using peerServer:
  1. start the node server
    $npm start
  2. open as many example chat pages 'localhost:9000'
  3. Send messages to see how they communicate

2. slicedrop
An example application modified to incorporate this peer-to-peer framework, so that clients connected to the same url all receive the same real-time update of other clients. The original application is no longer used (https://github.com/slicedrop/slicedrop.github.com).

  How to try the peer-to-peer real-time communication of slicedrop:
  1. in peerServer, start the node server
  $npm start
  2. open index.html in slicedrop in two different tabs
  3. Open the 'Example_brain_file_T1.nii' example file in both tabs
  4. Play around with the UI, and see the real-time update
