const conf = new Map();

module.exports = function(RED) {
    function dbTripsNode(config) {
        RED.nodes.createNode(this, config);

        conf.set("tripID", config.tripID);
        conf.set("stopovers", config.stopovers);
        conf.set("polyline", config.polyline);
        conf.set("language", config.language);

        var node = this;
        node.on('input', onInput);
    }
    RED.nodes.registerType("deutsche-bahn-trips", dbTripsNode);
}

async function onInput(msg, send, done) {
    handlePayload(msg.payload);

    let requestURL = `https://v6.db.transport.rest/trips/${encodeURIComponent(conf.get("tripID"))}?`;

    requestURL += `stopover=${conf.get("stopover")}`;
    requestURL += `&polyline=${conf.get("polyline")}`;
    requestURL += `&language=${conf.get("language")}`;


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