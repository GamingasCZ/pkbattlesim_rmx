const back = require('androidjs').back;
const { battle } = require("pokemon-battle")
const file = require("fs")
const path = require("path")

back.on("doPopup", () => {
	let pkmn = JSON.parse(file.readFileSync(path.join(__dirname, "assets/pokemon.json"), { encoding: 'utf8', flag: 'r' }));
	back.send("doPopupResult", pkmn);
});

back.on("doBattle", teams => back.send("doBattleResult", battle(teams[0][0], teams[0][1])))
