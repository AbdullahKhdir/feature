"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var Websockets = /** @class */ (function () {
    function Websockets() {
    }
    Websockets.getIoInstance = function (httpServer) {
        if (!Websockets.io) {
            Websockets.io = new socket_io_1.Server(httpServer, { cors: Websockets.CORS });
        }
        return Websockets.io;
    };
    Websockets.getClassInstance = function () {
        if (!Websockets.class) {
            Websockets.class = new Websockets();
        }
        return Websockets.class;
    };
    Websockets.run = function (req) {
        var _a, _b;
        Websockets.io = null;
        // @ts-ignore
        Websockets.io = Websockets.getIoInstance(req.socket.server);
        var CURRENT_LOGGED_IN_USER = (_b = (_a = req === null || req === void 0 ? void 0 : req.getCurrentUser()) === null || _a === void 0 ? void 0 : _a.first_name) !== null && _b !== void 0 ? _b : 'Unknown';
        //***************************\\
        //*Run when client connects *\\
        //***************************\\
        Websockets.io.on('connection', function (_socket) {
            //*************************************************************\\
            //*Run when client connects                                   *\\
            //*Will emit to a single user or client that is connecting    *\\
            //*Welcome current user                                       *\\
            //*************************************************************\\
            var _welcome_client = {};
            _welcome_client = { action: 'welcome', message: "".concat(CURRENT_LOGGED_IN_USER, " Welcome to the chat bot!"), user: CURRENT_LOGGED_IN_USER };
            _socket.emit('welcome', _welcome_client);
            _welcome_client = {};
            //*************************************************************\\
            //*Broadcast when client connects                             *\\
            //*Will emit to every user except the user that is connecting *\\
            //*The connected user WILL NOT BE NOTIFIED                    *\\
            //*That other users are connecting                            *\\
            //*************************************************************\\
            var _client_connecting = {};
            _client_connecting = { action: 'joinNotification', message: "".concat(CURRENT_LOGGED_IN_USER, " has joined the chat!"), user: CURRENT_LOGGED_IN_USER };
            _socket.broadcast.emit('joinNotification', _client_connecting);
            _client_connecting = {};
            //***************************************************************\\
            //! BROADCAST EVERY SINGLE USER AND CLIENT                      !\\
            //*Will emit to every single user and client that is connecting *\\
            //***************************************************************\\
            // let _broadcast = {};
            // _broadcast = {action: 'broadcast', message: 'ATTENTION EVERY BODY!!, THIS IS A TEST BROADCAST!', user: CURRENT_LOGGED_IN_USER};
            // Websockets.io.emit('broadcast', _broadcast);
            // _broadcast = {};
            //******************************\\
            //*Run when client disconnects *\\
            //******************************\\
            _socket.on('disconnect', function () {
                var _notify = {};
                _notify = { action: 'disconnection', message: "".concat(CURRENT_LOGGED_IN_USER, " has left the chat!"), user: CURRENT_LOGGED_IN_USER };
                Websockets.io.emit('bye', _notify);
                // _socket.disconnect();
                // Websockets.io.close();
            });
            //******************************\\
            //*Listen for a chat message   *\\
            //******************************\\
            _socket.on('chatMessage', function (message) {
                Websockets.io.emit('message', { action: 'chatting', message: message, user: CURRENT_LOGGED_IN_USER });
            });
        });
    };
    Websockets.prototype.initializeHandlers = function (socketHandlers) {
        socketHandlers.forEach(function (element) {
            var namespace = Websockets.io.of(element.path, function (socket) {
                element.handler.handleConnection(socket);
            });
            if (element.handler.middlewareImplementation) {
                namespace.use(element.handler.middlewareImplementation);
            }
        });
    };
    Websockets.CORS = {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    };
    return Websockets;
}());
exports.default = Websockets;
