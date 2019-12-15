var visDefaults = {
	hexMap: {
		size: 30,
		minSize: 0,
		dbImpact: 0.02,
		distance: 10,
		stretch: 1000,

		fill: "#FF0000",
		fillOpacity: 700,

		border: "#FFFFFF",
		borderOpacity: 0.2,
		borderWidth: 1,

		showText: false,
		textColor: "#FFFFFF"

	},
	sunAndClouds: {
		minSunSize: 70,
		cloudGrowth: 0.8,
		sunGrowth: 2,
		sunColor: "#FFFF00",
		showScope: true,
		techniClouds: false,
		cloudColor: "#FFFFFF",
		scopeColor: "#FFFFFF"

	},
	bars: {
		color: '#3F00ED',
		width: 20,
		borderWidth: 3,
		borderColor: '#FFFFFF'},
	barcode: {
		color: "#FFFFFF",
		thickness: 20,
		total: 10,
		spacing: 10},
	whirlyParticles: {
		total: 1000,
		maxSize: 70,
		dbIntensity: 1,
		speed: 0.5,
		baseColor: "#FFFF00"
	},
    fountain: {
        name: "Fountain",
        padding: 0.5,
        maxSize: 10,
        xForce: 10,
        yForce: 10,
        reduction: 1,
        total: 1000,
        reverse: false,
        minColor: "#000000",
        maxColor: "#FFFFFF"},
	bumps: {
		topLeft: "#00FF00",
		topRight: "#FF0000",
		bottomLeft: "#0000FF",
		bottomRight: "#FFFB00",
		mirror: true,
		total: 10},
    circlesX4: {
        padding: 0,
        opacity: 1,
        squeeze: 0,
        speed: 1,
        reduction: 0.1,
        total: 1000,
        maxSize: 10,
        colorMin: "#000000",
        colorMax: "#FFFFFF",
        side: [true,true,true,true]
    },
	circles: {
		padding: 100,
		reduction: 3,
		speedSolid: 3,
        speedHighlight: 5,
		squeeze: 0,
		color: {
			min: "#000000",
			max: "#FFFFFF"},
        solid: {
            total: 300,
            maxSize: 150
        },
		highlight: {
			total: 40,
			maxSize: 300}},
	downwardSpiral: {
		numRect: 70,
		borderColor: '#DDDDDD',
		borderWidth: 1,
		color: '#9B30FF',
		stereoSplit: false},
	grid: {
		spacing: 1,
		cellSize: 20,
		dbOpacity: false,
		dBOffBaseOpacity: 0.5,
		colorTop: "#FFFFFF",
		colorBot: "#000000"
	},
    spiralGalaxy :{
        total: 300,
        maxSize: 3,
        dbIntensity: 1,
        speed: 0.01,
        color: "#FFFFFF"
    },
    particles: {
        tracerLines: true,
        innerRadius: 150,
        outerRadius: 300,
        dbIntensity: 60,
        maxSize: 5,
        total: 500,
        speed: 0.05
    },
	mathMachine: {
		levels: 1,
		total:10,
		radius: 300,
		pointLines: false,
		dbOpacity: false,
		squareColor: "#FFFFFF"},
	mountains: {
		color: "#00FF00",
		thickness: 10},
    spinner: {
        color: "#FFFFFF",
        innerRadius: 20,
        totalCircles:5,
        linesPerLayer: 20,
        circleSize: 120,
        circlePadding: 2,
        speed: 0.01,
        dbSpeedImpact: 1000,
        lineThickness: 5,
        dbStretch: 1},
    squares: {
        padding: 5,
        cellSize: 40,
        growth: 0.2,
        borderColor: "#FFFFFF",
        borderColorQuiet: "#555555",
        borderColorDb: "##0000FF",
        fillColor: "#00FF00"
    },
	scope: {
		thickness: 5,
		color: "#FFFFFF"},
	tunnel: {
		color: "#FFFFFF",
		speed: 1,
		dbOpacity: false},
	circleThreads: {
		color: "#666666",
		highlightColor: "#0000AA",
		highlightConsistency: 2,
		radiusSpeed: 5,
		columns: 30,
        decaySpeed: 5,
        reverse: true,
		paddingSides: 150,
		totalPerColumn: 30},
	circleMountains: {
		tipColor: "#00FF00",
		tipThickness: 7,
		color: "#B9B9B9",
		columns:50,
		paddingBottom:10,
		paddingSides:10,
		radiusGrowth:0.6,
		verticalSpacing: 30},
	rectangleBlur: {
		barColor: "#660000",
		barBorder: "#FFFFFF",
		circleColor: "#FF0000",
		columns: 50,
		totalCircles:1000,
		circleMaxSize: 100,
		circleReduction: 5,
		paddingSides: 50,
		spacing: 5,
		cellSize: 30
	},
	flower: {
		leavesTotal: 10,
		leavesColor: "#FF0000",
		leavesBorder: "#FFFFFF",
		leavesOpacity: 10,
		totalCircleDecay: 200,
		circleColor: "#00FF00",
		budRadius: 50,
		budColor: "#00FF00",
		budBorder: "#000000",
		budBumpsColor: "#009900",
		budBumpsBorder: "#FFFFFF",
		budBumpsRadius: 4,
		showScope: true,
		scopeColor: "#FFFFFF",
		stemShow: true,
		stemColor: "#5E2605",
		stemSize: "16",
		showLines: true,
		lineColor: "#FFFFFF",
		lineSize: 4,
		lineLength: 5
	}
};
