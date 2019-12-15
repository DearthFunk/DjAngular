var themeConstraints = {
	shadowSize: {min:0,max:30,step:0.01},
	shadowBlur: {min:0,max:30,step:0.01},
	opacity:    {min:0,max:1, step:0.01}
};

var backgrounds = [
	{name:"--Custom Color", imgURL:""},
	{name:"Black Leather", imgURL:"url('img/backgrounds/blackLeather.jpg')"},
	{name:"Blue Matrix", imgURL:"url('img/backgrounds/blueMatrix.jpg')"},
	{name:"Blue Skyline", imgURL:"url('img/backgrounds/blueSkyline.jpg')"},
	{name:"Burning Astronaut", imgURL:"url('img/backgrounds/burningAstronaut.jpg')"},
	{name:"Dark Blue Skyline", imgURL:"url('img/backgrounds/darkBlueSkyline.jpg')"},
	{name:"Dark Skyline", imgURL:"url('img/backgrounds/darkSkyline.jpg')"},
	{name:"Fractal Space", imgURL:"url('img/backgrounds/fractalspace.jpg')"},
	{name:"Gas Mask", imgURL:"url('img/backgrounds/gasMaskDark.jpg')"},
	{name:"Gas Masks", imgURL:"url('img/backgrounds/gasMasks.png')"},
	{name:"Greyscale Skyline", imgURL:"url('img/backgrounds/greyScaleSkyline.jpg')"},
	{name:"Orange Gas Mask", imgURL:"url('img/backgrounds/orangeGasMask.jpg')"},
	{name:"Pink Passion", imgURL:"url('img/backgrounds/pinkPassion.jpg')"},
	{name:"Pip Boy", imgURL:"url('img/backgrounds/pipBoy.jpg')"},
	{name:"Pirate Flag", imgURL:"url('img/backgrounds/pirateFlag.jpg')"},
	{name:"Pixelated Wave", imgURL:"url('img/backgrounds/pixelatedWave.jpg')"},
	{name:"Red Skyline", imgURL:"url('img/backgrounds/redSkyline.jpg')"},
	{name:"Speakers", imgURL:"url('img/backgrounds/speakers.jpg')"},
	{name:"Stairs", imgURL:"url('img/backgrounds/stairs.jpg')"},
	{name:"Stormtrooper Fiction", imgURL:"url('img/backgrounds/stormtrooperFiction.jpg')"},
	{name:"Stormtropper Rainbow", imgURL:"url('img/backgrounds/stormtrooperRainbow.jpg')"},
	{name:"Tetris", imgURL:"url('img/backgrounds/tetris.jpg')"},
	{name:"Tree", imgURL:"url('img/backgrounds/tree.jpg')"},
    {name:"White Room", imgURL:"url('img/backgrounds/whiteRoom.jpg')"},
	{name:"Wood - Brown", imgURL:"url('img/backgrounds/woodBrown.jpg')"},
	{name:"Wood - Blue", imgURL:"url('img/backgrounds/woodBlue.jpg')"}
];

var themeCompilerData = {
	container: {
		shadowColor: "",
		shadowSize: 1,
		shadowBlur: 1},
    gridSelect: {
		color: "",
		opacity: 1},
	menuBackground: {
		color: "",
		opacity: 1},
    menuHighlight: {
		color: "",
		opacity: 1},
	containerBackground: {
		color: "",
		opacity: 1},
	keyboardHeatMap: {
		color: "",
		opacity: 1},
	tempoTracker: {
		color: "",
		opacity:1},
	tempoTrackerActive: {
		color: "",
		opacity:1}
};

