export default async function handler(req, res) {
  try {
    const question = req.query.message;

    if (!question) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are the Federation AI Assistant. Give precise answers using the federation's knowledge." },
          { role: "user", content: question }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch GPT response." });
  }
}
