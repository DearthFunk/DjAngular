angular.module('keyboardModule', [])

    .directive('keyboard', function (uiThemeService, $timeout) {
        return {
            restrict:'C',
            templateUrl:'modules/keyboard/keyboard.html',
            replace: true,
            link: function(scope,element) {

                scope.$on('mouseDownEvent', function(event, args) { scope.myKeyboard.mouseDown(args);       });
                scope.$on('mouseUpEvent',   function(event, args) { scope.myKeyboard.mouseUp();             });
                scope.$on('keyDownEvent',   function(event, args) { scope.myKeyboard.keyDown(args);         });
                scope.$on('keyUpEvent',     function(event, args) { scope.myKeyboard.keyUp(args);           });
				scope.$on('$destroy',       function(event, args) { $timeout.cancel(prom);                  });

	            scope.$on('loseFocusEvent', function(event, args) {
	                for (var i = 0; i < scope.myKeyboard.key.length; i++) {
		                scope.myKeyboard.key[i].keyFiring = false;
		                scope.myKeyboard.key[i].mouseFiring = false;
	                }
	            });

			    scope.myKeyboard = new Keyboard({
	                canvas: element[0].children[0],
	                theme: uiThemeService
                });

	            var prom;
	            var keyboardTimer = function() {
		            scope.myKeyboard.reDrawKeyboard();
		            prom = $timeout(keyboardTimer, 10);
	            };
	            keyboardTimer();

            }
        }
    });