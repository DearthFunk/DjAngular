angular.module('audioModule', [])

	.service('audioProcessingService', function($rootScope,audioChannelsService,visualizationProcessingService,$timeout){

        var context, loaded,audioRecorder;

        var firstTimeLoad = true;
		var reader = new FileReader();
        var audioProcessingServiceScope = this;
		context = typeof AudioContext !== 'undefined' ?	new AudioContext() : typeof webkitAudioContext !== 'undefined' ? new webkitAudioContext() :	null;
		var tuna = new Tuna(context);

		audioProcessingServiceScope.context = context;
		audioProcessingServiceScope.buffered =  false;
		audioProcessingServiceScope.samples = samples;
		audioProcessingServiceScope.kits = [];
		audioProcessingServiceScope.clickTrack = 0;
		audioProcessingServiceScope.clickGain = angular.isObject(djangularLocalStorage) ? djangularLocalStorage.clickGain : 0.5;
		audioProcessingServiceScope.audibleClickTrack = angular.isObject(djangularLocalStorage) ? djangularLocalStorage.audibleClickTrack : false;
		audioProcessingServiceScope.playValues = angular.isObject(djangularLocalStorage) ? deepCopy(djangularLocalStorage.playValues) : {
			beats:mixerBeats,
			bpm: mixerBPM,
			bars:mixerBars
		};


// ---------------- CLICK TRACKv--------------- -------------//
//-----------------------------------------------------------//
// SOURCE: http://www.html5rocks.com/en/tutorials/audio/scheduling/goodmetronome.js

		var lookahead = 25.0;
		var scheduleAheadTime = 0.1;
		var noteDepth = 4;

		var nextNoteTime = audioProcessingServiceScope.context.currentTime;
		var clickProm;
		var click = 0;
		var oscGain = audioProcessingServiceScope.context.createGain();
		oscGain.connect(audioProcessingServiceScope.context.destination);

		audioProcessingServiceScope.clickTrackPlayer = function() {
			while (nextNoteTime < audioProcessingServiceScope.context.currentTime + scheduleAheadTime ) {

				click++;
				nextNoteTime += ( 60.0 / audioProcessingServiceScope.playValues.bpm / noteDepth );

				if (click % noteDepth == 0) {audioProcessingServiceScope.clickTrack++;}
				if (click % 4 == 0) { $rootScope.$broadcast('clickEvent', 1); } // whole beat
				if (click % 2 == 0)  { $rootScope.$broadcast('clickEvent', 2); } // half beat
				if (click % 1 == 0)  { $rootScope.$broadcast('clickEvent', 4); } // quarter beat
				if (click >= (audioProcessingServiceScope.playValues.beats*audioProcessingServiceScope.playValues.bars*noteDepth)) {
					click = 0;
					audioProcessingServiceScope.clickTrack = 0;
				}

				// PLAY NOTE SOUND
				if (audioProcessingServiceScope.audibleClickTrack) {
					var frequency = 0;
					if (!(audioProcessingServiceScope.clickTrack % (audioProcessingServiceScope.playValues.beats*audioProcessingServiceScope.playValues.bars)))
					{frequency = mixerClickFreq.one;}
					else if (audioProcessingServiceScope.clickTrack % audioProcessingServiceScope.playValues.beats)
					{frequency = mixerClickFreq.two; }
					else {
						frequency = mixerClickFreq.three;
					}

					if (click % noteDepth == 0) {
						var osc = audioProcessingServiceScope.context.createOscillator();
						osc.connect( oscGain );
						oscGain.gain.value = audioProcessingServiceScope.clickGain;
						osc.frequency.value = frequency;
						osc.noteOn( nextNoteTime );
						osc.noteOff( nextNoteTime + mixerClickNoteLength );
					}
				}
			}
			clickProm = $timeout(audioProcessingServiceScope.clickTrackPlayer, lookahead);
		};
		audioProcessingServiceScope.clickTrackPlayer();



// ---------------- MAIN AND TRACK INITIALIZERS -------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.init = function() {
			audioProcessingServiceScope.initTrack(audioChannelTemplate,intChannelTypeMaster,"");

			audioChannelsService.mainDemoChannel.sources = [];
			audioChannelsService.mainDemoChannel.nodeGain = context.createGain();
			audioChannelsService.mainDemoChannel.nodeGain.gain.value = audioGain;
			audioChannelsService.mainDemoChannel.nodeGain.connect(context.destination);

            audioChannelsService.kitDemoChannel.sources = [];
            audioChannelsService.kitDemoChannel.nodeGain = context.createGain();
            audioChannelsService.kitDemoChannel.nodeGain.gain.value = audioGain;
            audioChannelsService.kitDemoChannel.nodeGain.connect(context.destination);

            if (angular.isObject(djangularLocalStorage)) {
                audioProcessingServiceScope.samples = deepCopy(djangularLocalStorage.samples);
                audioProcessingServiceScope.kits = deepCopy(djangularLocalStorage.kits);
                console.log('Samples Loaded From Storage!',audioProcessingServiceScope.samples.length);
            }
            for (var x = 0; x < audioProcessingServiceScope.samples.length; x++) {
                audioProcessingServiceScope.createSampleDefaults(x,audioProcessingServiceScope.samples[x]);
            }
			audioRecorder = new Recorder( audioChannelsService.masterChannel.nodePanner);    //nodeCompressor );
		};

		audioProcessingServiceScope.initTrack = function (channelData,channelType,module) {
			var channel;
			switch (channelType) {
				case intChannelTypeTrack  :
					audioChannelsService.trackChannels[audioChannelsService.trackChannels.length] = clone(channelData);
					channel = audioChannelsService.trackChannels[audioChannelsService.trackChannels.length - 1];
					channel.channelName = "Track: " + (audioChannelsService.trackChannels.length - 1);
					break;
				case intChannelTypeMaster :
					audioChannelsService.masterChannel = clone(channelData);
					channel = audioChannelsService.masterChannel;
					channel.channelName = "Master";
					break;
				case intChannelTypeDualSine :
					audioChannelsService.trackChannels[audioChannelsService.trackChannels.length] = clone(channelData);
					channel = audioChannelsService.trackChannels[audioChannelsService.trackChannels.length - 1];
					channel.channelName = "Track: " + (audioChannelsService.trackChannels.length - 1);
					break;
				case intChannelTypeSynth :
					audioChannelsService.trackChannels[audioChannelsService.trackChannels.length] = clone(channelData);
					channel = audioChannelsService.trackChannels[audioChannelsService.trackChannels.length - 1];
					channel.channelName = "Track: " + (audioChannelsService.trackChannels.length - 1);
					break;
				default : console.log("no track data input");
			}

			if (module != '') {
				channel.enableMultipleInstances = module.enableMultipleInstances;
				channel.enableMIDI = module.enableMIDI;
				channel.enableFX = module.enableFX;
				if (module.enableMIDI) {
					channel.midiIn = 0;
					channel.midiOut = 0;
				}
			}

			channel.sources = [];
			channel.channelType = channelType;
			channel.nodePanner = context.createPanner();
			channel.nodeGain = context.createGain();
			channel.nodeGain.gain.value = audioGain;
			channel.nodePanner.connect(channel.nodeGain);

			if (channel.channelType == intChannelTypeDualSine) {
				channel.oscillatorX = context.createOscillator();
				channel.oscillatorY = context.createOscillator();
				channel.oscillatorX.connect(channel.nodePanner);
				channel.oscillatorY.connect(channel.nodePanner);
			}

			if (channel.channelType == intChannelTypeSynth) {
                channel.playingNotes = [];
				channel.fxPhaser = new tuna.Phaser(fxs[8].values);
				channel.fxTremolo = new tuna.Tremolo(fxs[9].values);
				channel.fxWahwah = new tuna.WahWah(clone(fxs[10].values));
				channel.fxDelay = new tuna.Delay(fxs[5].values);
				channel.fxFilter = new tuna.Filter(fxs[6].values);
				channel.fxOverdrive = new tuna.Overdrive(fxs[7].values);
				channel.fxPhaser.connect    (channel.fxTremolo.input);
				channel.fxTremolo.connect   (channel.fxWahwah.input);
				channel.fxWahwah.connect	(channel.fxDelay.input);
				channel.fxDelay.connect     (channel.fxFilter.input);
				channel.fxFilter.connect    (channel.fxOverdrive.input);
				channel.fxOverdrive.connect (channel.nodePanner);
			}

			//creation and hookup of visualization nodes
			channel.nodeJavascript = context.createScriptProcessor(audioBufferSize, 0, 1);
			channel.nodeJavascript.connect(context.destination);
			channel.nodeAnalyserL = context.createAnalyser();
			channel.nodeAnalyserL.smoothingTimeConstant = audioSmoothing;
			channel.nodeAnalyserL.fftSize = audioBufferSize / 2;
			channel.nodeAnalyserR = context.createAnalyser();
			channel.nodeAnalyserR.smoothingTimeConstant = audioSmoothing;
			channel.nodeAnalyserR.fftSize = audioBufferSize / 2;
			channel.nodeAnalyserL.connect(channel.nodeJavascript);
			channel.nodeSplitter = context.createChannelSplitter();
			channel.nodeSplitter.connect(channel.nodeAnalyserL,0,0);
			channel.nodeSplitter.connect(channel.nodeAnalyserR,1,0);

			//hookup meters and visualizer on master
			if (channel.channelType === intChannelTypeMaster){
				channel.nodeGain.connect(channel.nodeSplitter);
				channel.nodeGain.connect(context.destination);   // final route to speaker
				channel.nodeJavascript.onaudioprocess = function() {
                    visualizationProcessingService.displayVisualization();
					audioProcessingServiceScope.loadAllLevelMeters();
				};
			}
			else {
				channel.nodeGain.connect(channel.nodeSplitter); // hook up gain for analysis
				channel.nodeGain.connect(audioChannelsService.masterChannel.nodePanner); // hook up aux and tracks to master
			}
		};


// ---------------- BUFFER LOADER FUNCTIONS -----------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.createSampleEntry = function(index,sample,buffer) {
			if (buffer != false || index == -1) {
				$rootScope.$broadcast('sampleLoad', index, sample.fileUrl, sample.fileName, buffer);
                sample.buffer = buffer;

                if (!djangularLocalStorage) {
                    sample.successfulDecode = true;
                    sample.kits = [];
                    sample.demoing = false;
                    sample.editing = false;
                    sample.editingName = false;
                    for (var kit = 0; kit < kits.length; kit++) {
                        sample.kits[kit] = clone(defaultSample);
                        sample.kits[kit].endPos = sample.buffer.duration;
                    }
                }
			}
			else {
				$rootScope.$broadcast('sampleError', index, sample.fileUrl, sample.fileName);
				sample.successfulDecode = false;
				for (kit = 0; kit < kits.length; kit++) {
					for (var entry = 0; entry < kits[kit].length; entry++) {
						if (kits[kit][entry].sampleIndex == index) {
							kits[kit].splice(entry,1);
						}
					}
				}
			}

			//check if it is finished loading and setup kits
			loaded++;
			if (loaded == audioProcessingServiceScope.samples.length) {
                if (firstTimeLoad) {
                    $rootScope.$broadcast('sampleLoadComplete', audioProcessingServiceScope.samples.length);
                    audioProcessingServiceScope.buffered = true;
                    console.log('All Samples Buffered!',audioProcessingServiceScope.samples.length);

                    if (!djangularLocalStorage) {
                        for (i = 0; i < kits.length; i++) {
                            audioProcessingServiceScope.kits.push([]);
                            for (var entry = 0; entry < kits[i].length; entry++) {

                                if (audioProcessingServiceScope.samples[ kits[i][entry].sampleIndex ].successfulDecode) {
                                    audioProcessingServiceScope.kits[i].push(kits[i][entry].sampleIndex);
                                    audioProcessingServiceScope.samples[ kits[i][entry].sampleIndex ].kits[i].dp.keyCode = kits[i][entry].keyCode;
                                    audioProcessingServiceScope.samples[ kits[i][entry].sampleIndex ].kits[i].dp.LPVal   = kits[i][entry].LPmidiVal;
                                }
                            }
                        }
                    }
                    firstTimeLoad = false;
                }
			}
		};

		audioProcessingServiceScope.createSampleRecorded = function(blob) {
			loaded = 0;
			audioProcessingServiceScope.buffered=false;
			reader.onload = (function(theFile){
				return function(e){
					context.decodeAudioData(e.target.result,function(buffer){
						var tempSample = {
							fileUrl: "",
							fileName: 'new recording'
						};
						audioProcessingServiceScope.createSampleEntry(-1,tempSample,buffer);
						audioProcessingServiceScope.samples.splice(0,0,tempSample);
						audioProcessingServiceScope.buffered = true;
						$rootScope.$broadcast('sampleLoad', 0, "", tempSample.fileName, buffer);
						$rootScope.$broadcast('sampleLoadComplete', audioProcessingServiceScope.samples.length);

					});
				};
			})(File);

			reader.readAsArrayBuffer(blob);
		};

		audioProcessingServiceScope.createSampleUploaded = function(e){
			loaded = 0;
			audioProcessingServiceScope.buffered=false;
			var files = e.target.files;


			for (var i = 0; i < files.length; i++) {
				reader.theFile = files[i];
				reader.onload = function(e){
					var theFile = e.target.theFile;
					context.decodeAudioData(e.target.result,function(buffer){
							var tempSample = {
								fileUrl: "",
								fileName: theFile.name.split(".")[0]
							};
							audioProcessingServiceScope.samples.push(tempSample);
							audioProcessingServiceScope.createSampleEntry(-1,tempSample,buffer);
						},
						function(error){
							audioProcessingServiceScope.createSampleEntry(-1,{
								fileUrl: "",
								fileName: theFile.name.split(".")[0]
							},false);
							console.error('decodeAudioData error',error);
						});
				};
				reader.readAsArrayBuffer(files[i]);
				reader.onerror = function(){
					console.log('FILE READER ERROR - ', files[i]);
				};
			}
		};

		audioProcessingServiceScope.createSampleDefaults = function(index, sample){
			loaded = 0;
			audioProcessingServiceScope.buffered=false;
			var request = new XMLHttpRequest();
			request.open("GET", sample.fileUrl,true);
			request.responseType = "arraybuffer";
			request.onload=function(){
				context.decodeAudioData(request.response,
					function(buffer){ audioProcessingServiceScope.createSampleEntry(index,sample,buffer); },
					function(error) { audioProcessingServiceScope.createSampleEntry(index,sample,false);  }
				);
			};
			request.onerror = function(){ console.log('BufferLoader: XHR error, no request can be made'); };
			request.send();
		};

