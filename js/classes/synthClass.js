var x, y, i, w, h, item, key, mouseStart, scrollStart, mouseNew, scrollNew, left, right;
var synthStyle = {
	outLineSize:2,
	indicator: {s: 8,bS: 1},
	piano:{numOct:7,
		black: {type:'b',w:45,bS:2},
		white: {type:'w',w:60,bS:2}},
	grid:{cellsWide: 120, s: 1,
		sizing: {w: 0.5, h: 0.5, wMax: 40, wMin: 20, hMax: 30, hMin: 15, noteOffset:0.3},
		note: {s: 1.9},
		scrollPos: {l:0,t:0.5}},
	looper:{size:12,pad:3,s:4, start: {l:0,r:8}, cover:{s: 4}},
	gain:{h: 60,s: 1,tPad:10,bPad: 2, circle: { s: 2, r:3}},
	scrollH: {s: 2, pos:0, pad: 5, box: {bS: 1.5, thickness: 20}},
	scrollW: {s: 2, pos:0, pad: 5, box: {bS: 1.5, thickness: 20}}
};

function DrawSynthOutline(ctx,piano,grid,gain,looper,scrollW,scrollH,notesIndicator, lineColor) {
	ctx.lineWidth = synthStyle.outLineSize;
	ctx.strokeStyle = lineColor;
	ctx.beginPath();
	ctx.moveTo(looper.topX,looper.botY);
	ctx.lineTo(looper.botX,looper.botY);
	ctx.moveTo(scrollW.topX,scrollW.topY);
	ctx.lineTo(scrollW.botX,scrollW.topY);
	ctx.lineTo(scrollW.botX,scrollW.botY);
	ctx.moveTo(scrollH.topX,scrollH.topY);
	ctx.lineTo(scrollH.topX,scrollH.botY);
	ctx.lineTo(scrollH.botX,scrollH.botY);
	ctx.moveTo(piano.botX,piano.topY);
	ctx.lineTo(piano.botX,piano.botY);
	ctx.moveTo(gain.topX,gain.topY);
	ctx.lineTo(gain.botX,gain.topY);
	ctx.stroke();
}
function getSize(x,height) {
	var returnVal;
	height ?
		returnVal = x * (synthStyle.grid.sizing.hMax - synthStyle.grid.sizing.hMin) + synthStyle.grid.sizing.hMin :
		returnVal = x * (synthStyle.grid.sizing.wMax - synthStyle.grid.sizing.wMin) + synthStyle.grid.sizing.wMin ;
	return returnVal;
}

var Synth = (function() {
//----------------------------------------------------------------------------------------------------------------------
//-------------------- PLAYBACK ----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var Playback = (function(){
		function Playback(config){
			this.ctx = config.ctx;
			this.synthStyle = config.synthStyle;
			this.canvasDimensions = config.canvasDimensions;
			this.gridSize = config.gridSize;
			this.scrollPos = config.scrollPos;
			this.loc = config.loc;
			this.gridLoc = config.gridLoc;
			this.position = 1;
		}
		Playback.prototype.reDrawPlayback = function() {
			var scrollOffset = this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) / getSize(this.gridSize.w,false);
			var x = ( ( this.position - scrollOffset ) * getSize(this.gridSize.w,false)) - (getSize(this.gridSize.w,false)/2) + this.gridLoc.topX;
			var y = (this.loc.botY - this.loc.topY)/2 - 2;
			this.ctx.beginPath();
			this.ctx.arc(x, y, 4, 0, Math.PI*2, false);
			this.ctx.fillStyle = this.synthStyle.playbackDot;
			this.ctx.fill();
			this.ctx.closePath();
		};

		Playback.prototype.mouseDown = function(e) {
			if(eventOutOfBounds(this.loc, e, this.canvasDimensions)){
				this.position = Math.floor( (e.pageX - this.canvasDimensions.left - this.gridLoc.topX + (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) )) / getSize(this.gridSize.w,false)) + 1;
			}
		};
		Playback.prototype.mouseMove = function(e) {

		};

		Playback.prototype.mouseUp = function() {
		};

		return Playback;
	})();
