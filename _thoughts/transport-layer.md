---
title: tcp
author: ciro
date: 16 Sep, 2015
description: ''
tags: [networking, transport]
published: false
---

*Transport Layer*

:   has the role of providing **logical communication** (illusion of a direct connection) **between application processes** on different hosts. Such layer is capable of abstracting the details of the physical infrastructure.

    Implemented on the edge ("smart part"), not at the core ("dumb").

When **sending** a message, transport layer converts it into tranport-layer packets (*segments*). Breaks the message (if necessary) into smaller chunks and adds tranport-layer header to each chunk.

Segments are passed to the network layer, now encapsulated within a network-layer packet (*datagram*), now being actually sent to the destination. These headers added at the network layer are all what the "dumb" part of the network reads (those routers).

The inverse process goes at the receiving side.

```
  application : message
  transport   : segment
  network     : datagram
```

The layer just below, the **network layer** (which uses IP protocol in the case of the internet), provides the **logical communication between hosts** (not processes), which, on the internet, are addressed by IP addresses.

The difference may be explicited using the letters example (//TODO).

**IP** provides an **unreliable service** which works in a best-effort delivery service model. It provides no guarantees that packets will:
-   reach their destiny.
-   will get there in the order they were sent
-   in an integral manner

The transport layer aims at extending the host-to-host service (provided by the network layer) to a process-to-process service (aka **transport-layer multiplexing and demultiplexing**).

## Multiplexing and Demultiplexing

After datagrams reached the networking card of the host, these datagrams turn into segments and must now be delivered to the appropriate process (actually, to the appropriate socket - remembering that a process can have more than one socket open at a given time).

*Demultiplexing*

:   is the process of delivering the data in a transport-layer segment to the correct socket


*Multiplexing*

:   is the process gathering of data chunks at the source host from different sockets, encapsulating each data chunk with header info, creating segments and then passing those to the network layer

( //TODO analogy of mixing letters)
// TODO relate this to http2 (app layer) multiplexing

```
|--------32 bits--------|
|src port  |  dest port |
|-----------------------|
| other header fields   |
|-----------------------|
|   app data (message)  |
|-----------------------|

note: no dest and src addr here. The transport
      layer doesn't need these info as this is
      not its concern.
```

### Connectionless Multiplexing and Demultiplexing

Differently from the connection-oriented case where sockets are identified by a 4-tuple, in the case of a connectionless there's the need of only a 2-tuple (dest-IP and dest-PORT). When the host receives the UDP segment it just has to verify the number of the port specified in the tranport segment and then redirect the segment to the process that's bound to that port.

Note that this doesn't mean the the segment won't or can't have `source` fields as well; they actually have (and are necessary if the receiver wants to send back another message). What matters it that two packages with different source fields will be delivered to the same socket.


### Connection-Oriented Multiplex and Demultiplex

TCP socket is identified by a 4-tuple. When a TCP segment arrives from the network to a host, the host uses all four values to direct (demultiplex) the segment to the appropriate socket. Two arriving sockets with different source IP addr or source port numbers will be directed to different sockets.


## UDP

**UDP** provides only two services: *process-to-process data delivery* and *error checking* (through a header field); UDP remains as an unrealiable service.

UDP sockets are fully identified by a **two-tuple** consisting of a **destination IP address and a destination port number**.

This is important because if two segments have different source ip addr and/or port numbers, then the two segments will be directed to the same destination process via the same destination socket (see [#multiplexing-and-demultiplexing](#multiplexing).

As with UDP there's no handshaking between sending and receiving, and no connection keeping established, it is said to be **connectionless**.

Applications might use UDP because:
-   it can provide finer application-level control over what data is sent, and when; there's almost and immediate segment send of data (no congestion control mechanism, as well as a resend mechanism).
-   has no connection establishment.
-   no connection state (so, no send buffers, congestion control parameters, sequence and acks numbers).
-   small packet header overhead (8 bytes for udp against 20 for tcp).

Note that because there's no congestion control the use of UDP is somewhat controversial.

ps.: DNS runs over UDP not just for the RTT, but also because it avoids TCP's the congestion-control mechanism and can probably have more success in a stressed state of the network, while a TCP connection would be stopped with the congestion control mechanism.

ps.: UDP is also used w/ SNMP (Simple Network Management Protocol), an application-layer protocol for managing devices on IP networks. The rationale is that by using UDP it aims to be very performant and minimize the additional load on a potentially troubles network. In such case TCP would probably not allow the request to go immediately because of its congestion control mechanism.


```
|--------32 bits--------|
| src port |  dest port |
|-----------------------|
|  length  |  checksum  |
|-----------------------|
|   app data (message)  |
|-----------------------|

length  : header + data size of the segment
checksum: used by receiving host to check whether
          errors have been introduced.
```

The checksum is calculated in a very simple manner: sum all of the 16bit words in the segment, then calculate the 1's-segment. This is the checksum. At the receiver side, sum all of the received to the checksum. The result must be `1111111111111111`. Otherwise, an error happened.

# Reliable Data Transfer

No transfered data bits are corrupted or lost and all are delivered in the order in which they were sent. Such abstraction must be implemented by the **reliable data transfer protocol** on top of an unrekiable layer.

## rdt1.0 - A rdt protocol over a reliable channel

// TODO


## rdt2.0 - A rdt protocol over a channel with bit errors

ARQ: Automatic Repeat reQuest protocols.

Requires:
-   error detection
-   receiver feedback
-   retransmissio


## TCP

TCP sockets are fully identifiable now with **four-tuples** (src IP addr, src PORT, dest IP, dest port).

In this case, when 2 tcp segments arrives from the network, if there's a different source port, for example, a different socket will be used (as the four values matter).

For each connection a listening (passive) socket on the server accepts a new socket is generated for the 4-value tuple that is formed.

(ps.: because there's this need for having a passive socket listening on a port there's the possibility of performing port scanning - using `nmap` on linux, e.g. - and then exploiting a security flaw of a service that is known to be compromised, eg: `nmap -A -T4 www.apontador.com.br`)

### Naggle's algorithm

> Nagle's algorithm works by combining a number of small outgoing messages, and sending them all at once. Specifically, as long as there is a sent packet for which the sender has received no acknowledgment, the sender should keep buffering its output until it has a full packet's worth of output, so that output can be sent all at once.


// TODO
- see [Naggles Algorithm](https://en.wikipedia.org/wiki/Nagle's_algorithm)
- see [TCP Performance problems caused by interaction between Nagle’s Algorithm and Delayed ACK](http://www.stuartcheshire.org/papers/NagleDelayedAck/)


