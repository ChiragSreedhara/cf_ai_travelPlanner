# cf-ai-travel-planner

An AI-powered travel itinerary planner built on the Cloudflare stack for a developer assignment.

This application uses an AI agent to help users plan trips. It maintains a conversation history to provide contextual, in-depth travel plans.

##  How to Run

This application is fully deployed on Cloudflare. To run it, simply visit the live site:

**[https://ff872b3c.cf-ai-travel-planner.pages.dev/](https://ff872b3c.cf-ai-travel-planner.pages.dev/)**

To manually run, clone the repository and deploy the pages via npx wrangler pages deploy ./pages

##  Components Used

* **Frontend (User Input):** Cloudflare Pages
* **Backend (Workflow & AI):** Cloudflare Workers
* **Memory/State:** Cloudflare Durable Objects
* **LLM:** Llama 3 (via Workers AI)