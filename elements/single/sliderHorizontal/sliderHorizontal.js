angular.module('sliderHorizontalElement', [])

    .directive('sliderHorizontal', function(uiThemeService) {
        return {
            restrict:'C',
            scope: {
                sliderValue: "=sliderValue",
	            width: "=width"
            },
            templateUrl:'elements/single/sliderHorizontal/sliderHorizontal.html',
            replace: true,
            link: function(scope,element) {

	            scope.thumbWidth = 8;
	            scope.themeService = uiThemeService;
	            element[0].style.width = scope.width + 'px';

                var sliding, startX, originalX, newValue;
	            var lastValue = scope.sliderValue;
				var originalValue = scope.sliderValue;
                var xMin = 0;

				scope.resetToOriginal = function() {
					scope.sliderValue = originalValue;
				};

	            scope.$on('mouseUpEvent', function() {
		            sliding = false;
	            });

                scope.startMovingSlider = function(event) {
                    sliding = true;
                    startX = event.clientX;
                    newValue = scope.sliderValue * (scope.width - scope.thumbWidth);
                    originalX = newValue;
                };

	            scope.movePos = function(e) {
		            if (!sliding) {
			            scope.sliderValue = (e.clientX - element[0].getBoundingClientRect().left) / scope.width;
			            scope.startMovingSlider(e);
		            }
	            };

                scope.$on('mouseMoveEvent', function(event, args) {
                    if(sliding){
                        var newLeft = originalX - startX + args.clientX;

                        if(newLeft < xMin)       {newLeft = xMin;        scope.sliderValue = 0;}
                        if(newLeft > scope.width){newLeft = scope.width; scope.sliderValue = 1;}
                        newValue = newLeft;

                        if(lastValue != newValue){

                            scope.sliderValue = ((xMin - newValue) / (xMin - scope.width));
                            lastValue = newValue;
                        }
                    }
                });


            }
        }
    });
