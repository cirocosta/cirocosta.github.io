---
title: Routing Algorithms
author: Ciro S. Costa
date: 05 Nov, 2015
---

# Algorítimos de Roteamento

## Dijkstra

Trata-se de um algorítimo que exige visão global da rede. Constrói caminhos de menor custo de  1 fonte a todos os outros nós.

Sendo rodado individualmente nos roteadores, não há troca de informações entre eles.

Notação:
```
C(i,j)    custo do enlace (i,j)
  D(v)    valor atual do custo do caminho do nó fonte até V
  P(v)    predecessor ao longo do camminho até V
    N'    conjunto de todos os nós cujo caminho já é conhecido

  --  critério de parada: N' possui todos os nós
```

Algorítimo para encontrar todos os caminhos de `u` até todos os outros roteadores (deve rodar o algorítimo então para cada roteador). Vale notar que haverão alterações nos custos de acordo com o contexto da rede. Eventualmente é interessante obter `k` melhores caminhos e não apenas 1, de modo a poder se aplicar algum tipo de balanceamento de carga de modo a não sobrecarregar apenas um caminho (ou refazer os cálculos toda hora).

```
// inicialização
N' = {u}
para todos os nós v:
  se v é adjacente a u ==> D(v) = c(u, v)
  cc. atualiza D(v) = inf, P(v) = u

// temos o custo de todos os vizinhos
repita:
  encontre w que não está em n' tal que D(w) seja um mínimo
  acresceenta w no N'
  atualiza D(v) para todos os nós adjacentes a w e não estejam em N' (e P(v))
    //  novo custo mantém o atual ou custo do enlace + custo do caminho até w
    d(v) = min(d(v), d(w) + c(w,v))
:até que todos os nós estejam  em N'
```

## Algorítimo Vetor de Distância

Diferentemente do anterior (de estado de enlace, de visão global) não se constrói uma tabela de roteamento para um roteador específico, mas busca-se criar uma tabela de roteamento única para todos rodando em todos os roteadores (exigindo sincronia dos nós). Trata-se portanto de um algorítimo distribuído que atualiza os vizinhos sempre que uma nova rota for encontrada.

É baseado na equação de Bellman-Ford:

```
      para todo `v` vizinho de `x`:


d_x(y)    =      min(    c(x,v)      +     d_v(y)  )
  |                         |                |
custo de             custo de x a v      distancia
x para y
```

Dado um conjunto de destinos, um roteador de tempos em tempos terá um conjunto de `d_x(y)` (vetor de distância).

Para cada nó:

```
1. espera por mudança nos custos
2. recalcula as estimativas
3. se seu vetor de distância mudou, envia para os vizinhos
```

- Vale notar que é necessário que haja um passo inicial destinado ao processo de descoberta das interfaces adjacentes. É também importante que o protocolo seja respeitado em todos os nós da rede.


## Multicast

In computer networking, multicast (one-to-many or many-to-many distribution[1]) is group communication[2] where information is addressed to a group of destination computers simultaneously.

1. Os nós que quiserem receber as mensagens precisam informar o interesse. Há IPs reservados apenas para isso. Quando não desejar mais fazer parte da rede, deve informar ao roteador sua intenção de deixá-la.

2. Os roteadores precisam suportar o multicast: eles tem um papel importante que é o de duplicar os pacotes. Precisam ser configurados para um grupo multicast. Uma vez configurados, os roteadores formam uma árvore da origem aos destinos copiando os pacotes quando necessário.

3. As comunicações são chamadas de grupos multicast. Há um endereço IP associado mas o roteamento é diferente.

Vale notar que no lado de quem envia é como se estivesse enviando para apenas um endereço (gargalo não fica em seu lado).

> Group communication may either be application layer multicast[2] or network assisted multicast, where the latter makes it possible for the source to efficiently send to the group in a single transmission. Copies are automatically created in other network elements, such as routers, switches and cellular network base stations, but only to network segments that currently contain members of the group.

>  the full range of multicast addresses is from 224.0.0.0 to 239.255.255.255. Since multicast addresses represent a group of IP devices (sometimes called a host group) they can only be used as the destination of a datagram; never the source. Multicast addresses in IPv6 have the prefix ff00::/8.

Vale lembrar que é também fullduplex, sendo possível então que cada nó envie dados para toda a rede.


