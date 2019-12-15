var fxs = [
    {
	    index:0,
	    type: " ",
        visible: false,
        notSelectable: false},
    {
	    index:1,
	    type: "Cabinet",
	    visible: true,
	    notSelectable: false,
	    values: {
	        makeupGain: 1,                                 //0 to 20
	        impulsePath: "impulses/impulse_guitar.wav",    //path to your speaker impulse
	        bypass: false}          //the value 1 starts the effect as bypassed, 0 or 1
    },
    {
	    index:2,
		type:"Chorus",
	    visible: true,
	    notSelectable: false,
	    values: {
	        rate: 1.5,         //0.01 to 8+
	        feedback: 0.2,     //0 to 1+
	        delay: 0.0045,     //0 to 1
	        bypass: false}
    },
    {
	    index:3,
	    type:"Compressor",
	    visible: true,
	    notSelectable: false,
	    values: {
	        threshold: 0.5,    //-100 to 0
	        makeupGain: 1,     //0 and up
	        attack: 1,         //0 to 1000
	        release: 0,        //0 to 3000
	        ratio: 4,          //1 to 20
	        knee: 5,           //0 to 40
	        automakeup: true,  //true/false
	        bypass: false}
    },
    {
	    index:4,
	    type:"Convolver",
	    visible: true,
	    notSelectable: false,
		values: {
	        highCut: 22050,                         //20 to 22050
	        lowCut: 20,                             //20 to 22050
	        dryLevel: 1,                            //0 to 1+
	        wetLevel: 1,                            //0 to 1+
	        level: 1,                               //0 to 1+, adjusts total output of both wet and dry
	        impulse: "impulses/impulse_rev.wav",    //the path to your impulse response
	        bypass: false}
	},
    {
	    index:5,
	    type:"Delay",
	    notSelectable: false,
	    visible: true,
		values: {
	        feedback: 0.45,    //0 to 1+
	        delayTime: 150,    //how many milliseconds should the wet signal be delayed?
	        wetLevel: 0.25,    //0 to 1+
	        dryLevel: 1,       //0 to 1+
	        cutoff: 20,        //cutoff frequency of the built in highpass-filter. 20 to 22050
	        bypass: false}
	},
    {
	    index:6,
	    type:"Filter",
	    visible: true,
	    notSelectable: false,
		values: {
	        frequency: 20,         //20 to 22050
	        Q: 1,                  //0.001 to 100
	        gain: 0,               //-40 to 40
	        //bypass: 1,             //0 to 1+
	        filterType: 0,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
	        bypass: false}
    },
    {
	    index:7,
	    type:"Overdrive",
	    visible: true,
	    notSelectable: false,
		values: {
	        outputGain: 0.5,         //0 to 1+
	        drive: 0.7,              //0 to 1
	        curveAmount: 1,          //0 to 1
	        algorithmIndex: 0,       //0 to 5, selects one of our drive algorithms
	        bypass: false}
    },
    {
	    index:8,
	    type:"Phaser",
	    visible: true,
	    notSelectable: false,
        values: {
		    rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
	        depth: 0.3,                    //0 to 1
	        feedback: 0.2,                 //0 to 1+
	        stereoPhase: 30,               //0 to 180
	        baseModulationFrequency: 700,  //500 to 1500
	        bypass: false}
    },
	{
		index:9,
		type:"Tremolo",
		visible: true,
		notSelectable: false,
        values: {
			intensity: 0.3,    //0 to 1
	        rate: 0.1,         //0.001 to 8
	        stereoPhase: 0,    //0 to 180
	        bypass: false}
	},
    {
	    index:10,
	    type:"WahWah",
	    visible: true,
	    notSelectable: false,
        values: {
		    automode: true,                //true/false
	        baseFrequency: 0.5,            //0 to 1
	        excursionOctaves: 2,           //1 to 6
	        sweep: 0.2,                    //0 to 1
	        resonance: 10,                 //1 to 100
	        sensitivity: 0.5,              //-1 to 1
	        bypass: false}
    },
	{
		index:11,
		type:"BitCrusher",
		visible: true,
		notSelectable: false,
		values: {
			bits: 4,  //1-16
			bufferSize: 4096, //256-16384
			normFreq: 0.1, //0.0001-1
			bypass: false}
	}
];
