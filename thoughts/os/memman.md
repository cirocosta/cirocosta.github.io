---
title: memman - A memory management simulator
author: Ciro S. Costa
date: 18 Out, 2015
tags: [OS, debugging, C]
description: ''
published: false
---

# EP2

```slide
SO - Ciro S. Costa
8071488
```

De modo bastante resumido, a arquitetura do simulador foi pensada visando alta modularização e pouca interdependência entre os módulos de modo que os diferentes componentes pudessem ser testados separadamente e então o simulador se tratasse apenas de um agregados de contexto que reúne então o estado necessário para os módulos agirem em conjunto. A divisão destes foi de 'estruturas de dados burras' e 'componentes', que tomam proveito das estruturas de dados.

São os módulos:

- Data structures:
  - `dllist` (doubly linked list),
  - `queue` (fila)

- High level components
  - `simulator`
  - `memory`
  - `mmu `
    - `vpage`
  - `process`
  - `seglist`
    - `segment`


### Simulador (`simulator`)

```slide
- Responsável pelo contexto
- Armazena
   -  memória física e virtual (responsáveis por manipular os binários)
   -  indicações dos algorítimos a serem utilizados (respectivamente, substituição de página e memória livre)
   -  processos
   -  segmentos (gerenciamente dos espaços na memória virtual)
   -  MMU (tradução dos endereços)
```

Responsável pelo contexto - i.e, informação referente às configurações que o usuário carregou no `prompt` de acordo com os comandos de carregamento de arquivo de trace, especificação do algorítimo de substituição de página e o algorítimo de gerenciamento de espaço livre - e a execução de uma instância de simulação dado o contexto armazenado.

Os componentes de memória são os responsáveis de manipular os arquivos `mm.vir` e `mm.mem`, fornecendo uma API de escrita por 'ranges' e encapsulando criação e destruição dos mesmos. O processos contém um tamanho, seu nome e uma lista de acessos que serão realizados futuramente. A MMU e os segmentos serão explicados em breve.

Para simular um sistema onde processos chegam em determinados instantes de tempo e o mesmo deve reagir a isso, utilizei o conceito de eventos e handlers, responsáveis por reagir a esses eventos. Desta forma, para cada processo o simulador registra dois timers que serão responsáveis por disparar eventos no sistema. `PROCESS_NEW` e `PROCESS_END` são os eventos que ditam a criação e término dos processos. A coordenação deste disparo é então feita através do uso de POSIX Signals.

Quando recebe `PROCESS_NEW`: processo chegou no sistema, é necessário que o mesmo seja colocado na memória virtual. Nessa hora age o algorítimo de gerenciamento de memória livre para conceder ao processo espaço na memória virtual (isto é, uma `base` e um `length`) representado por um `segment`.

ps: Caso o algorítimo de substituição de página dependa de `resets` periódicos, como é o caso do `SCP` e do `NRU`, um timer de `quantum` é registrado para periodicamente engatilhar o evento `QUANTUM` para realizar tal operação.


### Segmentos (`segments`)

```slide
- Responsáveis por manusear a memória livre e memória de processos
- Armazena:
  - duas listas: uma para processos e outra para segmentos livres
  - algorítimo de gerenciamento (referência à função a ser chamada para gerenciar as listas no momento de adicionar ou remover um processo do sistema)
- Dois métodos principais:
  - `seglist_add_process()`
  - `seglist_free_process()`
```

Para decidir qual segmento de memória virtual conceder ao processo que seja feita a busca por espaço para o processo. Ao invés de fazer como na aula (uma lista ligada que armazena processos e espaços de memória livre) fiz como a sugestão do Tanenbaum: duas listas duplamente ligadas, sendo uma para processos e outra para os espaços livres de modo que a busca por espaço livre seja bastante ágil, perdendo em performance na remoção do espaço antes ocupado por um processo fosse mais trabalhoso que no outro modo (dado que agora opera-se com duas listas).

Dois são os métodos 'públicos' que dão toda a funcionalidade dessa estrutura: `seglist_add_process()` e o `seglist_free_process()`.


```c
mm_segment_t* mm_seglist_add_process(mm_seglist_t* list, mm_process_t* process)
{
  mm_segment_t* process_seg = NULL;
  mm_segment_t* free_seg = list->algorithm(list->holes->next, process->b);
  ASSERT(free_seg != NULL, "virtual memory must not be full");

  process_seg = mm_segment_create(free_seg->start, process->b);
  process_seg->process = process;

  mm_dllist_t* proc_b4 = _search_b4_start(list->processes, process_seg->start);
  mm_dllist_insert_after(proc_b4, process_seg);

  free_seg->length -= process->b;
  free_seg->start += process->b;

  return process_seg;
}
```

No primeiro método (`add_process`) é onde o algorítimo de gerenciamento de memória livre age, dado que ele é o responsável por realizar a busca de espaço para ser alocado. No segundo método é feita apenas a liberação de segmento cobrindo os casos que examinamos em aula.


### MMU

```
- É responsável pela tradução `(vaddr) -> phys_pos`
- Armazena:
  - qtd page frames; page frames vazios
  - qtd pages; pages;
  - tamanhos em bits (offset, page, page frame)
  - algorítimo de substituição de páginas (`pagesubst_alg`)
```

Com o processo já no sistema, registra-se então os eventos de acesso correspondentes ao mesmo para serem disparados no sistema de acordo com o arquivo de trace.

No momento em que é disparado o evento de acesso é a hora então que a `MMU` entra em ação através da execução de sua rotina principal: `mm_mmu_access(position)`.

A rotina faz exatamente como indicado no livro: obtem os bits correspondentes à página dado o endereço virtual e isola o offset para ser passado de maneira transparente ao resultado do mapeamento mais em breve. Primeiro faz-se a checagem da presença da página na memória física. Se está presente, basta somar o offset ao page frame mapeado.

Caso o bit que indica a presença não esteja 'settado', entra em jogo o algorítimo de substituição de página que trata então de substituir a página internamente. Feito isso, executa novamente a rotina.

