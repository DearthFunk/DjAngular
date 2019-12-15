var LaunchPad = (function() {

	var ctrlButton = (function(){
		function ctrlButton(config){
			this.numVal  = config.numVal;
			this.active = config.active;
			this.midiService = config.midiService;
			this.command = config.command;
		}
		return ctrlButton;
	})();

	ctrlButton.prototype.rightColumnToggle = function() {
		this.active ? this.active = false : this.active = true;
		if ('sendMIDIMessage' in this.midiService.outputs) {
			this.active ?
				this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.NOTE_ON, this.numVal, 100)) :
				this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.NOTE_OFF, this.numVal, 0)) ;
		}
	};

	ctrlButton.prototype.topColumnToggle = function() {
		this.active ? this.active = false : this.active = true;
		if ('sendMIDIMessage' in this.midiService.output) {
			this.active ?
				this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.CONTROL_CHANGE, this.numVal, 100)) :
				this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.CONTROL_CHANGE, this.numVal, 0)) ;
		}
	};


	// ----- THE LaunchPad CLASS--------//
	function LaunchPad(midiService,index) {

		this.midiService = midiService;
		this.channel = index;
		this.midiAccess = midiService.midiAccess;
		this.topControls = {
			up: new ctrlButton({command:176, numVal:104,active:false, midiService: midiService}),
			down: new ctrlButton({command:176, numVal:105,active:false, midiService: midiService}),
			left: new ctrlButton({command:176, numVal:106,active:false, midiService: midiService}),
			right: new ctrlButton({command:176, numVal:107,active:false, midiService: midiService}),
			session: new ctrlButton({command:176, numVal:108,active:false, midiService: midiService}),
			user1: new ctrlButton({command:176, numVal:109,active:false, midiService: midiService}),
			user2: new ctrlButton({command:176, numVal:110,active:false, midiService: midiService}),
			mixer: new ctrlButton({command:176, numVal:111,active:false, midiService: midiService})
		};
		this.rightControls = [

			{name: "Volume",    command:144, numVal: 8,     active:false},
			{name: "Pan",       command:144, numVal: 24,    active:false},
			{name: "Snd A",     command:144, numVal: 40,    active:false},
			{name: "Snd B",     command:144, numVal: 56,    active:false},
			{name: "Stop",      command:144, numVal: 72,    active:false},
			{name: "Trk On",    command:144, numVal: 88,    active:false},
			{name: "Solo",      command:144, numVal: 104,   active:false},
			{name: "Arm",       command:144, numVal: 120,   active:false}
		];


		this.grid = {
			0: false,     1: false,   2: false,   3: false,   4: false,   5: false,   6: false,   7: false,
			16: false,   17: false,  18: false,  19: false,  20: false,  21: false,  22: false,  23: false,
			32: false,   33: false,  34: false,  35: false,  36: false,  37: false,  38: false,  39: false,
			48: false,   49: false,  50: false,  51: false,  52: false,  53: false,  54: false,  55: false,
			64: false,   65: false,  66: false,  67: false,  68: false,  69: false,  70: false,  71: false,
			80: false,   81: false,  82: false,  83: false,  84: false,  85: false,  86: false,  87: false,
			96: false,   97: false,  98: false,  99: false, 100: false, 101: false, 102: false, 103: false,
			112: false, 113: false, 114: false, 115: false, 116: false, 117: false, 118: false, 119: false };
	}

	LaunchPad.prototype.lightUpKitButtons = function(samples,kits,kitNum,moduleType) {
		this.clearGrid();

		for (var x = 0; x < kits[kitNum].length; x++) {
			var LPVal = samples[ kits[kitNum][x] ].kits[kitNum][moduleType].LPVal
			if (LPVal in this.grid) {
				this.grid[LPVal] = true;
				this.toggleGridKey("on",LPVal,"orange");
			}
		}
	};
	LaunchPad.prototype.lightUpGaterButtons = function(samples,kit) {
		this.clearGrid();

		// BUILD ME    ;(
	};

	LaunchPad.prototype.toggleGridKey = function(w,cell,c) {

		var color;
		switch(c) {
			case "green":	color = 100;     break;
			case "yellow":	color = 97;     break;
			case "red":     color = 13;     break;
			case "orange":	color = 83;     break;
			default:		color = c;
		}
		if (w == "on") {
			this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.NOTE_ON, cell, color));
		}
		else if (w == "off") {
			this.midiService.outputs[this.channel].sendMIDIMessage(this.midiService.MIDIAccess.createMIDIMessage(JMB.NOTE_OFF, cell, 0)) ;
		}
	};

	LaunchPad.prototype.clearGrid = function() {
		for (var key in this.grid) {
			this.toggleGridKey("off",key);
		}
	};

	LaunchPad.prototype.buttonPress = function(msg) {
		//GRID
		var foundGridHit = false;
		for (var key in this.grid) {
			if (key == msg.data1) {
				foundGridHit = true;
				break;
			}
		}

		//TOP CONTROL COLUMN
		if (msg.command == 176 && !foundGridHit) {
			for (var key in this.topControls) {
				var obj = this.topControls[key];
				if (obj.numVal == msg.data1 && msg.data2 == 0) {

				}
			}
		}

		// RIGHT CONTROL COLUMN
		if (msg.command == 144 && !foundGridHit && msg.data2 == 127) {
			for (var i = 0; i < this.rightControls.length; i++) {
				if (this.rightControls[i].active) {
					this.rightControls[i].active = false;
					this.toggleGridKey("off",this.rightControls[i].numVal);
				}
			}
			for (var i = 0; i < this.rightControls.length; i++) {
				if (this.rightControls[i].numVal == msg.data1) {
					this.rightControls[i].active = true;
					this.toggleGridKey("on",this.rightControls[i].numVal,"green");
				}
			}
			this.clearGrid();
		}

	};
	return LaunchPad;
})();