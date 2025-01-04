const game = {
    dice: [-1, -1, -1, -1, -1],
    diceState: [0, 0, 0, 0, 0], // parallel array of dice
    diceDom: [],
    diceMaxVal: 6, // the max value of the die when rolled
    scoreDom: [],
    scorePlayed: [0, 0, 0, 0, 0, 0, 0, 0],
    scorePerButton: [0, 0, 0, 0, 0, 0, 0, 0], // parallel array of scorePlayed
    diceFrozen: 0,
    diceFrozenMax: 5, // set to max, but can be changed
    playerScore: 0,
    buttonsUsed: 0,
    turns: 0,
    turnsLimit: 3, // max amount of rolls of dice
    target: 60, // bonus target
    bonus: 35, // bonus get at target met
    bonusDone: 0,
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    freezeDice: function (diceNumber) {
        if (this.diceState[diceNumber] === 1) {
            this.diceState[diceNumber] = 0;
            this.diceFrozen--;
            this.diceDom[diceNumber].style.backgroundColor = "#4285F4";
        }
        else if (this.diceFrozen < this.diceFrozenMax) {
            if (this.dice[diceNumber] !== -1) {
                this.diceState[diceNumber] = 1;
                this.diceFrozen++;
                this.diceDom[diceNumber].style.backgroundColor = "#DB4437";
            }
        }
    },
    rollDice() {
        if (this.turns < this.turnsLimit) {
            for (let i = 0; i < this.dice.length; i++) {
                if (this.diceState[i] === 0) {
                    this.dice[i] = this.getRandomInt(1, this.diceMaxVal);
                    this.diceDom[i].textContent = String(this.dice[i]);
                }
            }
            this.turns++;
            document.getElementById("rolls").textContent = "Roll: " + this.turns;
        }
    },
    score(scoreNumber) {
        if (this.scorePlayed[scoreNumber] === 0) {
            let numAmount = 0;
            for (let i = 0; i < this.dice.length; i++) {
                if (this.dice[i] === scoreNumber+1) {
                    numAmount++;
                }
                this.dice[i] = -1;
                this.diceDom[i].textContent = "_";
                this.diceDom[i].style.backgroundColor = "#4285F4";
                this.diceState[i] = 0;
            }
            let val = (scoreNumber+1)*numAmount;
            this.displayValues(scoreNumber, val);
        }
    },
    scoreKind() {
        if (this.dice[0] !== -1) {
            let scoreNumber = 6;
            let val = 0;
            if (this.scorePlayed[scoreNumber] === 0) {
                let diceArray = [0, 0, 0, 0, 0, 0];
                for (let i = 0; i < this.dice.length; i++) {
                    diceArray[this.dice[i]-1]++;
                    this.dice[i] = -1;
                    this.diceDom[i].textContent = "_";
                    this.diceDom[i].style.backgroundColor = "#4285F4";
                    this.diceState[i] = 0;
                }
                for (let i = 0; i < diceArray.length; i++) {
                    if (diceArray[i] >= 3) {
                        val = 30;
                    }
                }
                this.displayValues(scoreNumber, val);
            }
        }
    },
    scoreFull() {
        if (this.dice[0] !== -1) {
            let scoreNumber = 7;
            let val = 0;
            if (this.scorePlayed[scoreNumber] === 0) {
                let diceArray = [0, 0, 0, 0, 0, 0];
                for (let i = 0; i < this.dice.length; i++) {
                    diceArray[this.dice[i]-1]++;
                    this.dice[i] = -1;
                    this.diceDom[i].textContent = "_";
                    this.diceDom[i].style.backgroundColor = "#4285F4";
                    this.diceState[i] = 0;
                }
                let FullHouseRules = [-1, -1];
                for (let i = 0; i < diceArray.length; i++) {
                    if (diceArray[i] >= 3) {
                        FullHouseRules[0] = i;
                    }
                    if (diceArray[i] >= 2 && FullHouseRules[0] !== i) {
                        FullHouseRules[1] = i;
                    }
                }
                if (FullHouseRules[0] !== -1 && FullHouseRules[1] !== -1) {
                    val = 40;
                }
                this.displayValues(scoreNumber, val);
            }
        }
    },
    displayValues(scoreNumber, val) {
        this.diceFrozen = 0;
        this.playerScore += val;
        this.scoreDom[scoreNumber].textContent = String(val);
        this.turns = 0;
        this.scorePlayed[scoreNumber] = 1;
        this.scorePerButton[scoreNumber] = val;
        this.displayShared();
    },
    computingValues() {
        this.diceFrozen = 0;
        this.buttonsUsed = 0;
        this.playerScore = 0;
        this.bonusDone = 0;
        for (let i = 0; i < this.dice.length; i++) {
            if (this.diceState[i] === 0) {
                this.diceDom[i].style.backgroundColor = "#4285F4";
            }
            else if (this.diceState[i] === 1) {
                this.diceFrozen++;
                this.diceDom[i].style.backgroundColor = "#DB4437";
            }
            if (this.dice[i] === -1) {
                this.diceDom[i].textContent = "_";
            }
            else {
                this.diceDom[i].textContent = String(this.dice[i]);
            }
        }
        for (let i = 0; i < this.scoreDom.length; i++) {
            if (this.scorePlayed[i] === 1) {
                this.scoreDom[i].textContent = this.scorePerButton[i];
                this.buttonsUsed++;
                this.playerScore += this.scorePerButton[i];
            }
            else if (this.scorePlayed[i] === 0) {
                this.scoreDom[i].textContent = "Score";
            }
        }
        this.displayShared();
    },
    displayShared() {
        if (this.playerScore >= this.target) {
            if (this.bonusDone === 0) {
                this.playerScore += this.bonus;
                this.bonusDone = 1;
                document.getElementById("bonus").textContent = `Bonus: ${this.bonus}`;
                document.getElementById("pts").textContent = `Pts Needed: 0`;
            }
        }
        else {
            document.getElementById("bonus").textContent = `Bonus: 0`;
            document.getElementById("pts").textContent = `Pts Needed: ${this.target-this.playerScore}`;
        }
        document.getElementById("totalScore").textContent = `Total Score: ${this.playerScore}`;
        document.getElementById("rolls").textContent = "Roll: " + this.turns;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    game.diceDom.push(document.getElementById("one"));
    game.diceDom.push(document.getElementById("two"));
    game.diceDom.push(document.getElementById("three"));
    game.diceDom.push(document.getElementById("four"));
    game.diceDom.push(document.getElementById("five"));

    game.scoreDom.push(document.getElementById("Ones"));
    game.scoreDom.push(document.getElementById("Twos"));
    game.scoreDom.push(document.getElementById("Threes"));
    game.scoreDom.push(document.getElementById("Fours"));
    game.scoreDom.push(document.getElementById("Fives"));
    game.scoreDom.push(document.getElementById("Sixes"));

    document.getElementById('Roll').addEventListener('click', () => {
        game.rollDice();
    });

    for (let i = 0; i < game.diceMaxVal; i++) {
        game.scoreDom[i].addEventListener('click', () => {
            game.score(i);

        });
    }
    for (let i = 0; i < game.diceDom.length; i++) {
        game.diceDom[i].addEventListener('click', () => {
            game.freezeDice(i);
        });
    }

    game.scoreDom.push(document.getElementById("Kind"));
    game.scoreDom.push(document.getElementById("House"));

    document.getElementById("Kind").addEventListener('click', () => {
        game.scoreKind();

    });
    document.getElementById("House").addEventListener('click', () => {
        game.scoreFull();

    });

    document.getElementById("Save").addEventListener('click', () => {
        for (let i = 0; i < game.dice.length; i++) {
            localStorage.setItem('d' + i, String(game.dice[i]));
            localStorage.setItem('ds' + i, String(game.diceState[i]));
        }
        for (let i = 0; i < game.scorePlayed.length; i++) {
            localStorage.setItem('sp' + i, String(game.scorePlayed[i]));
            localStorage.setItem('sb' + i, String(game.scorePerButton[i]));
        }
        localStorage.setItem('t', String(game.turns));
        if (game.turns === parseInt(localStorage.getItem('t'))) {
            alert("Save successful");
        }
        else {
            alert("Save failed");
        }
    });
    document.getElementById("Load").addEventListener('click', () => {
        if (localStorage.getItem('t') !== null) {
            for (let i = 0; i < game.dice.length; i++) {
                game.dice[i] = parseInt(localStorage.getItem('d' + i));
                game.diceState[i] = parseInt(localStorage.getItem('ds' + i));
            }
            for (let i = 0; i < game.scorePlayed.length; i++) {
                game.scorePlayed[i] = parseInt(localStorage.getItem('sp' + i));
                game.scorePerButton[i] = parseInt(localStorage.getItem('sb' + i));
            }
            game.turns = parseInt(localStorage.getItem('t'));
            game.computingValues();
            alert("Load successful");
        }
        else {
            alert("Load failed");
        }
    });
});