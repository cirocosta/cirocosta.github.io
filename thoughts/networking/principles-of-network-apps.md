---
title: 'Principles of Network Applications'
author: Ciro S. Costa
date: Aug 19, 2015
---

When developing a new application we must write software that will run on multiple end system, but not software that will run on network core devices as there's not part of the application layer.

Remember the layers:

- application
- transport
- network
- link
- physical

An **application-layer protocol** defines how application's processes pass messages to each other.

It defines:
-   types of messages exchanged
-   syntax of the message
-   semantics of the fields
-   rules for determining responses and how to process input



## Process Communication

Processes on two differente end systems communicate with each other by exchanging messages across the computer network.

The process that initiates the communication is labeled as the client. The process that waits to be contacted to begin the session is the server.o

The interface that enables the possibility of sending messages to and from the network is called `socket`. It is the interface between the application layer and the transport layer within a host.


### Transport

The transport-layer protocol is the part that is reponsible of getting the messages to the socket of the receiveing process. The **reliability** of the transport depends on what protocol we choose (we might desire a **loss-tolerant** one).

Another requirement that the application might have is a specific throughput[1] - i.e., it might be a **bandwidth-sensitive** application - which could be controled by the transort layer. While bandwidth-sensitive apps have a specific throughput requirement, there are also those that adapt to what the network has to offer, they are the **elastic application**.


[1] *Throughtput*

:   the rate as which the senting process can deliver bits to the receiving process.

**Timing** is another guarantee that the transport layer might guarantee (a desired thing for realtime applications).

Last but not least, **security** may also be provided at this layer, for instance, by encrypting all data trnasmitted by the sending process and the receiving host. Data integrity and end-point authentication could also be provided.

*ps*: throughput and timing guarantees are not part of nowadays transport layers available on the internet. This must be done in an 'enhancement-manner' in the application side.



### Client-server architecture

There's an always-on host - the server - which services requests from many other hosts - clients-.

Clients do not communicate directly.

Server has a fixed, well-known address (ip address). This may be an virtual server (backed by a data center full of physical hosts).

### P2P

Relies in a minimal (or no) amount of dedicated servers. It exploits direct communication between pairs of intermittently connected hosts (peers).

It has almost by default self-scalability.

In some cases there's an hybrid architecture which combines both client-server and P2P elements (e.g, instant messaging applications).

In this context a process can be both a client and a server.

## Addressing

In order for a process running on one host to send packets to a process running on another, source and destination addresses must exist and consist of a tuple containg the address (ip address - 32bit if IPv4 or 128bit if IPv6) and an identifier that speicifies the receiveing process (port - 16bit).

## HTTP - Example of an Application Protocol

HTTP use TCP as underlying transport protocol.

1. The client initiates a TCP connection with the server.
2. the browser and server processes the TCP connection through their socket interfaces.

3. the client sends HTTP request messages into its socket interface and receives HTTP response messages from its socket interface.

  3.1. Because TCP provides reliable data transfer, HTTP need not to worry about lost data or the details of how TCP recovers from loss or reordering of data within the network.

*ps*.: HTTP is a **stateless protocol**.

The connection that was established may take one of two forms: **persistent** or **non-persistent**.

