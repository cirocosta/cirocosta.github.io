---
title: 'Tcp Fast Open'
author: Ciro S. Costa
date: 29 Sep, 2015
---

Experimental TCP mechanism documented at [RFC7413](https://datatracker.ietf.org/doc/rfc7413/) under experimental status as of December 2014. It aims at reducing by 1 RTT the time to first byte. The mechanism achieves so by allowing data to be carried during the 3WHS phase: in the SYN (when requesting) and SYN-ACK (when responsing) packets and consumed by the receiving end during initial connection handshake.

As TFO introduces different semantics in the TCP mechanism it MUST NOT BE the default (as applications might expect the common before).

The process of TFO is separated in 2 phases: request and usage.

The *request* for TFOs goes like this:

1. Client sends a SYN with Fast Open option set and an emy cookie field to request a Fast Open Cookie.
2. Server generates a cookie and sends it through the Fast Open option of a SYN-ACK packet.
3. Client caches the cookie for future TCP Fast Open Connections.

Then the *usage*:

1. Client sends a SYN w/ data and the cookie in the Fast Open opt
2. Server verifies the cookie
  2.1 Valid cookie: server sends a SYN-ACK which signals the acknowledge of both data and SYN then it sends the requested data w/ it.
  2.2 Invalid Cookie: drops the data and sends a SYN-ACK, signaling that the SYN was acknowledged.
3. Client sends an ACK acknolwedging the SYN and server data. If the data was not acknowledged before, client retransmits the data in the ACK packet.
4. The rest of the connection goes like any other TCP connection. Further TFOs are possible using the cookie that has been cached (which will expire on the serverside at a given time).


## Availability

- Linux 3.7+, nginx and HAProxy.
https://bradleyf.id.au/nix/shaving-your-rtt-wth-tfo/
