const remote = chrome.extension.getBackgroundPage();

const readyStateMapping = new Map([
    [0, "Connecting"], //
    [1, "Open"], //
    [2, "Closing"], //
    [3, "Closed"], //
]);

function formatWsReadyState(readyState) {
    let message = readyStateMapping.get(readyState);
    if (!message) {
        message = "Unknown";
    }
    return message + " (" + readyState + ")";
}

function handleEnter(event, callback) {
    if (event.keyCode === 13) {
        callback();
    }
}

window.onload = () => {
    const txtStatus = document.getElementById("txtStatus");

    const inputBoxHost = document.getElementById("inputBoxHost");
    const btnSave = document.getElementById("btnSave");
    const btnCancel = document.getElementById("btnCancel");

    const rowDebug = document.getElementById("rowDebug");
    const btnDebug = document.getElementById("btnDebug");

    const rowTest = document.getElementById("rowTest");
    const inputCode = document.getElementById("inputCode");
    const radioButton = document.getElementById("radioButton");
    const radioKeyboard = document.getElementById("radioKeyboard");
    const btnSendCode = document.getElementById("btnSendCode");

    const inputFrame = document.getElementById("inputFrame");
    const btnSendFrame = document.getElementById("btnSendFrame");

    const rowNetwork = document.getElementById("rowNetwork");
    const txtConnectionCount = document.getElementById("txtConnectionCount");
    const txtUrl = document.getElementById("txtUrl");
    const txtState = document.getElementById("txtState");
    const txtProtocol = document.getElementById("txtProtocol");
    const txtExtensions = document.getElementById("txtExtensions");
    const txtBinaryType = document.getElementById("txtBinaryType");
    const txtLog = document.getElementById("txtLog");

    txtLog.rows = remote.getMaxLogs();
    inputBoxHost.onkeypress = (event) => handleEnter(event, btnSave.onclick);
    btnSave.onclick = () => remote.setBoxHost(inputBoxHost.value);
    btnCancel.onclick = () => inputBoxHost.value = remote.getBoxHost();
    btnCancel.onclick();

    btnDebug.onclick = () => {
        rowDebug.remove();
        rowTest.classList.remove("collapsed");
        rowNetwork.classList.remove("collapsed");
    };

    inputCode.onkeypress = (event) => handleEnter(event, btnSendCode.onclick);
    btnSendCode.onclick = () => {
        const codeStr = inputCode.value;
        if (codeStr) {
            const code = parseInt(codeStr);
            if (radioButton.checked) {
                remote.sendBtnPressMsg(code);
            } else if (radioKeyboard.checked) {
                remote.sendKeyPressMsg(code);
            }
        }
    };

    inputFrame.onkeypress = (event) => handleEnter(event, btnSendFrame.onclick);
    btnSendFrame.onclick = () => remote.sendMessage(inputFrame.value);

    remote.setRefreshCallback((ws, connectionCount, retryCount, logs) => {
        if (ws) {
            txtConnectionCount.textContent = connectionCount;
            txtUrl.textContent = ws.url;
            txtState.textContent = formatWsReadyState(ws.readyState);
            txtProtocol.textContent = ws.protocol;
            txtExtensions.textContent = ws.extensions;
            txtBinaryType.textContent = ws.binaryType;
        } else {
            txtConnectionCount.textContent = "";
            txtUrl.textContent = "";
            txtState.textContent = "Throttling reconnection, retry count: " + retryCount;
            txtProtocol.textContent = "";
            txtExtensions.textContent = "";
            txtBinaryType.textContent = "";
        }

        if (remote.isReady()) {
            txtStatus.className = "ok";
            txtStatus.textContent = "OK";
        } else {
            txtStatus.className = "ko";
            txtStatus.textContent = "Erreur, veuillez vérifier l'adresse du décodeur";
        }

        txtLog.textContent = logs.join("\n");
    });
};

window.onunload = () => {
    remote.setRefreshCallback(null);
};

