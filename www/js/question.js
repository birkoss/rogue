function Question(game) {
    Phaser.Group.call(this, game);

    this.createBackground();

    this.createAnswers();

    this.textContainer = this.game.add.group();
    this.addChild(this.textContainer);

    this.timer = new VisualTimer(this.game);
    this.timer.x = 14;
    this.timer.y = 14;
    this.timer.onCompleted.add(this.onTimerCompleted, this);

    this.text = this.game.add.bitmapText(0, 0, "font:gui", "6 + 6", 20);
    this.text.anchor.set(0.5, 0.5);
    this.textContainer.addChild(this.text);
    this.text.x = this.backgroundContainer.width/2;
    this.text.y = (this.backgroundContainer.height - this.answersContainer.height - 20)/2;
    this.text.y += (this.timer.height);
    this.text.tint = 0x575246;

    this.onAnswerClicked = new Phaser.Signal();
    this.onTimedOut = new Phaser.Signal();


    this.addChild(this.timer);
};

Question.prototype = Object.create(Phaser.Group.prototype);
Question.prototype.constructor = Question;

Question.prototype.createBackground = function() {
    this.backgroundContainer = this.game.add.group();
    this.addChild(this.backgroundContainer);

    this.backgroundContainer.create(0, 0, 'question');
}

Question.prototype.createAnswers = function() {
    this.answersContainer = this.game.add.group();
    this.addChild(this.answersContainer);

    let startX = 0;
    for (let i=0; i<5; i++) {
        let button = this.game.add.button(startX, 0, 'button:answer', this.onBtnClicked, this, 1, 0, 1);
        this.answersContainer.addChild(button);

        let text = this.game.add.bitmapText(0, 0, "font:gui", "XX", 20);
        text.anchor.set(0.5, 0.5);
        text.x = (button.width/2) - 1;
        text.y = (button.height/2) - 1;
        button.addChild(text);
        text.tint = 0xd4d8e9;

        startX += button.width + 10;
    }

    this.answersContainer.x = 14;
    this.answersContainer.y = 257;
}

Question.prototype.setPuzzle = function(puzzle) {
    this.text.text = puzzle.getFormula();

    for (let i=0; i<this.answersContainer.children.length; i++) {
        this.answersContainer.getChildAt(i).alpha = 0;
        this.answersContainer.getChildAt(i).frame = 0;
    }

    let answers = puzzle.getAnswers();
    for (let i=0; i<answers.length; i++) {
        this.answersContainer.getChildAt(i).alpha = 1;
        this.answersContainer.getChildAt(i).getChildAt(0).text = answers[i];
    }

    this.timer.start(10);
}

Question.prototype.activate = function(state) {
    for (let i=0; i<this.answersContainer.children.length; i++) {
        this.answersContainer.getChildAt(i).inputEnabled = state;
    }
}

Question.prototype.reset = function() {
    this.timer.pause();
}

Question.prototype.onBtnClicked = function(button, pointer) {
    this.onAnswerClicked.dispatch(button, button.getChildAt(0).text);
}

Question.prototype.onTimerCompleted = function() {
    this.onTimedOut.dispatch(this);
}