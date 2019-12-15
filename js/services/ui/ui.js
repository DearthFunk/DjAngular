angular.module('uiModule', [])

	.service('uiService', function(){

		var ui = this;

        ui.midiSettings = {
            classValue: "midiSettings",
            name: "MIDI Settings",
            midiEnabled: true
        };
        ui.themeCreator = {
            classValue: "themeCreator",
            name: "Theme Settings"
        };
        ui.visualizations = {
            classValue: "visualizations",
            name: "Visualization Settings"
        };
        ui.userInterface = {
            classValue: "userInterface",
            name: "User Interface Settings",
            autoGaterAutoHideControls: false,
            autoLooperAutoHideControls: false,


            dblClickContainerHeaderForFullScreen: true,
            autoLooperClickStop: true,
            sampleManagerMultiEdit: true,

            drumMachineAutoHideControls: true,
            disableToolTipLink: false,
            toolTips: false
        }

	});