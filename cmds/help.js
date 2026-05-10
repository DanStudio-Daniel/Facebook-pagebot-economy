module.exports = {
  metadata: {
    name: "help",
    description: "Display the command menu",
    usage: "help <command>",
    adminOnly: false,
    aliases: ["cmds", "menu"]
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
      
      if (found) {
        return sendMessage(event.sender.id, 
          `✨ COMMAND INFO ✨\\n` +
          `━━━━━━━━━━━━━━\\n` +
          `🏷️ Name: ${found.name}\\n` +
          `📝 Info: ${found.description}\\n` +
          `🚀 Usage: ${found.usage}\\n` +
          `🔒 Admin: ${found.adminOnly ? "Yes" : "No"}\\n` +
          `🔗 Aliases: ${found.aliases.join(', ') || "None"}`
        );
      }
    }

    let menu = "🎮 ECONOMY BOT MENU 🎮\\n";
    menu += "━━━━━━━━━━━━━━\\n";
    
    cmdFiles.forEach(file => {
      const cmd = require(path.join(__dirname, file));
      if (!cmd.metadata.adminOnly) {
        menu += `🔹 ${cmd.metadata.name}\\n`;
      }
    });

    menu += "━━━━━━━━━━━━━━\\n";
    menu += "💡 Tip: Type 'help <command>' for more details.";
    
    sendMessage(event.sender.id, menu);
  }
};
