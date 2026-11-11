#!/usr/bin/env bash

set -euo pipefail

# refresher on tmux
# tmux config
# tmux sessionizer
# run multiple commands with tmux

SESSION=dev

# Reuse the session if it already exists
if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach-session -t "$SESSION"
fi

# Starting a with a command will exit the session when the command exits. `ls` exits instantly, so the session immediately dies.
#
# tmux new-session -d -s "$SESSION" -c "$PWD" "ls"
#
# use tmux send-keys instead

tmux new-session -d -c "$PWD" -s "$SESSION" -n pane1
tmux send-keys -t "$SESSION:pane1" "ls" Enter

# tmux new-window -c "$PWD" -t "$SESSION" -n pane2
# tmux send-keys -t "$SESSION:pane2" "echo 'pane2 left'" Enter
#
# tmux split-window -c "$PWD" -t "$SESSION:pane2" -h
# tmux send-keys -t "$SESSION:pane2.1" "echo 'pane2 right'" Enter
#
# tmux new-window -c "$PWD" -t "$SESSION" -n pane3
# tmux send-keys -t "$SESSION:pane3" "echo 'pane3 top'" Enter
#
# tmux split-window -c "$PWD" -t "$SESSION:pane3" -v
# tmux send-keys -t "$SESSION:pane3.1" "echo 'pane3 bottom'" Enter

tmux new-window -c "$PWD" -t "$SESSION" -n pane4
tmux split-window -dhP -c "$PWD" -t "$SESSION:pane4.0"
tmux split-window -dhP -c "$PWD" -t "$SESSION:pane4.1"

tmux send-keys -t "$SESSION:pane4.0" "echo 'pane4 left'" Enter
tmux send-keys -t "$SESSION:pane4.1" "echo 'pane4 mid'" Enter
tmux send-keys -t "$SESSION:pane4.2" "echo 'pane4 right'" Enter

tmux attach-session -t "$SESSION"

# pane layout and widths
# kill on detach
# attach if exists
# swap if in tmux already
# title
# empty and read from stdout (sudo example)
