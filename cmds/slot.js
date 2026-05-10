/**
 * @template_for_economy_bot
 * This structure is required for the handler to register metadata and execution logic.
 */

// Store user cooldown timestamps
const cooldowns = new Map();
const COOLDOWN_TIME = 2000; // 2 seconds in milliseconds

module.exports = {
  metadata: {
    name: "slot",
    description: "Play slot machine — bet coins & win up to 10x your bet | 2s cooldown",
    usage: "slot <amount>",
    adminOnly: false,
    aliases: ["slots", "bet", "gamble"]
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
      const now = Date.now();

      // -------------------------- COOLDOWN CHECK --------------------------
      if (cooldowns.has(psid)) {
        const lastUsed = cooldowns.get(psid);
        const timeDiff = now - lastUsed;
        if (timeDiff < COOLDOWN_TIME) {
          const waitTime = ((COOLDOWN_TIME - timeDiff) / 1000).toFixed(1);
          return sendMessage(psid, `⏳ Please wait ${waitTime}s before playing again.`);
        }
      }
      // Set new cooldown
      cooldowns.set(psid, now);

      // -------------------------- VALIDATION --------------------------
      const betAmount = parseInt(args[0]);
      if (isNaN(betAmount) || betAmount <= 0) {
        return sendMessage(psid, "❌ Please enter a valid bet amount.\nUsage: slot <amount>\nExample: slot 100");
      }

      if (!player.coins || player.coins < betAmount) {
        return sendMessage(psid, "❌ You don't have enough coins!\nCheck your balance with *balance*");
      }

      // -------------------------- SLOT SETTINGS --------------------------
      const symbols = ["🍒", "🍊", "🍋", "🍇", "🔔", "💎", "7️⃣"];
      const multipliers = [2, 4, 6, 8, 10]; // Multipliers as requested
      const reels = [];

      // Spin 3 reels
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        reels.push(symbols[randomIndex]);
      }

      // -------------------------- CHECK WIN --------------------------
      let winMultiplier = 0;

      // All 3 same → win higher multiplier
      if (reels[0] === reels[1] && reels[1] === reels[2]) {
        const symbolRank = symbols.indexOf(reels[0]);
        winMultiplier = multipliers[Math.min(symbolRank, multipliers.length - 1)];
      }
      // 2 same → small win (2x)
      else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        winMultiplier = 2;
      }

      // -------------------------- CALCULATE RESULT --------------------------
      let resultText = `🎰 ＳＬＯＴ ＭＡＣＨＩＮＥ 🎰
━━━━━━━━━━━━━━━━━━━
   ${reels[0]} | ${reels[1]} | ${reels[2]}
━━━━━━━━━━━━━━━━━━━\n`;

      if (winMultiplier > 0) {
        const winCoins = betAmount * winMultiplier;
        player.coins += winCoins - betAmount; // return bet + profit
        resultText += `✅ ＷＩＮ！
Multiplier: ${winMultiplier}x
You won: 🪙 ${winCoins.toLocaleString()} coins`;
      } else {
        player.coins -= betAmount;
        resultText += `❌ ＬＯＳＥ
You lost: 🪙 ${betAmount.toLocaleString()} coins`;
      }

      resultText += `\n\n💰 New Balance: ${player.coins.toLocaleString()} coins`;

      // Save changes to database
      await player.save();

      // Send result
      sendMessage(psid, resultText);

    } catch (error) {
      console.error(error);
      sendMessage(event.sender.id, "⚠️ Error running this command.");
    }
  }
};
          
