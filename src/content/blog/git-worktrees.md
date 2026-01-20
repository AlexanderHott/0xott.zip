---
createdAt: 2026-01-20T15:59:59.934Z
title: "Git worktrees"
tags:
  - git
description: "..."
draft: false
---

Most of the time when using `git`, your project folder looks like

```
project/      # root folder
├── .git/     # git data
├── src/      # code
└── README.md
```

This works most of the time, but what if you _really_ need to ship a bug fix?
`git stash`? Clone the repo again somewhere else on your computer? Those work,
but they fall apart with more usecases.

As [matklad brings up](https://matklad.github.io/2024/07/25/git-worktrees.html),
what if you need to review someone else's code, or have a long-running fuzz test
session? Cloning the repo 3 times, and pushing back up to github to sync your
local changes between the 3 repos is not a great workflow.

Good thing `git` has a built-in feature that solves this problem: bare
repositories and [git worktrees](https://git-scm.com/docs/git-worktree).

In git, a working tree is the folder that contains the actual project files. A
bare repo is a git repo with no working tree. It's just the `.git` folder.
Decouple the working tree from the git state allows you to create multiple
working trees for the same git repo.

```bash
git init --bare project.git
```

```bash
eza --tree project.git
```

```
project.git
├── config
├── description
├── HEAD
├── hooks/
│  └── ...
├── info/
│  └── exclude
├── objects/
│  ├── info
│  └── pack
└── refs/
   ├── heads
   └── tags
```

This is exactly what is in a regular `project/.git/`.

```bash
cd project.git
```

When adding a worktree to your bare repo, you can either check out an existing
branch (`git switch` / `git checkout`), or create a new branch (`git switch -c`
/ `git checkout -b`).

Since the main branch doesn't exist, we need to create it.

```bash
git worktree add -b main ./main
eza --tree .
```

```
.
├── config
├── description
├── HEAD
├── hooks/
│  └── ...
├── info/
│  └── exclude
├── main/           # new!
│  └── .git
├── objects/
│  ├── info
│  └── pack
├── refs/
│  ├── heads
│  └── tags
└── worktrees/      # new!
   └── main/
      ├── commondir
      ├── gitdir
      ├── HEAD
      ├── index
      └── refs
```

`git` added a main folder with the working tree of the main branch. It also
added some bookkeeping for the worktree.

```bash
cd main
nvim .
```

and you know the rest.

---

If you don't like having the worktrees within mixed with the git files, you can
structure your bare repo like

```
project/
├── feature/
├── main/
└── project.git/
```

You either need to be in the `project.git/` folder to run in the commands, or
provide `--git-dir=`. For example

```bash title="~/code/project"
git --git-dir=project.git worktree add -b feature ./feature main
```

or

```bash title="~/code/project/project.git"
git worktree add -b feature ../feature main
```
