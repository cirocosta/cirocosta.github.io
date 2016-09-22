---
title: 'Ch.1: Networking 101'
author: Ciro S. Costa
date: Jul 06, 2015
tags: [networking, latency, bandwith]
published: false
---

# Networking 101

For most websites, **latency** and not bandwidth is the performance bottleneck.

## Latency
> **Latency**: the time from the source sending a packet to the destination receveing it.

- *Propagation Delay*: Amount of time required for a message to travel from the sender to receiver (a function of distance over speed with which the signal propagates). Clearly there's a hard limit here as the speed of light is the maximum speed. There's also soft lights that are mandated by the material's refractive index. In fiber optics cables the light goes at about 200,000,000 m/s, corresponding to ~1.5 refractive index.
    - RTT (round trip time) is the length of time it takes for a signal to be sent plus the time it takes to be acknoledgled by the sender. Also known as ping time.

    - Here is where CDNs have great effect: by distributing the content around the globe and serving it from a nearby location to the client it allows a significant reduce in the propagation time of data packets.


- *Transmission Delay*: Amount of time required to push all the packet's bits into the link (function of the patcket's length and the data rate of the link)
- *Processing Delay*: Amount of time required to process the packet header, check for bit-level errors and determine the packet's destination (generally done in hardware nowadays).
- *Queuing Delay*: Amount of time the incoming packet is waiting in the queue until it can be processed. (when packets are arriving at a faster rate than the router is capable of processing).


## Bandwidth

> **Bandwidth**: Maximum throughput of a logical or physical communication path.

- *Last-Mile latency*: often the last few miles are those that introduce the most significant latency. That's because it's hard to connect the specific location of a house to the internet (lots of decisions regarding routing to be done).

Each fiber can carry many differente wavelengths (channels) of light through a process known as wavelength-division multiplexing (WDM). Hence, **the total badwidth of a fiber link is the multiple of per-channel data rate and the number of multiplexed channels**.

## Closing

To improve performance of our apps we need to architect and optimize pur protocols and networking code with explicit awareness of the limitcations of available badwdith and the speed of light: **we need to reduce round trips, move the data closer to the client, and build applications that can hide the latency through caching, pre-fetching and a variety of similar techniques, as explained in subsequent chapters**.











