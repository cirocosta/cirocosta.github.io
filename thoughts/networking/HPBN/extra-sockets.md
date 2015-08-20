---
title: 'Extra: Sockets'
author: Ciro S. Costa
date: Jul 07, 2015
---

## Network Socket

*IPC (Inter-process Communication)*
  ~ is the activity of sharing data across multiple and commonly specialized processes using communication protocols. Typically categorizes clients and servers where the client requests something and the server responds. 

A network socket is an endpoint of IPC across a computer network with the communication motly based on the Internet Protocol (leading to *Internet Sockets*).

Generally the API is based on the Berkeley Sockets standard.

The socket address is the combination of an IP address and a port number.

*Port Number*
  ~ serves as an endpoint in an operating system for many types of communication (a logical construct that identifies a service of process). It's associated (always) with an IP address and the protocol type of communication. They are used to provide a *multiplexing* service on each port number that network clients connect to for service initiation.

*Multiplexing*
  ~ is a technical term used to describe the technique of combining multiple signals into one over an expensive shared medium. By *demultiplexing* the original channels are extracted on the receiver side. 

## Unix Domain Socket

Also known as *IPC Socket* is a data communications endpoint for **exchanging data between processes executing within the same host operating system**. It's similar to that of an internet socket but rather than using an underlying network protocol all communication occurs entirely within the operating system kernel.

## Berkley Sockets


## WebSockets


