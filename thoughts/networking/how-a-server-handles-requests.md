---
title: 'How a server handles requests'
author: Ciro S. Costa
date: Aug 20, 2015
tags: [networking, servers]
description: ''
published: false
---

TCP Server:

```
socket() -> bind() -> listen() -> accept() -- .. blocks -->
loop(read() -> ... read () -> ....) -> write() -> close()
```

Client:

```
socket() -> connect() -> loop(
  loop(write() -> ... -> write()) -> loop(read() -> ... -> read())) ->
close()
```

As stated in other article, to perform the IO we first need to create the door from our computer to the outer internet: the server's and client's **socket** (one for each).

```
socket(family, type, protocol) --> sock_descriptor
```

Such function call creates an endpoint for communication and returns a descriptor. In both cases (client and server) an active socket is created.

In the client side, a **connection** to another socket must be made (active open). We achieve that with `connect(sockfd, server_addr, addrlen)` call, which is reponsible for moving the socket CLOSED state to the SYN_SENT state (and on succes, to ESTABLISHED state). It's interesting to notice that `connect` does not require a call to `bind` (remember, client-side) even though it will happen a port binding under the hood - the kernel will be the responsible for choosing an ephemeral port and the source IP address. At this point the three-wray handshake will be initiated with the sending of the SYN package (supposing that we are under a TCP & SOCK_STREAM socket; if we were running with SOCK_DGRAM on UDP there would be no handshake as UDP is connectionless, as stated before - it would just specify the address to send datagrams to).

Some very common errors may occur here. Two hard errors and a soft one, respectively:

-   TCP receives no response to the connection (no SYN ACK back to SYN) - ETIMEDOUT;

-   TCP gives us an RST (type of TCP segment indicating that something is wrong in the connection - three conditions generate this: SYN arriving for a port that has no listening server; TCP wanting to abort the connection; TCP receiving a segment for a connection that does not exist) - ECONNREFUSED;

-   Client's SYN elicits an ICMP "destination unreachable" from some intermediate router (the client error then saves the message and keeps sending SYNs with the same time between each as in the first scenario. In case of no response after a fixed amount of time the saved ICMP is returned to the process as either EHOSTUNREACH or ENETUNREACH).


Once connected, data may be transferred. But, on the server side, the program must attach it so a specified port so that incoming requests are directed to it. It needs to **bind** first (`bind(sockfd, struct sockaddr* my_addr, addrlen)`). This step consists simply of an assignment of a local protocol address (which contains the port) to a socket. This address might consist of a chosen IP addres or a wildcard, while the port might consist of a well defined or an ephemeral port (decided by the OS - range 49152 to 65535).

Just like with `connect`, errors might happen here, specially EADDRINUSE;

// TODO talk more about bind errors

After the server binds its process to a port and address, it must convert its socket type (currently active) to a passive socket. **listen** (`listen(int sockfd, int backlog)`) is the function that is responsible for converting an unconnected socket (i.e, an active  socket previously created w/ `socket()`) into a passive socket, indicating that the kernel should accept incomming connection requests directed to this socket. It moves the socket from the `CLOSED` state to the `LISTEN` state.

For a given passive socket, the kernel maintains two queues that enqueues connections based on their states. The sum of both queues cannot exceed the backlog parameter:

-   an incomplete connection queue, maintaining an entry for each `SYN` that has arrived from a client for which the server is awaiting completition of the handshake (SYN_RCVD state) and

-   a completed connection queue, containing an entry for each client with whom the TCP has completed the handshake(sockets are in the ESTABLISHED state).


Now that it's ready to receive connection, With **accept** the TCP server is capable then of returning the next completed connection from the front of the completed connection queue with the information of the client address. On success it returns a brand-new descriptor created by the kernel, which refers to the TCP connection with the client.



