var ROT = require('rot-js');




// Create our player
var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function() {
    Game.engine.lock();
    // wait for user input
    window.addEventListener("keydown", this);
}

Player.prototype.handleEvent = function(e) {
    var keyMap = {};
    keyMap[38, 75] = 0; // up
    keyMap[33, 85] = 1; // up-right
    keyMap[39, 76] = 2; // right
    keyMap[34, 78] = 3; // down - right
    keyMap[40, 74] = 4; // down
    keyMap[35, 66] = 5; // down - left
    keyMap[37, 72] = 6; // left
    keyMap[36, 89] = 7; // up-left

    var code = e.keyCode;

    if (!(code in keyMap)) { return; }

    var diff = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + diff[0];
    var newY = this._y + diff[1];

    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();
    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

// Create our game
var Game = {
    display: null,


    init: function() {
        
        this.display = new ROT.Display({width: 83, height: 36});
        document.body.appendChild(this.display.getContainer());
        
        this._generateMap();
        
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },

    map: {},
    player: null,

    _generateMap: function() {
        

        var digger = new ROT.Map.Digger();
        var freeCells = [];

        var digCallback = function(x, y, value) {
            if (value) { return; } // do not store walls

            var key = x+","+y;
            freeCells.push(key);
            this.map[key] = ".";
        }

        digger.create(digCallback.bind(this));
        this._generateBoxes(freeCells);
        this._drawWholeMap();
        this._createPlayer(freeCells);
    },

    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key]);
        }
    },

    _generateBoxes: function(freeCells) {
        for (var i=0; i<10; i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
        }
    },

    _createPlayer: function(freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        this.player = new Player(x, y);
    }
}


console.log('This happened');
Game.init();


