import { runAgent } from "@/lib/agent";

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Create a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendChunk = (data) => {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        };

        try {
          // Run the agent with thinking callback
          const result = await runAgent(message, history || [], (step) => {
            sendChunk({ type: "thinking", step });
          });

          // Send the final result
          sendChunk({ type: "result", data: result });
        } catch (error) {
          console.error("Agent error:", error);
          sendChunk({
            type: "error",
            message: `Analysis failed: ${error.message}. Please check your API keys and try again.`,
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Route error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
