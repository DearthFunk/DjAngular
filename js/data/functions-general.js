function getStorageInfo(audioProcessingService, visualizationProcessingService,visualizationThemeService,uiThemeService) {

    return {
        active: true,
        clickGain: audioProcessingService.clickGain,
        audibleClickTrack: audioProcessingService.audibleClickTrack,
        playValues: deepCopy(audioProcessingService.playValues),
        samples: deepCopy(audioProcessingService.samples),
        kits: deepCopy(audioProcessingService.kits),
        visualization: visualizationProcessingService.visualization,
        visDefaults: deepCopy(visualizationThemeService.styles),
        themes: deepCopy(uiThemeService.themes)
    };

}
function deepCopy(obj) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
        var out = [], i = 0, len = obj.length;
        for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    if (typeof obj === 'object') {
        var out = {}, i;
        for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
        }
        return out;
    }
    return obj;
}
function clone (object){
    if(object instanceof String)  { return object + ""; }
    if(object instanceof Number)  { return object + 0;  }
    if(object instanceof Boolean) { return !!object;    }
    var newObj = (object instanceof Array) ? [] : {};
    for (var i in object) {
        if(object.hasOwnProperty(i)){
            newObj[i] = (object[i] && typeof object[i] === "object") ? clone(object[i]) : object[i];
        }
    }
    return newObj;
}


function randomNumber (from,to,decimals) {
	if (decimals != undefined) {
		return (Math.random()*(Number(to)-Number(from))+Number(from)).toFixed(decimals);
	}
	else {
		return Math.random()*(to-from)+from;
	}
}

function roundedNumber(value, precision) {
	var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

	return precision ? integral + '.' +  padding + fraction : integral;
}
function toFixed(value, precision) {
	var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');

	return precision ? integral + '.' +  padding + fraction : integral;
}

function eventOutOfBounds(loc, e, cd){
	var x = e.pageX - cd.left;
	var y = e.pageY - cd.top;
	return (x > loc.topX && x < loc.botX && y > loc.topY && y < loc.botY);
}

function cloneAudioBuffer(audioBuffer,context){
    var channels = [];
    var numChannels = audioBuffer.numberOfChannels;
    for (i = 0; i < numChannels; i++){
        channels[i] = new Float32Array(audioBuffer.getChannelData(i));
    }
    var newBuffer = context.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
    );
    for (var i = 0; i < numChannels; i++){
        newBuffer.getChannelData(i).set(channels[i]);
    }
    return newBuffer;
}

function toggleCursorMask(which) {
	if (which) {
		var cursorMask = angular.element(document.createElement("div"));
		cursorMask.attr("id", "cursorMask");
		cursorMask.attr("class","cursorMask");
		document.body.appendChild(cursorMask[0]);
	}
	else if (document.getElementById('cursorMask') != undefined) {
		document.getElementById('cursorMask').remove();
	}
}