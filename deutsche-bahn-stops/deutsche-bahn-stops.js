module.exports = function(RED) {
    function dbStopsNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
    }
    RED.nodes.registerType("lower-case",dbStopsNode);
}
