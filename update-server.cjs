const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const newRoute = `
// NVIDIA Agent Route
app.post("/api/nvidia-agent", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' format." });
    }

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-405b-instruct", // Defaulting to a known good model just in case
        messages: messages,
        temperature: 0.7,
        top_p: 1,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
        // Try original model if llama 405b fails
        const response2 = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: messages,
                temperature: 0.7,
                top_p: 1,
                max_tokens: 1024,
                stream: false
            })
        });
        if (!response2.ok) {
            const errText = await response2.text();
            throw new Error(\`NVIDIA API Error: \${response2.status} \${errText}\`);
        }
        const data = await response2.json();
        return res.json({ text: data.choices[0].message.content });
    }

    const data = await response.json();
    return res.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error("NVIDIA API error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
});
`;
code = code.replace('// Configure Vite integration', newRoute + '\n// Configure Vite integration');
fs.writeFileSync('server.ts', code);
