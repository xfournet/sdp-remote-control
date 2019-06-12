let ws;
let txtStatus;
let boxHost = "STB7.local";

window.onload = () => {
    for (let area of document.getElementById("mapRemote").getElementsByTagName("area")) {
        const btnCode = area.getAttribute("btnCode");
        if (btnCode) {
            area.onclick = () => {
                sendBtnPressMsg(parseInt(btnCode));
            }
        }
    }

    txtStatus = document.getElementById("txtStatus");
    txtStatus.className = "ko";
    txtStatus.textContent = "Deconnecté";

    let inputBoxHost = document.getElementById("inputBoxHost");
    let btnSave = document.getElementById("btnSave");
    let btnCancel = document.getElementById("btnCancel");

    btnSave.onclick = (event) => {
        boxHost = inputBoxHost.value;
        if (ws) {
            ws.close();
            ws = null
        }
        ensureWsConnection()
    };

    btnCancel.onclick = (event) => {
        inputBoxHost.value = boxHost;
    };

    inputBoxHost.onkeypress = (event) => {
        if (event.keyCode === 13) {
            btnSave.onclick();
        }
    };

    if (boxHost) {
        inputBoxHost.value = boxHost;
        ensureWsConnection();
    }
};


function sendBtnPressMsg(btnCode) {
    sendMessage(JSON.stringify({
        "Params": {
            "Token": "LAN",
            "Action": "ButtonEvent",
            "Press": [btnCode]
        }
    }));
}

function sendMessage(frame) {
    ensureWsConnection();
    ws.send(frame);
}

function ensureWsConnection() {
    if (!ws) {
        ws = new WebSocket("ws://" + boxHost + ":7682", "lws-bidirectional-protocol");

        ws.onopen = () => {
            txtStatus.className = "ok";
            txtStatus.textContent = "Connecté";
        };

        ws.onclose = (event) => {
            txtStatus.className = "ko";
            txtStatus.textContent = "Deconnecté";
            ws = null;
        };

        ws.onerror = () => {
            ws.close();
        };
    }
}
