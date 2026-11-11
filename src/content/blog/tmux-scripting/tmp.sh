#!/usr/bin/env bash

set -euo pipefail

SESSION=hello-tmux

tmux new-session -d -c "$PWD" -s "$SESSION" -n files
tmux send-keys -t "$SESSION:files" "ls" Enter

tmux split-window -dh -c "$PWD" -t "$SESSION:files" -l 80%
tmux send-keys -t "$SESSION:files.1" "ls -la" Enter

tmux split-window -dh -c "$PWD" -t "$SESSION:files.1" 
tmux send-keys -t "$SESSION:files.2" "pwd" Enter

# tmux select-layout main-vertical

tmux attach-session -t "$SESSION"
