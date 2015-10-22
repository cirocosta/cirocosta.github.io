---
title: 'Creating an IRC Server'
author: Ciro S. Costa
date: 08 Sep, 2015
tags: [networking, irc]
description: ''
published: false
---

## How an IRC server work?

### Channels

```
PRIVMSG <msgtarget> <text to be sent>

msgtarget: nickname | channel | mask
```

Examples

```
   PRIVMSG Angel :yes I'm receiving it !
                                   ; Command to send a message to Angel.


   PRIVMSG #*.edu :NSFNet is undergoing work, expect interruptions
                                   ; Message to all users who come from
                                   a host which has a name matching
                                   *.edu.
```


### Clients

## Discovering how an IRC server works

RFC 2812, RFC 2813

Docker + UnrealIRCd ==> server
Hexchat ==> Client

Sniff all with Wireshark.


## Preparing the Server to Sniff


## Coding the Server

### Parsing messages

### Interpreting

### Datastructures