//----------------------------------------------------------------------------------------------------------------------
//-------------------- PIANO -------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var PianoKey = (function(){
		function PianoKey(keyType){
			this.type = keyType.type;
			this.w = keyType.w;
			this.h = 0;
			this.yPos = 0;
		}
		return PianoKey;
	})();
	var Piano = (function(){
		function Piano(config){
			this.exampleVal = config.exampleVal;
			this.ctx = config.ctx;
			this.synthStyle = config.synthStyle;
			this.canvasDimensions = config.canvasDimensions;
			this.gridSize = config.gridSize;
			this.scrollPos = config.scrollPos;
			this.pianoKeys = [];
			this.activeMouseKey = -1;
			this.moving = false;
			this.gridLoc = config.gridLoc;
			this.loc = {
				topX: 0,
				topY: synthStyle.looper.size + synthStyle.looper.pad,
				botX: synthStyle.piano.white.w,
				botY: this.canvasDimensions.h};

			for (item = 0; item < (12 * synthStyle.piano.numOct); item++) {
				this.pianoKeys.push(new PianoKey([1,3,5,8,10].indexOf(item % 12) === -1 ? synthStyle.piano.white : synthStyle.piano.black));
			}

		}
		Piano.prototype.reDrawPiano = function() {
			//white
			var whiteCounter = synthStyle.looper.size + synthStyle.looper.pad;
			for(x = 0; x < this.pianoKeys.length; x++){
				if ([1,3,5,8,10].indexOf(x % 12) === -1) {
					drawRectangle(this.ctx,
						0,
						whiteCounter - 	(this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true) ) - (this.gridLoc.botY - this.gridLoc.topY ) ) ),
						this.loc.botX - this.loc.topX,
						getSize(this.gridSize.h,true),
						this.activeMouseKey == x ? this.synthStyle.keyboardSelected : this.synthStyle.keyboardWhite,
						synthStyle.piano.white.bS,
						this.synthStyle.keyboardBorder);
					whiteCounter += (Math.round( getSize(this.gridSize.h,true) * 10000) / 10000);
				}
			}
			//black
			whiteCounter = synthStyle.looper.size + synthStyle.looper.pad;
			for(x = 0; x < this.pianoKeys.length; x++){
				if ([0,2,4,6,7,9,11].indexOf(x % 12) === -1) {
					drawRectangle(this.ctx,
						0,
						whiteCounter - 	(this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true) ) - (this.gridLoc.botY - this.gridLoc.topY ) ) ) - (getSize(this.gridSize.h,true)/ 4),
						(this.loc.botX - this.loc.topX) * 0.75,
						getSize(this.gridSize.h,true)/ 2,
						this.activeMouseKey == x ? this.synthStyle.keyboardSelected : this.synthStyle.keyboardBlack,
						synthStyle.piano.black.bS,
						this.synthStyle.keyboardBorder);
				}
				else {
					whiteCounter += (Math.round(getSize(this.gridSize.h,true) * 10000) / 10000);
				}
			}
		};

		Piano.prototype.mouseDown = function(e) {
			if(eventOutOfBounds(this.loc, e, this.canvasDimensions)){ this.moving = true; this.mouseMove(e);}
		};
		Piano.prototype.mouseUp = function() {
			this.moving = false;
			runningTimer = false;
			clearInterval(timer);

		};

		Piano.prototype.updateActiveMouseKey = function(e,xPos,yPos) {
			var width = this.loc.botX - this.loc.topX;

			if (xPos < width && xPos > 0) {

				var foundKey = false;
				var yOffset = Math.round((this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true) ) - (this.gridLoc.botY - this.gridLoc.topY ) ) )*10000/10000);

				//BLACK
				var whiteCounter = synthStyle.looper.size + synthStyle.looper.pad;
				for(x = 0; x < this.pianoKeys.length; x++){
					if ([0,2,4,6,7,9,11].indexOf(x % 12) === -1) {
						var y = whiteCounter - yOffset - (getSize(this.gridSize.h,true) / 4);
						if (xPos < width * 0.75 && yPos > y  && yPos < y + (getSize(this.gridSize.h,true) / 2)) {
							foundKey = true;
							this.activeMouseKey = x;
						}
					}
					else {
						whiteCounter += (Math.round(getSize(this.gridSize.h,true) * 10000) / 10000);
					}
				}
				//WHITE
				var whiteCounter = synthStyle.looper.size + synthStyle.looper.pad;
				if (!foundKey) {
					for(x = 0; x < this.pianoKeys.length; x++){
						if ([0,2,4,6,7,9,11].indexOf(x % 12) != -1) {
							var y = (Math.round((whiteCounter - yOffset)*10000)/10000);
							if (yPos > y && yPos < y + getSize(this.gridSize.h,true) ) {
								this.activeMouseKey = x;
							}
							whiteCounter += (Math.round(getSize(this.gridSize.h,true) * 10000) / 10000);
						}
					}
				}
			}
		};

		Piano.prototype.pianoTimer = function(e,amount,x,y) {

			this.updateActiveMouseKey(e,e.pageX - this.canvasDimensions.left,e.pageY - this.canvasDimensions.top);
			this.scrollPos.t += amount;
			if (this.scrollPos.t > 1) {this.scrollPos.t = 1; runningTimer=false; clearInterval(timer);}
			if (this.scrollPos.t < 0) {this.scrollPos.t = 0; runningTimer=false; clearInterval(timer);}
		};

		var timer;
		var runningTimer = false;

		Piano.prototype.mouseMove = function(e) {
			x = e.pageX - this.canvasDimensions.left;
			y = e.pageY - this.canvasDimensions.top;

			if (this.moving) {

				var _this = this;
				var t = (y > this.loc.botY);
				var b = (y < this.loc.topY);

				if (!runningTimer) {
					this.updateActiveMouseKey(e,x,y);
				}

				if (!t && !b && runningTimer) {
					clearInterval(timer);
					runningTimer = false;
				}

				if(( t || b ) && !runningTimer) {
					runningTimer = true;
					timer = setInterval(function(){
						_this.pianoTimer(e, t ? 0.0025 : -0.0025,x,y);
					}, 10);
				}

			}
		};

		return Piano;
	})();






