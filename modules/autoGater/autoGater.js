angular.module('autoGaterModule', [])

	.directive('autoGater', function (audioProcessingService,uiThemeService,uiToolTipService,uiService,audioChannelsService,midiService) {
		return {
			restrict:'C',
			templateUrl:'modules/autoGater/autoGater.html',
			replace: true,
			link: function(scope, element)	{

				var drawingCells = false;
				var activating = false;

				scope.uiService = uiService;
				scope.uiToolTipService = uiToolTipService;
				scope.clickTrack = -1;
				scope.gateLength = startLengthAutoGater;
                scope.playing = false;
				scope.selectedKit = startKitAutoGater;



				scope.$on('mouseUpEvent',function(args){
                    drawingCells = false;
                    activating = false;

                });

				scope.mouseEvents = {
					mouseMove: function(e,sampleIndex,cell) {
						var sample = audioProcessingService.samples[sampleIndex].kits[scope.selectedKit];
						if (drawingCells) {
							activating ?
								sample.ag.values[cell] = true :
								sample.ag.values[cell] = false;
						}
					},
					mouseDown: function(e,sampleIndex,cell) {
						var sample = audioProcessingService.samples[sampleIndex].kits[scope.selectedKit];
						if (e.which == 1) {
							sample.ag.values[cell] = true;
							drawingCells = true;
							activating = true;
						}
						if (e.which == 3) {
							sample.ag.values[cell] = false;
							drawingCells = true;
							activating = false;
						}
					}
				};


				scope.iconEntries = [
                    {type: "toggle",
                        activeClass:"fa-play",
                        inactiveClass: "fa-stop",
	                    classToggle: scope.playing,
	                    popover: "playStop",
	                    placement: "right",
	                    actionableFunction:
		                    function() {
			                    scope.playing = !scope.playing;
			                    scope.clickTrack = -1;
			                    this.classToggle = scope.playing;
			                    if (!scope.playing) {
				                    audioProcessingService.stopAllSound(scope.channel);
			                    }
		                    }
                    },
                    {type: "control",
                        class:"fa-arrow-right",
	                    popover: "increaseLength",
	                    placement: "right",
                        actionableFunction:
                            function() {
                                if (scope.gateLength < maxLengthAutoGater) {
                                    scope.gateLength++;
                                }
                            }
                    },
                    {type: "control",
                        class:"fa-arrow-left",
	                    popover: "decreaseLength",
	                    placement: "right",
                        actionableFunction:
                            function() {
                                if (scope.gateLength > minLengthAutoGater) {
                                    scope.gateLength--;
                                }
                            }
                    },
                    {type: "control",
                        class:"fa-times",
	                    popover: "resetGridData",
	                    placement: "right",
	                    actionableFunction:
                            function() {
                                for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
	                                var index = audioProcessingService.kits[scope.selectedKit][i];
                                    for (var entry = 0; entry < audioProcessingService.samples[index].kits[scope.selectedKit].ag.values.length; entry++) {
                                        audioProcessingService.samples[index].kits[scope.selectedKit].ag.values[entry] = false;
                                    }
                                    audioProcessingService.samples[index].kits[scope.selectedKit].ag.showGridControls = false;
                                    audioProcessingService.samples[index].kits[scope.selectedKit].ag.loopIndex = defaultSample.ag.loopIndex;
                                    audioProcessingService.samples[index].kits[scope.selectedKit].ag.gain = defaultSample.ag.gain;
                                    audioProcessingService.samples[index].kits[scope.selectedKit].ag.reverse = defaultSample.ag.reverse;
                                }
                            }
                    }
				];

				scope.kitChangeAction = {
					functionToRun: function() {
						audioProcessingService.stopAllSound(scope.channel);
					}
				};

				scope.$on("midiUpdate", function(event,data) {
					var key = scope.channel.LaunchPadKey;
					if (midiService.LaunchPad != undefined && midiService.LaunchPad.rightControls[key] != undefined) {

						if (midiService.LaunchPad.rightControls[key].active) {

							var keyCode = data.msg.data1;
							var upDown = data.msg.data2;

							if (upDown == 0) {

								//handle kit changes
								if (keyCode == midiService.LaunchPad.topControls.up.numVal   && scope.selectedKit < audioProcessingService.kits.length-1){
									scope.selectedKit++;
									midiService.LaunchPad.lightUpGaterButtons(audioProcessingService.samples,scope.selectedKit); }
								if (keyCode == midiService.LaunchPad.topControls.down.numVal && scope.selectedKit > 0) {
									scope.selectedKit--;
									midiService.LaunchPad.lightUpGaterButtons(audioProcessingService.samples,scope.selectedKit);}


								if (keyCode.toString() in midiService.LaunchPad.grid) {

									var y = Math.floor(keyCode/16);
									var x = keyCode%16;
									var index = [];
									for (var i = 0; i < audioProcessingService.samples.length; i++) {
										if (audioProcessingService.samples[i].kits[scope.selectedKit].active) {
											index.push(i);
										}
									}

									audioProcessingService.samples[index[y]].kits[scope.selectedKit].ag.values[x] =
										!audioProcessingService.samples[index[y]].kits[scope.selectedKit].ag.values[x];

									audioProcessingService.samples[index[y]].kits[scope.selectedKit].ag.values[x] ?
										midiService.LaunchPad.toggleGridKey("on",keyCode,"green") :
										midiService.LaunchPad.toggleGridKey("off",keyCode);


								}
							}
						}
					}

				});

                scope.$on('clickEvent', function(e,noteType) {

                    if (scope.playing && noteType == 1) {
                        scope.clickTrack++;
                        if (scope.clickTrack >= scope.gateLength) {
                            scope.clickTrack = 0;
                        }
                        for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
                            var index = audioProcessingService.kits[scope.selectedKit][i];
	                        if (scope.clickTrack == 0) {
	                            audioProcessingService.stopSound(scope.channel,index,false,false);

                                audioProcessingService.playSound(
                                    scope.channel,
                                    audioProcessingService.samples[index].kits[scope.selectedKit].ag,
                                    index,
                                    scope.selectedKit,
                                    intPlay
                                );
                            }


                            audioProcessingService.samples[index].kits[scope.selectedKit].ag.values[scope.clickTrack] ?
                                audioProcessingService.updateGain(scope.channel,index,audioProcessingService.samples[index].kits[scope.selectedKit].ag.edit.gain) :
                                audioProcessingService.updateGain(scope.channel,index,0);

                        }

                    }
                });
			}
		}
	});