---
title: 'A Scheduler Simulator'
author: Ciro S. Costa
date: 13 Sep, 2015
---

# What is a scheduler?


# `schedsim`


## Main Execution

1.  **Parse the trace file into a list of traces**, which are represented by the `sm_trace_t` structure internally.

  1.1 The **trace** structure represents **all of what a process needs** in the context of a scheduler: its **initial time** (when it gets into the system), the process name, the **estimated duration** (some scheduling algorithms rely heavily on this - in some circumstances it's a plausible thing to assume that we know in advance what is the estimated time for a job), its **deadline** and its **priority**. More than that, some **extra fields regarding which CPU the process** are attached to, for example a **semaphore that enables us to pause** the process (in order to preempt), remaining execution time and a boolean flag that tells whether the process is blocked or not.

  1.2 By the time the **process finishes** what it has to do it writes some info regarding elapsed (real) time into another structure that it's linked to, the `sm_out_trace` and notifies the scheduler through a signal (`SIG_PROCESS_END`).

2. Based on cli args, pass the list of traces to the corresponding scheduler implementation.

Because we really want to simulate processes getting into the system at any time and then having the scheduler to decide on how to give processes access to CPUs by the time things are happening (new processes comming, other terminating and context switches happening), this 'process incoming' situation is simulated with POSIX per-process timer and a specific thread which deals with the signals generated by those timers. This is possible by designating such thread to the task of waiting for a very particular signal to happen: the incomming process signal. All other threads (the simulated proccesses) blocks this signal.

As a result of the way these signals are delivered, with such design we achieve something very pleasant: a queue of incoming processes comming to the scheduler at any time in way that seems like everything happens synchronously, even though that's definietly not the case. In the same way, when a process terminates another signal is generated (using `sigqueue`) so that we're capable of enqueuing that and dealing with it with the same benefits cited earlier.

In a general form, the system goes like this:

```
main:
  set the procmask to block on the signals the scheduler receives
  set the mask that will enable the scheduler to listen synchronously
               to a given signal(s)
  create a quantum timer (optionally)
  trigger the timers for the incoming processes

  while(there are traces):
    wait for a signal based on the mask
    switch (signal.signo) {
      case PROCESS_INCOMING:
        ...
      case SIGALARM (QUANTUM_TIMER):
        ...
      case PROCESS_TERMINATED:
        ...
    }
```

## A Process

The first time i thought about how i'd build this scheduler the process had a LOT of stuff to do. Basically a process would do all of the work and the scheduler would not need to exist. DEFINETLY not what we want. (it would also not work for more than 2 scheduling algorithms ...)

So, the idea is: the process is dumb. Regardless of the scheduler algorithm that we're using it will have to do some basic stuff without actually knowing which algorithm is managing the machine's resource for it. It only does 3 things: wastes some time, keeps track of how much time it wasted so far while executing and checks wheter it's blocked or not (being unblocked by a semaphore `post`).

```
user_process:
  gettime(start);
  waste_time();
  gettime(end);

  set_trace_out(trace)
  sigqueue(getpid(), SIG_PROCESS_END, trace)

waste_time:
 while (time_remaining > 0):
   while (trace_blocked)
     sem_wait(trace->sem)
   count up to 1e6
```

After it finishes, pushes a signal to the queue of signals of the current process (remembering, we're simulating processes in a process which spawns threads).


## The Scheduler

So far so good, here is where most of the magic starts to flourish. The scheduler is reponsible for three things: keeping track of the state of the machine's resources (i.e, processing units), processes that are willing to grab the fork (in the anology of dining philosophers, grab the amount of resources that it needs) and keeping track of the events that the whole system is generating (in our case, signals of incoming, terminating processes and quantum timers).

Processing Units are managed with simple list of pointer to traces (when a slot gets a pointer to a trace that CPU is considered 'in use' by that given process) and a counter. Blocked processes are generally managed by a queue (there's actually no requirement for that) and signal handling was explained before.

Each algorithm is then built on top of these primitives which allows them to assign resources to processes as they want.



