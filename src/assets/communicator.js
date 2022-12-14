front.send("doPopup");
var teams = [[], []]

class Setting {
    constructor(id, value, func) {
        this.id = id
        this.value = value
        this.func = func
    }

    callFunc() {if (this.func != null) this.func(this.value)}

    switchSetting() {
        this.value = !this.value
        this.callFunc()
        saveSettings()
    }
}

var OPTIONS = {
    updateCheck: new Setting("updateCheck", true, checkUpdates),
    darkMode: new Setting("darkMode", true, appTheme)
}

function saveSettings() {
    let SHORT_OPT = {}
    Object.keys(OPTIONS).forEach(key => {
        SHORT_OPT[key] = OPTIONS[key].value
    })

    localStorage.setItem("settings", JSON.stringify(SHORT_OPT))
}

let sett = localStorage.getItem("settings")
if (sett == null) {
    saveSettings()
} else { // Loading settings
    let settArray = JSON.parse(sett)
    Object.keys(settArray).forEach(key => {
        OPTIONS[key].value = settArray[key]
        OPTIONS[key].callFunc()
    })
}

function appTheme(pick) {
    let picks = ["LIGHT", "DARK"]
    let option = picks[pick | 0]
    $(":root").css("--BG", `var(--DEF-${option}-BG)`)
    $(":root").css("--CARD", `var(--DEF-${option}-CARD)`)
    $(":root").css("--POPUPBG", `var(--DEF-${option}-POPUPBG)`)
    $(":root").css("--INPUT", `var(--DEF-${option}-INPUT)`)
    $(":root").css("--BORDER", `var(--DEF-${option}-BORDER)`)
    $(":root").css("--TEXT", `var(--DEF-${option}-TEXT)`)
    $(":root").css("--INVERT", `var(--DEF-${option}-INVERT)`)
}

function checkUpdates(pick) {
    if (!pick || $("#settings").prop("open")) return
    front.send("doCheckUpdate")
}

window.onerror = function (msg, url, lineNo, columnNo, error) {
    alert(msg)
}

function ballSvg(el, types) {
    let typeColors = ["", "#a8a77a", "#c22e28", "#a98ff3", "#a33ea1", "#e2bf65", "#b6a136", "#a6b91a", "#735797", "#b7b7ce", "#ee8130", "#6390f0", "#7ac74c", "#f7d02c", "#f95587", "#96d9d6", "#6f35fc", "#705746", "#d685ad"]
    let gradID = (new Date).getTime()
    let ball = `
    <svg class="pkmnImage" style="height:5em" id="svg5" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs id="defs2">
     <linearGradient id="lg${gradID}" x1="4.9059" x2="26.997" y1="27.499" y2="4.3797" gradientUnits="userSpaceOnUse">
      <stop id="stop2292" stop-color="${typeColors[types[0]]}" offset="0"/>
      <stop id="stop2294" stop-color="${typeColors[types[1]]}" offset="1"/>
     </linearGradient>
    </defs>
    <g id="layer1">
     <path id="path2226" d="m16 0a16 16 0 0 0-15.881 14.324h10.359a5.8034 5.8034 0 0 1 5.5215-4.127 5.8034 5.8034 0 0 1 5.5215 4.127h10.389a16 16 0 0 0-15.91-14.324zm0.015625 12.938a3.0634 3.0634 0 0 0-3.0645 3.0625 3.0634 3.0634 0 0 0 3.0645 3.0625 3.0634 3.0634 0 0 0 3.0625-3.0625 3.0634 3.0634 0 0 0-3.0625-3.0625zm-15.896 4.7383a16 16 0 0 0 15.881 14.324 16 16 0 0 0 15.881-14.324h-10.359a5.8034 5.8034 0 0 1-5.5215 4.127 5.8034 5.8034 0 0 1-5.5215-4.127h-10.359z" fill="url(#lg${gradID})" style="paint-order:fill markers stroke"/>
    </g>
   </svg>
    `
    $(".loadPlaceholder").remove()
    el.prepend(ball)
}

function pokemonThumb(id, name, types) {
    var card = $(`
        <div class="pokemonCard columnFlex">
            <div id="loadingContainer" class="columnFlex">
                <img src="../assets/loading.svg" id="loadingBall"><img src="../assets/loadingCircle.svg" id="loadingCircle">
            </div>
            <div class="loadPlaceholder"></div>
            <span>${name}</span>
        </div>
    `)
    card.appendTo($(".teamContainer").eq(inpSelected))

    let image = new Image()
    image.src = `https://serebii.net/pokemon/art/${String(id).padStart(3, "0")}.png`
    image.addEventListener('load', () => {
        card.prepend(`<img src=${image.src} class="pkmnImage">`)
        $("#loadingContainer").remove()
        $(".loadPlaceholder").remove()
    })
    image.addEventListener('error', () => {
        $("#loadingContainer").remove()
        ballSvg(card, types)
    })

    card.click(el => {
        parent = $(el.currentTarget).closest("#oContainer").length
        teams[parent].splice($(el.currentTarget).parent().children().index($(el.currentTarget)) - 1, 1)
        $(el.currentTarget).remove()
        updateBattleButton()
        if (teams[parent].length == 6) $(".pokemonInput").eq(parent).attr("disabled", true)
        else $(".pokemonInput").eq(parent).attr("disabled", false)
        if (teams[parent].length == 0) $(".containerTutorial").eq(parent).show()
    })
}

