---
title: 'Ch.6: WiFi'
author: Ciro S. Costa
date: Jul 16, 2015
description: ''
tags: [networking, wifi]
published: false
---

The IEEE 802.11 standards were primarily an adaptation and extension of the existing Ethernet (802.3) standard. While the last is referred as LAN std, the primer is well known as WLAN.

They all treat the shared medium (wire or radio waves) as a *random access channel*, meaning that there is no central process or scheduler that controls who or which device is allowed to transmit data at any point in time. WiFi relies on a probabilistic approach for doing this. If the channel load is below 10% then any explicit coordination or scheduling might be required (good throughput).

In summary, WiFi:

- provides no bandwidth or latency guarantees or assignment to its users
- provides variable bandwidth based on signal-to-noise in its environment
- has a limited amount of spectrum in 2.4GHz and 5GHz bands
- access points overlap in their channel assignment by design
- access points and peers compete for access to the same radio channel.

Because we can't predict the available bandwidth, we can and should adapt based on continuous measurement through techniques such as adptative bitrate streaming, which is a perfect match for long-lived streams such as video and audio content.