// --------------- START STOP UPDATE SAMPLES ----------------//
//-----------------------------------------------------------//
        audioProcessingServiceScope.updateFxs = function(channel) {

        };

// --------------- START STOP UPDATE SAMPLES ----------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.updateGain = function(channel,index,gain) {
			if (gain != undefined &&
				channel.sources[index] != undefined) {
				channel.sources[index].gain.gain.value = gain;
			}
		};

		audioProcessingServiceScope.stopAllSound = function(channel) {
			for (var i = 0; i < channel.sources.length; i++) {
				if (channel.sources[i] != undefined) {
					channel.sources[i].disconnect();
				}
			}
		};

		audioProcessingServiceScope.stopSound = function(channel,index,demo,fade) {
            if (channel.sources[index] != undefined) {
				if (channel.sources[index].playing) {
					if (demo) {
						channel.sources[index].disconnect();
					}
					else {
							channel.sources[index].fadeOutTimer = function() {
								channel.sources[index].gain.gain.value -= 0.4;
								if ( Math.round( channel.sources[index].gain.gain.value * 10) / 10 <= 0) {
									if (channel.sources[index].fadeOutTimer != undefined) {
										$timeout.cancel(channel.sources[index].fadeOutTimer);
										channel.sources[index].disconnect(0);
									}
								}
								else {
									$timeout(channel.sources[index].fadeOutTimer, 1);
								}
							};
							channel.sources[index].fadeOutTimer();
//							channel.sources[index].stop();
					}
				}
			}
		};

		audioProcessingServiceScope.playSound = function (channel,entry,sampleIndex,kitIndex,playType) {

            // if already playing, disconnect. deals with hitting the playback of a sound multiple times while still fading out
            if (channel.sources[sampleIndex] != undefined) {
                if (channel.sources[sampleIndex].playing) {channel.sources[sampleIndex].disconnect()};
            }

            var startPos = 0;
			var source = context.createBufferSource();
			source.gain = context.createGain();
            var sample = audioProcessingServiceScope.samples[sampleIndex];
            var newBuffer = cloneAudioBuffer(sample.buffer,context);

            source.buffer = newBuffer;
            source.playing = true;
            channel.sources[sampleIndex] = source;

            if (playType == intPlay) {

                //START SETTING PLAYBACK VALUES FOR SOUND
                var cutLength = sample.kits[kitIndex].endPos - sample.kits[kitIndex].startPos;
                source.gain.gain.value = entry.edit.gain;
                if (entry.edit.reverse) {
                    if (newBuffer.numberOfChannels > 0) {Array.prototype.reverse.call( newBuffer.getChannelData(0) ); }
                    if (newBuffer.numberOfChannels > 1) {Array.prototype.reverse.call( newBuffer.getChannelData(1) ); }
                    startPos = newBuffer.duration - sample.kits[kitIndex].endPos;
                }
                else {
                    startPos = sample.kits[kitIndex].startPos;
                }

                if (entry.edit.loop) {
                    source.loop = true;
                    source.loopStart = startPos;
                    source.loopEnd = entry.edit.reverse ? newBuffer.duration - sample.kits[kitIndex].startPos : sample.kits[kitIndex].endPos;
                }

                source.playbackRate.value = entry.edit.tempoSync ?
	                audioProcessingServiceScope.playValues.bpm / 60 / speedValues[entry.edit.loopIndex].value * cutLength :
                    entry.edit.speed;


                //if fade out is not complete, just stop the sound outright
                if (channel.sources[sampleIndex].fadeOutTimer != undefined && channel.sources[sampleIndex].playing) {
                    $timeout.cancel(channel.sources[sampleIndex].fadeOutTimer);
                    channel.sources[sampleIndex].disconnect(0);
                }
            }

			if (playType == intMainDemo) { sample.demoing = true; }
			if (playType == intKitDemo)  {
				startPos = sample.kits[kitIndex].startPos;
				sample.kits[kitIndex].demoing = true;
			}

            if (playType == intPlay) {
                source.connect(source.gain);
                source.gain.connect(channel.nodePanner);
            }
			else {
                source.connect(context.destination);
            }

			switch (playType){
				case intMainDemo :  source.start(0,startPos,newBuffer.duration); break;
				case intKitDemo :   source.start(0,startPos,sample.kits[kitIndex].endPos - sample.kits[kitIndex].startPos); break;
				case intPlay :      source.start(0,startPos,cutLength); break;
				default: break;
			}

			source.onended = function(){
				source.playing = false;
                if (playType == intKitDemo)  { sample.kits[kitIndex].demoing = false; }
                if (playType == intMainDemo) { sample.demoing = false;}
			};
		};

		audioProcessingServiceScope.muteChannels = function(channel) {
			channel.muteValue = !channel.muteValue;
			channel.muteValue ?
				channel.nodePanner.disconnect(0) :
				channel.nodePanner.connect(channel.nodeGain);
		};

		audioProcessingServiceScope.soloChannels = function(channel) {
			var activeSolo = false;
            var channels = audioChannelsService.trackChannels;
			channel.soloValue = !channel.soloValue;
			for (var x = 0; x < channels.length; x++) { if (channels[x].soloValue) {activeSolo = true; break;} }
            for (x = 0; x < channels.length; x++) {
                channels[x].nodePanner.disconnect(0);
                channels[x].soloDisconnect = true;
                if (!activeSolo || (activeSolo && channels[x].soloValue)) {
                    channels[x].soloDisconnect = false;
                    channels[x].nodePanner.connect(channels[x].nodeGain);
                }
            }
		};


