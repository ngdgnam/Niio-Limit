/* eslint-disable no-self-assign */
/* eslint-disable linebreak-style */
const get = require('lodash/get');
const set = require('lodash/set');
const fs = require('fs-extra');
const path = require('path');

const dbPath = path.join(process.cwd(), 'Horizon_Database', 'SyntheticDatabase.json');

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath));
    fs.writeFileSync(path.join(path.dirname(dbPath), 'A_README.md'), 'This folder is used by ChernobyL(NANI =)) ) to store data. Do not delete this folder or any of the files in it.', 'utf8');
}

let db = {};
if (fs.existsSync(dbPath)) {
    try {
        db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        db = {};
    }
}

function saveDB() {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function Lset(key, value) {
    if (!key)
        throw new TypeError(
            "No key specified."
        );
    return arbitrate("set",{
        stringify: false,
        id: key,
        data: value,
        ops:  {},
    });
}

function Lget(key) {
    if (!key)
        throw new TypeError(
            "No key specified."
        );
    return arbitrate("fetch", { id: key, ops: {} || {} });
}

function Lhas(key) {
    if (!key)
        throw new TypeError(
            "No key specified."
        );
    return arbitrate("has", { id: key, ops: {} });
}

function Lremove(key) {
    if (!key)
        throw new TypeError(
            "No key specified."
        );
    return arbitrate("delete", { id: key, ops: {} });
}

function LremoveMultiple(key) {
    if (!key)
        throw new TypeError(
            "No key specified."
        );
        try {
            for (let i of key) {
                arbitrate("delete", { id: i, ops: {} });
            }
            return true;
        } 
    catch (err) {
        return false;
    }
}

function Llist() {
    return arbitrate("all",{ ops: {} });
}

function Replit_Set(key, value) {
    try {
        var done = false;
        
        request({
            url: process.env.REPLIT_DB_URL,
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },  
            body: `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
        
        }, function (error, response, body) {
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return;
        
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Get(key) {
    try {
        var done = false;
        var response = null;
    
        request(process.env.REPLIT_DB_URL + "/" + key, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                response = body;
            }
            done = true;
        });
    
        deasync.loopWhile(function(){
            return !done;
        });
    
        return JSON.parse(response);
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Has(key) {
    try {
        var done = false;
        var response = null;

        request(process.env.REPLIT_DB_URL + "/" + key, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                response = body;
            }
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return response != null;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_Remove(key) {
    try {
        var done = false;
        request.delete(process.env.REPLIT_DB_URL + "/" + key , function (error, response, body) {
            done = true;
        });

        deasync.loopWhile(function(){
            return !done;
        });

        return;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
function Replit_RemoveMultiple(keys) {
    try {
        for (const key of keys) {
            request.delete(process.env.REPLIT_DB_URL + "/" + key , function (error, response, body) {});
        }
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

function Replit_List() {
    var done = false;
    var response = null;

    request(process.env.REPLIT_DB_URL + "?encode=true" + `&prefix=${encodeURIComponent("")}`, function (error, res, body) {
        if (!error && res.statusCode == 200) {
            response = body;
        }
        done = true;

    });

    deasync.loopWhile(function(){
        return !done;
    });

    if (response.length === 0) {
        return [];
    }
    return response.split("\n").map(decodeURIComponent);
}


var methods = {
    fetch: function(db, params, options) {
        let fetched = db[params.id];
        if (fetched === undefined) return null;
        return fetched;
    },
    set: function(db, params, options) {
        if (params.ops.target) {
            if (!db[params.id]) db[params.id] = {};
            set(db[params.id], params.ops.target, params.data);
        } else {
            db[params.id] = params.data;
        }
        saveDB();
        return db[params.id];
    },
    add: function addDB(db, params, options) {
        if (!db[params.id]) db[params.id] = 0;
        if (params.ops.target) {
            let oldValue = get(db[params.id], params.ops.target);
            if (oldValue === undefined) oldValue = 0;
            else if (isNaN(oldValue)) throw new Error(`Data @ ID: "${params.id}" IS NOT A number.\nFOUND: ${oldValue}\nEXPECTED: number`);
            set(db[params.id], params.ops.target, oldValue + params.data);
        } else {
            if (isNaN(db[params.id])) throw new Error(`Data @ ID: "${params.id}" IS NOT A number.\nFOUND: ${db[params.id]}\nEXPECTED: number`);
            db[params.id] += params.data;
        }
        saveDB();
        return db[params.id];
    },
    subtract: function subtractDB(db, params, options) {
        if (!db[params.id]) db[params.id] = 0;
        if (params.ops.target) {
            let oldValue = get(db[params.id], params.ops.target);
            if (oldValue === undefined) oldValue = 0;
            else if (isNaN(oldValue)) throw new Error('Target is not a number.');
            set(db[params.id], params.ops.target, oldValue - params.data);
        } else {
            if (isNaN(db[params.id])) throw new Error('Target is not a number.');
            db[params.id] -= params.data;
        }
        saveDB();
        return db[params.id];
    },
    push: function pushDB(db, params, options) {
        if (!db[params.id]) db[params.id] = [];
        if (params.ops.target) {
            let oldArray = get(db[params.id], params.ops.target);
            if (oldArray === undefined) oldArray = [];
            else if (!Array.isArray(oldArray)) throw new TypeError('Target is not an array.');
            oldArray.push(params.data);
            set(db[params.id], params.ops.target, oldArray);
        } else {
            if (!Array.isArray(db[params.id])) throw new TypeError('Target is not an array.');
            db[params.id].push(params.data);
        }
        saveDB();
        return db[params.id];
    },
    delete: function deleteDB(db, params, options) {
        const unset = require('lodash/unset');
        if (!db[params.id]) return false;
        if (params.ops.target) {
            unset(db[params.id], params.ops.target);
        } else {
            delete db[params.id];
        }
        saveDB();
        return true;
    },
    has: function hasDB(db, params, options) {
        if (!db[params.id]) return false;
        if (params.ops.target) {
            return get(db[params.id], params.ops.target) !== undefined;
        }
        return true;
    },
    all: function allDB(db, params, options) {
        let resp = [];
        for (let key in db) {
            resp.push({
                ID: key,
                data: db[key]
            });
        }
        return resp;
    },
    type: function typeDB(db, params, options) {
        if (!db[params.id]) return null;
        if (params.ops.target) {
            return typeof get(db[params.id], params.ops.target);
        }
        return typeof db[params.id];
    },
    clear: function clearDB(db, params, options) {
        let count = Object.keys(db).length;
        for (let key in db) {
            delete db[key];
        }
        saveDB();
        return count;
    }
};


function arbitrate(method, params) {
    let options = {table: "json"};
    if (params.ops.target && params.ops.target[0] === ".") params.ops.target = params.ops.target.slice(1); // Remove prefix if necessary
    if (params.data && params.data === Infinity) throw new TypeError(`You cannot set Infinity into the database @ ID: ${params.id}`);
    if (params.id && typeof params.id == "string" && params.id.includes(".")) {
        let unparsed = params.id.split(".");
        params.id = unparsed.shift();
        params.ops.target = unparsed.join(".");
    }
    return methods[method](db, params, options);
}


module.exports = function ChernobyL(Local) {
    if (Local && process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    } else if (!Local && process.env["REPL_ID"]) {
        return {
            set: Replit_Set,
            get: Replit_Get,
            has: Replit_Has,
            delete: Replit_Remove,
            deleteMultiple: Replit_RemoveMultiple,
            list: Replit_List
        };
    }
    else if (Local && !process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
    else if (!Local && !process.env["REPL_ID"]) {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
    else {
        return {
            set: Lset,
            get: Lget,
            has: Lhas,
            delete: Lremove,
            deleteMultiple: LremoveMultiple,
            list: Llist
        };
    }
};