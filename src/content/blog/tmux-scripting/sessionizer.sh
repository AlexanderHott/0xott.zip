#!/usr/bin/env bash

set -euo pipefail

PROJECTS="${PROJECTS:-$HOME/Projects/}"

dir=$(fd --type d --max-depth 1 . "$PROJECTS" |
  fzf --delimiter / --with-nth -2 --preview 'ls -A {}') || exit 0

name=$(basename "$dir" | tr '.:' '__')

if tmux has-session -t "=$name" 2>/dev/null; then
  exec tmux attach-session -t "=$name"
fi

tmux new-session -d -c "$dir" -s "$name" -n dev

tmux new-window -c "$dir" -t "=$name" -n editor
tmux send-keys -t "=$name:editor" "nvim" Enter

if [[ -n "${TMUX:-}" ]]; then
  tmux switch-client -t "=$name"
else
  tmux attach-session -t "=$name"
fi
