angular.module('masterRecorderElement', [])

	.directive('masterRecorder', function(audioProcessingService, uiThemeService,$rootScope) {
		return {
			restrict:'C',
			scope: {
				channelData: "=channelData"
			},
			templateUrl:'elements/single/masterRecorder/masterRecorder.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;
				scope.recording = false;

				scope.toggleRecording = function() {
					scope.recording = !scope.recording;

                    if (scope.recording) {
                        audioProcessingService.startRecording();
                    }
                    else {
                        audioProcessingService.stopRecording();
                        $rootScope.$broadcast('alertDialog',{
                            title: 'Save To ',
	                        height: 100,
                            closeable: true,
                            message: "You have the option to either save a copy of the file (.wav) to your local computer. Or you can have the recorded sample added as new entry in your samples for re-mixing, then again for re-re-mixing, then again for,.. you get the picture.",
                            buttons: [
                                {label:"Save To File",
                                    toRun:function(){
                                        audioProcessingService.saveRecording();
                                        $rootScope.$broadcast('alertDialogClose');
                                    }
                                },
                                {label:"Save To Samples",
                                    toRun:function(){
                                        audioProcessingService.importRecording();
                                        $rootScope.$broadcast('alertDialogClose');

                                    }
                                }
                            ]
                        });
                    }




				}
			}
		}
	});
