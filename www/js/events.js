function generateVoteEventPage() {
    Promise.all([
        getSt(),
        generateProfile(),
        eventStatusesPromise()
    ]).then(
        results => {
            getAaa();
            const st = results[0];
            const eventsArray = results[2];
            setVoteEvents(JSON.stringify(eventsArray)).then(
                result => {
                    const part1 = '<tr name="options" style="display: grid;cursor:pointer;border-radius:.625rem; min-height:45px;" id = "';
                    const part2 = '" onclick="console.log(this.id);redirectQuestionList(this.id)"><div  class="event-caption-wrapper"><td class="events-status-design"><div class="icon-with-status-design-table"><div><img src="./img/statusIcons/Rectangle 55.svg" class="events-marker-design"></div><div class="events-title-design">';
                    const part3 = '</div></div></td><td class="events-status-design">';
                    const part4 = '</td></div></tr></tr>';

                    const activeEventsTable = document.getElementById("appendOpenEvents");
                    const finishedEventsTable = document.getElementById("appendSecretEvents");
                    let hasActive = false;
                    let hasFinished = false;
                    //Разделение предстоящих и завершенных голосований голосований
                    for (var e in eventsArray) {
                        let id_i = eventsArray[e]['_id'];
                        const text = `${part1}${id_i}${part2}${eventsArray[e]['title']}${part3}${eventStatusNormalizer(st, eventsArray[e]['status'], eventsArray[e])}${part4}`;
                        if (eventsArray[e]['status'] != 'ended' && eventsArray[e]['status'] != 'quorum_unpresant') {
                            hasActive = true;
                            activeEventsTable.insertAdjacentHTML('beforeend', text);
                        } else {
                            hasFinished = true;
                            finishedEventsTable.insertAdjacentHTML('beforeend', text);
                        }
                    }
                    let noVotings = getLocal()['noVotings'];
                    if (hasActive === false) {
                        activeEventsTable.insertAdjacentHTML('beforeend', `<tr><td class="events-title-design" colspan="2">${noVotings[0]}</td></tr>`);
                    }
                    if (hasFinished === false) {
                        finishedEventsTable.insertAdjacentHTML('beforeend', `<tr><td class="events-title-design" colspan="2">${noVotings[1]}</td></tr>`);
                    }
                    loading();
                }
            );
        },
        error => {
            //TO DO: page with server error connection
            console.log(error);
        }
    );
}

function eventStatusNormalizer(st, status, event) {
    let str = "Не определено";
    let icon = "";
    const statusArray = getLocal()['statuses'];

    if (status === 'registration') {
        icon = 'registration.svg';
        if (event['evoters'].includes(st)) {
            if (event['is_voting'] === true) {
                icon = 'Group 318.svg';
                //str = 'Идёт голосование';
                str = statusArray[0];
            } else {
                icon = 'registrated.svg';
                //str = 'Вы зарегистрированы';
                str = statusArray[1];
            }
        } else {
            //str = 'Идёт регистрация';
            str = statusArray[2];
        }
    } else if (status === 'waiting') {
        icon = 'Group 385.svg';
        //str = 'Ожидается регистрация';
        str = statusArray[3];
    } else if (status === 'ended') {
        icon = 'Group 314.svg';
        //str = 'Голосование закончено';
        str = statusArray[4];
    } else if (status === 'voting') {
        icon = 'Group 318.svg';
        //str = 'Идёт голосование';
        str = statusArray[0];
    } else if (status === 'event waiting') {
        icon = 'event_waiting.svg';
        //str = 'Голосование ожидается';
        str = statusArray[5];
    } else if (status === 'quorum_unpresant') {
        icon = 'cross.svg';
        //str = 'Кворум не достигнут';
        str = statusArray[6];
        //return `<div class="icon-with-status-design-table"><div><img src="./img/statusIcons/'${icon}" class="status-icon-design""></div><div class="status-text-design">${str}</div></div>`;
    }
    return `<div class="icon-with-status-design-table"><div><img src="./img/statusIcons/${icon}" class="status-icon-design""></div><div class="status-text-design">${str}</div></div>`;
}

//Обработка статусов по событиям
function redirectQuestionList(id) {
    Promise.all([
        getSt(),
        currentEventPromise(id),
        setCurrentEventId(id)
    ]).then(
        results => {
            setCurrentVoteEvent(results[1]);
            return results;
        },
        error => {
            console.log(error);
        }
    ).then(
        results => {
            const st = results[0];
            const currentVoteEvent = results[1];
            const status = currentVoteEvent['status'];
            const local = getLocal();
            let btn;
            let caption1 = currentVoteEvent['title'];
            let caption2;
            let redirectFunction;
            let infoStatus;
            if (status === 'registration') {
                //to choose event type
                let voting = true
                if (currentVoteEvent['evoters'].includes(st)) {
                    redirect = 'toQuestionList()';
                    voting = false;
                    caption2 = local['waitingCaptions2'][0];
                    infoStatus = local['waitingStatuses'][0];
                    if (currentVoteEvent['re_registration'] === 'true') {
                        btn = '<button type="button" onclick = toQuestionListRemoveUser() class="button-designed">Отменить регистрацию</button>';
                    } else {
                        btn = '';
                    }
                } else {
                    caption2 = local['waitingCaptions2'][0];
                    infoStatus = local['waitingStatuses'][1];
                    btn = '<button type="button" onclick = toQuestionListAddUser() class="button-designed" style="min-width:14rem">'/*Зарегистрироваться*/ + local['waitingOptionalBtn'][1] + '</button>';
                }
                if (voting === true) {
                    redirect = 'locationWaiting()';
                }
            } else if (status === 'waiting') {
                caption2 = local['waitingCaptions2'][1];
                statusInfo = local['waitingStatuses'][2];
                btn = '';
                redirect = 'locationWaiting()';
            } else if (status === 'voting') {
                if (currentVoteEvent['evoters'].includes(st)) {
                    redirect = 'toQuestionList()';
                } else {
                    caption2 = local['waitingCaptions2'][2];
                    infoStatus = local['waitingStatuses'][1]
                    btn = '';
                    redirect = 'locationWaiting()';
                }
                //to question list
            } else if (status === 'ended') {
                redirect = 'toResults()';
                //smth
            } else if (status === 'event waiting') {
                caption2 = local['waitingCaptions2'][3];
                infoStatus = local['waitingStatuses'][3];
                btn = '';
                redirect = 'locationWaiting()';
            } else if (status === 'quorum_unpresant') {
                caption2 = local['waitingCaptions2'][4];
                infoStatus = local['waitingStatuses'][4];
                btn = '';
                redirect = 'locationWaiting()';
            }
            Promise.all([
                setCaption1(caption1),
                setCaption2(caption2),
                setInfoStatus(infoStatus),
                setOptionalBtn(btn)
            ]).then(
                //СЕТ всю хрень caption1/2 btn infoStatus
                results => {
                    switch (redirect) {
                        case 'toQuestionList()':
                            toQuestionList();
                            break;
                        case 'locationWaiting()':
                            locationWaiting();
                            break;
                        case 'toResults()':
                            toResults();
                            break;
                        default:
                            break;
                    }
                }
            );
        }
    );
}