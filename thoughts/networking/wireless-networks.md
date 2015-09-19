---
title: 'Ch.5: Introduction to Wireless Networks'
author: Ciro S. Costa
date: Jul 13, 2015
---

--------------------------------------------------------------
Type                     range       standards
----------------------   -------     -------------------------
PAN                      person      bluetooh,zigbee, nfc
personal area net                  

LAN                      campus      IEEE 802.11 (wifi)
local area net                     

MAN                      city        IEEE 802.15 (WiMAX)
metropolitan area net              

WAN                      world       Cellular (UMTS, LTE ..)
wide area net                      
-------------------------------------------------------------

Regardless of the name, the two fundamental constraints on achievable data retes are the amount of available bandwidth and the signal power between the receiver and the sender.

In the world of radio communication the *shared medium is radio waves* (wregulated ti yse soecufuc badwidth frequency ranges and transmit power rates). Both the sender and the receiver must agree on the specific frequency range over which the communication will occur. The most important performance factor in such communication is the size of the assigned frequency range. The overall channel bitrate is directly proportional to the assigned range. Even though high-frequency signals can transfer more data, they won't travel as far. 

The second fundamental limiting factor in all wireless communications is the signal power between the sender and receiver (S/N ratio, SNR) - a measure that compares the level of desired signal to the level of background noise. To improve this we can either increase the transmit power of decrease the distance between the transmitter and the receiver. The channel is always subject to continuously changing background noise and inteference.

Two problems arise:
- *Near-far problem*: a receiver captures a strong signal and thereby makes it impossible for the receiver to detect a weaker signal
- *Cell-breathing*: condition in which the distance of the signal expands and shrinks based on the cumulative noise and interference levels.

The efficiency of the modulation (digital to analog conversion) algorithm also dictates the capacity of a wireless channel.

## Summary

Factors that **will** affect the performance:

- distance between receiver and sender
- background noise in the location
- interference from users in the same network (intra-cell)
- interference form users in other, nearby networks (inter-cell)
- available transmit power, both at receiver and sender
- amount of processing power and chosen modulation scheme

Regarding latency: very tied to the specific technology in use.



