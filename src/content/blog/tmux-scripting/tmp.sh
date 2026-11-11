#!/usr/bin/env bash

set -euo pipefail

SESSION=hello-tmux

tmux new-session -d -c "$PWD" -s "$SESSION" -n files
tmux send-keys -t "$SESSION:files" "ls" Enter

tmux attach-session -t "$SESSION"
