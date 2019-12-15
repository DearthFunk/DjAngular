angular.module('uiModule')

	.directive('html', function(uiEventService, $window, audioProcessingService,visualizationProcessingService,visualizationThemeService,uiThemeService){
		return {
			restrict: 'E',
			link: function(scope,element){
				window.onblur = function()                { uiEventService.loseFocus();         };
				element.bind("mousemove", function(event) {	uiEventService.mouseMove(event);	});
				element.bind("mousedown", function(event) {	  uiEventService.mouseDown(event);	});
				element.bind("mousewheel", function(event){	uiEventService.mouseWheel(event);	});
				element.bind("mouseup", function(event)   {	uiEventService.mouseUp(event);	    });
				//event.target.localName checks to prevent any triggers when you are typing into an input box
				element.bind("keydown", function(event)   {	 if (event.target.localName != "input") {event.preventDefault(); uiEventService.keyDown(event);} });
				element.bind("keyup", function(event)     {	 if (event.target.localName != "input") {event.preventDefault(); uiEventService.keyUp(event);}	});

                $window.onbeforeunload = function(){
                    var djangularLocalStorage = getStorageInfo(audioProcessingService,visualizationProcessingService,visualizationThemeService,uiThemeService);
                    localStorage.setItem('djangularLocalStorage', JSON.stringify(djangularLocalStorage));
                };
            }
		}
	})

	.service("uiEventService", function($rootScope){
		this.mouseDown =  function(event) { $rootScope.$broadcast('mouseDownEvent',  event); };
		this.mouseUp   =  function(event) { $rootScope.$broadcast('mouseUpEvent',    event); };
		this.mouseMove =  function(event) { $rootScope.$broadcast('mouseMoveEvent',  event); };
		this.mouseWheel = function(event) { $rootScope.$broadcast('mouseWheelEvent', event); };
		this.loseFocus =  function(event) { $rootScope.$broadcast('loseFocusEvent',  event); };
		this.keyDown =    function(event) { $rootScope.$broadcast('keyDownEvent',    event); };
		this.keyUp =      function(event) { $rootScope.$broadcast('keyUpEvent',      event); };
	});