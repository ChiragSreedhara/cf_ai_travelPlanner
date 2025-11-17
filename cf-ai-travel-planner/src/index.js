
export class TripMemory {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    let history = await this.state.storage.get("history") || [
      {
        role: "system",
        content: "You are a friendly and helpful travel agent. You specialize in creating detailed travel itineraries. You should ask clarifying questions if the user is too vague."
      }
    ];

    const { message } = await request.json();
    history.push({ role: "user", content: message });

    const aiResponse = await this.env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: history,
      max_tokens: 2048 
    });

    history.push({ role: "assistant", content: aiResponse.response });
    await this.state.storage.put("history", history);

    return new Response(JSON.stringify(aiResponse), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    if (request.method === "POST") {
      let id = env.TRIP_MEMORY.idFromName("my-trip-memory-v6");
      let stub = env.TRIP_MEMORY.get(id);
      let doResponse = await stub.fetch(request);

      let response = new Response(doResponse.body, doResponse);
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
      
      return response;
    }

    return new Response("Method Not Allowed", { status: 405 });
  }
};