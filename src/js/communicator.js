front.send("doPopup");
var teams = [[], []]
var typeColors = ["", "#a8a77a", "#c22e28", "#a98ff3", "#a33ea1", "#e2bf65", "#b6a136", "#a6b91a", "#735797", "#b7b7ce", "#ee8130", "#6390f0", "#7ac74c", "#f7d02c", "#f95587", "#96d9d6", "#6f35fc", "#705746", "#d685ad"]

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
            if (y - originalCardPos < 0) return
            if (1 - (y - originalCardPos) / 50 <= 0) { removeCard(e.currentTarget); return }

            $(e.currentTarget).css("opacity", 1 - (y - originalCardPos) / 50)
            $(e.currentTarget).css("transform", `translateY(${y - originalCardPos}px)`)
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
    if (height < 0.7) $(":root").css("--pk-view-bg", `url(../assets/placeholders/smallest.png)`)
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
            let perc = stat / 255 * 100
            $("#pkStatsContainer > div").eq(i).text(stat)
            $("#pkStatsContainer > progress").eq(i).val(perc)
            let hues = ["red", "orange", "yellow", "lgreen", "green", "turq", "blue"]
            $("#pkStatsContainer > progress").eq(i).addClass("pr_" + hues[Math.round(perc / 14)])
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
            let scroll = Math.round((e.currentTarget.scrollLeft - 24) / (maxScroll(e.currentTarget) + $(e.currentTarget).width()) * 100)
            $(":root").css("--tabScrollLine", `${scroll}%`)
        })

        openDialog($("#statView"), 0)

        $(":root").css("--statAnim", "var(--pkDance)")
        setTimeout(() => {
            $(":root").css("--statAnim", "var(--pkBreathe)")
        }, 1500);
    })
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

var FAVORITE_POKEMON = []
let showingFaves = false
function pokemonOption(messageJSON) {
    let pokemons = messageJSON
    if (localStorage.getItem("favoritePokemon") != null) FAVORITE_POKEMON = JSON.parse(localStorage.getItem("favoritePokemon"))
    alert(FAVORITE_POKEMON.join(","))
    Object.values(pokemons).forEach(pkmn => {
        let option = document.createElement("button")

        let id = pkmn.id
        let name = pkmn.name
        let types = pkmn.types.length == 2 ? pkmn.types : [pkmn.types[0], pkmn.types[0]]

        option.addEventListener("mousedown", () => addPokemon(id, name, types))
        option.innerText = `#${String(id).padStart(3, "0")} - ${name}`
        option.className = "pokeOption"
        document.querySelector("#pokeSelectionContainer").appendChild(option)
        $(option).append("<img src='../assets/starUnfilled.svg' class='pokemonStar'>")
        $(".pokemonStar:last").on("mousedown", el => {
            el.stopPropagation()
            if (FAVORITE_POKEMON.includes(pkmn.id)) {
                $(el.currentTarget).attr("src", "../assets/starUnfilled.svg")
                FAVORITE_POKEMON.splice(FAVORITE_POKEMON.indexOf(pkmn.id), 1)
            }
            else {
                $(el.currentTarget).attr("src", "../assets/star.svg")
                FAVORITE_POKEMON.push(pkmn.id)
            }
            localStorage.setItem("favoritePokemon", JSON.stringify(FAVORITE_POKEMON))
        })
    });
    $("#main").removeClass("mainDisabled")
    $(".pokemonInput").attr("disabled", false)
}

function addPokemon(id, name, types) {
    if (inpSelected == 2) return addToTeam(id, name, types)

    $("#pokemonDropdown").hide()
    $(".pokemonInput").attr("disabled", false)
    $(".containerTutorial").eq(inpSelected).hide()
    pokemonThumb(id, name, types)
    teams[inpSelected].push(id)
    if (teams[inpSelected].length == 6) {
        $(".randomPokemon").eq(inpSelected).attr("disabled", true)
        $(".pokemonInput").eq(inpSelected).attr("disabled", true)
    }
    else {
        $(".randomPokemon").eq(inpSelected).attr("disabled", false)
        $(".pokemonInput").eq(inpSelected).attr("disabled", false)
    }
    updateBattleButton()
}



function updateBattleButton() {
    let hasPokemon = teams[0].length == 0 || teams[1].length == 0
    if (hasPokemon) $("#battleButton").attr("disabled", true)
    else $("#battleButton").attr("disabled", false)
    return !hasPokemon
}

var inpSelected = -1


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

function filterSearch(el) {
    if ($(el.currentTarget).val().length <= 1) { // Start search with 2 or more characters
        $(".pokeOption:not(.favesHidden)").show()
        return
    }

    let query = $(el.currentTarget).val()
    let capitalized = query[0].toUpperCase() + query.slice(1)
    $(".pokeOption").hide()
    $(`.pokeOption:not(.favesHidden):contains('${capitalized}')`).show()
}



