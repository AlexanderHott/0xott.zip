#!/usr/bin/env bash

set -euo pipefail

PROJECTS="${PROJECTS:-$HOME/Projects/}"

attach() {
  if [[ -n "${TMUX:-}" ]]; then
    exec tmux switch-client -t "=$1"
  else
    exec tmux attach-session -t "=$1"
  fi
}

dir=$(fd --type d --max-depth 1 . "$PROJECTS" |
  fzf --delimiter / --with-nth -2 --preview 'ls -A {}') || exit 0

name=$(basename "$dir" | tr '.:' '__')

if tmux has-session -t "=$name" 2>/dev/null; then
  attach "$name"
fi

tmux new-session -d -c "$dir" -s "$name" -n dev

tmux new-window -c "$dir" -t "=$name" -n editor
tmux send-keys -t "=$name:editor" "nvim" Enter

attach "$name"
