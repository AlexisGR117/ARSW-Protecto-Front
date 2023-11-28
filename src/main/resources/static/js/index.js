var index = (function () {
    const module = apiClient;

    function dialogCode() {
        const codeDialog = $("#code-dialog")
        codeDialog.empty();
        const joinButton = $('<button>').addClass(['button', 'btn', 'btn-primary']);
        const textButton = $('<strong>').text('VOLVER');
        joinButton.click(function () {
            $("#joinGameModalCenter").modal('hide');
        });
        joinButton.append(textButton);
        codeDialog.append(joinButton);
        $("#joinGameModalCenter").modal('show');
    }

    function _isValidCode () {
        var gameCode = $("#codeRoom").val();
        module.getGames().then((games) => {
            if (gameCode in games) {
                sessionStorage.setItem('gameCode', gameCode);
                location.href = 'playercustomization.html';
            }
        }).catch(function (error) {
            dialogCode();
        });
    };
    
    return {
        init: function () {
            $("#initBtn").click(function () {
                _isValidCode();
            });
            $("#createBtn").click(function () {
                location.href = 'gamecustomization.html';
            });
        },
    }
})();
