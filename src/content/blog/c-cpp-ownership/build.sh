#!/usr/bin/env bash

set -eou pipefail

clang -std=c99 ./main.c -o ./build/main-c

# clang++ -std=c++26 ./main.cpp -o ./build/main-cpp
# clang++ -fsanitize=address -std=c++26 ./main.cpp -o ./build/main-cpp-addr
# clang++ -fsanitize=memory -std=c++26 ./main.cpp -o ./build/main-cpp-mem
