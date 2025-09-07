export default async (req, context) => {
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({error:'POST only'}), {status:405});
    const { message } = await req.json();
    if (!message) return new Response(JSON.stringify({error:'Missing message'}), {status:400});
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response(JSON.stringify({error:'Missing OPENAI_API_KEY'}), {status:500});
    const body = {
      model: "gpt-4.1",
      messages: [
        { role: "system", content: "You are Arron — the Sanity Architect. Cosmic, raw, empowering. Keep it real and helpful." },
        { role: "user", content: message }
      ]
    };
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" }});
  } catch (e) {
    return new Response(JSON.stringify({error:'Server error', details: String(e)}), {status:500});
  }
};