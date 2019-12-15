function randomHex() {
	return '#'+ Math.floor(Math.random()*16777215).toString(16);
}

function randomRGB () {
	return 'rgb(' +
		Math.floor(Math.random()*255+1) + ',' +
		Math.floor(Math.random()*255+1) + ',' +
		Math.floor(Math.random()*255+1) + ')';
}

function randomRGBA () {
	return 'rgba(' +
		Math.floor(Math.random()*255+1) + ',' +
		Math.floor(Math.random()*255+1) + ',' +
		Math.floor(Math.random()*255+1) + ',' +
		Math.random() + ')';
}


function compileBoxShadow(boxShadow,obj) {
    boxShadow.boxShadow = "0px 0px " + obj.shadowBlur + "px " + obj.shadowSize + "px " + obj.shadowColor;
}

function compileRGBA(rgba,obj) {
    rgba.backgroundColor = hexToRGBA(obj.color,obj.opacity);
}

function deCompileBoxShadow(boxShadow,obj) {
    var arr = boxShadow.split(" ");
    obj.shadowColor = arr[4];
    obj.shadowSize = parseInt(arr[3],10);
    obj.shadowBlur = parseInt(arr[2],10);
}

function deCompileRGBA(rgba,obj) {
    var arr = rgba.split(",");
    var rgb = arr[0] + "," + arr[1] + "," + arr[2] + ")";
    obj.opacity = Number(arr[3].slice(0,arr[3].length-1));
    obj.color = rgbToHex(rgb.slice(0,3) + rgb.slice(4,rgb.length));
}

function rgbaBetweenTwoHexes (minColor,maxColor,opacity) {
    var r, g, b;
    var min = minColor.replace('#','');
    var max = maxColor.replace('#','');
    var minR = parseInt(min.substring(0,2), 16);
    var minG = parseInt(min.substring(2,4), 16);
    var minB = parseInt(min.substring(4,6), 16);
    var maxR = parseInt(max.substring(0,2), 16);
    var maxG = parseInt(max.substring(2,4), 16);
    var maxB = parseInt(max.substring(4,6), 16);
    minR == maxR ? r = minR : minR < maxR ? r = randomNumber(minR,maxR,0) :	r = randomNumber(maxR,minR,0);
    minG == maxG ? g = minG : minG < maxG ? g = randomNumber(minG,maxG,0) :	g = randomNumber(maxG,minG,0);
    minB == maxB ? b = minB : minB < maxB ? b = randomNumber(minB,maxB,0) :	b = randomNumber(maxB,minB,0);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}

function rgbBetweenTwoHexes (minColor,maxColor) {
    var r, g, b;
    var min = minColor.replace('#','');
    var max = maxColor.replace('#','');
    var minR = parseInt(min.substring(0,2), 16);
    var minG = parseInt(min.substring(2,4), 16);
    var minB = parseInt(min.substring(4,6), 16);
    var maxR = parseInt(max.substring(0,2), 16);
    var maxG = parseInt(max.substring(2,4), 16);
    var maxB = parseInt(max.substring(4,6), 16);
    minR == maxR ? r = minR : minR < maxR ? r = randomNumber(minR,maxR,0) :	r = randomNumber(maxR,minR,0);
    minG == maxG ? g = minG : minG < maxG ? g = randomNumber(minG,maxG,0) :	g = randomNumber(maxG,minG,0);
    minB == maxB ? b = minB : minB < maxB ? b = randomNumber(minB,maxB,0) :	b = randomNumber(maxB,minB,0);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function rgbToHex (rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hexToRGBA(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);
    return 'rgba('+r+','+g+','+b+','+opacity+')';
}

function hexToRGB(hex){
	hex = hex.replace('#','');
	r = parseInt(hex.substring(0,2), 16);
	g = parseInt(hex.substring(2,4), 16);
	b = parseInt(hex.substring(4,6), 16);
	return 'rgb('+r+','+g+','+b+')';
}