In the case of a non-persistent, for each request that is made there will be the overhead of initiating a 3-step handshake and the 4-step FIN at the end (2 RTT till the user sees something). After the browser fetched the `.html` containing a bunch of image sources, it has to start fetching those images. In the non-persistent case the browser will be forced to set up 10 entirely new connections (remembering that there's a limit of 6 parallel connections for browsers).


*Round-Trip Time (RTT)*

:   Corresponds to the time it takes for a small packet to travel from client to server and then back to client, including packet-propagation delays, packet-queuing delays in intermediate routers and switches, and packet-processing delays. (see section 1.4)

More than just the RTT that must be considered, one might also want to care about TCP buffers that must be allocated as well as TCP variables representing connection state.

With a persistent connection subsequent requests and responses between the same client and server can be sent over the same connection.

// TODO see more about pipelining


*Web Cache*

:   also called a proxy server, is a network entity that satisfies HTTP requests on behalf of an origin Web server. It has its own dist storage and keeps copies of recently requested objects in this storage.


## FTP - File Transfer Protocol


FTP uses two parallel TCP connections to transfer a file: a **control connection** and a **data connection**. FTP is said to send its control information **out-of-band**. Because HTTP sends header lines into the same TCP connection that carries the transferred file itself, it's said to be **in-band**. It keeps the control connection during the session but it opens and closes data connections as files are meant to be sent.

**control connection** is user for sending control infos (uid, password, commands ...). Generally, *port 21*;

**data connection** send files. Generally *port 20*.

1. FTP *client initiates a control TCP connection on port 21*. The user provides the hostname of the remote host
2. the user provides the user ID and PSWD, sending it over the TCP control connection. Now the server must maintain state about the user.
3. after authorization, user issues commands. A file transfer command is sent.
4. The *server side initiates a TCP data connection to the client side (from port 20)*.
5. FTP sends 1 file and closes the data connection. If during the session the user wants to transfer another file, another data connection is openned from the server.

Existem dois modos de transferência de arquivo:
-   ativo: o servidor conecta numa porta alta do cliente vindo da porta 20 (tcp) e inicia a transferencia de arquivos

-   passivo: o cliente especifica uma porta alta e conecta em outra porta alta de servidor

> (man ftp) "-p" uses passive mode for data transfers. Allows use of ftp in environments where firewall prevnts connections from the ouside world back to the client machine. (requires that the ftp server support the PASV command).


## EMAIL - STMP

Email is an asynchronous communication medium. At its core is there is the application protocol: Simple Mail Transfer Protocol (SMTP). It uses persistent TCP as the transfer service to transfer mail from server to server.

SMTP has two sides: a client side (executed on the sender's mail server) and a server side (executed on the recipient's mail server). Both the client and server sides of SMTP run on every mail server.

Mail servers form the core of the email infrastructure, containing mailboxes that retains user's messages.

Beucase it is such an old protocol (first RFC dates 1982) some archaic 'features' remain, like the restriction that the body (not just the headers) of all mail messages to be simple 7-bit ASCII (making life difficult for binary multimedia data - encoding has a big place here).

It's important to notice that there are no intermediate mail servers for sending mails. That means that servers establish direct TCP connections. If the server-side server is down, the message remains in the client's mail server and waits for a new attempt.

1. client SMTP establishes a TCP connection to port 25 at the server. If down, try again. Connection is established.

2. Application-layer handshaking between client and server (indicates email address of sender and email address of recipient).

3. Client sends the message thorugh the TCP connection, repeating the process over the same TCP connection if it has other messages to send to the server;

4. Server receives the messages and puts them at the corresponding mailboxes.

5. connection ends.

Notice that, in comparison to HTTP:

- HTTP is a **pull protocol** (nowadays, also a push ... )
- **SMTP is primary a push protocoll**

Somewhat like HTTP, mail clients also specify headers in the content of the message (well specified in the RFC).

### Mail Access

As in nowadays applications there's no need anymore for logging into the mail server and querying the message directly (manually, no SMTP - SMTP is a push protocol), a client-server architecture for reading emails with a client emerged. There's also no need for setting a server in the personal computer and keep it connected all the time to the internet so that another mail servers can reach it.

1. The user agent uses SMTP to push the email message into my email server

2. My email server uses SMTP (as a client) to relay the message to my friend's mail server (if it can't reach, it tries latter, even if my computer is off - the server is always on).

3. My friend uses a pull protocol to obtain the message (commonly POP3 - Post Office Protocol v3 -, IMAP - Internet Mail Access Protocol - or HTTP).

// TODO check how POP3 and IMAP work.



