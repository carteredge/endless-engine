function toggleMenu(id) {
    const menu = document.getElementById(id);
    menu?.classList.toggle("visible");
    menu?.setAttribute("aria-expanded",
        menu?.classList.contains("visible") ? true : false);
}

document.addEventListener("click", (event) => {
    const menu = document.getElementById("nav");
    const menuButton = document.getElementById("nav-button");
    if (!(event.target === menu
            || event.target === menuButton
            || menu?.contains(event.target)
            || menuButton?.contains(event.target))) {
        menu?.classList.remove("visible");
        menu?.setAttribute("aria-expanded", false);
    }
});

/* Header text randomization */
const data = {
    adv: ["Amazingly", "Incredibly", "Remarkably"],
    adj: ["Dynamic", "Clever", "Unstoppable"],
    noun: ["Anything-Generator", "Engine of Endless Creation", "Randomization Engine", "Thing-Randomizer"],
    "~": "The {adv} {adj} {noun}",
}

var randomizer;
window.onload = ()=>{
    randomizer = new Randomizer(data, ["~"]);
    randomizer.randomize(0, "ee-target");
};

/* Header logo animation */

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
        new Randomizer(data).randomize(["~"], "ee-target");
        startEngineAnimation();
        theEngine.dataset.timeout = setTimeout(stopEngineAnimation, 12000);
    }
}
