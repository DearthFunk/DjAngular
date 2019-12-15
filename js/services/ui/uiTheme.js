angular.module('uiModule')

	.service('uiThemeService', function(){
		var uiThemeServiceScope = this;
        uiThemeServiceScope.themes = angular.isObject(djangularLocalStorage) ? clone(djangularLocalStorage.themes) : themes;
        uiThemeServiceScope.backgrounds = backgrounds;
		uiThemeServiceScope.theme = uiThemeServiceScope.themes[startingTheme];
	});