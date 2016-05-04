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
Open multiple index.html pages, and all peers accessing the same url
should automatically create a network of peerGroups