//----------------------------------------------------------------------------------------------------------------------
//-------------------- GRID --------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var SynthGrid = (function(){
		var cellToMove = {x:'', y:'', len:''};
		var activeCellX, activeCellY;
		var movingCell = false;
		var drawingCell = false;
		var lastCellX, lastCellY = -1;
		var reCreateCell = '';
		function SynthGrid(config){
			this.ctx = config.ctx;
			this.canvasDimensions = config.canvasDimensions;
			this.gridSize = config.gridSize;
			this.gainData = [];
			this.gridData = [];
			this.gainMoving = false;
			this.gridMoving = false;
			this.synthStyle = config.synthStyle;
			this.gridLoc = config.gridLoc;
			this.gainLoc = config.gainLoc;
			this.scrollPos = config.scrollPos;
			this.playValues = config.playValues;
			for (y = 0; y < synthStyle.piano.numOct * 12; y++) {
				this.gridData[y] = [];
				this.gainData[y] = -1;
				for (x = 0; x < synthStyle.grid.cellsWide; x++) {
					this.gridData[y][x] = {active:false,lengthOfCell:0};
				}
			}
		}

		SynthGrid.prototype.verifyNoteHeights = function() {
			this.noteHeights = [];
			var big = getSize(this.gridSize.h,true)* 0.75;
			var small = getSize(this.gridSize.h,true)* 0.5;
			var runningTotal = 0;
			for (i = 0 ; i < 12; i++) {
				if (i == 0 || i == 6 || i == 7 || i == 11) { runningTotal += big;}
				else {runningTotal += small;}
				this.noteHeights[i] = runningTotal;
			}
		};
		SynthGrid.prototype.getPositionInArray = function(e) {
			var arrayX = Math.floor( (e.pageX - this.canvasDimensions.left - this.gridLoc.topX + (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) )) / getSize(this.gridSize.w,false)) ;
			var arrayY;
			y = e.pageY - this.canvasDimensions.top - this.gridLoc.topY + (this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true) ) - (this.gridLoc.botY - this.gridLoc.topY ) ) );
			var whichOctave = Math.floor(y / (getSize(this.gridSize.h,true)* 7));
			var additionalOctaveSpacing = whichOctave * 7 * getSize(this.gridSize.h,true) ;
			for (i = 0; i < this.noteHeights.length; i++) {
				if (y > (this.noteHeights[i-1] + additionalOctaveSpacing) && y <= (this.noteHeights[i] + additionalOctaveSpacing))
				{ arrayY = i + (whichOctave*12); }
				else if (i == 0	&& y < (this.noteHeights[0] + additionalOctaveSpacing))
				{arrayY = (whichOctave*12);	}
			}
			return {x:arrayX, y:arrayY};
		};

		SynthGrid.prototype.getDimensionsOfCell = function(x,y) {
			w = getSize(this.gridSize.w,false) * this.gridData[y][x].lengthOfCell;
			h = getSize(this.gridSize.h,true) * (1 - (2*this.gridSize.noteOffset));
			var additionalOctaveSpacing = Math.floor(y / 12) * 7 * getSize(this.gridSize.h,true);
			var xLoc = getSize(this.gridSize.w,false) * x;
			var posInOctave = y % 12;
			var yLoc;
			if (posInOctave == 0) { yLoc = (this.noteHeights[posInOctave] / 2) - (h / 2) + additionalOctaveSpacing; }
			else { yLoc = ((this.noteHeights[posInOctave] - this.noteHeights[posInOctave-1]) / 2) - (h / 2) + this.noteHeights[posInOctave-1] + additionalOctaveSpacing;	}
			return {x:xLoc, y:yLoc, w:w, h:h}
		};

		SynthGrid.prototype.mouseMove = function(e) {
			if (this.gridMoving) {
				var md = this.getPositionInArray(e);
				var currentXPos = md.x;
				var currentYPos = md.y;

				if (movingCell) {
					var newX = cellToMove.x + (currentXPos - activeCellX);
					var newY = cellToMove.y + (currentYPos - activeCellY);
					//check and adjust newX/newY for boundaries of grid
					if (newX < 0) {newX = 0;}
					if (newY < 0) {newY = 0;}
					if (newX > synthStyle.grid.cellsWide - cellToMove.len) {newX = synthStyle.grid.cellsWide - cellToMove.len;}
					if (newY > synthStyle.piano.numOct * 12  - 1) { newY = synthStyle.piano.numOct * 12  - 1;}

					if (!isNaN(newX) && !isNaN(newY)) {
						this.gridData[cellToMove.y][cellToMove.x] = {active:false,lengthOfCell:0};
						if ( lastCellX != newX || lastCellY != newY) {
							if (lastCellX> -1 && lastCellY > -1) {this.gridData[lastCellY][lastCellX] = reCreateCell;}
							reCreateCell = this.gridData[newY][newX];
							lastCellX = newX;
							lastCellY = newY;
						}
						else if (lastCellX > -1 && lastCellY > -1) {this.gridData[lastCellY][lastCellX] = {active:false,lengthOfCell:0};	}
						this.gridData[newY][newX] = {active:true, lengthOfCell:cellToMove.len};
					}

				}
				if (drawingCell) {
					var newSize = currentXPos - activeCellX + 1;
					if (e.which == 1 && this.gridData[activeCellY][activeCellX].active && newSize > 0) {
						this.gridData[activeCellY][activeCellX].lengthOfCell = newSize;
					}
				}
			}
			if (this.gainMoving && this.gainData[activeCellX] > -1) {
				newY = e.pageY - this.canvasDimensions.top - this.gainLoc.topY;
				if (newY >= synthStyle.gain.h - synthStyle.gain.bPad)     {this.gainData[activeCellX] = synthStyle.gain.h - synthStyle.gain.bPad;}
				else if (newY <= synthStyle.gain.tPad) {this.gainData[activeCellX] = synthStyle.gain.tPad; }
				else {this.gainData[activeCellX] = newY}
			}
		};

		SynthGrid.prototype.mouseDown = function(e) {
			if(eventOutOfBounds(this.gridLoc, e, this.canvasDimensions)){ this.gridMoving = true; }
			if(eventOutOfBounds(this.gainLoc, e, this.canvasDimensions)){ this.gainMoving = true; }

			var md = this.getPositionInArray(e);
			activeCellX = md.x;
			activeCellY = md.y;

			if (this.gridMoving) {
				if (e.which == 1 && activeCellY != undefined) {
					for (x = 0; x <= activeCellX; x++ ) {
						if (this.gridData[activeCellY][x].active) {
							var x2 = x + this.gridData[activeCellY][x].lengthOfCell;
							if (activeCellX < x2 && activeCellX >= x && x2 > 0) {
								movingCell = true;
								cellToMove.x = x;
								cellToMove.y = activeCellY;
								cellToMove.len = this.gridData[activeCellY][x].lengthOfCell;
							}
						}
					}
					if (!movingCell) {
						drawingCell = true;
						this.gridData[activeCellY][activeCellX] = {active:true,lengthOfCell:1};
						if (this.gainData[activeCellX] == -1) {
							this.gainData[activeCellX] = synthStyle.gain.tPad;
						}
					}
				}
				if (e.which == 3 && activeCellX != undefined) {
					for (x = 0; x <= activeCellX; x++ ) {
						var lenOfCell = x + this.gridData[activeCellY][x].lengthOfCell;
						if (this.gridData[activeCellY][x].active) {
							if (activeCellX < lenOfCell && activeCellX >= x) {
								this.gridData[activeCellY][x] = {active:false,lengthOfCell:0}
							}
						}
					}
				}
			}
			if (this.gainMoving && e.which == 1 && this.gainData[activeCellX] > -1) {
				y = e.pageY - this.canvasDimensions.top - this.gainLoc.topY;
				if (y >= synthStyle.gain.h - synthStyle.gain.bPad)     {this.gainData[activeCellX] = synthStyle.gain.h - synthStyle.gain.bPad;}
				else if (y <= synthStyle.gain.tPad) {this.gainData[activeCellX] = synthStyle.gain.tPad; }
				else {this.gainData[activeCellX] = y}
			}
		};

		SynthGrid.prototype.mouseUp = function() {
			drawingCell = false;
			movingCell = false;
			this.gainMoving = false;
			this.gridMoving = false;
			lastCellX = -1;
			lastCellY = -1;
			reCreateCell = '';
			// purge all extra gain values
			for (x = 0; x < synthStyle.grid.cellsWide; x++) {
				var found = false;
				for (var y = 0; y < this.gridData.length; y++) {
					if (this.gridData[y][x].active) {found = true;	break;	}
				}
				if (!found) {this.gainData[x] = -1;}
				else if (this.gainData[x] == -1) {this.gainData[x] = synthStyle.gain.tPad;}
			}
		};

		SynthGrid.prototype.reDrawGrid = function() {
			var color;
			for (i = 0; i <= synthStyle.piano.numOct * 7; i++)   {
				y = i * getSize(this.gridSize.h,true)+ this.gridLoc.topY - (this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true)) - (this.gridLoc.botY - this.gridLoc.topY ) ) );
				if (y > this.gridLoc.botY) {break;}
				drawPath(this.ctx,[{x:this.gridLoc.topX,y: y},{x: this.gridLoc.botX,y: y}],synthStyle.grid.s,this.synthStyle.gridLine); }
			for (i = 0; i <= synthStyle.grid.cellsWide; i++) {
				i % this.playValues.beats == 0 ? color =  this.synthStyle.gridLineBar : color = this.synthStyle.gridLine;
				x = i * getSize(this.gridSize.w,false) + this.gridLoc.topX - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );
				if (x > this.gridLoc.botX) {break;}
				drawPath(this.ctx,[{x:x,y: this.gridLoc.topY},{x:x, y:this.gridLoc.botY}],synthStyle.grid.s,color);
			}

		};

		SynthGrid.prototype.reDrawNotes = function() {
			for (y = 0; y < this.gridData.length; y++) {
				for (x = 0; x < this.gridData[y].length; x++) {

					if (this.gridData[y][x].active) {
						var val = this.getDimensionsOfCell(x,y);
						drawRectangle(
							this.ctx,
							val.x + this.gridLoc.topX - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) ),
							val.y + this.gridLoc.topY - (this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true)) - (this.gridLoc.botY - this.gridLoc.topY ) ) ),
							val.w,
							val.h,
							this.synthStyle.noteColor,
							synthStyle.grid.note.s,
							this.synthStyle.noteBorder);
					}
				}
			}
		};
		SynthGrid.prototype.reDrawGainValues = function() {

			for (i = 0; i < this.gainData.length; i++) {
				if (this.gainData[i] != -1) {
					var circleBottom = synthStyle.gain.circle.r / 2;
					x = (getSize(this.gridSize.w,false) * i) + (getSize(this.gridSize.w,false) / 2) + this.gainLoc.topX - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );
					y = this.gainData[i] + this.gainLoc.topY;
					this.ctx.beginPath();
					this.ctx.lineWidth = synthStyle.gain.s;
					this.ctx.strokeStyle = this.synthStyle.gainLine;
					this.ctx.moveTo(x,this.gainLoc.botY);
					this.ctx.lineTo(x, y);
					this.ctx.stroke();

					this.ctx.beginPath();
					this.ctx.lineWidth = synthStyle.gain.circle.s;
					this.ctx.strokeStyle = this.synthStyle.gainCircle;
					this.ctx.arc(x, y - circleBottom, synthStyle.gain.circle.r, 0, Math.PI*2,false);
					this.ctx.stroke();
				}
			}
		};
		return SynthGrid;
	})();






