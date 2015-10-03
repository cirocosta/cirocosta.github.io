---
title: E o HTTPS?
author: Ciro S. Costa
date: 03 Out, 2015
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Objetivo](#objetivo)
- [Rationale](#rationale)
- [Conceitos](#conceitos)
  - [Autenticação](#autentica%C3%A7%C3%A3o)
  - [Integridade dos Dados](#integridade-dos-dados)
  - [Criptografia](#criptografia)
  - ["Secrecy"](#secrecy)
- [Camadas de rede](#camadas-de-rede)
  - [Conexão](#conex%C3%A3o)
  - [RTT](#rtt)
  - [O que é HTTPS](#o-que-%C3%A9-https)
  - [Criptografia Simétrica](#criptografia-sim%C3%A9trica)
  - [Criptografia Assimétrica](#criptografia-assim%C3%A9trica)
  - [HTTP](#http)
  - [HTTPS](#https)
  - [Antes SSL](#antes-ssl)
  - [TLS](#tls)
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

# Objetivo

-   Tenha alguma ideia dos benefícios do HTTPs
-   Aqueles presentes que mantenham algum website façam sua parte e configurem seus servidores e clientes para utilizar HTTPS

# Back in the Old Days

Netscape Navigator, Júlio 1994 (sem release públic): SSL como meio de prover comunicação segura na internet. Busca: privacidade nas mensagens, integridade e autenticação mútua.

1999: RFC 2246  (TLS 1.0)
2006: RFC 2246  (TLS 1.1)
2008: RFC 2246  (TLS 1.2)

# Portas

Existe um registro internacional que mapeia as 'portas bem conhecidas'. Mais de 60 portas são especificadas para o uso de SSL/TLS, ex:

```
➜  cat /etc/services | grep SSL

https   443/tcp       # http protocol over TLS/SSL
nntps   563/tcp   snntp   # NNTP over SSL
ldaps   636/tcp       # LDAP over SSL
ftps-data 989/tcp       # FTP over SSL (data)
telnets   992/tcp       # Telnet over SSL
imaps   993/tcp       # IMAP over SSL
ircs    994/tcp       # IRC over SSL
pop3s   995/tcp       # POP-3 over SSL
suucp   4031/tcp      # UUCP over SSL
```

# Rationale

> TLS has exactly one performance problem: it is not used widely enough.
> Everything else can be optimized.

" All the communication should be secure by default "

não apenas banking e comércio, mas todos os meios de comunicação. Por mais que visualizando o conteúdo de apenas um site pareça que não seja um conteúdo relevante, ao olhar o agregado de todos os métadados pode-se ter com bastante clareza noção das intenções de um usuário.

Independente de qual seja o foco do site ou o conteúdo o dono do site não deve ser quem decide se o conteúdo é sensitivo àquela pessoa ou não. Fica à cargo do desenvolvedor tomar conta da privacidade do usuário.

É extremamente importante que você também proteja o seu site, não se quer que participantes inesperados o "estraguem".

Uma visita a um website por si só pode não ser de grande interesse para um atacante. O agregado revela muito mais. Você não quer contribuir para um ataque.

# Conceitos

Os três conceitos são muito importantes (devem existir em conjunto). Qual é o ponto de termos uma conexão criptografada com um atacante?

## Autenticação
"Estou de fato falando com quem o outro se diz ser?"
Garante que a conexão está sendo feita diretamente com o site e não com algum atacante que está segurou a conexão fingindo ser o servidor original.

-- Exemplificar com ataque MITM

## Integridade dos Dados
Será que alguém alterou os dados?
-- realizar um "ataque" local e tentar alterar dados de um pacote e então mostrar o resultado disso no browser. Usar mininet?

## Criptografia
Alguém pode ver minha conversa?

-- mostrar exemplo de pacote criptografado no wireshark





# Camadas de rede

```
aplicação |___HTTP = \   HTTPS!
sessão    |   TLS  = /
transporte
rede
físico
```

## Conexão

## RTT


## O que é HTTPS


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

## Chaves

### Como é uma chave?

## Certificados

### Como é um certificado

## HTTPS Everywhere

## Let's Encrypt

## Save Crypto

## E Vai Melhorar!

- TFO

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
