angular.module('fxEditorModule', [])

	.directive('fxEditor', function (audioChannelsService, audioProcessingService) {
		return {
			restrict:'C',
			templateUrl:'modules/fxEditor/fxEditor.html',
			replace: true,
			link: function(scope,element) {

				scope.audioChannelsService = audioChannelsService;

			}
		}
	});