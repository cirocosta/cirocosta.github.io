# UDP

-   connectionless
-   unreliable
-   datagram protocol

In a client-server situation there's no connection established between the client and the server. Communication is made in terms of `sendto` and `recvfrom`.

```
CLIENT                                 SERVER
-------                                 ----------
                                       socket()
                                       bind()
                                       recvfrom()

                                       blocks until
socket()                                receives
sendto()                                something
                    ---data-->           ||
recvfrom()                               \/
                                      processes the
blocks                                  request

                                        sendto()
                    <--data---
processes
response

close()
```

Note that there's no `connect` call in the client-side, neither a `listen` and `accept` calls at the server-side.

While TCP servers are generally concurrent, most UDP servers are iterative. There's an implied queuing taking place in the UDP layer for the socket.

Note that it's not because we're not calling `connect` in the client-side that an ephemeral port wouldn't be chosen by the kernel. Instead, this time, it's chosen at the time we perform the `sendto`.


