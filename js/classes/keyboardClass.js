var keyboardButtonPadding = keyboardKeyWidth / 20;

// -----------------KEYBOARD OBJECT DEFINITION-------------------------------
var Keyboard = (function() {

	// ------------------- KEYBOARD BUTTON CLASS ------------------
	var KeyboardButton = (function(){
		function KeyboardButton(config){
			this.ctx = config.ctx;
			this.keyboard = config.keyboard;
			this.xPos = config.xPos;
			this.yPos = config.yPos;
			this.charCode = config.charCode;
			this.keyText = config.keyText;
			this.padding = config.padding;
			this.canvasDimensions = config.canvasDimensions;
			this.marginRight = config.marginRight;
			this.marginTop = config.marginTop;
			this.onLeft = config.onLeft;
			this.buttonWidth = config.buttonWidth;
			this.buttonHeight = config.buttonHeight;
			this.keyWidthFactor = config.keyWidthFactor;
			this.keyHeightFactor = config.keyHeightFactor;
			this.mouseClickX = config.mouseClickX;
			this.mouseClickY = config.mouseClickY;
			this.theme = config.theme;
			this.mouseFiring = false;
			this.keyFiring = false;
			this.keyPresses = 0;
		}

		KeyboardButton.prototype.reDrawKeyHeatMap = function(canvasDimensions,heatMap) {

			this.keyFiring ?
				this.keyPresses++ :
				this.keyPresses -= 0.3 ;

			if (this.keyPresses < 0) {this.keyPresses = 0;}
			if (this.keyPresses > 500) {this.keyPresses = 500;}

			if (this.keyPresses > 0) {
				var c = this.theme.theme.styles.keyboard.backgroundColor;
				this.canvasDimensions = canvasDimensions;
				this.ctx.lineWidth = 0;
				this.ctx.globalCompositeOperation = "xor";
				this.ctx.fillStyle = c;
				this.ctx.arc(
					((this.xPos ) + (this.buttonWidth  * this.keyWidthFactor  / 2)) * this.canvasDimensions.width,
					((this.yPos ) + (this.buttonHeight * this.keyHeightFactor / 2)) * this.canvasDimensions.height,
					this.keyPresses,
					0,
					2*Math.PI,
					false);
				this.ctx.fill();
                this.ctx.closePath();
			}
		};

		KeyboardButton.prototype.reDrawKey = function(canvasDimensions) {
			this.canvasDimensions = canvasDimensions;
			var xPos = this.xPos + this.padding;
			var yPos = this.yPos + this.padding;
			var c1 = this.theme.theme.styles.keyboard.textColor;
			var c2 = this.theme.theme.styles.keyboard.keyBackground;

			if (this.keyFiring) {
				this.ctx.fillStyle = c1;
				this.ctx.strokeStyle = c2;
			}
			else {
				this.ctx.fillStyle = c2;
				this.ctx.strokeStyle = c1;
			}


			this.ctx.shadowBlur = 0;
			drawRoundedRectangle(this.ctx,
				xPos * this.canvasDimensions.width,
				yPos * this.canvasDimensions.height,
				((this.buttonWidth * this.keyWidthFactor) - (this.padding *2)) * this.canvasDimensions.width,
				((this.buttonHeight * this.keyHeightFactor) - (this.padding * 6 )) * this.canvasDimensions.height,
				this.buttonWidth * 0.2 * this.canvasDimensions.width);
			this.ctx.fill();
			this.ctx.lineWidth = 1;
			this.ctx.stroke();
			this.ctx.closePath();

			this.keyFiring ? this.ctx.fillStyle = c2 : this.ctx.fillStyle = c1;
			this.ctx.font = (this.canvasDimensions.height / keyboardFontFactor) + 'px Calibri';
			this.ctx.fillText(this.keyText,
				(xPos + (this.buttonWidth/10)) * this.canvasDimensions.width ,
				(yPos + (this.buttonHeight/2)) * this.canvasDimensions.height);
			this.ctx.closePath();
		};

		// GET BUTTON END AND BOTTOM VALUES FOR DRAWING THE KEYBOARD KEYS --------
		KeyboardButton.prototype.buttonEnd = function(){
			if (this.onLeft == true) {
				return 0;  }
			else
				return this.xPos + this.marginRight + (this.buttonWidth * this.keyWidthFactor);
		};
		KeyboardButton.prototype.buttonBottom = function(){
			if (this.onLeft == true) {
				return this.yPos + this.buttonHeight + this.marginTop;    }
			else {
				return this.yPos;  }
		};
		KeyboardButton.prototype.mouseUpEvent = function(){
			if(this.mouseFiring){
				this.mouseFiring = false;
				return true;}
			else {
				return false; }
		};
		KeyboardButton.prototype.mouseDownEvent = function(event){
			this.mouseClickX = event.pageX - this.ctx.canvas.getBoundingClientRect().left;
			this.mouseClickY = event.pageY - this.ctx.canvas.getBoundingClientRect().top;
			this.mouseFiring = true;
			var keyRight  = (this.xPos + (this.buttonWidth  * this.keyWidthFactor)  - this.padding) * this.canvasDimensions.width;
			var keyLeft   = this.xPos  * this.canvasDimensions.width;
			var keyTop    = (this.yPos + (this.buttonHeight * this.keyHeightFactor) - this.padding) * this.canvasDimensions.height;
			var keyBottom = this.yPos  * this.canvasDimensions.height;

			if (this.mouseClickX > keyLeft &&
				this.mouseClickX < keyRight &&
				this.mouseClickY > keyBottom &&
				this.mouseClickY < keyTop  ) {
				return true;
			}
			else {
				return false;
			}
		};

		//KEYBOARD PRESS UP AND DOWN EVENT HANDLERS
		KeyboardButton.prototype.keyUpEvent = function(event) {
			if ((this.charCode == event.keyCode) && this.keyFiring) {
				this.keyFiring = false;
				return true;	}
			else {
				return false;	}
		};
		KeyboardButton.prototype.keyDownEvent = function(event) {
			if (this.charCode == event.keyCode ) {
				this.keyFiring = true;
				return true;
			}
			else {
				return false;	}
		};
		return KeyboardButton;
	})();

	// ----- THE KEYBOARD CLASS--------//
	function Keyboard(config) {
		this.canvas = config.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.canvasDimensions =  this.canvas.getBoundingClientRect();

		this.keyPadding = keyboardButtonPadding;
		this.key =[];
		this.theme = config.theme;
		for (var item = 0; item < keyCodesInOrder.length; item++) {
			var keyConfig = {
				canvasDimensions: this.canvasDimensions,
				ctx:this.ctx,
				xPos: item > 0 ? this.key[item - 1].buttonEnd() : 0,
				yPos: item > 0 ? this.key[item - 1].buttonBottom() : 0,
				charCode: keyCodesInOrder[item].code,
				keyText: keyCodesInOrder[item].visual,
				padding:this.keyPadding,
				buttonWidth: keyboardKeyWidth,
				buttonHeight: keyboardKeyHeight,
				keyWidthFactor: keyCodesInOrder[item].keyWidthFactor ? keyCodesInOrder[item].keyWidthFactor : 1,
				keyHeightFactor: keyCodesInOrder[item].keyHeightFactor ? keyCodesInOrder[item].keyHeightFactor : 1,
				marginRight: keyCodesInOrder[item].marginLeft ? keyCodesInOrder[item].marginLeft : 0,
				marginTop:   keyCodesInOrder[item].marginTop ? keyCodesInOrder[item].marginTop : 0,
				onLeft: keyCodesInOrder[item].onLeft ? keyCodesInOrder[item].onLeft : false,
				theme: this.theme
			};
			this.key.push(new KeyboardButton(keyConfig) );
		}
	}
	Keyboard.prototype.keyUp = function(event) {
		for (var i = 0; i < this.key.length; i++) {
			if (this.key[i].keyUpEvent(event)) {
			}
		}
	};
	Keyboard.prototype.mouseUp = function(){
		for (var i = 0; i < this.key.length; i++) {
			if(this.key[i].mouseUpEvent()){
			}
		}
	};

	Keyboard.prototype.keyDown = function(event) {
		for (var i = 0; i < this.key.length; i++) {
			if (this.key[i].keyDownEvent(event)) {
			}
		}
	};
	Keyboard.prototype.mouseDown = function(event){
		for (var i = 0; i < this.key.length; i++) {
			if(this.key[i].mouseDownEvent(event)){
			}
		}
	};

	Keyboard.prototype.reDrawKeyboard = function() {
		angular.element(this.canvas).attr({
			width:  parseFloat(window.getComputedStyle(this.canvas.parentNode,null).width.replace(/\D/g, '' )) + "px",
			height: parseFloat(window.getComputedStyle(this.canvas.parentNode,null).height.replace(/\D/g, '' ))  + "px"
		});
		this.canvasDimensions = this.canvas.getBoundingClientRect();
		this.ctx.clearRect(0,0,this.canvasDimensions.width,this.canvasDimensions.height);
		for (x = 0; x < this.key.length; x++) { this.key[x].reDrawKey(this.canvasDimensions); }
		for (x = 0; x < this.key.length; x++) { this.key[x].reDrawKeyHeatMap(this.canvasDimensions);}
	};
	return Keyboard;

})();