const data = {
    armor: {
        by__profType: {
            Hunter__Thief: "Leather Armor",
            Knight: "Platemail",
            Mage__Priest: "Robes",
            Noble__Scholar: ["", "Robes"],
            Renegade: ["", "Leather Armor"],
            default: "",
        }
    },
    firstName: ["Adelbert", "Beatrice", "Celestine", "Duncan"],
    inventory: {
        count: {
            range: [1, 5]
        },
        collapse: true,
        sort: true,
        unique: false,
        value: [
            [
                "Cloak of {magic}",
                "Gauntlet of {magic}",
                "Ring of {magic}",
                "Tome of {magic}",
            ],
            [
                "Drum",
                "Flute",
                "Lute",
                "Lyre",
                "Pan Flute",
            ],
            "Candle",
            "Chain (10')",
            "Climbing Hook",
            "Dagger",
            "Glasses",
            "Lantern",
            "Lock Picking Set",
            [
                {
                    value: "Healing Potion",
                    p: 3,
                },
                {
                    value: "Potion of {magic}",
                    p: 1,
                },
            ],
            "Pry Bar",
            "Rope (50')",
            "Shovel",
            "Smoke Bomb",
            "Torch",
        ],
    },
    lastName: ["Beetleglen", "Candleroot", "Duskdale", "Foxhollow"],
    level: {
        exp_range: [1, 10, 4]
    },
    magic: ["Deep-iron", "Forge-fire", "Lost Whispers", "Radiance", "the Storm-wood", "the Silver-moon", "Wisp-fire", "the Wyrm-fang"],
    name: {
        format: ["{firstName} {lastName}", "{title}"]
    },
    profession: "{specialty} {profType}",
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
            value: "Noble",
            p: 1,
        },
        {
            value: "Priest",
            p: 1
        },
        {
            value: "Renegade",
            p: 2
        },
        {
            value: "Scholar",
            p: 2
        },
        {
            value: "Thief",
            p: 3
        }],
    specialty: ["dragon", "iron", "rune", "shadow"],
    spells: {
        by__profType: {
            Hunter: {
                count: {
                    by__level__range: {
                        _1: 0,
                        _2__3: 1,
                        _4__6: 2,
                        _7__8: 3,
                        _9__10: 4
                    }
                },
                value: [
                    "Animate Plants",
                    "Call of the Wild",
                    "Envenomed Strike",
                    "Storm Stride",
                    "Tangling Roots",
                ],
            },
            Mage: {
                count: "{level}",
                sort: true,
                unique: true,
                value: [
                    "Animate Weapon",
                    "Arcane Bolt",
                    "Astral Projection",
                    "Crystalize",
                    "Dragon's Fire",
                    "Ethereal Gate",
                    "Soul Shift",
                    "Storm Stride",
                    "Thundering Voice",
                    "Transmogrify",
                ],
            },
            Knight__Priest: {
                count: {
                    by__profType: {
                        Knight: {
                            by__level__range: {
                                _1: 0,
                                _2__3: 1,
                                _4__6: 2,
                                _7__8: 3,
                                _9__10: 4,
                            }
                        },
                        Priest: "{level}",
                    }
                },
                sort_by: "type",
                unique: true,
                value: [
                    "Blessing",
                    "Cleansing Fire",
                    "Conjure Spirit",
                    "Divine Rite",
                    "Exorcism",
                    "Heal",
                    "Pacify",
                    "Ray of Light",
                ],
            },
            default: "",
        },
    },
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
                    _8__10: ["{specialty}master", "Guildmaster"]
                }
            },
            default: ""
        }
    },
    weapon: {
        by__profType: {
            Hunter__Thief: {
                by__level__range: {
                    _1__5: ["bow", "crossbow", "dagger", "quarterstaff"],
                    _6__10: [
                        "bow of {magic}",
                        "crossbow of {magic}",
                        "dagger of {magic}",
                        "quarterstaff of {magic}",
                    ]
                }
            },
            Knight: {
                by__level__range: {
                    _1__5: ["axe", "flail", "hammer", "sword"],
                    _6__10: [
                        "axe of {magic}",
                        "flail of {magic}",
                        "sword of {magic}",
                        "hammer of {magic}",
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
            },
            Noble__Scholar: {
                by__level__range: {
                    _1__5: ["crossbow", "dagger", "quarterstaff"],
                    _6__10: [
                        "crossbow of {magic}",
                        "dagger of {magic}",
                        "quarterstaff of {magic}",
                    ]
                }
            },
            Renegade: {
                by__level__range: {
                    _1__5: ["axe", "crossbow", "dagger", "hammer", "quarterstaff", "sword",],
                    _6__10: [
                        "axe of {magic}",
                        "crossbow of {magic}",
                        "dagger of {magic}",
                        "hammer of {magic}",
                        "quarterstaff of {magic}",
                        "sword of {magic}",
                    ],
                }
            },
            default: ""
        }
    },
};

