class Setting {
    constructor(id, value, func) {
        this.id = id
        this.value = value
        this.func = func
    }

    callFunc() { if (this.func != null) this.func(this.value) }

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
front.on("updateResult", updateIsAvailable => {
    if (!updateIsAvailable[0]) return

    makeSlidebox(() => OPTIONS["updateCheck"].switchSetting(), $("#updateButtons > div[data-option=updateCheck]"), OPTIONS["updateCheck"].value)
    $("#newUpdate").text(updateIsAvailable[1])
    $("#updateLink").attr("href", updateIsAvailable[2])
    openDialog($("#update"), false)
})

function makeSettings() {
    $("#settingsMenu .slidebox").remove()

    let settings = $("#settingsMenu .settingsOption")
    for (let i = 0; i < settings.length; i++) {
        makeSlidebox(() => OPTIONS[settings.eq(i).attr("data-option")].switchSetting(), settings.eq(i), OPTIONS[settings.eq(i).attr("data-option")].value)
    }
}