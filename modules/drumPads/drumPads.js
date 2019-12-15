angular.module('drumPadsModule', [])

	.directive('drumPads', function (audioProcessingService, uiToolTipService, audioChannelsService, midiService, uiThemeService, $sce) {
		return {
			restrict:'C',
			templateUrl:'modules/drumPads/drumPads.html',
			replace: true,
			link: function(scope) {

				scope.themeService = uiThemeService;
				scope.uiToolTipService = uiToolTipService;

				scope.selectedKit = startKitDrumPads;
				scope.editingIndex = -1;

				scope.bindCharacter = function(val) {
					return $sce.trustAsHtml(val);
				};

				scope.mapPad = function(index) {
					if (scope.editingIndex != -1) {
						audioProcessingService.samples[scope.editingIndex].kits[scope.selectedKit].dp.edit.reMap = false;
					}
					scope.editingIndex == index ? scope.editingIndex = -1 : scope.editingIndex = index;
				};
				scope.$on('sampleLoadComplete',function() {
					if (midiService.LaunchPad != undefined) {
						lightUpKit();
					}
				});


				scope.$on('keyDownEvent', function(event,args) {
					if (audioProcessingService.buffered) {
						for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
							var index = audioProcessingService.kits[scope.selectedKit][i];

								if (audioProcessingService.samples[index].kits[scope.selectedKit].dp.keyCode.code == args.keyCode) {
									if (!audioProcessingService.samples[index].kits[scope.selectedKit].dp.playing) {
										audioProcessingService.samples[index].kits[scope.selectedKit].dp.playing = true;

                                        //channel,entry,index,kit,playType
										audioProcessingService.playSound(
											scope.channel,
                                            audioProcessingService.samples[index].kits[scope.selectedKit].dp,
											index,
                                            scope.selectedKit,
											intPlay
                                        );
									}
							}
						}
					}
				});

				scope.$on('keyUpEvent',   function(event,args) {
					if (audioProcessingService.buffered) {
						for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
							var index = audioProcessingService.kits[scope.selectedKit][i];

								if (audioProcessingService.samples[index].kits[scope.selectedKit].dp.keyCode.code == args.keyCode) {
									if (audioProcessingService.samples[index].kits[scope.selectedKit].dp.playing) {
										audioProcessingService.samples[index].kits[scope.selectedKit].dp.playing = false;
										audioProcessingService.stopSound(scope.channel,index,false,false);
									}
								}

						}
						if (scope.editingIndex != -1 && audioProcessingService.samples[scope.editingIndex].kits[scope.selectedKit].dp.edit.reMap) {
							for (var i = 0; i < keyCodesInOrder.length; i++) {
								if (keyCodesInOrder[i].code == args.keyCode) {
									audioProcessingService.samples[scope.editingIndex].kits[scope.selectedKit].dp.keyCode = keyCodesInOrder[i];
									audioProcessingService.samples[scope.editingIndex].kits[scope.selectedKit].dp.edit.reMap = false;
								}
							}
						}
					}
				});

				function lightUpKit() {
					midiService.LaunchPad.lightUpKitButtons(audioProcessingService.samples,audioProcessingService.kits,scope.selectedKit,"dp");
				}


				scope.$on("midiUpdate", function(event,data) {
					if (midiService.LaunchPad != undefined && midiService.LaunchPad.rightControls[scope.channel.LaunchPadKey] != undefined) {
						if (midiService.LaunchPad.rightControls[scope.channel.LaunchPadKey].active) {

							var keyCode = data.msg.data1;
							var upDown = data.msg.data2;


							//HANDLE KIT CHANGES
							if (upDown == 0) {
								if (keyCode == midiService.LaunchPad.topControls.down.numVal && scope.selectedKit < audioProcessingService.kits.length-1){
									scope.selectedKit++;
									lightUpKit();
								}
								if (keyCode == midiService.LaunchPad.topControls.up.numVal && scope.selectedKit > 0) {
									scope.selectedKit--;
									lightUpKit();
								}
							}

							//HANDLE PLAY STOP REMAP
							if (keyCode.toString() in midiService.LaunchPad.grid) {
								for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
									var sampleNum = audioProcessingService.kits[scope.selectedKit][i];

									if (audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.LPVal == keyCode) {

										// PLAY SOUND
										if (upDown == 127 && !audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.playing) {
											audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.playing = true;
	                                        audioProcessingService.playSound(
	                                            scope.channel,
	                                            audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp,
	                                            sampleNum,
	                                            scope.selectedKit,
	                                            intPlay
	                                        );
											break;
										}

										// STOP SOUND
										if (upDown == 0 && audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.playing) {
											audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.playing = false;
											audioProcessingService.stopSound(scope.channel,sampleNum,false,false);
											break;
										}
									}
									// REMAP
									else if (audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.edit.reMap) {
										audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.edit.reMap = false;
										audioProcessingService.samples[sampleNum].kits[scope.selectedKit].dp.LPVal = keyCode;
										scope.editingIndex = -1;
										lightUpKit();
										break;
									}

								}
							}
						}
					}



				});
			}
		}
	});