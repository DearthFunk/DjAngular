
var maxKits = 10;
var kits = [

	[// KIT 0 ------------------------------------
		{keyCode: keyCodes.numpad0,  sampleIndex:28, LPmidiVal:112},
		{keyCode: keyCodes.numpad1,  sampleIndex:29, LPmidiVal:97},
		{keyCode: keyCodes.numpad2,  sampleIndex:30, LPmidiVal:114},
		{keyCode: keyCodes.numpad3,  sampleIndex:31,  LPmidiVal:113},
		{keyCode: keyCodes.numpad4,  sampleIndex:32, LPmidiVal:16},
		{keyCode: keyCodes.numpad5,  sampleIndex:33, LPmidiVal:32},
		{keyCode: keyCodes.numpad6,  sampleIndex:34, LPmidiVal:48},
		{keyCode: keyCodes.numpad7,  sampleIndex:35, LPmidiVal:64},
		{keyCode: keyCodes.numpad8,  sampleIndex:36, LPmidiVal:80},
		{keyCode: keyCodes.numpad9,  sampleIndex:37, LPmidiVal:96},
		{keyCode: keyCodes.divide,   sampleIndex:38, LPmidiVal:17},
		{keyCode: keyCodes.multiply, sampleIndex:39, LPmidiVal:33},
		{keyCode: keyCodes.subtract, sampleIndex:40, LPmidiVal:49},
		{keyCode: keyCodes.add,      sampleIndex:41, LPmidiVal:65},
		{keyCode: keyCodes.numpadEnter, sampleIndex:42, LPmidiVal:81},
		{keyCode: keyCodes.decimalPoint,sampleIndex:43, LPmidiVal:19}
	],

	[// KIT 1 ------------------------------------
		{keyCode: keyCodes.a,           sampleIndex:85, LPmidiVal:96},
		{keyCode: keyCodes.b,           sampleIndex:86, LPmidiVal:97},
		{keyCode: keyCodes.c,           sampleIndex:87, LPmidiVal:98},
		{keyCode: keyCodes.d,           sampleIndex:88, LPmidiVal:112},
		{keyCode: keyCodes.e,           sampleIndex:89, LPmidiVal:113},
		{keyCode: keyCodes.f,           sampleIndex:90, LPmidiVal:114},
		{keyCode: keyCodes.g,           sampleIndex:91, LPmidiVal:115},
		{keyCode: keyCodes.h,           sampleIndex:92, LPmidiVal:115},
		{keyCode: keyCodes.i,           sampleIndex:93, LPmidiVal:115},
		{keyCode: keyCodes.j,           sampleIndex:94, LPmidiVal:115},
		{keyCode: keyCodes.k,           sampleIndex:95, LPmidiVal:115},
		{keyCode: keyCodes.l,           sampleIndex:96, LPmidiVal:115},
		{keyCode: keyCodes.m,           sampleIndex:97, LPmidiVal:115},
		{keyCode: keyCodes.n,           sampleIndex:98, LPmidiVal:115},
		{keyCode: keyCodes.o,           sampleIndex:99, LPmidiVal:115},
		{keyCode: keyCodes.p,           sampleIndex:100, LPmidiVal:115},
		{keyCode: keyCodes.q,           sampleIndex:101, LPmidiVal:115},
		{keyCode: keyCodes.r,           sampleIndex:102, LPmidiVal:115},
		{keyCode: keyCodes.s,           sampleIndex:103, LPmidiVal:115},
		{keyCode: keyCodes.t,           sampleIndex:104, LPmidiVal:115},
		{keyCode: keyCodes.u,           sampleIndex:105, LPmidiVal:115},
		{keyCode: keyCodes.v,           sampleIndex:106, LPmidiVal:115},
		{keyCode: keyCodes.w,           sampleIndex:107, LPmidiVal:115},
		{keyCode: keyCodes.x,           sampleIndex:108, LPmidiVal:115},
		{keyCode: keyCodes.y,           sampleIndex:109, LPmidiVal:115},
		{keyCode: keyCodes.z,           sampleIndex:110, LPmidiVal:115},
		{keyCode: keyCodes.one,         sampleIndex:111, LPmidiVal:1},
		{keyCode: keyCodes.two,         sampleIndex:112, LPmidiVal:1},
		{keyCode: keyCodes.three,       sampleIndex:113, LPmidiVal:1},
		{keyCode: keyCodes.four,        sampleIndex:114, LPmidiVal:1},
		{keyCode: keyCodes.five,        sampleIndex:115, LPmidiVal:1},
		{keyCode: keyCodes.six,         sampleIndex:116, LPmidiVal:1},
		{keyCode: keyCodes.seven,       sampleIndex:117, LPmidiVal:1},
		{keyCode: keyCodes.eight,       sampleIndex:118, LPmidiVal:1},
		{keyCode: keyCodes.nine,        sampleIndex:119, LPmidiVal:1},
		{keyCode: keyCodes.zero,        sampleIndex:120, LPmidiVal:1},
		{keyCode: keyCodes.numpad0,  sampleIndex:121, LPmidiVal:112},
		{keyCode: keyCodes.numpad1,  sampleIndex:122, LPmidiVal:97},
		{keyCode: keyCodes.numpad2,  sampleIndex:123, LPmidiVal:114},
		{keyCode: keyCodes.numpad3,  sampleIndex:124,  LPmidiVal:113},
		{keyCode: keyCodes.numpad4,  sampleIndex:125, LPmidiVal:16},
		{keyCode: keyCodes.numpad5,  sampleIndex:126, LPmidiVal:32},
		{keyCode: keyCodes.numpad6,  sampleIndex:127, LPmidiVal:48},
		{keyCode: keyCodes.numpad7,  sampleIndex:128, LPmidiVal:64},
		{keyCode: keyCodes.numpad8,  sampleIndex:129, LPmidiVal:80},
		{keyCode: keyCodes.numpad9,  sampleIndex:130, LPmidiVal:96},
		{keyCode: keyCodes.divide,   sampleIndex:131, LPmidiVal:17},
		{keyCode: keyCodes.multiply, sampleIndex:132, LPmidiVal:33},
		{keyCode: keyCodes.subtract, sampleIndex:133, LPmidiVal:49},
		{keyCode: keyCodes.add,      sampleIndex:134, LPmidiVal:65},
		{keyCode: keyCodes.numpadEnter, sampleIndex:135, LPmidiVal:81},
		{keyCode: keyCodes.decimalPoint,sampleIndex:136, LPmidiVal:19}
	],

	[// KIT 2 ------------------------------------
		{keyCode: keyCodes.leftArrow,   sampleIndex:56, LPmidiVal:112},
		{keyCode: keyCodes.upArrow,     sampleIndex:52, LPmidiVal:97},
		{keyCode: keyCodes.rightArrow,  sampleIndex:72, LPmidiVal:114},
		{keyCode: keyCodes.downArrow,   sampleIndex:54,  LPmidiVal:113},
		{keyCode: keyCodes.q,           sampleIndex:18, LPmidiVal:0},
		{keyCode: keyCodes.w,           sampleIndex:19, LPmidiVal:1},
		{keyCode: keyCodes.e,           sampleIndex:20, LPmidiVal:2},
		{keyCode: keyCodes.r,           sampleIndex:21, LPmidiVal:3},
		{keyCode: keyCodes.t,           sampleIndex:22, LPmidiVal:16},
		{keyCode: keyCodes.y,           sampleIndex:23, LPmidiVal:17},
		{keyCode: keyCodes.u,           sampleIndex:24, LPmidiVal:18},
		{keyCode: keyCodes.a,           sampleIndex:7, LPmidiVal:19},
		{keyCode: keyCodes.s,           sampleIndex:6, LPmidiVal:32},
		{keyCode: keyCodes.d,           sampleIndex:5, LPmidiVal:33},
		{keyCode: keyCodes.f,      sampleIndex:4, LPmidiVal:34},
		{keyCode: keyCodes.z,       sampleIndex:0, LPmidiVal:35},
		{keyCode: keyCodes.x,           sampleIndex:1, LPmidiVal:48},
		{keyCode: keyCodes.c,      sampleIndex:2, LPmidiVal:49},
		{keyCode: keyCodes.v,       sampleIndex:3, LPmidiVal:50}
	],

	[// KIT 3 ------------------------------------
		{keyCode: keyCodes.leftArrow,   sampleIndex:55, LPmidiVal:112},
		{keyCode: keyCodes.upArrow,     sampleIndex:27, LPmidiVal:97},
		{keyCode: keyCodes.rightArrow,  sampleIndex:26, LPmidiVal:114},
		{keyCode: keyCodes.downArrow,   sampleIndex:54,  LPmidiVal:113},
		{keyCode: keyCodes.q,           sampleIndex:86, LPmidiVal:0},
		{keyCode: keyCodes.w,           sampleIndex:85, LPmidiVal:1},
		{keyCode: keyCodes.e,           sampleIndex:84, LPmidiVal:2},
		{keyCode: keyCodes.a,           sampleIndex:83, LPmidiVal:3},
		{keyCode: keyCodes.s,           sampleIndex:82, LPmidiVal:16},
		{keyCode: keyCodes.d,           sampleIndex:81, LPmidiVal:17},
		{keyCode: keyCodes.z,           sampleIndex:80, LPmidiVal:18},
		{keyCode: keyCodes.x,           sampleIndex:79, LPmidiVal:19},
		{keyCode: keyCodes.c,           sampleIndex:78, LPmidiVal:32}
	],

	[// KIT 4 ------------------------------------
		{keyCode: keyCodes.leftArrow,   sampleIndex:56, LPmidiVal:112},
		{keyCode: keyCodes.upArrow,     sampleIndex:54, LPmidiVal:97},
		{keyCode: keyCodes.rightArrow,  sampleIndex:27, LPmidiVal:114},
		{keyCode: keyCodes.downArrow,   sampleIndex:14,  LPmidiVal:113},
		{keyCode: keyCodes.q,       sampleIndex:44, LPmidiVal:0},
		{keyCode: keyCodes.w,       sampleIndex:45, LPmidiVal:1},
		{keyCode: keyCodes.e,       sampleIndex:46, LPmidiVal:2},
		{keyCode: keyCodes.r,       sampleIndex:47, LPmidiVal:3},
		{keyCode: keyCodes.a,       sampleIndex:48, LPmidiVal:4},
		{keyCode: keyCodes.s,       sampleIndex:49, LPmidiVal:5},
		{keyCode: keyCodes.d,       sampleIndex:50, LPmidiVal:6},
		{keyCode: keyCodes.f,       sampleIndex:51, LPmidiVal:7}
	],

	[// KIT 5 ------------------------------------
		{keyCode: keyCodes.downArrow,   sampleIndex:89, LPmidiVal:81},
		{keyCode: keyCodes.upArrow,     sampleIndex:52, LPmidiVal:113},
		{keyCode: keyCodes.leftArrow,   sampleIndex:118, LPmidiVal:112},
		{keyCode: keyCodes.rightArrow,  sampleIndex:72, LPmidiVal:96},

		{keyCode: keyCodes.a,       sampleIndex:61, LPmidiVal:4},
		{keyCode: keyCodes.s,       sampleIndex:60, LPmidiVal:5},
		{keyCode: keyCodes.d,       sampleIndex:59, LPmidiVal:6},
		{keyCode: keyCodes.f,       sampleIndex:58, LPmidiVal:7},

		{keyCode: keyCodes.z,       sampleIndex:17, LPmidiVal:7},
		{keyCode: keyCodes.x,       sampleIndex:16, LPmidiVal:7},
		{keyCode: keyCodes.c,       sampleIndex:14, LPmidiVal:7},
		{keyCode: keyCodes.v,       sampleIndex:13, LPmidiVal:7},

		{keyCode: keyCodes.q,       sampleIndex:64, LPmidiVal:7},
		{keyCode: keyCodes.w,       sampleIndex:63, LPmidiVal:7},
		{keyCode: keyCodes.e,       sampleIndex:62, LPmidiVal:7},

		{keyCode: keyCodes.one,       sampleIndex:71, LPmidiVal:7},
		{keyCode: keyCodes.two,       sampleIndex:70, LPmidiVal:7},
		{keyCode: keyCodes.three,       sampleIndex:69, LPmidiVal:7},
		{keyCode: keyCodes.four,       sampleIndex:68, LPmidiVal:7},
		{keyCode: keyCodes.five,       sampleIndex:67, LPmidiVal:7},
		{keyCode: keyCodes.six,       sampleIndex:66, LPmidiVal:7},
		{keyCode: keyCodes.seven,       sampleIndex:65, LPmidiVal:7},

		{keyCode: keyCodes.numpad0,  sampleIndex:28, LPmidiVal:112},
		{keyCode: keyCodes.numpad1,  sampleIndex:29, LPmidiVal:97},
		{keyCode: keyCodes.numpad2,  sampleIndex:30, LPmidiVal:114},
		{keyCode: keyCodes.numpad3,  sampleIndex:31,  LPmidiVal:113},
		{keyCode: keyCodes.numpad4,  sampleIndex:32, LPmidiVal:16},
		{keyCode: keyCodes.numpad5,  sampleIndex:33, LPmidiVal:32},
		{keyCode: keyCodes.numpad6,  sampleIndex:34, LPmidiVal:48},
		{keyCode: keyCodes.numpad7,  sampleIndex:35, LPmidiVal:64},
		{keyCode: keyCodes.numpad8,  sampleIndex:36, LPmidiVal:80},
		{keyCode: keyCodes.numpad9,  sampleIndex:37, LPmidiVal:96},
		{keyCode: keyCodes.divide,   sampleIndex:38, LPmidiVal:17},
		{keyCode: keyCodes.multiply, sampleIndex:39, LPmidiVal:33},
		{keyCode: keyCodes.subtract, sampleIndex:40, LPmidiVal:49},
		{keyCode: keyCodes.add,      sampleIndex:41, LPmidiVal:65},
		{keyCode: keyCodes.numpadEnter, sampleIndex:42, LPmidiVal:81},
		{keyCode: keyCodes.decimalPoint,sampleIndex:43, LPmidiVal:19}



	]
];



