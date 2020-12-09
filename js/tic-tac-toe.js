
const APP = document.querySelector('#app');

const Gameboard = (() => {
    
    //why the extra parenthesis w/ arrow function?
    //The issue with the arrow function is that the parser doesn't interpret the two braces as an object literal, but as a block statement.
    //The magic parentheses force the parser to treat the object literal as an expression instead of a block statement.
    const defaultBoard = () => ({
            X: { rowA: [], rowB: [], rowC: [], col0: [], col1: [], col2: [] },
            O: { rowA: [], rowB: [], rowC: [], col0: [], col1: [], col2: [] }
        });

    let _gameboard = defaultBoard();

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
        _gameboard = defaultBoard();
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
        const startMsg = 'Enter name(s) and press start to play.';
        const disp = createElemWithAttributes('div', {'id': 'display'});
        const updateMsg = (msg = startMsg) => {
            document.querySelector('#display').innerHTML = msg;
        }
        const render = () => {
            console.log('building message display...');
            APP.append(disp);
            updateMsg();
        }
        return {
            render, updateMsg
        }
    })();

    /*///////////////////
    // PLAYER INPUTS
    ///////////////////*/
    const PlayerInput = (() => {
        const validatePlayers = () => {
            let players = ['CPU', 'CPU'];
            
            for (let i = 0; i < 2; i++)
            {
                let id = '#player' + (i+1);
                let el = document.querySelector(id);
                if (el.value.trim() != '') 
                {
                    players[i] = document.querySelector(id).value.trim();                    
                }
                else
                {
                    el.value = 'CPU';
                }
            }
            return players; 
        };
 
        const render = (players) => {
            console.log('building players inputs...');
            let div = createElemWithAttributes('div', {'id': 'players'});
            APP.append(div);

            for (let i = 0; i < players.length; i++)
            {
                let id = players[i].replace(' ','').toLowerCase();
                let lbl = createElemWithAttributes('label', {'for': id, 'id': 'label-' + id});
                lbl.innerHTML = players[i] + ': ';
                document.querySelector('#players').append(lbl);
                let input = createElemWithAttributes('input', {'id': id});
                input.value = 'CPU';       
                document.querySelector('#label-' + id).append(input);
            }   

        }
        return {
            render, validatePlayers
        }  
    })();
    
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
                Game.resetGame();
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
        PlayerInput.render(['Player 1','Player 2']);
        //PlayerInput.render('Player 2');
        Button.render();
        Gameboard.render();
    }

    return {
        render, MessageDisplay, PlayerInput
    }
    
})('#app');

const Game = (() => {
    let _Players = {};
    let _GameOver = false;
    const setCurrentPlayer = () => {
        _Players.currentPlayer = (_Players.currentPlayer == _Players.p1) ? _Players.p2 : _Players.p1;
        Display.MessageDisplay.updateMsg(_Players.currentPlayer.name + "'s move."); 
    }
    const getCurrentPlayer = () => {
        return _Players.currentPlayer;
    }
    const startGame = () => {
        let names = Display.PlayerInput.validatePlayers();
        _Players.p1 = Player(names[0],'X');
        _Players.p2 = Player(names[1],'O');
        _Players.currentPlayer = _Players.p1;
        Display.MessageDisplay.updateMsg(names[0] + "'s move.");
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
            Display.MessageDisplay.updateMsg(player.name + ' wins!');
            _GameOver = true;
        }
        else if (moves > 9)
        {
            Display.MessageDisplay.updateMsg('Tie game!');
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
        Display.MessageDisplay.updateMsg();
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
 

