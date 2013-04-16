$(function () {
    var hubConnection = $.connection.hub,
        hubMessages = $("#HubMessages");    

    hubConnection.logging = true;
    hubConnection.connectionSlow(function () {
        hubMessages.append("<li style='color:blue;'>connectionSlow:</li>");
    });
    hubConnection.disconnected(function () {
        hubMessages.append("<li>disconnected:</li>");
    });
    hubConnection.error(function (error) {
        hubMessages.append("<li style='color:red;'>error: " + error + "</li>");
    });
    hubConnection.reconnected(function () {
        hubMessages.append("<li>reconnected:</li>");
    });
    hubConnection.reconnecting(function () {
        hubMessages.append("<li style='color:blue;'>reconnecting:</li>");
    });
    hubConnection.starting(function () {
        hubMessages.append("<li style='color:blue;'>starting:</li>");
    });
    hubConnection.stateChanged(function (change) {
        hubMessages.append("<li>stateChanged: " + PrintState(change.oldState) + " => " + PrintState(change.newState) + "</li>");
    });
});

function hubConnectionStartDone(testHub) {
    var hubConnection = $.connection.hub;
    var hubMessages = $("#HubMessages");    

    hubMessages.append("<li>Connection started!</li>");
    hubMessages.append("<li>hubConnection.ajaxDataType: " + hubConnection.ajaxDataType + "</li>");
    hubMessages.append("<li>hubConnection.disconnectTimeout: " + hubConnection.disconnectTimeout + "</li>");
    hubMessages.append("<li>hubConnection.id: " + hubConnection.id + "</li>");
    hubMessages.append("<li>hubConnection.logging: " + hubConnection.logging + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveData.activated: " + hubConnection.keepAliveData.activated + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveData.checkInterval: " + hubConnection.keepAliveData.checkInterval + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveData.lastKeepAlive: " + hubConnection.keepAliveData.lastKeepAlive + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveData.timeout: " + hubConnection.keepAliveData.timeout + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveData.timeoutWarning: " + hubConnection.keepAliveData.timeoutWarning + "</li>");
    hubMessages.append("<li>hubConnection.keepAliveWarnAt: " + hubConnection.keepAliveWarnAt + "</li>");
    hubMessages.append("<li>hubConnection.qs: " + hubConnection.qs + "</li>");
    hubMessages.append("<li>hubConnection.reconnectDelay: " + hubConnection.reconnectDelay + "</li>");
    hubMessages.append("<li>hubConnection.state: " + PrintState(hubConnection.state) + "</li>");
    hubMessages.append("<li>hubConnection.token: " + hubConnection.token + "</li>");
    hubMessages.append("<li>hubConnection.transport.name: " + hubConnection.transport.name + "</li>");
    hubMessages.append("<li>hubConnection.url: " + hubConnection.url + "</li>");

    hubMessages.append("<li>testHub.hubName: " + testHub.hubName + "</li>");
}

function hubConnectionStartError() {
    $("#HubMessages").append("<li style='color:red;'>Connection failed:" + error + "</li>");
}

function PrintState(state) {
    return ["connecting", "connected", "reconnecting", state, "disconnected"][state];
}

function incrementLabel(id) {
    var value = parseInt($(id).text(), 10) + 1;
    $(id).text(value);
    return value;
}