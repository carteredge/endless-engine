/* Randomizer Data */

const fields = ["name", "profession", "level", "weapon", "armor", "inventory", "spells"];

var randomizer;
/* Randomizer call */

function randomize() {
    randomizer.randomize(0, "randomizer-target");
    // window.location.search = randomizer.generateQuery();
}

/* Engine animation */

const churns = "#chimney-1, #chimney-2, #gear, #gear-shadow, #infinity";
const puffs = "#cloud-1, #cloud-2, #cloud-3";

function startEngineAnimation() {
    theEngine.dataset.animating = 1;
    for (image of theEngine.querySelectorAll(churns))
        image.classList.add("churn");
    for (image of theEngine.querySelectorAll(puffs))
        image.classList.add("puff");
}

function stopEngineAnimation() {
    theEngine.dataset.animating = 0;
    clearTimeout(theEngine.dataset.timeout);
    for (image of theEngine.querySelectorAll(churns))
        image.classList.remove("churn");
    for (image of theEngine.querySelectorAll(puffs))
        image.classList.remove("puff");
}

function engineClick() {
    if (theEngine.dataset.animating === "1") {
        stopEngineAnimation();
    } else {
        startEngineAnimation();
        theEngine.dataset.timeout = setTimeout(stopEngineAnimation, 12000);
    }
}

window.addEventListener("load", () => {
    randomizer = new Randomizer(data, fields, {showLockButtons: false});
    randomizer.processQuery(0, "randomizer-target");
});
