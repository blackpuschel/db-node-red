const conf = new Map();

module.exports = function(RED) {
    function dbStationsNode(config) {
        RED.nodes.createNode(this, config);

        conf.set("stationName", config.stationName);
        conf.set("maxResults", config.maxResults);
        conf.set("fuzzy", config.fuzzy);
        conf.set("autocomplete", config.autocomplete);

        var node = this;
        node.on('input', onInput);
    }
    RED.nodes.registerType("deutsche-bahn-stations", dbStationsNode);
}

async function onInput(msg, send, done) {
    handlePayload(msg.payload);

    let requestURL = `https://v6.db.transport.rest/stations?query=${encodeURIComponent(conf.get("stationName"))}`;

    requestURL += `&limit=${conf.get("maxResults")}`;
    requestURL += `&fuzzy=${conf.get("fuzzy")}`;
    requestURL += `&completion=${conf.get("autocomplete")}`;

    let response = await fetch(requestURL)
        .then(response => {
            return response.json();
        })
        .catch(ex => {
            // TODO: make this good
            return ex;
        });
        
    msg = { "payload": response }
    send(msg);

    if (done) {
        done();
    }
}

function handlePayload(payload) {
    Object.keys(payload).forEach((key) => {
        if (conf.has(key)) {
            conf.set(key, payload[key]);
        }
    })
}