// -------------------- RECORDING FUNCTIONS -----------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.stopRecording = function() {
			audioRecorder.stop();
		};

		audioProcessingServiceScope.startRecording = function()  {
			audioRecorder.clear();
			audioRecorder.record();
		};

		audioProcessingServiceScope.saveRecording = function() {
			audioRecorder.exportWAV( function doneEncoding( blob ) {
				Recorder.forceDownload( blob, "recording.wav" );
			});
		};

		audioProcessingServiceScope.importRecording = function() {
			audioRecorder.exportWAV( function doneEncoding( blob ) {
				audioProcessingServiceScope.createSampleRecorded(blob);
			});
		};

// --------------- LEVEL METER LOADER -----------------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.loadAllLevelMeters = function(){
			for(var x = 0; x < audioChannelsService.trackChannels.length; x++){
				if (audioChannelsService.trackChannels[x].active) {
                    visualizationProcessingService.drawLevelMeters(audioChannelsService.trackChannels[x]);
				}
			}
            visualizationProcessingService.drawLevelMeters(audioChannelsService.masterChannel);

		};

// --------------- SYNTH FUNCTIONS -----------------//
//-----------------------------------------------------------//
        var noteCounter = -1;
		audioProcessingServiceScope.updateSynthValues = function(channel,data) {

			channel.fxDelay.bypass     = !data.delay.bypass;
			channel.fxDelay.wetLevel     = data.delay.wetLevel;
			channel.fxDelay.dryLevel      = data.delay.dryLevel;
			channel.fxDelay.feedback   = data.delay.feedback;
			channel.fxDelay.delayTime      = data.delay.delayTime;
			channel.fxDelay.cutoff      = data.delay.cutoff;

			channel.fxFilter.bypass     = !data.filter.bypass;
			channel.fxFilter.Q          = data.filter.Q;
			channel.fxFilter.filterType = data.filter.filterType;
			channel.fxFilter.frequency  = data.filter.frequency;
			channel.fxFilter.gain       = data.filter.gain;

			channel.fxOverdrive.bypass            = !data.overdrive.bypass;
			channel.fxOverdrive.algorithmIndex    = data.overdrive.algorithmIndex;
			channel.fxOverdrive.curveAmount       = data.overdrive.curveAmount;
			channel.fxOverdrive.drive             = data.overdrive.drive;
			channel.fxOverdrive.outputGain        = data.overdrive.outputGain;

			channel.fxPhaser.bypass                     = !data.phaser.bypass;
			channel.fxPhaser.rate                       = data.phaser.rate;
			channel.fxPhaser.depth                      = data.phaser.depth;
			channel.fxPhaser.feedback                   = data.phaser.feedback;
			channel.fxPhaser.stereoPhase                = data.phaser.stereoPhase;
			channel.fxPhaser.baseModulationFrequency    = data.phaser.baseModulationFrequency;

			channel.fxTremolo.bypass        = !data.tremolo.bypass;
			channel.fxTremolo.intensity     = data.tremolo.intensity;
			channel.fxTremolo.rate          = data.tremolo.rate;
			channel.fxTremolo.stereoPhase   = data.tremolo.stereoPhase;

			channel.fxWahwah.bypass             = !data.wahwah.bypass;
			channel.fxWahwah.automode           = data.wahwah.automode;
			channel.fxWahwah.baseFrequency      = data.wahwah.baseFrequency;
			channel.fxWahwah.excursionOctaves   = data.wahwah.excursionOctaves;
			channel.fxWahwah.sweep              = data.wahwah.sweep;
			channel.fxWahwah.resonance          = data.wahwah.resonance;
			channel.fxWahwah.sensitivity        = data.wahwah.sensitivity;

		};


		audioProcessingServiceScope.startSynthNote = function(channel, synthData, note, length, volume) {
			noteCounter++;

			// create default note placeholder
			if (channel.playingNotes[noteCounter] == undefined) {
				channel.playingNotes[noteCounter] = {waves: [{},{},{}]}
			}
			audioProcessingServiceScope.updateSynthValues(channel,synthData.controls);
			for (var i = 0; i < synthData.waves.length; i++) {
				if(synthData.waves[i].type > 0 && synthData.waves[i].gain > 0) {
					channel.playingNotes[noteCounter].waves[i].osc = context.createOscillator();
					channel.playingNotes[noteCounter].waves[i].gainL = context.createGain();
					channel.playingNotes[noteCounter].waves[i].gainR = context.createGain();
					channel.playingNotes[noteCounter].waves[i].merger = context.createChannelMerger(2);

					var osc = channel.playingNotes[noteCounter].waves[i].osc;
					var gainL = channel.playingNotes[noteCounter].waves[i].gainL;
					var gainR = channel.playingNotes[noteCounter].waves[i].gainR;
					var merger =  channel.playingNotes[noteCounter].waves[i].merger;

					gainL.gain.value = volume * synthData.waves[i].gain;
					gainR.gain.value = volume * synthData.waves[i].gain;
					osc.connect(gainL);
					osc.connect(gainR);
					osc.type = audioWaveTypes[synthData.waves[i].type].val;
					osc.frequency.value = note;
					osc.detune.value = Math.pow(2, 1/12) * synthData.waves[i].detune;
					osc.itemIndex = noteCounter;
					osc.start(0);
					osc.stop(context.currentTime + length);
					gainL.connect(merger,0,0);
					gainR.connect(merger,0,1);
					merger.connect(channel.fxPhaser.input);
					osc.onended = function() {
						channel.playingNotes.splice(osc.itemIndex,1);
					};
				}
			}
		};
        audioProcessingServiceScope.stopAllSynthNotes = function(channel) {
            channel.playingNotes = [];

        };


