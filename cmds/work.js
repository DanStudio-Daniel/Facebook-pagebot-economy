module.exports = {
  metadata: {
    name: "work",
    description: "Earn money",
    usage: "work",
    adminOnly: false,
    aliases: ["w"]
  },
  async execute(event, player, args, sendMessage) {
    const now = Date.now();
    if (now - player.lastWork < 60000) return sendMessage(event.sender.id, "⏳ Too tired.");
    const earnings = Math.floor(Math.random() * 100) + 50;
    player.balance += earnings;
    player.lastWork = now;
    await player.save();
    sendMessage(event.sender.id, `💼 Earned $${earnings}. Balance: $${player.balance}`);
  }
};