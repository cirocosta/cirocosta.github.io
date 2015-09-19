---
title: 'Back to the Basics - Networking 101 e o Frontend'
author:
- name: Ciro S. Costa
  affiliation: University of São Paulo
tags: [networking, web, talks]
date: 16 Sep, 2015
abstract: |
  TODO
---

# Rationale

Dois são os rationales:

1. HTTP2 está aí

De um tempo para cá têm-se falado muito sobre hTTP2 e acredito que isto se tornará um assunto recorrente nos meios de discussão e na comunidade open source em geral. Com esse talk e todo o material de referência que pretendo passar busco prover a base para que se tenha noção da motivação por trás desses desenvolvimentos e como os rumos que a web tem tomado nos levou à necessidade de algo como o HTTP2, que já nem futuro é. HTTP2 já é o presente (verificar números).

(chrome e mozilla telemetry)


2. Perf Culture

![slide - perf culture](../assets/talk/perf-culture.jpg)

Assim como há bastante tempo atrás o ponto que eu buscava fixar em uma palestra era o de que é importante se desenvolver uma cultura de testes no contexto de desenvolvimento web (à época ficavam mais conhecidas as bibliotecas QUnit, mocha, karma, etc), eu acredito que para perf, assim como inclusive acessibilidade, o mesmo vale: devemos carregar desde o início do desenvolvimento de nossas aplicações os princípios para que no final consigamos ter um bom resultado `by default`.

*GANCHO*: Para isso precisamos voltar às raízes e entender os conceitos que estão por trás. Somente conhecendo esse sistema complexo que lidamos no nosso dia-a-dia conseguimos então identificar os motivos por trás das melhorias que têm sido apresentadas ultimamente com a introdução do HTTP2 e como alguns dos princípios que até então utilizávamos como best practices passam a cair por terra.

## As bases da Internet

![slide - O que é a internet?](../assets/talk/o-que-é-a-internet?.jpg)

Começo então com uma pergunta muito simples: o que é essa tal de internet?
Até então o que bastava para um frontend era:

![slide - Definição frontend de internet]()
- infraestrutura de fornecimento de serviços a aplicações distribuídas, cabendo ao programador apenas ter que aprender a invocar os serviços.

Simples: algo que contruo "em cima" e apenas espero que funcione.

Parece uma definição simplista mas ela resume muito bem a ideia de como se da o desenvolvimento de aplicações por meio de camadas de abstração. Quando analisamos por cima a topologia da rede, i.e, sua forma, verificamos a seguinte formação:

![separação borda e centro da rede](../assets/revisiting-13123/01-sepborda-e-centro.jpg)

### Borda

aplicações e hospedeiros. Executam programas de aplicação, como email, websites, etc.

É onde vive a camada do modelo cliente-servidor que acredito que todos aqui devem conhecer: cliente inicia um pedido, servidor processa e eventualmente responde; e também outros modelos, como p2p ou outros híbridos, que usam tanto o client-servidor quanto p2p.

### Centro

roteadores e redes de redes

(entre os dois: redes de acesso).


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

1. *High Performance Browser Networking, Illya Grigorick*

O livro do Illya é **extremamente importante** aos devs frontend pois mais do que explicar com bastante detalhe esse conteúdo que passei, ele inclui diversas dicas nos final dos capítulos, deixando bastante claro otimizações que devem ser feitas tanto no lado do servidor qunato no lado do client. É um must-have que na minha opinião todo dev que se relacione com a web deve ter contato uma vez pelo menos.

(extra): parte sobre http2 atualizada e disponível gratuitamente: http://hpbn.co/http2

2. *Computer Networking  - Top Down Approach, Kurose & Ross*

Esse se trata de um livro introdutório de redes que alguns cursos utilizam como base, como por exemplo no curso de redes que fiz, acredito que seja uma boa referência para alguém que está com mais curiosidade sobre camadas mais abaixo que aplicação e transporte, ou busque algum detalhamento maior das coisas em geral.

3. *Unix Network Programming - The Sockets Networking API, W. Richard Stevens, Fenner and Rudoff*

Foca bastante em desenvolvimento em C, é uma boa referência para quem quiser se arriscar a mexer com socket diretamente, tendo todo o controle low level com chamadas de sistema e tal, acho excelente caso queira de fato entender quais são as dificuldades por trás de um servidor ou cliente que realize comunicação na web. Não recomendo a frontends que não tenham experiência mais profunda com Unix e baixo nível.

## Seja curioso!

Cada vez mais os browsers nos disponibilizam APIs para acessar informações sobre diversos aspectos do browser de modo que possamos otimizar nossas aplicações. Vá atrás dessas ferramentas, os dev rels vivem de falar sobre isso e há muuito o que aprender com base nisso.


# Obrigado!

twitter: @cirowrc
github: github.com/cirocosta


## TODO

- analogia: máquinas como complexos de logística
- analogia: sockets como as portas do complexo
- falar sobre problemas de facilmente introduzer cache invalidation com o uso constante de concatenação
- falta de header compression: muito overhead de headers.
- browser inside a mininet host: https://mailman.stanford.edu/pipermail/openflow-discuss/2013-April/004493.html
- server inside mininet: https://mailman.stanford.edu/pipermail/mininet-discuss/2014-September/005053.html
- introduction to mininet: https://www.youtube.com/watch?v=jmlgXaocwiE
