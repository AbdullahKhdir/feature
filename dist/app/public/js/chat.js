$.getScript('/plugins/socket-io/socket-io.js', () => {
    // var socket = io("https://localhost:8010/chat");
    var socket = io();
    
    socket.on('message', (notification) => {
        const {action, message, user} = notification;
        if (action === 'chatting') {
            //**********************************\\
            //* Outputting the message         *\\
            //**********************************\\
            return outputMessage(message);
        }
    });

    socket.on('welcome', (notification) => {
        const {action, message, user} = notification;
        if (action === 'welcome') {
            return M.toast({html: message, classes: 'rounded _information'});
        }
    })

    socket.on('bye', (notification) => {
        const {action, message, user} = notification;
        if (action === 'disconnection') {
            return outputMessage(message);
        }
    })
    
    socket.on('joinNotification', (notification) => {
        const {action, message, user} = notification;
        if (action === 'joinNotification') {
            return outputMessage(message);
        }
    })

    // socket.on('ping', (notification) => {
    //     alert(notification);
    // });

    // socket.on('connect', (notification) => {
    // });

    // socket.on('disconnect', (notification) => {
    // });
    
    // socket.on('broadcast', (broadcast_message) => {
    //     const {action, message, user} = broadcast_message;
    //     broadcast_message = {};
    // });
    
    //************************************\\
    //*Message on submit using ENTER-Key *\\
    //************************************\\
    $('textarea#textarea1').keypress(function (e) {
        var key         = e.which;
        const ENTER_KEY = 13;
    
        if (key == ENTER_KEY) {
            e.preventDefault();
            $('#chat-form').submit();
        }
    });
    
    //**********************************\\
    //*Message on submit               *\\
    //**********************************\\
    $(document).on('submit', '#chat-form', (e) => {
        e.preventDefault();
        //* Getting the message *\\
        const message = $('textarea#textarea1').val();
        
        //* Checking the message *\\
        if (message) {
            //* Resetting the textarea's text *\\
            $('textarea#textarea1').val('');
            //**********************************\\
            //*Emitting message to the server  *\\
            //**********************************\\
            socket.emit('chatMessage', message);
        }                 
    });


})
function outputMessage(message) {
    //* Working on rendering the message *\\
    var div = document.createElement('div');
    div.classList.add('chat-message');
    div.innerHTML = `
        <img class="circle" src="/materialize/img/2022_10_14_13_46_defaultImage.jpeg" alt="avatar">
        ${message}
    `;
    
    $('.chat-wrapper').append(div);

    //* Scroll to the last when the message is rendered *\\
    window.scrollTo(0, document.body.scrollHeight);
}

