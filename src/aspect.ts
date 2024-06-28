import { Aspect, AspectContext } from "./aspect/aspect.interface";

export class LogAspect implements Aspect {
  execute(ctx: AspectContext): void {
    console.log("takis");
    console.log(ctx.methodName);
  }
}
