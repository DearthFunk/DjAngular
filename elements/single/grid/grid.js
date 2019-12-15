angular.module('gridElement', [])

	.directive('grid', function(uiThemeService, uiToolTipService, audioProcessingService) {
		return {
			restrict:'C',
			scope: {
				kit: "=kit",
				type: "=type",
				length: "=length",
				collapse: "=collapse",
				gridSelect: "=gridSelect",
				clickTrack: "=clickTrack",
				mouseEvents: "=mouseEvents",
				actionIcons: "=actionIcons",
				fontSize: "=fontSize"
			},
			templateUrl:'elements/single/grid/grid.html',
			replace: true,
			link: function(scope) {

				scope.audioProcessingService = audioProcessingService;
				scope.themeService = uiThemeService;
				scope.uiToolTipService = uiToolTipService;
				scope.speedValues = speedValues;
				scope.barPadding = 8;

				scope.click = function(e, sampleIndex, cell ) {
					if (scope.mouseEvents.hasOwnProperty('click')) {scope.mouseEvents.click(e,sampleIndex,cell); }
				};
				scope.mouseDown = function(e, sampleIndex, cell) {
					if (scope.mouseEvents.hasOwnProperty('click') && e.which == 3) {scope.mouseEvents.click(e,sampleIndex,cell); }
					if (scope.mouseEvents.hasOwnProperty('mouseDown')) { scope.mouseEvents.mouseDown(e,sampleIndex,cell); }
				};
				scope.mouseMove = function(e, sampleIndex, cell) {
					if (scope.mouseEvents.hasOwnProperty('mouseMove')) { scope.mouseEvents.mouseMove(e,sampleIndex,cell); }
				};


				scope.toggleVisible = function(index) {
					if (scope.collapse) {
						for (var i = 0; i < audioProcessingService.kits[scope.kit].length; i++) {
							var whichSample = audioProcessingService.kits[scope.kit][i];
							if (whichSample != index) {
								audioProcessingService.samples[whichSample].kits[scope.kit][scope.type].showGridControls = false;
							}
						}
					}
					audioProcessingService.samples[index].kits[scope.kit][scope.type].showGridControls = !audioProcessingService.samples[index].kits[scope.kit][scope.type].showGridControls;
				};


			}
		}
	});