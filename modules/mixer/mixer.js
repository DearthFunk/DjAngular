angular.module('mixerModule', [])

    .directive('mixer', function(audioChannelsService,audioProcessingService,uiThemeService,midiService) {
        return {
            restrict:'C',
            templateUrl:'modules/mixer/mixer.html',
	        replace: true,
            link: function(scope) {

	            scope.themeService = uiThemeService;
	            scope.audioChannelService = audioChannelsService;
				scope.midiService = midiService;
                scope.clickClassToggle = true;
	            scope.clickTrack = 1;

	            scope.$on('clickEvent',function(e, noteType){
		            if (noteType == 1) {
			            scope.clickTrack++;
			            if (scope.clickTrack >= (audioProcessingService.playValues.bars * audioProcessingService.playValues.beats)) {
				            scope.clickTrack = 0;
			            }
		            }
	            });

	            scope.iconEntries = [
		            {type: "toggle",
			            activeClass:"fa-dot-circle-o",
			            inactiveClass: "fa-circle-o",
			            classToggle: scope.clickClassToggle,
			            actionableFunction: function() {
				            audioProcessingService.playValues.clickTrack = !audioProcessingService.playValues.clickTrack;
				            audioProcessingService.playValues.clickTrack ?
					            scope.clickClassToggle = false :
					            scope.clickClassToggle = true;
							this.classToggle = scope.clickClassToggle;
			            }
		            }
	            ];

	            scope.changeClickLocation = {
		            toRun: function(index) {

		            }
	            };

            }
        }
    });

