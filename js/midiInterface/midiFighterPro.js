var MidiFighter = (function() {
	function MidiFighter() {
		this.data ={
			knob: {val:22,min:0,max:127},
			vertSlider: {val:18,min:0,max:127},
			horizSlider: {val:20,min:0,max:127},
			controlButtons: {
				topLeft: {
					val:2,
					grid: [
						[80, 81, 82, 83],
						[76, 77, 78, 79],
						[72, 73, 74, 75],
						[68, 69, 70, 71]
					]
				},
				topRight: {
					val:0,
					grid: [
						[48, 49, 50, 51],
						[44, 45, 46, 47],
						[40, 41, 42, 43],
						[36, 37, 38, 39]
					]
				},
				botLeft: {
					val:3,
					grid:[
						[96, 97, 98, 99],
						[92, 93, 94, 95],
						[88, 89, 90, 91],
						[84, 85, 86, 87]
					]
				},
				botRight: {
					val:1,
					grid:[
						[64, 65, 66, 67],
						[60, 61, 62, 63],
						[56, 57, 58, 59],
						[52, 53, 54, 55]
					]
				}
			}
		}
	}

	return MidiFighter;
})();