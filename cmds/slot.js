module.exports = {
  metadata: {
    name: "slot",
    description: "Gamble money",
    usage: "slot <amount>",
    adminOnly: false,
    aliases: ["slots"]
  },
  async execute(event, player, args, sendMessage) {
    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0) return sendMessage(event.sender.id, "❌ Enter amount.");
    if (player.balance < bet) return sendMessage(event.sender.id, "❌ No money.");
    const items = ["🍎", "🍋", "🍒", "💎"];
    const [c1, c2, c3] = [0,0,0].map(() => items[Math.floor(Math.random() * items.length)]);
    let msg = `[ ${c1} | ${c2} | ${c3} ]\n`;
    if (c1 === c2 && c2 === c3) { player.balance += bet * 5; msg += "WIN!"; }
    else { player.balance -= bet; msg += "LOST."; }
    await player.save();
    sendMessage(event.sender.id, msg + ` Balance: $${player.balance}`);
  }
};