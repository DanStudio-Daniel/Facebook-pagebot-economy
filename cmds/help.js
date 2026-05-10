module.exports = {
  metadata: {
    name: "help",
    description: "View all commands",
    usage: "help",
    adminOnly: false,
    aliases: ["h", "cmds"]
  },
  async execute(event, player, args, sendMessage) {
    const fs = require('fs');
    const path = require('path');
    const cmdFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
    
    if (args[0]) {
      const target = args[0].toLowerCase();
      let found = null;
      for (const file of cmdFiles) {
        const cmd = require(path.join(__dirname, file));
        if (cmd.metadata.name === target || (cmd.metadata.aliases && cmd.metadata.aliases.includes(target))) {
          found = cmd.metadata;
          break;
        }
      }
      if (found) return sendMessage(event.sender.id, `📖 ${found.name}\n${found.description}\nUsage: ${found.usage}`);
    }

    let list = "📜 Commands:\n";
    cmdFiles.forEach(file => {
      const cmd = require(path.join(__dirname, file));
      list += `- ${cmd.metadata.name}\n`;
    });
    sendMessage(event.sender.id, list);
  }
};