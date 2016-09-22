---
title: Network layer
date: 03 Nov, 2015
author: Ciro S. Costa
---

## Traceroute

Busca forçar roteadores a enviarem alguma mensagem ICMP (criar pacotes *mal-formados* ) para obrigar o roteador a responder).

mal-formação: TTL == 1, TTL == 2, (...) até chegar ao destino (no máximo 64 - Linux).
Podemos saber que o pacote chegou ao destino verificando o endereço de destino do pacote inicial. Entretanto, traceroute não faz isso. Apenas espera o restorno da mensagem 'destination port unreachable': envia pacotes UDP em porta alta que certamente o destinatário não estará escutando. Desta forma quando chegar ao destino uma mensagem diferente de `TTL EXPIRED` será retornada, indicando então que de fato chegamos ao fim.

`netcat`: nc — arbitrary TCP and UDP connections and listens (útil para transferência rápida de arquivos pela rede - utilitário bem simples - dado que coloca o output diretamente no stdout).


## DHCP (Dynamic Host Configuration Protocol)

Possui o objetivo de permitir a configuração (em relação à rede - endereço de IP, máscara, roteador padrão, serivodr DNS) automática de máquinas quando elas entram em uma rede.

Sua atuação se dá no momento imediato de conexão da máquina a nível físico em uma rede. Para que iso funcione a máquina precisa "conversar" (necessitando de um protocolo) com alguma entidade (precisa de algum servidor na rede - máquina precisa de um cliente p/ conversar c/ o servidor) na rede para obter as configurações.

###  Protocolo

1. como descobrir quem é o servidor DHCP (sem saber o IP dele?) - lembrando que 'minha' mensagem não terá um 'src' e não sabemos nem mesmo a subrede correta. Enviamos então para um broadcast - deve ser transportado por UDP, portanto - para o endereço que possui igual a 1 (255.255.255.255).

2. Servidor DHCP responde (caso haja o servidor DHCP na rede) avisando que ele existe e uma oferta de configuração (via broadcast)

3. host reprete a configuração enviada pelo servidor

4. servidor responde com um ACK (internamente mantem uma tabela e sabe então quais endereços estão sendo usados) - configuração na maioria das vezes vale apenas por um determinado intervalo de tempo.

```
             (223.1.2.5)                                  (inicia sem)
               servidor                                      cliente
    ----------------------------                  --------------------------------
                                   DHCP DISCOVER

      (envia p/ todos ja que nao                    [udp] src = 0.0.0.0:68
       conhece o ip do servidor)                          dst = 255.255.255.255:67
                                                           id = 654
                                  DHCP OFFER

     src = 223.1.2.5:67
     dst = 255.255.255.255:68                     (a mensagem alcança todos na rede -
(cfg) ip = 223.1.2.4                               envia para o o broadcast. Quem não
(cfg)ttl = 3600 seg                                precisar, simplesmente ignora a mensagem)

                                  DHCP REQUEST
                                                        src = 0.0.0.0:68
                                                        dst = 255.255.255.255:67
                                                         ip = 223.1.2.4
                                                        ttl = 3600seg

                                  DHCP ACK

     src = 223.1.2.5:67
     dst = 255.255.255.255:68
      ip = 223.1.2.4
     ttl = 3600seg
```

ps.: DHCP foi feito para redes que possam  conter mais de um servidor DHCP na rede. Este é o motivo de, mesmo após saber quem é o servidor DHCP, continua-se enviando para broadcast. Vale lembrar que podemos ter um problema de segurança pois um servidor 'que não deveria' pode se passar por DHCP.

### Linux

```log
Nov  3 09:57:30 ciro-nb NetworkManager[865]: <info> Activation (wlan0) Beginning DHCPv4 transaction (timeout in 45 seconds)
Nov  3 09:57:30 ciro-nb NetworkManager[865]: <info> dhclient started with pid 23920
Nov  3 09:57:30 ciro-nb NetworkManager[865]: <info> Activation (wlan0) Beginning IP6 addrconf.
Nov  3 09:57:30 ciro-nb NetworkManager[865]: <info> Activation (wlan0) Stage 3 of 5 (IP Configure Start) complete.
Nov  3 09:57:30 ciro-nb dhclient: Internet Systems Consortium DHCP Client 4.2.4
Nov  3 09:57:30 ciro-nb dhclient: Copyright 2004-2012 Internet Systems Consortium.
Nov  3 09:57:30 ciro-nb dhclient: All rights reserved.
Nov  3 09:57:30 ciro-nb dhclient: For info, please visit https://www.isc.org/software/dhcp/
Nov  3 09:57:30 ciro-nb dhclient:
Nov  3 09:57:30 ciro-nb NetworkManager[865]: <info> (wlan0): DHCPv4 state changed nbi -> preinit
Nov  3 09:57:30 ciro-nb dhclient: Listening on LPF/wlan0/f8:16:54:fd:6f:b5
Nov  3 09:57:30 ciro-nb dhclient: Sending on   LPF/wlan0/f8:16:54:fd:6f:b5
Nov  3 09:57:30 ciro-nb dhclient: Sending on   Socket/fallback
Nov  3 09:57:30 ciro-nb dhclient: DHCPDISCOVER on wlan0 to 255.255.255.255 port 67 interval 3 (xid=0xbfe3b564)
Nov  3 09:57:31 ciro-nb avahi-daemon[842]: Joining mDNS multicast group on interface wlan0.IPv6 with address fe80::fa16:54ff:fefd:6fb5.
Nov  3 09:57:31 ciro-nb avahi-daemon[842]: New relevant interface wlan0.IPv6 for mDNS.
Nov  3 09:57:31 ciro-nb avahi-daemon[842]: Registering new address record for fe80::fa16:54ff:fefd:6fb5 on wlan0.*.
Nov  3 09:57:31 ciro-nb dhclient: DHCPREQUEST of 172.16.60.216 on wlan0 to 255.255.255.255 port 67 (xid=0x64b5e3bf)
Nov  3 09:57:31 ciro-nb dhclient: DHCPOFFER of 172.16.60.216 from 172.16.0.1
Nov  3 09:57:31 ciro-nb dhclient: DHCPACK of 172.16.60.216 from 172.16.0.1
Nov  3 09:57:31 ciro-nb dhclient: bound to 172.16.60.216 -- renewal in 3389 seconds.
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info> (wlan0): DHCPv4 state changed preinit -> bound
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info>   address 172.16.60.216
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info>   prefix 16 (255.255.0.0)
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info>   gateway 172.16.0.1
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info>   nameserver '172.16.0.1'
Nov  3 09:57:31 ciro-nb NetworkManager[865]: <info>   domain name 'semfio.usp.br'
```

```
bootps         67/tcp        # BOOTP server
bootps         67/udp
bootpc         68/tcp        # BOOTP client
bootpc         68/udp
dhcpv6-client 546/tcp
dhcpv6-client 546/udp
dhcpv6-server 547/tcp
dhcpv6-server 547/udp
```

> BOOTP (Bootstrap Protocol) is a protocol that lets a network user be automatically configured (receive an IP address) and have an operating system booted (initiated) without user involvement.

