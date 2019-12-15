angular.module('tempoTrackerElement', [])

	.directive('tempoTracker', function(uiThemeService, audioProcessingService) {
		return {
			restrict:'C',
			templateUrl:'elements/single/tempoTracker/tempoTracker.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;
				scope.audioProcessingService = audioProcessingService;

				scope.getArray=function(n){	return new Array(n);};

			}
		}
	});