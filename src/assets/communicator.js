front.send("doPopup");
var teams = [[], []]
var typeColors = ["", "#a8a77a", "#c22e28", "#a98ff3", "#a33ea1", "#e2bf65", "#b6a136", "#a6b91a", "#735797", "#b7b7ce", "#ee8130", "#6390f0", "#7ac74c", "#f7d02c", "#f95587", "#96d9d6", "#6f35fc", "#705746", "#d685ad"]

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
    darkMode: new Setting("darkMode", true, appTheme),
    animations: new Setting("animations", true, null),
    artFetch: new Setting("artFetch", true, null)
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
    $("#loadingContainer").remove()
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

let originalCardPos = 0
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
    card.appendTo($(".teamPokemon").eq(inpSelected))

    // card.click(el => removeCard(el))
    card.click(() => openStatView(id))

    card.on('touchmove', e => { // Removing pokemon
        let y = e.targetTouches[0].pageY

        if (originalCardPos == 0) originalCardPos = y
        else {
            if (y-originalCardPos < 0) return
            if (1-(y-originalCardPos)/50 <= 0) {removeCard(e.currentTarget); return}
    
            $(e.currentTarget).css("opacity", 1-(y-originalCardPos)/50)
            $(e.currentTarget).css("transform", `translateY(${y-originalCardPos}px)`)
        }
    });

    card.on('touchend', e => { // Drag stop in middle of deleting
        originalCardPos = 0
        $(e.currentTarget).css("opacity", 1)
        $(e.currentTarget).css("transform", `none`)
    })

    if (!OPTIONS.artFetch.value) return ballSvg(card, types)
    let image = new Image() // Fetching art
    image.src = `https://serebii.net/pokemon/art/${String(id).padStart(3, "0")}.png`
    image.addEventListener('load', () => {
        card.prepend(`<img src=${image.src} class="pkmnImage">`)
        $("#loadingContainer").remove()
        $(".loadPlaceholder").remove()
    })
    image.addEventListener('error', () => ballSvg(card, types))
}

function spritePlaceholder(height) { 
    // Choose placeholder based on pk height
    if (height < 0.7) $(":root").css("--pk-view-bg", `url(../assets/placeholders/smallest.svg)`)
    else if (height < 1.2) $(":root").css("--pk-view-bg", `url(../assets/placeholders/normal.svg)`)
    else if (height < 1.7) $(":root").css("--pk-view-bg", `url(../assets/placeholders/large.svg)`)
    else $(":root").css("--pk-view-bg", `url(../assets/placeholders/biggest.svg)`)
}

