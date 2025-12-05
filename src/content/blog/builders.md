---
createdAt: 2025-09-30T17:02:19.681Z
title: "Builders, Defaults, Named Parameters, and Tab Complete"
tags:
  - rust
  - language-design
description: "..."
draft: false
---

- sometimes you need similar behavior with a few changes

  - example: ask OS for access to a file
    - can you read from it?
    - can you write to it?
    - will it be truncated?
  - 4 ways to do it (in rust)
    - just have 1 function (and specify each param each time)
    - multiple functions
    - options struct
    - builder pattern
  - language features
    - ginger bill: not all nice things in a language need to be language
      features
    - same idea: i thought java had way too much boiler plate to be productive,
      but then I saw <https://youtu.be/miUbs3mqPJE?t=248> and it blew me away
      how fast this guy codes in Intellij. Java has a lot of boiler plate, but
      he blew through it like it was nothing

- virtual text (inlay hints) for "named vs unnamed arguments" argument
- lsp based folding
- snipets / tab complete

```rust
fn main() {
  let foo = Foo::new();
  do_thi|
}
```

<kbd>Tab</kbd>

```rust "|foo" "0"
fn main() {
  let foo = Foo::new();
  do_thing(|foo, 0)
}
```

Note here that the completion doesn't need to just use the parameter name `foo`.
Your editor could figure out all the items with type `Foo` in scope. I believe
some of the JetBrains editors have this feature. For example, instead of just
`foo` here, in a drop down (similar to the completion menu) it could also
suggest `Default::default()` if `Foo` implemented `Default`, or `Foo::new`, and
created a nested completion if `Foo::new` had parameters.

<kbd>Tab</kbd>

```rust "|0"
fn main() {
  let foo = Foo::new();
  do_thing(foo, |0)
}
```

<kbd>Tab</kbd>

```rust
fn main() {
  let foo = Foo::new();
  do_thing(foo, 1)|
}
```

- why do people like header files? They show you the api of the code (types,
  function signatures, class structures, interfaces, interface implementations),
  quickly, without detailing any of the implementation. you know what else does
  that, without duplicating the code (ya ya theres lsp rename which can rename
  in header files and implementation files). "Reader mode"

- one argument against default parameters, is that you can't see that there are
  extra parameters. solution: have some virtual text ... at the end, or the full
  inline defaults

- lets answer

  - why do you want a builder?
  - why do you don't want a builder?

- sgugaba: a case study

  - Jon Gjengset is cracked at API design. When a library of his goes 1.0, pay
    close attention to what is a type, what isn't a type, what is a builder,
    what isn't a builder
  - order dependent

- tanstack-query (formerly react-query): a case study
- drizzle-orm (really a query builder): a case study

---

Sometimes when programming, you need to do some process multiple times, with a
small change to the logic. This sounds like a prime candidate for a function
with some `if` statements, _but how do you actually get the data to the `if`
statements inside the function?_

Let's take the example of opening a file. When you ask the OS to give you access
to a file, on Linux, there are a few different options that change the behavior
of what happens when you use the file:

- **read**: permission to read the file
- **write**: permission to write the file
- **append**: append new writes to the end instead of overwriting
- **truncate**: sets the length to 0
- **create**: create the file if it doesn't exist
- **create_new**: create the file if it doesn't exist, and fails if it does
  exist

How would _you_ write a function with that interface, allowing users to specify
which options they want?

