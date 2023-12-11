const apiClient = (function () {

    const baseURL = "http://paintitgateway.eastus.cloudapp.azure.com";

    let _getGames = function () {
        let getPromise = $.ajax({
            url: baseURL + "/games",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
        });

        return getPromise;
    };

    let _getGameBoardSizes = function () {
        let getPromise = $.ajax({
            url: baseURL + "/games/boardsizes",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
        });

        return getPromise;
    };

    let _getGameTimes = function () {
        let getPromise = $.ajax({
            url: baseURL + "/games/gametimes",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
        });

        return getPromise;
    };

    let _postGame = function (gameConfig) {
        let postPromise = $.ajax({
            url: baseURL + "/games",
            type: "POST",
            data: JSON.stringify(gameConfig),
            contentType: "application/json",
        });
        
        return postPromise;
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

        getGames: function () {
            return _getGames();
        },

        postGameApp: function (gameConfig) {
            return _postGame(gameConfig);
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

        getGameBoardSizes: function () {
            return _getGameBoardSizes();
        },

        getGameTimes: function () {
            return _getGameTimes();
        },
    };
})();
