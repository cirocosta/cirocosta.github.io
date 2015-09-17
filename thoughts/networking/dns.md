---
title: 'DNS - Domain Name System'
author: Ciro S. Costa
date: Aug 23, 2015
---

// *TODO organizar*

*DNS*

:   (Domain Name System) trata-se do protocolo que trata de resolver nomes em endereços IP (função principal), isto é, **reconciliar as preferencias to roteador** (IP - tamanho fixo e bem definido) **com as preferencias do usuário** (nomes que fazem sentido à aplicação). Outras funções do DNS é oferecer o modo reverso (dado um IP resolver o nome), descobrir o servidor de email de um domínio.

    Trata-se de uma base de dados distribuída que mantém o registro desses nomes e endereços. Sua arquitetura se da de modo hierárquico com separação bem definida entre servidores, havendo poucos servidores na raíz.

    O Protocolo se localiza na camada de aplicação, sendo usado indiretamente por quase todos os protocolos.


Por padrão o serviço é oferecido na porta 53, UDP. Melhor correr o risco depedir novamente do que depender de 5 pacotes de TCP (abrir conexão e fechar a conexão). Muito melhor depender de um 'non-reliable'. No caso de alguma troca de bit, por exemplo (mantendo um ip válido) a camada de IP ainda consegue verificar se se trata de uma boa formação ou não (checksums). Sabendo qual deve ser o formato da resposta é bastante simples para a aplicação verificar se há erros na transmissão ou não. Caso ocorra, basta retransmitir.

```
➜  ~  cat /etc/services | grep domain
domain    53/tcp        # Domain Name Server
domain    53/udp

```

// TODO em que caso usa tcp?

ps: arquivo `/etc/hosts` trata-se de um arquivo simples de texto que trata de associar endereços de IP a hostnames, linha a linha (tanto para ipv4 quanto para ipv6).

arquivo /etc/hosts:
```
IP_address canonical_hostname [aliases...]

EXAMPLE
       127.0.0.1       localhost
       192.168.1.10    foo.mydomain.org       foo
       192.168.1.13    bar.mydomain.org       bar
       146.82.138.7    master.debian.org      master
       209.237.226.90  www.opensource.org
```

Servidores DNS costumam ser muito visados por atacantes uma vez que os clientes confiam naquilo que é recebido.

1. Olhar o cache
2. verifica se o nome está presente em /etc/hosts
3. conecta no servidor DNS (olhando o arquivo /etc/resolv.conf) (e.g., estando na usp: `search semfio.usp.br`)

