use crate::shared::{Ast, DebugSymbols, Module, OptimizationLevel, TargetTriple};

pub struct CompileOpts<'opts> {
    pub target: &'opts TargetTriple,
    pub debug_symbols: DebugSymbols,
    pub optimitzation_level: OptimizationLevel,
    pub linker: &'opts str,
}

pub fn compile(ast: Ast, opts: CompileOpts) -> Module {
    _ = ast;
    _ = opts;
    todo!()
}

#[derive(Default)]
pub struct CompileOptsDefault<'opts> {
    pub target: TargetTriple,
    pub debug_symbols: DebugSymbols,
    pub optimitzation_level: OptimizationLevel,
    pub linker: Option<&'opts str>,
}

pub fn compile_default(ast: Ast, opts: CompileOptsDefault) -> Module {
    _ = ast;
    _ = opts;
    todo!()
}
