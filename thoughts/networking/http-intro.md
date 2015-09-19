---
title: "Ch 9. - Brief History of HTTP"
author: Ciro S. Costa
date: 13 Jul, 2015
---


## (1991) HTTP 0.9 - The One Line Protocol

- Connection established over a TCP/IP link
  - Client Request: single ASCII char string terminated by CRLF
  - Server response is an ASCII char stream (in *hypertext markup language* - HTML).
- Connection is terminated after document transfer


## (1995) HTTP 1.0 - Rapid Growth and Informational RFC 

During the rapid growth of the internet, ad hoc process: implement, deploy and see if other people adopt it. 1996 a set of patterns began to emerge and in 1996 the HTTPWG publishes the first informational RFC indicating a set of common HTTP implementations.

Now requests may consist of multiple header fields, indicating metadata and other options; response has a status line that informs the client better (as well as metadata); response not limited anymore to hypertext and the connection between server and client continuous to be closed after every request. Now HTTP is more about *hypermedia* than *hypertex*.


## (1997) HTTP 1.1 - Internet Standard

Lots of new features:

- keepalive connections (reusing connections - default)
- chunked encoding transfers 
- byte-range requests
- additional caching mechanisms
- transfer encodings
- request pipelining


## (2015) HTTP 2.0 - Improving Transport Performance