function openStatView(pkID) {
    front.send("doSearch", [pkID, 2])
    front.on("foundPKMN", pkData => {
        if (pkData[1] != 2) return
        pkData = pkData[0]
        let types = pkData.type.length == 2 ? pkData.type : [pkData.type[0], pkData.type[0]]

        if (!OPTIONS.artFetch.value) spritePlaceholder(pkData.height)
        else {
            let image = new Image() // Fetching art
            image.src = `https://serebii.net/pokemon/art/${String(pkData.id).padStart(3, "0")}.png`
            image.addEventListener('load', () => $(":root").css("--pk-view-bg", `url(${image.src})`))
            image.addEventListener('error', () => spritePlaceholder(pkData.height))
        }


        $("#pkTitle").text(pkData.name)
        $("#pokeBackground").css("background", `linear-gradient(35deg, ${typeColors[types[0].id]}, ${typeColors[types[1].id]}), url(../assets/pokeBG.svg)`)

        let total = Object.values(pkData.stats).reduceRight((acc, cur) => acc + cur, 0)
        $("#statTotal").text(total)

        for (let i = 0; i < $("#pkStatsContainer > div").length; i++) {
            let stat = Object.values(pkData.stats)[i]
            let perc = stat/255*100
            $("#pkStatsContainer > div").eq(i).text(stat)
            $("#pkStatsContainer > progress").eq(i).val(perc)
            let hues = ["red","orange","yellow","lgreen","green","turq","blue"]
            $("#pkStatsContainer > progress").eq(i).addClass("pr_"+hues[Math.round(perc/14)])
        }

        $("#pkMoveContainer").empty()
        pkData.moves.forEach(x => {
            $("#pkMoveContainer").append(`
            <div class="moveBubble" style="background: ${typeColors[x.type]}">
                <img src="../assets/typeIcons/type_${x.type}.webp">
                <label>${x.name}</label>
            </div>
            `)
        })

        $(".typeBadge").eq(1).children().eq(0).attr("src", `../assets/typeIcons/none.svg`)
        $(".typeBadge").eq(1).children().eq(1).text("None")
        
        $(".typeBadge").eq(0).children().eq(0).attr("src", `../assets/typeIcons/type_${pkData.type[0].id}.webp`)
        $(".typeBadge").eq(0).children().eq(1).text(pkData.type[0].name)
        if (types[0].id != types[1].id) {
            $(".typeBadge").eq(1).children().eq(0).attr("src", `../assets/typeIcons/type_${pkData.type[1].id}.webp`)
            $(".typeBadge").eq(1).children().eq(1).text(pkData.type[1].name)
        }

        $(".tabHeader").children().click(e => {
            let pos = $(e.currentTarget).index()
            tabScroll($(e.currentTarget).parent(), pos)
        })

        $(".tabContent").on("scroll", e => {
            let scroll = Math.round((e.currentTarget.scrollLeft-24)/(maxScroll(e.currentTarget)+$(e.currentTarget).width())*100)
            $(":root").css("--tabScrollLine", `${scroll}%`)
        })

        openDialog($("#statView"), 0)

        $(":root").css("--statAnim", "var(--pkDance)")
        setTimeout(() => {
            $(":root").css("--statAnim", "var(--pkBreathe)")
        }, 1500);
    })
}

function tabScroll(element, option) {
    let pos = Math.round(option/element.children().length*100)
    $(":root").css("--tabScrollLine", `${pos}%`)
    element.children().removeClass("tabSelected")
    element.children().eq(option).addClass("tabSelected")
    let card = $(".tabContent").children().eq(option)
    $(".tabContent")[0].scrollTo(option*card.width()*1.25+24, 0)
}

function removeCard(el) {
    originalCardPos = 0
    parent = $(el).closest("#oContainer").length // 0 or 1 (terribly written :D)
    teams[parent].splice($(el).parent().children().index($(el)), 1)
    $(el).remove()
    updateBattleButton()
    if (teams[parent].length == 6) $(".pokemonInput").eq(parent).attr("disabled", true)
    else $(".pokemonInput").eq(parent).attr("disabled", false)
    if (teams[parent].length == 0) $(".containerTutorial").eq(parent).show()
}

function pokemonOption(messageJSON) {
    let pokemons = messageJSON
    Object.values(pokemons).forEach(pkmn => {
        let option = document.createElement("button")

        let id = pkmn.id
        let name = pkmn.name
        let types = pkmn.types.length == 2 ? pkmn.types : [pkmn.types[0], pkmn.types[0]]

        option.addEventListener("mousedown", () => addPokemon(id, name, types))
        option.innerText = `#${String(id).padStart(3, "0")} - ${name}`
        option.className = "pokeOption"
        document.querySelector("#pokemonDropdown").appendChild(option)
    });
    $("#main").removeClass("mainDisabled")
    $(".pokemonInput").attr("disabled", false)
    $("#status").text("Finished!")
    $("#status").css("transform", "scaleY(0)")
}

