
const APP = document.querySelector('#app');

const Gameboard = (() => {
    let _gameboard = 
        {
            X:
            {rowA: [],
            rowB: [],
            rowC: [],
            col0: [],
            col1: [],
            col2: []}
        ,
            O: {rowA: [],
            rowB: [],
            rowC: [],
            col0: [],
            col1: [],
            col2: []}
        };

    const updateBoard = (sqId,type) => {
        let row = 'row' + sqId.substring(0,1).toUpperCase();
        let col = 'col' + sqId.substring(1);

        if (_gameboard.X[row].indexOf(sqId) == -1 && _gameboard.O[row].indexOf(sqId) == -1)
        {
            _gameboard[type][row].push(sqId);
            _gameboard[type][col].push(sqId);        
            return true;
        }
        return false;
    }
    const resetBoard = () => {
        _gameboard = {
            X: {rowA: [],
            rowB: [],
            rowC: [],
            col0: [],
            col1: [],
            col2: []}
        ,
        
            O: {rowA: [],
            rowB: [],
            rowC: [],
            col0: [],
            col1: [],
            col2: []}
        };
        console.log(_gameboard);
        drawBoard();
        document.querySelector('#display').innerHTML = 'Enter Names.';
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
                /*let player = Game.getCurrentPlayer();
                updateBoard(e.target.id,player.type);          */
                Game.play(e.target.id);
            });
            document.querySelector('#gameboard').append(box);
            x++;
        }
    }

    const render = (selector) => {
        console.log('building gameboard...');
        let gb = createElemWithAttributes('div', {'id': 'gameboard', 'class': 'gameOver'});
        APP.append(gb);
        drawBoard();
    };
    return {
        render, getGameboard, updateBoard, resetBoard
    }
})();

const Player = (name,type) => {
    this.name = name;
    this.type = type;
    return { name, type }
}

const Display = ((selector) => {

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
                Game.startGame();                
            }
            else
            {
                /*Gameboard.resetBoard();
                Game.setCurrentPlayer();*/
                Game.resetGame();
            }
            //document.querySelector('#gameboard').classList = '';
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
        render
    }
    
})('#app');

const Game = (() => {
    let _Players = {};
    let _GameOver = false;
    const setCurrentPlayer = () => {
        _Players.currentPlayer = (_Players.currentPlayer == _Players.p1) ? _Players.p2 : _Players.p1;
        document.querySelector('#display').innerHTML = _Players.currentPlayer.name + "'s move."; 
    }
    const getCurrentPlayer = () => {
        return _Players.currentPlayer;
    }
    const setMarker = (id,marker) => {
        document.getElementById(id).innerHTML = marker;
        Game.checkWinner();
        Game.setPlayers(); 
    }
    const startGame = () => {
        let p1Name = document.querySelector('#player1').value;
        let p2Name = document.querySelector('#player2').value;
        _Players.p1 = Player(p1Name,'X');
        _Players.p2 = Player(p2Name,'O');
        _Players.currentPlayer = _Players.p1;
        document.querySelector('#display').innerHTML = p1Name + "'s move."; 
        document.querySelector('#gameboard').classList = '';
        _GameOver = false;
    }
    const play = (id) => {
        let type = _Players.currentPlayer.type;
        if(Gameboard.updateBoard(id,type))
        {
            document.getElementById(id).innerHTML = type;
            checkWinner();
            if (!_GameOver) setCurrentPlayer(); 
        }
    }
    const checkWinner = () => {
        let win = false;
        let player = _Players.currentPlayer;
        let type = player.type;
        let gb = Gameboard.getGameboard();
        let moves = 0;
        
        //diag winner
        if (gb[type].rowB.indexOf('b1') != -1)
        {
            if (gb[type].rowA.indexOf('a0') != -1 && gb[type].rowC.indexOf('c2') != -1) 
            {
                win = true;
                highlight(['a0','b1','c2']);
            }
            else if (gb[type].rowA.indexOf('a2') != -1 && gb[type].rowC.indexOf('c0') != -1) 
            {
                win = true;
                highlight(['a2','b1','c0']);
            }
        }
        
        //hor & vert winner
        Object.keys(gb[type]).map(key => {
            if (key != 'name')
            {
                let ct = gb[type][key].length;
                moves += ct;
                if (ct == 3)
                {
                    win = true;
                    highlight(gb[type][key]);
                }
            }
        });
        
        if (win) 
        {
            document.querySelector('#display').innerHTML = player.name + ' wins!';
            _GameOver = true;
        }
        else if (moves > 9)
        {
            document.querySelector('#display').innerHTML = 'Tie game!';
            _GameOver = true;
        }
        if (_GameOver)
        {
            document.querySelector('#gameboard').classList = 'gameOver';
        }
    }
    const highlight = (ids) => {
        let timing = 400;
        ids.filter(id => {
            setTimeout(function(){
                document.getElementById(id).classList.add('highlight');  
            }, timing);
            timing += 400;
        });
    }
    const resetGame = () => {
        Gameboard.resetBoard();
        setCurrentPlayer();
    }
    Display.render();
    return {
        startGame, setCurrentPlayer, getCurrentPlayer, checkWinner,  play, resetGame
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

