(function(window){

	var WORKER_PATH = 'js/lib/recorder/recorderWorker.js';
	var Recorder = function(source, cfg){
		var config = cfg || {};
		var bufferLen = config.bufferLen || 4096;
		this.context = source.context;
		!this.context.createScriptProcessor ?
			this.node = this.context.createJavaScriptNode(bufferLen, 2, 2) :
			this.node = this.context.createScriptProcessor(bufferLen, 2, 2);

		var worker = new Worker(config.workerPath || WORKER_PATH);
		worker.postMessage({
			command: 'init',
			config: {
				sampleRate: this.context.sampleRate
			}
		});
		var recording = false,
			currCallback;

		this.node.onaudioprocess = function(e){
			if (!recording) return;
			worker.postMessage({
				command: 'record',
				buffer: [
					e.inputBuffer.getChannelData(0),
					e.inputBuffer.getChannelData(1)
				]
			});
		}

		this.record = function(){ recording = true;	}
		this.stop = function()  { recording = false;}
		this.clear = function(){ worker.postMessage({ command: 'clear' }); }

		this.exportWAV = function(cb, type){
			currCallback = cb || config.callback;
			type = type || config.type || 'audio/wav';
			if (!currCallback) throw new Error('Callback not set');
			worker.postMessage({
				command: 'exportWAV',
				type: type
			});
		}

		worker.onmessage = function(e){
			var blob = e.data;
			currCallback(blob);
		}

		source.connect(this.node);
		this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
	};

	Recorder.forceDownload = function(blob, filename){
		var link = window.document.createElement('a');
		link.href = window.webkitURL.createObjectURL(blob);
		link.download = filename || 'output.wav';
		var click = document.createEvent("Event");
		click.initEvent("click", true, true);
		link.dispatchEvent(click);
	}

	window.Recorder = Recorder;

})(window);