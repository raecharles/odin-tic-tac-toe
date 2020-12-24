const FinishingMoves = (() => {
          
    const Fatality1 = function(ids) {            
        let marker = (document.getElementById(ids[0]).innerText == 'X') ? 'O' : 'X';
        marker = marker.repeat(25);      
        ids.filter(id => {                              
            let finisher = `<div class="finisher">
            <div class="squasher">
                <div class="markType col">${marker}</div>    
                <div class="markType">${marker}</div>
                <div class="markType">${marker}</div>               
            </div>
            </div>`;
            
            document.querySelector('#' + id + ' .marker').insertAdjacentHTML('beforebegin',finisher);
            let anim = document.querySelectorAll('.finisher');
            let markers = document.querySelectorAll('#' + id + ' .marker span');
            //let bloods = document.querySelectorAll('#' + id + ' .squasher span');
            
            for (const finish of anim)
            {
                finish.addEventListener('transitionend', () => {
                    let bloods = [];
                    finish.classList.add('stage2');
                    for (const marker of markers)
                    {
                        marker.classList.add('fatal');
                        if (marker.parentNode.childNodes.length == 1)
                        {                           
                            marker.parentElement.insertAdjacentHTML('beforeend',`<span class="bloodLt">blood</span>
            <span class="bloodRt">blood</span>`);
                            bloods = document.querySelectorAll('span[class^="blood"]');
                        }
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
    }
    const Babality = function(ids) {    
        ids.filter(id => {                                                      
            let finisher = `<div class="finisher">
            <div class="squasher">
            </div>
            </div>`;
            document.querySelector('#' + id + ' .marker').insertAdjacentHTML('beforebegin',finisher);
            
            let anim = document.querySelectorAll('.finisher');
            let markers = document.querySelectorAll('#' + id + ' .marker span');            
            
            for (const finish of anim)
            {
                finish.addEventListener('transitionend', () => {
                    let bloods = [];
                    
                    finish.classList.add('stage2');
                    for (const marker of markers)
                    {
                        marker.classList.add('babal');
                        if (marker.parentNode.childNodes.length == 1)
                        {
                            console.log(marker.parentNode.childNodes.length);
                            marker.parentElement.insertAdjacentHTML('beforeend',`<span class="bloodLt">tears</span>
            <span class="bloodRt">tears</span>`);
                            bloods = document.querySelectorAll('span[class^="blood"]');
                        }
                    }
                    for (const blood of bloods)
                    {
                        blood.classList.add('bleed');
                    }            
                });
                setTimeout(function(){
                    finish.classList.add('babal');                                
                },100);
            }            
        });                 
    }

    return {
        Fatality1, Babality
    }
})();

export {FinishingMoves}