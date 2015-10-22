---
title: 'Linux Files'
author: Ciro S. Costa
date: haush
tags: [OS, linux, files]
description: ''
published: false
---

*File System*

:   is a system that **formalizes how data is stored and retrieved**, by separating data into individual pieces and giving each piece a name and other metadata.

    **Files** are **logical units of information created by processes**. They provide a way of storing information on the disk and read it back later, shielding the user from the details, **abstracting of how and where the information is store and how the underlying disk works** - be a CD, SSD or a pendrive.

Along with the abstractions of processes and address spaces, files are one of the most important concepts regarding operating systems (i.e, one of the key pieces for providing the abstraction of the underlying machine and management of resources).

Without a file system, processes would be restricted to storing information within their virtual address space. That sucks as we'd end up with:
- very restricted storage,
- volatile,
- unable to provide universal access.

In other terms, with a FS we aim to:
- store large amount of data,
- 'eternal' survival time for stored data
- possibility of accessing it from multiple processes

UNIX has the concept of 3 different kinds of files: **regular**, **directories**, **block special files** and **character special files**.

**Regular files**
:   contains general information stored in a regular unstructured sequence of bytes without a particular meaning, providing maximum flexbility.

**Directories**
:   corresponds to system files for maintaining the structure of the file system. This varies from file system to file system.

**Block Special Files**
:   are used to abstract disks which provide random access to its content.

**Character Special Files**
:   use to abstract devices which operate in a serial way (generally, IO stuff).


## Ext4

In my machine (`Linux 3.16.0-50-generic #67~14.04.1-Ubuntu SMP x86_64 x86_64 x86_64 GNU/Linux`) the filesystem i use (and if you're under Ubuntu you might use as well) is Ext4, which features:
-   support for 1EB (1024 PB) of data
-   unlimited number of subdirectories
-   use of multiblock allocation  // TODO
-   use of extends                // TODO
-   delayed allocation: delays the allocation of blocks when a process `write()`s, giving the block allocator the opportunity of optimizing the allocation, improving fragmentation and letting it take advantage of `extends` an multiblock alloc.
-   fast `fsck`


*fsck*\*
:  (filesystem check) is an utility used to check and optionally repair one or more Linux filesystems.




