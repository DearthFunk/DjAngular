angular.module('midiSelectGroup', [])

	.directive('midiSelect', function(midiService) {
		return {
			restrict:'C',
			scope: {
				channelData: "=channelData"
			},
			templateUrl:'elements/group/midiSelect/midiSelect.html',
			replace: true,
			link: function(scope,elem) {

				scope.midiService = midiService;
				scope.key = 0;

				scope.$on("midiDevicesUpdated", function(){
					scope.channelData.midiIn = 0;
					scope.channelData.midiOut = 0;
				});

				function LaunchPadSelected() {
					var isLaunchPad = (scope.midiService.inputs[scope.channelData.midiIn].deviceName.indexOf("Launchpad") != -1 &&
						scope.midiService.outputs[scope.channelData.midiOut].deviceName.indexOf("Launchpad") != -1);
					return isLaunchPad;
				}


				scope.selectMidiInDevice = {toRun:function(val,index) {
					scope.channelData.midiIn = index;
				}};

				scope.keyActivations = [];

				scope.selectMidiOutDevice = {toRun:function(val,index) {
					scope.channelData.midiOut = index;

					if (LaunchPadSelected()){
						scope.keyActivations = midiService.LaunchPad.rightControls;
						scope.key = 0;
						scope.channelData.LaunchPadKey = 0;
					}
					else {
						scope.keyActivations = [];
						scope.key = '';
						scope.channelData.LaunchPadKey = -1;
					}

				}};

				scope.selectKey = {toRun:function(val, index) {
					scope.key = index;
					if (LaunchPadSelected()) {

						scope.channelData.LaunchPadKey = index;
					}
				}};
			}
		}
	});