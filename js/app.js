document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('.field_btn'),
        choiceScreen = document.querySelector('.choice'),
        textStatus = document.querySelector('.field_text');

    startBtn.addEventListener('click', animateMenuGame);
    choiceScreen.addEventListener('click', (event) => {
        const choiceBtn = event.target;
        if (choiceBtn.classList.contains('choice_item')) {
            let n = +choiceBtn.getAttribute('data-size'),
                m = +choiceBtn.getAttribute('data-win');
            createGameBoard(n);
            gameLogic(n, m);
        }
    });

    //function animate menu
    function animateMenuGame() {
        startBtn.classList.add('field_btn_hidden');
        choiceScreen.classList.add('choice_active');
        textStatus.textContent = `Выбери размер поля`;
    }

    //functions for working game
    function createGameBoard(sizeBoard) {
        const field = document.querySelector('.field'),
            element = document.createElement('div');
        element.classList.add('board');
        element.style.width = sizeBoard * 60 + (4 * sizeBoard) + 'px';
        field.append(element);
        for (let i = 0; i < sizeBoard * sizeBoard; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            element.append(cell);
        }
        setTimeout(() => {
            //show gameBoard
            choiceScreen.classList.remove('choice_active');
            element.classList.add('board_active');
            textStatus.textContent = `ходит игрок № 1`;
        }, 4);
    }

    function generateElement(num) {
        const element = document.createElement('div');
        if (num === 1) {
            element.classList.add('cross');
            element.innerHTML = `<span></span>
                                 <span></span>`;
        } else if (num === 2) {
            element.classList.add('zero');
            element.innerHTML = `<div class="zero_inner"></div>`;
        }
        return element;
    }

    function error(selector) {
        selector.classList.add('error');
        setTimeout(() => {
            selector.classList.remove('error');
        }, 200);
    }

    function activePlayer(num) {
        return num === 1 ? 2 : 1;
    }

    function showWinner(selector, arr, textSelector, num, i = 0) {
        document.querySelector(selector).remove();
        if (i === 0) {
            textSelector.textContent = `выиграл игрок № ${num}`;
            console.log(`win ${num}`);
        } else {
            textSelector.textContent = `ничья!`;
            console.log('draw');
        }
        setTimeout(() => {
            //show StartGameBtn
            textSelector.textContent = `крестики - нолики`;
            startBtn.classList.remove('field_btn_hidden');
        }, 1500);
    }

    function gameLogic(n, m) {
        const cells = document.querySelectorAll('.cell');
        const checkingArray = [];
        checkingArray.length = n * n;
        checkingArray.fill(0);
        let playerNumber = 1;
        cells.forEach((item, i) => {
            item.addEventListener('click', () => {
                if (checkingArray[i] === 0) {
                    item.append(generateElement(playerNumber));
                    checkingArray[i] = playerNumber;
                    const check = createCheckArrays(checkingArray, n, m);
                    for (let item of check) {
                        const checkCol = winCol(item, m, playerNumber),
                            checkRow = winRow(item, m, playerNumber),
                            checkDia = winDia(item, m, playerNumber),
                            checkRevDia = winRevDia(item, m, playerNumber),
                            checkDraw = draw(item);
                        if (checkCol || checkRow || checkDia || checkRevDia) {
                            let winner = playerNumber;
                            if (winner) {
                                showWinner('.board', checkingArray, textStatus, winner);
                                return;
                            }
                        } else if (checkDraw) {
                            showWinner('.board', checkingArray, textStatus, playerNumber, 1);
                            return;
                        }
                    }
                    playerNumber = activePlayer(playerNumber);
                    textStatus.textContent = `ходит игрок № ${playerNumber}`;
                } else {
                    error(item);
                }
            });
        });
    }

    //function check winner
    function draw(arr) {
        const check = arr.every(el => el !== 0);
        if (check) {
            return check;
        }
    }

    function winCol(arr, num, player) {
        for (let i = 0; i < num; i++) {
            const newArr = [];
            for (let j = i; j < arr.length; j += num) {
                newArr.push(arr[j]);
            }
            const check = newArr.every(el => el === player);
            if (check) {
                return check;
            }
        }
    }

    function winRow(arr, num, player) {
        for (let i = 0; i < arr.length; i += num) {
            const newArr = [];
            for (let j = i; j < i + num; j++) {
                newArr.push(arr[j]);
            }
            const check = newArr.every(el => el === player);
            if (check) {
                return check;
            }
        }
    }

    function winDia(arr, num, player) {
        const newArr = [];
        for (let i = 0; i < arr.length; i += num + 1) {
            newArr.push(arr[i]);
        }
        const check = newArr.every(el => el === player);
        if (check) {
            return check;
        }
    }

    function winRevDia(arr, num, player) {
        const newArr = [];
        for (let i = num - 1; i < arr.length - 1; i += num - 1) {
            newArr.push(arr[i]);
        }
        const check = newArr.every(el => el === player);
        if (check) {
            return check;
        }
    }

    function createCheckArrays(arr, sizeBoard, winValue) {
        const allArr = [];
        for (let i = 0; i <= arr.length - (sizeBoard * winValue); i += sizeBoard) {
            const cellArr = [];
            allArr.push(cellArr);
            for (let j = i; j <= i + sizeBoard - winValue; j++) {
                const rowArr = [];
                for (let k = j; k < j + (arr.length - ((sizeBoard - winValue)) * sizeBoard); k += sizeBoard) {
                    const newArr = [];
                    rowArr.push(newArr);
                    for (let l = k; l < k + winValue; l++) {
                        newArr.push(arr[l]);
                    }
                }
                const checkArr = rowArr.flat();
                cellArr.push(checkArr);
            }
        }
        return allArr.flat();
    }

});