//----------------------------------------------------------------------------------------------------------------------
//-------------------- SCROLL H ----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var ScrollH = (function(){
		function ScrollH(config){
			this.ctx = config.ctx;
			this.canvasDimensions = config.canvasDimensions;

			this.moving = false;
			this.loc = config.loc;
			this.scrollSize = 50;
			this.synthStyle = config.synthStyle;
			this.scrollPos = config.scrollPos;
			this.gridSize = config.gridSize;
		}
		ScrollH.prototype.mouseMove = function(e) {
			if (this.moving) {
				mouseNew = e.pageY - this.canvasDimensions.top - this.loc.topY - mouseStart;
				scrollNew = scrollStart + (mouseNew / (this.loc.botY - this.loc.topY - this.scrollSize - (synthStyle.scrollW.pad*2)));
				if      (scrollNew <= 0) { this.scrollPos.t = 0; }
				else if (scrollNew >= 1) { this.scrollPos.t = 1; }
				else                     { this.scrollPos.t = scrollNew; }
			}
		};

		ScrollH.prototype.mouseDown = function(e) {
			if(!eventOutOfBounds(this.loc, e, this.canvasDimensions)){ return; }
			scrollStart = this.scrollPos.t;
			mouseStart = e.pageY - this.canvasDimensions.top - this.loc.topY;
			left = synthStyle.scrollW.pad + (this.scrollPos.t * (this.loc.botY - this.loc.topY - this.scrollSize - (synthStyle.scrollW.pad*2)));
			right = left + this.scrollSize ;
			if (mouseStart >= left && mouseStart <= right) {this.moving = true;};
		};

		ScrollH.prototype.mouseUp = function() {
			this.moving = false;
			scrollStart = this.scrollPos.t;
		};

		ScrollH.prototype.reDrawScrollH = function() {

			this.ctx.lineWidth = 0;
			this.ctx.fillStyle = this.synthStyle.scrollLine;
			this.ctx.beginPath();
			this.ctx.rect(
				this.loc.topX + ( (this.loc.botX - this.loc.topX) / 2) - (synthStyle.scrollH.s/2),
				this.loc.topY,
				synthStyle.scrollH.s,
				this.loc.botY - this.loc.topY
			);
			this.ctx.fill();
			this.ctx.closePath();

			this.scrollSize = ((this.loc.botY - this.loc.topY) / (getSize(this.gridSize.h,true) * synthStyle.piano.numOct * 7 )) * (this.loc.botY - this.loc.topY);

			this.ctx.fillStyle = this.synthStyle.scrollBackground;
			this.ctx.lineWidth = synthStyle.scrollH.box.bS;
			this.ctx.strokeStyle = this.synthStyle.scrollBorder;

			this.ctx.beginPath();
			this.ctx.rect(
				this.loc.topX + synthStyle.scrollH.pad,
				this.loc.topY + synthStyle.scrollW.pad + (this.scrollPos.t * (this.loc.botY - this.loc.topY - this.scrollSize - (synthStyle.scrollW.pad*2))),
				synthStyle.scrollH.box.thickness - (synthStyle.scrollH.pad*2),
				this.scrollSize
			);
			this.ctx.fill();
			this.ctx.stroke();
		};
		return ScrollH;
	})();





