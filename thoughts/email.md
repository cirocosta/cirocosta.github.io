---
title: 'Email'
author: Ciro S. Costa
date: 22 Sep, 2015
tags: [networking, email]
description: ''
published: false
---

1. Usuário escreve a mensagem para `destino@dominio` e envia com o agente de usuário (programa que implementa o lado cliente do protocolo SMTP) a mensagem.

  1.1. Vários protocolos estão envolvidos:
    a. entre servidores
    b. entre cliente e servidor.

  1.2. Para o envio: SMPT

  1.3. Para consumo por meio do cliente: IMAP/ POP / outros


// revisitar as anotações no caderno / TPN

// TODO ver: problemas com porta SMTP aberta em servidores

- http://serverfault.com/questions/640793/does-closed-port-25-cause-mail-to-be-marked-as-spam
- http://www.circleid.com/posts/port_25_blocking_or_fix_smtp_and_leave_port_25_alone_for_the_sake_of_spam/

pag 119

## DNS

Resolução `gmail.com`

```
➜  ~  dig gmail.com MX

; <<>> DiG 9.9.5-3ubuntu0.5-Ubuntu <<>> gmail.com MX
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 1985
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 4, ADDITIONAL: 11

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;gmail.com.     IN  MX

;; ANSWER SECTION:
gmail.com.    262 IN  MX  40 alt4.gmail-smtp-in.l.google.com.
gmail.com.    262 IN  MX  20 alt2.gmail-smtp-in.l.google.com.
gmail.com.    262 IN  MX  30 alt3.gmail-smtp-in.l.google.com.
gmail.com.    262 IN  MX  10 alt1.gmail-smtp-in.l.google.com.
gmail.com.    262 IN  MX  5 gmail-smtp-in.l.google.com.

;; AUTHORITY SECTION:
gmail.com.    20702 IN  NS  ns2.google.com.
gmail.com.    20702 IN  NS  ns4.google.com.
gmail.com.    20702 IN  NS  ns3.google.com.
gmail.com.    20702 IN  NS  ns1.google.com.

;; ADDITIONAL SECTION:
gmail-smtp-in.l.google.com. 69  IN  A 64.233.186.26
gmail-smtp-in.l.google.com. 110 IN  AAAA  2800:3f0:4003:c00::1b
alt1.gmail-smtp-in.l.google.com. 226 IN A 74.125.133.27
alt3.gmail-smtp-in.l.google.com. 173 IN A 64.233.163.26
alt4.gmail-smtp-in.l.google.com. 231 IN A 74.125.68.26
alt4.gmail-smtp-in.l.google.com. 110 IN AAAA  2404:6800:4003:c01::1a
ns1.google.com.   79978 IN  A 216.239.32.10
ns2.google.com.   79978 IN  A 216.239.34.10
ns3.google.com.   79978 IN  A 216.239.36.10
ns4.google.com.   79978 IN  A 216.239.38.10

;; Query time: 10 msec
;; SERVER: 127.0.1.1#53(127.0.1.1)
;; WHEN: Tue Sep 22 10:59:09 BRT 2015
;; MSG SIZE  rcvd: 417

```
