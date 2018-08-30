const MAX_LOGS = 45;

const logs = [];

let ws;
let refreshCallback;
let retryCount = 0;
let connectionCount = 0;
let reconnectTimer;

function getMaxLogs() {
    return MAX_LOGS;
}

function setRefreshCallback(callback) {
    refreshCallback = callback;
    notifyWsEvent();
}

function getBoxHost() {
    const boxHost = localStorage["boxHost"];
    if (boxHost) {
        return boxHost;
    } else {
        return "STB7.local"; // mDNS address that can be resolved on MacOS or Windows with Bonjour service installed
    }
}

function setBoxHost(host) {
    localStorage["boxHost"] = host;

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    retryCount = 0;

    if (ws) {
        ws.close();
    } else {
        ensureWsConnection();
    }
}

function isReady() {
    return ws && (ws.readyState === WebSocket.OPEN);
}

function sendGetVersions() {
    sendMessage(JSON.stringify({
        "Params": {
            "Token":  "LAN",
            "Action": "GetVersions"
        }
    }));
}

function sendBtnPressMsg(btnCode) {
    sendMessage(JSON.stringify({
        "Params": {
            "Token":  "LAN",
            "Action": "ButtonEvent",
            "Press":  [btnCode]
        }
    }));
}

function sendKeyPressMsg(keyCode) {
    sendMessage(JSON.stringify({
        "Params": {
            "Token":  "LAN",
            "Action": "KeyboardEvent",
            "Press":  [keyCode]
        }
    }));
}

function notifyWsEvent(msg = null) {
    if (msg !== null) {
        if (msg.length > 0) {
            msg = "(" + connectionCount + ") " + msg;
        }
        logs.push(msg);
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }
    }

    if (refreshCallback) {
        refreshCallback(ws, connectionCount, retryCount, logs);
    }
}

function sendMessage(frame) {
    ws.send(frame);
    notifyWsEvent(">>> " + frame);
}

function ensureWsConnection() {
    reconnectTimer = null;
    if (!ws) {
        connectionCount++;
        retryCount++;
        notifyWsEvent("");
        ws = new WebSocket("ws://" + getBoxHost() + ":7682", "lws-bidirectional-protocol");
        notifyWsEvent("*** connecting to " + ws.url);

        ws.onopen = () => {
            retryCount = 0;
            notifyWsEvent("+++ connected to " + ws.url);

            sendGetVersions();
        };

        ws.onclose = (event) => {
            let logMsg = "--- disconnected from " + ws.url + " : code=" + event.code;
            if (event.reason) {
                logMsg += " reason=" + event.reason;
            }
            ws = null;
            notifyWsEvent(logMsg);

            reconnectTimer = setTimeout(ensureWsConnection, retryCount < 3 ? 0 : 10000);
        };

        ws.onmessage = (event) => {
            notifyWsEvent("<<< " + event.data)
        };

        ws.onerror = () => {
            ws.close();
            notifyWsEvent("!!! error occurred");
        };
    }
}

window.onload = () => {
    ensureWsConnection();
};
