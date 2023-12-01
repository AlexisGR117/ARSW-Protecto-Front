let gamecustomization = (function () {
    const module = apiClient;
    const boardSizeNames = {
        15: 'Pequeño',
        20: 'Mediano',
        25: 'Grande'
    };
    const gameTimeNames = {
        30: 'Rápido',
        60: 'Normal',
        120: 'Lento'
    };
    const boardSizeNumbers = {
        'Pequeño': 15,
        'Mediano': 20,
        'Grande': 25
    };
    
    const gameTimeNumbers = {
        'Rápido': 30,
        'Normal': 60,
        'Lento': 120
    };

    function createOptionBoardSize(boardSize) {
        let boardSizeName = boardSizeNames[boardSize];
        $("#inputSize").append("<option value=" + boardSizeName + ">" + boardSizeName + "</option>");
    };

    function createOptionTime(gameTime) {
        let gameTimeName = gameTimeNames[gameTime];
        $("#inputTime").append("<option value=" + gameTimeName + ">" + gameTimeName + "</option>");
    };

    function createOptionsOfBoardSize(boardSizes) {
        boardSizes.forEach(createOptionBoardSize);
    };

    function createOptionsOfGameTime(gameTimes) {
        gameTimes.forEach(createOptionTime);
    };

    function completeGameConfig() {
        const configDialog = $("#config-dialog")
        configDialog.empty();
        const configButton = $('<button>').addClass(['button', 'btn', 'btn-primary']);
        const textButton = $('<strong>').text('VOLVER');
        configButton.click(function () {
            $("#configGameModalCenter").modal('hide');
        });
        configButton.append(textButton);
        configDialog.append(configButton);
        $("#configGameModalCenter").modal('show');
    }

    function _createAndPlay() {
        let boardSize = $("#inputSize").val();
        let gameTime = $("#inputTime").val();
        if (!boardSize || !boardSizeNumbers[boardSize]) {
            completeGameConfig();
            return;
        }
    
        if (!gameTime || !gameTimeNumbers[gameTime]) {
            completeGameConfig();
            return;
        }
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
        let gameConfig = {
            "boardSize": boardSizeNumbers[boardSize],
            "gameTime": gameTimeNumbers[gameTime],
        };
        module.postGameApp(gameConfig).then(function (data) {
            console.log(data);
            sessionStorage.setItem("gameCode", data);
            location.href = "playercustomization.html";
        }).catch(function (error) {
            appendAlert(error.responseText, "light");
        });
    };

    return {
        init: function () {
            module.getGameBoardSizes().then((data) => {
                createOptionsOfBoardSize(data);
            });
            module.getGameTimes().then((data) => {
                createOptionsOfGameTime(data);
            });
            $("#exit").click(function () {
                location.href = "index.html";
            });
        },

        create: _createAndPlay,
    };
})();