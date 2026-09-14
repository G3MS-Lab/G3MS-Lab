---
title: "LockInMamba: Spatio-Temporal Architecture for Caregiver Localization Using BLE Beacons"
authors:
  - Yuil Tripathee
  - Pawarisa Thongchua
  - Taweechai Nuntawisuttiwong
venue: "2026 International Conference on Activity and Behavior Computing (ABC)"
year: 2026
doi: "10.1109/ABC68169.2026.11567179"
tags:
  - Indoor localization
  - Bluetooth Low Energy (BLE)
  - spatio-temporal modeling
  - Mamba2
---

Indoor localization in healthcare facilities faces signal volatility and class imbalance challenges. Models with no spatio-temporal understanding will treat each timestamp independently, leading to teleportation errors where impossible location jumps are predicted. The proposed model LockInMamba is a spatio-temporal architecture that combines 2D convolutional neural networks (2DCNN) for 2D spatio-temporal feature extraction and Mamba2's Selective State Spaces for linear-time sequence modeling. The model processes 64-timestep sequences of Bluetooth Low Energy (BLE) Received Signal Strength Indicator (RSSI) measurements from 25 beacons across 21 location classes. Training employs inverse frequency class weighting and relabeling data augmentation to address class imbalance. The proposed model is evaluated on the ABC 2026 Challenge validation set and achieves 95.40% macro F1-score, demonstrating parity between high-traffic and minority location classes. For real-time caregiver tracking on edge devices, the architecture maintains reasonable low latency.