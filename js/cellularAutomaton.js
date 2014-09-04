'use strict';

function CellularAutomaton(canvasId, cellSize, rule, cellColor) {
  this._canvas = document.getElementById(canvasId);
  this._ctx = this._canvas.getContext('2d');
  this._ctx.fillStyle = cellColor;
  this._nCol = Math.floor(this._canvas.width / cellSize);
  this._nRow = Math.floor(this._canvas.height / cellSize);
  this._cellSize = cellSize;
  this._board = new Array(this._nRow * this._nCol);
  this.rule = rule;
};


CellularAutomaton.prototype.initBoard = function() {
  for (var i = 0; i < this._board.length; i++) {
    this._board[i] = 0;
  }
  var centerIdx = Math.floor(this._nCol / 2);
  this._board[centerIdx] = 1;
};


CellularAutomaton.prototype.update = function(row) {
  var offset1 = this._nCol * (row - 1);
  var offset2 = this._nCol * row;
  for (var i = 0; i < this._nCol; i++) {
    var l = (i - 1 + this._nCol) % this._nCol;
    var c = i;
    var r = (i + 1) % this._nCol;
    var code = (this._board[offset1 + l] << 2) + (this._board[offset1 + c] << 1) + this._board[offset1 + r];
    this._board[offset2 + i] = this.rule[code];
  }
};


CellularAutomaton.prototype.updateAll = function() {
  for (var i = 1; i < this._nRow; i++) {
    this.update(i);
  }
}


CellularAutomaton.prototype.draw = function() {
  this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  var board = this._board;
  for (var i = 0; i < this._nRow; i++) {
    for (var j = 0; j < this._nCol; j++) {
      if (board[i * this._nCol + j] == 1) {
        this._ctx.fillRect(j * this._cellSize, i * this._cellSize, this._cellSize, this._cellSize);
      }
    }
  }
};


CellularAutomaton.prototype.animationDraw = function(updatetime) {
  this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  for (var i = 0; i < this._nCol; i++) {
    if (this._board[i] == 1) {
      this._ctx.fillRect(i * this._cellSize, 0, this._cellSize, this._cellSize);
    }
  }

  var __this = this;
  var i = 1;
  var loop = function() {
    if (i == __this._nRow) return;
    __this.update(i);
    for (var j = 0; j < __this._nCol; j++) {
      if (__this._board[i * __this._nCol + j] == 1) {
        __this._ctx.fillRect(j * __this._cellSize, i * __this._cellSize, __this._cellSize, __this._cellSize);
      }
    }

    setTimeout(function() {
      i++;
      loop(i);
    }, updatetime);
  }
  loop();
};
