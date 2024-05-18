module.exports = function(RED) {
    function dbTripsNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("lower-case",dbTripsNode);
}