import { CDPSession } from "@playwright/test";

export interface ContextData {
  name: string,
  session: CDPSession
}

export class ContextHolder {
  private static _instance: ContextHolder;
  private contextMap: Map<string, ContextData>;

  private constructor() {
    console.log("creating instance");
    this.contextMap = new Map<string, ContextData>();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public addToContextMap(id: string, session: ContextData) {
    this.contextMap.set(id, session);
  }

  public getFromContextMap(id: string) : ContextData {
    const session = this.contextMap.get(id);
    if (!session) {
      console.log("Session could not be found. Exiting the runtime.")
      process.exit(1)
    }
    return session;
  }
}