Here is the most [simple](https://www.youtube.com/watch?v=SxdOUGdseq4) version
of the function in C. Note that in C, files (file descriptors) are represented
as `int`s. If opening the file fails, then the return value will be 0.

```c
int open(
  const char *path,
  const bool read,
  const bool write,
  const bool append,
  const bool truncate,
  const bool create,
  const bool create_new
);
```

Using it would look like.

```c
int main(void) {
  int fd = open(
    "hello.txt",
    true,
    true,
    true,
    false,
    true,
    false
  );
  return 0;
}
```

I'm not sure about you, but if I saw that code in the wild, I would have no idea
what it did... if I didn't have any
IDE/[PDE](https://www.youtube.com/watch?v=QMVIJhC9Veg) tooling, but I use an
IDE, and (most) IDEs support inlay hints. Instead of reading a list of cryptic
bool parameters, they are labeled with what they do.

```c
int main(void) {
  int fd = open(
    path: "hello.txt",
    read: true,
    write: true,
    append: true,
    truncate: false,
    create: true,
    create_new: false
  );
  return 0;
}
```

that isn't as bad, but libc actually uses bit flags.

```c
int open(
  const char *path,
  const int flags,
  const int mode
);
```

```c
int main(void) {
  int fd = open("hello.txt", O_RDWR | O_APPEND | O_CREAT, 0644);
  return 0;
}
```

One sneaky thing that bit flags allow you to do is to have defaults. If a flag
isn't specified, it's slot in the `int` will be 0.

Now, bit flags aren't always available, so what else can you do to avoid
specifying every parameter every time.

There are 4 primary methods of supplying options to a piece of code: 1.
specifying all parameters each time, 2. using multiple functions with function
overloading or similar names, 3. using an options struct, or 4. using the
builder pattern.

### 1. All the parameters, all the time

We just saw 1., and that has some downsides: parameters can be cryptic, swapping
parameters of the same type is a common mistake, adding new parameters is a
breaking API change (for languages without default parameters). However, most of
those can be solved with tooling.

<details>
  <summary>Aside: features != language features</summary>

`<aside>`

I disagree with a lot of the programming language (adjacent) design decisions
[Ginger Bill](https://www.gingerbill.org/) made, but I 100% agree with the
statement that "not all features need to be language feature, they can be part
of the compiler, external tools, IDEs, etc." In a language like C where there
are no (built in) default parameters or function overloading, you can still be
super effective when programming because of the tooling.

In CLion and Neovim, when calling functions, you get a legend of which parameter
you are currently filling out.

Another nice feature of C in CLion is the `.` syntax. C doesn't have member
functions (methods), but you can still write `.` to call a "method".

If you have a type `struct VecU8` and a function
`vecu8_push(struct VecU8 *vec, u8 element)`, you can use `.` to emulate methods.

```c
int main(void) {
  struct VecU8 buf = {0};
  buf.|
}
```

Since `vecu8_push` takes `struct VecU8 *` as the first parameter, CLion is smart
enough to figure out that its a "method" (in the OOP sense), and transform it
into the following:

<kbd>Tab</kbd>

```c
int main(void) {
  struct VecU8 buf = {0};
  vecu8_push(&buf, |)
}
```

They also have a super useful feature where you can press <kbd>;</kbd> before
the `)` and it puts it at the end:

```c
int main(void) {
  struct VecU8 buf = {0};
  vecu8_push(&buf, 67|)
}
```

<kbd>;</kbd>

```c
int main(void) {
  struct VecU8 buf = {0};
  vecu8_push(&buf, 67);|
}
```

This currently isn't possible in Neovim, but it can't be too hard to implement.

`</aside>`

</details>

<details>

  <summary>More languages!</summary>

### Rust

```rust
fn open(
  path: impl AsRef<Path>,
  read: bool,
  write: bool,
  append: bool,
  truncate: bool,
  create: bool,
  create_new: bool,
) -> io::Result<File> {
  todo!()
}

fn main() {
  open("foo.txt", false, true, true, false, true, false);
}
```

</details>

### 2. Multiple functions

This is a common pattern where you have a few optional parameters, like rust's
[`Vec`](). You can optionally pass in a capacity (`with_capacity`) or an
allocator (`_in`), and handle memory allocation failures (`try_`).

This leads to approximately $2^3 = 8$ constructor functions (in general, $2^n$
for $n$ optional parameters):

TODO: Links

| Initial Capacity? | Custom Allocator? | `Result` on OOM? | Function                    |
| ----------------- | ----------------- | ---------------- | --------------------------- |
| No                | No                | No               | `Vec::new`                  |
| No                | No                | Yes              | †                           |
| No                | Yes               | No               | `Vec::new_in`               |
| No                | Yes               | Yes              | †                           |
| Yes               | No                | No               | `Vec::with_capacity`        |
| Yes               | No                | Yes              | `Vec::try_with_capacity`    |
| Yes               | Yes               | No               | `Vec::with_capacity_in`     |
| Yes               | Yes               | Yes              | `Vec::try_with_capacity_in` |

† constructing an empty `Vec` doesn't allocate, so it can't run into OOM errors,
and therefore can't fail at runtime.

In some languages, like Java, Kotlin, C++, C#, and Swift, you can keep the
function name the same, but that really messes with goto definition and code
searching. I don't mind the function explosion, but there are other ways to
solve it.

### 3. Options struct

```rust
#[derive(Default)]
#[non_exhaustive]  // key for API compatibility
struct OpenOptions {
  read: bool,
  write: bool,
  append: bool,
  truncate: bool,
  create: bool,
  create_new: bool
}

fn open(
  path: impl AsRef<Path>,
  options: &OpenOptions,
) -> io::Result<File> { todo!() }

fn main() {
  open("foo.txt", &OpenOptions {
    read: true,
    write: true,
    create: true,
    ..Default::default()
  });
}
```

This is using rust's
[struct update syntax](https://doc.rust-lang.org/book/ch05-01-defining-structs.html#creating-instances-from-other-instances-with-struct-update-syntax)
along with a `Default` implementation.

This is common [bevy](https://docs.rs/crate/bevy/latest), where structs can have
upwards of 40 parameters
([go team fat structs](https://www.youtube.com/watch?v=wo84LFzx5nI)).

### 4. Builder pattern

TODO:

- [`OpenOptions`](https://doc.rust-lang.org/std/fs/struct.OpenOptions.html)
- [`std::process::Command`](https://doc.rust-lang.org/std/process/struct.Command.htmpl)

Builders are loved in the rust community, and personally, I'm a huge fan of
method chaining. I think it makes for "readable" code (more on that later).
(Yes, I'm also a fan of `.await`.)

`OpenOptions` is actually implemented as a builder in the standard library
(std::fs::OpenOptions)

```rust
// Simplified, but mostly the same
pub struct OpenOptions {
  read: bool,
  write: bool,
  append: bool,
  truncate: bool,
  create: bool,
  create_new: bool
}

impl OpenOptions {
  fn new() -> Self {
    return OpenOptions {
      read: false,
      write: false,
      append: false,
      truncate: false,
      create: false,
      create_new: false,
    };
  }

  pub fn read(&mut self, read: bool) -> &mut Self {
    self.read = read;
    return self;
  }
  pub fn write(&mut self, write: bool) -> &mut Self {
    self.write = write;
    return self;
  }
  pub fn append(&mut self, append: bool) -> &mut Self {
    self.append = append;
    return self;
  }
  pub fn truncate(&mut self, truncate: bool) -> &mut Self {
    self.truncate = truncate;
    return self;
  }
  pub fn create(&mut self, create: bool) -> &mut Self {
    self.create = create;
    return self;
  }
  pub fn create_new(&mut self, create_new: bool) -> &mut Self {
    self.create_new = create_new;
    return self;
  }
  pub fn open(&self, path: Path) -> io::Result<File> {
    todo!()
  }
}
```

```rust
fn main() {
  OpenOptions::new()
    .read(true)
    .write(true)
    .create(true)
    .open("foo.txt");
}
```

That's a lot of code. (Note the current std implementation is ~240 lines long,
but a lot of that is because of documentation). But in rust, you can also
automatically generate the boilerplate-y code via a
[`derive` macro](https://docs.rs/derive_builder/latest/derive_builder/).

```rust "Builder"
#[derive(Builder, Default)]
pub struct OpenOptions {
  read: bool,
  write: bool,
  append: bool,
  truncate: bool,
  create: bool,
  create_new: bool
}
impl OpenOptions {
  pub fn open(&self, path: Path) -> io::Result<File> {
    todo!()
  }
}
```

However, using a
[proc macro](https://doc.rust-lang.org/reference/procedural-macros.html) isn't
free. It increases compile times and makes debugging harder because the
generated source isn't right in front of you.

TODO: typestate builders, validation, etc

### 5. Default parameters

In languages that support them, you could also use default parameters. I don't
mind default parameters...

...is what I would have said if I didn't stumble upon this thread.

- [ ] <https://www.reddit.com/r/rust/comments/11ddclh/why_doesnt_rust_accept_default_parameters_for/>
  - [ ] <https://internals.rust-lang.org/t/named-default-arguments-a-review-proposal-and-macro-implementation/8396>
    - [ ] <https://github.com/samsieber/rubber-duck/blob/master/REVIEW.md>
      - [ ] <https://github.com/rust-lang/rfcs/issues/323>
    - [ ] <https://github.com/samsieber/rubber-duck/blob/master/README.md>

## Comparison

These are small(ish) differences. Whether you decide to use a builder, or have
to specify `NULL`/`None` four times doesn't really make a difference when
reading or writing code. It's 2025, we have LSPs and AI autocomplete.

Sure, maybe when reading code on GitHub or in Notepad(++), having named
parameters is more clear than positional ones, but should we really be
optimizing for those environemnts, and should the solution be a language
feature?

But, enough of those "small differences" compel people to design new languages.

### Readability

More code != bad. Less code != more readable.

I don't think that

```cs
Cat socrates = new Cat(
  "Socrates",
  favoriteFood="Tuna",
  hoursAwake=5
);
```

is more or less readable than

```cs
Cat socrates = new Cat
  .Builder("Socrates")
  .FavoriteFood("Tuna")
  .HoursAwake(5)
  .Build();
```

Now, if your language doesn't support named parameters, like C, Rust, Go, Java,
Kotlin, C++ (has defaults, but not named), than builders are a great
replacement.

TODO: inlay hints

Below are some examples of what happens in languages without default / named
parameters.

```c
int sock = socket(AF_INET, SOCK_STREAM, 0);
```

```rust
let cat = Cat::new("Socrates", None, None);
```

### Validation

Let's take a look at an example where that might not be the case. Here is a
function from the tensorflow api. ML python libraries are notorious for having
many default parameters.

```py
add_weight(
    shape=None,
    initializer=None,
    dtype=None,
    trainable=True,
    autocast=True,
    regularizer=None,
    constraint=None,
    aggregation='mean',
    name=None
)
```

This might not be the case here, but when you have these "add\_" methods that
take a bunch of parameters, you normally have to validate certain cases. Like
maybe `shape` has to be a certain length of `regularized` is set.

Creating a `Weight` builder and changing the function to
`add_weight(weight: Weight)` allows the validation code to be dudplicated.

- should it be the calling code or the function to validate?
-

Why is having so many parameters bad?

## API Design

One of the most interesting uses of the builder pattern is from Jon Gjengset's
"where are you in space" library. You can construct a location on a sphere with
$\rho, \theta, \phi$, or with Asmuth.

With spherical coordinates, the order which you specify them matters, because
...

To enforce that they go in the correct order, he used a typestate builder, to
enforce the order they were set in.

? Why not just function with 3 things?

---

- struct parameters are named (only).

- <https://golang.cafe/blog/golang-functional-options-pattern.html>
- <https://www.youtube.com/watch?v=kESBAiTYMoQ>
