import {Display,Gameboard} from "./Display.js";
import {Soundeffect} from "./Sounds.js";
import {FinishingMoves} from "./Finishers.js";

const APP = document.querySelector('#app');
const DispModule = Display(APP);

const Player = (name,type) => {
    return { name, type }
}

/*/////////////
// MAIN GAME
/////////////*/
const Game = (() => {
    let _Players = {};
    let _GameOver = false;
    let _Winners = []; 
    var _FinishKeys = [];
    let _GB = {};
    let _Round = 0;
    let _IsMuted = true;

     //display game
     DispModule.render();
    
     //listen for start/stop
     document.getElementById('start').addEventListener('click', (e) => {
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
   
    const startGame = () => {       
        addPlayListener();                
        initPlayers();    
        checkRound();           
        _GameOver = false;
    }

    const play = (id) => {
        let type = _Players.currentPlayer.type;
        if (Gameboard.updateBoard(id,type))
        {
            document.getElementById(id).innerHTML = `<div class="marker"><span>${type}</span></div>`;
            Soundeffect.playSound('move');
            checkWinner();
            if (!_GameOver) setCurrentPlayer();
        }
    }

    const checkWinner = () => {
        let win = false;
        let type = _Players.currentPlayer.type;
        _GB = Gameboard.getGameboard();
        let movesCt = 0;
        
        //winner / tie counter
        Object.keys(_GB).filter((key) => {
           //key: X, O
            Object.keys(_GB[key]).map(gridKey => {  
                //gridKey: movesObj              
                if (gridKey != 'name')
                {
                    let ct = _GB[key][gridKey].length;                           
                    movesCt += (gridKey.indexOf('col') != -1) ? ct : 0;                    
                    if (ct == 3)
                    {
                        win = true;
                        document.querySelector('#gameboard').classList = 'gameOver';
                        highlight(_GB[key][gridKey]);                   
                    }
                }                            
            });
        });
        
        if (win) 
        {            
            DispModule.Messages.updateMessages(_Players.currentPlayer.name + ' wins!');
            //DispModule.StatusDisplay.updateMsg(_Players.currentPlayer.name + ' wins!'); //consolidate these to one updater
            //DispModule.StatusDisplay.showMsg();

            _FinishKeys = [];
            let winner = (_Players.currentPlayer === _Players.p1) ? 'p1' : 'p2';
            _Winners.push(winner);
            document.querySelector('#label-player' + winner.replace('p','')).insertAdjacentHTML('beforeend',`<span class="win"></span>`);
            //if 2 rounds won
            if (getOccurrence(_Winners,winner) == 2)
            {
                window.addEventListener("keydown", captureKeys, false);
                
                Soundeffect.playSound('finish',250);

                setTimeout(function() {
                    console.log('what round? ' + _Winners.length);
                    if (isFinishingMove())
                    {
                        let finishSound = 'fatality';
                        switch (_FinishKeys)
                        {
                            case 'b':
                                finishSound = 'babality';
                                break;
                            default:
                        }
                        Soundeffect.Sounds[finishSound].addEventListener('ended', () => {
                            document.querySelector('.bleed').addEventListener('animationend', () => {
                                nextRound();
                            });                        
                        }); 
                    }
                    else
                    {
                        nextRound();
                    }
                    
                }, 1000);
            }
            else
            {
                document.querySelector('#status').addEventListener('transitionend', nextRound);
                
            }
            
        }
        else if (movesCt >= 9)
        {
            _Winners.push('tie');
            DispModule.Messages.updateMessages('Tie game!');           
            nextRound();
        }
        if (_GameOver)
        {
            document.querySelector('#gameboard').classList = 'gameOver';
            _FinishKeys = [];  
        }
    }
    //go to next round
    const nextRound = () => {
        document.querySelector('#status').removeEventListener('transitionend', nextRound);
        let next = true;
        if (getOccurrence(_Winners,'p1') == 2 || getOccurrence(_Winners,'p2') == 2)
        {
            next = false;
            DispModule.Messages.updateMessages('Game Over!');
        }
        else if (_Winners.length == 3)
        {
            next = false;
            DispModule.Messages.updateMessages('Game Over... Pathetic!');
            Soundeffect.playSound('pathetic');
        }
        if (next)
        {
            document.querySelector('#gameboard').classList = 'gameOver';
            setTimeout(() => {
                _FinishKeys = [];
                Gameboard.resetBoard();
                startGame();
            }, 1500);
        }
        else
        {
            _GameOver = true;
            document.querySelector('#gameboard').classList = 'gameOver';
            //_FinishKeys = [];  
        }
    }

    const getOccurrence = (arr, val) => {
        return arr.filter((v) => (v === val)).length;
    }

    //check finishing
    const isFinishingMove = () => {
        let finish = false;
        let oppType = _Players.currentPlayer.type;//(_Players.currentPlayer.type == 'X') ? 'O' : 'X';
        let ids = [].concat(_GB[oppType].col0,_GB[oppType].col1,_GB[oppType].col2);
        let keys = _FinishKeys.join();
        _FinishKeys = keys;
        console.log(keys);
        switch (keys)
        {
            case 'f': 
                DispModule.Lights.off();
                setTimeout(function() {
                    FinishingMoves.Fatality1(ids);  
                    Soundeffect.playSound('dun');
                    Soundeffect.playSound('fatality',2000);                                                   
                },1500);
                setTimeout(function() {
                    DispModule.Lights.on();
                },5000);   
                finish = true;          
                break;
            case 'b': 
                DispModule.Lights.off();
                setTimeout(function() {
                    FinishingMoves.Babality(ids);  
                    Soundeffect.playSound('preBaby');
                    Soundeffect.playSound('babality',2000);                                                   
                },1500);
                setTimeout(function() {
                    DispModule.Lights.on();
                },5000);   
                finish = true;          
                break;
            default:
        }
        window.removeEventListener("keydown", captureKeys, false);        
        return finish;
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

    //reset game
    const resetGame = () => {
        _FinishKeys = [];
        _Winners = [];
        _GameOver = false;
        [...document.querySelectorAll('.win')].filter((node) => {
            console.log(node);
            node.parentNode.removeChild( node );
        });
        Gameboard.resetBoard();
        DispModule.Messages.updateMsg();
    }

    //listen for plays
    const addPlayListener = () => {
        [...document.querySelectorAll('.box')].forEach((el) => {
            el.addEventListener('mouseup',(e) => {
                Game.play(e.target.id);
            });
        });
    }

    //init players
    const initPlayers = () => {
        _FinishKeys = [];
        let names = DispModule.PlayerInput.validatePlayers();
        _Players.p1 = Player(names[0],'X');
        _Players.p2 = Player(names[1],'O');
        _Players.currentPlayer = (_Winners.length == 1) ? _Players.p2 : _Players.p1; 
        DispModule.Messages.updateMsg(_Players.currentPlayer.name + "'s move.");
    }
        //set player
        const setCurrentPlayer = () => {
            _Players.currentPlayer = (_Players.currentPlayer == _Players.p1) ? _Players.p2 : _Players.p1;
            DispModule.Messages.updateMsg(_Players.currentPlayer.name + "'s move."); 
        }
        //get player
        const getCurrentPlayer = () => {
            return _Players.currentPlayer;
        }

    //check round
    const checkRound = () => {
        if (_Winners.length == 3) _Winners = [];
        let rd = (_Winners.length == 0) ? '1' : (_Winners.length == 1) ? '2' : '3';
        Soundeffect.Sounds['rd' + rd].addEventListener('play', () => {
            document.querySelector('#gameboard').classList = ''; 
        })        
        _Round = rd;
        Soundeffect.playSound('round' + rd);
        DispModule.Messages.updateStat('Round ' + rd + ': Fight!');
        //DispModule.StatusDisplay.showMsg();
    }

    //listen for mute
    document.querySelector('#sounds img').addEventListener('click', () => {
        //turn sound on / off
        if (_IsMuted) 
        {                    
            let theme = Soundeffect.Sounds.mktheme;
            if (theme.paused) theme.play();
            Soundeffect.unmute();
            DispModule.SoundOptions.unmute();
            _IsMuted = false;
        }
        else
        {                    
            Soundeffect.mute();
            DispModule.SoundOptions.mute();
            _IsMuted = true;
        }                   
    });
    Soundeffect.mute();
    return {
        startGame, setCurrentPlayer, getCurrentPlayer, checkWinner,  play, resetGame, isFinishingMove
    }
})();