angular.module('mixerChannelGroup', [
        'muteSoloGroup',
        'volumePanGroup'
    ])
    .directive('mixerChannel', function(uiThemeService) {
        return {
            restrict:'C',
            transclude: true,
            scope: {
                channelData: "=channelData"
            },
            templateUrl:'elements/group/mixerChannel/mixerChannel.html',
            replace: true,
            link: function(scope) {

	            scope.themeService = uiThemeService;
            }
        }
    });