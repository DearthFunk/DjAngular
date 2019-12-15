angular.module('audioModule')

	.service('audioChannelsService', function(){
		var audioChannelsScope = this;
        audioChannelsScope.trackChannels = [];
        audioChannelsScope.masterChannel = [];
        audioChannelsScope.mainDemoChannel = {};
        audioChannelsScope.kitDemoChannel = {};
	});