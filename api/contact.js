function clean(value, max) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, max);
}
function escapeHtml(value) {
  return clean(value, 4000).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed." });
  const body = req.body || {};
  if (body.website) return res.status(200).json({ ok: true, message: "Message received." });
  const name = clean(body.name, 80), email = clean(body.email, 160), subject = clean(body.subject, 120), message = clean(body.message, 3000);
  if (!name || !email || !subject || !message) return res.status(400).json({ message: "Please complete all fields." });
  if (!validEmail(email)) return res.status(400).json({ message: "Please enter a valid email address." });
  const botToken = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return res.status(503).json({ message: "The contact service is not configured yet." });
  const text = [
    "🔔 <b>NEW PORTFOLIO MESSAGE</b>","",
    "👤 <b>Name:</b> " + escapeHtml(name),
    "📧 <b>Email:</b> " + escapeHtml(email),
    "📌 <b>Subject:</b> " + escapeHtml(subject),"",
    "💬 <b>Message:</b>",escapeHtml(message),"",
    "🌐 <b>Source:</b> Tayyab Sayyad Portfolio"
  ].join("\n");
  try {
    const response = await fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:chatId,text,parse_mode:"HTML",disable_web_page_preview:true})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data?.ok) {
      console.error("Telegram API error:", response.status, data);
      return res.status(502).json({ message:"Telegram could not receive the message. Please try again." });
    }
    return res.status(200).json({ ok:true, message:"Message sent." });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(502).json({ message:"Could not send the message. Please try again." });
  }
}
