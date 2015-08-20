---
title: 'An Echo server'
author: Ciro S. Costa
date: Aug 20, 2015
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

As stated in other article, to perform the IO we first need to create the door from our computer to the outer internet: the socket. `socket(family, type, protocol) --> sock_descriptor`

A connection to another socket must be made. We achieve that with `connect(sockfd, server_addr, addrlen)` call. It's interesting to notice that `connect` does not require a call to `bind` even though it will happen a port binding under the hood - the kernel will be the responsible for choosing an ephemeral port and the source IP address. At this point the three-wray handshake will be initiated with the sending of the SYN package (supposing that we are under a TCP & SOCK_STREAM socket. If we were running w/ SOCK_DGRAM w/ UDP there would be no handshake as UDP is connectionless, as stated before - it would just specify the address to send datagrams to).

Some very common errors may occur here. Two hard errors and a soft one, respectively:

-   TCP receives no response to the connection (no SYN ACK back to SYN) - ETIMEDOUT;

-   TCP gives us an RST (type of TCP segment indicating that something is wrong in the connection - three conditions generate this: SYN arriving for a port that has no listening server; TCP wanting to abort the connection; TCP receiving a segment for a connection that does not exist) - ECONNREFUSED;

-   Client's SYN elicits an ICMP "destination unreachable" from some intermediate router (the client error then saves the message and keeps sending SYNs with the same time between each as in the first scenario. In case of no response after a fixed amount of time the saved ICMP is returned to the process as either EHOSTUNREACH or ENETUNREACH).


Once connected, data may be transferred.
