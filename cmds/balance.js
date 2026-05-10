module.exports = {
  metadata: {
    name: "balance",
    description: "Check wallet",
    usage: "balance",
    adminOnly: false,
    aliases: ["bal"]
  },
  async execute(event, player, args, sendMessage) {
    sendMessage(event.sender.id, `💰 Balance: $${player.balance}`);
  }
};