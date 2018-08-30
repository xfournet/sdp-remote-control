const remote = chrome.extension.getBackgroundPage();

const keyDownCodeMapping = new Map([
    ["Backspace", 8], //
    ["Tab", 9], //
    ["Escape", 27], //
    ["Delete", 127], //
    ["ArrowLeft", 293], //
    ["ArrowRight", 222], //
    ["ArrowUp", 297], //
    ["ArrowDown", 294], //
]);

window.onload = () => {
    if (remote.isReady()) {
        for (let area of document.getElementById("mapRemote").getElementsByTagName("area")) {
            const btnCode = area.getAttribute("btnCode");
            if (btnCode) {
                area.onclick = () => {
                    remote.sendBtnPressMsg(parseInt(btnCode));
                }
            }
        }
    } else {
        chrome.runtime.openOptionsPage();
    }
};

document.onkeydown = (event) => {
    const keyCode = keyDownCodeMapping.get(event.key);
    if (keyCode) {
        remote.sendKeyPressMsg(keyCode);
    }

    if (event.key === "Escape") {
        event.preventDefault();
    }
};

document.onkeypress = (event) => {
    const keyCode = event.keyCode;
    if (keyCode > 0) {
        remote.sendKeyPressMsg(keyCode);
    }
};
