---
title: Routing Algorithms
author: Ciro S. Costa
date: 05 Nov, 2015
---

# Dijkstra

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

custo de             custo de x a v    distancia
x para y
```

Dado um conjunto de ddestinos, um roteador de tempos em tempos terá um conjunto de `d_x(y)` (vetor de distância).

Para cada nó:

```
1. espera por mudança nos custos
2. recalcula as estimativas
3. se seu vetor de distância mudou, envia para os vizinhos
```

- Vale notar que é necessário que haja um passo inicial destinado ao processo de descoberta das interfaces adjacentes. É também importante que o protocolo seja respeitado em todos os nós da rede.
