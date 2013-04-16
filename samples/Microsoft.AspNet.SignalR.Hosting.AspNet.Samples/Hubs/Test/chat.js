$(function () {
    var hubConnection = $.connection.hub,
        testHub = $.connection.testHub,
        hubMessages = $("#HubMessages"),
        connectionsList = $("#ConnectionsList"),
        groupsList = $("#GroupsList"),
        connectionText = $("#ConnectionText"),
        groupText = $("#GroupText"),
        messageText = $("#MessageText");
    
    testHub.client.clientConnected = function (nodeEvent) {
        hubMessages.append("<li>clientConnected: " + JSON.stringify(nodeEvent) + "</li>");
        connectionsList.append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
    };
    testHub.client.clientDisconnected = function (nodeEvent) {
        hubMessages.append("<li>clientDisconnected: " + JSON.stringify(nodeEvent) + "</li>");
        $("#ConnectionsList option[id=" + nodeEvent.Data + "]").remove();
    };
    testHub.client.clientReconnected = function (nodeEvent) {
        hubMessages.append("<li>clientReconnected: " + JSON.stringify(nodeEvent) + "</li>");
        connectionsList.append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
    };
    testHub.client.connectionsAll = function (nodeEvent) {
        $.each(nodeEvent.Data, function(index, value) {
            connectionsList.append("<option id=" + value + ">" + value + "</option>");
        });
        hubMessages.append("<li>connectionsAll: " + JSON.stringify(nodeEvent) + "</li>");
    };
    testHub.client.groupsAll = function (nodeEvent) {
        $.each(nodeEvent.Data, function (index, value) {
            groupsList.append("<option id=" + value + ">" + value + "</option>");
        });
        hubMessages.append("<li>groupsAll: " + JSON.stringify(nodeEvent) + "</li>");
    };
    testHub.client.addedGroup = function (nodeEvent) {
        hubMessages.append("<li>addedGroup: " + JSON.stringify(nodeEvent) + "</li>");
        groupsList.append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
    };
    testHub.client.joinedGroup = function (nodeEvent) {
        hubMessages.append("<li>joinedGroup: " + JSON.stringify(nodeEvent) + "</li>");
        $("#JoinedGroupsList").append("<option id=" + nodeEvent.Data + ">" + nodeEvent.Data + "</option>");
    };
    testHub.client.leftGroup = function (nodeEvent) {
        hubMessages.append("<li>leftGroup: " + JSON.stringify(nodeEvent) + "</li>");
        $("#JoinedGroupsList option[id=" + nodeEvent.Data + "]").remove();
    };
    testHub.client.received = function (nodeEvent) {
        hubMessages.append("<li>received: " + JSON.stringify(nodeEvent) + "</li>");
        $("#ReceivedTextArea").append(nodeEvent.Data + "\n");
    };

    hubConnection.start({ transport: activeTransport })
        .done(function () {
            hubConnectionStartDone(testHub);

            $("#JoinGroupButton").click(function () {
                if (isRequired(groupText, "Group")) {
                    return;
                }
                testHub.server.joinGroup(groupText.val(), connectionText.val());
                cleanInputs();
            });

            $("#LeaveGroupButton").click(function () {
                if (isRequired(groupText, "Group")) {
                    return;
                }
                testHub.server.leaveGroup(groupText.val(), connectionText.val());
                cleanInputs();
            });

            $("#SendToAllButton").click(function () {
                if (isRequired(messageText, "Message")) {
                    return;
                }
                testHub.server.sendToAll($("#MessageText").val());
                cleanInputs();
            });

            $("#SendToCallerButton").click(function () {
                if (isRequired(messageText, "Message")) {
                    return;
                }
                testHub.server.sendToCaller(messageText.val());
                cleanInputs();
            });

            $("#SendToClientButton").click(function () {
                if (isRequired(connectionText, "ConnectionId") || isRequired(messageText, "Message")) {
                    return;
                }
                testHub.server.sendToClient(connectionText.val(), messageText.val());
                cleanInputs();
            });

            $("#SendToGroupButton").click(function () {
                if (isRequired(groupText, "Group") || isRequired(messageText, "Message")) {
                    return;
                }
                testHub.server.sendToGroup(groupText.val(), messageText.val());
                cleanInputs();
            });
        })
        .fail(function (error) {
            hubConnectionStartError();
        });

    function cleanInputs() {
        connectionText.val("");
        groupText.val("");
        messageText.val("");
    }

    function isRequired(id, name) {
        if (id.val() === "") {
            $("#ClientMessages").append("<li>" + name + " is required!</li>");
            return true;
        }
        return false;
    }
});