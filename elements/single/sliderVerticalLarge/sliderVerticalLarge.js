angular.module('sliderVerticalLargeElement', [])

    .directive('sliderVerticalLarge', function(uiThemeService) {
        return {
            restrict:'C',
            scope: {
                sliderValue: "=sliderValue",
	            height: "=height"
            },
            templateUrl:'elements/single/sliderVerticalLarge/sliderVerticalLarge.html',
            replace: true,
            link: function(scope,element) {

	            scope.thumbHeight = 30;
	            scope.themeService = uiThemeService;
	            element[0].style.height = scope.height + 'px';

                var sliding, startY, originalTop, newValue;
	            var lastValue = scope.sliderValue;
	            var originalValue = scope.sliderValue;
                var yMin = 0;


	            scope.resetToOriginal = function() {
					scope.sliderValue = originalValue;
				};

	            scope.$on('mouseUpEvent', function() {
		            sliding = false;
	            });

                scope.startMovingSlider = function(event) {
                    sliding = true;
                    startY = event.clientY;
                    newValue = scope.height - parseInt(scope.sliderValue * scope.height);
                    originalTop = newValue;
                };

	            scope.movePos = function(e) {
		            if (!sliding) {
		            scope.sliderValue = (scope.height - (e.clientY - element[0].getBoundingClientRect().top)) / scope.height;
					scope.startMovingSlider(e);
		            }
	            };

                scope.$on('mouseMoveEvent', function(event, args) {
                    if(sliding){
                        var newTop = originalTop - startY + args.clientY;
                        if(newTop < yMin)        { newTop = yMin;         scope.sliderValue = 1;}
                        if(newTop > scope.height){ newTop = scope.height; scope.sliderValue = 0;}
                        newValue = newTop;

                        if(lastValue != newValue){
                            scope.sliderValue = 1 - ((newValue - yMin) / (scope.height - yMin));
                            lastValue = newValue;
                        }
                    }
                });

            }
        }
    });