var currentElementId = 0;

var currentAudioElemId = -1;
angular.module('containerModule', [
	'mixerModule',
	'keyboardModule',
	'drumPadsModule',
	'drumMachineModule',
	'synthModule',
	'touchPadModule',
	'fxEditorModule',
	'autoGaterModule',
    'autoLooperModule',
	'sampleManagerModule',
	'lineInModule'
])

	.directive('container', function ($compile,$rootScope,uiToolTipService, audioProcessingService, audioChannelsService,uiThemeService,uiService) {
		return {
			restrict:'C',
			templateUrl:'modules/container/container.html',
			scope: {
				moduleValue: '=moduleValue',
                isAudioModule: "=isAudioModule",
                indexValue: "=indexValue"
			},
            replace: true,
			link: function(scope, element)	{

                if (scope.isAudioModule) { currentAudioElemId++; }


				var origLeft, origTop, origWidth, origHeight, startX, startY, windowSize, originalHeight, originalWidth;
				var moving, resizing = false;
				var whichModule = scope.moduleValue.module;
                var elementId = currentElementId++;
                var audioElementId = currentAudioElemId;
				var mainContainer = element[0];
				var topRow =        element[0].children[0];
				var contents =      element[0].children[2];
				var resizeDiv =     element[0].children[3];
				var boundingRect = mainContainer.getBoundingClientRect();

				scope.minMax = true;
				scope.themeService = uiThemeService;
				scope.audioProcessingService = audioProcessingService;
				scope.uiToolTipService = uiToolTipService;

                if (scope.isAudioModule) {
                    scope.channel = audioChannelsService.trackChannels[audioElementId];
                }

				//CREATE THE INNER MODULE
				element.attr("id", "container-" + elementId);
				var myElement = angular.element(document.createElement("div"));
				myElement.addClass(whichModule);
				document.querySelectorAll("#container-" + elementId + " div.contents")[0].appendChild(myElement[0]);
				$compile(myElement)(scope);


                scope.bringModuleToFront = function() {
                    containerZIndex.val++;
                    element.css({ zIndex: containerZIndex.val});
                };
                scope.bringModuleToFront();

				scope.topRightIcons = [
					{type: "toggle",
						activeClass:"fa-arrow-down",
						inactiveClass: "fa-arrow-up",
						classToggle: scope.minMax,
						popover: "minimizeWindow",
						placement: "left",
						actionableFunction:
							function() {
								if (audioProcessingService.buffered) {
									if (scope.minMax) {
										originalHeight = mainContainer.getBoundingClientRect().height;
										originalWidth = mainContainer.getBoundingClientRect().width;
										resizeDiv.style.display = "none";
										contents.style.display = "none";
										topRow.style.borderBottomStyle = "none";
										mainContainer.style.height = "22px";
										mainContainer.style.width = originalWidth - 2 + "px";
									}
									else {
										resizeDiv.style.display = "block";
										contents.style.display = "block";
										topRow.style.borderBottomStyle = "solid";
										if (scope.moduleValue.minSize == undefined) {
											mainContainer.style.height = "";
											mainContainer.style.width = "auto";
										}
										else {
											mainContainer.style.height = originalHeight -2+ "px";
											mainContainer.style.width = originalWidth - 2 + "px";
										}
									}
									scope.minMax = !scope.minMax;
									this.classToggle = scope.minMax;
								}
							}
					},
					{type: "control",
						class:"fa-times",
						popover: "closeWindow",
						placement: "right",
						actionableFunction:
							function() {
								if (scope.isAudioModule) {
									audioProcessingService.stopAllSound(scope.channel);
                                    audioChannelsService.trackChannels[audioElementId] = {active:false};
									audioModules[scope.indexValue].notSelectable = false;
								}
								else {
									controlModules[scope.indexValue].notSelectable = false;
								}
								element.remove();
								scope.$destroy();
							}
					}
				];


				scope.resetSize = function(firstLoad) {
					if (scope.moduleValue.minSize != undefined) {
						element.css({width:  (scope.moduleValue.startSize.w < containerMinimums.width         ? containerMinimums.width      : scope.moduleValue.startSize.w) +"px"});
						element.css({height: (scope.moduleValue.startSize.h < containerMinimums.height        ? containerMinimums.height     : scope.moduleValue.startSize.h) +"px"});

					}
					if (firstLoad) {
							element.css({left: scope.moduleValue.pos.l + "px"});
							element.css({top:  scope.moduleValue.pos.t + "px"});
					}
				};
				scope.resetSize(true);


				scope.fullScreen = function() {
                    if (uiService.userInterface.dblClickContainerHeaderForFullScreen &&
					    scope.moduleValue.minSize.w != undefined &&
                        scope.moduleValue.minSize.h != undefined) {

						var screenSize = document.body.getBoundingClientRect();
						element.css({top: containerMinimums.windowPadding +"px"});
						element.css({left: containerMinimums.windowPadding +"px"});
						element.css({width: screenSize.width - (2* containerMinimums.windowPadding) + "px"});
						element.css({height: screenSize.height  - (2* containerMinimums.windowPadding) + "px"});
					}
				};

				scope.resizeModule = function(event) {
					resizing = true;
					startX = event.clientX;
					startY = event.clientY;
					boundingRect = mainContainer.getBoundingClientRect();
					origWidth  = boundingRect.width;
					origHeight = boundingRect.height;
					document.body.style.cursor = "nw-resize";
					windowSize = {width: document.body.clientWidth,
						height: document.body.clientHeight};
				};


				scope.moveModule = function(event) {
					moving = true;
					boundingRect = mainContainer.getBoundingClientRect();
					origLeft = boundingRect.left;
					origTop = boundingRect.top;
					startX = event.clientX;
					startY = event.clientY;
					windowSize = {width: document.body.clientWidth,
						height: document.body.clientHeight};
				};

				scope.$on('mouseUpEvent', function() {
					document.body.style.cursor = "auto";
					moving = false;
					resizing = false;
				});

				scope.$on('mouseMoveEvent', function(event, args) {

					if (moving) {
						boundingRect = mainContainer.getBoundingClientRect();
						var newTop = origTop - startY + args.clientY;
						var newLeft = origLeft - startX + args.clientX;

						// assign new postion
                        element.css({left: ((newLeft > containerMinimums.windowPadding) ? newLeft : containerMinimums.windowPadding ) +"px"});
						element.css({top: ((newTop > containerMinimums.windowPadding) ? newTop : containerMinimums.windowPadding ) +"px"});

                        //correct position if greater than right side or bottom of screen
                        var newLeftCheck = windowSize.width - boundingRect.width - containerMinimums.windowPadding;
                        var newTopCheck = windowSize.height - boundingRect.height - containerMinimums.windowPadding;
						if (newLeft + boundingRect.width + containerMinimums.windowPadding > windowSize.width) {
							element.css({left: newLeftCheck + "px"});}

						if (newTop + boundingRect.height + (containerMinimums.windowPadding*2) > windowSize.height) {
							element.css({top: newTopCheck + "px"});}

                        //correct position if less than top or left of screen
                        if (newTopCheck < containerMinimums.windowPadding)  {element.css({top: containerMinimums.windowPadding + "px"});}
                        if (newLeftCheck < containerMinimums.windowPadding) {element.css({top: containerMinimums.windowPadding + "px"});}
					}

					else if (resizing && scope.moduleValue.minSize != undefined) {
						boundingRect = mainContainer.getBoundingClientRect();
						var newWidth  = origWidth - startX + args.clientX;
						var newHeight = origHeight - startY + args.clientY;

						element.css({ width: ((newWidth >  scope.moduleValue.minSize.w) ? newWidth : scope.moduleValue.minSize.w) + "px"});

						if (whichModule != "drumPads") {
							element.css({ height: ((newHeight > scope.moduleValue.minSize.h) ? newHeight : scope.moduleValue.minSize.h) + "px"});
						}

						if (newWidth + boundingRect.left + containerMinimums.windowPadding > windowSize.width) {
							element.css({width: windowSize.width - containerMinimums.windowPadding - boundingRect.left +"px"});}
						
						if (newHeight + boundingRect.top +  containerMinimums.windowPadding > windowSize.height && whichModule != "drumPads") {
							element.css({height: windowSize.height - containerMinimums.windowPadding - boundingRect.top + "px"});}

					}
				});
			}
		}
	});