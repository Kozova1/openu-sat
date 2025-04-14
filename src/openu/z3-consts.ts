import {init} from "z3-solver";

const {
    Context,
} = await init();

export default Context("main");