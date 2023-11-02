const apiClient = (function () {
    const baseURL = "https://paintitgame.azurewebsites.net";
    var _getPlayersByGame = function (gameCode) {
        let getPromise = $.ajax({
            url: baseURL + "/games/" + gameCode + "/players",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            
        });

        return getPromise;
    };

    var _postGame = function (gameCode) {
        let postPromise = $.ajax({
            url: baseURL + "/games",
            type: "POST",
            data: gameCode,
        });

        postPromise.then(
            function () {
                alert("Juego creado con exito");
            },
            function () {
                alert("No se pudo crear el juego");
            },
        );
        return postPromise;
    };

    var _postPlayer = function (gameCode, player) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: baseURL + "/games/" + gameCode + "/players",
                type: "POST",
                data: JSON.stringify(player),
                contentType: "application/json",
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error);
                }
            });
        });
    };

    return {
        getPlayersByGameApp: function (idGame) {
            return new Promise(function (resolve, reject) {
                $.get(baseURL + "/games/" + idGame + "/players", function (data) {
                    resolve(data);
                }).fail(function (error) {
                    reject(error);
                });
            });
        },

        getGame: function (idGame) {
            return new Promise(function (resolve, reject) {
                $.get(baseURL + "/games/" + idGame, function (data) {
                    resolve(data);
                }).fail(function (error) {
                    reject(error);
                });
            });
        },

        postGameApp: function (gameCode) {
            return _postGame(gameCode);
        },

        postPlayerApp: function (gameCode, player) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: baseURL + "/games/" + gameCode + "/players",
                    type: "POST",
                    data: JSON.stringify(player),
                    contentType: "application/json",
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
    };
})();
