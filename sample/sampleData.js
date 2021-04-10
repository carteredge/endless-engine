const data = {
    armor: {
        by__profType: {
            Hunter__Thief: "Leather Armor",
            Knight: "Platemail",
            Mage__Priest: "Robes"
        }
    },
    firstName: ["Adelbert", "Beatrice", "Celestine", "Duncan"],
    profession: "{specialty} {profType}",
    lastName: ["Beetleglen", "Candleroot", "Duskdale", "Foxhollow"],
    level: {
        exp_range: [1, 10, 4]
    },
    magic: ["the Storm-wood", "the Silver-moon", "Whisp-fire"],
    name: {
        format: ["{firstName} {lastName}", "{title}"]
    },
    profType: [
        {
            value: "Hunter",
            p: 3
        },
        {
            value: "Knight",
            p: 2
        },
        {
            value: "Mage",
            p: 1
        },
        {
            value: "Priest",
            p: 1
        },
        {
            value: "Thief",
            p: 3
        }],
    specialty: ["dragon", "iron", "rune", "shadow"],
    title: {
        by__profType: {
            Hunter: {
                by__level__range: {
                    _1__7: "",
                    _8__10: ["{specialty}master", "Beastmaster", "Guildmaster", "Huntmaster"],
                }
            },
            Knight: {
                by__level__range: {
                    _1: "Squire",
                    _2__4: "Knight",
                    _5__7: "{specialty} Commander",
                    _8__10: "{specialty} Captain"
                }
            },
            Mage: {
                by__level__range: {
                    _1__3: "Apprentice",
                    _4__8: ["Magus", "Professor"],
                    _9__10: "Archmagus"
                }
            },
            Priest: {
                by__level__range: {
                    _1__3: ["Deacon", "Druid", "Preacher", "Shaman"],
                    _4__6: ["Abbot", "Archpriest", "Druid", "Shaman"],
                    _7__8: ["{specialty}-speaker", "Bishop", "Elder"],
                    _9: ["{specialty}-speaker", "Archbishop", "Archdruid"],
                    _10: ["{specialty}-speaker", "Cardinal", "Archdruid"]
                }
            },
            Thief: {
                by__level__range: {
                    _1__7: "",
                    _8__10: ["{specialtymaster}", "Guildmaster"]
                }
            },
            default: ""
        }
    },
    weapon: {
        by__profType: {
            Hunter__Thief: {
                by__level__range: {
                    _1__5: ["bow", "crossbow", "dagger"],
                    _6__10: [
                        "bow of {magic}",
                        "crossbow of {magic}",
                        "dagger of {magic}"
                    ]
                }
            },
            Knight: {
                by__level__range: {
                    _1__5: ["sword", "flail", "axe"],
                    _6__10: [
                        "sword of {magic}",
                        "flail of {magic}",
                        "axe of {magic}"
                    ]
                }
            },
            Mage__Priest: {
                by__level__range: {
                    _1__5: ["staff", "wand"],
                    _6__10: [
                        "staff of {magic}",
                        "wand of {magic}"
                    ]
                }
            }
        }
    },
};

