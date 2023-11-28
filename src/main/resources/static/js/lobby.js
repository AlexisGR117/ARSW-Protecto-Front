const app = (function () {
    const module = apiClient;
    let stompClient = null;
    let gameCode;
    let player;

    function setParameters() {
        gameCode = sessionStorage.getItem("gameCode");
        player = sessionStorage.getItem("player");
    };

    function createPlayerElement(player) {
        const { name, color } = player;
        const { red, green, blue, alpha } = color;
        const colorStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        const row = $('<div>').addClass(['row', 'player']);
        const col6_1 = $('<div>').addClass(['col']);
        const circle = $('<div>').addClass('circle').css('background-color', colorStyle);
        const col6_2 = $('<div>').addClass(['col', 'center-content']).text(name);
        col6_1.append(circle);
        row.append(col6_1, col6_2);
        if (name === "esperando") row.addClass('empty');
        $('#players-list').append(row);
    };

    function createPlayersElements(players) {
        $('#players-list').empty();
        for (let i = 0; i < 4; i++) {
            const player = {name: "esperando", color: {red: 99,green: 75,blue: 201,alpha: 0}};
            if (i < players.length) {
                player.name = players[i].name;
                player.color = players[i].color;
            }
            createPlayerElement(player);
        }
    };

    function connectAndSubscribe() {
        console.info('Connecting to WS...');
        const socket = new SockJS('https://paintitgame.azurewebsites.net/stompendpoint');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/newplayer.${gameCode}`, (eventbody) => {
                const players = JSON.parse(eventbody.body);
                createPlayersElements(players);
                $("#number-players").text(`Jugadores ${players.length}/4`);
            });
            stompClient.subscribe(`/topic/startgame.${gameCode}`, (eventbody) => {
                location.href = "game.html";
            });

        });
    };

    function confirmPlayers(players) {
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
        if (players < 2) {
            appendAlert("Deben haber al menos 2 jugadores!", "light");
            return false;
        }
        return true;
    };

    function startGame() {
        const startDialog = $("#start-dialog")
        startDialog.empty();
        const startButton = $('<button>').addClass(['button', 'btn', 'btn-primary']);
        const textButton = $('<strong>').text('INICIAR');
        startButton.click(function () {
            stompClient.send(`/app/startTime.${gameCode}`, {})
            stompClient.send(`/topic/startgame.${gameCode}`, {});
        });
        startButton.append(textButton);
        startDialog.append(startButton);
        $("#startGameModalCenter").modal('show');
    };

    function setTime(remainingTime) {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        $('#time').text(`: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    function setCodeRoom() {
        $("#codeRoom").text(`:  ${gameCode}`);
    };

    function init() {
        setParameters();
        connectAndSubscribe();

        module.getPlayersByGameApp(gameCode)
            .then((players) => {
                createPlayersElements(players);
                console.log(player);
                if (player === players[0].name) {
                    $('#start').removeClass('disabled');
                }
                $("#number-players").text(`Jugadores ${players.length}/4`);
            });

        module.getGame(gameCode).then((game) => {
            setTime(game.duration);
            setCodeRoom();
        });

        $("#start").click(function () {
            module.getPlayersByGameApp(gameCode)
                .then((players) => {
                    if (player === players[0].name) {
                        if (confirmPlayers(players.length)) {
                            startGame();
                        }
                    }
                });
        });
    }

    return {
        init: init
    };
})();