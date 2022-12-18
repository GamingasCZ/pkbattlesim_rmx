const back = require('androidjs').back;
const { battle } = require("pokemon-battle")
const file = require("fs")
const path = require("path")
const req = require("xmlhttprequest-ssl")

back.on("doPopup", () => {
	let pkmn = JSON.parse(file.readFileSync(path.join(__dirname, "assets/pokemon-min.json"), { encoding: 'utf8', flag: 'r' }));
	back.send("doPopupResult", pkmn);
});

back.on("doCheckUpdate", async () => {
	let xhr = new req
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			back.send("updateResult", JSON.parse(xhr.responseText))
		}
	};
	
	xhr.open("GET", "https://api.github.com/repos/GamingasCZ/pkbattlesim_rmx/releases/latest", true)
	xhr.setRequestHeader("auth", "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")
	xhr.send()
	
})

back.on("doBattle", teams => back.send("doBattleResult", battle(teams[0][0], teams[0][1])))