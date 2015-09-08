---
title: 'Inside Nginx'
author: Ciro S. Costa
date: 04 Sep, 2015
---

- focuses on high perf, concurrency and low memory usage.
- aims at c10k (10k users simultaneously) problem.
- the required amount of concurrency just grows and grows, caused by a combination of mobile clients (connections that take time to end) and new applications w/ persistent connections.
  -   browsers open 6 connections per website to speed things up
- it is in the webserver that client connections are accepted and processed.
- apache, e.g, used to fork its processes for each new connection. This imposes a linear scalability, which is not desirable (we need a nonlinear, 'log-a-like').
- nginx is event-based.


## Architecture

- Traditional approach: spawn a thread or process for each connection, then block on network or IO ops. --> requires preparation of a new runtime env, heap and stack mem as well as an execution context (even though threads are fast it requires an entire execution context) - not to mention that it hurts CPU cache locality and increases memory footprint considerably.

(remember the two types of reference locality: temporal and spatial ==> temporal refers to reuse of data in a small time duration. Spatial refers to the use of data elements within close storage locations.

- nginx: modular, event-driver, async, single-threaded, non-blocking architecture.
  -   uses multiplexing and event notificatins heavily.
  -   specific tasks to separate processes.
    -   connections are processed in a highly-efficient run-loop in a limited number of single-threaded processes (workers). Each worker then handles many thousands of concurrent connections per second.

- workers includes core and functional modules
  -   core runs a tight loop
  -   sections of specific modules' code are executed on each stage of request processing.
    -   modules (compiled) constitute presentation and application layer, performing read, writes, filtering, other BI logic.

- for the event-driven and multiplexing part, `kqueue`, `epoll` and `event ports` are used.


### Event Driven stuff in Linux/FreeBSD

Maintaining a bignum of threads is not trivial for the kernel as said before.


#### `kqueue`

> scalable event notification interface introduces in FreeBSD. Provides efficient IO event pipelines between the kernel and userland. It's not restricted to file descriptor events, but also file monitoring, singls, async io events, child process state monitoring and timers. `epoll` is an alternative on Linux that does not support `kqueues`.


#### `epoll`


#### `event ports`




## Resources

- http://www.aosabook.org/en/nginx.html
