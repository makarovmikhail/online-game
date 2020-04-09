function removeIsInvalid() {
    document.getElementById('feedbackText').innerHTML = '';
    document.getElementById('login').classList.remove('invalid-design');
    document.getElementById('inputPassword4').classList.remove('invalid-design');
}

function removeWarning() {
    document.getElementById('confirmWarning').innerHTML = '';
}

function chooseVoteEventRedirect() {
    if (document.title === 'Waiting') {
        locationEventsRedirectUp();
    } else {
        locationEventsRedirect();
    }
}

function toVoteListFromWaiting() {
    locationVotingFromWaiting();
}

function toQuestionListAddUser() {
    const local = getLocal();

    Promise.all([
        setOneQuestion(false),
        getCurrentEventId(),
        getSt(),
        getCurrentVoteEvent()
    ]).then(
        results => {
            const currentVoteEventId = results[1];
            const st = results[2];
            const currentVoteEvent = results[3];
            registrationPromise(currentVoteEventId, st).then(
                result => {
                    let btn = '';
                    if (currentVoteEvent['re_registration'] === 'true') {
                        btn = '<button type="button" onclick = toQuestionListRemoveUser() class="button-designed">'/*Отменить регистрацию*/ + local['waitingOptionalBtn'][0] + '</button>';
                    }
                    Promise.all([
                        setInfoStatus('Вы зарегистрированы'),
                        setOptionalBtn(btn)
                    ]).then(
                        results => {
                            //Если идет регистрация, то сразу к вопросам
                            if (currentVoteEvent['is_voting']) {
                                //Если только 1 вопрос, то сразу к голосованию
                                if (currentVoteEvent['questions'].length == 1) {
                                    console.log(currentVoteEvent['questions']);
                                    //TO DO
                                    redirectOneQuestion();
                                } else {
                                    locationQuestionsUp();
                                }
                            } else {
                                locationWaitingUp();
                            }
                        }
                    );
                }
            );
        }
    );
}

function toQuestionListRemoveUser() {
    const data = getCurrentVoteEvent();
    const currentVoteEvent = JSON.parse(data);
    const votedId = currentVoteEvent['_id'];
    const st = getSt();
    postRemoveUserVotingEventRequest(votedId, st);
    getCurrentVoteEventRequest();
    const local = getLocal();
    setInfoStatus(local['waitingStatuses'][1]);
    const btn = '<button type="button" onclick = toQuestionListAddUser() class="button-designed" style="min-width:14rem">'/*Зарегистрироваться*/ + local['waitingOptionalBtn'][1] + '</button>';
    localStorage.setItem('optionalBtn', btn);
    locationWaitingUp();
}

function redirectOneQuestion() {
    localStorage.setItem('currentQuestionId', '0');
    localStorage.setItem('oneQuestion', 'true');

    var data = getCurrentVoteEvent();
    var currentVoteEvent = JSON.parse(data);

    if (currentVoteEvent['re_voting'] === 'true') {
        toVoteListFromWaiting();
    } else {
        //Проверяем голосовал ли пользователь
        let hasVoted = false;
        const st = getSt();
        for (let i = 0; i < currentVoteEvent['ballots'].length; i++) {
            if (currentVoteEvent['ballots'][i]['voter'] == st) {
                hasVoted = true;
                break;
            }
        }
        console.log(hasVoted);
        if (hasVoted) {
            locationAccepted();
        } else {
            toVoteListFromWaiting();
        }
    }
}

function generateIndexPage() {
    Promise.all([
        getSt(),
        getPwd(),
        getSaveAccount(),
        setCorrectBallot(true)
    ]).then(
        results => {
            const st = results[0];
            const pwd = results[1];
            const saveAccount = results[2];
            if (st) {
                document.getElementById('login').value = st;
                document.getElementById('inputPassword4').value = pwd;
                document.getElementById('save').checked = saveAccount;
            }
        }
    );
    setElementText('recognizeMe', "Запомнить меня");
    setElementText('confirmPolicyAndEmail', "Ознакомлен с <a class='policy-link-design' href='https://dltc.spbu.ru/ru/docs/cryptoveche-pk' target='_blank'>Политикой</a>. Подтверждаю принадлежность мне указанного электронного адреса.");
    setElementText('loginButton', "Войти");
    setElementText('footer-main-design', "&copy;2019. Система разработана Центром технологий распределенных реестров СПбГУ<br>Все права защищены. E-mail: support@dltc.spbu.ru");
}


