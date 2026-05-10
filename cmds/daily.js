module.exports = {
  metadata: {
    name: "daily",
    description: "Claim your daily reward",
    usage: "daily",
    adminOnly: false,
    aliases: ["day"]
  },
  async execute(event, player, args, sendMessage) {
    const cooldown = 86400000; // 24 hours
    const now = Date.now();
    
    if (now - (player.lastDaily || 0) < cooldown) {
      return sendMessage(event.sender.id, `📅 You already claimed your daily reward. Come back tomorrow!`);
    }

    const earnings = Math.floor(Math.random() * 501) + 500; // 500-1000
    player.balance += earnings;
    player.lastDaily = now;
    await player.save();

    sendMessage(event.sender.id, `🌟 [ DAILY REWARD ]\\nYou claimed $${earnings}!\\n💰 New Balance: $${player.balance}`);
  }
};
