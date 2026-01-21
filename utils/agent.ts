"use server";
import { ChatDeepSeek } from "@langchain/deepseek";
import { createAgent } from "langchain";
import * as z from "zod";
import { RESEARCH_AGENT_INSTRUCTIONS } from "./constants";
import { findRelevantCasesTool, readPdfDocumentTool } from "./tools";


const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

const model = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: API_KEY,
});

const ModelResponse = z.object({
    user_case_summary: z.string(),
    relevant_cases: z.any(),
    recommendation_for_advisor: z.string(),
});

export const handleResearchAgent = async (
    question: string
) => {
    const agent = createAgent({
        model,
        tools: [findRelevantCasesTool, readPdfDocumentTool],
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
