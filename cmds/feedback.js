const config = require('../config.json');
module.exports = {
  metadata: {
    name: "feedback",
    description: "Message admin",
    usage: "feedback <msg>",
    adminOnly: false,
    aliases: []
  },
  async execute(event, player, args, sendMessage) {
    const msg = args.join(" ");
    if (!msg) return sendMessage(event.sender.id, "❌ Type something.");
    await sendMessage(config.adminID, `📬 From ${event.sender.id}: ${msg}`);
    sendMessage(event.sender.id, "✅ Sent.");
  }
};