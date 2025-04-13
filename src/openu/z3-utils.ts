import {Arith, Bool} from "z3-solver";
import Z3, {Z3LowLevel} from "./z3-consts.ts";

export function AtMost(maxCount: number, ...clauses: Bool[]): Bool {
    const atmostConstraint = Z3LowLevel.mk_atmost(Z3.ptr, clauses.map(clause => clause.ast), maxCount);
    const astVec = new Z3.AstVector<Bool>();
    Z3LowLevel.ast_vector_push(Z3.ptr, astVec.ptr, atmostConstraint);
    return astVec.get(0);
}

export function Max(...vars: Arith[]): Arith {
    let m = vars[0];
    for (const c of vars.slice(1, vars.length)) {
        m = Z3.If(c.gt(m), c, m);
    }
    return m;
}
