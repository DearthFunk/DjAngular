angular.module('drumMachineModule', [])

	.directive('drumMachine', function ( audioProcessingService, uiToolTipService, audioChannelsService, midiService, uiService) {
		return {
			restrict:'C',
			templateUrl:'modules/drumMachine/drumMachine.html',
			replace: true,
			link: function(scope) {

				scope.uiService = uiService;
				scope.uiToolTipService = uiToolTipService;
				scope.drumMachineLength = startLengthDrumMachine;
				scope.selectedKit = startKitDrumMachine;
				scope.setVolumeToTen = true;
				scope.enableZero = false;
				scope.playing = false;

				scope.clickTrack = -1;

				scope.mouseEvents = {
					click: function(e,sampleIndex,cell) {
						var row = audioProcessingService.samples[sampleIndex].kits[scope.selectedKit].dm;
						scope.enableZero ?
							e.which == 3 ?
								scope.setVolumeToTen ?
									row.values[cell] === '' ?
										row.values[cell] = 0 :
										row.values[cell] === 10 ?
											row.values[cell] =  '' :
											row.values[cell] = 10
									:
									row.values[cell] === '' ?
										row.values[cell] =  0 :
										row.values[cell] === 10 ?
											row.values[cell] = '' :
											row.values[cell]++
								:
								scope.setVolumeToTen ?
									row.values[cell] ===  0 ?
										row.values[cell]  =  '' :
										row.values[cell] === '' ?
											row.values[cell] =  10 :
											row.values[cell] =   0
									:
									row.values[cell] === '' ?
										row.values[cell] = 10 :
										row.values[cell] === 0 ?
											row.values[cell] = '' :
											row.values[cell]--
							:
							e.which == 1 ?
								scope.setVolumeToTen ?
									row.values[cell] === '' ?
										row.values[cell] = 10 :
										row.values[cell] === 10 ?
											row.values[cell] =  '' :
											row.values[cell] = 10
									:
									row.values[cell] === '' ?
										row.values[cell] =  1 :
										row.values[cell] === 10 ?
											row.values[cell] = '' :
											row.values[cell]++
								:
								scope.setVolumeToTen ?
									row.values[cell] === '' ?
										row.values[cell] = 10 :
										row.values[cell] === 10 ?
											row.values[cell] = '' :
											row.values[cell] = ''
									:
									row.values[cell] === '' ?
										row.values[cell] = 10 :
										row.values[cell] === 1 ?
											row.values[cell] = '' :
											row.values[cell]--;


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
								if (scope.drumMachineLength < maxLengthDrumMachine) {
									scope.drumMachineLength++;
								}
							}
					},

					{type: "control",
						class:"fa-arrow-left",
						popover: "decreaseLength",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.drumMachineLength > minLengthDrumMachine) {
									scope.drumMachineLength--;
								}
							}
					},
					{type: "control",
						class:"fa-times",
						popover: "resetGridData",
						placement: "right",
						actionableFunction:
							function() {
								for (var i = 0; i < audioProcessingService.samples.length; i++) {
									audioProcessingService.samples[i].kits[scope.selectedKit].dm.gain = defaultSample.dm.gain;
									audioProcessingService.samples[i].kits[scope.selectedKit].dm.reverse = defaultSample.dm.reverse;
									audioProcessingService.samples[i].kits[scope.selectedKit].dm.controls = defaultSample.dm.controls;
									for (var drumHit = 0; drumHit < audioProcessingService.samples[i].kits[scope.selectedKit].dm.values.length; drumHit++){
										audioProcessingService.samples[i].kits[scope.selectedKit].dm.values[drumHit] = '';
									}
								}
							}
					},
					{type: "toggle",
						activeClass:"fa-angle-double-down",
						inactiveClass: "fa-angle-double-up",
						classToggle: scope.setVolumeToTen,
						popover: "setVolumeToTen",
						placement: "right",

						actionableFunction:
							function() {
								scope.setVolumeToTen = !scope.setVolumeToTen;
								this.classToggle = scope.setVolumeToTen;
							}
					},
					{type: "toggle",
						activeClass:"fa-ban",
						inactiveClass: "fa-circle-o",
						classToggle: scope.enableZero,
						popover: "enableZeroValue",
						placement: "right",
						actionableFunction:
							function() {
								scope.enableZero = !scope.enableZero;
								this.classToggle = scope.enableZero;
							}
					}
				];

				scope.$on('clickEvent', function(e, noteType) {
					if (scope.playing && noteType == 1) {

						scope.clickTrack >= scope.drumMachineLength - 1 ? scope.clickTrack = 0 : scope.clickTrack++;

						for (var y = 0; y < audioProcessingService.kits[scope.selectedKit].length; y++) {

							var index = audioProcessingService.kits[scope.selectedKit][y];
							var sample = audioProcessingService.samples[index].kits[scope.selectedKit].dm;

							//sample.edit.gain = sample.values[scope.clickTrack]/10;

							if (sample.values[scope.clickTrack] > 0) {
 								audioProcessingService.stopSound(scope.channel, index, false, false);
                                audioProcessingService.playSound(
                                    scope.channel,
                                    sample,
                                    index,
                                    scope.selectedKit,
                                    intPlay
                                );
							}
							if (sample.values[scope.clickTrack] === 0) {
								for ( var i = 0; i < maxLengthDrumMachine; i++) {
                                    audioProcessingService.stopSound(scope.channel, index, false, false);								}
							}
						}
					}
				});

				scope.$on("midiUpdate", function(event,data) {
					var cell = data.msg.data1.toString();
					var key = scope.channel.LaunchPadKey;
					if (midiService.LaunchPad != undefined && midiService.LaunchPad.rightControls[key].active) {

						if (cell in midiService.LaunchPad.grid && data.msg.data2 == 127) {

							var y = Math.floor(cell/16);
							var x = cell%16;
							var index = [];
							for (var i = 0; i < audioProcessingService.samples.length; i++) {
								if (audioProcessingService.samples[i].kits[scope.selectedKit].active) {
									index.push(i);
								}
							}

							if (audioProcessingService.samples[index[y]].kits[scope.selectedKit].dm.values[x] > 0) {
								audioProcessingService.samples[index[y]].kits[scope.selectedKit].dm.values[x] = 0;
								midiService.LaunchPad.toggleGridKey("off",cell);

							}
							else {
								audioProcessingService.samples[index[y]].kits[scope.selectedKit].dm.values[x] = 10;
								midiService.LaunchPad.toggleGridKey("on",cell,"red");

							}

						}

					}

				});
			}
		}
	});