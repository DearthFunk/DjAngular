angular.module('volumePanGroup', [])

    .directive('volumePan', function() {
        return {
            restrict:'C',
            scope: {
                channelData: "=channelData"
            },
            templateUrl:'elements/group/volumePan/volumePan.html',
            replace: true,
            link: function(scope) {




            }
        }
    });