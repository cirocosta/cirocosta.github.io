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


## Porta TCP e UDP

Podemos ter dois processos com `bind` em uma mesma porta porém cada um conectanto com um protocolo de transporte. Ou seja, 2^16 portas para cada tipo de transporte.


## C

Especificamos que se estamos criando um socket `udp` através da definição de `SOCK_DGRAM` como o tipo de socket.

> If the socket sockfd is of type `SOCK_DGRAM` then addr is the address to which datagrams are sent by default, and the only address from which datagrams are received.

( questão: como simular erros na rede e tratar com o UDP - professor colocará um exemplo com iptables no paca )


// TODO como verificar erro na mensagem (checksum) ?

Apparently if we wish to provide checksum capabilities to our application we must provide an UDP pseudo-header.

### Cliente