( ps.: o melhor é manter um servidor DNS fixo para se utilizar, e não deixar que o SO faça a busca pelo servidor e altere isso. //TODO verificar!)


# FROM Top Down Networking

The idea behind the IP address system is the idea of providing a fixed-length, hierarchically structure identifier for nodes. In order to reconcile the router preferences (IP address) with humans preferences (mnemonic hostname identifiers) there's the need for a translation system: the Domain Name System (DNS), which is essentially a distributed database implemented in a hierarchy of DNS servers and an application-layer protocol (runs over UDP and uses the well-known port 53) that allows hosts to query the distributed database.

It provides:
-   hostname resolution
-   host aliasing (cnames, etc)
-   mail server aliasing
-   load distribution

For the general case, the process goes as follows:

1. user machine runs the application which requires the resolution of a given hostname
2. the browser extracts the authority from the url and passesthat to the DNS application
3. the DNS client sends the query containing the hostname to a DNS server
4. the DNS client eventually receives a reply (remember, it's over UDP), which includes the IP address for the hostname
5. once the browser receives this IP address from DNS, initiates a TCP connection to the HTTP server.

### Distributed

Being distributed aspect of the application implies:
-   no single point of failure
-   capacity to deal with a big traffice volume.
-   better locality
-   maintenence without having to shutdown the service
-   more complexity.


### Hierarchical Database

Fact: no single DNS server has all of the mappings for all of the hosts in the internet. These mappings are spread accross DNS servers which are divided basically in three classes of DNS servers:

- root servers
- top-level domain
- authoritative


```
.                   // root DNS servers
├── .com            // com TLD servers
│   ├── yahoo.com     // authoritative servers on .com that has it
│   └── amazon.com
├── .org            // org TLD
│   ├── mozilla.org
│   └── wikipedia.org
└── .edu            // edu TLD
    └── mit.edu
```

Apesar de teoricamente poder fazer a pesquisa de raíz à toplevel e autoritativo não é necessário que isto seja feito. Ná pratica em todas as camadas é feito cache, incluindo a nivel de SO. Não estando no cache local, a query é feita para o parente mais próximo.


### Servidor BIND

https://en.wikipedia.org/wiki/BIND

> is the most widely used Domain Name System (DNS) software on the Internet.[2][3] On Unix-like operating systems it is the de facto standard.

### /etc/nsswitch.conf

### /etc/resolv.conf

Trata-se de um arquivo de configuração que o resolver utiliza como base para realizar suas queries. Este é o arquivo que deve ser manipulado caso o usuário deseje utilizar servidores de DNS alternativos ao que a rede propõe no momento da conexão.

Processos como o Networkmanager, dhcpcd e netctl são procesos que usualmente alteram o arquivo para facilitar a conexão.



### /etc/hosts



// FROM Unix Network Programming

DNS acts a a mapper between hostnames (FQDN or a simple name) and IP addresses.

*Fully Qualified Domain Name (FQDN)*

:   also called **absolute domain name**, is a domain name that specifies its exact location in the tree hierarchy of the DNS, specifying all domain levels (inluding the top-level domain and root zone). It is said to be absolute because it can be interpreted only in one way. As the DNS root domain is unnamed (expressed by an empty label), the fully qualified domain name ends with a dot character.

*Top-Level Domain (TLD)*

:   is one of the domains at the highest level in the hierachical DNS. They are installed in the **root zone** of the name space.

*DNS Root Zone*

:   is the top-level DNS zone in the hierarchical namespace of the DNS. //todo

*DNS zone*

:   //todo

*Root Name Server*

:   is a name server (translates humanly-meaningful text-based ids to system-internal, numeric representation of addresses) that directly answers requests for records in the root zone by returning a list of the authoritative name servers for the appropriate TLD. It does not have a formal name and its label in the DNS hierarchy is an empty string (as mentioned in the FLQDN entry).

*Authoritative Server*

:   is a name server that gives answers in response to questions asked about names in a zone. //todo


*Hostname*

:   is a label that is assigned to a device connected to a computer network and is used to identify the device in various forms of eletronic communication such as the internet. Hostnames may be simple names consisting of a single word or phrase, or may be more structured. Hostnames are meant to be human-readable and are used by various naming systems such as the DNS.


## DNS Records

Entries in the DNS are known as RRs (**resource records**). These RRs are of 4 types:

- **A** maps hostname into 32-bit IPv4
- **AAAA (quad A)** maps hostname into 128-bit IPv6
- **PTR** maps IP addreses into their hostnames (reverse). It reverses some bytes of the IP address and append `in-addr.arpa` or `ip6.arpa` for IPv4 and IPv6 addresses respectively.
- **MX** specifies a host to act as a "mail exchanger" for the specified host.
- **CNAME (canonical name)** is used to specify that a domain name is an alias for another domain. CNAME records must always point to another domain name, never directy to an IP-address.

(tip: `dig` as a very useful tool for checking DNS lookups)


### Cabeçalho

Contém uma identificação de 16bits para consulta e resposta, além de um conjunto de flags, informando, por exemplo: se temos uma consulta ou resposta, tipo de query, se é uma resposta autoritativa,  recursão desejada, possibilidade de recursão ou não.

```
    16 bits           16 bits
-----------------------------------
|  identificação   |   flags      |
-----------------------------------
|  qtd de queries  | # de RR de   |   RR: registro no DNS ( mapeamento entre
|                  |  resposta    |       o nome e endereço de IP )
-----------------------------------
|                  |              |
-----------------------------------
|              PERGUNTAS          |
-----------------------------------
|              RESPOSTAS          |
-----------------------------------
|                                 |
-----------------------------------
```

verificar: recursão em DNS

### Como registrar nomes ?

Para fazer tal registro é necessário que seja feito o contato, primeiramente, com empresas que mantém registros DNS (registrars). É necessário passar informações pessoais e o endereço IP do servidos DNS daquele domínio. A verificação de tais registros pode ser feito através do comando `whois`, que busca um objeto na base de dados mundial que permite que tal identificação seja feita (seguindo o protocolo especificado em RFC3912).


