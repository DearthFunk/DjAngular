angular.module('autoLooperModule', [])

	.directive('autoLooper', function (audioChannelsService, uiToolTipService, audioProcessingService,uiThemeService,uiService) {
		return {
			restrict:'C',
			templateUrl:'modules/autoLooper/autoLooper.html',
			replace: true,
			link: function(scope, element)	{

				scope.groups = [{name:'1', active:false},{name:'2', active:false},{name:'3', active:false},{name:'4', active:false},{name:'5', active:false},{name:'6', active:false}];
				scope.looperLength = startLengthAutoLooper;
				scope.selectedKit = startKitAutoLooper;
				scope.uiToolTipService = uiToolTipService;

				scope.kitChangeAction = {
					functionToRun: function() {
						audioProcessingService.stopAllSound(scope.channel);
					}
				};

				scope.mouseEvents = {
					click: function(e,sampleIndex,cell) {
						var sample = audioProcessingService.samples[sampleIndex].kits[scope.selectedKit];
						sample.al.playing = true;

						if (sample.al.position != -1) {
							audioProcessingService.stopSound(scope.channel,sampleIndex,false,false);
						}

						sample.al.position = cell;
						var start = (sample.endPos - sample.startPos) * (sample.al.position / scope.looperLength);

                        audioProcessingService.playSound(
                            scope.channel,
                            sample.al,
                            sampleIndex,
                            scope.selectedKit,
                            intPlay
                        );
					}
				};

				scope.groupChangeAction = {
					toRun: function(val) {
						for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
							var index = audioProcessingService.kits[scope.selectedKit][i];
							var item = audioProcessingService.samples[index].kits[scope.selectedKit].al;

							if (item.group == val) {
								if (scope.groups[val].active) {
									item.position = 0;
									item.playing = true;
                                    audioProcessingService.playSound(
                                        scope.channel,
                                        item,
                                        index,
                                        scope.selectedKit,
                                        intPlay
                                    );
								}
								else {
									item.playing = false;
									item.position = -1;
                                    audioProcessingService.stopSound(scope.channel,index,false,false);
								}
							}
						}
					}

				};

				scope.iconEntries = [
					{type: "control",
						class:"fa-stop",
						popover: "stopPlayback",
						placement: "right",
						actionableFunction:
							function() {
								audioProcessingService.stopAllSound(scope.channel);
								for (var i = 0; i < audioProcessingService.samples.length; i++) {
									audioProcessingService.samples[i].kits[scope.selectedKit].al.playing = false;
									audioProcessingService.samples[i].kits[scope.selectedKit].al.position =   defaultSample.al.position;
								}
							}
					},
					{type: "control",
						class:"fa-arrow-right",
						popover: "increaseLength",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.looperLength < maxLengthAutoLooper) {
									scope.looperLength++;
								}
							}
					},
					{type: "control",
						class:"fa-arrow-left",
						popover: "decreaseLength",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.looperLength > minLengthAutoLooper) {
									scope.looperLength--;
								}
							}
					},
					{type: "control",
						class:"fa-times",
						popover: "resetGridData",
						placement: "right",
						actionableFunction:
							function() {
								audioProcessingService.stopAllSound(scope.channel);
								for (var i = 0; i < audioProcessingService.samples.length; i++) {
                                    audioProcessingService.samples[i].kits[scope.selectedKit].al = clone(defaultSample.al);
								}
							}
					}
				];

				scope.rowActionIcons = [
					{type: "toggleEntry",
						activeClass:"fa-play",
						inactiveClass: "fa-stop",
						toggleEntry: "playing",
						popover: "playStop",
						placement: "top",
						actionableFunction:
							function(index) {

								var item = audioProcessingService.samples[index].kits[scope.selectedKit].al;

								if (item.position != -1) {
									item.position = -1;
									item.playing = false;
									audioProcessingService.stopSound(scope.channel,index,false,false);
								}
								else {
									item.playing = true;
									item.position = 0;

                                    audioProcessingService.playSound(
                                        scope.channel,
                                        item,
                                        index,
                                        scope.selectedKit,
                                        intPlay
                                    );
								}
							}
					}
				];

				scope.$on('clickEvent', function(e, noteType) {
					if (noteType == 1 && audioProcessingService.buffered) {

						scope.clickTrack++;
						if (scope.clickTrack >= scope.looperLength) {
							scope.clickTrack = 0;
						}

						//UPDATE CELL VALUES

						for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {

							var index = audioProcessingService.kits[scope.selectedKit][i];
							var item = audioProcessingService.samples[index].kits[scope.selectedKit].al;

							if (item.position != -1) {
								item.position++;

								if (item.position >= scope.looperLength) {

									item.playing = false;
									audioProcessingService.stopSound(scope.channel,index,false,false);

									if (item.edit.loop) {
										item.position = 0;
										item.playing = true;
                                        audioProcessingService.playSound(
                                            scope.channel,
                                            item,
                                            index,
                                            scope.selectedKit,
                                            intPlay
                                        );
									}
									else {
										item.playing = false;
										item.position = -1;
									}

								}

							}
						}


					}
				});


			}
		}
	});