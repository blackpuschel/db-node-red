const conf = new Map();

module.exports = function(RED) {
    function dbStopsNode(config) {
        RED.nodes.createNode(this, config);

        conf.set("stopID", config.stopID);
        conf.set("when", config.when);
        conf.set("directionType", config.directionType);
        conf.set("direction", config.direction);
        conf.set("duration", config.duration);
        conf.set("maxResults", config.maxResults);
        conf.set("language", config.language);
        conf.set("includeNationalExpress", config.includeNationalExpress);
        conf.set("includeNational", config.includeNational);
        conf.set("includeRegionalExpress", config.includeRegionalExpress);
        conf.set("includeRegional", config.includeRegional);
        conf.set("includeSuburban", config.includeSuburban);
        conf.set("includeBus", config.includeBus);
        conf.set("includeFerry", config.includeFerry);
        conf.set("includeSubway", config.includeSubway);
        conf.set("includeTram", config.includeTram);
        conf.set("includeTaxi", config.includeTaxi);

        var node = this;
        node.on('input', onInput);
    }
    RED.nodes.registerType("deutsche-bahn-stops", dbStopsNode);
}

async function onInput(msg, send, done) {
    handlePayload(msg.payload);

    let requestURL = `https://v6.db.transport.rest/stops/${conf.get("stopID")}/${conf.get("directionType")}?`;

    requestURL += `when=${encodeURIComponent(conf.get("when"))}`;

    if (conf.get("direction") !== "") {
        requestURL += `&direction=${conf.get("direction")}`;
    }
    requestURL += `&duration=${conf.get("duration")}`;
    requestURL += `&results=${conf.get("maxResults")}`;
    requestURL += `&language=${conf.get("language")}`;
    requestURL += `&nationalExpress=${conf.get("includeNationalExpress")}`;
    requestURL += `&national=${conf.get("includeNational")}`;
    requestURL += `&regionalExpress=${conf.get("includeRegionalExpress")}`;
    requestURL += `&regional=${conf.get("includeRegional")}`;
    requestURL += `&suburban=${conf.get("includeSuburban")}`;
    requestURL += `&bus=${conf.get("includeBus")}`;
    requestURL += `&ferry=${conf.get("includeFerry")}`;
    requestURL += `&subway=${conf.get("includeSubway")}`;
    requestURL += `&tram=${conf.get("includeTram")}`;
    requestURL += `&taxi=${conf.get("includeTaxi")}`;


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
        console.log(key);
        if (conf.has(key)) {
            conf.set(key, payload[key]);
        }
    })
}