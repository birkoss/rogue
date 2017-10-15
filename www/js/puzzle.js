/* Suite logique 

quel est le nombre qui suit */
function Puzzle() {
    this.operator = "";
    this.variables = [];
    this.answer = 0;
}

Puzzle.prototype.generate = function(level) {
    level = Math.max(1, level);

    let operators =  [];
    let min = max = 0;

    switch (level) {
        case 2:
            operators = ['+', '-'];
            min = 1;
            max = 10;
            break;
        default:
            // Level 1
            operators = ['+'];
            min = 0;
            max = 6;
    }
    this.operator = operators[this.random(0, operators.length-1)];
    this.variables = [this.random(min, max)];
    if (this.operator == '-') {
        min = this.variables[0];
    }
    this.variables.push(this.random(min, max));

    this.answer = 0;
    switch (this.operator) {
        case '+':
            this.answer = this.variables[0] + this.variables[1];
            break;
        case '-':
            this.answer = this.variables[0] - this.variables[1];
            break;
    }
}

Puzzle.prototype.getFormula = function() {
    return this.variables[0] + " " + this.operator + " " + this.variables[1];
}

Puzzle.prototype.random = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Puzzle.prototype.getAnswers = function() {
    this.answers = [this.answer];

    while (this.answers.length < 3) {
        let nbr = this.random(this.answer-5, this.answer+5);
        if (nbr >= 0 && this.answers.indexOf(nbr) == -1) {
            this.answers.push(nbr);
        }
    }

    return this.shuffle(this.answers);
}

Puzzle.prototype.shuffle = function(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}