
const APP = document.querySelector('#app');
let isMuted = true;

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

/*///////////////
// DISPLAY COMPONENTS
///////////////*/
const Display = ((selector) => {
    /*/////////////////
    // SOUND OPT
    ///////////////*/
    const SoundOptions = (() => {
        const soundUI = createElemWithAttributes('div',{id: 'sounds'});
        const speaker = createElemWithAttributes('img',{src: 'img/muted.png', alt: 'Speaker by Dileep M from the Noun Project'});        
        let sounds = document.querySelectorAll('audio');

        const mute = () => {
            console.log('mute');
            isMuted = true;
            document.querySelector('#sounds img').setAttribute('src','img/muted.png');
            [...sounds].filter((audio) => {
                console.log(audio);
                audio.muted = true;
            });
        };

        const unmute = () => {
            console.log('unmute');
            isMuted = false;
            document.querySelector('#sounds img').setAttribute('src','img/speaker.png');
            [...sounds].filter((audio) => {
               // audio.removeAttribute('muted');
               audio.muted = false;
            });
        }

        const render = () => {
            APP.append(soundUI);
            document.querySelector('#sounds').append(speaker);
            mute();
            document.querySelector('#sounds img').addEventListener('click', () => {
                console.log('sound clicked');
                //let icon = document.querySelector('#sounds img');
                //turn sound on / off
                if (isMuted) 
                {                    
                    let theme = document.querySelector('#mktheme');
                    if (theme.paused) theme.play();
                    unmute();
                }
                else
                {                    
                    mute();
                }                   
            });
        }
        return {
            render, mute
        }
    })();


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
    // STATUS DISPLAY
    ///////////////////*/
    const StatusDisplay = (() => {
        const startMsg = 'Round 1: Fight!';
        const disp = createElemWithAttributes('div', {'id': 'status'});
        const text = createElemWithAttributes('span');
        const updateMsg = (msg = startMsg) => {
            document.querySelector('#status span').innerHTML = msg;            
        }
        const showMsg = () => {
            document.querySelector('#status').classList = 'show';
            
        };

        const render = () => {
            console.log('building status display...');
            APP.append(disp);
            document.querySelector('#status').append(text);
            document.querySelector('#status').addEventListener('transitionend',() => {
                setTimeout(() => {
                    document.querySelector('#status').classList = '';
                },1000);
            });
            updateMsg();
        }
        return {
            render, updateMsg, showMsg
        }
    })();

    /*///////////////////
    // PLAYER INPUTS
    ///////////////////*/
    const PlayerInput = (() => {
        const validatePlayers = () => {
            let players = ['Player 1', 'Player 2'];
            
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
                    el.value = 'Player ' + i+1;
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
                input.value = 'Player ' + (i+1);       
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
    //FATALITIES
    const Fatality = (type,marker) => {
        let boxAnim = createElemWithAttributes('div', {'class': 'finisher'});
        switch (type)
        {
            case 1:
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
    //LIGHTS
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
    //TOASTY
    const Toasty = (() => {
        let toasty = createElemWithAttributes('div',{id: 'toastied'});        
        let boon = createElemWithAttributes('img', {id: 'ed-boon', src: 'img/toasty.png'});
        
        const popup = () => {
            document.querySelector('#toastied').classList = 'pop';            
        }

        const render = () => {
            document.querySelector('#app').append(toasty);
            let tst = document.querySelector('#toastied');
            tst.append(boon);
            tst.addEventListener('animationend',() => {
                tst.classList = '';
            });
        }
        return {
            render,popup
        }
    })();

    const render = () => {
        SoundOptions.render();
        StatusDisplay.render();
        MessageDisplay.render();
        PlayerInput.render(['Player 1','Player 2']);
        //PlayerInput.render('Player 2');
        Button.render();
        Gameboard.render();
        Toasty.render();
        document.querySelector('h1 span').classList = 'show';
    }

    return {
        render, MessageDisplay, PlayerInput, Fatality, Lights, Toasty, StatusDisplay
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
                    if (Math.random()*10 < 2)
                    {
                        let sound = document.getElementById(moves[idx]);
                        console.log('toasty!');
                        sound.addEventListener('ended', toasty);
                        setTimeout(function(){sound.removeEventListener('ended',toasty)},2000);
                    }
                    document.getElementById(moves[idx]).play();
                    break;
                case 'round1':
                    document.getElementById('rd1').play(); 
                    break;
                case 'round2':
                    document.getElementById('rd2').play(); 
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
                   // resetSound('mktheme');
                    document.getElementById('fatality').play(); 
                    break;
                    default:
            }
        }, delay);
    }
    const toasty = () => {
        document.getElementById('toasty').play();
        Display.Toasty.popup();
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
            Soundeffect.playSound('fatality',1750);
                
    }

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
    let _Winners = []; 
    var _FinishKeys = [];    
    let _BleedId;
    
    const setCurrentPlayer = () => {
        _Players.currentPlayer = (_Players.currentPlayer == _Players.p1) ? _Players.p2 : _Players.p1;
        Display.MessageDisplay.updateMsg(_Players.currentPlayer.name + "'s move."); 
    }
    const getCurrentPlayer = () => {
        return _Players.currentPlayer;
    }
    const setWinner = (result) =>{
        _Winners.push(result);
    }
    const getWinners = () => {
        return _Winners;
    }
    const startGame = () => {
        
        if (_Winners.length == 2) _Winners = [];
        _FinishKeys = [];
        let names = Display.PlayerInput.validatePlayers();
        _Players.p1 = Player(names[0],'X');
        _Players.p2 = Player(names[1],'O');
        _Players.currentPlayer = _Players.p1;
        Display.MessageDisplay.updateMsg(names[0] + "'s move.");
        
        let rd = (_Winners.length == 0) ? '1' : '2';
        document.querySelector('#rd' + rd).addEventListener('play', () => {
            document.querySelector('#gameboard').classList = ''; 
        })        
        Soundeffect.playSound('round' + rd);
        Display.StatusDisplay.updateMsg('Round ' + rd + ': Fight!');
        Display.StatusDisplay.showMsg();
        _GameOver = false;

        console.log('winners: ' + _Winners);
    }
    const play = (id) => {
        let type = _Players.currentPlayer.type;
        if(Gameboard.updateBoard(id,type))
        {
            document.getElementById(id).innerHTML = `<div class="marker"><span>${type}</span></div>`;
            Soundeffect.playSound('move');
            checkWinner();
            if (!_GameOver) setCurrentPlayer();
        }
    }

    const isFinishingMove = () => {
        let gb = Gameboard.getGameboard();
        let finish = false;
        //move to top
        let oppType = _Players.currentPlayer.type;//(_Players.currentPlayer.type == 'X') ? 'O' : 'X';
       console.log('isFinishing: ' + _FinishKeys);
            //one second to enter commands
            
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
                        finish = true;
                        break;
                    default:
                }
                window.removeEventListener("keydown", captureKeys, false);
                return finish;
            //}, 1000);
        
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
            let winner = (_Players.currentPlayer === _Players.p1) ? 'p1' : 'p2';
            _Winners.push(winner);
            window.addEventListener("keydown", captureKeys, false);
            Display.MessageDisplay.updateMsg(_Players.currentPlayer.name + ' wins!');
            Soundeffect.playSound('finish',250);
            setTimeout(function() {
                console.log('what round? ' + _Winners.length);
                if (isFinishingMove() && _Winners.length < 3)
                {

                           document.getElementById('fatality').addEventListener('ended', () => {
                            _FinishKeys = [];
                            Gameboard.resetBoard();
                            startGame();
                           }); 
                        }
                else
                {
                    _GameOver = true;
                }
                
            }, 1000);
            
        }
        else if (movesCt >= 9)
        {
            _Winners.push('tie');
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
        //document.getElementById('mktheme').pause();
        //document.getElementById('mktheme').currentTime = 0;
    }
    Display.render();
    //Soundeffect.playSound('theme');
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
 

//fix the lights after fatality
//typography
//auto round 2 on tie
//round 3?
//babality?
//ai?