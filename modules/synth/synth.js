angular.module('synthModule', [])

	.directive('synth', function (audioProcessingService, uiToolTipService, audioChannelsService, uiThemeService, $timeout) {
		return {
			restrict:'C',
			templateUrl:'modules/synth/synth.html',
			replace: true,
			link: function(scope,element) {



				var prom,emptyData;
				scope.playAll = true;
				scope.playing = true;
				scope.activeGrid = 0;
				scope.clipsSynth = false;
				scope.gridSize = synthStyle.grid.sizing;
				scope.themeService = uiThemeService;
				scope.synthTemplates = synthTemplates;
				scope.selectedSynth = 1;
				scope.synthData = [];
				scope.mySynth = new Synth({
					canvas: element[0].children[0].children[1].children[0],
					gridSize: scope.gridSize,
					playValues: audioProcessingService.playValues,
					synthStyle : uiThemeService.theme.styles.synth
				});

				function loadData(toLoad) {
					scope.mySynth.grid.gridData       = toLoad.gridData;
					scope.mySynth.grid.gainData       = toLoad.gainData;
					scope.mySynth.scrollW.scrollPos.l = toLoad.scrollW;
					scope.mySynth.scrollH.scrollPos.t = toLoad.scrollH;
					scope.mySynth.looper.looperL      = toLoad.looperL;
					scope.mySynth.looper.looperR      = toLoad.looperR;
				}

				function getData() {
					return {
						gridData: clone(scope.mySynth.grid.gridData),
						gainData: clone(scope.mySynth.grid.gainData),
						scrollW: scope.mySynth.scrollW.scrollPos.l,
						scrollH: scope.mySynth.scrollH.scrollPos.t,
						looperL: scope.mySynth.looper.looperL,
						looperR: scope.mySynth.looper.looperR
					};
				}
				emptyData = getData();
				scope.synthData.push(clone(emptyData));

				scope.$on('$destroy',         function(event, args) { $timeout.cancel(prom);            });
				scope.$on('mouseMoveEvent',   function(event,args)  { scope.mySynth.mouseMove(args);    });
				scope.$on('mouseUpEvent',     function(event,args)  { scope.mySynth.mouseUp(args);      });
				scope.$on('mouseWheelEvent',  function(event,args)  { scope.mySynth.mouseWheel(args);   });

				scope.$on('themeChangeEvent', function(event,args) {
					scope.mySynth.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.looper.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.piano.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.scrollH.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.scrollW.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.grid.synthStyle = uiThemeService.theme.styles.synth;
					scope.mySynth.notesIndicator.synthStyle = uiThemeService.theme.styles.synth;
                    scope.mySynth.playback.synthStyle = uiThemeService.theme.styles.synth;
				});

				scope.$on('clickEvent',function(e,beatType){
					if (beatType == 1 && scope.playing) {
						scope.mySynth.playback.position++;
						if (scope.mySynth.playback.position > scope.mySynth.looper.looperR) {
							scope.mySynth.playback.position = scope.mySynth.looper.looperL + 1;
                            audioProcessingService.stopAllSynthNotes(scope.channel);
							if (scope.playAll) {
								scope.activeGrid++;
								if (scope.activeGrid > scope.synthData.length-1) {
									scope.activeGrid = 0;
								}
								loadData(scope.synthData[scope.activeGrid]);
							}
						}
                        for (var i = 0; i < scope.mySynth.grid.gridData.length; i++) {
                            var note = scope.mySynth.grid.gridData[i][scope.mySynth.playback.position - 1];
                            if (note.active) {
                                audioProcessingService.startSynthNote(
                                    scope.channel,
                                    scope.synthTemplates[scope.selectedSynth],
                                    Math.floor(Math.pow(2,(49-i)/12)*440),
                                    60 / audioProcessingService.playValues.bpm * note.lengthOfCell,
                                    1 - ((scope.mySynth.grid.gainData[scope.mySynth.playback.position - 1] - 10) / 48)
                                );
                            }
                        }
					}
				});

				scope.selectEntry = function(index) {
					loadData(scope.synthData[index]);
					scope.activeGrid = index;
				};

				scope.synthChangeAction = {
					functionToRun: function(val) {
						scope.selectEntry(val);
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
							function(val) {
								scope.playing = !scope.playing;
								this.classToggle = scope.playing;
                                audioProcessingService.stopAllSynthNotes(scope.channel);
							}
					},
					{type: "toggle",
						activeClass:"fa-angle-right",
						inactiveClass: "fa-angle-double-right",
						classToggle: scope.playAll,
						popover: "playStop",
						placement: "right",
						actionableFunction:
							function(val) {
								scope.playAll = !scope.playAll;
								this.classToggle = scope.playAll;
								audioProcessingService.stopAllSynthNotes(scope.channel);
							}
					},
					{type: "control",
						class:"fa-file-o",
						popover: "gridNew",
						placement: "left",
						actionableFunction:
							function() {
					//			scope.synthData[scope.activeGrid] = getData();
								scope.synthData.push(clone(emptyData));
								scope.activeGrid = scope.synthData.length - 1;
								loadData(scope.synthData[scope.activeGrid]);
							}
					},
					{type: "control",
						class:"fa-copy",
						popover: "gridDuplicate",
						placement: "right",
						actionableFunction:
							function() {
								scope.synthData.push(getData());
								scope.activeGrid = scope.synthData.length - 1;
							}
					},
					{type: "control",
						class:"fa-arrow-left",
						popover: "gridMoveLeft",
						placement: "left",
						actionableFunction:
							function() {
								if (scope.activeGrid > 0) {
									var tempData = clone(scope.synthData[scope.activeGrid-1]);
									scope.synthData[scope.activeGrid -1] = scope.synthData[scope.activeGrid];
									scope.synthData[scope.activeGrid] = tempData;
									scope.activeGrid -= 1;
								}
							}
					},
					{type: "control",
						class:"fa-arrow-right",
						popover: "gridMoveRight",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.activeGrid < scope.synthData.length-1) {
									var tempData = clone(scope.synthData[scope.activeGrid+1]);
									scope.synthData[scope.activeGrid + 1] = scope.synthData[scope.activeGrid];
									scope.synthData[scope.activeGrid] = tempData;
									scope.activeGrid += 1;
								}
							}
					},
					{type: "control",
						class:"fa-times",
						popover: "gridDelete",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.synthData.length > 1) {
									scope.synthData.splice(scope.activeGrid,1);
									if (scope.activeGrid > scope.synthData.length -1) {
										scope.activeGrid = scope.synthData.length - 1;
									}
								}
								else {
									scope.synthData[0] = clone(emptyData);
								}
								loadData(scope.synthData[scope.activeGrid]);
							}
					},
					{type: "toggle",
						activeClass:"fa-music",
						inactiveClass: "fa-edit",
						classToggle: scope.clipsSynth,
						popover: "toggleSynthView",
						placement: "left",
						actionableFunction:
							function(val) {
								scope.clipsSynth = !scope.clipsSynth;
								this.classToggle = scope.clipsSynth;
							}
					}

				];

				var synthTimer = function() {
					scope.mySynth.reDrawSynth();
					prom = $timeout(synthTimer, 10);
				};
				synthTimer();

			}
		}
	});