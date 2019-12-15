angular.module('sampleManagerModule', [])

	.directive('sampleManager', function (uiThemeService,uiToolTipService, uiService,audioProcessingService,audioChannelsService, $timeout) {
		return {
			restrict:'C',
			templateUrl:'modules/sampleManager/sampleManager.html',
			replace: true,
			link: function(scope,element) {

                var fadeOutProm;
                var editingName = false;
				var importButton = element[0].children[0];
				scope.themeService = uiThemeService;
				scope.audioProcessingService = audioProcessingService;
                scope.uiToolTipService = uiToolTipService;
                scope.selectedKit = 0;
                scope.mainOpacity = 10;
                scope.fadeOutMessage = false;
                scope.maxKits = maxKits;

                importButton.addEventListener('change',
					function handleFileSelect(evt) {
						audioProcessingService.createSampleUploaded(evt);
					},false
				);


				scope.importSample = function() {
					if (audioProcessingService.buffered) {
						importButton.click(); }
				};

                scope.$on('mouseDownEvent', function(e,args){
                    if (editingName) {
                        editingName = false;
                        for (var i = 0; i < audioProcessingService.samples.length; i++) {
                            audioProcessingService.samples[i].editingName = false;
                        }
                    }
                });

                scope.keyPress = function(index,event) {
                    if (event.keyCode == keyCodes.enter.code) {
                        audioProcessingService.samples[index].editingName = false;
                    }
                };

                scope.kitChangeAction = {
                    functionToRun: function() {

                    }
                };


                function getDragDropIndexes (dragEl, dropEl) {
                    var drag = angular.element(dragEl);
                    var drop = angular.element(dropEl);

                    for (var i = 0; i < drag[0].classList.length; i++) {
                        var theClass = drag.classList[i];

                    }
                    return theClass;

                }
                scope.dropped = function(dragEl, dropEl) {
                    var data = getDragDropIndexes(dragEl, dropEl);


                };

                scope.kitModifiers = [
                    {type: "control",
                        class:"fa-plus",
                        popover: "addKit",
                        placement: "top",
                        actionableFunction:
                            function() {
                                if (audioProcessingService.kits.length < maxKits) {
                                    audioProcessingService.kits.push([]);
                                }
                                else {
                                    scope.fadeOutMessage = true;
                                    var fadeOut = function() {
                                        if (scope.mainOpacity > 0) {
                                            scope.mainOpacity -= 1;
                                            fadeOutProm = $timeout(fadeOut, 100);
                                        }
                                        else {
                                            scope.fadeOutMessage = false;
                                            scope.mainOpacity = 10;
                                            $timeout.cancel(fadeOutProm);
                                        }
                                    };
                                    fadeOut();
                                }
                            }
                    },
	                {type: "control",
		                class:"fa-minus",
		                popover: "removeKit",
		                placement: "top",
		                actionableFunction:
			                function() {
				               if (audioProcessingService.kits.length > 1) {
					               audioProcessingService.kits.splice(scope.selectedKit,1);
				               }
				                scope.selectedKit = 0;
			                }
	                }
                ];

                scope.sampleIcons = [
                    {type: "control",
                        class:"fa-times",
                        popover: "deleteSampleFromSystem",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                if (audioProcessingService.samples[index].demoing) {
                                    audioProcessingService.stopSound(audioChannelsService.demoChannel,index,true,false);
                                }
                                for (var kit = 0; kit < audioProcessingService.kits.length; kit++){
                                    for (var entry = 0; entry < audioProcessingService.kits[kit].length; entry++) {
                                        if (audioProcessingService.kits[kit][entry] == index) {
                                            audioProcessingService.kits[kit].splice(entry,1);
                                        }
                                        if (audioProcessingService.kits[kit][entry] > index) {
                                            audioProcessingService.kits[kit][entry]--;
                                        }
                                    }
                                }
                                audioProcessingService.samples.splice(index,1);
                            }
                    },
                    {type: "toggleEntry",
                        activeClass:"fa-play",
                        inactiveClass: "fa-stop",
                        toggleEntry: "demoing",
                        popover: "playDemoSample",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                audioProcessingService.samples[index].demoing = !audioProcessingService.samples[index].demoing;
                                audioProcessingService.samples[index].demoing ?
                                    audioProcessingService.playSound(
                                        audioChannelsService.mainDemoChannel,
                                        '',
                                        index,
                                        '',
                                        intMainDemo
                                    ) :
                                    audioProcessingService.stopSound(audioChannelsService.mainDemoChannel,index,true,false);
                            }
                    },
                    {type: "control",
                        class:"fa-edit",
                        popover: "editTheSampleName",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                for (var i = 0; i < audioProcessingService.samples.length; i++) {
                                    i == index ?
                                        audioProcessingService.samples[i].editingName = !audioProcessingService.samples[i].editingName :
                                        audioProcessingService.samples[i].editingName = false
                                }
                                editingName = audioProcessingService.samples[index].editingName;
                            }
                    },
                    {type: "control",
                        class:"fa-arrow-circle-right",
                        popover: "addThisSampleToTheSelectedKit",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                var inKit = false;
                                for (var i = 0; i < audioProcessingService.kits[scope.selectedKit].length; i++) {
                                    if (audioProcessingService.kits[scope.selectedKit][i] == index) {
                                        inKit = true;
                                        break;
                                    }
                                }
                                if (!inKit) {
                                    audioProcessingService.kits[scope.selectedKit].push(index);
                                }
                            }
                    }
                ];
                scope.kitSampleIcons = [
                    {type: "control",
                        class:"fa-times",
                        popover: "removeSampleFromKit",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                if (audioProcessingService.samples[index].demoing) {
                                    audioProcessingService.stopSound(audioChannelsService.demoChannel,index,true,false);
                                }
                                for (var entry = 0; entry < audioProcessingService.kits[scope.selectedKit].length; entry++) {
                                    if (audioProcessingService.kits[scope.selectedKit][entry] == index) {
                                        audioProcessingService.kits[scope.selectedKit].splice(entry,1);
                                    }
                                }
                            }
                    },
                    {type: "toggleEntry",
                        activeClass:"fa-play",
                        inactiveClass: "fa-stop",
                        toggleEntry: "demoing",
                        popover: "playKitDemoSample",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                audioProcessingService.samples[index].kits[scope.selectedKit].demoing = !audioProcessingService.samples[index].kits[scope.selectedKit].demoing;
                                audioProcessingService.samples[index].kits[scope.selectedKit].demoing ?
                                    audioProcessingService.playSound(
                                        audioChannelsService.kitDemoChannel,
                                        '',
                                        index,
                                        scope.selectedKit,
                                        intKitDemo
                                    ) :
                                    audioProcessingService.stopSound(audioChannelsService.kitDemoChannel,index,true,false);

/*

	                            audioProcessingService.playSound(
		                            audioChannelsService.mainDemoChannel,
		                            '',
		                            index,
		                            '',
		                            intMainDemo
	                            ) :
	                            audioProcessingService.stopSound(audioChannelsService.mainDemoChannel,index,true,false);
*/
                            }
                    },
                    {type: "control",
                        class:"fa-edit",
                        toggleEntry: "demoing",
                        popover: "editSamplePositions",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                if (uiService.userInterface.sampleManagerMultiEdit) {
                                    audioProcessingService.samples[index].editing = !audioProcessingService.samples[index].editing;
                                }
                                else {
                                    for (var i = 0; i < audioProcessingService.samples.length; i++) {
                                        i == index ?
                                            audioProcessingService.samples[i].editing = !audioProcessingService.samples[i].editing :
                                            audioProcessingService.samples[i].editing = false
                                    }
                                }
                            }
                    },
                    {type: "control",
                        class:"fa-exchange",
                        popover: "resetSampleLength",
                        placement: "top",
                        actionableFunction:
                            function(index) {
                                audioProcessingService.samples[index].kits[scope.selectedKit].startPos = 0;
                                audioProcessingService.samples[index].kits[scope.selectedKit].endPos = audioProcessingService.samples[index].buffer.duration;
                                if (uiService.userInterface.sampleManagerAutoCollapseEditor) {
                                    audioProcessingService.samples[index].editing = false;
                                }
                                scope.$broadcast('samplePosUpdate',index);
                            }
                    }
                ];

			}
		}
	});