const app = (function () {
    const module = apiClient;
    let stompClient = null;
    const idGame = 1;
    let currentPlayer = {name: sessionStorage.getItem('player')};

    function createPlayerElement(player) {
        const { name, score, color } = player;
        const row = $('<div>').addClass(['row', 'player', 'm-2']);
        const col5_1 = $('<div>').addClass(['col']);
        const circle = $('<div>').addClass('circle').css('background-color', getRGBAColor(color));
        const col5_2 = $('<div>').addClass(['col', 'center-content']).text(name);
        const col2 = $('<div>').addClass(['col', 'center-content']).text(score);
        col5_1.append(circle);
        row.append(col5_1, col5_2, col2);
        $('#players').append(row);
    }

    function createPlayersElements(players) {
        $('#players').empty();
        const sortedPlayers = players.sort((a, b) => b.score - a.score);
        let paintedCells = 0;
        for (const player of sortedPlayers) {
            if (currentPlayer.name == player.name) currentPlayer = player;
            createPlayerElement(player);
            paintedCells += player.score;
        }
        const row = $('<div>').addClass(['row', 'player', 'm-2']);
        const col10 = $('<div>').addClass(['col', 'center-content']).text("Casillas pintadas");
        const col2 = $('<div>').addClass(['col', 'center-content']).text(paintedCells);
        row.append(col10, col2);
        $('#players').append(row);
    }

    function paintCell(data) {
        const newCell = $(`#row-${data.movement.x}-column-${data.movement.y}`);
        const playerCircle =  $(`#${data.playerName}`);
        const parent = playerCircle.parents().first();
        newCell.css('background-color', parent.css('background-color'));
        playerCircle.appendTo(newCell);
    }

    function placeWinner(winner) {
        const loco = $("#winnerModalCenter");
        loco.modal({backdrop: 'static', keyboard: false})
        loco.modal('show');
        const winnerContent =  $("#winner");
        winnerContent.empty();
        const wrapper = document.createElement("div");
        wrapper.innerHTML = [
            `<div class="alert alert-info alert-dismissible" role="alert">`,
            `   <div>Felicidades ${winner}, has ganado la partida.</div>`,
            "</div>",
        ].join("");
        winnerContent.append(wrapper);
    };

    function connectAndSubscribe() {
        console.info('Connecting to WS...');
        const socket = new SockJS('https://paintitgame.azurewebsites.net/stompendpoint');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            stompClient.subscribe(`/topic/updatescore.${idGame}`, (eventbody) => {
                const players = JSON.parse(eventbody.body);
                createPlayersElements(players);
            }, { withCredentials: false });
            stompClient.subscribe(`/topic/updateboard.${idGame}`, (eventbody) => {
                const data = JSON.parse(eventbody.body);
                paintCell(data);
            }, { withCredentials: false });
            stompClient.subscribe(`/topic/gamefinished.${idGame}`, (eventbody) => {
                const winner = eventbody.body;
                placeWinner(winner);
            }, { withCredentials: false });
        });
    }

    function disconect() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    };

    function movePlayer(x, y) {
        const data = {
            playerName: currentPlayer.name,
            movement: { x, y },
        };
        stompClient.send("/app/newmovement." + idGame, {}, JSON.stringify(data));
    }

    function keyDownEvents() {
       $(document).keydown(function(e) {
            const { LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW } = { LEFT_ARROW: 37, UP_ARROW: 38, RIGHT_ARROW: 39, DOWN_ARROW: 40 };
            switch (e.which) {
                case LEFT_ARROW:
                    movePlayer(currentPlayer.x, currentPlayer.y - 1);
                    break;
                case UP_ARROW:
                    movePlayer(currentPlayer.x - 1, currentPlayer.y);
                    break;
                case RIGHT_ARROW:
                    movePlayer(currentPlayer.x, currentPlayer.y + 1);
                    break;
                case DOWN_ARROW:
                    movePlayer(currentPlayer.x + 1, currentPlayer.y);
                    break;
            }
        });
    }

    function getRGBAColor(color) {
        const { red, green, blue, alpha } = color;
        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function createBoard(game) {
        const size = game.board.cells.length;
        const board = $("#game-board");
        board.css("gridTemplateRows", `repeat(${size}, ${100 / size}%)`);
        board.css("gridTemplateColumns", `repeat(${size}, ${100 / size}%)`);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = $('<div>').addClass(['cell', 'center-content']);
                cell.attr("id", `row-${i}-column-${j}`)
                const player = game.board.cells[i][j].paintedBy;
                if (player != null) cell.css("background-color", getRGBAColor(player.color));
                board.append(cell);
            }
        }
        for (const player of game.players) {
            const initialCell = $(`#row-${player.x}-column-${player.y}`);
            initialCell.css('background-color', getRGBAColor(player.color));
            const circle2 = $('<div>').attr("id", player.name).addClass('circle-board');
            initialCell.append(circle2);
        }
    }

    function updateTimer() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        document.getElementById('time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (remainingTime === 30) {
            document.getElementById('message').style.visibility = 'visible';
        }
        if (remainingTime === 25) {
            document.getElementById('message').style.visibility = 'hidden';
        }
        if (remainingTime > 0) {
            remainingTime--;
        }
    }

    function init() {
        connectAndSubscribe();
        module.getGame(idGame)
            .then((game) => {
                console.log(game.players);
                createBoard(game);
                createPlayersElements(game.players);
                remainingTime = game.duration;
            });
        keyDownEvents();
        setInterval(updateTimer, 1000);    
    }

    return {
        init: init,

        exit: function () {
            disconect();
            location.href = "index.html";
        },
    };
})();
