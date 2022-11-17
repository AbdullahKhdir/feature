import { Request } from 'express';
import { Server, Socket } from 'socket.io';

class Websockets {

    private static io: any;
    private static class: Websockets;
    private static CORS: {origin: string; methods: Array<string>} = {
        origin: "*",
        methods: ["GET", "POST", "PATCH"]
    };
    private constructor() {
    }

    public static getIoInstance(httpServer?: any) {
        if (!Websockets.io) {
            Websockets.io = new Server(httpServer, {cors: Websockets.CORS});
        }
        return Websockets.io;
    }
    
    public static getClassInstance(): Websockets {
        if (!Websockets.class) {
            Websockets.class = new Websockets();
        }
        return Websockets.class;
    }

    public static run(req: Request) {
        Websockets.io = null;
        // @ts-ignore
        Websockets.io = Websockets.getIoInstance(req.socket.server);
        
        const CURRENT_LOGGED_IN_USER: string = req?.getCurrentUser()?.first_name ?? 'Unknown';
        
        //***************************\\
        //*Run when client connects *\\
        //***************************\\
        Websockets.io.on('connection', (_socket: any) => {
            //*************************************************************\\
            //*Run when client connects                                   *\\
            //*Will emit to a single user or client that is connecting    *\\
            //*Welcome current user                                       *\\
            //*************************************************************\\
            let _welcome_client = {};
            _welcome_client = {action: 'welcome', message: `${CURRENT_LOGGED_IN_USER} Welcome to the chat bot!`, user: CURRENT_LOGGED_IN_USER};
            _socket.emit('welcome', _welcome_client);
            _welcome_client = {};
    
            //*************************************************************\\
            //*Broadcast when client connects                             *\\
            //*Will emit to every user except the user that is connecting *\\
            //*The connected user WILL NOT BE NOTIFIED                    *\\
            //*That other users are connecting                            *\\
            //*************************************************************\\
            let _client_connecting = {};
            _client_connecting = {action: 'joinNotification', message: `${CURRENT_LOGGED_IN_USER} has joined the chat!`, user: CURRENT_LOGGED_IN_USER};
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
            _socket.on('disconnect', () => {
                let _notify = {};
                _notify = {action: 'disconnection', message: `${CURRENT_LOGGED_IN_USER} has left the chat!`, user: CURRENT_LOGGED_IN_USER};
                Websockets.io.emit('bye', _notify);
                // _socket.disconnect();
                // Websockets.io.close();
            });
    
            //******************************\\
            //*Listen for a chat message   *\\
            //******************************\\
            _socket.on('chatMessage', (message: any) => {
                Websockets.io.emit('message', {action: 'chatting', message: message, user: CURRENT_LOGGED_IN_USER});
            })
        });
    }

    public initializeHandlers(socketHandlers: Array<any>) {
        socketHandlers.forEach(element => {
            let namespace = Websockets.io.of(element.path, (socket: Socket) => {
                element.handler.handleConnection(socket);
            });
 
            if (element.handler.middlewareImplementation) {
                namespace.use(element.handler.middlewareImplementation);
            }
        });
    }
}

export default Websockets;