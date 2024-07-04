import { Advice } from "./advice.enum";

export interface Aspect {
    execute(ctx: AspectContext, advice: Advice): any;
}

export type AspectContext = {
    target: any;
    methodName: string;
    functionParams: any[];
    returnValue: any;
    error: any;
};
