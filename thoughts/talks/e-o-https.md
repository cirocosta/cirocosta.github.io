---
title: E o HTTPS?
author: Ciro S. Costa
tags: [networking, frontend, crypto]
date: 03 Out, 2015
abstract: |
  Ainda há motivos para não se utilizar HTTPS em um website?
  Há muito tempo não. Muita coisa mudou desde sua concepção
  e já é realidade que toda página na web deve utilizar.
  HTTP2 chegou para ficar e sempre fica a ressalva: HTTPS
  é requisito para HTTP2. Essa palestra busca apresentar os
  conceitos por trás da tecnologia, denotar seus usos e expor
  algumas novas ferramentas que já estão aí para ajudar o
  desenvolvedor frontend a utilizar o protocolo.
---

#CHANGELOG

-   01 Out -    Concepção
-   02 Out -    Delimitação de tópicos e marco teórico (crypto + tls)
-   04 Out -    Atualiza Introdução (+coeso, melhores ganchos, uso de historia)
-   04 Out -    Ampliação marco teórico e rationale.

#TODO

-   Estabelecer gancho entre os tópicos
-   Estabelecer tópicos a ser abordados
-   Estimar tempo de cada tópico
-   Reduzir tópicos
-   Separar o exemplo de TLS com C++ do `ttt`: [https://github.com/cirocosta/ttt/blob/net/src/tls_connection.cc](https://github.com/cirocosta/ttt/blob/net/src/tls_connection.cc)
-   Recriar os ambientes com Vagrant para compartilhar depois


# Rationale

Muito em breve HTTPS será o 'dafault' na web. Assim como há algum tempo muito tem-se lutado por acessibilidade (tópico recorrente em encontros de frontend), cada vez mais a luta por privacidade está em voga. Com o avanço cada vez maior das aplicações na web mais cresce a responsabilidade que o desenvolvedor deve ter com relação aos seus usuários. Isto inclui diretamente o programador frontend que, produzindo toda a frente da aplicação, é diretamente responsável pelos bytes entregues ao usuário. Assim como é necessário o entendimento da causa por trás da luta por acessibilidade e como entregar isso a seus usuários, é extremamente importante que se entenda como funciona o HTTPS, o protocolo que tanto garante a privacidade dos usuários como também resguarda os dados transmitidos e assegura a autenticidade destes.

## Objetivos a Alcançar

Em ordem crescente:

-   Que o desenvolvedor frontend compreenda alguns dos benefícios do HTTPs
-   Que assimile os 3 objetivos do TLS
-   Que Aqueles presentes que mantenham algum website façam sua parte e configurem seus servidores e clientes para utilizar HTTPS


# Talk

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [E o HTTPS ?](#e-o-https-)
  - [Intro](#intro)
  - ["All the communication should be secure by default"](#all-the-communication-should-be-secure-by-default)
  - [Back in the Old Days](#back-in-the-old-days)
  - [HTTP && HTTPS](#http-&&-https)
    - [Camadas](#camadas)
  - [Conexão](#conex%C3%A3o)
    - [Conexão com TLS](#conex%C3%A3o-com-tls)
    - [RTT](#rtt)
  - [Portas](#portas)
  - [Conexão Segura](#conex%C3%A3o-segura)
    - [Autenticação](#autentica%C3%A7%C3%A3o)
  - [Integridade dos Dados](#integridade-dos-dados)
  - [Criptografia](#criptografia)
  - ["Secrecy"](#secrecy)
    - [Diffie Hellman (1976)](#diffie-hellman-1976)
  - [Criptografia Simétrica](#criptografia-sim%C3%A9trica)
  - [Criptografia Assimétrica](#criptografia-assim%C3%A9trica)
  - [Web Of trust](#web-of-trust)
  - [Checagem de Integridade](#checagem-de-integridade)
  - [HTTP](#http)
  - [HTTPS](#https)
  - [Antes SSL](#antes-ssl)
  - [TLS](#tls)
    - [E a negociação?](#e-a-negocia%C3%A7%C3%A3o)
    - [Mas porque HTTP2 requer HTTPS?](#mas-porque-http2-requer-https)
  - [Chaves](#chaves)
    - [Como é uma chave e certificado?](#como-%C3%A9-uma-chave-e-certificado)
  - [Certificados e Cadeia de Confiança](#certificados-e-cadeia-de-confian%C3%A7a)
    - [Como é um certificado](#como-%C3%A9-um-certificado)
  - [HTTPS Everywhere](#https-everywhere)
  - [Let's Encrypt](#lets-encrypt)
  - [Save Crypto](#save-crypto)
  - [E Vai Melhorar!](#e-vai-melhorar)
  - [TODO para sysadmins](#todo-para-sysadmins)
  - [FAQ](#faq)
  - [Recursos](#recursos)
    - [Livros](#livros)
    - [Talks](#talks)
    - [Articles](#articles)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# E o HTTPS ?

// apresentação palestrante

## Intro

> "Pra que?"

```SLIDE
Once upon a time ...
```

Começar com uma história seguindo os `Padrões De Exemplos De Criptografia^{TM}`, i.e, usando os personagens Alice, Bob e Eve.

> História: 'Alice' e 'Bob' conspiram contra seus países. 'Eve' escuta tudo. Existe esse meio de comunicação mundialmente conhecido chamado Internet, que possui um protocolo de comunicação entre aplicações, também muito bem conhecido, o HTTP.

```SLIDE
                    (intercepta msgs)
                           EVE
                            |
                            |
Alice   --------------  (mensagem) -------> BOB
              |                         |
              ---------------------------
                            |
                     (meio inseguro)
```

> Historia: O HTTP sempre funcionou muito bem para Alice e Bob. Trocavam mensagens sem problemas, até que começaram a conspirar sobre seus países. A partir de agora Alice e Bob precisavam ser cuidadosos, afinal Eve era capaz de ver tudo

[IMAGEM TRAFEGO WIRESHARK](#todo)

Problema a resolver: prover comunicação segura sobre o meio inseguro. TLS provém os serviços mais comuns de segurança para conexões arbitrárias na web, minimizando os requisitos de expertise em criptografia. O melhor dos mundos seria aquele que  não houvesse necessidade de se saber sobre criptografia ou ter de se preocupar com segurança mas na realidade isto não é possível, e fica a cargo do desenvolvedor cuidar da aplicação e dos seus usuários. Mesmo que haja muito esforço para que a implementação seja fácil, ainda assim, como tudo em segurança, requer entendimento do se está fazendo.

```SLIDE
Huston, we've got a problem.
```

Ok, Alice e Bob tinham algo sensitivo em mãos, claramente.

===> GANCHO: Tudo é conteúdo sensitivo?

## "All the communication should be secure by default"

> "Mas até meu blog?"

Cada vez mais há pontos públicos de WiFi em cidades grandes, principalmente em pontos comerciais que buscam tal disposição como forma de atrair clientela. Apesar de conveniente, ao mesmo tempo trata-se de um grande atrativo para agentes maliciosos, que buscam fazer como na imagem.

> Historia: Alice e Bob não começaram a conspirar atoa. (EXPANDIR)

Não apenas banking e comércio, mas todos os meios de comunicação devem ser protegidos. Por mais que visualizar o conteúdo de apenas um site pode parecer não ser relevante, possivelmente por conta de um conteudo não relevante à primeira vista, ao se olhar o agregado de todos os métadados pode-se ter com bastante clareza noção das intenções de um usuário.

// TODO cookie sniffing!

Independente de qual seja o foco do site ou o conteúdo o dono do site não deve ser quem decide se o conteúdo é sensitivo àquela pessoa ou não. Fica à cargo do desenvolvedor tomar conta da privacidade do usuário.

É extremamente importante que você também proteja o seu site, não se quer que participantes inesperados o "estraguem".

Uma visita a um website por si só pode não ser de grande interesse para um atacante. O agregado revela muito mais. Você não quer contribuir para um ataque. Com TLS temos a possibilidade de cuidar disso.

===> GANCHO: Mas o que é TLS? Achei que fosse SSL!


## Back in the Old Days

> "SSL ... TLS ... O que?"

Netscape Navigator, Julho 1994 (sem release publico): SSL como meio de prover comunicação segura na internet - focado em transações de comércio. Busca: privacidade nas mensagens, integridade e autenticação mútua.

SSL/TLS como protocolo para comunicação segura.

1999: RFC 2246  (TLS 1.0)
2006: RFC 2246  (TLS 1.1)
2008: [RFC 2246](https://www.ietf.org/rfc/rfc5246.txt)  (TLS 1.2)

// TODO melhorar
//      buscar + historia e motivo da mudança de nome

Com o surgimento do SSL/TLS agora qualquer tipo de comunicação pode utilizar dos benefícios do protocolo para então se comunicarem (não necessariamente HTTP).

> Historia: Agora Alice

```SLIDE
                             (intercepta msgs) ==> intercepta lixo!
                                    EVE
                                     |
                                     |
Alice   --==(encrypt(msg))=====(1h1029LIXO812h)==========(decrypt(msg))==>  BOB
            |                                                           |
            -------------------------------------------------------------
                                        |
                                 (meio inseguro)
```

[EXEMPLO WIRESHARK - Intercepta Lixo](#todo)

Sendo o TLS de uso genérico, podemos usar tal tecnologia de modo integrado com o protocolo de comunicação que Alice e Bob utilizam!

====> GANCHO: "When HTTP meets TLS!"

## HTTP && HTTPS

> "Como fazemos o HTTP rodar em cima do TLS?"

// TODO (melhorar o gancho aqui ... importante relacionar o conceito de camadas)
Até algum tempo, para o desenvolvedor frontend bastava uma definição do conceito de Internet:

- infraestrutura de fornecimento de serviços a aplicações distribuídas, cabendo ao programador apenas ter que aprender a invocar os serviços.

Simples: algo que contruo "em cima" e apenas espero que funcione.

HTTPS busca não alterar essa ideia. Configurada a parte do TLS, basta entender como HTTP por cima de uma camada de TLS que funciona como um tunel que protege a conexão.

[RFC 2818 - HTTP Over TLS](https://tools.ietf.org/html/rfc2818)
> SSL, and its successor TLS [RFC2246] were designed to provide channel-oriented security."

===> GANCHO: Isto é possível por causa da arquitetura da internet

### Camadas

> Em redes tudo é feito sobre camadas

```
    MSG IN                                     MSG OUT
 .
/ \   aplicação                   |   aplicacao
 |    sessão                      |   sessão
 |    transporte                  |   transporte
 |    rede                        |   rede
 |    físico                     \|/  fisico
```


## Conexão

> "O que é uma conexão?"

(obs: deixar claro que estamos falando sempre de TCP nos exemplos - afinal, UDP é connectionless .. não faria sentido)

// TODO: HANDSHAKE DE TCP

Conexão identificada por 4-tupla (SRC ADDR, SRC PORT, DEST ADDR, DEST PORT)

### Conexão com TLS

> "O que muda quando adicionamos aquela camada?"

// TODO: HANDSHAKE DE TCP COM TLS (negociação de ciphersuite, etc)


### RTT

```SLIDE
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=55 time=46.4 ms

+ WIRESHARK
```

## Portas

> "Como diferenciar uma conexão de serviço HTTP simples de um HTTPS?"

Existe um registro internacional que mapeia as 'portas bem conhecidas'. Mais de 60 portas são especificadas para o uso de SSL/TLS, ex:

``` SLIDE
$ cat /etc/services | grep SSL
https   443/tcp           # http protocol over TLS/SSL
nntps   563/tcp   snntp   # NNTP over SSL
ldaps   636/tcp           # LDAP over SSL
ftps-data 989/tcp         # FTP over SSL (data)
telnets   992/tcp         # Telnet over SSL
imaps   993/tcp           # IMAP over SSL
ircs    994/tcp           # IRC over SSL
pop3s   995/tcp           # POP-3 over SSL
suucp   4031/tcp          # UUCP over SSL

$ cat /etc/services | grep HTTP
http    80/tcp    www     # WorldWideWeb HTTP
hkp   11371/tcp           # OpenPGP HTTP Keyserver

cat /etc/services | grep irc
irc   194/tcp             # Internet Relay Chat
irc   194/udp
ircs    994/tcp           # IRC over SSL
ircs    994/udp
ircd    6667/tcp          # Internet Relay Chat
dircproxy 57000/tcp       # Detachable IRC Proxy
```


## Conexão Segura

Os três conceitos são muito importantes (devem existir em conjunto). Qual é o ponto de termos uma conexão criptografada com um atacante?


### Autenticação

"Estou de fato falando com quem o outro se diz ser?"
Garante que a conexão está sendo feita diretamente com o site e não com algum atacante que está segurou a conexão fingindo ser o servidor original.

-- Exemplificar com ataque MITM

## Integridade dos Dados
Será que alguém alterou os dados?
-- realizar um "ataque" local e tentar alterar dados de um pacote e então mostrar o resultado disso no browser. Usar mininet?

## Criptografia
Alguém pode ver minha conversa?

-- mostrar exemplo de pacote criptografado no wireshark


## "Secrecy"

Duas pessoas desejam concordar em uma chave para então criptografar suas mensagens posteriormente. Sabendo da restrição de que essas duas pessoas não podem se encontrarar físicamente para trocar a chave comum, como elas podem concardar em uma sem que uma terceira pessoa descubra?

### Diffie Hellman (1976)

Tecnologia assimétrica para negociar chaves simétricas.

Fatos:
-   cores são faceis de se misturar
-   é muito difícil estrair duas cores de uma combinação

==> LOCK!


Procedimento:

1.  ambos concordam (publicamente) em uma cor
2.  cada um, aleatoriamente, seleciona alguma cor como cor privada.
3.  cada um faz uma mistura entre a cor pública e a cor privada
4.  Trocam as misturas
  4.1  `A` envia sua mistura para `B`.
  4.2  `B` envia sua mistura para `A`.
5.  Cada um mistura sua cor privada com a mistura recebida
6.  `A` e `B` tem a mesma mistura final


## Criptografia Simétrica

> Usada para criptografar os dados em uma comunicação. Mais barata.

Enunciado: Duas pessoas desejam se comunicar de modo privado. Ambas concordam em uma chave para trancar/destrancar a caixa de segredo. A Pessoa A então coloca a mensagem na caixa e tranca com a chave. A pessoa B então recebe a caixa e destranca com a chave.

```
                    Pessoa C
                  (sem chave)
                não consegue abrir


                ___CHAVE__________
                |                 |
nsa_won't_see ------> GARBAGE --------> nsa_won't_see

  Pessoa                                    Pessoa
    A                                         B
 (chave K)                                 (chave K)
```

Apesar de inicialmente parecer um sistema bom, há um problema: como que as pessoas concordam com a chave? E se as pessoas moram em países distintos ou não podem se encontrar fisicamente?

É necessário estabelecer uma conexão segura. Mas como estabelecer uma conexão segura sem chave?


## Criptografia Assimétrica

> utilizada durante o handshake para autenticar os participantes e fazer a troca de chaves de sessão.

Soluciona o problema inicial anterior de uma maneira muito elegante:

Cada participante gera um par de chaves (c1, c2) que possuem uma relação muito especial entre sí: o que uma chave tranca só pode ser destrancada pela outra chave. Apesar disto, são visivelmente diferentes para um estranho.

```
Pessoa A :        Pessoa B:
  Chave_A_1         Chave_B_1
  Chave_A_2         Chave_B_2
```

Cada pessoa pega uma das chaves e estabelece como chave pública. Coloca em algum lugar público, como seu site, p.ex. A outra chave, privada, é guardada em algum lugar muito seguro.

```
Pessoa A :                Pessoa B:
 -------------            ---------------
 | Chave_A_1 |pub        |  Chave_B_1   |pub
 -------------            ---------------
  Chave_A_2 (priv)          Chave_B_2   (priv)
```

Para a pessoa A enviar uma mensagem que somente a pessoa B possa visualizar: Pega a `Chave_B_1`, tranca a mensagem e envia para a pessoa B. Como essa mensagem só pode ser destrancada pela chave `Chave_B_2`, que está em poder da pessoa B, então só a pessoa B pode destrancar e ler a mensagem. Desta forma qualquer pessoa do mundo poderia enviar uma mensagem que somente a pessoa B poderia ler.

```
Pessoa Anonima
                         tranca com                 Pessoa B
  (mensagem) =========>  chave pub =============> unlock(mensagem)
                         Chave_B_1
```

Outra propriedade que podemos extrair de tal sistema é a autenticidade. Para tal basta que a pessoa que escreve a mensagem tranque-a com sua chave privada. Como só existe uma chave no mundo que pode destrancá-la (a chave pública dessa pessoa) então só há uma pessoa no mundo que pode ter trancado-a!

```
Pessoa A
(mensagem)    ===> tranca com   ===> coloca a publico
                   private key

Pessoa Anonima
(mensagem)    ===> destranca com   ===> le mensagem :D
  trancada         Chave_A_1(pub)
```

Melhor dos mundos: ambos os métodos são utilizados.

## Web Of trust

Six degrees of separation

e Ideia do PGP

## Checagem de Integridade

Message Digests : hash functions que fazem com que todo o output seja influenciado por todo o input. 1 bit de alteração aumenta em 50% a chance de alteração em qualquer outro bit

Uma boa maneira de entender o que é a checagem de integridade é fazendo uma analogia com os dígitos de de verificação de CPF, CNPJ ou até mesmo códigos de barra. No útimo exemplo acontece que o último número é determinado por todos os outros números presentes no código (se trocar um desses dígitos, o último muda). Um algorítimo de hashing em tal contexto busca ter tal funções porém para sequências muito maiores: centenas de milhares de bytes, resultado em não apenas um número pequeno, mas um código ou um grande número hexadecimal. Como se fosse um 'resumo' de tudo aquilo, porém com a probabilidade que não se consegue 'voltar' ao original. É como uma assinatura.

Ao contrário de qualquer assinatura, é uma com 3 propriedades muito particulares:

1.  Velocidade: não pode ser muito lenta e nem muito rápida
2.  Colisão: Dois arquivos não podem ter o mesmo hash (ou a probabilidade disso acontecer deve ser incrivelmente despresível) - [piggeonhole principle](https://en.wikipedia.org/wiki/Pigeonhole_principle).
3.  Efeito Avalanche: se 1 bit for alterado no início, meio ou fim do arquivo, todo o hash deve ser alterado.

## HTTP

## HTTPS

## Antes SSL

## TLS

TLS (Transport Layer Security) was implemented at the application layer, directly on top of TCP - a reliable transport. By doing this it enabled protocols above it (http, email, im, etc) to operate unchanged while providing communication security.  Nowadays it has been adapted to run over datagram protocols such as UDP (see Datagram Transport Layer Secutiry - DTLS - protocol) as well.

Garante criptografia, autenticação e integridade de dados by establishing a cryptographically secure data channel with the peers agreeing on which ciphersuites will be used and the keys used to encrypt/decrypt the data. They also have to agree on the message framing mechanism which is responsible for signing each message with a *message authentication code* (`MAC`, kind of a checksum) to ensure both integrity and authenticity.

### E a negociação?

1. TCP Handshake (1 RTT)
2. client sends specs in plain text such as TLS version, ciphersuites, through the reliable transport (tcp) etc
3. server picks tls version, decides other things, attaches its certificate and sends that info back to the client (might also request the client's certifcate and parameters for other TLS extensions)
4. if client is happy with the certificate and others, generates a symmetric key, encrypts it with the server's public key and tells the server to switch to encrypted communication.
  4.1 From know on, everything is encrypted
5. the server decrypts the symmetric key sent by the client, checks the integrity (through MAC) and returns an encrypted "finished" message back to the client
6. The client decrypts the message with the symmetric key generated earlier, verifies the MAC and if everything is OK then the tunnel is established and ready to run.

Notice that more RTT (two at least) are required and that even though we start (session setup of TLS tunnel) with public (assymetric) encrpytion, during the further requests there's only symmetric encryption.

### Mas porque HTTP2 requer HTTPS?

Because TLS obfuscates data we can deliver any kind of protocols on the web without needing to worry about proxies and other intermediaries as these parties can't know about the data that is passing through them. Another great feature that TLS brings is the fact that we can rely on the 443 port and don't need to configure all clients to search for another port.

In the protocol negotiation side TLS helps with one more thing: ALPN (*Application Layer Protocol Negotiation*). This lets us specify the protocol during the TLS handshake phase (when we had already established a reliable transport throguh TCP - the client specifies which protocols it supports and the server then selects and confirms the protocol; or drops the connection). Note that we could use the new HTTP2.0 Upgrade mechanism in a non-secure channel but that would consume the same amount of RTT as in the TLS way without Upgrade.


## Chaves

### Como é uma chave e certificado?

[cert](#todo)
[priv](#todo)

## Certificados e Cadeia de Confiança

The idea of a chain of trust is about establishing a way of determining whether someone who i trust trusts in another party which i don't know (but my friend knows). In the public key analogy my friend knows the other if my friend signs the other guy's messages with its public key. This is the idea of transitive trust. To determine the browser's chain of trust there are 3 ways:

- Manually Specified Certificates
- Certificate Authorities: a CA is a trusted third party that is trusted by both the subject (owner) of the certificate and the party relying upon the certificate
- The Browser and OS: predefined list of trusted CAs

Checking a certificate status if just a matter of querying OCSP (*Online Certificate Status Protocol*) or checking the CLR (*Certificate Revocation List*). Maintaining the list and an endpoint for OCSP (realtime) is a CA's duty. It must ensure that the service is up and globally available at all times. Because the client must block on OCSP requests before proceeding with the navigation, this might affect the latency.


### Como é um certificado

## HTTPS Everywhere

https://addons.mozilla.org/pt-br/firefox/addon/https-everywhere/

## Let's Encrypt

https://letsencrypt.org/2015/09/14/our-first-cert.html

## Save Crypto

http://savecrypto.org/

## E Vai Melhorar!

- TFO (tcp fast open)

## TODO para sysadmins

-   Atualize para o último kernel (várias melhorias quanto ao TCP)
-   atualize para o último OpenSSL (lembra do heartbleed?)
  -   browsers em geral não utilizam OpenSSL mas outras coisas (verificar quais) usam
-   atualize seu servidor

## FAQ

https://www.youtube.com/watch?v=cBhZ6S0PFCY A partir dos 9 min

1.  Os certificados são caros?

Single host?
Multi-domain?
Wildcard?

free non-commercial - StartSSL
free open-source projects - GlobalSign
commercial multi-domain

3.  Como testar HTTPS localmente?

http://tech.finn.no/2015/09/25/setup-nginx-with-http2-for-local-development/

2.  Como configurar no servidor?

Mozilla Server Side TLS: [](https://wiki.mozilla.org/Security/Server_Side_TLS): Apache, Nginx, HAProxy, AWS

3.  Como sei que segui as configurações corretamente?

SSL-Labs: bateria de testes, da um score e dicas de como melhorar.

2.  Meu site ficará lento? Overhead no CPU ?

Assimétrico: caro ==> realizado no momento do estabelecimento da conexão ==> devemos reaproveitar (Keep Alive - reuse the same connection between various requests, apenas 1 handshake - e Server Resumption - renegocia os parametros de conexão anterior). No fim das contas em sites grandes como twitter o aumento em uso de CPU foi negligenciável.
Simétrico: barato.

No início grandes sites empregavam hardware específico para isso (verificar). Hoje em dia, como dito por Doug Beaver do Facebook é Ok fazer tudo direto com máquinas de propósito geral.

5. Como verificar se meu site está lento?

webpagetest --> ajuda MUITO a entender os problemas de performance relacionados a rede para diversos cenários.


6.  Redirect old HTTP links to HTTPS resources (301 redirects)

use rel=canonical

- pode haver bookmarks ou compartilhamento de url com o uso de HTTP ao invés de HTTPS

(mas tente evitar! é muito doloroso para os usuários de celular, latência lá é muito alta! Use HSTS que faz com que o browser automaticamente redirecione os requests para HTTPS para o site e os subdomains (se especificado)).

3.  E o HTTP2? Ouvi dizer que precisa de HTTPS para usar HTTP2. Porquê?

Remove problemas com proxie, firewall e outros intermediários que esperam HTTP1.1.

3.  Quais são as melhores práticas no client?
  3.0 usar 'protocol relative URIs' ('//') -> mais fácil para testar localmente.
  3.1 verificar hostname, certificate chain e se está expirado (ssllabs ajuda)
  3.2 atualizar o conteúdo do site para requisitar apenas conteúdos com HTTPS
  3.3 atualizar links internos para páginas HTTPS
  3.4 verificar robots.txt e outros sinais
  3.5 configurar redirecionamentos corretamente e adicioanr HSTS

  3.6 Usar testes como SSL-Labs e Google Webmaster Tools
4.  Como eu migro o conteúdo atual?
5.  Como o torno mais amigável em termos de busca?
6.  Erros comuns?
7.  CDNs ?
8.  Compatibilidade com browsers antigos


## Recursos

### Livros

topdown networking
openssl
bullet-prof tls

### Talks

### Articles

[Google - HTTPS Everywhere](https://www.youtube.com/watch?v=cBhZ6S0PFCY)
[Is TLS Fast Yet?](https://istlsfastyet.com/)
[Save Crypto?](https://savecrypto.org/)

[Google Security - HTTPS as a ranking signal](https://googleonlinesecurity.blogspot.com.br/2014/08/https-as-ranking-signal_6.html)

[EFF -Encrypt the Web](https://www.eff.org/pt-br/encrypt-the-web)

[Mozilla Deprecating Non-Secure HTTP](https://blog.mozilla.org/security/2015/04/30/deprecating-non-secure-http/)
