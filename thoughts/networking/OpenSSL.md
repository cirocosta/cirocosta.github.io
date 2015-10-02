---
title: OpenSSL and C++
author: Ciro S. Costa
date: 02 Out, 2015
---

Knowing that on the web we **want** to take advantage of the benefits that TLS gives to us (see [the post on tls](#tls) in case you're not aware of how it works and what are these benefits) here i present some basics of the [OpenSSL](#) library as i read about it when coding my [programming assignment](#ttt).

## Object Types

- `SSL_METHOD`: represents an implementation of SSL/TLS functionality by specifying the protocol version. In our case we're goingo to use `TLSv1_2_(client|server_method` function calls to return a pointer to a `SSL_METHOD` for the TLS 1.2 protocol
- `SSL_CTX`: Factory that stores the context to the creation of `SSL` connections (for example, a server that accepts connections will generate `SSL` objects - connections - from the `SSL_CTX` object). Such context contains the parametrization for protocol, certificates and verification requirements. It depends on a `SSL_METHOD` to be created.
- `SSL`: inherits parameters from a `SSL_CTX` that creates it. Represents a SSL/TLS enabled-connection.


## Certificates

In the server side (at least) a certificate (public) and a key (private) must be generated s that the client is able to determine if the server is authentic. In case we wish to authenticate the client as well the client must also generate a key pair.


## Diffie Hellman

> "How could two people who have never met before agree on a shared key without letting Eve, who's always listenning also obtain a copy?"

Basis: A lock. It's easy in one direction but super hard in the reverse (one way function)

1. Both agree on a color, the public color
2. Both mix their private colors with the public color
3. `A` sends its mixture to `B`. `B` sends its mixture to `A`.
4. `A` adds its private color to the mixture it received. `B` adds its private color to the mixture it received.
5. `A` and `B` now have the same color. Eve doesn't.