//----------------------------------------------------------------------------------------------------------------------
//-------------------- SCROLL W ----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var ScrollW = (function(){
		function ScrollW(config){
			this.ctx = config.ctx;
			this.canvasDimensions = config.canvasDimensions;
			this.moving = false;
			this.scrollSize = 30;
			this.synthStyle = config.synthStyle;
			this.gridSize = config.gridSize;
			this.loc = config.loc;
			this.scrollPos = config.scrollPos;
			this.scrollSize = 30;
		}

		ScrollW.prototype.mouseMove = function(e) {
			if (this.moving) {
				mouseNew = e.pageX - this.canvasDimensions.left - this.loc.topX - mouseStart;
				scrollNew = scrollStart + (mouseNew / (this.loc.botX - this.loc.topX - this.scrollSize - (synthStyle.scrollW.pad*2)));

				if      (scrollNew <= 0) { this.scrollPos.l = 0; }
				else if (scrollNew >= 1) { this.scrollPos.l = 1; }
				else                     { this.scrollPos.l = scrollNew; }
			}
		};

		ScrollW.prototype.mouseDown = function(e) {
			if(!eventOutOfBounds(this.loc, e, this.canvasDimensions)){ return; }
			scrollStart = this.scrollPos.l;
			mouseStart = e.pageX - this.canvasDimensions.left - this.loc.topX;
			left = synthStyle.scrollW.pad + (this.scrollPos.l * (this.loc.botX - this.loc.topX - this.scrollSize - (synthStyle.scrollW.pad*2)));
			right = left + this.scrollSize ;
			if (mouseStart >= left && mouseStart <= right) {this.moving = true;}

		};
		ScrollW.prototype.mouseUp = function() {
			this.moving = false;
			scrollStart = this.scrollPos.l;
		};

		ScrollW.prototype.reDrawScrollW = function() {

			this.ctx.lineWidth = 0;
			this.ctx.fillStyle = this.synthStyle.scrollLine;
			this.ctx.beginPath();
			this.ctx.rect(
				this.loc.topX,
				this.loc.topY + ( (this.loc.botY - this.loc.topY) / 2) - (synthStyle.scrollW.s/2),
				this.loc.botX - this.loc.topX,
				synthStyle.scrollW.s);
			this.ctx.fill();
			this.ctx.closePath();

			this.scrollSize = ((this.loc.botX - this.loc.topX) / (getSize(this.gridSize.w,false) * synthStyle.grid.cellsWide)) * (this.loc.botX - this.loc.topX);
			this.ctx.fillStyle = this.synthStyle.scrollBackground;
			this.ctx.lineWidth = synthStyle.scrollW.box.bS;
			this.ctx.strokeStyle = this.synthStyle.scrollBorder;
			this.ctx.beginPath();
			this.ctx.rect(
				this.loc.topX + synthStyle.scrollW.pad + (this.scrollPos.l * (this.loc.botX - this.loc.topX - this.scrollSize - (synthStyle.scrollW.pad*2))),
				this.loc.topY + synthStyle.scrollW.pad,
				this.scrollSize,
				synthStyle.scrollW.box.thickness - (synthStyle.scrollW.pad*2));
			this.ctx.fill();
			this.ctx.stroke();
		};
		return ScrollW;
	})();







