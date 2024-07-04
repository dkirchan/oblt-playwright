import { Advice } from "./aspect/advice.enum";
import { Aspect, AspectContext } from "./aspect/aspect.interface";
import { ContextHolder } from "./contextHolder";

const { Client } = require("@elastic/elasticsearch");

const client = new Client({
  cloud: { id: process.env.STATS_CLOUD_ID },
  auth: { apiKey: process.env.STATS_API_KEY },
});

export class LogAspect implements Aspect {
  async execute(ctx: AspectContext, advice: Advice): Promise<void> {
    let adv: string;
    switch (advice) {
      case 0: {
        adv = "Before";
        break;
      }
      case 1: {
        adv = "After";
        break;
      }
      case 4: {
        adv = "TryCatch";
        break;
      }
      case 5: {
        adv = "TryFinally";
        break;
      }
      default: {
        console.log(
          "There is no identified mapped advice with the provided code."
        );
        process.exit(1);
      }
    }

    const workerIndex = process.env.TEST_WORKER_INDEX;
    if (!workerIndex) {
      console.log("Worker index does not exist");
      process.exit(1);
    }

    const contextInstance =
      ContextHolder.Instance.getFromContextMap(workerIndex);
    const collectedMetrics = await contextInstance.session.send(
      "Performance.getMetrics"
    );
    const metricsMap = collectedMetrics.metrics.reduce((acc, obj) => {
      acc[obj.name] = obj.value;
      return acc;
    }, {});
    try {
      let response = await client.index({
        index: "kb-marauder-metrics",
        document: {
          testName: contextInstance.name,
          pointcutAdvice: adv,
          pointcutMethod: ctx.methodName,
          metrics: {
            AdSubframes: metricsMap["AdSubframes"],
            ArrayBufferContents: metricsMap["ArrayBufferContents"],
            ContextLifecycleStateObservers:
              metricsMap["ContextLifecycleStateObservers"],
            DetachedScriptStates: metricsMap["DetachedScriptStates"],
            DevToolsCommandDuration: metricsMap["DevToolsCommandDuration"],
            Documents: metricsMap["Documents"],
            DomContentLoaded: metricsMap["DomContentLoaded"],
            FirstMeaningfulPaint: metricsMap["FirstMeaningfulPaint"],
            Frames: metricsMap["Frames"],
            JSEventListeners: metricsMap["JSEventListeners"],
            JSHeapTotalSize: metricsMap["JSHeapTotalSize"],
            JSHeapUsedSize: metricsMap["JSHeapUsedSize"],
            LayoutCount: metricsMap["LayoutCount"],
            LayoutDuration: metricsMap["LayoutDuration"],
            LayoutObjects: metricsMap["LayoutObjects"],
            MediaKeySessions: metricsMap["MediaKeySessions"],
            MediaKeys: metricsMap["MediaKeys"],
            NavigationStart: metricsMap["NavigationStart"],
            Nodes: metricsMap["Nodes"],
            ProcessTime: metricsMap["ProcessTime"],
            ResourceFetchers: metricsMap["ResourceFetchers"],
            Resources: metricsMap["Resources"],
            ScriptDuration: metricsMap["ScriptDuration"],
            TaskDuration: metricsMap["TaskDuration"],
            TaskOtherDuration: metricsMap["TaskOtherDuration"],
            ThreadTime: metricsMap["ThreadTime"],
            Timestamp: metricsMap["Timestamp"],
          },
        },
      });
    } catch (e) {
      console.error("An exception occured.");
      console.error(e);
    }
  }
}
