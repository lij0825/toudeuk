var stompClients = []; // 여러 stompClient를 저장하는 배열
var numConnections = 100; // 원하는 소켓 연결 수

function setConnected(connected, index) {
    $("#connect" + index).prop("disabled", connected);
    $("#disconnect" + index).prop("disabled", !connected);
    if (connected) {
        $("#conversation" + index).show();
    } else {
        $("#conversation" + index).hide();
    }
    $("#greetings" + index).html("");
}

function connect(index) {
    var socket = new SockJS('/ws');
    var stompClient = Stomp.over(socket);
    stompClients[index] = stompClient;
    stompClient.connect({}, function (frame) {
        setConnected(true, index);
        console.log('Connected [' + index + ']: ' + frame);
        stompClient.subscribe('/topic/game', function (number) {
            showGreeting(number.body, index);
        });
    });
}

function disconnect(index) {
    if (stompClients[index] !== null) {
        stompClients[index].disconnect();
    }
    setConnected(false, index);
    console.log("Disconnected [" + index + "]");
}

function sendName(index) {
    stompClients[index].send("/app/game", {}, JSON.stringify({'name': $("#name" + index).val()}));
}

function showGreeting(message, index) {
    $("#greetings" + index).html("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });

    // 여러 개의 소켓 연결을 생성하기 위해 루프 사용
    for (let i = 0; i < numConnections; i++) {
        // 각각의 연결에 대한 버튼 및 입력 필드 ID를 다르게 지정
        $(document.body).append(
            '<div>' +
            '<input type="text" id="name' + i + '" placeholder="Name ' + i + '"/>' +
            '<button id="connect' + i + '">Connect ' + i + '</button>' +
            '<button id="disconnect' + i + '" disabled>Disconnect ' + i + '</button>' +
            '<button id="send' + i + '">Send ' + i + '</button>' +
            '<table id="conversation' + i + '" style="display:none;"><tbody id="greetings' + i + '"></tbody></table>' +
            '</div>'
        );

        $("#connect" + i).click(function() { connect(i); });
        $("#disconnect" + i).click(function() { disconnect(i); });
        $("#send" + i).click(function() { sendName(i); });
    }
});
