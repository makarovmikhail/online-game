const server = "http://0.0.0.0";
const port = '4564';

function serverTimePromise() {
    const ip = `${server}:${port}/get_time`;

    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            xhrFields: {
                withCredentials: true
            },
            contentType: false,
            processData: false,
            method: 'GET',
            type: 'GET',
            success: function (data) {
                console.log(data);
                localStorage.setItem('time', data['time']);
                resolve(data);
            },
            error: function (data) {
                console.log(data);
                reject(data);
            }
        });
    });
}

function authRequestPromise() {
    const login = document.getElementById('login').value;
    const pwd = document.getElementById('inputPassword4').value;
    const ip = `${server}:${port}/auth`;
    const body = `username=${login}&password=${pwd}`;
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

/*function authRequestPromise() {
    const login = document.getElementById('login').value;
    const pwd = document.getElementById('inputPassword4').value;
    const ip = `${server}:${port}/auth2/?`;
    const body = `username=${login}&password=${pwd}`;
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
                debugger;
                resolve(data);
            },
            error: function (data) {
                console.log(data);
                reject(data);
            }
        });
    });
}*/

function resultsPromise(id) {
    const ip = `${server}:${port}/get_voting_event_result_by_id/${id}`;

    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                debugger;
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

/*function getResults(voteTitle) {
    const ip = `${server}:${port}/get_voting_event_result_by_id/${voteTitle}`;
    jQuery.when(
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                console.log(data);
            }
        })
    ).then(
        function (data, textStatus, jqXHR) {
            localStorage.setItem('voteResults', JSON.stringify(data));
        }
    );
}*/

function getVoteEventsRequest() {
    const st = getSt();
    let ip = server + ":" + port + '/get_voting_events_for_user/' + st;
    jQuery.when(
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                console.log(data);
            }
        })
    ).then(
        function (data, textStatus, jqXHR) {
            let str = JSON.stringify(data);
            let eventsArray = JSON.parse(str);
            console.log(eventsArray);
            eventsArray.sort(function (a, b) {
                return Date.parse(timeParser(b.event_start_time)) - Date.parse(timeParser(a.event_start_time));
            });
            return eventsArray;
        }
    );
}

function eventStatusesPromise() {
    const ip = `${server}:${port}/get_voting_events_for_user_brief_info/`;
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                console.log(data);
                const eventsArray = data;//JSON.parse(data);                
                eventsArray.sort(function (a, b) {
                    return Date.parse(timeParser(b.event_start_time)) - Date.parse(timeParser(a.event_start_time));
                });
                resolve(eventsArray);
            },
            error: function (data) {
                console.log(data);
                reject(data);
            }
        });
    }
    );
}

function currentEventPromise(id) {
    const ip = `${server}:${port}/get_voting_event_details/${id}`;
    return new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                const str = JSON.stringify(data);
                const currentVoteEvent = JSON.parse(str);
                //getServerTime();
                resolve(currentVoteEvent);
                //localStorage.setItem('currentVoteEvent', JSON.stringify(currentVoteEvent));
            },
            error: function (data) {
                console.log(data);
                reject(data);
            }
        });
    });
}

function getCurrentVoteEventRequest() {
    let _id = localStorage.getItem('currentEventId');
    let ip = server + ":" + port + '/get_voting_event_details/' + _id;
    jQuery.when(
        jQuery.ajax({
            url: ip,
            cache: false,
            async: true,
            contentType: false,
            processData: false,
            xhrFields: {
                withCredentials: true
            },
            method: 'GET',
            type: 'GET',
            success: function (data) {
                console.log(data);
            }
        })
    ).then(
        function (data, textStatus, jqXHR) {
            let str = JSON.stringify(data);
            let currentVoteEvent = JSON.parse(str);
            localStorage.setItem('currentVoteEvent', JSON.stringify(currentVoteEvent));
        }
    );
}

function votePromise(eventId, st, questionTitle, vote) {
    const ip = `${server}:${port}/update_voting_event_add_ballot/?`;
    const body = `id=${eventId}&st=${st}&question_title=${questionTitle}&res=${vote}`;
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

function registrationPromise(id, st) {
    const ip = `${server}:${port}/update_voting_event_add_evoter/?`;
    const body = `id=${id}&st=${st}`;
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
            error: function(data) {
                console.log(data);
                reject(data);
            }
        });
    });
}

function postRemoveUserVotingEventRequest(voteId, st) {
    let ip = server + ":" + port + '/update_voting_event_remove_evoter/?';
    let xhr = new XMLHttpRequest();
    let body = 'id=' + voteId +
        '&st=' + st;
    jQuery.when(
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
            success: function (data) { }
        })
    ).then(
        function (data, textStatus, jqXHR) {
            console.log(data);
        }
    );
}