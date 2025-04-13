import {init} from "z3-solver";

const {
    Context,
    Z3,
} = await init();

export default Context("main");

export const Z3LowLevel = Z3;