function pokemonOption(messageJSON) {
    let pokemons = messageJSON
    Object.values(pokemons).forEach(pkmn => {
        let option = document.createElement("button")

        let id = pkmn.id
        let name = pkmn.name
        let types = pkmn.types.length == 2 ? pkmn.types : [pkmn.types[0], pkmn.types[0]]

        option.addEventListener("mousedown", () => {
            $(".containerTutorial").eq(inpSelected).hide()
            pokemonThumb(id, name, types)
            teams[inpSelected].push(id)
            if (teams[inpSelected].length == 6) $(".pokemonInput").eq(inpSelected).attr("disabled", true)
            else $(".pokemonInput").eq(inpSelected).attr("disabled", false)
            updateBattleButton()
        })
        option.innerText = `#${String(id).padStart(3, "0")} - ${name}`
        option.className = "pokeOption"
        document.querySelector("#pokemonDropdown").appendChild(option)
    });
    $("#main").removeClass("mainDisabled")
    $(".pokemonInput").attr("disabled", false)
    $("#status").text("Finished!")
    $("#status").css("transform", "scaleY(0)")
}

function updateBattleButton() {
    let hasPokemon = teams[0].length == 0 || teams[1].length == 0
    if (hasPokemon) $("#battleButton").attr("disabled", true)
    else $("#battleButton").attr("disabled", false)
    return !hasPokemon
}

var inpSelected = -1
var OPTIONS
front.on("doPopupResult", msg => {
	pokemonOption(msg)
    
    $(".pokemonInput").focus(el => {
        filterSearch(el)

        $("#pokemonDropdown").css("display", "")
        $("#pokemonDropdown").css("top", el.target.offsetTop + el.target.clientHeight + "px")
        inpSelected = $(el.target).attr("id") != "playerSearch" | 0
    })

    $(".pokemonInput").blur(() => {
        $("#pokemonDropdown").css("display", "none")
    })

    $("#playerSearch").keyup(el => filterSearch(el))
    $("#oppoSearch").keyup(el => filterSearch(el))

    $("#battleButton").click(() => {
        if (!updateBattleButton()) return
        front.send("doBattle", [teams])
    })

    $("#title").click(() => openDialog($("#credits"), 0))
    $("#settingsButton").click(openSettings)
    $("#darkBG").click(hideDialog)
    $("#battleClose").click(hideDialog)
    $("#battleRematch").click(() => front.send("doBattle", [teams]))
});

front.on("doBattleResult", battleResult => {
    $("#result").text(battleResult)
    openDialog($("#battleDialog"), 1)
})

function openSettings() {
    $("#settings .slidebox").remove()

    let settings = $("#settings > .settingsOption")
    for (let i = 0; i < settings.length; i++) {
        makeSlidebox(() => OPTIONS[settings.eq(i).attr("data-option")].switchSetting(), settings.eq(i), OPTIONS[settings.eq(i).attr("data-option")].value)
    }

    openDialog($("#settings"), 0)
}


function filterSearch(el) {
    if ($(el.currentTarget).val().length <= 1) { // Start search with 2 or more characters
        $(".pokeOption").show()
        return
    }

    let query = $(el.currentTarget).val()
    let capitalized = query[0].toUpperCase() + query.slice(1)
    $(".pokeOption").hide()
    $(`.pokeOption:contains('${capitalized}')`).show()
}

function openDialog(dialog, isFS) {
    if (!isFS) {
        $("#darkBG").css("display", "block")
        $("#darkBG").css("opacity", 0.5)
    }
    dialog.attr("open", true)
    dialog.css("animation-name", "popup")
}

function hideDialog() {
    $("#darkBG").css("opacity", 0)
    $("dialog").css("animation-name", "popupClose")
    setTimeout(() => {
        $("dialog").attr("open", false)
        $("#darkBG").css("display", "none")
    }, 250);
}

front.on("updateResult", updateIsAvailable => {
    if (!updateIsAvailable[0]) return

    makeSlidebox(() => OPTIONS["updateCheck"].switchSetting(), $("#updateButtons > div[data-option=updateCheck]"), OPTIONS["updateCheck"].value)
    $("#newUpdate").text(updateIsAvailable[1])
    $("#updateLink").attr("href", updateIsAvailable[2])
    openDialog($("#update"), false)
})

function makeSlidebox(func, appendToElement, on = false) {
    let slider = document.createElement("input")
    slider.type = "checkbox";
    slider.checked = on
    slider.id = "slider"
    slider.className = "slidebox"

    slider.addEventListener("mousedown", ev => {
        ev.preventDefault()
        func()
    })
    appendToElement.append(slider)
}