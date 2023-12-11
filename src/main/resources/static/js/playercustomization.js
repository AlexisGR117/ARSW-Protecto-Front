let playercustomization = (function () {
    const app = apiClient;
    let gameCode;

    let _createNewPlayer = function () {
        let name = $("#name").val();
        let color = $("#color").val();
        let player = {
            name: name,
            color: color,
        };
        return player;
    };

    let _getGameCode = function () {
        gameCode = sessionStorage.getItem("gameCode");
        return gameCode;
    };

    let _playAlert = function () {
        let player = _createNewPlayer();
        let gameCode = _getGameCode();
        const alertPlaceholder = $("#dialog-alert");
        alertPlaceholder.empty();
        const appendAlert = (message, type) => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                "</div>",
            ].join("");
            alertPlaceholder.append(wrapper);
        };
        app.postPlayerApp(gameCode, player).then(function (data) {
            sessionStorage.setItem("player", $("#name").val());
            location.href = "lobby.html";
            stompClient.send("/app/newplayer." + gameCode);
        }).catch(function (error) {
            appendAlert(error.responseText, "light");
        });
    };

    function connect() {
        console.info('Connecting to WS...');
        const socket = new SockJS('http://paintitgateway.eastus.cloudapp.azure.com/stompendpoint');
        stompClient = Stomp.over(socket);
        const keepAliveInterval = setInterval(() => {
                if (stompClient && stompClient.connected) {
                    stompClient.send("/keepalive", {});
                }
            }, 18000);
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
        });
    };

    return {
        init: function () {
            connect();
            $("#exit").click(function () {
                location.href = "index.html";
            });
        },

        play: _playAlert,
    };
})();
