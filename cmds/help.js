/**
 * @template_for_economy_bot
 * This structure is required for the handler to register metadata and execution logic.
 */

const fs = require('fs');
const path = require('path');

// Load all commands from same directory
const commands = new Map();
const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== path.basename(__filename));

for (const file of commandFiles) {
  const cmd = require(path.join(__dirname, file));
  if (cmd.metadata?.name) {
    commands.set(cmd.metadata.name, cmd.metadata);
    cmd.metadata.aliases?.forEach(alias => commands.set(alias, cmd.metadata));
  }
}

module.exports = {
  metadata: {
    name: "help",
    description: "Show all commands or details for a specific command",
    usage: "help [command]",
    adminOnly: false,
    aliases: ["h", "commands", "cmds"]
  },

  /**
   * @param {Object} event - The Facebook messaging event object
   * @param {Object} player - The Mongoose player document from MongoDB
   * @param {Array} args - Array of strings containing user arguments
   * @param {Function} sendMessage - Function to reply (usage: sendMessage(psid, text))
   */
  async execute(event, player, args, sendMessage) {
    try {
      const psid = event.sender.id;
      const input = args[0]?.toLowerCase();

      // --- HELP [COMMAND] — Show single command details
      if (input) {
        const cmdData = commands.get(input);
        if (!cmdData) return sendMessage(psid, `❌ Command *${input}* not found.`);

        return sendMessage(psid, `📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗: ${cmdData.name}
━━━━━━━━━━━━━━━━
📝 Description: ${cmdData.description}
⌨️ Usage: ${cmdData.usage}
🔹 Aliases: ${cmdData.aliases?.join(', ') || 'None'}
🔒 Admin Only: ${cmdData.adminOnly ? 'Yes' : 'No'}`);
      }

      // --- HELP — Show all commands list
      const uniqueCommands = Array.from(new Map(Array.from(commands.entries()).filter(([_, v]) => !v._isAlias)).values());
      const allCommands = [...new Set(Array.from(commands.values()).map(c => c.name))];

      let text = `📋 𝗔𝗟𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦
━━━━━━━━━━━━━━━━\n`;

      // Remove duplicates & format
      const listed = [];
      for (const [_, meta] of commands) {
        if (!listed.includes(meta.name)) {
          listed.push(meta.name);
          text += `• *${meta.name}* — ${meta.description}\n`;
        }
      }

      text += `\nℹ️ Use *help <command>* to see more details`;
      sendMessage(psid, text);

    } catch (error) {
      console.error(error);
      sendMessage(event.sender.id, "⚠️ Error running this command.");
    }
  }
};
