angular.module('dropDownElement', [])

    .directive('dropDown', function(uiThemeService) {
        return {
            restrict:'C',
            scope: {
                list: "=list",
                key: "=key",
                selected: "=selected",
                width: "=width",
                height: "=height",
	            uniqueFunction: "=uniqueFunction",
	            sendBack: "=sendBack"
            },
            templateUrl:'elements/single/dropDown/dropDown.html',
            replace: true,
            link: function(scope,element) {

                element[0].children[0].style.width    = scope.width == undefined ? '55px' : scope.width + 'px';
                element[0].children[0].style.height   = scope.height == undefined ? '20px' : scope.height + 'px';
	            element[0].children[1].style.minWidth = scope.width == undefined ? '20px' : scope.width + 'px';
	            element[0].children[0].style.fontSize = scope.height - 6 + 'px';

	            var adjust = 4;
	            scope.themeService = uiThemeService;
	            scope.expanded = false;
	            scope.offset = 0;
	            scope.maxListLength = 10;

	            scope.toggleExpanded = function(){


	                scope.expanded = !scope.expanded;
					if (scope.selected + scope.maxListLength > scope.list.length) {
						scope.offset = scope.list.length - scope.maxListLength;
					}
		            else {

						scope.offset = scope.selected;
					}
	            };

	            scope.scroll = function(directionUP) {
					directionUP ?
						scope.offset + scope.maxListLength + adjust < scope.list.length ?
							scope.offset += adjust :
							scope.offset = scope.list.length - scope.maxListLength
						:
						scope.offset - adjust < 0 ?
							scope.offset = 0 :
							scope.offset -= adjust;
	            };

                scope.selectValue = function(index) {
	                if (!scope.list[index].notSelectable) {
		                if (scope.uniqueFunction != undefined){
			                scope.selected = 0;
			                scope.uniqueFunction.toRun(scope.list[index],index,scope.sendBack);
		                }
		                else {
			                scope.selected = index;
		                }
		                for (var i = 0; i < scope.list.length; i++) {
			                scope.list[i].DDhovering = false;
		                }
		                scope.expanded = false;
	                }
	                if (scope.list[index].enableMultipleInstances) {
		                scope.list[index].notSelectable = false;
	                }
                }
            }
        }
    });
