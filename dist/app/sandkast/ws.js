const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({port: 9290});

wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.send('Game Started');
    // setInterval(() => {
    // }, 1000);
});


// const interval = setInterval(function ping() {
//     wss.clients.forEach(function each(ws) {
//         if (ws.isAlive === false) return ws.terminate();
    
//         ws.isAlive = false;
//         ws.ping();
//     });
// }, 30000);
    
// wss.on('close', function close() {
//     clearInterval(interval);
// });