angular.module('settingsThemeModule', [])

    .directive('settingsTheme', function (uiService, uiThemeService, $rootScope) {
        return {
            restrict:'C',
            templateUrl:'modules/mainMenu/settingsTheme/settingsTheme.html',
            replace: true,

            link: function(scope,element) {

                var uploadButton = element[0].children[0];
                scope.themeService = uiThemeService;
                scope.themeIndex = startingTheme;
                scope.constraints = themeConstraints;
                scope.toCompile = clone(themeCompilerData);
                scope.backgroundColor = '';

                uploadButton.addEventListener('change',
                    function handleFileSelect(e) {
                        var files = e.target.files;
                        for(var i = 0; i <files.length; i++) {
                            var reader = new FileReader();
                            reader.onload = (function(theFile) {
                                return function(evt) {
                                    scope.themeService.backgrounds.push({
                                        name: theFile.name.split('.')[0],
                                        imgURL: 'url(' + evt.target.result + ')'
                                    });
                                    scope.themeService.theme.styles.background = scope.themeService.backgrounds.length - 1;
                                };
                            })(files[i]);
                            reader.readAsDataURL(files[i]);
                        }
                    },false
                );

                scope.updateColor = function() {
                    document.body.style.backgroundColor = scope.backgroundColor;
                };

                function decompile() {
                    deCompileBoxShadow(scope.themeService.theme.styles.container.boxShadow,scope.toCompile.container);
                    deCompileRGBA(scope.themeService.theme.styles.keyboard.backgroundColor,scope.toCompile.keyboardHeatMap);
                    deCompileRGBA(scope.themeService.theme.styles.container.backgroundColor,scope.toCompile.containerBackground);
                    deCompileRGBA(scope.themeService.theme.styles.menu.backgroundColor,scope.toCompile.menuBackground);
                    deCompileRGBA(scope.themeService.theme.styles.menuHighlight.backgroundColor,scope.toCompile.menuHighlight);
                    deCompileRGBA(scope.themeService.theme.styles.gridSelect.backgroundColor,scope.toCompile.gridSelect);
	                deCompileRGBA(scope.themeService.theme.styles.tempoTracker.backgroundColor,scope.toCompile.tempoTracker);
	                deCompileRGBA(scope.themeService.theme.styles.tempoTrackerActive.backgroundColor,scope.toCompile.tempoTrackerActive);
                }
                decompile();

                scope.actionIcons = [
                    {type: "control",
                        class:"fa-file-o",
                        popover: "createNewTheme",
                        placement: "bottom",
                        actionableFunction:
                            function() {
                                scope.themeService.themes.push(clone(blankTheme));
                                scope.themeIndex = scope.themeService.themes.length - 1;
                                scope.themeService.theme = scope.themeService.themes[scope.themeIndex];
                                scope.themeService.theme.theme = "New - " + (scope.themeIndex-totalStartingThemes+1);
                                $rootScope.$broadcast('themeChangeEvent', scope.themeService.theme);
                            }
                    },
                    {type: "control",
                        class:"fa-copy",
                        popover: "duplicateThisTheme",
                        placement: "bottom",
                        actionableFunction:
                            function() {
                                scope.themeService.themes.push(clone(scope.themeService.theme));
                                scope.themeIndex = scope.themeService.themes.length - 1;
                                scope.themeService.theme = scope.themeService.themes[scope.themeIndex];
                                var themeName = scope.themeService.theme.theme;
                                scope.themeService.theme.theme = "Copy-"+themeName;
                                scope.themeService.theme.notEditable = false;
                                $rootScope.$broadcast('themeChangeEvent', scope.themeService.theme);
                            }
                    },
                    {type: "control",
                        class:"fa-random",
                        popover: "randomizeTheme",
                        placement: "bottom",
                        actionableFunction:
                            function() {
                                if (!scope.themeService.theme.notEditable) {
                                    for (var themeClass in scope.themeService.theme.styles) {
                                        var classStyle = scope.themeService.theme.styles[themeClass];
                                        if (typeof(classStyle) === 'object' && themeClass != 'background') {
                                            for (var entry in classStyle) {
                                                var classEntry = classStyle[entry];
                                                if (entry != 'boxShadow') {
                                                    scope.themeService.theme.styles[themeClass][entry] = randomHex();
                                                }
                                            }
                                        }
                                    }
                                    for (var themeClass in scope.toCompile) {
                                        var classStyle = scope.toCompile[themeClass];
                                        for (var entry in classStyle) {
                                            var classEntry = classStyle[entry];
                                            switch(entry) {
                                                case "color" :       scope.toCompile[themeClass][entry] = randomHex(); break;
                                                case "shadowColor" : scope.toCompile[themeClass][entry] = randomHex(); break;
                                                case "shadowBlur" :  scope.toCompile[themeClass][entry] = randomNumber(scope.constraints.shadowBlur.min,scope.constraints.shadowBlur.max,0);break;
                                                case "shadowSize" :  scope.toCompile[themeClass][entry] = randomNumber(scope.constraints.shadowSize.min,scope.constraints.shadowSize.max,0);break;
                                                case "opacity":      scope.toCompile[themeClass][entry] = randomNumber(scope.constraints.opacity.min,scope.constraints.opacity.max,2);     break;
                                                default: break;
                                            }
                                        }
                                    }
                                    // set random background, and if custom is picked, then grab/apply a random color
                                    var background = Math.round(randomNumber(0,scope.themeService.backgrounds.length-1));
                                    scope.themeService.theme.styles.background = background;
                                    if (background == 0) {
                                        scope.backgroundColor = randomHex();
                                        scope.updateColor();
                                    }
                                    $rootScope.$broadcast('themeChangeEvent', scope.themeService.theme);

                                }
                            }
                    },
                    {type: "control",
                        class:"fa-upload",
                        popover: "uploadNewBackground",
                        placement: "bottom",
                        actionableFunction:
                            function() {
                                uploadButton.click();
                            }
                    },
                    {type: "control",
                        class:"fa-download",
                        popover: "downloadTheme",
                        placement: "bottom",
                        actionableFunction:
                            function() {

                            }
                    }
                ];

                scope.$watch('toCompile', function(){
                    compileBoxShadow(scope.themeService.theme.styles.container,scope.toCompile.container);
                    scope.themeService.theme.styles.containerResize.backgroundColor = scope.themeService.theme.styles.container.boxShadow.split(" ")[4];
                    compileRGBA(scope.themeService.theme.styles.keyboard, scope.toCompile.keyboardHeatMap);
                    compileRGBA(scope.themeService.theme.styles.container, scope.toCompile.containerBackground);
                    compileRGBA(scope.themeService.theme.styles.menu, scope.toCompile.menuBackground);
                    compileRGBA(scope.themeService.theme.styles.menuHighlight, scope.toCompile.menuHighlight);
                    compileRGBA(scope.themeService.theme.styles.gridSelect, scope.toCompile.gridSelect);
	                compileRGBA(scope.themeService.theme.styles.tempoTracker, scope.toCompile.tempoTracker);
	                compileRGBA(scope.themeService.theme.styles.tempoTrackerActive, scope.toCompile.tempoTrackerActive);
                },true);

                scope.changeTheme = {toRun: function(val,index) {
                    scope.themeIndex = index;
                    scope.themeService.theme = scope.themeService.themes[scope.themeIndex];
                    scope.toCompile = clone(themeCompilerData);
                    decompile();
                    $rootScope.$broadcast('themeChangeEvent', scope.themeService.theme);
                }};

            }
        }
    });