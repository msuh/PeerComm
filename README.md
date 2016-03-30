public git repository for the peer-to-peer real time workflow editing for Nipype


Managing Concurrently modified data:


When there are a lot of concurrent inconsistent modifications on a data, somebody needs to manage and determine the order of modifications. Thus, The very first connection to some webpage will be assigned as the 'leader' of the peerGroup. Let peerGroup be defined as the peers connected to the same page. The leader determines the order of all data modification, simply by broadcasting to all peers the order in which the leader got the message. However by this definition, peer connection is not actually necessary, since the leader acts as a central control for the rest. Thus, two structural designs can be proposed: 1) Let a peer from each peerGroup act as a server to the rest, and maintain a simple control for the entire group for all concurrency decision. 2) Let all peers exchange data, and simply have a leader peer broadcast the correct order of data every once in a while.
If the leader of the group disconnects, the server will randomly determine the next leader. Thus, the server must always keep track of the leader of the peerGroup.


The data structure of communicating on workflow modification:
Because this framework is more for the general usage of peer-to-peer communication, it is best to simply send out the entire workflow data, rather than delving into the details of transmitting the specific modified information. The focus will be on designing and implementing a good general-purpose peer-to-peer simple framework, and optimizing for the data communication can be saved for another time.
