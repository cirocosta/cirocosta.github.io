---
title: 'Debugging and Profilling OS C code'
author: Ciro S. Costa
date: 23 Aug, 2015
tags: [OS, debugging, C]
description: ''
published: false
---

This semester i've started some more advanced classes in CS: Operating Systems and Networking. Something i miss from web stuff is good profiling and debugging. In the web environment we have great tools nowadays (which are getting better and better!). You often see a blog post here and there talking about new devtools features that browser implementors add to their software. But, comming to C (specially in a Linux environment) i felt that i wasn't capable of debugging those pieces of code that i was writting. **I was terribly wrong**.

There's an abbundancy of tools for analysing low level code! You can even jump into raw assembly (dissasembled), perform all sorts of analysis based on function calls, etc. Here are some things that i learned.

The questions i want to answer here are:

-   how am i capable of debugging *multithreaded code*?
-   how am i capable of debugging *multiprocess code*?
-   how am i capable of analysing *algorithm efficiency*?
-   how am i capable of debugging *networking stuff (sniffing, dns, routes, ...)*?
-   how am i capable of debugging *computer graphics (opengl) code*?

**ATTENTION:** this is a WIP.

## Preparing a test suite

## Tools

### Network

#### Wireshark

#### dig

#### traceroute(6)

#### ping(6)

### General

#### gdb breakpoints

#### gdb - debugging signals

#### address sanitizer
- clang's fsaniteze-addr

#### memcheck

#### strace and ltrace

### Profiling

#### gprof

#### callgrind

#### kcachegrind

### Presenting your results

- [gprof2dot](https://github.com/jrfonseca/gprof2dot)
- kcachegrind output to dot or image

