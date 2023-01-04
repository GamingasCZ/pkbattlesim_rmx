const back = require('androidjs').back;
const { battle, stats } = require("pokemon-battle")
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
			let res = JSON.parse(xhr.responseText)
			let newestVersion = res.tag_name.slice(1)
			let package = JSON.parse(file.readFileSync(path.join(__dirname, "package.json"), { encoding: 'utf8', flag: 'r' }));
			back.send("updateResult", [package.version != newestVersion, newestVersion, res.assets[0].browser_download_url])
		}
		else if (this.readyState == 4 && this.status != 200) back.send("updateResult", [false]) // Most likely status 503, no internet
	};
	
	let key = file.readFileSync(path.join(__dirname, "api-key"), { encoding: 'utf8', flag: 'r' })
	xhr.open("GET", "https://api.github.com/repos/GamingasCZ/pkbattlesim_rmx/releases/latest", true)
	xhr.setRequestHeader("auth", key)
	xhr.send()
	
})

back.on("doBattle", teams => back.send("doBattleResult", battle(teams[0][0], teams[0][1])))
back.on("doSearch", pkID => back.send("foundPKMN", [stats(pkID[0]), pkID[1]]))