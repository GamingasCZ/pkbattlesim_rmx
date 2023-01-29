var USER_TEAMS = []
const TEAM_TEMPLATE = { name: "", trainer: "", pokemon: [], color: [1, 1] }
let newTeam;
let cardSelected;

function teamCard(trainerName, teamName, icon, colors, pokemon) {
    let bgColors = ["", "#45442D", "#3D201F", "#2B2245", "#371D36", "#2D291E", "#2B2715", "#2B2D17", "#2F263A", "#1E1E39", "#36281D", "#24304B", "#2B3D20", "#363118", "#321A21", "#24403F", "#302942", "#332318", "#361B29"]
    let card = $(`
    <div class="teamCard" style="background: linear-gradient(33deg, ${bgColors[colors[0]]}, ${bgColors[colors[1]]}); border-image: linear-gradient(33deg,${typeColors[colors[0]]}, ${typeColors[colors[1]]}) 30;">
        <div class="teamDetails">
            <img src="../assets/typeIcons/type_${icon}.webp" class="teamIcon">
            <div class="teamName">
                <h2>${trainerName}'s</h2>
                <h4>${teamName}</h4>
            </div>
            <img src="../assets/more.svg" class="teamMore">
        </div>
        <hr>
        <div class="partyContainer"></div>
    </div>
    `)
    pokemon.forEach(pk => {
        card.children().eq(2).append(`<img src="https://www.serebii.net/pokedex-sv/icon/new/${pk[0].toString().padStart(3, 0)}.png">`)
    });
    card.appendTo($(".teamsPKcontainer > td"))
    cardInd = $(".teamCard").length - 1
    card.click(() => {
        let edit = USER_TEAMS[cardInd]
        $("#trainerName").val(edit.trainer)
        $(".pillInput").val(edit.name)

        openDialog($("#teamGeneral"), 0)
    })
    card.children().eq(0).children().eq(2).click(el => { // Triple dot more
        $(".teamCard").css("pointer-events", "none")
        el.stopPropagation();
        cardSelected = $(".teamMore").index(el.currentTarget)
        $("body").one("touchmove", () => {
            $("#teamOptionDropdown").hide()
            $(".teamCard").css("pointer-events", "")
        })
        $("#teamOptionDropdown").css("top", $(el.currentTarget).position().top)
        $("#teamOptionDropdown").show()
        $("#teamOptionDropdown > div").off("click")
        $("#teamOptionDropdown > div").eq(0).on("touchstart", ok => { //Delete card
            // TODO: confirm dialog
            ok.stopPropagation();
            USER_TEAMS.splice(cardSelected, 1)
            localStorage.setItem("teams", JSON.stringify(USER_TEAMS))
            card.off("click")
            card.remove()
            $("#teamOptionDropdown").hide()
            $(".teamCard").css("pointer-events", "")
        })
        $("#teamOptionDropdown > div").eq(1).on("touchstart", ok => { //Move to top
            ok.stopPropagation();
            USER_TEAMS.unshift(USER_TEAMS[cardSelected])
            USER_TEAMS.splice(cardSelected + 1, 1)
            localStorage.setItem("teams", JSON.stringify(USER_TEAMS))
            card.insertBefore($(".teamCard:first"))
            $("#teamOptionDropdown").hide()
            $(".teamCard").css("pointer-events", "")
        })
    })
}

function getTeamAverageTyping(pokemon) {
    // arg0 example: [1, "Bulbasaur", [1,1]]
    let typeArray = []
    for (let i = 0; i < typeColors.length; i++) typeArray.push(0)
    pokemon.forEach(pk => {
        if (pk[2][0] == pk[2][1]) typeArray[pk[2][0]]++
        else {
            typeArray[pk[2][0]]++
            typeArray[pk[2][1]]++
        }
    });
    let max1 = typeArray.indexOf(Math.max.apply(null, typeArray))
    typeArray[max1] = -1
    let max2 = typeArray.indexOf(Math.max.apply(null, typeArray))

    return [max1, max2]
}

function addToTeam(id, name, types) {
    newTeam.pokemon.push([id, name, types])
}

function makeTeamBackground(pokemon) {
    $("#teamGeneral > #pokeBackground").append(`<div>${name}</div>`)
}
