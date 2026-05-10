module.exports = {
  metadata: {
    name: "setbal",
    description: "Admin only: Set a specific user's balance",
    usage: "setbal <id> <amount>",
    adminOnly: true,
    aliases: ["setmoney"]
  },
  async execute(event, player, args, sendMessage) {
    const Player = require('../models/Player');
    const targetID = args[0];
    const amount = parseInt(args[1]);

    if (!targetID || isNaN(amount)) return sendMessage(event.sender.id, "❌ Usage: setbal <id> <amount>");

    let targetPlayer = await Player.findOne({ psid: targetID });
    if (!targetPlayer) return sendMessage(event.sender.id, "❌ Player not found in database.");

    targetPlayer.balance = amount;
    await targetPlayer.save();
    
    sendMessage(event.sender.id, `✅ Successfully updated PSID ${targetID} to $${amount}.`);
    sendMessage(targetID, `📢 An admin has adjusted your balance to $${amount}.`);
  }
};
