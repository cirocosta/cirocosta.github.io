---
title: 'Back to the Basics - Networking 101 e o Frontend'
author:
- name: Ciro S. Costa
  affiliation: University of São Paulo
tags: [networking, web, talks]
date: 16 Sep, 2015
abstract: |
  HTTP2 já está aí (ver estatísticas)
---

# Rationale

Assim como há bastante tempo atrás o ponto que eu buscava fixar em uma palestra era o de que é importante se desenvolver uma cultura de testes para o desenvolvimento web (à época ficavam mais conhecidas as bibliotecas QUnit, mocha, karma, etc), eu acredito que para perf, assim como inclusive acessibilidade, o mesmo vale: devemos carregar desde o início do desenvolvimento de nossas aplicações os princípios para que no final consigamos ter um bom resultado `by default`.

*GANCHO*: Para isso precisamos voltar às raízes e entender os conceitos que estão por trás. Somente conhecendo esse sistema complexo que lidamos no nosso dia-a-dia conseguimos então identificar os motivos por trás das melhorias que têm sido apresentadas ultimamente com a introdução do HTTP2 e como alguns dos princípios que até então utilizávamos como best practices passam a cair por terra.

## As bases da Internet

// TPN 1chp

**Network Topology**

:   is the arrangement of the various elements of a computer network. It's the **shape** of it [ciro].

- nós burros e nós inteligentes


*GANCHO*: Para tornar a visualização disto mais fácil e possível de demonstrar, podemos então definir uma topologia simplificada da rede

### Topologia simplicada

Como exemplo de topologia, define-se um modelo simplificado a ser levado e extendido por toda a apresentação.

```
      -       CO      // openflow controller
dumb  |        |
      |        S1      // kernel switch
      -       / \
             /   \
      -     /     \
smart |    H1     H2   //  hosts
      -
           /\      /\
         server  client
```

- topologia default com mininet: 2 hosts, 1 controller e 1 switch


*GANCHO*: tudo muito complexo? Estrutura hierárquica

###  Estrutura Hierárquica

Divisão clara de responsabilidades: pacotes são tratados aé chegar ao layer mais baixo.

```
4.  Aplicação     (http, ftp, smtp, dns ...)
3.  Transporte    (tcp, udp)
2.  Rede          (...)
1.  Físico        (...)
```

// rationale por tras disto.

Assim como se diz que em Javascript não se preocupa com tipos, no final das contas todos nós nos preocupamos (mamilos): você escreve uma função que recebe um argumento e acaba validando se é de um tipo desejado (~~hoje em dia da pra fazer isso de maneira mais elegante com decorators, mas não cabe a mim falar sobre isso~~). O mesmo vale quanto às preocupações relativas à arquitetura de redes: teoricamente apenas Aplicação e Transporte estão ao nosso cargo, porém devemos compreender os problemas das camadas mais abaixo: conexão sem fio, alta perda de pacotes, etc.



# E agora?

## Livros

Três são os livros que eu recomendo que sejam lidos sobre o assunto, com eles ordenados quanto à relevância a um programador frontend.

// TODO arrumar os nomes

1. High Performance Browser Networking, Illia Grigorick

O livro do Illya é **extremamente importante** aos devs frontend pois mais do que explicar com bastante detalhe esse conteúdo que passei, ele inclui diversas dicas nos final dos capítulos, deixando bastante claro otimizações que devem ser feitas tanto no lado do servidor qunato no lado do client. É um must-have que na minha opinião todo dev que se relacione com a web deve ter contato uma vez pelo menos.

(extra): parte sobre http2 atualizada e disponível gratuitamente

2. Networking Top Down Approach, Khurhsko

Esse se trata de um livro introdutório de redes que alguns cursos utilizam como base, como por exemplo no curso de redes que fiz, acredito que seja uma boa referência para alguém que está com mais curiosidade sobre camadas mais abaixo que aplicação e transporte, ou busque algum detalhamento maior das coisas em geral.

3. Unix Network Programming, Stevens

Foca bastante em desenvolvimento em C, é uma boa referência para quem quiser se arriscar a mexer com socket diretamente, tendo todo o controle low level com chamadas de sistema e tal, acho excelente caso queira de fato entender quais são as dificuldades por trás de um servidor ou cliente que realize comunicação na web. Não recomendo a frontends que não tenham experiência mais profunda com Unix e baixo nível.

## Seja curioso!

Cada vez mais os browsers nos disponibilizam APIs para acessar informações sobre diversos aspectos do browser de modo que possamos otimizar nossas aplicações. Vá atrás dessas ferramentas, os dev rels vivem de falar sobre isso e há muuito o que aprender com base nisso.


# Obrigado!

twitter: @cirowrc
github: github.com/cirocosta


## TODO

- analogia: máquinas como complexos de logística
- analogia: sockets como as portas do complexo
- browser inside a mininet host: https://mailman.stanford.edu/pipermail/openflow-discuss/2013-April/004493.html
- server inside mininet: https://mailman.stanford.edu/pipermail/mininet-discuss/2014-September/005053.html
- introduction to mininet: https://www.youtube.com/watch?v=jmlgXaocwiE
