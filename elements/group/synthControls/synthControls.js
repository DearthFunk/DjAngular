angular.module('synthControlsGroup', [])

	.directive('synthControls', function (uiThemeService) {
		return {
			restrict:'C',
			scope: {
				selectedSynth: "=selectedSynth",
				synthTemplates: "=synthTemplates"
			},
			templateUrl:'elements/group/synthControls/synthControls.html',
			replace: true,
			link: function(scope,element) {

				scope.uiThemeService = uiThemeService;
                scope.optionWaveTypes = audioWaveTypes;
                scope.optionFilterTypes = filterTypes;
				scope.optionOverdriveFilterTypes = overdriveFilterTypes;
				scope.minFreq = audioFreqMin;
                scope.maxFreq = audioFreqMax;
                scope.audioQmin = audioQmin;
                scope.audioQmax = audioQmax;
				scope.detuneRange = synthDetuneRange;

			}
		}
	});