function generateQuestionListPage() {
    const local = getLocal();
    Promise.all([
        getCurrentEventId(),
        generateProfile(),
        getSt(),
        getBallot(),
        getAaa()
    ]).then(
        results => {
            const currentEventId = results[0];
            currentEventPromise(currentEventId).then(
                currentVoteEvent => {
                    const ballotsArray = currentVoteEvent['ballots'];
                    const questionsArray = currentVoteEvent['questions'];
                    const st = results[2];
                    let ballot = results[3];

                    if (!ballot) {
                        ballot = [];
                    }

                    //set question name
                    const eventName = document.getElementById('EventText');
                    const eventText = currentVoteEvent['title'];
                    document.getElementById('questionsPageTitle').innerHTML = eventText;
                    eventName.insertAdjacentHTML('beforeend', local['questionsPageTitle']);
                    const acceptedVote = '<div><img class="time-icon-design" src="./img/statusIcons/Group 389.svg"></img></div>';
                    const waitingVote = '<div><img class="time-icon-design" src="./img/statusIcons/Group 388.svg"></img></div>';

                    const part1 = '<tr name="options" class="question-text-wrapper" style="cursor:pointer;display:grid" id = "';
                    const part2 = '" status="';
                    const part3 = '" onclick="redirectVoteList(this);"><td class="events-title-design">';
                    const part4 = '</td><td class="text-small"><div class="icon-with-status-design">';
                    const part5 = '</div></td></tr>';

                    let table = document.getElementById("appendData");
                    let id_i = 0;

                    let statusQuestion = '';

                    for (let q in questionsArray) {
                        let status = waitingVote + " " + local['questionsStatuses'][0];
                        statusQuestion = local['questionsStatuses'][0];

                        for (let b in ballotsArray) {
                            if (ballotsArray[b]['voter'] === st && ballotsArray[b]['question_title'] === questionsArray[q]['title']) {
                                status = acceptedVote + " <div>" + local['questionsStatuses'][1] + '</div>';
                                statusQuestion = local['questionsStatuses'][1];
                                break;
                            }
                        }

                        //additional check in local ballot

                        for (let b in ballot) {
                            if (ballot[b]['voter'] === st &&
                                ballot[b]['question_title'] === questionsArray[q]['title'] &&
                                ballot[b]['_id'] === currentVoteEvent['_id']) {
                                status = acceptedVote + " <div>" + local['questionsStatuses'][1] + '</div>';
                                statusQuestion = local['questionsStatuses'][1];
                                break;
                            }
                        }

                        table.insertAdjacentHTML('beforeend', part1 +
                            id_i.toString() +
                            part2 +
                            statusQuestion +
                            part3 +
                            (parseInt(q) + 1).toString() + ". " +
                            questionsArray[q]['title'] +
                            part4 +
                            status +
                            part5);
                        id_i += 1;
                    }
                    //Голосование сразу по всем вопросам
                    if (currentVoteEvent['template'] === 'ynq') {
                        let voted = false;
                        for (let b in ballotsArray) {
                            if (ballotsArray[b]['voter'] === st) {
                                voted = true;
                            }
                        }
                        if (!voted || currentVoteEvent['re_voting'] === "true") {
                            const part1 = '<tr><td colspan="2"><div class="custom-control custom-checkbox mb-1"><input type="checkbox" class="custom-control-input" id="option_';
                            const part2 = '" name="formsCheckDefault" onchange="crossCheck(this.id);"><label name="labels" class="custom-control-label" for="option_';
                            const part3 = '">';
                            const part4 = '</td></tr>';

                            const optionsArray = questionsArray[0]['options'];
                            table = document.getElementById('voteForAll');
                            let id_i = 0;
                            for (let o in optionsArray) {
                                table.insertAdjacentHTML('beforeend', part1 +
                                    id_i.toString() +
                                    part2 +
                                    id_i.toString() +
                                    part3 +
                                    optionsArray[o]['value'] +
                                    part4);
                                id_i += 1;
                            }
                            table.insertAdjacentHTML('beforeend', '<div class="card-body text-center border-bottom button-vote-wrapper"><button id="disabledBtn" class="button-designed" type="button" onclick="sendVoteForAll()" class="mb-2 btn btn-outline-danger mr-2" disabled>'/*Проголосовать*/ + local['questionsVoteForAllButton'] + '</button></div>');
                        } else {
                            document.getElementById('voteForAllBtn').remove();
                        }
                    } else {
                        document.getElementById('voteForAllBtn').remove();
                    }
                    generateEventMaterial(currentVoteEvent);
                    initTimer(currentVoteEvent['event_end_time'].toString());
                    const socket = io(server + ":" + port);
                    socket.on(`pooling_updates/${currentVoteEvent['_id']}`, handle_updates);
                    loading();
                },
                error => {
                    console.log(error);
                }
            );
        }
    );
}