//----------------------------------------------------------------------------------------------------------------------
//-------------------- LOOPER ------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var Looper = (function(){
		function Looper(config){
			this.ctx = config.ctx;
			this.canvasDimensions = config.canvasDimensions;
			this.loc = config.loc;
			this.synthStyle = config.synthStyle;
			this.gridLoc = config.gridLoc;
			this.gridSize = config.gridSize;
			this.looperL = synthStyle.looper.start.l; //synthStyle.piano.white.w + (synthStyle.looper.start.l * this.gridSize.w) ;
			this.looperR = synthStyle.looper.start.r; //synthStyle.piano.white.w + (synthStyle.looper.start.r * this.gridSize.w) ;
			this.scrollPos = config.scrollPos;
			this.movingL = false;
			this.movingR = false;
		}

		var startPos, startL, startR;
		var timer;
		var runningTimer = false;

		Looper.prototype.looperTimer = function(e,amount) {
			if (this.looperL != this.looperR) {
				this.scrollPos.l += amount;
				if (this.movingR) {this.updateLooperR(e);}
				if (this.movingL) {this.updateLooperL(e);}
				if (this.scrollPos.l > 1) {this.scrollPos.l = 1; runningTimer=false; clearInterval(timer);}
				if (this.scrollPos.l < 0) {this.scrollPos.l = 0; runningTimer=false; clearInterval(timer);}
			}
		};

		Looper.prototype.updateLooperR = function(e) {
			var scrollOffset = this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) / getSize(this.gridSize.w,false);
			var newR = scrollOffset + (startR + e.pageX - this.canvasDimensions.left - startPos - synthStyle.piano.white.w - synthStyle.looper.s - synthStyle.grid.s) /getSize(this.gridSize.w,false);
			if (newR >= synthStyle.grid.cellsWide) {this.looperR = synthStyle.grid.cellsWide;}
			else if (newR <= this.looperL)  {this.looperR = this.looperL;}
			else                            {this.looperR = newR;}

		};
		Looper.prototype.updateLooperL = function(e) {
			var scrollOffset = this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) / getSize(this.gridSize.w,false);
			var newL = scrollOffset + (startL + e.pageX - this.canvasDimensions.left - startPos - synthStyle.piano.white.w - synthStyle.looper.s - synthStyle.grid.s) / getSize(this.gridSize.w,false);
			if (newL >= this.looperR) {this.looperL = this.looperR;}
			else if (newL <= 0)       {this.looperL = 0;}
			else                      {this.looperL = newL;}

		};
		Looper.prototype.mouseMove = function(e) {

			var _this = this;
			if (this.movingL || this.movingR) {
				var l = (e.clientX < (this.canvasDimensions.left + this.gridLoc.topX));
				var r = (e.clientX > this.canvasDimensions.left+this.canvasDimensions.width-(this.canvasDimensions.width-this.gridLoc.botX));

				if((l || r) && !runningTimer && this.looperL != this.looperR) {
					runningTimer = true;
					timer = setInterval(function(){
						_this.looperTimer(e, l ? -0.0025 : 0.0025);
					}, 10);
				}
				else {
					if (this.movingR) {this.updateLooperR(e);}
					if (this.movingL) {this.updateLooperL(e);}
				}

				if (!l && !r || this.looperL == this.looperR) {
					clearInterval(timer);
					runningTimer = false;
				}

			}
		};


		Looper.prototype.mouseDown = function(e) {
			if(eventOutOfBounds(this.loc, e, this.canvasDimensions)){
				startPos = e.pageX - this.canvasDimensions.left;
				var lR = synthStyle.piano.white.w - synthStyle.grid.s + (this.looperR * getSize(this.gridSize.w,false))
					- (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );
				var lL = synthStyle.piano.white.w - synthStyle.grid.s + (this.looperL * getSize(this.gridSize.w,false))
					- (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );

				if (startPos <= lL && startPos >= lL - synthStyle.looper.size - synthStyle.looper.s - synthStyle.grid.s) {startL = lL; this.movingL = true;}
				if (startPos >= lR && startPos <= lR + synthStyle.looper.size + synthStyle.looper.s + synthStyle.grid.s) {startR = lR; this.movingR = true;}
			}
		};

		Looper.prototype.mouseUp = function() {
			if (this.movingL) {this.looperL = Math.round(this.looperL);}
			if (this.movingR) {this.looperR = Math.round(this.looperR);}
			this.movingL = false;
			this.movingR = false;
			clearInterval(timer);

		};

		Looper.prototype.reDrawLooperMarkers = function() {

			var lR = synthStyle.piano.white.w + synthStyle.looper.s + synthStyle.grid.s + (this.looperR * getSize(this.gridSize.w,false)) - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );
			var lL = synthStyle.piano.white.w - synthStyle.looper.s - synthStyle.grid.s + (this.looperL * getSize(this.gridSize.w,false)) - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );

			drawPath(
				this.ctx,
				[ {x: lR - synthStyle.looper.cover.s,                               y: 0},
					{x: lR - synthStyle.looper.cover.s,                               y: synthStyle.looper.size},
					{x: lR + synthStyle.looper.size, y: synthStyle.looper.size}	],
				synthStyle.looper.s, this.synthStyle.looperMarker	);
			drawPath(
				this.ctx,
				[ {x: lL + synthStyle.looper.cover.s,                               y:0},
					{x: lL + synthStyle.looper.cover.s,                               y:synthStyle.looper.size},
					{x: lL - synthStyle.looper.size, y:synthStyle.looper.size} ],
				synthStyle.looper.s, this.synthStyle.looperMarker	);
		};
		Looper.prototype.reDrawLooperCovers = function(gs) {
			if (this.looperL != this.looperR) {
				//y = i * this.gridSize.h + this.gridLoc.topY - (this.scrollPos.t * ( (synthStyle.piano.numOct * 7 * this.gridSize.h) - (this.gridLoc.botY - this.gridLoc.topY ) ) );

				var lR = synthStyle.piano.white.w + (synthStyle.grid.s/2) + (this.looperR * getSize(this.gridSize.w,false)) - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );
				var lL = synthStyle.piano.white.w - (synthStyle.grid.s/2) + (this.looperL * getSize(this.gridSize.w,false)) - (this.scrollPos.l * ( (synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX) ) );

				this.ctx.beginPath();
				this.ctx.fillStyle = hexToRGBA(this.synthStyle.looperSection,0.3);
				this.ctx.rect(lR, gs.topY, gs.botX - lR, gs.botY - gs.topY);
				this.ctx.rect(gs.topX, gs.topY, lL - gs.topX, gs.botY - gs.topY);
				this.ctx.fill();
				this.ctx.closePath();

				this.ctx.beginPath();
				this.ctx.strokeStyle = this.synthStyle.looperLine;
				this.ctx.lineWidth = synthStyle.looper.cover.s;
				this.ctx.moveTo(lL - synthStyle.grid.s,gs.topY);
				this.ctx.lineTo(lL - synthStyle.grid.s,gs.botY);
				this.ctx.moveTo(lR + synthStyle.grid.s,gs.topY);
				this.ctx.lineTo(lR + synthStyle.grid.s,gs.botY);
				this.ctx.stroke();
                this.ctx.closePath();



			}
		};
		return Looper;

	})();