function authRequestPost() {

    const local = getLocal();
    const pwd = document.getElementById('inputPassword4').value;
    const confirmPolicy = document.getElementById('confirm').checked;
    if (confirmPolicy == true) {
        authRequestPromise().then(
            result => {
                if (result["status"] === "not found") {
                    console.log("not found");
                    document.getElementById('feedbackText').innerHTML = local['invalid'];
                    document.getElementById('login').classList.add('invalid-design');
                    document.getElementById('inputPassword4').classList.add('invalid-design');
                } else {
                    if (getSaveAccount() === 'true') {
                        setPwd(pwd);
                    }
                    const st = result["sAMAccountName"];
                    setSt(st.replace(/['"]+/g, ''));
                    const profileArray = result["displayName"].split(' ');
                    let profile = "";
                    if (profileArray.length === 3) {
                        profile = `${profileArray[0]} ${profileArray[1].charAt(0)}. ${profileArray[2].charAt(0)}.`;
                    } else {
                        profile = result["displayName"];
                    }
                    setProfile(profile).then(
                        console.log
                        //result => chooseVoteEventRedirect()
                    );
                }
            },
            error => {
                console.log(error);
            }
        );
    } else {
        document.getElementById('confirmWarning').innerHTML = local['warningPolicy'];
    }
    localStorage.setItem('correctBallot', true);
}

function crossCheck(id) {
    var countChecked = 0;
    var options = document.getElementsByName('formsCheckDefault');
    var labels = document.getElementsByName('labels');
    console.log(labels);
    for (var o = 0; o < options.length; o++) {
        console.log(options[o]);
        if (labels[o] !== 'undefined') {
            if (labels[o].style !== 'undefined') {
                if (options[o].checked) {
                    countChecked += 1;
                    labels[o].style.setProperty("text-decoration", "none");
                } else {
                    try {
                        labels[o].style.setProperty("text-decoration", "line-through");
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
    var optionId = id.split('_')[1];
    if (countChecked != 1) {
        document.getElementById('disabledBtn').disabled = true;
    } else {
        document.getElementById('disabledBtn').disabled = false;
    }
}

function showHideOptionsVoteForAll() {
    document.getElementById('voteForAll').hidden = !document.getElementById('voteForAll').hidden;
}

function toResults() {
    locationResults();
}

function generateMaterialLink(material) {
    if (material['type'] === 'doc') {
        return server + ":" + port + "/download/" + material['value'];
    } else {
        return material['value'];
    }
}

function changeStateCorrectBallot() {
    localStorage.setItem('correctBallot', document.getElementById('correctBallot').checked);
    if (document.title === 'Voting') {
        if (localStorage.getItem('correctBallot') === 'true') {
            checkRules();
        } else {
            document.getElementById('disabledBtn').disabled = false;
        }
    }
}

function activeButton(id) {
    document.getElementById('disabledBtn').disabled = false;
}

function activeToggle(id) {
    if (document.getElementById('disabledBtn').disabled == false) {
        document.getElementById('disabledBtn').disabled = true;
    } else {
        document.getElementById('disabledBtn').disabled = false;
    }
}

function hideExitAcception() {
    document.getElementById('exitAcception').classList.remove('shown-notification-content')
    document.getElementById('hideAllExceptNotification').hidden = true
}

function showExitAcception() {
    document.getElementById('exitAcception').classList.add('shown-notification-content')
    document.getElementById('hideAllExceptNotification').hidden = false
}

function showForgetAcception() {
    document.getElementById('exitAcception').classList.add('shown-notification-content')
    document.getElementById('hideAllExceptNotification').hidden = false
    /*await sleep(3000)
    hideExitAcception()
    locationIndex()*/
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function openSecretClick(id) {
    var elements = document.getElementById('appendSecretEvents');
    var icon = document.getElementById('eventsChooseEndedIcon');
    if (id === "openClick") {
        elements = document.getElementById('appendOpenEvents');
        icon = document.getElementById('eventsChooseCurrentIcon');
    }
    if (elements.hidden === true) {
        icon.src = "./img/statusIcons/Path 334.svg";
        elements.hidden = false;
    } else {
        icon.src = "./img/statusIcons/Path 400.svg";
        elements.hidden = true;
    }
}

function openMyBallot() {
    elements = document.getElementById('myBallot');
    icon = document.getElementById('myBallotShowHide');
    if (elements.hidden === true) {
        elements.hidden = false;
        icon.src = "./img/statusIcons/Path 334.svg";
    } else {
        elements.hidden = true;
        icon.src = "./img/statusIcons/Path 400.svg";
    }
}

function openResults() {
    elements = document.getElementById('ResultsTable');
    icon = document.getElementById('results-icon');
    if (elements.hidden === true) {
        elements.hidden = false;
        icon.src = "./img/statusIcons/Path 334.svg";
    } else {
        elements.hidden = true;
        icon.src = "./img/statusIcons/Path 400.svg";
    }
}

function openQuestions() {
    elements = document.getElementById('showQuestions');
    icon = document.getElementById('showQuestionsIcon');
    if (elements.hidden === true) {
        elements.hidden = false;
        icon.src = "../img/statusIcons/Path 334.svg";
    } else {
        elements.hidden = true;
        icon.src = "../img/statusIcons/Path 400.svg";
    }
}