angular.module('fxEditorColumnGroup', [])

    .directive('fxEditorColumn', function(audioProcessingService,$rootScope) {
        return {
            restrict:'C',
            scope: {
                channel: "=channel"
            },
            templateUrl:'elements/group/fxEditorColumn/fxEditorColumn.html',
            replace: true,
            link: function(scope) {

                scope.fxs = fxs;

                scope.fxIcons = [
                    {type: "toggleEntry",
                        activeClass:"fa-arrow-down",
                        inactiveClass: "fa-arrow-up",
                        toggleEntry: "visible",
                        popover: "minimizeFX",
                        placement: "top",
                        actionableFunction:
                            function(index,item) {
                               item.visible = !item.visible;
                            }
                    },
                    {type: "control",
                        class:"fa-times",
                        popover: "removeFX",
                        placement: "top",
                        actionableFunction:
                            function(index,item,other) {
                                item.index = 0;
                                item.visible = false;
                                item.type = " ";
	                            item.values = undefined;

	                            $rootScope.$broadcast('fxRemovedFromEditorEvent',item);

                            }
                    }
                ];

            }
        }
    });

