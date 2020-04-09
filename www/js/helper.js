function setSt(data) {
    return addKeyPair('st', data);
}

async function getSt() {
    return getValue('st');
}

function setPwd(data) {
    return addKeyPair('pwd', data);
}

function getPwd() {
    return getValue('pwd');
}

function setCurrentEventId(data) {
    return addKeyPair('currentEventId', data);
}

function getCurrentEventId() {
    return getValue('currentEventId');
}

function setVoteEvents(data) {
    return addKeyPair('voteEvents', data);
}

function getVoteEvents() {
    return getValue('voteEvents');
}

function setCurrentVoteEvent(data) {
    return addKeyPair('currentVoteEvent', data);
}

function getCurrentVoteEvent() {
    return getValue('currentVoteEvent');
}

function setProfile(data) {
    return addKeyPair('profile', data);
}

function setTimeStamp(data) {
    return addKeyPair('timeStamp', data);
}

function getTimeStamp() {
    return getValue('timeStamp');
}

function setCaption1(data) {
    return addKeyPair('caption1', data);
}

function getCaption1() {
    return getValue('caption1');
}

function setCaption2(data) {
    return addKeyPair('caption2', data);
}

function getCaption2() {
    return getValue('caption2');
}

function setInfoStatus(data) {
    return addKeyPair('infoStatus', data);
}

function getInfoStatus() {
    return getValue('infoStatus');
}

function setSaveAccount(data) {
    return addKeyPair('saveAccount', data);
}

function getSaveAccount() {
    return getValue('saveAccount');
}

function setCurrentQuestionId(data) {
    return addKeyPair('currentQuestionId', data);
}

function getCurrentQuestionId() {
    return getValue('currentQuestionId');
}

function setCurrentQuestionStatus(data) {
    return addKeyPair('currentQuestionStatus', data);
}

function getCurrentQuestionStatus() {
    return getValue('currentQuestionStatus');
}

function setBallot(data) {
    return addKeyPair('ballot', data);
}

function getBallot() {
    return getValue('ballot');
}

function getProfile() {
    return getValue("profile");
}

function generateProfile() {
    getProfile().then(
        result => {
            document.getElementById("profile").insertAdjacentHTML('beforeend', result);
        },
        error => {
            console.log(error);
        }
    );
}

function setCorrectBallot(data) {
    return addKeyPair('correctBallot', data);
}

function getCorrectBallot() {
    return getValue('correctBallot');
}

function setOptionalBtn(data) {
    return addKeyPair('optionalBtn', data);
}

function getOptionalBtn() {
    return getValue('optionalBtn');
}

function setOneQuestion(data) {
    return addKeyPair('oneQuestion', data);
}

function getOneQuestion() {
    return getValue('oneQuestion');
}

function initTimer(finishTime = '') {
    serverTimePromise().then(
        result => {
            const serverTime = result['time'];
            const currentDate = timeParser(finishTime);
            if (!((currentDate - new Date(serverTime)) <= 0)) {
                jQuery(document).ready(function ($) {
                    $('.countdown').dsCountDown({
                        endDate: currentDate
                    });
                });
                $('#timerProgress').width('25%');
                document.getElementById('countdown').hidden = false;
                document.getElementById('remaining-time').hidden = false;
            }
        },
        error => {
            console.log(error);
        }
    );
}

function setStateCorrectBallot() {
    return new Promise(function (resolve, reject) {
        getCorrectBallot().then(
            state => {
                state === 'true' ?
                    document.getElementById('correctBallot').checked = true :
                    document.getElementById('correctBallot').checked = false;
                resolve();
            }
        );
    });
}

function getAaa() {
    setStateCorrectBallot().then(
        result => {
            let pageSize = localStorage.getItem('pageSize');
            if (pageSize === 'enlarged') {
                document.getElementById('html').classList.remove('html');
                document.getElementById('html').classList.add('enlarged');
            } else {
                document.getElementById('html').classList.remove('enlarged');
                document.getElementById('html').classList.add('html');
            }
        }
    );
}

function setAaa() {
    let pageSize = localStorage.getItem('pageSize');
    if (pageSize === 'enlarged') {
        pageSize = '';
    } else {
        pageSize = 'enlarged';
    }
    localStorage.setItem('pageSize', pageSize);
    getAaa();
}

function generateQuestionMaterial(currentEvent) {
    var questions = currentEvent['questions'];

    //Тэги материала повестки
    var part1 = '<tr><td style="background-color: #F8F8F8;"><a class="material-link-design" href="';
    var part2 = '">';
    var part3 = '</a></td></tr>';

    //Тэги материала вопроса
    var part1_question_material = '<tr><td name="question_material_';
    var part2_question_material = '" hidden><a class="material-link-design" href="';
    var part3_question_material = '">';
    var part4_question_material = '</a></td></tr>';

    var questionList = document.getElementById('showQuestions');
    var materialsList = document.getElementById('showMaterials');

    var n = 0;

    for (var m in currentEvent['materials']) {
        n += 1;
        materialsList.insertAdjacentHTML('beforeend', part1 +
            generateMaterialLink(currentEvent['materials'][m]) +
            part2 +
            n.toString() + ". " +
            currentEvent['materials'][m]['title'] +
            part3);
    }
    n = 0;
    //Отрисовка вопросов
    var tip = '<img src="../img/statusIcons/Path 402.svg" class="tip-icon-design" style="margin-left:5px;cursor:pointer">';
    var tip_current = "";
    for (var q in questions) {
        n = parseInt(q) + 1;
        var questionMaterials = questions[q]['materials'];
        if (questionMaterials.length > 0) {
            tip_current = tip;
        } else {
            tip_current = "";
        }
        questionList.insertAdjacentHTML('beforeend', '<tr><td id="question_material_' +
            q.toString() +
            '"class="question-header-design border-top" onclick="showHideQuestionMaterials(this.id);"><span class="question-header-gesign">' +
            n.toString() +
            ". " +
            questions[q]['title'] +
            "</span>" +
            tip_current +
            '</td></tr>');
        var options = questions[q]['options'];
        //Отрисовка материалов вопроса
        var mn = 0;
        for (var qm in questionMaterials) {
            mn += 1;
            questionList.insertAdjacentHTML('beforeend', part1_question_material +
                q.toString() +
                part2_question_material +
                generateMaterialLink(questionMaterials[qm]) +
                part3_question_material +
                mn.toString() + ". " +
                questionMaterials[qm]['title'] +
                part4_question_material);
        }
        //Отрисовка опций
        for (var o in options) {
            questionList.insertAdjacentHTML('beforeend', '<tr><td class="question-option-gesign"><img src="../img/statusIcons/Rectangle 55.svg" style="height:1rem;margin-right:5px;margin-bottom:0.4rem">' + options[o]['value'] + '</td></tr>');
            var optionMaterials = options[o]['materials'];
            for (var om in optionMaterials) {
                questionList.insertAdjacentHTML('beforeend', part11 +
                    generateMaterialLink(optionMaterials[om]) +
                    part2 +
                    optionMaterials[om]['title'] +
                    part3);
            }
        }
    }
}

function showHideQuestionMaterials(id) {
    const qm = document.getElementsByName(id);
    for (q in qm) {
        qm[q].hidden ? qm[q].hidden = false : qm[q].hidden = true;
        /*if (qm[q].hidden === true) {
            ;
        } else {
            ;
        }*/
    }
}

function cleanStorage() {
    return clearKeyPairs();
}