function openPokeDropdown(el) {
    $("#pokeSearchInput").val("")
    $(".pokemonInput:not(#pokeSearchInput)").attr("disabled", true)
    $("#pokemonDropdown").show()
    $("#pokeSearchInput").focus()
    $("#closeDropdown").one("click", () => {
        $(".pokemonInput").attr("disabled", false)
        $("#pokemonDropdown").hide()
    })
    FAVORITE_POKEMON.forEach(pk => {
        $(".pokemonStar").eq(pk-1).attr("src", "../assets/star.svg")
    });

    // $("#pokemonDropdown").css("display", "")
    inpSelected = ["playerSearch", "oppoSearch", "addToTeam"].indexOf($(el.target).attr("id"))
    el.preventDefault()
}

const clampNumInput = (affectValue, display, min, max) => {
    let value = clamp(display.val(), min, max)
    display.val(value)
    affectValue = value
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const maxScroll = el => el.scrollWidth - el.clientWidth

front.on("doPopupResult", msg => {
    $("#battleRematch:not(.teamSave)").click(() => front.send("doBattle", [teams]))
    pokemonOption(msg)
});


$(function () {
    $(".addTeam").click(() => {
        newTeam = TEAM_TEMPLATE;
        openDialog($("#teamGeneral"), 0)
    })
    $("#addToTeam").click(el => { openPokeDropdown(el) })
    $("#trainerName").on("change", el => {
        newTeam.trainer = el.currentTarget.value
    })
    $(".pillInput").on("change", el => {
        newTeam.name = el.currentTarget.value
    })
    if (localStorage.getItem("teams") != null) {
        USER_TEAMS = JSON.parse(localStorage.getItem("teams"))
        USER_TEAMS.forEach(team => {
            teamCard(team.trainer, team.name, team.color[0], team.color, team.pokemon)
        });
    }
    $(".teamSave").click(() => {
        USER_TEAMS.push(newTeam)
        newTeam.color = getTeamAverageTyping(newTeam.pokemon)
        teamCard(newTeam.trainer, newTeam.name, newTeam.color[0], newTeam.color, newTeam.pokemon)
        localStorage.setItem("teams", JSON.stringify(USER_TEAMS))
    })

    $(".navButton").click(el => $("#mainContent")[0].scrollLeft = $("#mainContent > div").eq(0).width() * parseInt(el.currentTarget.getAttribute("data-ind")) * 1.25)
    $("#mainContent").on("scroll", el => {
        let currentScroll = el.currentTarget.scrollLeft - 24
        let max = maxScroll(el.currentTarget) - 48
        let page = currentScroll / max * 2

        let currentPage = $(".navButton").eq(Math.round(page)).children().eq(0)
        let nextPage = $(".navButton").eq(Math.floor(page) + 1).children().eq(0)
        let prevPage = $(".navButton").eq(Math.floor(page) - 1).children().eq(0)

        currentPage.css("opacity", Math.round((page % 1) * 2 * 10) / 10)
        nextPage.css("opacity", Math.round((1 - page % 1) * 10) / 10)
    })

    makeSettings();

    $(".pokemonInput:not(#trainerName, #pokeSearchInput)").click(el => openPokeDropdown(el))

    $(".randomPokemon").click(el => {
        inpSelected = parseInt(el.currentTarget.getAttribute("data-ind"))
        let pokeRandom = Math.round(1 + Math.random() * 1007)
        front.send("doSearch", [pokeRandom, 1])
    })

    $("#pokeSearchInput").keyup(el => filterSearch(el))
    $("#showFavesOnly").click(el => {
        if (!showingFaves) {
            $(el.currentTarget).attr("src", "../assets/star.svg")
            $(".pokeOption").hide()
            $(".pokeOption").addClass("favesHidden")
            let opt = $(`.pokemonStar[src*='star.svg']`).parent()
            opt.removeClass("favesHidden")
            opt.show()
            // FAVORITE_POKEMON.forEach(pk => {
            //     // let opt = $(`.pokeOption:contains('#${String(pk).padStart(3, "0")}')`)
            // });
        }
        else {
            $(".pokeOption").removeClass("favesHidden")
            $(el.currentTarget).attr("src", "../assets/starUnfilled.svg")
            filterSearch({currentTarget: $("#pokeSearchInput")[0]})
        }
        showingFaves = !showingFaves
    })

    $("#battleButton").click(() => {
        if (!updateBattleButton()) return
        front.send("doBattle", [teams])
    })

    $("#darkBG").click(hideDialog)
    $("#battleClose").click(hideDialog)
    $(".pillInput").on("input", e => { $(e.target).width(0); $(e.target).width(e.target.scrollWidth) })
    
})