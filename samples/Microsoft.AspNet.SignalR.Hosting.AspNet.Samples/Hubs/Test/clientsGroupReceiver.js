var messages = [];
var groupName = "group1";
var testHub = $.connection.stressHub;
testHub.client.clientConnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientConnected: " + JSON.stringify(nodeEvent) + "</li>");
};
testHub.client.clientDisconnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientDisconnected: " + JSON.stringify(nodeEvent) + "</li>");
};
testHub.client.clientReconnected = function (nodeEvent) {
    $("#HubMessages").append("<li>clientReconnected: " + JSON.stringify(nodeEvent) + "</li>");
};
testHub.client.joinedGroup = function (nodeEvent) {
    $("#HubMessages").append("<li>joinedGroup: " + JSON.stringify(nodeEvent) + "</li>");
};
testHub.client.receivedGroup = function (nodeEvent) {
    var message = parseInt(nodeEvent.Data);
    incrementLabel("#ReceivedLabel");
    if (messages[message] === undefined) {
        messages[message] = 1;
    } else {
        messages[message]++;
        $("#HubMessages").append("<li style='color:red;'>Message " + message + " has been received " + messages[message] + " times</li>");
    }
};

hubConnection.start({ transport: activeTransport })
    .done(function () {
        hubConnectionStartDone();
        testHub.server.joinGroup(groupName, null);
    })
    .fail(function (error) {
        hubConnectionStartError();
    });