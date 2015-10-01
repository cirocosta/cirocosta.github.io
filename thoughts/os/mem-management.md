---
title: 'Memory management'
author: Ciro S. Costa
date: 14 Sep, 2015
---

## Swap

Compactação de memória:

Ao se realizar tal operação é preciso se lembrar que não basta apenas alterarmos na memória a localização dos processos, mas também alterar na estrutura de dados interna do SO as entradas relativas ao posicionamento do processo (p.ex, nova base).

## Gerência de Espaço Livre

### Unidades de Alocação

Cada posição de memória tem um determinado espaço. Unidades maiores implicam que para ocupar o espaço exato da memória necessária o processo precisa ter um tamanho que seja múltiplo do tamanho da unidade de alocação. Caso contrário irá disperdiçar memória.

Em contra partida, unidades de alocação maiores reduzem o overhead de espaço necessário para manipular a memória pois com menos bits é possível mapear toda a memória.


### Mapa de Bits

Conjunto de bits marca como esta cada endereço da memória. 1 se ocupada, 0 se livre. Seu tamanho é proporcional ao total de memória e inversamente proporcional ao tamanho da unidade de alocação.

Problemas:

-   não é proporcional ao número de processos
-   busca custosa já que encontrar N unidades livres exige que seja feita a busca por espaço livre e depois conte se a partir de tal ponto há N-1 unidades também livres.


### Lista Encadeada

// TODO

## Overlays (anos 60)

Interessante que o SO consiga executar até mesmo programas que ocupem mais espaçço que a memória livre no momento. Deve ser possível separar a memória dos processos em partes (se não poderíamos simplesmente usar swap. Acontece que com swap a unidade mínima é um processo inteiro). Outro fator importante é o de que o acesso ao disco não é tão rápido quanto o acesso à memória (portanto copiar um processo inteiro é inviável). Precisa-se reduzir a granularidade do que está em memória e do que está em disco.

Divide-se o programa em *overlays*. Ao iniciar o programa carrega-se apenas o gerente de overlays, responsável de rodar o overlay 0. Ao passo que um overlay termina de rodar, carrega o próximo sobre o anterior (sobreescrevendo) ou em outras posição de memória caso houvesse espaço livre.

Overlays ficavam em disco e swap era usado para carregar as pequenas partes do programa. Desta forma era possível ter um programa maior que a memória executando.


### Ideia memória virtual

> The primary benefits of virtual memory include **freeing applications from having to manage a shared memory space**, increased security due to **memory isolation**, and being able to conceptually **use more memory than might be physically available**, using the technique of **paging**. It also makes application programming easier by **hidding fragmentation of physical memory**.

Fornecer a cada programa seu próprio espaço de endereços, sendo tal espaço quebrado em páginas.

Cada página trata-se de uma faixa contigua de endereços.

Cada página fica em uma dada posição de memóoria física (mas nem todas precisam estar na memória principal ao mesmo tempo). No momento que o programa faz referência a um endereço (virtual) o SO faz a tradução automaticamente para uma posição na memória física com base nas informações do processo (base) e da memória virtual. Dois cenários possíveis:
-   página já está na memória física
-   page fault. SO é informado, copia o endereço do disco para a memória principal, altera o present bit, re-executa a instrução que falhou (dando oportunidade a outros processos durante esse tempo de cópia).

Paginação trata-se de uma implementação do conceito de memória virtual.


> "Systems can have one page table for the whole system, separate page tables for each application and segment, a tree of page tables for large segments or some combination of these. If there is only one page table, different applications running at the same time use different parts of a single range of virtual addresses. If there are multiple page or segment tables, there are multiple virtual address spaces and concurrent applications with separate page tables redirect to different real addresses."

. Paging supervisor

This part of the operating system creates and manages page tables. If the hardware raises a page fault exception, the paging supervisor accesses secondary storage, returns the page that has the virtual address that resulted in the page fault, updates the page tables to reflect the physical location of the virtual address and tells the translation mechanism to restart the request.

When all physical memory is already in use, the paging supervisor must free a page in primary storage to hold the swapped-in page. The supervisor uses one of a variety of page replacement algorithms such as least recently used to determine which page to free.

see https://en.wikipedia.org/wiki/Virtual_memory
