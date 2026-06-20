export async function register() {
    // Only run the Langfuse tracing SDK on the Node.js server side
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { NodeSDK } = await import("@opentelemetry/sdk-node");
      const { LangfuseSpanProcessor } = await import("@langfuse/otel"); //  Correct
  
      const sdk = new NodeSDK({
        spanProcessors: [new LangfuseSpanProcessor()],
      });
  
      sdk.start();
      console.log("🚀 Langfuse Tracing SDK Initialized Successfully");
    }
  }
  