//----------------------------------------------------------------------------------------------------------------------
//-------------------- NotesIndicator ----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
	var NotesIndicator = (function(){
		function NotesIndicator(config){
			this.ctx = config.ctx;
			this.canvasDimensions = config.canvasDimensions;
			this.synthStyle = config.synthStyle;
			this.loc = config.loc;
			this.gridSize = config.gridSize;
			this.gridLoc = config.gridLoc;
			this.gridData = config.gridData;
			this.scrollPos = config.scrollPos;
			this.indT = false;
			this.indB = false;
			this.indL = false;
			this.indR = false;
		}

		NotesIndicator.prototype.verifyIndicators = function() {

			this.indT = false;
			this.indB = false;
			this.indL = false;
			this.indR = false;
			var l = Math.floor((this.scrollPos.l * ((synthStyle.grid.cellsWide * getSize(this.gridSize.w,false)) - (this.gridLoc.botX - this.gridLoc.topX))) / getSize(this.gridSize.w,false));
			var r = Math.floor(l + ((this.gridLoc.botX - this.gridLoc.topX) / getSize(this.gridSize.w,false)));
			var t = Math.floor((this.scrollPos.t * ((synthStyle.piano.numOct * 7 * getSize(this.gridSize.h,true)) - (this.gridLoc.botY - this.gridLoc.topY))) / getSize(this.gridSize.h,true) *12/7);
			var b = Math.floor(t + ((this.gridLoc.botY - this.gridLoc.topY) / getSize(this.gridSize.h,true))  *12/7);

			for (y = 0; y < this.gridData.length; y++) {
				for (x = 0; x < this.gridData[y].length; x++ ) {
					if (this.gridData[y][x].active) {

						if (x < l) {this.indL = true;}
						if (x > r) {this.indR = true;}
						if (y < t) {this.indT = true;}
						if (y > b) {this.indB = true;}

					}
				}
			}
		};

		NotesIndicator.prototype.reDrawNotesIndicator = function() {
			this.verifyIndicators();
			this.ctx.fillStyle = hexToRGBA(this.synthStyle.indicator, 0.4);
			this.ctx.lineWidth = 0;
			var offset = synthStyle.outLineSize;
			if (this.indL) {
				this.ctx.beginPath();
				this.ctx.rect(this.loc.topX + offset, this.loc.topY + offset, synthStyle.indicator.s - offset,this.loc.botY-this.loc.topY - offset);
				this.ctx.fill();this.ctx.closePath();			}
			if (this.indR) {
				this.ctx.beginPath();
				this.ctx.rect(this.loc.botX - synthStyle.indicator.s + offset, this.loc.topY + offset, synthStyle.indicator.s  - offset ,this.loc.botY-this.loc.topY - offset);
				this.ctx.fill();this.ctx.closePath();			}
			if (this.indT) {
				this.ctx.beginPath();
				this.ctx.rect(this.loc.topX + offset,this.loc.topY + offset,   this.loc.botX-this.loc.topX-synthStyle.outLineSize,synthStyle.indicator.s-offset);
				this.ctx.fill();this.ctx.closePath();		}
			if (this.indB) {
				this.ctx.beginPath();
				this.ctx.rect(this.loc.topX + offset,this.loc.botY-synthStyle.indicator.s  + offset,this.loc.botX-this.loc.topX-synthStyle.outLineSize,synthStyle.indicator.s - offset);
				this.ctx.fill();this.ctx.closePath();}

		};

		return NotesIndicator;
	})();







