
let db;

init();

async function init() {
    db = await idb.openDb('appData', 1, db => {
        db.createObjectStore('keyPairs', { keyPath: 'key' });
    });
}

async function list() {
    if (!db) {
        await init();
    }
    let tx = db.transaction('keyPairs');
    let appData = tx.objectStore('keyPairs');
    let keyPairs = await appData.getAll();
    //console.log(keyPairs);
}

async function getValue(key = "") {
    if (!db) {
        await init();
    }
    let tx = db.transaction('keyPairs');
    let appData = tx.objectStore('keyPairs');

    const buffer = await appData.get(key);
    /*console.log(buffer);
    return buffer[key];*/

    let keyPairs = await appData.getAll();

    for (i in keyPairs) {
        if (keyPairs[i].key == key) {
            return keyPairs[i].value;
        }
    }
    return null;
}

async function clearKeyPairs() {
    if (!db) {
        await init();
    }
    let tx = db.transaction('keyPairs', 'readwrite');
    await tx.objectStore('keyPairs').clear();
    await list();
}

async function deleteKey(key = "") {
    if (!db) {
        await init();
    }
    let tx = db.transaction('keyPairs', 'readwrite');

    await tx.objectStore('keyPairs').delete(key);
}

async function addKeyPair(key = "", value = "") {
    if (!db) {
        await init();
    }
    let tx = db.transaction('keyPairs', 'readwrite');
    try {
        await tx.objectStore('keyPairs').put({ key, value });//add({ key, value });
        //console.log(`keypair successfully added: ${key} : ${value}`);
    } catch (err) {
        console.log(err);
        if (err.name == 'ConstraintError') {
            deleteKey(key);
            addKeyPair(key, value);
            console.log('Such keyPair has existed!');
        } else {
            throw err;
        }
    }
}