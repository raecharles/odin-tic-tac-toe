import {createElemWithAttributes} from "./Helpers.js";
import {Gameboard} from "./Gameboard.js";

/*///////////////
// DISPLAY COMPONENTS
///////////////*/
const Display = (selector) => {
    let APP = selector;
    let isMuted = true;
    /*/////////////////
    // SOUND OPT
    ///////////////*/
    const SoundOptions = (() => {
        const soundUI = createElemWithAttributes('div',{id: 'sounds'});
        const speaker = createElemWithAttributes('img',{src: 'img/muted.png', alt: 'Speaker by Dileep M from the Noun Project'});        
        //let sounds = document.querySelectorAll('audio');

        const mute = (sounds) => {
            //console.log('mute');
           // isMuted = true;
            document.querySelector('#sounds img').setAttribute('src','img/muted.png');
            /*[...sounds].filter((audio) => {
                console.log(audio);
                audio.muted = true;
            });*/
        };

        const unmute = (sounds) => {
           // console.log('unmute');
            //isMuted = false;
            document.querySelector('#sounds img').setAttribute('src','img/speaker.png');
            /*[...sounds].filter((audio) => {
               // audio.removeAttribute('muted');
               audio.muted = false;
            });*/
        }

        const render = () => {           
            APP.append(soundUI);
            document.querySelector('#sounds').append(speaker);
            
        }
        return {
            render, mute, unmute
        }
    })();


    /*///////////////////
    // MESSAGE DISPLAY
    ///////////////////*/
    const Messages = (() => {
        const startMsg = 'Enter name(s) and press start to play.';
        const disp = createElemWithAttributes('div', {'id': 'display'});
        const updateMsg = (msg = startMsg) => {
            document.querySelector('#display').innerHTML = msg;
        }

        const statMsg = 'Round 1: Fight!';
        const stat = createElemWithAttributes('div', {'id': 'status'});
        const text = createElemWithAttributes('span');
        const updateStat = (msg = startMsg) => {
            document.querySelector('#status span').innerHTML = msg; 
            document.querySelector('#status').classList = 'show';           
        }

        const updateMessages = (msg) => {
            updateMsg(msg);
            updateStat(msg);
        }

        const render = () => {
            console.log('building message display...');
            APP.append(disp);
            updateMsg();

            console.log('building status display...');
            APP.append(stat);
            document.querySelector('#status').append(text);
            document.querySelector('#status').addEventListener('transitionend',() => {
                setTimeout(() => {
                    document.querySelector('#status').classList = '';
                },1000);
            });
        }
        return {
            render, updateMsg, updateStat, updateMessages
        }
    })();

    /*///////////////////
    // STATUS DISPLAY
    ///////////////////* /
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
    })();*/

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
        /*btn.addEventListener('click', (e) => {
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
        });*/
        
        const render = () => {
            console.log('building start button...');
            APP.append(btn);
        }
        return {
            render
        }
    })();
    
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
        //StatusDisplay.render();
        Messages.render();
        PlayerInput.render(['Player 1','Player 2']);
        //PlayerInput.render('Player 2');
        Button.render();
        Gameboard.render(APP);
        Toasty.render();
        document.querySelector('h1 span').classList = 'show';
    }

    return {
        render, SoundOptions, Messages, PlayerInput, Lights, Toasty
    }
    
};//)('#app');

export { Display, Gameboard }