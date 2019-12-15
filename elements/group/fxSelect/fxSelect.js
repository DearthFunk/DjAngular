angular.module('fxSelectGroup', [])

	.directive('fxSelect', function(audioProcessingService) {
		return {
			restrict:'C',
			scope: {
				channelData: "=channelData"
			},
			templateUrl:'elements/group/fxSelect/fxSelect.html',
			replace: true,
			link: function(scope) {


				scope.fxs = clone(fxs);

				scope.fxChange = {
					toRun: function(item,index,sendback){
						scope.channelData.selectedFxs[sendback] = clone(fxs[index]);
						reCheckNotSelectableValues();
						audioProcessingService.updateFxs(scope.channelData);
					}
				};

				scope.$on('fxRemovedFromEditorEvent', function(e) {
					reCheckNotSelectableValues();
				});

				function reCheckNotSelectableValues() {
					for (var i = 0; i < scope.fxs.length; i++) {
						scope.fxs[i].notSelectable = false;
					}
					for (i = 0; i < scope.channelData.selectedFxs.length; i++) {
						if (scope.channelData.selectedFxs[i].index != 0) {
							scope.fxs[scope.channelData.selectedFxs[i].index].notSelectable = true;
						}
					}
				}


			}
		}
	});

