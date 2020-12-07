
const APP = document.querySelector('#app');

const Gameboard = (() => {
    let _gameboard = [];

    const play = (sqId) => {
        let row = 'row' + sqId.substring(0,1).toUpperCase();
        let col = 'col' + sqId.substring(1);
        let type = Game.getCurrentPlayer();
        //need to set player turn state
        _gameboard.forEach((moves,idx) => {
            console.log(moves);
            if (moves.hasOwnProperty(type))
            {
                //console.log(moves[type])
                if (moves[type][row].indexOf(sqId) == -1)
                {
                    moves[type][row].push(sqId);
                    moves[type][col].push(sqId);
                    Display.setMarker(sqId,type);  
                    //console.log(_gameboard);                
                }
            }
        });
    }
    const checkWinner = (type) => {
        let win = false;
        var player = '';
        _gameboard.filter(moves => {
            if (moves.hasOwnProperty(type))
            {
                player = moves[type].name;
                //diagonal winner
                if (moves[type].rowB.indexOf('b1') != -1)
                {
                    win = (moves[type].rowA.indexOf('a0') != -1 && moves[type].rowC.indexOf('c2') != -1) ? true : (moves[type].rowA.indexOf('a2') != -1 && moves[type].rowC.indexOf('c0') != -1) ? true : false;
                }
                
                //horizontal winner
                Object.keys(moves[type]).map(key => {
                    if (key != 'name' && moves[type][key].length == 3)
                    {
                    win = true;
                    console.log(moves[type][key]);
                    }
                });
            }
        });
        if (win) alert(player + ' wins!');
    }
    const initPlayers = (players) => {
        Game.setCurrentPlayer(players.player1.type);
        Object.keys(players).forEach((key) => {
            //let k = players[key].name;
            let player = {};
            player[players[key].type] = {
                rowA: [],
                rowB: [],
                rowC: [],
                col0: [],
                col1: [],
                col2: [],
                name: players[key].name //move to different state / tracke
            };
            _gameboard.push(player);
        });
        console.log(_gameboard);
    }
    const resetBoard = () => {
        _gameboard = [];
        console.log(_gameboard);
        drawBoard();
    }
    const getGameboard = () => {
        return _gameboard;
    }
    const drawBoard = () => {
        document.querySelector('#gameboard').innerHTML = '';
        let x = 0; 
        while (x < 9)
        {
            let id = (x < 3) ? 'a' + x : (x < 6) ? 'b' + (x - 3) : 'c' + (x - 6);
            let box = createElemWithAttributes('div',{'id': id, 'class': 'box'});
            box.addEventListener('mouseup',(e) => {
                play(e.target.id);          
            });
            document.querySelector('#gameboard').append(box);
            x++;
        }
    }

    const render = (selector) => {
        console.log('building gameboard...');
        let gb = createElemWithAttributes('div', {'id': 'gameboard'});
        APP.append(gb);
        drawBoard();
    };
    return {
        render, getGameboard, resetBoard, initPlayers, checkWinner
    }
})();

const Player = (name,type) => {
    this.name = name;
    this.type = type;
    return { name, type }
}

const Display = ((selector) => {

    const setMarker = (id,marker) => {
        document.getElementById(id).innerHTML = marker;
        Game.setCurrentPlayer((marker == 'X') ? 'O' : 'X'); 
        Gameboard.checkWinner(marker);
    }
    /*///////////////////
    // MESSAGE DISPLAY
    ///////////////////*/
    const MessageDisplay = (() => {
        const disp = createElemWithAttributes('div', {'id': 'display'});
        disp.innerHTML = 'Enter Player 1\'s Name';
        const render = () => {
            console.log('building message display...');
            APP.append(disp);
        }
        return {
            render
        }
    })();

    /*///////////////////
    // PLAYER INPUTS
    ///////////////////*/
    const PlayerInput = (label) => {
        console.log('building label: ' + label + '...');
        let id = label.replace(' ','').toLowerCase();
        let lbl = createElemWithAttributes('label', {'for': id});
        lbl.innerHTML = label;
        let input = createElemWithAttributes('input', {'id': id, 'required': 'required'});
        //`<label for="${id}">${label}</label>: <input id="${id}" required />`;        
        APP.append(lbl,input);        
    };
    
    /*///////////////////
    // START / STOP BUTTON
    ///////////////////*/
    const Button = (() => {
        //create start button
        let btn = createElemWithAttributes('button', {'id': 'start', 'class': 'button'});
        btn.innerHTML = 'Start';
    
        //add listener
        btn.addEventListener('click', (e) => {
            let name = e.target.innerHTML.toLowerCase();
            if (name == 'start')
            {
                let p1Name = document.querySelector('#player1').value;
                let p2Name = document.querySelector('#player2').value;
                //create players, init _gameboard
                let player1 = Player(p1Name, 'X');
                let player2 = Player(p2Name,'O');
                Gameboard.initPlayers({player1,player2});
            }
            else
            {
                Gameboard.resetBoard();
                Game.setCurrentPlayer('X');
            }
            e.target.innerHTML = (name == 'start') ? 'Restart' : 'Start';
        });
        
        const render = () => {
            console.log('building start button...');
            APP.append(btn);
        }
        return {
            render
        }
    })();

    const render = () => {
        MessageDisplay.render();
        PlayerInput('Player 1');
        PlayerInput('Player 2');
        Button.render();
        Gameboard.render();
    }

    return {
        setMarker, render
    }
    
})('#app');

const Game = (() => {
    let _currentPlayer = '';
    const setCurrentPlayer = (type) => {
        _currentPlayer = type;
    }
    const getCurrentPlayer = () => {
        return _currentPlayer;
    }
    Display.render();
    return {
        setCurrentPlayer, getCurrentPlayer
    }
})();


function createElemWithAttributes(el, attrs) {
    let elem = document.createElement(el);
    for(var key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
    return elem;
  }
//document.querySelector('#app').

