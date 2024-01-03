import { CiscoAdvocates } from "./lib/ciscoadvocates.js";
import { EpicFreeGames } from "./lib/epicgames.js";
import "dotenv/config";

(async () => {
  await CiscoAdvocates();
})();
