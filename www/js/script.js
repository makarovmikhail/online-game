const server = "http://localhost";
const port = "8889";

function generateStartPage() {
    
    document.getElementById('username').textContent = prompt('Введите ваше имя и фамилию');
    let socket = io();
    socket.on("update_games", function (msg) {
        updateGames(msg);
    });
}

function createGamePromise(username) {

    const ip = `${server}:${port}/create_game`;
    const body = `username=${username}`;
    return new Promise(function (resolve, reject) {

        jQuery.ajax({
            url: ip,
            crossDomain: true,
            data: body,
            cache: false,
            async: true,
            xhrFields: {
                withCredentials: true
            },
            contentType: 'application/x-www-form-urlencoded',
            processData: false,
            method: 'POST',
            type: 'POST',
            success: function (data) {
                console.log(data);
                resolve(data);
            },
            error: function (data) {
                console.log(data);
                reject(data);
            }
        });
    });
}

function createGame() {
    const username = document.getElementById('username').textContent;
    createGamePromise(username).then(
        result => {
            console.log(result);
        }
    );
}

function updateGames(data) {
    const games = JSON.parse(data);
    const tableBody = document.getElementById('gamesBody');
    tableBody.textContent = '';
    for (g in games) {
        tableBody.insertAdjacentHTML('afterbegin',
            `<tr><th scope="row">${g}</th><td>${games[g]['creator']}</td><td>${games[g]['time']}</td><td><button class="button">Join</button></td></tr>`
        );
    }
}