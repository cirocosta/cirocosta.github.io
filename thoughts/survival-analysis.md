---
title: Survival Analysis
author: Ciro S. Costa
date: 20 Oct, 2015
published: false
tags: [statistics]
description: ''
---

Análise independe do tempo de monitoramento (período) ser igual ou não. Busca estudar o fato de atingir ou não um determinado evento de interesse (e claro, quanto tempo demorou, caso atingido).

Tipicamente os dados se apresentam da forma:

```

 qtd     indica a
 tempo   ocorrencia
 até     do evento
evento   ou não
ou nao              variáveis explicativas
--------------------------------------
| time | status | x1 | x2 | ... | xn |
--------------------------------------
|  t0  |    1   |    |    |     |    |
|  t1  |    0   |    |    |     |    |
|  t2  |    1   |    |    |     |    |
|  ..  |   ...  |    |    |     |    |
|  tM  |    0   |    |    |     |    |
--------------------------------------
```

*Dados Censurados*

:   Dados para os quais o tempo até o evento crítico é não-conhecido

Em tais modelos devemos levar em consideração a censura (o não-evento marcado). Suas causas são:
-   não-termino do monitoramento
-   missing-values
-   de fato o evento desejado não ter ocorrido no período

A análise pode ser realizada para apenas um ou múltiplos grupos: no primeiro caso, examina-se a curva de sobrevivência acumulado para o mesmo, apresentando então as probabilidades estimadas de sobrevivência após o final de cada período. Caso hajam diversos grupos, curva de sobrevivência acumulada para cada grupo.

## Procedimentos

Dois são os possíveis procedimentos a serem utilizados dependendo de nosso interesse: Kaplan-Meier e Regressão de Cox.


### Kaplan-Meier

Procedimento para se criar tábuas de mortalidade a partir das quais avalia-se a probabilidade de um determinado indivíduo sobreviver a um determinado tempo. Como especificado a cima, necessariamente precisamos de duas variáveis especiais: `time` e `status`. A primeira indica o tempo até o evento (ou não-evento). A segunda, a censura ou ocorrência.

No STATA iniciamos a análise inicializando as variáveis indicadas e em seguida exibimos a life table:

```stata
. stset time, failure(status)
. ltable time status, survival
```


### Regressão de Cox