//----------------------------------------------------------------------------------------------------------------------
//-------------------- SYNTH -------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

	function Synth(config) {
		this.canvas = config.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.canvasDimensions = {};
		this.gridSize = config.gridSize;
		this.synthStyle = config.synthStyle;
		this.scrollPos = synthStyle.grid.scrollPos;
		this.playValues = config.playValues;
		this.looper =  new Looper(    { ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions, scrollPos: this.scrollPos, gridSize: this.gridSize, loc: {}, gridLoc: {} });
		this.piano =   new Piano(     {	ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions,	scrollPos: this.scrollPos, gridSize: this.gridSize, loc: {}, gridLoc: {} });
		this.playback = new Playback(  {	ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions,	scrollPos: this.scrollPos, gridSize: this.gridSize, loc: {}, gridLoc: {} });
		this.scrollH = new ScrollH(   { ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions, scrollPos: this.scrollPos, gridSize: this.gridSize, loc: {}});
		this.scrollW = new ScrollW(   { ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions, scrollPos: this.scrollPos, gridSize: this.gridSize, loc: {}});
		this.grid =    new SynthGrid( { ctx: this.ctx, synthStyle: this.synthStyle, canvasDimensions: this.canvasDimensions,	scrollPos: this.scrollPos, gridSize: this.gridSize, gridLoc: {}, gainLoc: {}, playValues: this.playValues });
		this.notesIndicator = new NotesIndicator( {ctx:this.ctx, synthStyle: this.synthStyle, canvasDimensions:this.canvasDimensions, scrollPos: this.scrollPos, gridLoc: {}, loc: {}, gridData: this.grid.gridData, gridSize:this.gridSize});
		this.exampleVal = config.exampleVal;
		this.piano.exampleVal = this.exampleVal;
	}
	Synth.prototype.reDrawSynth = function() {
		var dim = this.canvas.parentNode.getBoundingClientRect();
		w = dim.width;
		h = dim.height;
		angular.element(this.canvas).attr({
			width:  dim.width + "px",
			height: dim.height + "px"
		});
		this.ctx.clearRect(0,0,dim.width,dim.height);
		for(key in  dim) {this.canvasDimensions[key] = dim[key];}
		this.scrollW.loc = {topX: synthStyle.piano.white.w, topY: h - synthStyle.scrollW.box.thickness, botX: w - synthStyle.scrollH.box.thickness, botY: h};
		this.scrollH.loc = {topX: w - synthStyle.scrollH.box.thickness, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: w, botY: h - synthStyle.scrollW.box.thickness};

		this.grid.gridLoc = {topX: synthStyle.piano.white.w, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: w - synthStyle.scrollH.box.thickness, botY: h - synthStyle.scrollW.box.thickness - synthStyle.gain.h};
		this.grid.gainLoc = {topX: synthStyle.piano.white.w, topY: h - synthStyle.scrollW.box.thickness - synthStyle.gain.h,	botX: w - synthStyle.scrollH.box.thickness, botY: h - synthStyle.scrollW.box.thickness};

		this.looper.loc = {topX: 0, topY: 0, botX: w, botY: synthStyle.looper.size + synthStyle.looper.pad};
		this.looper.gridLoc = {topX: synthStyle.piano.white.w, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: w - synthStyle.scrollH.box.thickness, botY: h - synthStyle.scrollW.box.thickness - synthStyle.gain.h};
		this.playback.loc = {topX: 0, topY: 0, botX: w, botY: synthStyle.looper.size + synthStyle.looper.pad};
		this.playback.gridLoc = {topX: synthStyle.piano.white.w, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: w - synthStyle.scrollH.box.thickness, botY: h - synthStyle.scrollW.box.thickness - synthStyle.gain.h};

		this.piano.loc = {topX: 0, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: synthStyle.piano.white.w, botY: h};
		this.piano.gridLoc = {topX: synthStyle.piano.white.w, topY: synthStyle.looper.size + synthStyle.looper.pad, botX: w - synthStyle.scrollH.box.thickness, botY: h - synthStyle.scrollW.box.thickness - synthStyle.gain.h};
		this.notesIndicator.loc = {topX: w - synthStyle.scrollH.box.thickness, topY:h - synthStyle.scrollW.box.thickness, botX:w, botY:h};
		this.notesIndicator.gridLoc = this.grid.gridLoc;
		this.notesIndicator.gridData = this.grid.gridData;


		this.grid.verifyNoteHeights();
		this.grid.reDrawGrid();
		this.grid.reDrawNotes();

		this.ctx.clearRect(this.grid.gainLoc.topX,this.grid.gainLoc.topY,this.grid.gainLoc.botX - this.grid.gainLoc.topX, this.grid.gainLoc.botY - this.grid.gainLoc.topY);
		this.grid.reDrawGainValues();
		this.looper.reDrawLooperCovers(this.grid.gridLoc);


		this.ctx.clearRect(this.scrollH.loc.topX, this.scrollH.loc.topY,this.scrollH.loc.botX-this.scrollH.loc.topX,this.scrollH.loc.botY-this.scrollH.loc.topY);
		this.scrollH.reDrawScrollH();

		this.ctx.clearRect(this.scrollW.loc.topX, this.scrollW.loc.topY,this.scrollW.loc.botX-this.scrollW.loc.topX,this.scrollW.loc.botY-this.scrollW.loc.topY);
		this.scrollW.reDrawScrollW();

		this.ctx.clearRect(this.notesIndicator.loc.topX, this.notesIndicator.loc.topY,this.notesIndicator.loc.botX-this.notesIndicator.loc.topX,this.notesIndicator.loc.botY-this.notesIndicator.loc.topY);
		this.notesIndicator.reDrawNotesIndicator();

		this.piano.reDrawPiano();

		this.ctx.clearRect(0,0,this.canvasDimensions.width, this.looper.loc.botY - this.looper.loc.topY);
		this.looper.reDrawLooperMarkers();
		this.playback.reDrawPlayback();

		DrawSynthOutline(this.ctx,this.piano.loc,this.grid.gridLoc,this.grid.gainLoc,this.looper.loc,this.scrollW.loc,this.scrollH.loc,this.notesIndicator.loc, this.synthStyle.sectionLines);

	};
	Synth.prototype.mouseUp = function(e){
		this.piano.mouseUp();
		this.looper.mouseUp();
		this.grid.mouseUp();
		this.playback.mouseUp();
		this.scrollH.mouseUp();
		this.scrollW.mouseUp();
		this.piano.activeMouseKey = -1;

	};
	Synth.prototype.mouseDown = function(e) {
		this.piano.mouseDown(e);
		this.looper.mouseDown(e);
		this.grid.mouseDown(e);
		this.playback.mouseDown(e);
		this.scrollH.mouseDown(e);
		this.scrollW.mouseDown(e);
	};
	Synth.prototype.mouseMove = function(e){
		this.piano.mouseMove(e);
		this.looper.mouseMove(e);
		this.grid.mouseMove(e);
		this.playback.mouseMove(e);
		this.scrollH.mouseMove(e);
		this.scrollW.mouseMove(e);
	};
	Synth.prototype.mouseWheel = function(e){
		if (e.clientX > this.canvasDimensions.left &&
			e.clientX < this.canvasDimensions.left + this.canvasDimensions.width &&
			e.clientY > this.canvasDimensions.top &&
			e.clientY < this.canvasDimensions.top + this.canvasDimensions.height) {

			var newPos;
			e.wheelDelta > 0 ? newPos = this.scrollPos.t - 0.1 : newPos = this.scrollPos.t + 0.1;
			if (newPos < 0) { newPos = 0;}
			if (newPos > 1) { newPos = 1;}
			this.looper.scrollPos.t = newPos;
			this.piano.scrollPos.t = newPos;
			this.scrollH.scrollPos.t = newPos;
			this.scrollW.scrollPos.t = newPos;
			this.grid.scrollPos.t = newPos;
			this.notesIndicator.scrollPos.t = newPos;
		}
	};


	return Synth;
})();
