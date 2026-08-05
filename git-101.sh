#!/usr/bin/env bash

set -eou pipefail

rm -rf ./git-101/
mkdir ./git-101/

cd ./git-101/ || exit

echo "=================================================="

git init
ls -la

echo "=================================================="

touch README.md
git status
git add -A
git commit -m "A: Add readme"

echo "=================================================="

mkdir src
touch ./src/main.py
git status
git add -A
git commit -m "B: Add main.py"

echo "=================================================="

cat > ./src/main.py <<'EOF'
def main():
    print("hello world")

main()
EOF
git status
git add -A
git commit -m "C: Add print to main.py"
git log --oneline --graph --decorate --all

echo "=================================================="

git switch -c fix

cat > ./src/main.py <<'EOF'
def main():
    print("hello world")

if __name__ == "__main__":
    main()
EOF
git add -A
git commit -m "D: Add import guard"
git log --oneline --graph --decorate --all

echo "=================================================="

git switch main

cat > ./src/main.py <<'EOF'
def main():
    print("hello git")

main()
EOF
git add -A
git commit -m "E: Change print"
git log --oneline --graph --decorate --all

echo "=================================================="

git merge fix -m "F: Merge branch 'fix'"
git log --oneline --graph --decorate --all

git branch -d fix

git log --oneline --graph --decorate --all

echo "=================================================="

git switch -c feature
cat > ./src/main.py <<'EOF'
def main():
    print("Hello, git!")

if __name__ == "__main__":
    main()
EOF
git add -A
git commit -m "G: Make print fancy"


cat > ./src/main.py <<'EOF'
def main():
    print("Hello, git!")
    print("Hello, rebase!")

if __name__ == "__main__":
    main()
EOF
git add -A
git commit -m "H: Add more printing"

git log --oneline --graph --decorate --all

echo "=================================================="

git switch main
echo "# Amazing project" > README.md
git add -A
git commit -m "I: Update readme"

git log --oneline --graph --decorate --all

echo "=================================================="

git switch feature

# trick to non-interactively interactivly rebase
editor_script="$(mktemp)"
sequence_script="$(mktemp)"
trap 'rm -f "$editor_script" "$sequence_script"' EXIT

cat > "$editor_script" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

file="$1"

sed -i \
  -e "s/^G: /G': /" \
  -e "s/^H: /H': /" \
  "$file"
EOF

cat > "$sequence_script" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

file="$1"

sed -i \
  -e '/ G: /s/^pick /reword /' \
  -e '/ H: /s/^pick /reword /' \
  "$file"
EOF

chmod +x "$editor_script" "$sequence_script"

GIT_SEQUENCE_EDITOR="$sequence_script" \
GIT_EDITOR="$editor_script" \
git rebase -i main

git log --oneline --graph --decorate --all

echo "=================================================="

git switch main
git merge feature --ff-only
git branch -d feature

git log --oneline --graph --decorate --all

echo "=================================================="

git switch -c hotfix

cat > ./src/main.py <<'EOF'
def main():
    print("Hello, hotfix!")
    print("Hello, git!")
    print("Hello, rebase!")

if __name__ == "__main__":
    main()
EOF
git add -A
git commit -m "J: Hotfix main"

git switch main

cat > ./src/main.py <<'EOF'
def main():
    print("Hello, world!")
    print("Hello, git!")
    print("Hello, rebase!")

if __name__ == "__main__":
    main()
EOF
git add -A
git commit -m "K: Add even more printing"
