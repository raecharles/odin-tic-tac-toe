
const APP = document.querySelector('#app');

const Gameboard = (() => {
    
    //why the extra parenthesis w/ arrow function?
    //The issue with the arrow function is that the parser doesn't interpret the two braces as an object literal, but as a block statement.
    //The magic parentheses force the parser to treat the object literal as an expression instead of a block statement.
    const defaultBoard = () => ({
            X: { rowA: [], rowB: [], rowC: [], col0: [], col1: [], col2: [], diagUp: [], diagDn: [] },
            O: { rowA: [], rowB: [], rowC: [], col0: [], col1: [], col2: [], diagUp: [], diagDn: []  }
        });

    let _gameboard = defaultBoard();

    const updateBoard = (sqId,type) => {
        let row = 'row' + sqId.substring(0,1).toUpperCase();
        let col = 'col' + sqId.substring(1);

        if (_gameboard.X[row].indexOf(sqId) == -1 && _gameboard.O[row].indexOf(sqId) == -1)
        {
            _gameboard[type][row].push(sqId);
            _gameboard[type][col].push(sqId);
            if (sqId == 'b1')
            {
                _gameboard[type]['diagUp'].push(sqId);
                _gameboard[type]['diagDn'].push(sqId);
            }
            else if (sqId == 'a0' || sqId == 'c2')
            {
                _gameboard[type]['diagDn'].push(sqId);
            } 
            else if (sqId == 'c0' || sqId == 'a2')
            {
                _gameboard[type]['diagUp'].push(sqId);
            }
            console.log(_gameboard); 
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
    const Fatality = (type,marker) => {
        let boxAnim = createElemWithAttributes('div', {'class': 'finisher'});
        switch (type)
        {
            case 1:
                /*boxAnim.innerHTML = `<svg width="100%" height="10">
                <defs>
                    <pattern id="spikes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <polygon points="0,0 10,0 5,10" style="fill:black;"></polygon>
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="10" fill="url(#spikes)"></rect>
            </svg>`;*/
            console.log(marker);
            boxAnim.innerHTML = `<div class="squasher">
            <div class="markType col">${marker.repeat(50)};</div>    
            <div class="markType">${marker.repeat(20)};</div>
                <div class="markType">${marker.repeat(20)};</div>
                <span class="bloodLt">blood</span>
                <span class="bloodRt">blood</span>
            </div>
            `;
                break;
            default:
        }
        return boxAnim;
    };

    const Lights = (() => {
        let lights = document.querySelector('#lights');
        const on = () => {
            lights.classList.remove('off');
        }
        const off = () => {
            lights.classList.add('off');
        }
        return {
            on, off
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
        render, MessageDisplay, PlayerInput, Fatality, Lights
    }
    
})('#app');

/*////////////
// PLAY SOUNDS
////////////*/
const Soundeffect = (() => {
    let moves = ['se1','se2','se3','getOver'];
    const playSound = (type, delay = 0) => {
        setTimeout(function(){
            switch (type)
            {
                case 'move':
                    let idx = Math.floor(Math.random()*moves.length);
                    console.log(idx);
                    document.getElementById(moves[idx]).play();
                    if (Math.random()*10 < 2)
                    {
                        document.getElementById('toasty').play();
                    }
                    break;
                case 'round1':
                    /*document.getElementById('rd1').addEventListener('ended', () => {
                        document.getElementById('mktheme').play();
                        document.getElementById('mktheme').setAttribute('loop','loop');
                    });*/
                    document.getElementById('rd1').play(); //callback - wait for audio to finish
                    break;
                case 'finish':
                    /*document.getElementById('finish').addEventListener('ended', () => {
                        Game.isFinishingMove();
                    });*/
                    document.getElementById('finish').play();
                    break;
                case 'theme':
                    document.getElementById('mktheme').play();
                    break;
                case 'fatality':
                    resetSound('mktheme');
                    document.getElementById('fatality').play(); 
                    break;
                    default:
            }
        }, delay);
    }
    const resetSound = (id) => {
        let audio = document.getElementById(id);
        audio.pause();
        audio.currentTime = 0;
    }

    return {
        playSound
    }
})();

const FinishingMoves = (() => {
          
    const Fatality1 = function(oppType) {            
        let gb = Gameboard.getGameboard();
        let ids = [].concat(gb[oppType].col0,gb[oppType].col1,gb[oppType].col2);
        console.log(ids);
            ids.filter(id => {
                let ft = Display.Fatality(1,Game.getCurrentPlayer().type);
                document.getElementById(id).prepend(ft);
                let anim = document.querySelectorAll('.finisher');
                let markers = document.querySelectorAll('#' + id + ' .marker span');
                let bloods = document.querySelectorAll('#' + id + ' .squasher span');
                //let bloodRt = document.querySelectorAll('#' + id + ' .bloodRt');
                for (const finish of anim)
                {
                    finish.addEventListener('transitionend', () => {
                        finish.classList.add('stage2');
                        for (const marker of markers)
                        {
                            marker.classList.add('fatal');
                        }
                        for (const blood of bloods)
                        {
                            blood.classList.add('bleed');
                        }            
                    });
                    setTimeout(function(){
                        finish.classList.add('fatal');                                
                    },100);
                }
                
            }); 
            Soundeffect.playSound('fatality',1500);
                
    }
        /*let keys = _FinishKeys.join();
        console.log(keys);
        switch (keys)
        {
            case 'f': 
                                                                                 
                break;
            default:
        }*/
    return {
        Fatality1
    }
})();

/*/////////////
// MAIN GAME
/////////////*/
const Game = (() => {
    let _Players = {};
    let _GameOver = false;
    //let _Finish = false;  
    var _FinishKeys = [];

    const setCurrentPlayer = () => {
        _Players.currentPlayer = (_Players.currentPlayer == _Players.p1) ? _Players.p2 : _Players.p1;
        Display.MessageDisplay.updateMsg(_Players.currentPlayer.name + "'s move."); 
    }
    const getCurrentPlayer = () => {
        return _Players.currentPlayer;
    }
    const startGame = () => {
        _FinishKeys = [];
        let names = Display.PlayerInput.validatePlayers();
        _Players.p1 = Player(names[0],'X');
        _Players.p2 = Player(names[1],'O');
        _Players.currentPlayer = _Players.p1;
        Display.MessageDisplay.updateMsg(names[0] + "'s move.");
        document.querySelector('#rd1').addEventListener('ended', () => {
            document.querySelector('#gameboard').classList = '';
            document.getElementById('mktheme').play();
            document.getElementById('mktheme').setAttribute('loop','loop');
        })        
        Soundeffect.playSound('round1');
        _GameOver = false;
    }
    const play = (id) => {
        let type = _Players.currentPlayer.type;
        if(Gameboard.updateBoard(id,type))
        {
            document.getElementById(id).innerHTML = `<div class="marker"><span>${type}</span></div>`;
            Soundeffect.playSound('move');
            checkWinner();
            if (!_GameOver) setCurrentPlayer();
            /*if (_Finish) {
                setTimeout(function() {
                    Soundeffect.playSound('finish')
                },1000);                
                _Finish = false;
            }*/
        }
    }

    const isFinishingMove = () => {
        let gb = Gameboard.getGameboard();
        //move to top
        let oppType = (_Players.currentPlayer.type == 'X') ? 'O' : 'X';
       console.log('isFinishing: ' + _FinishKeys);
            //one second to enter commands
            setTimeout(function() {
                console.log(_FinishKeys);
                let keys = _FinishKeys.join();
                console.log(keys);
                switch (keys)
                {
                    case 'f': 
                        Display.Lights.off();
                        setTimeout(function() {
                            FinishingMoves.Fatality1(oppType);                                                     
                        },1500);
                        setTimeout(function() {
                            Display.Lights.on();
                        },5000);
                        break;
                    default:
                }
                window.removeEventListener("keydown", captureKeys, false);
            }, 1000);
        
    }

    const checkWinner = () => {
        let win = false;
        //let player = _Players.currentPlayer;
        let type = _Players.currentPlayer.type;
        let gb = Gameboard.getGameboard();
        let movesCt = 0;
        
        //winner / tie counter
        Object.keys(gb).filter((key) => {
           //key: X, O
            Object.keys(gb[key]).map(gridKey => {  
                //gridKey: movesObj              
                if (gridKey != 'name')
                {
                    let ct = gb[key][gridKey].length;                           
                    movesCt += (gridKey.indexOf('col') != -1) ? ct : 0;
                    console.log('moves ct: ' + movesCt);
                    if (ct == 3)
                    {
                        win = true;
                        highlight(gb[key][gridKey]);                   
                    }
                }                            
            });
        });
        
        if (win) 
        {
            _FinishKeys = [];
            window.addEventListener("keydown", captureKeys, false);
            console.log('winner: ' + _FinishKeys);
            isFinishingMove();
            Display.MessageDisplay.updateMsg(_Players.currentPlayer.name + ' wins!');
            Soundeffect.playSound('finish',250);
            _GameOver = true;
        }
        else if (movesCt >= 9)
        {
            Display.MessageDisplay.updateMsg('Tie game!');
            _GameOver = true;
        }
        if (_GameOver)
        {
            document.querySelector('#gameboard').classList = 'gameOver';
            _FinishKeys = [];
            
        }
    }
    const captureKeys = (e) => {
        _FinishKeys.push(e.key);
    }   
    const highlight = (ids) => {
        let timing = 100;
        ids.filter(id => {
            setTimeout(function(){
                document.getElementById(id).classList.add('highlight');  
            }, timing);
            timing += 100;
        });
    }
    const resetGame = () => {
        _FinishKeys = [];
        Gameboard.resetBoard();
        Display.MessageDisplay.updateMsg();
        document.getElementById('mktheme').pause();
        document.getElementById('mktheme').currentTime = 0;
    }
    Display.render();
    return {
        startGame, setCurrentPlayer, getCurrentPlayer, checkWinner,  play, resetGame, isFinishingMove
    }
})();

function createElemWithAttributes(el, attrs) {
    let elem = document.createElement(el);
    for(var key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
    return elem;
  }
 

