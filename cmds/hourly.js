module.exports = {
  metadata: {
    name: "hourly",
    description: "Claim your hourly reward",
    usage: "hourly",
    adminOnly: false,
    aliases: ["hreward"]
  },
  async execute(event, player, args, sendMessage) {
    const cooldown = 3600000; // 1 hour
    const now = Date.now();
    
    if (now - (player.lastHourly || 0) < cooldown) {
      const remaining = Math.ceil((cooldown - (now - (player.lastHourly || 0))) / 60000);
      return sendMessage(event.sender.id, `🕒 Please wait ${remaining} more minutes for your next hourly gift.`);
    }

    const earnings = Math.floor(Math.random() * 301) + 200; // 200-500
    player.balance += earnings;
    player.lastHourly = now;
    await player.save();

    sendMessage(event.sender.id, `🎁 [ HOURLY REWARD ]\\nYou received $${earnings}!\\n💰 New Balance: $${player.balance}`);
  }
};
