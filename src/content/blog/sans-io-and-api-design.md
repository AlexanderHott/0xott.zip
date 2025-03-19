---
createdAt: 2025-03-06T05:43:10.469Z
title: "sans-io and API design"
tags:
  - programming
  - rust
  - python
  - api-design
description: How IO free APIs un-color functions.
---

xxd, an example of a data transformation

- faster than lime used zip as an example

quick and dirty xxd impl in python

instead of reading from a file and writing to stdout, show how painful it would
be with if statements

show how switching to readers and writers makes a better api

now say we want to support an xxd api, or to support io_uring

well, reading and writing is a sync operation, we also want async read + async
write

duplicate code with sync / async read/writers

show how we can abstract the core part out into a "state machine" like api and
write minimal sync + ascyn wrappers over it

rust code for fun

## References

- https://fasterthanli.me/articles/the-case-for-sans-io
  (https://www.youtube.com/watch?v=RYHYiXMJdZI)
- https://sans-io.readthedocs.io/
