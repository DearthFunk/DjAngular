var djangularLocalStorage = JSON.parse(localStorage.getItem('djangularLocalStorage'));

if (djangularLocalStorage != null) {
    if ('active' in djangularLocalStorage) {
        if (!djangularLocalStorage.active){ djangularLocalStorage = false}
    }
    else {
        djangularLocalStorage = false;
    }
}
else {
    djangularLocalStorage = false;
}

// CONTAINER ------------
var containerMinimums = {width:200, height:55, windowPadding: 10};
var containerZIndex = {val: 0};

// SYNTH-------- ------------
var synthDetuneRange = 50;

// TRACK TYPE TRACKING ------------
var intChannelTypePlaceholder = 0;
var intChannelTypeTrack = 1;
var intChannelTypeMaster = 2;
var intChannelTypeDualSine = 3;
var intChannelTypeSynth = 4;

//DEFAULT SAMPLE PLAYBACK TYPES-----
var intPlay = 0;
var intMainDemo = 1;
var intKitDemo = 2;

// TOUCH PAD ----------------
var touchPadFreqXMin = 20;
var touchPadFreqXMax = 10000;
var touchPadFreqYMin = 20;
var touchPadFreqYMax = 1000;

// MIXER--------------------
var mixerClickFreq = {one: 800.0, two: 440.0, three: 720.0};
var mixerClickNoteLength = 0.05;
var mixerBPM = 120;
var mixerBeats = 4;
var mixerBars = 4;

// START KITS---------------
var startKitDrumPads = 5;
var startKitDrumMachine = 1;
var startKitAutoGater = 2;
var startKitAutoLooper = 3;

//GRID START LENGTHS-------
var startLengthDrumMachine = 8;
var startLengthAutoGater = 8;
var startLengthAutoLooper = 8;

// GRID MIN-MAX------------
var maxLengthDrumMachine = 32;
var maxLengthAutoGater = 16;
var maxLengthAutoLooper = 32;
var minLengthDrumMachine = 4;
var minLengthAutoGater = 8;
var minLengthAutoLooper = 8;

// AUDIO PROCESSOR ----------
var audioBufferSize = 1024;
var audioSmoothing = 0.3;
var audioGain = 0.8;
var audioFreqMin = 20;
var audioFreqMax = 22050;
var audioQmin = 0.001;
var audioQmax = 1000;
var numOfFXs = 4;

// KEYBOARD ----------------
var keyboardKeyWidth = 1/23;
var keyboardKeyHeight = 1/6.5;
var keyboardFontFactor = 20;

// AUDIO WAVE TYPES------------
var audioWaveTypes = [
	{name:'None',val: -1},
	{name:'Sine',val:0},
	{name:'Square',val:1},
	{name:'Sawtooth',val:2},
	{name:'Triangle',val:3}
];

//AUDIO FILTER TYPES------------
var filterTypes = [
	{name:'Low Pass', val: 1},
	{name:'High Pass', val:2},
	{name:'Band Pass', val:3},
	{name:'Low Shelf', val:4},
	{name:'High Shelf', val:5},
	{name:'Peaking', val:6},
	{name:'Notch', val:7},
	{name:'All Pass', val:8}
];

//OVERDRIVE FILTER TYPES
var overdriveFilterTypes = [
	{index:0,name:"Filter 1"},
	{index:1,name:"Filter 2"},
	{index:2,name:"Filter 3"},
	{index:3,name:"Filter 4"},
	{index:4,name:"Filter 5"}
];

//SAMPLE SPEEDS------------
var speedValues = [
	{label:'&frac14;', value:0.25},
	{label:'&frac12;', value:0.5},
	{label:'&frac34;', value:0.75}];
for (i = 1; i < 33; i++) { speedValues.push({label:i.toString(),value:i});}

