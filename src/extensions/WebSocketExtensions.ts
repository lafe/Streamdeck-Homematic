interface WebSocket {
    sendJSON: (data: unknown, log?: boolean) => void;
}

// Create a wrapper to allow passing JSON to the socket
WebSocket.prototype.sendJSON = function (data: unknown, log?: boolean) {
    if (log) {
        console.log("SendJSON", this, data);
    }
    // if (this.readyState) {
    this.send(JSON.stringify(data));
    // }
};