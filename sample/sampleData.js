const data = {
    address: "{houseNo} {streetName} {streetType}",
    alias: [
        "Captain {subAlias}", "Professor {subAlias}", "The {subAlias}", "The Human {subAlias}"
    ],
    allegiance: [{
        value: "Good",
        p: 3
    },
    {
        value: "Evil",
        p: 2,
    }],
    animal: [
        {
            value: "badger",
            action: "Bitten",
        },
        {
            value: "bee",
            action: "Stung",
        },
        {
            value: "cat",
            action: "Scratched",
        },
        {
            value: "moose",
            action: "Bitten",  // Mind you, moose bites can be pretty nasty..
        },
    ],
    firstName: [
        "Maria", "José", "Mohammed", "Wei", "Ahmed", "Yan",
        "Ali", "John", "David", "Li", "Abdul", "Ana",
    ],
    houseNo: {range: [1, 999]},
    lastName: [
        "Wang", "Zhang", "Kumar", "Garcia", "Hernandez", "Smith",
    ],
    name: {
        format: ["{firstName} {lastName}", "{address}"]
    },
    ordinal: {
        by__ordinalNo__range: {
            _1: "1st",
            _2: "2nd",
            _3: "3rd",
            _4__20: "{ordinalNo}th",
        }
    },
    ordinalNo: {range: [1, 20]},
    originOfPowers: [
        "Alien", "Cybernetics", "{animal__action} by a radioactive {animal}",
        "Magic", "Mutation", "Power suit", "Super serum",
    ],
    powerLevel: {exp_range: [1, 10, 5]},
    streetName: ["{ordinal}", "East", "Elm", "Main", "North", "Oak", "South", "West",],
    streetType: ["Ave.", "Dr.", "Ln.", "St.",],
    subAlias: {
        by__superpower: {
            fireManipulation: ["Cinder", "Flame", "Scorch"],
            flight: ["Hawk", "Jet", "Skyshot"],
            iceManipulation: ["Blizzard", "Frost", "Winter"],
            invisibility: ["Blink", "Shadow", "Shinobi", "Specter",],
            psychicAbilities: ["Cosmos", "Oracle", "Mastermind"],
            superSpeed: ["Bullet", "Dash", "Lightspeed", "Warp"],
            superStrength: ["Behemoth", "Brute", "Crusher"],
            teleportation: ["Portal", "Void"],
            weatherManipulation: ["Bolt", "Stormcloud", "Thunder",],
        },
    },
    superpower: [
        "fireManipulation", "flight", "iceManipulation", "invisibility",
        "psychicAbilities", "superSpeed", "superStrength", "teleportation",
        "weatherManipulation",
    ],
};

