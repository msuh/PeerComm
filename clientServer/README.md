Last edited: Mar 29, 2016
Author: Michelle Suh

ClientServer Model

1. Traditional Server - Client Server
TS chooses a client to host as a server for each peerGroup. The assigned ClientServer typically will be the first client viewing a page. In case of Client Server disconnection, randomly assign another client as the server. (Server and client code should probably reside in client-side and be triggered when indicated by TS)

2. Traditional Server - Clients
All clients connecting to a webpage should handshake with the TS to inform its existence. The client will be given the path to Client Server (or the id of client server) from the TS to connect.

3. Client Server - Clients
This is where all transmissions happen. For every new data from clients, it should be transmitted to the Client Server. The Client Server will then broadcast to all clients connecting to the network.


To run the server:
$node server.js

To run clients:
Open multiple index.html pages and try connecting using their IDs.


-------------------------------
Data structure for a message from server to peer through WebSocket as defined in PeerJs in github.com/peerjs/dist/peerjs:


*Peer will automatically create a new connection for type OFFER from server with a peerId in payload.connectionId*
ASSUMPTION: all browsers are using Chrome. Have not tested what problems there are with other browsers.

{
  src : newId,
  type: OPEN/ERROR/ID-TAKEN/INVALID-KEY/LEAVE/EXPIRE/OFFER
  payload: {
    type: 'data/media',
    label: 'data',
    serialization: 'none',
    reliable: false,
    browser: 'Chrome'
  }
}

!!Current Problem: onnegotiationneeded (in peerjs/dist/peer.js) is not getting triggered to form the connection. Thought setting browser to Chrome was enough, but apperently not.

Todo:
X 1) Figure out how the sever can send messages to clients → clients can recognize specific keyword to recognize new connections
2) Connect all clients viewing the same page
3) Once (1) works, design for how to dynamically connect all clients for all arbitrary pages that clients connect to. Dynamic meaning for every new Nipype workflow page clients create, keep track of the clients connected to each page (not for the entire server. Just for that specific URL).
4) Keep a hash table mapping {domainName}-->{list of connected peers}. It only takes one peer to request a connection for the pair to be connected. Thus, the new connected client can request a connection to the list of connected peers, so that the live peers do not have to do anything for each new connection. There is no necessary action required for disconnection since disconnections are automatically recognized by connected peers.

March 26, 2016
Process in achieving Todos:
1) Check in self.initializePeer() what id.domain returns in a hosted server. It currently returns null in a localhost, but may return the actual URL of webpage when hosted on a server. Host on openshift (node server only, don't need a db) and connect to it's server's ip (Figure out how to find the server ip address).