// --------------- DUAL SINE WAVE FUNCTIONS -----------------//
//-----------------------------------------------------------//
		audioProcessingServiceScope.startDualSineWave = function(channel, waveX, waveY) {

			if (waveX > -1 && !channel.muteValue) {
				channel.oscillatorX = context.createOscillator();
				channel.oscillatorX.connect(channel.nodePanner);
				channel.oscillatorX.type = waveX;
				channel.oscillatorX.start(0);
				channel.oscillatorX.playing = true;
			}
			if (waveY > -1 && !channel.muteValue) {
				channel.oscillatorY = context.createOscillator();
				channel.oscillatorY.connect(channel.nodePanner);
				channel.oscillatorY.type = waveY;
				channel.oscillatorY.start(0);
				channel.oscillatorY.playing = true;
			}
		};

		audioProcessingServiceScope.stopDualSineWave = function(channel) {
			if (channel.oscillatorY.playing) {
				channel.oscillatorY.disconnect();
				channel.oscillatorY.playing = false;
			}
			if (channel.oscillatorX.playing) {
				channel.oscillatorX.disconnect(0);
				channel.oscillatorX.playing = false;
			}
		};

		audioProcessingServiceScope.updateDualSineWave = function(channel,xType,yType) {
			channel.oscillatorX.frequency.value = xType;
			channel.oscillatorY.frequency.value = yType;
		};






	});