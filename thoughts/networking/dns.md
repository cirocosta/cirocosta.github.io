---
title: 'DNS - Domain Name System'
author: Ciro S. Costa
date: Aug 23, 2015
---

// FROM Top Down Networking

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


