/*////////////
// PLAY SOUNDS
////////////*/
const Soundeffect = (() => {
    let Sounds = {
        se1: new Audio('media/PUNCH.wav'),
        se2: new Audio('media/throwknife.wav'),
        se3: new Audio('media/slap.wav'),
        goh: new Audio('media/get-over-here.mp3'),
        tst: new Audio('media/toasty.mp3'),
        rd1: new Audio('media/round1.mp3'),
        rd2: new Audio('media/round2.mp3'),
        rd3: new Audio('media/round3.m4a'),
        dun: new Audio('media/dun-dun-dun.mp3'),
        pathetic: new Audio('media/pathetic.mp3'),
        babality: new Audio('media/babality.mp3'),
        finish: new Audio('media/finish-him.mp3'),
        mktheme: new Audio('media/mk-theme.mp3'),
        fatality: new Audio('media/fatality.mp3')
    }
    Sounds.mktheme.autoplay = true;
    Sounds.mktheme.loop = true;
    
    let moves = ['se1','se2','se3','se1','se2','se3','goh'];
    const playSound = (type, delay = 0) => {
        setTimeout(function(){
            switch (type)
            {
                case 'move':
                    let idx = Math.floor(Math.random()*moves.length);
                                      
                    if (Math.random()*10 < 1)
                    {                        
                        //let sound = document.getElementById(moves[idx]);                        
                        Sounds[moves[idx]].addEventListener('play', toasty);
                        setTimeout(function(){Sounds[moves[idx]].removeEventListener('ended',toasty)},2000);
                    }
                    //document.getElementById(moves[idx]).play();    
                    Sounds[moves[idx]].play();
                    break;
                case 'round1':
                    console.log(Sounds.rd1.muted);    
                    Sounds.rd1.play(); 
                    break;
                case 'round2':
                    Sounds.rd2.play(); 
                    break; 
                case 'round3':
                    Sounds.rd3.play(); 
                    break;   
                case 'finish':
                    /*finish').addEventListener('ended', () => {
                        Game.isFinishingMove();
                    });*/
                    Sounds.finish.play();
                    break;
                case 'theme':
                    Sounds.mktheme.play();
                    break;
                case 'dun':
                    Sounds.dun.play();
                    break;
                case 'pathetic':
                    Sounds.pathetic.play();
                    break;
                case 'fatality':
                   // resetSound('mktheme');
                   Sounds.fatality.play(); 
                    break;
                    default:
            }
        }, delay);
    }
    const toasty = () => {
        Sounds.tst.play();
        //DispModule.Toasty.popup();
        document.querySelector('#toastied').classList = 'pop';
    }
    const mute = () => {
        console.log('muting');
        for (const [key, value] of Object.entries(Sounds)) {
                Sounds[key].muted = true;               
          }       
    }
    const unmute = () => {
        console.log('unmuting');
        for (const [key, value] of Object.entries(Sounds)) {
            Sounds[key].muted = false;          
      }
    }
    
    return {
        playSound, Sounds, mute, unmute
    }
})();

export { Soundeffect }