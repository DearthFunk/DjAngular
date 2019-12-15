angular.module('stereoMeterElement', [])

    .directive('stereoMeter', function (uiThemeService) {
        return {
            restrict:'C',
            scope: {
                meterLeft: "=meterLeft",
                meterRight: "=meterRight"
            },
            templateUrl:'elements/single/stereoMeter/stereoMeter.html',
            replace: true,
            link: function(scope) {

                scope.themeService = uiThemeService;

            }
        }
    });