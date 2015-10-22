---
title: 'HTTP'
author: Ciro S. Costa
date: 15 Sep, 2015
tags: [networking, http]
description: ''
published: false
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


## huha

HTTP trata-se do principal protocolo da camada de aplicação usado na internet. Sua principal função é a tranferência de "objetos" (realmente genérico) - um conjunto de octetos. Diversas versões do protocolo existem (início da 1.1 descrito por [RFC 7230](http://tools.ietf.org/html/rfc7230)).

> HTTP is a stateless request/response protocol that operates by exchanging messages (Section 3) across a reliable transport- or session-layer "connection" (Section 6).

Tais objetos são endereçados por URLs:

>  HTTP relies upon the Uniform Resource Identifier (URI) standard [RFC3986] to indicate the target resource (Section 5.1) and relationships between resources.
> `URI  = scheme ":" hier-part [ "?" query ] [ "#" fragment ]`

Exemplo:

```
     foo://example.com:8042/over/there?name=ferret#nose
     \_/   \______________/\_________/ \_________/ \__/
      |           |            |            |        |
   scheme     authority       path        query   fragment
```

Por padrão a conexão é feita na porta 80 do servidor.

```
➜  ~  cat /etc/services | grep http
# Updated from http://www.iana.org/assignments/port-numbers and other
# sources like http://www.freebsd.org/cgi/cvsweb.cgi/src/etc/services .
http    80/tcp    www   # WorldWideWeb HTTP
http    80/udp        # HyperText Transfer Protocol
https   443/tcp       # http protocol over TLS/SSL
https   443/udp
http-alt  8080/tcp  webcache  # WWW caching service
http-alt  8080/udp
```

Por definição trata-se de um protocolo sem estado, apesar de, em cima do protocolo, ser possível criar e transferir estado entre servidor e cliente. Um dos mecanismos oferecidos trata-se dos Cookies.


No caso de uma página web, sem persistência de conexão, precisamos abrir uma nova conexão TCP para cada objeto na página.

// TODO (extra): máximo de 6 connexões concorrentes por host: http://www.coderanch.com/t/631345/blogs/Maximum-concurrent-connection-domain-browsers) e http://tools.ietf.org/html/rfc7230#section-6.4


## Maximum of 6 connections per browser

- not higher so that the server will not be overloaded by small amount of browsers.
- This limit imposes the need for resource fetching to be queued until they can grab the resource everyone is competing for (a connection).

## HTTP KeepAlive - Persistência

Com persistência torna-se possível transferir multiplos objetos em uma única conexão (verificar: [keep-alive](https://en.wikipedia.org/wiki/HTTP_persistent_connection))

> In HTTP 1.1, all connections are considered persistent unless declared otherwise. The HTTP persistent connections do not use separate keepalive messages, they just allow multiple requests to use a single connection. However, the default connection timeout of Apache httpd 1.3 and 2.0 is as little as 15 seconds[2][3] and just 5 seconds for Apache httpd 2.2 and above.[4][5] The advantage of a short timeout is the ability to deliver multiple components of a web page quickly while not consuming resources to run multiple server processes or threads for too long.[6]

O uso de conexões persistentes permitem grandes vantagens:
-   menos consumo de CPU e memória
-   possibilita HTTP pipelining
-   reduz congestão de rede (por haver menos conexões)
-   reduz latência (dada a necessidade de menos handshakes)
-   erros podem ser reportados sem a penalidade de fechar a conexão.

Mas também desvantagens:
-   enquanto não se fecha a conexão o servidor continua com recursos dados àquela conexão (dependendo da arquitetura do servidor isto se trata de um grande problema. NGINX lida bem com isto em sua arquitetura orientada a eventos).


## HTTP Pipelining

HTTP pipelining is a small optimization which allows us to relocate the FIFO queue from the client (request queuing) to the server (response queuing). As we're keeping connections alive, now we can perform multiple requests over a given connection. In the classic way we'd create the FIFO on the client and then enqueue requests waiting for out turn to be attended.

By moving this queuing problem to the server we let the server begin processing a request before it finilizes a previous response to the client (maybe even doing it concurrently). By dispatching our requests early, without blocking on each individual response we can elimitate another full roundtrip of network latency.

Note that what's going on here is not parallel requests, but a 'non-blocking' thing for sending requests and then waiting for multiple responses (can't multiplex then, have to come back separately).

Example:

```
req1
req2
  res2
req3
  res1
  res3
```

Note that adoption to http pipeling is very limited despite of its benefits. Browsers generaly support it but have disabled it.


## Session Management over HTTP

Session management is concerned with the stateless part of the HTTP specification, which states that the HTTP protocol is a stateless protocol. When we wish to build upon that idea of state we can do the trivial: simply pass the state in the requests. To do it so, we have the option of doing that with query parameters, cookies.

Either of these solutions have a problem: the user is able to edit it and then change the state "by hand", which is definetly not desirable (our application should be the responsible one). We could let the client store that data (encrypted) but that implies other problems. ,A solution to that is to simply transfer an ID that references an entry in a DB that contains all of the state in the server side. For the client, it only sees an ID being passed around. Other issues arise with this: session hijacking, session expiration, etc.

// TODO create an example using nodejs (Koa) along with redis as the session storage solution. Do all of that in a container

