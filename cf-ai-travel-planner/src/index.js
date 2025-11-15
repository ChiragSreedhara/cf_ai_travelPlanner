/**
 * This is the Durable Object class.
 * It's responsible for *storing* the chat history and *calling* the AI.
 */
export class TripMemory {
  constructor(state, env) {
    this.state = state;
    this.env = env; // This 'env' object contains our AI binding
  }

  // Handle HTTP requests sent to the Durable Object.
  async fetch(request) {
    // 1. Get the chat history from storage.
    // If it doesn't exist, start with a system prompt.
    let history = await this.state.storage.get("history") || [
      {
        role: "system",
        content: "You are a friendly and helpful travel agent. You specialize in creating detailed travel itineraries. You should ask clarifying questions if the user is too vague."
      }
    ];

    // 2. Get the user's new message from the incoming request.
    const { message } = await request.json();
    history.push({ role: "user", content: message });

    // 3. Call the AI (Llama 3.3) with the *entire* chat history.
    const aiResponse = await this.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: history
    });

    // 4. Add the AI's response to the history.
    history.push({ role: "assistant", content: aiResponse.response });

    // 5. Save the updated history back to storage.
    await this.state.storage.put("history", history);

    // 6. Send the AI's *latest* response back to the user.
    return new Response(JSON.stringify(aiResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * This is the main Cloudflare Worker.
 * It's the public API that our frontend will call.
 * Its only job is to route requests to the correct Durable Object.
 */
export default {
  async fetch(request, env) {
    // We'll use a single, hardcoded ID for this demo.
    // This means everyone shares the same chat memory.
    // In a real app, you'd generate this ID based on a user's login or cookie.
    let id = env.TRIP_MEMORY.idFromName("my-trip-memory");

    // Get the "stub" (the connector) for that Durable Object.
    let stub = env.TRIP_MEMORY.get(id);

    // Forward the user's request to that specific Durable Object.
    return stub.fetch(request);
  }
};