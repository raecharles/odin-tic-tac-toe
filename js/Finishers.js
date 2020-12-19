const FinishingMoves = (() => {
          
    const Fatality1 = function(ids) {            
        let marker = document.getElementById(ids[0]).innerText;
        marker = marker.repeat(25);      
        ids.filter(id => {                              
            let finisher = `<div class="finisher">
            <div class="squasher">
                <div class="markType col">${marker}</div>    
                <div class="markType">${marker}</div>
                <div class="markType">${marker}</div>
                <span class="bloodLt">blood</span>
                <span class="bloodRt">blood</span>
            </div>
            </div>`;
            
            document.querySelector('#' + id + ' .marker').insertAdjacentHTML('beforebegin',finisher);
            let anim = document.querySelectorAll('.finisher');
            let markers = document.querySelectorAll('#' + id + ' .marker span');
            let bloods = document.querySelectorAll('#' + id + ' .squasher span');
            
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
    }
    
    return {
        Fatality1
    }
})();

export {FinishingMoves}