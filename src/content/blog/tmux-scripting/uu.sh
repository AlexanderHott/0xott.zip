#!/usr/bin/env bash

set -euo pipefail

SESSION=update

if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach-session -t "$SESSION"
fi

tmux new-session -d -s "$SESSION" -n apt
tmux send-keys -t "$SESSION:apt" "sudo apt update && sudo apt upgrade -y" Enter

tmux new-window -t "$SESSION" -n flatpak
tmux send-keys -t "$SESSION:flatpak" "sudo flatpak upgrade" Enter

tmux new-window -t "$SESSION" -n snap
tmux send-keys -t "$SESSION:snap" "sudo snap refresh" Enter

if [[ -n "${TMUX:-}" ]]; then
  tmux switch-client -t "$SESSION"
else
  tmux attach-session -t "$SESSION"
fi
