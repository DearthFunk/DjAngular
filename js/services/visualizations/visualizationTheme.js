angular.module('visualizationModule')

    .service('visualizationThemeService', function ($rootScope,$window) {
        var visTheme = this;
        visTheme.styles = angular.isObject(djangularLocalStorage) ? clone(djangularLocalStorage.visDefaults) : clone(visDefaults);

    });
