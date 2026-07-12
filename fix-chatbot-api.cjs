const fs = require('fs');

let js = fs.readFileSync('public/ai-concierge.js', 'utf8');

// The original fetch code block
const origFetch = `            const response = await fetch('/api/nvidia-agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: chatHistory })
            });`;

// The new fetch code block directly calling nvidia API
const newFetch = `            // Directly call NVIDIA API for static deployment (Netlify/GitHub Pages)
            const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer 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"
                },
                body: JSON.stringify({
                    model: "meta/llama-3.1-405b-instruct",
                    messages: chatHistory,
                    temperature: 0.7,
                    top_p: 1,
                    max_tokens: 1024,
                    stream: false
                })
            });`;

if (js.includes("'/api/nvidia-agent'")) {
    js = js.replace(origFetch, newFetch);
    fs.writeFileSync('public/ai-concierge.js', js);
    console.log("Replaced backend API call with direct NVIDIA API call.");
} else {
    console.log("Could not find the fetch block in ai-concierge.js");
}