// DROP DOWNS ----------------
var controlModules = [
	{module:"",             name:"", notSelectable: true},
	{module:"fxEditor",     name:"FX Editor",       notSelectable: false, enableResize:false, enableMultipleInstances: false, pos:{l:847, t:380} },
	{module:"sampleManager",name:"Sample Manager",  notSelectable: false, enableResize:true,  enableMultipleInstances: false, pos:{l:650, t:10}, startSize:{h:620}, minSize:{h:116} },
	{module:"keyboard",     name:"Keyboard Heatmap",notSelectable: false, enableResize:true,  enableMultipleInstances: false, pos:{l:44, t:10},  startSize:{h:222,w:550}, minSize:{h:222,w:550} },
	{module:"mixer",        name:"Mixer",           notSelectable: false, enableResize:false, enableMultipleInstances: false, pos:{l:100,t:10}  }
];
var audioModules = [
	{module:"",            name:"", notSelectable: true},
	{module:"autoGater",   name:"Auto Gater",       notSelectable: false, enableResize:true,  enableMultipleInstances: true, enableMIDI: true,  enableFX: true,   channelType: intChannelTypeTrack,      pos:{l:44,t:100}, startSize:{h:212},        minSize:{h:116} },
	{module:"autoLooper",  name:"Auto Looper",      notSelectable: false, enableResize:true,  enableMultipleInstances: true, enableMIDI: true,  enableFX: true,   channelType: intChannelTypeTrack,      pos:{l:44,t:100}, startSize:{h:275},        minSize:{h:275} },
	{module:"drumMachine", name:"Drum Machine",     notSelectable: false, enableResize:true,  enableMultipleInstances: true, enableMIDI: true,  enableFX: true,   channelType: intChannelTypeTrack,      pos:{l:44,t:100}, startSize:{h:212},      minSize:{h:116} },
	{module:"drumPads",    name:"Drum Pads",        notSelectable: false, enableResize:true,  enableMultipleInstances: false, enableMIDI: true,  enableFX: true,   channelType: intChannelTypeTrack,      pos:{l:100,t:100},startSize:{w:608},        minSize:{w:314} },
	{module:"lineIn",      name:"Line In",          notSelectable: false, enableResize:false, enableMultipleInstances: false, enableMIDI: false, enableFX: true,   channelType: intChannelTypeTrack,      pos:{l:100,t:100},startSize:{w:230},        minSize:{w:230} },
		{module:"synth",       name:"Synth",            notSelectable: false, enableResize:true,  enableMultipleInstances: false, enableMIDI: false, enableFX: false,  channelType: intChannelTypeSynth,      pos:{l:44, t:245},startSize:{h:640,w:695},  minSize:{h:640    ,w:695} },
	{module:"touchPad",    name:"Touch Pad",        notSelectable: false, enableResize:true,  enableMultipleInstances: true,  enableMIDI: true,  enableFX: true,   channelType: intChannelTypeDualSine,   pos:{l:760,t:10}, startSize:{h:450,w:510},  minSize:{h:320,w:510} }
];
var visualizerChoices = [
	{name:"None",               display:'none',     alwaysClear:true,   composite: "source-over", functionToRun:""},
	{name:"Bars",               display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun:"visBars"},
	{name:"Barcode",            display: 'block',   alwaysClear:true,   composite: "lighter",         functionToRun: "visBarcode"},
	{name:"Bumps",              display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun: "visBumps"},
	{name:"Circle Mountains",   display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun: "visCircleMountains"},
	{name:"Circle Spread",      display: 'block',   alwaysClear:true,   composite: "lighter", functionToRun:"visCircleSpread"},
	{name:"Circle Spread x4",   display: 'block',   alwaysClear:false,  composite: "lighter", functionToRun:"visCircleSpreadX4"},
	{name:"Circle Threads",     display: 'block',   alwaysClear:true,   composite: "lighter",     functionToRun: "visCircleThreads"},
	{name:"Downward Spiral",    display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun: "visSpiral"},
	{name:"Flower",             display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun: "visFlower"},
	{name:"Grid",               display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun:"visGrid"},
	{name:"Hex Map",            display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visHexMap"},
	{name:"MathMachine",        display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun: "visMathMachine"},
	{name:"Mountains",          display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun:"visMountains"},
	{name:"Particle Explosion",   display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visParticleExplosion"},
	{name:"Particle Fountain",  display: 'block',   alwaysClear:true,   composite: "lighter",     functionToRun: "visParticleFountain"},
	{name:"Particle Rings",          display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visParticleRings"},
	{name:"Rectangle Blur",     display: 'block',   alwaysClear:true,   composite: "source-over", functionToRun: "visRectangleBlur"},
	{name:"Scope",              display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visScope"},
	{name:"Spinner",            display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visSpinner"},
	{name:"Spiral Galaxy",      display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visSpiralGalaxy"},
	{name:"Squares",            display: 'block',   alwaysClear:true,   composite: "lighter", functionToRun:"visSquares"},
	{name:"Sun And Clouds",     display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visSunAndClouds"},
	{name:"Tunnel",             display: 'block',   alwaysClear:false,  composite: "source-over", functionToRun:"visTunnel"}

];
var startingVisualization = 0;

// DEFAULT CHANNEL---------------------------------------
var audioChannelTemplate =  {
	active: true,
	channelName: "",
	channelType: intChannelTypePlaceholder,
	meterLeft: {val:0,clipping:false},
	meterRight: {val:0,clipping:false},
	LaunchPadKey: 0,
	soloDisconnect: false,
	soloValue: false,
	muteValue: false,
	pannerLvl: 0,
	selectedFxs: []
};
for (var i = 0; i < numOfFXs; i++) {
	audioChannelTemplate.selectedFxs.push({
		index: 0,
		visible: true,
		fields: {}
	});
}

// DEFAULT SAMPLE---------------------------------------
var defaultSample = {
	demoing: false,
	startPos: 0,
	endPos: 0,
	dp: {
		LPVal: -1,
		keyCode: keyCodes.a,
		playing: false,
		edit: {
			gain: 1,
			tempoSync: false,
			speed: 1,
			loopIndex: 10,
			reverse: false,
			loop: false,
			reMap: false
		}
	},

	dm: {
		values: [],
		showGridControls: false,
		edit: {
			gain: 1,
			tempoSync: false,
			speed: 1,
			loopIndex: 10,
			reverse: false
		}
	},

	ag: {
		values: [],
		showGridControls: false,
		edit: {
			gain: 1,
			tempoSync: true,
			speed: 1,
			loopIndex: 10,
			loop: false,
			reverse: false
		}
	},

	al: {
		values: [],
		showGridControls: false,
		playing: false,
		position : -1,
		group: -1,
		edit: {
			gain: 1,
			tempoSync: true,
			speed: 1,
			loopIndex: 10,
			reverse: false,
			loop: true
		}
	}
};
for (var cell = 0; cell < maxLengthDrumMachine; cell++) { defaultSample.dm.values[cell] = '';    }
for (    cell = 0; cell < maxLengthAutoGater;   cell++) { defaultSample.ag.values[cell] = false;	}
for (    cell = 0; cell < maxLengthAutoLooper;  cell++) { defaultSample.al.values[cell] = false;	}