"use server";
import { ChatDeepSeek } from "@langchain/deepseek";
import { createAgent } from "langchain";
import * as z from "zod";
import { RESEARCH_AGENT_INSTRUCTIONS } from "./constants";


const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

const model = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: API_KEY,
});

const ModelResponse = z.object({ response: z.string() });

export const handleResearchAgent = async (
    question: string
) => {
    const agent = createAgent({
        model,
        tools: [],
        responseFormat: ModelResponse,
        systemPrompt: RESEARCH_AGENT_INSTRUCTIONS,
    });

    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content: question,
            },
        ],
    });

    return result.structuredResponse;
};
