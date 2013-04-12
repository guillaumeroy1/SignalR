var testHub = $.connection.testHub;
testHub.client.clientConnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientConnected: " + JSON.stringify(nodeEvent) + "</li>");
    $("#ConnectionsList").append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
};
testHub.client.clientDisconnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientDisconnected: " + JSON.stringify(nodeEvent) + "</li>");
    $("#ConnectionsList option[id=" + nodeEvent.Data + "]").remove();
};
testHub.client.clientReconnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientReconnected: " + JSON.stringify(nodeEvent) + "</li>");
    $("#ConnectionsList").append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
};
testHub.client.addedGroup = function (nodeEvent) {
    $("#HubMessages").append("<li>addedGroup: " + JSON.stringify(nodeEvent) + "</li>");
    $("#GroupsList").append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
};
testHub.client.joinedGroup = function (nodeEvent) {
    $("#HubMessages").append("<li>joinedGroup: " + JSON.stringify(nodeEvent) + "</li>");
    $("#JoinedGroupsList").append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
};
testHub.client.unjoinedGroup = function (nodeEvent) {
    $("#HubMessages").append("<li>unjoinedGroup: " + JSON.stringify(nodeEvent) + "</li>");
    $("#JoinedGroupsList option[id=" + nodeEvent.Data + "]").remove();
};
testHub.client.received = function (nodeEvent) {
    $("#HubMessages").append("<li>received: " + JSON.stringify(nodeEvent) + "</li>");
    $("#ReceivedTextArea").append(nodeEvent.Data + "\n");
};

hubConnection.start({ transport: activeTransport })
    .done(function () {
        hubConnectionStartDone();

        $("#JoinGroupButton").click(function () {
            if (!isRequired("#GroupText", "Group")) {
                return;
            }
            testHub.server.joinGroup($("#GroupText").val(), $("#ConnectionText").val());
            cleanInputs();
        });

        $("#UnjoinGroupButton").click(function () {
            if (!isRequired("#GroupText", "Group")) {
                return;
            }
            testHub.server.unjoinGroup($("#GroupText").val(), $("#ConnectionText").val());
            cleanInputs();
        });

        $("#SendToAllButton").click(function () {
            if (!isRequired("#MessageText", "Message")) {
                return;
            }
            testHub.server.sendToAll($("#MessageText").val());
            cleanInputs();
        });

        $("#SendToCallerButton").click(function () {
            if (!isRequired("#MessageText", "Message")) {
                return;
            }
            testHub.server.sendToCaller($("#MessageText").val());
            cleanInputs();
        });

        $("#SendToClientButton").click(function () {
            if (!isRequired("#ConnectionText", "ConnectionId") || !isRequired("#MessageText", "Message")) {
                return;
            }
            testHub.server.sendToClient($("#ConnectionText").val(), $("#MessageText").val());
            cleanInputs();
        });

        $("#SendToGroupButton").click(function () {
            if (!isRequired("#GroupText", "Group") || !isRequired("#MessageText", "Message")) {
                return;
            }
            testHub.server.sendToGroup($("#GroupText").val(), $("#MessageText").val());
            cleanInputs();
        });
    })
    .fail(function (error) {
        hubConnectionStartError();
    });

function cleanInputs() {
    $("#ConnectionText").val("");
    $("#GroupText").val("");
    $("#MessageText").val("");
}

function isRequired(id, name) {
    if ($(id).val() == "") {
        $("#ClientMessages").append("<li>" + name + " is required!</li>");
        return false;
    }
    return true;
}