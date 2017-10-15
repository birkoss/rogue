function VisualTimer(game) {
    Phaser.Group.call(this, game);

    this.container = this.game.add.group();
    this.addChild(this.container);

    this.progressLeft = this.game.add.sprite(0, 0, 'timer-left');
    this.container.addChild(this.progressLeft);

    this.progressRight = this.game.add.sprite(0, 0, 'timer-right');
    this.container.addChild(this.progressRight);
    this.progressRight.x = 293-14-14-this.progressRight.width;

    this.progress = this.game.add.sprite(0, 0, 'timer');
    this.container.addChild(this.progress);
    this.progress.x = this.progressLeft.x + this.progressLeft.width;
    this.progress.width = this.progressRight.x - this.progress.x;

    this.maxWidth = this.progress.width;

    this.onCompleted = new Phaser.Signal();
};

VisualTimer.prototype = Object.create(Phaser.Group.prototype);
VisualTimer.prototype.constructor = VisualTimer;

VisualTimer.prototype.pause = function() {
    this.timer.pause();
}

VisualTimer.prototype.reset = function() {
    if (this.timer) {
        this.timer.stop();
    }

    this.timer = this.game.time.create(true);
    this.timer.repeat(Phaser.Timer.SECOND, this.delay , this.tick, this);
    this.timer.onComplete.add(function() {
        this.onCompleted.dispatch(this);
    }, this);

    this.resize(100);
}

VisualTimer.prototype.resize = function(pct) {
    this.progressRight.alpha = this.progressLeft.alpha = (pct == 0 ? 0 : 1);
    this.progress.width = Math.floor(pct / 100 * this.maxWidth);
    this.progressRight.x = this.progress.x + this.progress.width;
}

VisualTimer.prototype.start = function(seconds) {

    this.delay = Math.max(1, seconds);

    this.reset();
    this.timer.start();
}

VisualTimer.prototype.tick = function() {
    this.resize( (this.delay - Math.floor(this.timer.seconds)) / this.delay * 100);
}