---
title: Filesystems
author: Ciro S. Costa
date: 05 Nov, 2015
---

## Arquivos Regulares

### Texto Puro

- arquivo universalmente decodificável que pode ocupar muito espaço
- contém caracteres imprimíveis (desde que saiba-se do encoding exigido)
- uteis para fazer conexão entre processos via pipe (desde que ambos os programas esperem o mesmo tipo de codificação)

(ver mais sobre [utf8](https://en.wikipedia.org/wiki/UTF-8) e entender como que o mesmo pode lidar com variable-length characters).


### Arquivos Binários

Na grande maioria das vezes vai conter um programa a ser executado, possuindo estrutura pré-estabelecida pelo programa que cria/abre o arquivo.

Binários executáveis (binários que contém programas) precisam de um cabeçalho (para identificar corretamente que o arquivo pode ser executado), o código e dados.

ps.: magic numbers costumam ser usados para identificar o tipo de arquivo a ser rodado.


## Acesso aos arquivos

Sequencial: para ler o final do arrquivo era necessário passar fisicamente por todas as posições anteriores (fazia sentido na época de fitas magnéticas)

Aleatório: para ler o final de um arquivo é possível ir direto ao pponto usando funções que acessam posições específicas desse arquivo (um bloco específico).

Atributos:
- proteção <=> permissão (Leitura, Escrita e Execução)
- proprietário
- grupo
- instante de tempo de criação (útil p/ busca)
- instante de tempo de último acesso (muito importante para segurança)
- instante de tempo da última modificação
- tamanho em bytes

(atualizar as máquinas que administra é extremamente importante, principalmente no caso de análise forense - fuso horário também é muito importante!).

ps.: últimos 3 são os chamados ACM (Access, Creation, Modification)


## Operações com arquivos regulares

- Criar arquivo vazio: `touch`
- apagar arquivo: `rm`
- abrir (pre-carregar atributos do arquivo na memória): `fopen`
- fechar: `fclose`
- ler: `fread`
- escrever: `fwrite`
- anexar: `open` com atributo de `append` (`O_APPEND`)
- navegar: `fseek`
- obter atributos do arquivo: `stat`
- renomear: `mv`

ps.: mesmo que `stat` ou `ls` eventualmente não mostrem a data de criação, isto não significa que o `ext4` (FS em uso, no meu caso) não armazena tal informação.

```sh
sudo debugfs -R 'stat <$(INODE_NUMBER)>' /dev/sda4
```

## Organização dos Discos

Um disco pode contar vários sistemas de arquivos independentes (uma ou várias partições).

```

                    sistemas de arquivos
master boot  |---------------------------|
    record
      |
    +---+----+---------------------------+
    |MBR| PT | ext4 | ext4 | xfs | fat32 |
    +---+----+---------------------------+
           |                  |
       partition           |-----|
         table             partição
```

Um disco contém vários setores. Setor 0 contém o MBR (Master Boot Record), que contém o código a ser carregado no boot do computador (chamadas pela BIOS).

Na maioria das vezes, o código da MBR le o primeiro bloco de uma partição e o executa, incializando o SO ali contida.

```
    /------------------- PARTIÇÂO ----------------/

    +--------------------------------------------+
    |BB | SB | FSM | FI | root  |  FILES & DIRS  |
    +--------------------------------------------+
```

BB (Boot Block): chamado pelo código que está na MBR, encontrado por meio da tabela de partições (PT).

SB (Super Bloco): guarda o magic number do sistema de arquivos, número de blocos, etc.

FSM (Free Space Management): bitmap ou lista de ponteiros

FI (File Info): No ext4, inodes


## Modulos vs Drivers e IO (kernel linux)

Dois casos: sistemama de arquivos novo em hardware conhecido (a) ou sistema de arquivos conhecido em hardwware novo (b)

a. precisamos **criar um módulo** para que seja carregado o sistema de arquivos para que o kernel consiga montar corretamente o sistema.

b. precisamos **criar um driver** novo que seja capaz de ler o hardware corretamente (e então um módulo do FS conhecido e presente no sistema trata de implementar as chamdas esperadas).


## Exemplo, disco SSD em Linux

```
     *-scsi
          logical name: scsi1
          capabilities: emulated
        *-disk
             description: ATA Disk
             product: SMART SSD SZ9STE
             logical name: /dev/sda
             size: 119GiB (128GB)
             capabilities: gpt-1.00 partitioned partitioned:gpt
             configuration: ansiversion=5 sectorsize=512
           *-volume:0 UNCLAIMED
                description: Windows FAT volume
                vendor: mkfs.fat
                physical id: 1
                bus info: scsi@1:0.0.0,1
                version: FAT32
                size: 45MiB
                capacity: 46MiB
                capabilities: boot fat initialized
                configuration: FATs=2 filesystem=fat
           *-volume:1
                description: Linux swap volume
                vendor: Linux
                logical name: /dev/sda2
                version: 1
                size: 3905MiB
                capacity: 3905MiB
                capabilities: nofs swap initialized
                configuration: filesystem=swap pagesize=4095
           *-volume:2
                description: EXT4 volume
                vendor: Linux
                logical name: /dev/sda3
                logical name: /
                logical name: /var/lib/docker/aufs
                version: 1.0
                size: 23GiB
                capabilities: journaled
                              extended_attributes
                              large_files huge_files dir_nlink
                              recover extents ext4 ext2
                              initialized
                configuration: created=2015-05-06 18:42:58
                               filesystem=ext4
                          lastmountpoint=/
                          modified=2015-11-04 08:45:27
                          mount.fstype=ext4
                          mount.options=rw,relatime,
                          errors=remount-ro,
                          data=ordered
                          mounted=
                            2015-11-04 08:45:27
                          state=mounted
           *-volume:3
                description: EXT4 volume
                vendor: Linux
                bus info: scsi@1:0.0.0,4
                logical name: /dev/sda4
                logical name: /home
                version: 1.0
                size: 92GiB
                capabilities: journaled extended_attributes
                              large_files huge_files
                              dir_nlink
                              recover extents ext4 ext2
                              initialized
                configuration: (..)
```

> a sector also known as a page is a subdivision of a track on a magnetic disk or optical disc. Each sector stores a fixed amount of user-accessible data


## Armazenamento de Arquivos - FAT - File Allocation Table

Cria uma tabela em memória para acadelerar as ações no disco.

Tenta eliminar as desvantagens de leitura no acesso com lista encadeada guardando os ponteiros de cada bloco em uma tabela em memória.

Terá uma lentidão inicial para carregar os ponteiros na memória mas depois fica vantajoso.







