---
title: 'DNS - Domain Name System'
author: Ciro S. Costa
date: Aug 23, 2015
---

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


