use crate::shared::{Ast, DebugSymbols, Module, OptimizationLevel, TargetTriple};

pub fn compile(
    ast: Ast,
    target: &TargetTriple,
    debug_symbols: DebugSymbols,
    optimitzation_level: OptimizationLevel,
    linker: &str,
) -> Module {
    _ = ast;
    _ = target;
    _ = debug_symbols;
    _ = optimitzation_level;
    _ = linker;
    todo!()
}

pub fn compile_default(
    ast: Ast,
    target: &TargetTriple,
    debug_symbols: Option<DebugSymbols>,
    optimitzation_level: Option<OptimizationLevel>,
    linker: Option<&str>,
) -> Module {
    _ = ast;
    _ = target;
    _ = debug_symbols;
    _ = optimitzation_level;
    _ = linker;
    todo!()
}
