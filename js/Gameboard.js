import {createElemWithAttributes} from "./Helpers.js";
export const Gameboard = (() => {
    
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
            /*box.addEventListener('mouseup',(e) => {
                Game.play(e.target.id);
            });*/
            document.querySelector('#gameboard').append(box);
            x++;
        }
    }

    const render = (selector) => {
        console.log('building gameboard...');
        let gb = createElemWithAttributes('div', {'id': 'gameboard', 'class': 'gameOver'});
        selector.append(gb);
        drawBoard();
    };
    return {
        render, getGameboard, updateBoard, resetBoard
    }
})();