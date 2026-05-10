module.exports = {
  metadata: {
    name: "id",
    description: "Get PSID",
    usage: "id",
    adminOnly: false,
    aliases: []
  },
  async execute(event, player, args, sendMessage) {
    sendMessage(event.sender.id, `Your ID: ${event.sender.id}`);
  }
};