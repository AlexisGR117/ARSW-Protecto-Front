document.getElementById('initBtn').addEventListener('click', function() {
    var gameCode = document.getElementById('codeRoom').value;
    var validCode = ['12345', '6789', '8765', '1'];
    sessionStorage.setItem('gameCode', gameCode);
    if (validCode.includes(gameCode)) {
        location.href = 'playercustomization.html';
    } else {
        alert('Código de sala inválido');
    }
});
