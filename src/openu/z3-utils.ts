import {Arith} from "z3-solver";
import Z3 from "./z3-consts.ts";

export function Max(...vars: Arith[]): Arith {
    let m = vars[0];
    for (const c of vars.slice(1, vars.length)) {
        m = Z3.If(c.gt(m), c, m);
    }
    return m;
}