function generateEventMaterial(currentVoteEvent) {
    const materialsArray = currentVoteEvent['materials'];
    const materialsBody = document.getElementById('materialsBody');
    if (materialsArray.length > 0) {
        const part1 = '<tr style="cursor: pointer;"><td style="background-color:#F8F8F8"><a class="material-link-design" href="';
        const part2 = '">';
        const part3 = '</a></td></tr>';
        for (m in materialsArray) {
            materialsBody.insertAdjacentHTML('beforeend',
                `${part1}${generateMaterialLink(materialsArray[m])}${part2}${(parseInt(m) + 1).toString()}.${materialsArray[m]['title']}${part3}`);
        }
    } else {
        document.getElementById('hideMaterialsIfUnpresant').hidden = true;
    }
}

function toInformationPage() {
    const local = getLocal();
    Promise.all([
        getCurrentVoteEvent(),
        setCaption1(local['waitingCaptions1'][3]),
        setCaption2(local['waitingCaptions2'][2]),
        setInfoStatus(local['waitingStatuses'][5])
    ]).then(
        results => {
            const currentVoteEvent = results[0];
            console.log(currentVoteEvent);
            const timeStamp = currentVoteEvent['event_end_time'];
            Promise.all([
                setTimeStamp(timeStamp),
                setOptionalBtn('')
            ]).then(
                results => {
                    locationWaiting();
                },
                error => {
                    console.log(error);
                }
            );
        },
        error => {
            console.log(error);
        }
    );
}

function redirectVoteList(obj) {
    const questions = document.getElementsByName('options');
    const id = obj.getAttribute('id');
    const status = obj.getAttribute('status');
    console.log(questions[id].id);
    Promise.all([
        getCurrentVoteEvent(),
        setCurrentQuestionId(questions[id].id),
        setCurrentQuestionStatus(status)
    ]).then(
        results => {
            const currentVoteEvent = results[0];
            setCurrentVoteEvent(currentVoteEvent).then(
                result => {
                    if (currentVoteEvent['re_voting'] === 'true') {
                        toVoteList();
                    } else {
                        if (status == 'Голос учтён') {
                            locationAccepted();
                        } else {
                            toVoteList();
                        }
                    }
                }
            );
        }
    );
}

//Отправка голоса сразу за все вопросы
function sendVoteForAll() {
    Promise.all([
        getCurrentVoteEvent(),
        getSt()
    ]).then(
        results => {
            const currentVoteEvent = results[0];
            const st = results[1];
            const questionsArray = currentVoteEvent['questions'];
            let options;
            let resArray = []
            options = document.getElementsByName('formsCheckDefault');
            labels = document.getElementsByName('labels');
            for (let i = 0, length = options.length; i < length; i++) {
                if (options[i].checked) {
                    let choose = labels[i].innerText;
                    resArray.push(choose);
                }
            }
            let promises = [];
            for (let q in questionsArray) {
                promises.push(votePromise(currentVoteEvent['_id'], st, currentVoteEvent['questions'][q]['title'], JSON.stringify(resArray)));
            }
            Promise.all(promises).then(
                results => {
                    locationQuestions();
                }
            );
        }
    );
}

function toVoteList() {
    locationVoting();
}