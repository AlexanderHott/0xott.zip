#![allow(unused)]
#![allow(clippy::needless_return)]

use std::{
    error::Error,
    fmt::{Debug, Display, Formatter},
};

#[derive(Copy, Clone)]
pub struct Ast;
pub struct Module;

pub struct TargetTriple(String);
impl Default for TargetTriple {
    fn default() -> Self {
        Self("x86-64-unknown-linux-gnu".into())
    }
}
#[derive(Default, Copy, Clone, Hash, Eq, PartialEq, PartialOrd, Ord)]
pub enum OptimizationLevel {
    None,
    Less,
    #[default]
    Default,
    Aggressive,
}

#[derive(Default, Copy, Clone, Hash, Eq, PartialEq, PartialOrd, Ord)]
pub enum DebugSymbols {
    #[default]
    Disabled,
    Enabled,
}
