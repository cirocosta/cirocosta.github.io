---
title: 'Proc and other utilities'
author: Ciro S. Costa
date: Aug 19, 2015
tags: [OS, linux, proc]
description: ''
published: false
---


## `lshw` - List Hardware

Lets you list detailed information on the hardware configuration of the machine: exact memory configuration, firmware version, mainboard configuration, cpu version and speed, etc.

## `free`

This command is useful to display the amount of free and used memory in the system at a given time.


## `/proc`

Stands for a pseudo-filesystem which provides an interface to kernal data structures. Each running process has a directory within it (`/proc/[pid]`) which contains other predefined directories and files that provide information about the running process (e.g, environment args, control group, command line, current working directory, coredump and others.

*Core Dump*

:   The default action of certain signals is to cause a process to terminate and produce a core dump file, which is a disk file containing an image of the process' memory at the time of termination (debuggable w/ gdb).

// TODO learn more about debugging a program w/ gdb using core dump info

It also contains files that are used by other applications to generate reports about the system (`free` consumes `/proc/meminfo` and `lshw` consumes `/proc/cpuinfo` and a bunch of others).

An interesting directory is the `/proc/self`, which is a directory that refers to the process accessing the `/proc` filesystem and is identical to the `/proc` directory named by the process ID of the process.


## `/dev`

// TODO

## `strace`

lets you trace system calls and signals. It interprets and records the system calls which are called by a process and the signals which are received by the process.


