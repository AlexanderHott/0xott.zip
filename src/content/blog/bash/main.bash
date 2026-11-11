#!/usr/bin/env bash


# run commands in order

echo "hello world"

git log --oneline | head -n 3

# command sequences

echo "hello"; echo "world"

echo "hello" && echo "world"

echo "hello" || echo "world"

# pipes

echo -e "c\nb\na" | sort

# redirection

# echo "hello" > file
# echo "world" >> file
# echo < file
# echo "hello" 2> file # capture errors
# echo "hello" 2>&1 # combine stderr and stdout

# variables


