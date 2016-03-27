Last edited: Mar 26, 2016
Author: Michelle Suh

A simple working example of Peer-to-peer data communication using peer.js and a peer-server. The index.html is designed to connect to a localhost started with the sever.js file.

To run the server:
$node server.js

To run clients:
Open multiple index.html pages and try connecting using their IDs.



Todo:
1) Figure out how the sever can send messages to clients → clients can recognize specific keyword to recognize new connections
2) Connect all clients viewing the same page
3) Once (1) works, design for how to dynamically connect all clients for all arbitrary pages that clients connect to. Dynamic meaning for every new Nipype workflow page clients create, keep track of the clients connected to each page (not for the entire server. Just for that specific URL).
4) Keep a hash table mapping {domainName}-->{list of connected peers}. It only takes one peer to request a connection for the pair to be connected. Thus, the new connected client can request a connection to the list of connected peers, so that the live peers do not have to do anything for each new connection. There is no necessary action required for disconnection since disconnections are automatically recognized by connected peers.

March 26, 2016
Process in achieving Todos:
1) Check in self.initializePeer() what id.domain returns in a hosted server. It currently returns null in a localhost, but may return the actual URL of webpage when hosted on a server. Host on openshift (node server only, don't need a db) and connect to it's server's ip (Figure out how to find the server ip address).


Managing Concurrently modified data:
When there are a lot of concurrent inconsistent modifications on a data, somebody needs to manage and determine the order of modifications. Thus, The very first connection to some webpage will be assigned as the 'leader' of the peerGroup. Let peerGroup be defined as the peers connected to the same page. The leader determines the order of all data modification, simply by broadcasting to all peers the order in which the leader got the message. However by this definition, peer connection is not actually necessary, since the leader acts as a central control for the rest. Thus, two structural designs can be proposed: 1) Let a peer from each peerGroup act as a server to the rest, and maintain a simple control for the entire group for all concurrency decision. 2) Let all peers exchange data, and simply have a leader peer broadcast the correct order of data every once in a while.
If the leader of the group disconnects, the server will randomly determine the next leader. Thus, the server must always keep track of the leader of the peerGroup.


The data structure of communicating on workflow modification:
Because this framework is more for the general usage of peer-to-peer communication, it is best to simply send out the entire workflow data, rather than delving into the details of transmitting the specific modified information. The focus will be on designing and implementing a good general-purpose peer-to-peer simple framework, and optimizing for the data communication can be saved for another time.





asdf
