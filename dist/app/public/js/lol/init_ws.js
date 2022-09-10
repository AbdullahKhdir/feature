$('textarea#game_events').css('display', 'none');$('textarea#game_events').css('display', 'none');

$( document ).ready(function() {
    $('.btn.blue.lighten-2').on('click', () => {
        $('form').submit();
        setTimeout(() => {
            $('textarea#game_events').css('display', 'none');$('textarea#game_events').css('display', 'block');
            (function () {
                const socket = new WebSocket('ws://localhost:9290');
                // Connection opened
                socket.addEventListener('open', (event) => {
                    console.log('socket opened!')
                });
            
                function gameEvents(content) {
                    let str = '';
                    const json = JSON.parse(content);
                    console.log(json.Events)
                    json.Events.forEach((element, index) => {
                        let keys = Object.keys(element);
                        if(keys.length > 0) {
                            keys.forEach(key => {
                                str = str + '\r\n' + `((-${index} ${key} = ${element[key]}))`;
                                if (element[key] === 'GameStart') {
                                    str = str + '\r\n' + `-${index} ####Game has started good luck :)####`;
                                } else if (element[key] === 'MinionsSpawning') {
                                    str = str + '\r\n' + `-${index} =====> Minions are on thier way <=====`;
                                } else if (element[key] === 'ChampionKill') {
                                    if (key === 'Assisters') {
                                        str = str + '\r\n' + `-${index} ${element['KillerName']} just sloughted ${element['VictimName']}`;
                                        str = str + '\r\n' + `-${index} Thanks for help to ${element['Assisters']}`;
                                    }
                                } else if (element[key] === 'FirstBlood') {
                                    str = str + '\r\n' + `-${index} ${element['Recipient']} just got first blood nice!`;
                                } else if (element[key] === 'Multikill') {
                                    let _kill_times = '';
                                    if (element[key] === 'KillStreak') {
                                        if (element['KillStreak'] === '2' || element['KillStreak'] === 2) {
                                            _kill_times = 'DOUBLE KILL'
                                        }
                                        if (element['KillStreak'] === '3' || element['KillStreak'] === 3) {
                                            _kill_times = 'TRIPPLE KILL'
                                        }
                                        if (element['KillStreak'] === '4' || element['KillStreak'] === 4) {
                                            _kill_times = 'QUADRA KILL'
                                        }
                                        if (element['KillStreak'] === '5' || element['KillStreak'] === 5) {
                                            _kill_times = 'PENTA KILL'
                                        }
                                    }
                                    str = str + '\r\n' + `-${index} ${element['KillerName']} got ${_kill_times}, wow!`;
                                }
                            });
                        }
                    });
                    $("#game_events").val(str);
                }
                
                socket.addEventListener('message', (event) => {
                    gameEvents(event.data)  
                })
            })();
        }, 3000);
        $('.wrapper').remove();
    });
    // $( document ).ready(function() {
        // $.ajax({
        //     url: "https://localhost:8010/cors/",
        //     type: 'GET',
        //     dataType: 'json', // added data type
        //     async: true,
        //     success: function(res) {
        //         console.log(res);
        //         alert(JSON.stringify(res));
        //     }
        // });
    // });
});