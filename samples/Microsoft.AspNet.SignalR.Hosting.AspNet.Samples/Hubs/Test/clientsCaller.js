$(function () {
    var hubConnection = $.connection.hub,
        testHub = $.connection.stressHub,
        hubMessages = $("#HubMessages"),
        messages = [],
        messagesLimit = 5000;
    
    testHub.client.clientConnected = function (nodeEvent) {
        hubMessages.append("<li>clientConnected: " + JSON.stringify(nodeEvent) + "</li>");
    };
    testHub.client.clientDisconnected = function (nodeEvent) {
        hubMessages.append("<li>clientDisconnected: " + JSON.stringify(nodeEvent) + "</li>");
    };
    testHub.client.clientReconnected = function (nodeEvent) {
        hubMessages.append("<li>clientReconnected: " + JSON.stringify(nodeEvent) + "</li>");
    };
    testHub.client.receivedCaller = function (nodeEvent) {
        var message = parseInt(nodeEvent.Data, 10);
        incrementLabel("#ReceivedLabel");
        if (messages[message] === undefined) {
            messages[message] = 1;
        } else {
            messages[message]++;
            hubMessages.append("<li style='color:red;'>Message " + message + " has been received " + messages[message] + " times</li>");
        }
        if (message < messagesLimit) {
            testHub.server.echoToCaller(incrementLabel("#SendLabel"));
        }
    };

    hubConnection.start({ transport: activeTransport })
        .done(function () {
            hubConnectionStartDone(testHub);
            testHub.server.echoToCaller(incrementLabel("#SendLabel"));
        })
        .fail(function (error) {
            hubConnectionStartError();
        });
});