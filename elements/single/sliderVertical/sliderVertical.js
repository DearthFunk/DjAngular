angular.module('sliderVerticalElement', [])

    .directive('sliderVertical', function(uiThemeService) {
        return {
            restrict:'C',
            scope: {
                sliderValue: "=sliderValue",
	            height: "=height"
            },
            templateUrl:'elements/single/sliderVertical/sliderVertical.html',
            replace: true,
            link: function(scope,element) {

	            var sliding, startX, originalX, newValue;
	            var lastValue = scope.sliderValue;
	            var startingValue = scope.sliderValue;
	            var xMin = 0;

	            element[0].style.height = scope.height + 'px';
	            scope.thumbHeight = element[0].children[0].children[0].getBoundingClientRect().height;
	            scope.themeService = uiThemeService;


                scope.getSliderValue = function(){
                    if(scope.sliderValue > 1){ scope.sliderValue = 1; }
                    if(scope.sliderValue < 0){ scope.sliderValue = 0; }
                    return scope.sliderValue;
                };

				scope.resetToOriginal = function() {
					scope.sliderValue = startingValue;
				};

                scope.startMovingSlider = function(event) {
                    sliding = true;
                    startX = event.clientY;
                    newValue = parseInt(scope.sliderValue * scope.height);
                    originalX = newValue;
                };

	            scope.movePos = function(e) {
		            if (!sliding) {
			            scope.sliderValue = (e.clientY - element[0].getBoundingClientRect().top) / scope.height;
			            scope.startMovingSlider(e);
		            }
	            };

	            scope.$on('mouseUpEvent', function() {
                    sliding = false;
                });

                scope.$on('mouseMoveEvent', function(event, args) {
                    if(sliding){
                        var newLeft = originalX - startX + args.clientY;

                        if(newLeft < xMin){ newLeft = xMin; scope.sliderValue = 0;}
                        if(newLeft > scope.height){ newLeft = scope.height; scope.sliderValue = 1;}
                        newValue = newLeft;

                        //prevents calling action when the value does not change
                        if(lastValue != newValue){
                            scope.sliderValue = ((newValue - xMin) / (scope.height - xMin));

                            lastValue = newValue;
                        }

                    }
                });

            }
        }
    });
