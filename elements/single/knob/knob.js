angular.module('knobElement', [])

    .directive('knob', function (uiThemeService) {
        return {
            restrict:'C',
            scope: {
                knobValue: "=knobValue",
				minValue: "=minValue",
				maxValue: "=maxValue",
	            resetValue: "=resetValue",
                knobSize: "=knobSize",
	            label: "=label",
                panDetail: "=panDetail"
            },
            templateUrl:'elements/single/knob/knob.html',
            replace: true,
            link: function(scope) {

	            scope.themeService = uiThemeService;

	            if (typeof scope.knobValue == 'undefined') {scope.knobValue = 0;}

                var rotating, startY, originalMouseRotation;
                var panAngleLimit = 160;
                var decimalPercision = 1000;
                var panDetail = typeof scope.panDetail  == 'undefined' ? 1 : scope.panDetail;
				var minValue =  typeof scope.minValue   == 'undefined' ? 0 : scope.minValue;
				var maxValue =  typeof scope.maxValue   == 'undefined' ? 1 : scope.maxValue;
	            var resetValue = typeof scope.resetValue == 'undefined' ? scope.knobValue : scope.resetValue;



	            scope.rotationValue = (scope.knobValue - minValue) / (maxValue - minValue);
	            var lastValue = scope.rotationValue;
	            scope.actualKnobValue = typeof scope.knobSize  == 'undefined' ? 36 : scope.knobSize;

				scope.$watch("knobValue", function(newValue, oldValue){
					if(newValue == oldValue){ return; }
					scope.rotationValue = (scope.knobValue - minValue) / (maxValue - minValue);
				});



				scope.resetToOriginal = function() {
					scope.knobValue = Math.round(resetValue*decimalPercision) / decimalPercision;

				};

                scope.startMovingKnob = function(event) {
                    rotating = true;
                    startY =  (event.clientY * panDetail);
                    originalMouseRotation = scope.rotationValue * panAngleLimit;
                };

                scope.$on('mouseUpEvent', function() {
                    rotating = false;
					scope.knobValue = Math.round( ((maxValue - minValue) * scope.rotationValue + minValue) * decimalPercision) / decimalPercision;
                });

                scope.$on('mouseMoveEvent', function(event,args) {
                    if (rotating) {
                        var mouseRotation = (originalMouseRotation + startY - (args.clientY * panDetail));


                        if (mouseRotation < 0) { mouseRotation = 0;}
                        if (mouseRotation > panAngleLimit)    { mouseRotation = panAngleLimit;}

						scope.rotationValue =  (mouseRotation / panAngleLimit);

						if(lastValue != scope.rotationValue){
							scope.knobValue = Math.round( ((maxValue - minValue) * scope.rotationValue + minValue) * decimalPercision) / decimalPercision;
							lastValue = mouseRotation;
						}
                    }


                });
            }
        }
    });