---
createdAt: 2025-08-19T18:39:20.019Z
updatedAt: 2026-04-30T00:00:00.000Z
title: Tectonic
tags:
  - database
  - kv-store
  - research
description: A benchmark for testing databases when the workload keeps changing.
draft: false
featured: true
---

[GitHub](https://github.com/SSD-Brandeis/tectonic) · [Paper](/projects/tectonic/tectonic.pdf)

Tectonic is a database benchmarking tool I built while doing database systems research at Brandeis.

Most database benchmarks are pretty static: set up the database, run the same kind of workload for a while, then compare the final numbers. That is useful, but it misses a thing that happens constantly in real systems: the workload changes. Maybe reads suddenly dominate writes, maybe the hot keys move around, maybe the access pattern shifts because the product changed or traffic came from a different customer.

Tectonic is built around that idea. Instead of only asking "how fast is this database on this one workload?", it lets you ask "what happens when the workload moves under it?"

That mattered for our lab because we were working on automatically tuned LSM-tree databases. LSM trees are used in a lot of key-value stores, and their performance depends heavily on how memory, buffering, flushing, and compaction are configured. If the workload changes, the best configuration can change too. To test that kind of system fairly, we needed a benchmark that could shift over time instead of pretending production traffic is frozen.

The project ended up being a lot of careful systems work: generating workloads, coordinating benchmark phases, collecting measurements, and making the internals efficient enough that the benchmark itself did not become the bottleneck. I spent a lot of time on thread-safe, memory-conscious data structures and on making the experiments statistically useful rather than just producing a pile of numbers.

The short version: Tectonic helps test databases in a way that looks more like the real world, where workloads drift, spike, and change shape.

The longer version is in the paper: [Bridging Synthetic and Real-World Workloads for Key-Value Benchmarking](/projects/tectonic/tectonic.pdf).