function addPokemon(id, name, types) {
    $(".containerTutorial").eq(inpSelected).hide()
    pokemonThumb(id, name, types)
    teams[inpSelected].push(id)
    if (teams[inpSelected].length == 6) {
        $(".randomPokemon").eq(inpSelected).attr("disabled", true)
        $(".pokemonInput").eq(inpSelected).attr("disabled", true)
    }
    else $(".pokemonInput").eq(inpSelected).attr("disabled", false)
    updateBattleButton()    
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
    makeSettings();
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

    $(".randomPokemon").click(el => {
        inpSelected = parseInt(el.currentTarget.getAttribute("data-ind"))
        let pokeRandom = Math.round(1+Math.random()*1007)
        front.send("doSearch", [pokeRandom, 1])
    })

    $("#playerSearch").keyup(el => filterSearch(el))
    $("#oppoSearch").keyup(el => filterSearch(el))

    $("#battleButton").click(() => {
        if (!updateBattleButton()) return
        front.send("doBattle", [teams])
    })

    $("#darkBG").click(hideDialog)
    $("#battleClose").click(hideDialog)
    $("#battleRematch").click(() => front.send("doBattle", [teams]))
});
$("#creditsButton").click(() => openDialog($("#credits"), 0))

front.on("foundPKMN", pkData => {
    if (pkData[1] != 1) return
    pkData = pkData[0]
    let types = pkData.type.length == 2 ? [pkData.type[0].id, pkData.type[1].id] : [pkData.type[0].id, pkData.type[0].id]
    addPokemon(pkData.id, pkData.name, types)
})

front.on("doBattleResult", battleResult => {
    $("#result").text(battleResult)
    openDialog($("#battleDialog"), 1)
})

function makeSettings() {
    $("#settingsMenu .slidebox").remove()

    let settings = $("#settingsMenu .settingsOption")
    for (let i = 0; i < settings.length; i++) {
        makeSlidebox(() => OPTIONS[settings.eq(i).attr("data-option")].switchSetting(), settings.eq(i), OPTIONS[settings.eq(i).attr("data-option")].value)
    }
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

function makeNumInput(affectValue, appendToElement, def = 50, min = 0, max = 100) {
    let inpContainer = $("<div class='numInput'></div>")
    let display = $(`<input class="numDisplay" type="number" value="${def}" min="${min}" max="${max}">`)
    display.appendTo(inpContainer)
    let numContainer = $("<div></div>")
    for (let i = -1; i <= 1; i+=2) {
        let button = $(`<button class='numIncrement'>${i == -1 ? "-" : "+"}</button>`)
        button.appendTo(numContainer)
        button.click(() => {display.val(parseInt(display.val())+i); clampNumInput(affectValue, display, min, max)})
        display.on("input", () => clampNumInput(affectValue, display, min, max))
        
    }
    numContainer.appendTo(inpContainer)
    inpContainer.appendTo(appendToElement)
}

const clampNumInput = (affectValue, display, min, max) => {
    console.log("hhi");
    let value = clamp(display.val(), min, max)
    display.val(value)
    affectValue = value
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const maxScroll = el => el.scrollWidth - el.clientWidth

$(function (){
    $("#addTeam").click(() => {
        openDialog($("#teamGeneral"), 0)
    })

    $("#addToTeam").click(() => {
        openDialog($("#teamPKList"), 0)
    })

    $(".navButton").click(el => {
        $("#mainContent")[0].scrollLeft = $("#mainContent > div").eq(0).width()*parseInt(el.currentTarget.getAttribute("data-ind"))*1.25
    })
    $("#mainContent").on("scroll", el => {
        let currentScroll = el.currentTarget.scrollLeft-24
        let max = maxScroll(el.currentTarget)-48
        let page = currentScroll/max*2

        let currentPage = $(".navButton").eq(Math.round(page)).children().eq(0)
        let nextPage = $(".navButton").eq(Math.floor(page)+1).children().eq(0)
        let prevPage = $(".navButton").eq(Math.floor(page)-1).children().eq(0)

        currentPage.css("opacity",(page%1)*2)
        nextPage.css("opacity",1-(page%1))
    })
})