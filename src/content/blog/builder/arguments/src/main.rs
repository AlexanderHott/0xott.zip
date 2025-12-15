#![allow(clippy::needless_return)]
use crate::shared::{Ast, DebugSymbols, OptimizationLevel, TargetTriple};

mod builder;
mod multi_argument;
mod options_struct;
mod shared;

fn parse() -> Ast {
    return Ast;
}

fn main() {
    // multi argument
    {
        use multi_argument::{compile, compile_default};
        let ast = parse();
        let target = TargetTriple::default();
        let _module = compile(
            ast,
            &target,
            DebugSymbols::Enabled,
            OptimizationLevel::Default,
            "clang",
        );

        let _module = compile_default(
            ast,
            &target,
            Some(DebugSymbols::Enabled),
            Some(OptimizationLevel::Default),
            Some("clang"),
        );
        let _module = compile_default(ast, &target, None, None, None);
    }

    // options struct
    {
        use options_struct::{CompileOpts, CompileOptsDefault, compile, compile_default};
        let ast = parse();
        let target = TargetTriple::default();
        let opts = CompileOpts {
            target: &target,
            debug_symbols: DebugSymbols::Enabled,
            optimitzation_level: OptimizationLevel::Default,
            linker: "clang",
        };
        let _module = compile(ast, opts);

        let opts = CompileOptsDefault {
            target,
            debug_symbols: DebugSymbols::Enabled,
            optimitzation_level: OptimizationLevel::Default,
            linker: Some("clang"),
        };
        let _module = compile_default(ast, opts);

        let opts = CompileOptsDefault {
            linker: Some("clang"),
            ..Default::default()
        };
        let _module = compile_default(ast, opts);
    }

    // builder
    {
        use builder::{CompileOpts, compile};
        let ast = parse();
        let target = TargetTriple::default();
        let opts = CompileOpts::builder()
            .target(target)
            .debug_symbols(DebugSymbols::Enabled)
            .optimization_level(OptimizationLevel::Default)
            .linker("clang")
            .build()
            .expect("to be valid");
        let _module = compile(ast, opts);

        let opts = CompileOpts::builder()
            .linker("clang")
            .build()
            .expect("to be valid");
        let _module = compile(ast, opts);
    }
}

// Learnings
// - default function parameters can't be the result of a function call (easily)
// - You can't spread ..Default::default() unless all fields implement default
