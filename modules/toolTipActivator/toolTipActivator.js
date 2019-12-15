angular.module('toolTipActivatorModule', [])

	.directive('toolTipActivator', function (uiService, uiToolTipService, uiThemeService, audioProcessingService) {
		return {
			restrict:'C',
			templateUrl:'modules/toolTipActivator/toolTipActivator.html',
			replace: true,
			link: function(scope) {

				scope.uiService = uiService;
                scope.uiThemeService = uiThemeService;
                scope.audioProcessingService = audioProcessingService;

				var messages = {
					playStop: "Start And Stop Playback",
					increaseLength: "Increase Length By 1",
					decreaseLength: "Decrease Length By 1",
					resetGridData: "Reset Grid Data",
					setVolumeToTen: "Set The Volume To 10 Or Enable 1-10 Count",
					enableZeroValue: "Enable A 0 Value To Stop A Sample Part Way Through",
					loopTheSample: "Loop The Sample",
					stopPlayback: "Stop All Sound",
					minimizeWindow: "Minimize This Dialog",
					closeWindow: "Close This Dialog And Stop All The Sound. Settings And Values Will Be Maintained.",
					toggleSynthView: "Toggle Between Synth Editor and Grid Editor",
					gridNew: "Add A New Blank Grid",
					gridDuplicate: "Duplicate The Currently Selected Grid",
					gridMoveLeft: "Move The Selected Grid To The Left",
					gridMoveRight: "Move The Selected Grid To The Right",
					gridSelectLeft: "Select Grid To The Left",
					gridSelectRight: "Select Grid To The Right",
					gridDelete: "Delete The Selected Grid",
					changeKit: "Change The Selected Kit",
					loadSynthData: "Load Synth Data",
					gridName: "Click Me To Expand The Sample Controls For This Sample Used In This Type Of Module",

                    removeFX: "Remove this effect from this track. This can also be handled via the fx drop downs of the mixer",
                    minimizeFX: "Minimize this effect, for easier viewing",
                    removeSampleFromKit: "Remove This Sample From The Selected Kit",
                    editSampleLength: "Trim The Sample",
                    resetSampleLength: "Reset Sample Length",
                    deleteSampleFromSystem: "Delete this Sample All Together, all data will be lost.",
                    playDemoSample: "Demo The Sample, click again to stop.",
                    playKitDemoSample: "Demo The Edited Sample As It Exists In this Kit",
                    editTheSampleName: "Edit The Sample Name",
                    editSamplePositions: "Edit The Start And End Position Of the Sample",
                    addKit: "Add A New Empty Kit",
                    addThisSampleToTheSelectedKit: "Add This Sample To The Selected Kit",

                    createNewTheme: "Create A New Theme From Scratch (black and white)",
                    randomizeTheme: "Randomize all the values of this theme",
                    uploadNewBackground: "Upload A Custom Background From Your Computer",
                    duplicateThisTheme: "Duplicate This Theme",
                    downloadTheme: "Download this theme for future use",


					autoGater:  "The Auto Gater works by playing all samples in the selected kit at the same time, each of which is time stretched by the values set when clicking on the sample name. Then you use the left mouse button to draw when the sample is audible, and use the right mouse button to erase an active cell.",
					autoLooper: "The Auto Looper works by clicking a cell to start playback of that sample at that spot in the sample. The Sample will continue to loop over and over if you have loop enabled on that sample. You can trigger multiple samples to play/stop at once by using the group activators.",
					drumMachine: "The Drum Machine works by playing samples triggered at the volume set on that cell. Left clicking a cell will increase the value by, right clicking will decrease by one. A 0 value will stop the sample playback. You can also enable fine volume tuning by enabling 1-10 values.",
					touchPad: "The TouchPad is a X/Y touchpad which can be used by mousing down and dragging your cursor along the main pad. You can customize each axis's wave type, minimum frequency, and maximum frequency. You can also customize the length and size of the draw animation.",
					drumPads: "A list of all samples in the selected kit which you can trigger by keyboard keypresses and midi notes. If you click on a pad, you can modify such things as the mapped key, speed of playback, and reverse playback.",
					synth: "You can use the Synth to draw midi notes and playback. It also comes with multiple data and sound control options.",
					lineIn: "You can use the LineIn to send your Microphone input to your speakers. Watch out for Feedback. This should be mainly used for none microphone inputs such as keyboards, synthesizers, drum machines, etc.."
				};

				scope.updateMessages = function(firstRun) {
					if (!firstRun) {
						uiService.userInterface.toolTips = !uiService.userInterface.toolTips;
					}
					for ( var i in messages) {
						uiService.userInterface.toolTips ?
							uiToolTipService.values[i] = messages[i] :
							uiToolTipService.values[i] = '';
					}
				};
				scope.updateMessages(true);
			}
		}
	});