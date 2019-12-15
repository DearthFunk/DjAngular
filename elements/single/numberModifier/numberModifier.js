angular.module('numberModifierElement', [])

	.directive('numberModifier', function (uiThemeService, $timeout) {
		return {
			restrict:'C',
			scope: {
				label: "=label",
				numValue: "=numValue",
				minValue: "=minValue",
                maxValue: "=maxValue",
				speed: "=speed"
			},
			templateUrl:'elements/single/numberModifier/numberModifier.html',
			replace: true,
			link: function(scope) {

				var prom;
				var speed;
				var counter = 0;
				var amount = 0;
				var delay = 600;
				var scrollAble =  (scope.maxValue - scope.minValue > 10);
				scope.speed = undefined ? speed = 70 : speed = scope.speed;
				scope.themeService = uiThemeService;

				scope.$on('$destroy', function(event, args) {
					counter = 0;
					$timeout.cancel(prom);
				});

				scope.$on('mouseUpEvent', function(event, args) {
					counter = 0;
					amount = 0;
					$timeout.cancel(prom);
				});

				var timer = function() {
					counter++;
					updateValue(amount * Math.floor(counter/5) );
					prom = $timeout(timer, speed);
				};

				function updateValue(val) {
					if      (scope.numValue + val >= scope.maxValue) { scope.numValue = scope.maxValue;}
					else if (scope.numValue + val <= scope.minValue) { scope.numValue = scope.minValue;}
					else {scope.numValue += val}
				}

				scope.modifyValue = function(val) {
					amount = val;
					counter = 0;
					updateValue(amount);
					setTimeout(function(){
						if (scrollAble && amount == val) {
							timer();
						}
					},delay);
				};


			}
		}
	});