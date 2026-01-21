


// export const find_relevant_cases = async (search_term: string) => {
//     const response = await fetch(`${BASE_URL}/search?start=0&length=${SEARCH_RESULT_LIMIT}&language=en&search=${search_term}`)
//     const formatedResponse = await response.json();

//     if (!response.ok || response.status !== 200) {
//         return {
//             statusCode: response.status,
//             message: formatedResponse.message,
//             error: formatedResponse.error,
//         }
//     }
//     const result = []
//     for (let relevantCase of formatedResponse.data.data) {
//         let documentResponse: any = await fetch(`${BASE_URL}-files/${relevantCase['_source'].id}`)

//         if (!response.ok || response.status !== 200) continue

//         documentResponse = await documentResponse.json();

//         const relevantCaseNeedeInfo = {
//             summary: relevantCase.highlight.file_text.join(" "),
//             caseTitle: `${relevantCase['_source'].document_collection_name} - ${relevantCase['_source'].document_name}`,
//             documentLink: documentResponse.data.file_url
//         }
//         result.push(relevantCaseNeedeInfo);
//     }
//     return result;
// }

// export const read_pdf_document = async (documentUrl: string) => {
//     try {
//         let response: any = await fetch(
//             `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/extract-text/`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ file_url: documentUrl })
//             }
//         );

//         response = await response.json()
//         return response.message
//     } catch (error) {
//         console.error('Error reading PDF:', error);
//         return "";
//     }
// }

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const BASE_URL = "https://apis.amategeko.gov.rw/v1/site/documents"
const SEARCH_RESULT_LIMIT = 2

// Define your tool schemas
export const findRelevantCasesTool = new DynamicStructuredTool({
    name: "find_relevant_cases",
    description: "Search for relevant legal cases based on a search term. Returns summaries, titles, and document links.",
    schema: z.object({
        search_term: z.string().describe("The search query to find relevant cases"),
    }),
    func: async ({ search_term }) => {
        const response = await fetch(
            `${BASE_URL}/search?start=0&length=${SEARCH_RESULT_LIMIT}&language=en&search=${search_term}`
        );
        const formatedResponse = await response.json();
        
        if (!response.ok || response.status !== 200) {
            return JSON.stringify({
                statusCode: response.status,
                message: formatedResponse.message,
                error: formatedResponse.error,
            });
        }
        
        const result = [];
        for (let relevantCase of formatedResponse.data.data) {
            let documentResponse: any = await fetch(
                `${BASE_URL}-files/${relevantCase['_source'].id}`
            );
            
            if (!documentResponse.ok || documentResponse.status !== 200) continue;
            
            documentResponse = await documentResponse.json();
            const relevantCaseNeedeInfo = {
                summary: relevantCase.highlight.file_text.join(" "),
                caseTitle: `${relevantCase['_source'].document_collection_name} - ${relevantCase['_source'].document_name}`,
                documentLink: documentResponse.data.file_url
            };
            result.push(relevantCaseNeedeInfo);
        }
        
        return JSON.stringify(result);
    },
});

export const readPdfDocumentTool = new DynamicStructuredTool({
    name: "read_pdf_document",
    description: "Extract and read text content from a PDF document given its URL.",
    schema: z.object({
        documentUrl: z.string().describe("The URL of the PDF document to read"),
    }),
    func: async ({ documentUrl }) => {
        try {
            let response: any = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/extract-text/`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ file_url: documentUrl })
                }
            );
            response = await response.json();
            return response.message || "";
        } catch (error) {
            console.error('Error reading PDF:', error);
            return "Error: Unable to read PDF document";
        }
    },
});