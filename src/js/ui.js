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
    for (let i = -1; i <= 1; i += 2) {
        let button = $(`<button class='numIncrement'>${i == -1 ? "-" : "+"}</button>`)
        button.appendTo(numContainer)
        button.click(() => { display.val(parseInt(display.val()) + i); clampNumInput(affectValue, display, min, max) })
        display.on("input", () => clampNumInput(affectValue, display, min, max))

    }
    numContainer.appendTo(inpContainer)
    inpContainer.appendTo(appendToElement)
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

function tabScroll(element, option) {
    let pos = Math.round(option / element.children().length * 100)
    $(":root").css("--tabScrollLine", `${pos}%`)
    element.children().removeClass("tabSelected")
    element.children().eq(option).addClass("tabSelected")
    let card = $(".tabContent").children().eq(option)
    $(".tabContent")[0].scrollTo(option * card.width() * 1.25 + 24, 0)
}

$("#creditsButton").click(() => openDialog($("#credits"), 0))