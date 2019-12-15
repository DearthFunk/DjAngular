angular.module('mainMenuModule', [
	"settingsUIModule",
	"settingsThemeModule",
	"settingsMIDIModule",
	"settingsVisualizationsModule"
])
	.directive('mainMenu', function (uiService,audioProcessingService,audioChannelsService,visualizationProcessingService, $compile, $location,$timeout,uiThemeService) {
		return {
			restrict:'C',
			templateUrl:'modules/mainMenu/mainMenu.html',
			replace: true,
			link: function(scope) {

                var originalSettingsPanel = -1;

                scope.visualizationProcessingService = visualizationProcessingService;
                scope.uiThemeService = uiThemeService;
                scope.uiService = uiService;

                scope.addControlModules  = controlModules;
                scope.addAudioModules = audioModules;
                scope.controlModuleToAdd = 0;
                scope.audioModuleToAdd = 0;

                scope.selectedControlModuleToAdd = scope.addControlModules[0];
                scope.selectedAudioModuleToAdd = scope.addAudioModules[0];

                scope.elemLeft = -575;
                scope.selectedPanel = 2;
                scope.selectedSettingsPanel = -1;




                scope.addModule = {toRun: function(module,index,type) {
                    var which;
                    var modules = type ? scope.addAudioModules : scope.addControlModules;
                    for (var x = 0; x < modules.length; x++) {
                        if (modules[x] == module) {
                            which = type ? "addAudioModules[" + x +"]" : "addControlModules[" + x + "]";
                        }
                    }

                    if (module.enableMultipleInstances || !module.notSelectable) {
                        if (module.notSelectable != undefined) {module.notSelectable = true;}
                        if (module.channelType != undefined) {
                            audioProcessingService.initTrack(audioChannelTemplate,module.channelType,module);
                        }
                        var newContainerElement = angular.element(document.createElement("div"));
                        newContainerElement.attr("class", "container");
                        newContainerElement.attr("data-module-value", which);
                        newContainerElement.attr("data-is-audio-module",type);
                        newContainerElement.attr("data-index-value",index);

                        document.body.appendChild(newContainerElement[0]);
                        var containerScope = scope.$new();
                        $compile(newContainerElement)(containerScope);
                    }


                    scope.selectedControlModuleToAdd = scope.addControlModules[0];
                    scope.selectedAudioModuleToAdd = scope.addAudioModules[0];
                }};

                scope.loadAllModules = function() {
                    for (var i= 1; i < scope.addControlModules.length; i++) {
                        if (scope.addControlModules[i].name != undefined) {
                            scope.addModule.toRun(scope.addControlModules[i],i,false);
                        }
                    }
                    for (i = 1; i < scope.addAudioModules.length; i++) {
                        if (scope.addAudioModules[i].name != undefined) {
                            scope.addModule.toRun(scope.addAudioModules[i],i,true);
                        }
                    }
                };

				scope.showSettings = function(index) {
					scope.selectedSettingsPanel = index;
					if (originalSettingsPanel != scope.selectedSettingsPanel) {
					}
                    originalSettingsPanel = scope.selectedSettingsPanel;
                    scope.showPanel(0);

				};

				scope.saveSong = function() {

				};

				scope.loadSong = function() {

				};

				scope.showPanel = function(index) {
					scope.selectedPanel = index;
                    if (scope.selectedPanel != 0) {
                        scope.selectedSettingsPanel = -1;
                    }
				};

                //scope.addModule.toRun(scope.addControlModules[1],1,false);   // fx editor
                //scope.addModule.toRun(scope.addControlModules[2],2,false);   // sample editor
                //scope.addModule.toRun(scope.addControlModules[3],3,false);   // keyboard
               //scope.addModule.toRun(scope.addControlModules[4],4,false);   // mixer

                //scope.addModule.toRun(scope.addAudioModules[1],1,true);   // auto Gater
                //scope.addModule.toRun(scope.addAudioModules[2],2,true);   // auto Looper


                //scope.addModule.toRun(scope.addAudioModules[3],3,true);   // drum machine
                scope.addModule.toRun(scope.addAudioModules[4],4,true);   // drum pads

                //scope.addModule.toRun(scope.addAudioModules[5],5,true);   // line IN
                //scope.addModule.toRun(scope.addAudioModules[6],6,true);   // synth
                //scope.addModule.toRun(scope.addAudioModules[7],7,true);   // touchpad

            }
		}
	});