var blankTheme = {
    notEditable: false,
	styles: {
		tempoTrackerActive:{
			backgroundColor: "rgba(0,0,0,0.2)"},
		tempoTracker:{
			backgroundColor: "rgba(255,255,255,0.2)"},
        global: {
            toolTipToggle: "#888888",
            toolTipToggleHover: "#AAAAAA",
            toolTipToggleActive: "#000000",
            loadingText: "#000000",
            textShadowColor: "#FFFFFF"},
        editSample: {
            markers: "#000000",
            backgroundColor: "#FFFFFF",
            lineColor: "#000000"},
        grid: {
			color: "#000000"},
		gridCell: {
			borderColor: "#000000",
			color: "#FFFFFF"},
		gridCellTempo: {
			backgroundColor: "#999999",
			color: "#FFFFFF"},
		gridCellActive: {
			backgroundColor: "#000000",
			color: "#FFFFFF"},
		buttonSelector:         {
			borderColor: "#000000"},
		buttonSelectorInner:    {
			backgroundColor: "#000000"},
		radioButton:          {
			borderColor: '#000000',
			color:'#000000'},
		radioButtonInner: {
			backgroundColor: '#000000'},
		knob: {
			borderColor: "#000000",
			color:'#000000'},
		sliderVerticalLargeBackground: {
			backgroundColor: "#999999"},
		sliderVerticalLargeThumb: {
			borderColor: "#000000",
			backgroundColor: "#FFFFFF"},
		slider: {
            backgroundColor: "#999999"},
		sliderThumb: {
            backgroundColor: "#000000"},
		numberModifier: {
			color:'#000000'},
		numberModifierLabel: {
			color:'#000000'},
		actionIcons: {
			color:"#000000"},
        gridSelect: {
			backgroundColor: "rgba(100,100,100,0.2)"},
        gridSelectActive: {
			backgroundColor: "#000000"},
		groupActivators: {
			borderColor: "#000000",
			color: "#000000"},
		groupActivatorsActive: {
			backgroundColor: "#999999",
			color: "#000000"},
		dropDownMain: {
			borderColor: "#000000",
			backgroundColor: "#FFFFFF",
			color: '#000000'},
		dropDownList: {
			borderColor: "#000000",
			backgroundColor: "#FFFFFF",
			color: '#000000'},
		dropDownListHover: {
			backgroundColor:"#bbbbbb"},
		dropDownListDisabled: {
			color:"#999999"},
        //------------------------------------
        //------------------------------------
		background: 23,
        //------------------------------------
        loadingAnimation: {
            color: "#000000"},
        //------------------------------------
		keyboard: {
			keyBackground: "#000000",
			textColor: "#FFFFFF",
			borderColor: "#FFFFFF",
			backgroundColor: "rgba(0,0,0,0.8)"},
        //------------------------------------
		drumPads: {
			backgroundColor: "#FFFFFF",
			color: "#000000",
			borderColor: "#000000"},
		drumPadsActive: {
			backgroundColor: "#999999",
			color: "#FFFFFF",
			borderColor: "#000000"},
		drumPadsMouse: {
			backgroundColor: "#DDDDDD",
			color: "#000000",
			borderColor: "#000000"},
		drumPadsModTitle: {
			color: "#000000"},
        //------------------------------------
		menu: {
			backgroundColor: "rgba(255,255,255,0.7)",
			color:"#000000",
			borderColor: "#000000"},
		menuHighlight: {
			backgroundColor: "rgba(200,200,200,0.3)"},
        //------------------------------------
		container: {
			boxShadow: "0px 0px 30px 1px #000000",
			backgroundColor: "rgba(255,255,255,1)",
            borderColor:"#000000"},
		containerResize: {
			backgroundColor:"#000000"},
		containerTopRow: {
			borderColor: "#000000"},
		containerIcons: {
			color: "#000000"},
		containerTitle: {
			borderColor: "#000000",
			color:"#000000"},
        //------------------------------------
		mixerButton: {
			backgroundColor: "#FFFFFF",
			color: "#000000",
			borderColor: "#000000"},
		mixerButtonActive: {
			backgroundColor: "#000000",
			borderColor: "#FFFFFF",
			color: "#FFFFFF"},
		mixerMeterBackground: {
			backgroundColor: "#000000"},
		mixerMeterClipLine: {
			borderColor: "#666666"},
		mixerMeter: {
			backgroundColor: "#BBBBBB"},
		mixerBorder: {
			borderColor: "#000000"},
		mixerText: {
			color: "#000000"},
		mixerTrackBorder: {
			borderColor: "#000000"},
        //------------------------------------
		touchPad: {
			backgroundColor: "#FFFFFF",
			diagonalThickness: 5,
			diagonalColor: "#000000",
			animationStart: '#000000',
			animationMiddle: '#00000',
			animationEnd: '#000000',
            textColor: "#000000"},
		touchPadBorder: {
			borderColor: '#000000'},
        //------------------------------------
        synth: {
			keyboardBlack: '#000000',
			keyboardWhite: '#FFFFFF',
			keyboardBorder: '#000000',
			keyboardSelected: '#888888',
			looperMarker: '#000000',
			looperLine: '#000000',
			looperSection: '#444444',
			indicator: '#000000',
			gainCircle: '#000000',
			gainLine: '#000000',
			sectionLines: '#000000',
			gridLine: '#999999',
			gridLineBar: '#000000',
			noteBorder: '#000000',
			noteColor: '#999999',
			playbackDot: "#000000",
			scrollLine: '#000000',
			scrollBorder: '#000000',
			scrollBackground: '#FFFFFF'},
		synthControlsText: {
			color: "#000000"},
		synthControlsBorder: {
			borderColor:"#000000"},
        //------------------------------------
        fxEditorColumn: {
            borderColor: "#000000",
            color: "#000000"},
        fxEditorFx: {
            borderColor: "#000000",
            color: "#FFFFFF"},
        //------------------------------------
		lineIn: {
			color: "#CCCCCC"},
		lineInActive: {
			color: "#000000"}
    }
};








