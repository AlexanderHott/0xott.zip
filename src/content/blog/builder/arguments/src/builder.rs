#![allow(clippy::needless_return)]
use std::{
    error::Error,
    fmt::{Display, Formatter},
};

use crate::shared::{Ast, DebugSymbols, Module, OptimizationLevel, TargetTriple};

pub struct CompileOpts<'opts> {
    target: TargetTriple,
    optimization_level: OptimizationLevel,
    debug_symbols: DebugSymbols,
    linker: &'opts str,
}
impl<'opts> CompileOpts<'opts> {
    pub fn builder() -> CompileOptsBuilder<'opts> {
        return CompileOptsBuilder {
            target: TargetTriple::default(),
            optimization_level: OptimizationLevel::default(),
            debug_symbols: DebugSymbols::default(),
            linker: None,
        };
    }
}
pub struct CompileOptsBuilder<'opts> {
    target: TargetTriple,
    optimization_level: OptimizationLevel,
    debug_symbols: DebugSymbols,
    linker: Option<&'opts str>,
}
#[derive(Debug)]
pub struct BuilderError;
impl Display for BuilderError {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        return write!(f, "Builder Error");
    }
}
impl Error for BuilderError {}
impl<'opts> CompileOptsBuilder<'opts> {
    pub fn target(mut self, target: TargetTriple) -> Self {
        self.target = target;
        return self;
    }
    pub fn optimization_level(mut self, optimization_level: OptimizationLevel) -> Self {
        self.optimization_level = optimization_level;
        return self;
    }
    pub fn debug_symbols(mut self, debug_symbols: DebugSymbols) -> Self {
        self.debug_symbols = debug_symbols;
        return self;
    }
    pub fn linker(mut self, linker: &'opts str) -> Self {
        self.linker = Some(linker);
        return self;
    }
    pub fn build(self) -> Result<CompileOpts<'opts>, BuilderError> {
        return Ok(CompileOpts {
            target: self.target,
            optimization_level: self.optimization_level,
            debug_symbols: self.debug_symbols,
            linker: self.linker.ok_or(BuilderError)?,
        });
    }
}

pub fn compile(ast: Ast, opts: CompileOpts) -> Module {
    todo!()
}
