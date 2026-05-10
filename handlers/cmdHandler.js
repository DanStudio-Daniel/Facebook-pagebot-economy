const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const commands = new Map();
const aliases = new Map();

const cmdFiles = fs.readdirSync(path.join(__dirname, '../cmds')).filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
  const command = require(`../cmds/${file}`);
  commands.set(command.metadata.name, command);
  if (command.metadata.aliases) {
    command.metadata.aliases.forEach(alias => aliases.set(alias, command));
  }
}

module.exports = async (event, player, sendMessage) => {
  const message = event.message.text;
  const prefix = config.prefix; // Now empty string
  
  if (prefix && !message.startsWith(prefix)) return;

  const args = message.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName) || aliases.get(commandName);

  if (command) {
    if (command.metadata.adminOnly && event.sender.id !== config.adminID) {
      return sendMessage(event.sender.id, "❌ Error: Admin only command.");
    }

    try {
      await command.execute(event, player, args, sendMessage);
    } catch (error) {
      console.error(error);
      sendMessage(event.sender.id, "⚠️ Error executing command.");
    }
  }
};