var themes = [
	{theme: "Dark Red",
    notEditable: true,
    styles: {
	    tempoTrackerActive: {
		    backgroundColor: "rgba(0,255,0,0.2)"},
	    tempoTracker:{
		    backgroundColor: "rgba(255,255,255,0.2)"},

	    global: {
            toolTipToggle: "#888888",
            toolTipToggleActive: "#FFFFFF",
            loadingText: "#FFFFFF",
            textShadowColor: "#000000"},
        editSample: {
            markers: "#FF0000",
            backgroundColor: "#000000",
            lineColor: "#FFFFFF"},
        grid: {
            color: "#FFFFFF"},
        gridCell: {
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        gridCellTempo: {
            backgroundColor: "#FFA600",
            color: "#FFFFFF"},
        gridCellActive: {
            backgroundColor: "#FFFFFF",
            color: "#FFFFFF"},
        buttonSelector:         {
            borderColor: "#FFFFFF"},
        buttonSelectorInner:    {
            backgroundColor: "#9999FF"},
        radioButton:          {
            borderColor: '#FFFFFF',
            color:'#FFFFFF'},
        radioButtonInner: {
            backgroundColor: '#FFFFFF'},
        knob:                   {
            borderColor: "#FFFFFF",
            color:'#FFFFFF'},
        numberModifier: {
            color:'#FFFFFF'},
        numberModifierLabel: {
            color:'#FFFFFF'},
        sliderVerticalLargeBackground: {
            backgroundColor: "#999999"},
        sliderVerticalLargeThumb: {
            borderColor: "#FFFFFF",
            backgroundColor: "#000000"},
        slider: {
            backgroundColor: "#999999"},
        sliderThumb: {
            backgroundColor: "#FFFFFF"},
        actionIcons: {
            color:"#FFFFFF"},
        gridSelect: {
            backgroundColor: "rgba(0,0,0,0.6)"},
        gridSelectActive: {
            backgroundColor: "#FFFFFF"},
        groupActivators: {
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        groupActivatorsActive: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF"},
        dropDownMain: {
            borderColor: "#FFFFFF",
            backgroundColor: "#FFA6A6",
            color: '#000000'},
        dropDownList: {
            borderColor: "#000000",
            backgroundColor: "#FFFFFF",
            color: '#000000'},
        dropDownListHover: {
            backgroundColor:"#FFA6A6"},
        dropDownListDisabled: {
            color:"#999999"},
        //------------------------------------
        //------------------------------------
        background: 16,
        //------------------------------------
        loadingAnimation: {
            color: "#FFFFFF"},
        //------------------------------------
        keyboard: {
            keyBackground: "#000000",
            textColor: "#FFFFFF",
            borderColor: "#FFFFFF",
            backgroundColor: "rgba(255,100,100,0.6)"},
        //------------------------------------
        drumPadsModTitle: {
            color: "#FFFFFF"},
        drumPads: {
            backgroundColor: "#FF0000",
            color: "#FFFFFF",
            borderColor: "#000000"},
        drumPadsActive: {
            backgroundColor: "#750000",
            color: "#FFFFFF",
            borderColor: "#FFFFFF"},
        drumPadsMouse: {
            backgroundColor: "#9999FF",
            color: "#000000",
            borderColor: "#FFFFFF"},
        //------------------------------------
        menu: {
            backgroundColor: "rgba(100,0,0,0.4)",
            color:"#FFFFFF",
            borderColor: "#FFFFFF"},
        menuHighlight: {
            backgroundColor: "rgba(200,200,200,0.3)"},
        //------------------------------------
        container: {
            boxShadow: "0px 0px 10px 3px #FF0000",
            backgroundColor: "rgba(255,0,0,0.7)",
            borderColor:"#FFFFFF"},
        containerResize: {
            backgroundColor: "#FFFFFF"},
        containerTopRow: {
            borderColor: "#FFFFFF"},
        containerIcons: {
            color: "#FFFFFF"},
        containerTitle: {
            borderColor: "#FFFFFF",
            color:"#FFFFFF"},
        //------------------------------------
        mixerButton: {
            backgroundColor: "#FF0000",
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        mixerButtonActive: {
            backgroundColor: "#FFFFFF",
            borderColor: "#FF0000",
            color: "#FF0000"},
        mixerMeterBackground: {
            backgroundColor: "#000000"},
        mixerMeter: {
            backgroundColor: "#9999FF"},
        mixerMeterClipLine: {
            borderColor: "#FF0000"},
        mixerBorder: {
            borderColor: "#FFFFFF"},
        mixerText: {
            color: "#FFFFFF"},
        mixerTrackBorder: {
            borderColor: "#FFFFFF"},
        //------------------------------------
        touchPad: {
            backgroundColor: "#000000",
            diagonalThickness: 2,
            diagonalColor: "#333333",
            animationStart: '#FFFFFF',
            animationMiddle: '#FF0000',
            animationEnd: '#FFFFFF',
            textColor:"#FFFFFF"},
        touchPadBorder: {
            borderColor: '#FFFFFF'},
        //------------------------------------
        synth: {
            keyboardBlack: '#9999FF',
            keyboardWhite: '#FFFFFF',
            keyboardBorder: '#000000',
            keyboardSelected: '#FF0000',
            indicator: '#FFFFFF',
            looperMarker: '#FFFFFF',
            looperLine: '#FFFFFF',
            looperSection: '#000000',
            gainCircle: '#FFFFFF',
            gainLine: '#FFFFFF',
            sectionLines: '#000000',
            gridLine: '#999999',
            gridLineBar: '#FFFFFF',
            noteBorder: '#FFFFFF',
            noteColor: '#9999FF',
            playbackDot: "#FFFFFF",
            scrollLine: '#999999',
            scrollBorder: '#FFFFFF',
            scrollBackground: '#000000'},
	    synthControlsBorder: {
		    borderColor:"#FFFFFF"},
		synthControlsText:{
			color: "#FFFFFF"},

	    //------------------------------------
        fxEditorColumn: {
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        fxEditorFx: {
            borderColor: "#00FF00",
            color: "#FFFFFF"},
        //------------------------------------
        lineIn: {
            color: "#CCCCCC"},
        lineInActive: {
            color: "#9999FF"}
    }},





    {theme: "Blue Shadow",
    notEditable: true,
    styles: {
	    tempoTrackerActive:{
		    backgroundColor: "rgba(0,255,0,0.2)"},
	    tempoTracker: {
		    backgroundColor: "rgba(255,255,255,0.2)"},
	    global: {
            toolTipToggle: "#FFFFFF",
            toolTipToggleActive: "#00FF00",
            loadingText: "#FFFFFF",
            textShadowColor: "#000000"},
        editSample: {
            markers: "#FF0000",
            backgroundColor: "#000000",
            lineColor: "#FFFFFF"},
        grid: {
            color: "#FFFFFF"},
        gridCell: {
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        gridCellTempo: {
            backgroundColor: "#006600",
            color: "#FFFFFF"},
        gridCellActive: {
            backgroundColor: "#00FF00",
            color: "#000000"},
        buttonSelector: {
            borderColor: "#FFFFFF"},
        buttonSelectorInner:{
            backgroundColor: "#00FF00"},
        radioButton: {
            borderColor: '#FFFFFF',
            color:'#FFFFFF'},
        radioButtonInner: {
            backgroundColor: '#FFFFFF'},
        knob: {
            borderColor: "#FFFFFF",
            color:'#FFFFFF'},
        sliderVerticalLargeBackground: {
            backgroundColor: "#999999"},
        sliderVerticalLargeThumb: {
            borderColor: "#FFFFFF",
            backgroundColor: "#000000"},
        slider: {
            backgroundColor: "#999999"},
        sliderThumb: {
            backgroundColor: "#FFFFFF"},
        numberModifier: {
            color:'#FFFFFF'},
        numberModifierLabel: {
            color:'#FFFFFF'},
        actionIcons: {
            color:"#FFFFFF"},
        gridSelect: {
            backgroundColor: "rgba(255,255,255,0.5)"},
        gridSelectActive: {
            backgroundColor: "#00FF00"},
        groupActivators: {
            borderColor: "#FFFFFF",
            color: "#00FF00"},
        groupActivatorsActive: {
            backgroundColor: "#00FF00",
            color: "#000000"},
        dropDownMain: {
            borderColor: "#FFFFFF",
            backgroundColor: "#DEEBFF",
            color: '#000000'},
        dropDownList: {
            borderColor: "#000000",
            backgroundColor: "#FFFFFF",
            color: '#000000'},
        dropDownListHover: {
            backgroundColor:"#D2E4FC"},
        dropDownListDisabled: {
            color:"#999999"},

        //------------------------------------
        //------------------------------------

        background: 6,
        //------------------------------------
        loadingAnimation: {
            color: "#FFFFFF"},
        //------------------------------------
        keyboard: {
            keyBackground: "#000000",
            textColor: "#FFFFFF",
            borderColor: "#FFFFFF",
            backgroundColor: "rgba(200,0,255,0.8)"},
        //------------------------------------
        drumPadsModTitle: {
            color: "#FFFFFF"},
        drumPads: {
            backgroundColor: "#0000FF",
            color: "#FFFFFF",
            borderColor: "#FFFFFF"},
        drumPadsActive: {
            backgroundColor: "#000075",
            color: "#00FF00",
            borderColor: "#FF0000"},
        drumPadsMouse: {
            backgroundColor: "#00FF00",
            color: "#000000",
            borderColor: "#00FF00"},
        //------------------------------------
        menu: {
            backgroundColor: "rgba(0,0,100,0.8)",
            color:"#FFFFFF",
            borderColor: "#FFFFFF"},
        menuHighlight: {
            backgroundColor: "rgba(200,200,200,0.3)"},
        //------------------------------------
        container: {
            boxShadow: "0px 0px 0px 1px #FFFFFF",
            backgroundColor: "rgba(0,0,150,0.6)",
            borderColor:"#FFFFFF"},
        containerResize: {
            backgroundColor:"#FFFFFF"},
        containerTopRow: {
            borderColor: "#FFFFFF"},
        containerIcons: {
            color: "#FFFFFF"},
        containerTitle: {
            borderColor: "#FFFFFF",
            color:"#FFFFFF"},
        //------------------------------------
        mixerButton: {
            backgroundColor: "#0000FF",
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        mixerButtonActive: {
            backgroundColor: "#FFFFFF",
            borderColor: "#0000FF",
            color: "#0000FF"},
        mixerMeterBackground: {
            backgroundColor: "#000000"},
        mixerMeter: {
            backgroundColor: "#FFFFFF"},
        mixerMeterClipLine: {
            borderColor: "#FFFFFF"},
        mixerBorder: {
            borderColor: "#FFFFFF"},
        mixerText: {
            color: "#FFFFFF"},
        mixerTrackBorder: {
            borderColor: "#FFFFFF"},
        //------------------------------------
        touchPad: {
            backgroundColor: "#000040",
            diagonalThickness: 2,
            diagonalColor: "#0000FF",
            animationStart: '#FFFFFF',
            animationMiddle: '#00FF00',
            animationEnd: '#FF0000',
            textColor:"#FFFFFF"},
        touchPadBorder: {
            borderColor: '#FFFFFF'},
        //------------------------------------
        synth: {
            keyboardBlack: '#0000FF',
            keyboardWhite: '#FFFFFF',
            keyboardBorder: '#000000',
            keyboardSelected: '#FF0000',
            indicator: '#FFFFFF',
            looperMarker: '#FFFFFF',
            looperLine: '#0050FF',
            looperSection: '#0000FF',
            sectionLines: '#000000',
            gridLine: '#999999',
            gridLineBar: '#FFFFFF',
            gainCircle: '#FFFFFF',
            gainLine: '#FFFFFF',
            noteBorder: '#FFFFFF',
            noteColor: '#0000FF',
            playbackDot: "#FFFFFF",
            scrollLine: '#999999',
            scrollBorder: '#FFFFFF',
            scrollBackground: '#000000'},
	    synthControlsBorder: {
		    borderColor:"#FFFFFF"},
	    synthControlsText: {
		    color: "#FFFFFF"},

	    //------------------------------------
        fxEditorColumn: {
            borderColor: "#FFFFFF",
            color: "#FFFFFF"},
        fxEditorFx: {
            borderColor: "#8888FF",
            color: "#CCCCCC"},
        //------------------------------------
        sampleManager: {
            color: "#FFFFFF"},
        //------------------------------------
        lineIn: {
            color: "#CCCCCC"},
        lineInActive: {
            color: "#00FF00"}
    }
}
];
themes.push(clone(blankTheme));
themes[themes.length-1].theme = "Chroma";
themes[themes.length-1].notEditable = true;
var startingTheme = 1;
var totalStartingThemes = themes.length;