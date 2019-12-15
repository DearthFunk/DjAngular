angular.module('settingsMIDIModule', [])

	.directive('settingsMIDI', function (uiService,midiService) {
		return {
			restrict:'C',
			templateUrl:'modules/mainMenu/settingsMIDI/settingsMIDI.html',
			replace: true,
			link: function(scope) {

				scope.sectionData = uiService.midiSettings;
				scope.midiService = midiService;


				scope.initMIDI = function(){
					midiService.initMIDI();
				};


			}
		}
	});