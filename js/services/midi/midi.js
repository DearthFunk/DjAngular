angular.module('midiModule', [])

	.service('midiService', function($rootScope,audioChannelsService){
		var midiServiceScope = this;
		midiServiceScope.inputs = [];
		midiServiceScope.outputs = [];

		midiServiceScope.initMIDI = function() {
			JMB.init(function(MIDIAccess){
				midiServiceScope.inputs = MIDIAccess.enumerateInputs();
				midiServiceScope.outputs = MIDIAccess.enumerateOutputs();
				midiServiceScope.inputs.splice(0,0,{deviceName:"MIDI IN"});
				midiServiceScope.outputs.splice(0,0,{deviceName:"MIDI OUT"});
				midiServiceScope.input = midiServiceScope.inputs[0];
				midiServiceScope.output = midiServiceScope.outputs[0];
				midiServiceScope.MIDIAccess = MIDIAccess;
				$rootScope.$broadcast("midiDevicesUpdated", {});
				midiServiceScope.loaded = true;
			});

			for (var i = 0; i < midiServiceScope.inputs.length; i++) {
				midiServiceScope.inputs[i].active = true;
			}

			for (var i = 0; i < midiServiceScope.outputs.length; i++) {
				midiServiceScope.outputs[i].active = true;
			}



			for (var i = 0; i < midiServiceScope.inputs.length; i++) {
				if (midiServiceScope.inputs[i].active) {

					//CHECK FOR AND HOOKUP LAUNCHPAD
					if (midiServiceScope.inputs[i].deviceName.indexOf('MIDI Yoke') != -1) {
						midiServiceScope.inputs[i].addEventListener("midimessage",function(msg){
						});
					}

					if (midiServiceScope.inputs[i].deviceName.indexOf('Launchpad') != -1 &&	midiServiceScope.LaunchPad == undefined) {
						midiServiceScope.LaunchPad = new LaunchPad(midiServiceScope,i+1);
						midiServiceScope.inputs[i].addEventListener("midimessage",function(msg){
							$rootScope.$broadcast("midiUpdate", {msg:msg});
							midiServiceScope.LaunchPad.buttonPress(msg);
						});
					}
				}
			}
		};



		midiServiceScope.initMIDI();

	});