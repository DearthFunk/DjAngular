angular.module('visualizationModule', [])


    .service('visualizationProcessingService', function($rootScope, uiThemeService, audioChannelsService,visualizationResizeService, uiService, visualizationThemeService){

        var visualizer = this;
        var canvas = document.getElementById('bckgrndVisualizer');

        visualizer.ctx = canvas.getContext("2d");
        visualizer.visualizations = visualizerChoices;
        visualizer.visualization = startingVisualization;

        /*----- get audio data for visualizations -------------------------------------------------------------------*/
        /*-----------------------------------------------------------------------------------------------------------*/
        /*-----------------------------------------------------------------------------------------------------------*/

        visualizer.getAverageVolume = function(array) {
            var values = 0;
            for (var i = 0; i < array.length; i++) {
                values += array[i];
            }
            return values / array.length;
        };

        visualizer.getFreqArray = function(lengthSubtract) {
            var left = visualizer.getFreqArrayLeft();
            var right = visualizer.getFreqArrayRight();
            audioChannelsService.masterChannel.nodeAnalyserL.getByteFrequencyData(left);
            audioChannelsService.masterChannel.nodeAnalyserR.getByteFrequencyData(right);
            var theFreqArray = [];
            for (var index = 0; index < left.length - (lengthSubtract == undefined ? 0 : lengthSubtract); index++) {
                theFreqArray[index] = (left[index] + right[index]) / 2;
            }
            return theFreqArray;
        };

        visualizer.getSmallArray = function(depth) {
            var theSmallArray = [];
            var left = visualizer.getFreqArrayLeft();
            var right = visualizer.getFreqArrayRight();
            var x = depth == undefined ? 1 : depth;
            for (var i =0; i < left.length; i += x) {
                theSmallArray.push( parseInt((left[i] + right[i]) / 2, 10) );
            }
            return theSmallArray;
        };

        visualizer.getTimeArray = function() {
            var theTimeArray  = new Uint8Array(audioChannelsService.masterChannel.nodeAnalyserL.frequencyBinCount);
            audioChannelsService.masterChannel.nodeAnalyserL.getByteTimeDomainData(theTimeArray);
            return theTimeArray;
        };

        visualizer.getAverageDB = function() {
            var arrayL =  new Uint8Array(audioChannelsService.masterChannel.nodeAnalyserL.frequencyBinCount);
            var arrayR =  new Uint8Array(audioChannelsService.masterChannel.nodeAnalyserR.frequencyBinCount);
            audioChannelsService.masterChannel.nodeAnalyserL.getByteFrequencyData(arrayL);
            audioChannelsService.masterChannel.nodeAnalyserR.getByteFrequencyData(arrayR);
            var L =  visualizer.getAverageVolume(arrayL);
            var R =  visualizer.getAverageVolume(arrayR);
            return visualizer.getAverageVolume([L,R]);
        };

        visualizer.getFreqArrayLeft = function() {
            var theFreqArray =  new Uint8Array(audioChannelsService.masterChannel.nodeAnalyserL.frequencyBinCount);
            audioChannelsService.masterChannel.nodeAnalyserL.getByteFrequencyData(theFreqArray);
            return theFreqArray;
        };

        visualizer.getFreqArrayRight = function() {
            var theFreqArray =  new Uint8Array(audioChannelsService.masterChannel.nodeAnalyserR.frequencyBinCount);
            audioChannelsService.masterChannel.nodeAnalyserR.getByteFrequencyData(theFreqArray);
            return theFreqArray;
        };

        /*-------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------------------*/
        var visCounter= 0;
        visualizer.displayVisualization = function() {
            visCounter++;
            if (visCounter % 2 == 0) {
                visualizer.ctx.shadowBlur = 0;
                visualizer.ctx.shadowBlur = 0;
                visualizer.ctx.shadowColor = '';
                visualizer.ctx.shadowOffsetX = 0;
                visualizer.ctx.shadowOffsetY = 0;
                visualizer.ctx.lineWidth = 0;
                visualizer.ctx.strokeStyle = '';
                var vis = visualizer.visualizations[visualizer.visualization];
                visualizer.ctx.globalCompositeOperation = vis.composite;

                if (vis.alwaysClear) {
                    visualizer.ctx.clearRect(0,0,visualizationResizeService.canvasInfo.canvasWidth,visualizationResizeService.canvasInfo.canvasHeight);
                }
                else {
                    var oldArray = visualizer.ctx.getImageData(0,0,canvas.width,canvas.height);
                    //count through only the alpha pixels
                    for(var d=3;d<oldArray.data.length;d+=4){
                        //dim it with some feedback, I'm using .9
                        oldArray.data[d] = Math.floor(oldArray.data[d]*.9);
                    }
                    visualizer.ctx.putImageData(oldArray,0,0);
                }




                if(typeof visualizer[vis.functionToRun] == 'function'){
                    visualizer[vis.functionToRun]();
                }

            }
        };

        visualizer.drawLevelMeters = function(channel) {
            if (channel.active) {
                if (channel.muteValue || channel.soloDisconnect) {
                    channel.meterLeft.val = 0;
                    channel.meterRight.val = 0;
                }
                else {
                    var arrayL =  new Uint8Array(channel.nodeAnalyserL.frequencyBinCount);
                    var arrayR =  new Uint8Array(channel.nodeAnalyserR.frequencyBinCount);
                    channel.nodeAnalyserL.getByteFrequencyData(arrayL);
                    channel.nodeAnalyserR.getByteFrequencyData(arrayR);
                    channel.meterLeft.val = (visualizer.getAverageVolume(arrayL) / 170).toFixed(4);
                    channel.meterRight.val = (visualizer.getAverageVolume(arrayR) / 170).toFixed(4);
                    channel.nodePanner.setPosition(channel.pannerLvl, -1 * channel.pannerLvl,0);
                }
            }
        };




        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------FLOWER------*/
        /*------------------------------------------------------------------------------------------------------------*/
        function CircleDecay() {
            return {
                x: visualizationResizeService.canvasInfo.canvasWidthHalf,
                y: visualizationResizeService.canvasInfo.canvasHeightHalf,
                r: randomNumber(0,70),
                xAdd:randomNumber(-10,10),
                yAdd:randomNumber(-10,10),
                rDec: randomNumber(0.1,10)
            }
        }
        var decayingCircles =[];

        visualizer.visFlower = function() {
            var numLeaves = visualizationThemeService.styles.flower.leavesTotal; //10
            var totalCircleDecay = visualizationThemeService.styles.flower.totalCircleDecay; //200
            var freqData = visualizer.getSmallArray(4);
            var dbLevel = visualizer.getAverageDB();
            var x = visualizationResizeService.canvasInfo.canvasWidthHalf;
            var y = visualizationResizeService.canvasInfo.canvasHeightHalf;

            for (var i = 0; i < totalCircleDecay; i++) {

                if (dbLevel > 0) {
                    if (decayingCircles[i] == undefined) {	decayingCircles.push(new CircleDecay()); }
                    if (decayingCircles[i].r <=0)        {	decayingCircles[i] = new CircleDecay();  }
                }
                if (decayingCircles[i] != undefined) {
                    decayingCircles[i].x += decayingCircles[i].xAdd;
                    decayingCircles[i].y += decayingCircles[i].yAdd;
                    decayingCircles[i].r -= decayingCircles[i].rDec;
                    if (dbLevel<=0){ decayingCircles[i].r -= 5;}

                    if (decayingCircles[i].r > 0) {
                        visualizer.ctx.beginPath();
                        visualizer.ctx.fillStyle=visualizationThemeService.styles.flower.circleColor;
                        visualizer.ctx.arc(decayingCircles[i].x,decayingCircles[i].y,decayingCircles[i].r,  0,	2 * Math.PI, true);
                        visualizer.ctx.fill();
                        visualizer.ctx.closePath();
                    }
                }
            }

            if (visualizationThemeService.styles.flower.stemShow) {
                visualizer.ctx.beginPath();
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.flower.stemColor;
                visualizer.ctx.lineWidth = visualizationThemeService.styles.flower.stemSize;
                visualizer.ctx.moveTo(x,y);
                visualizer.ctx.quadraticCurveTo(x-50,y-300, x-100,y*2);
                visualizer.ctx.stroke();
                visualizer.ctx.closePath();
            }

            var radius1 = parseInt(visualizationThemeService.styles.flower.budRadius,10);
            var innerRadius = (dbLevel/4) + radius1;
            for (var index = 0; index < freqData.length; index++) {

                var radius2 = radius1 + freqData[index] * 3;
                var a1 = ((index + 0) * (360/numLeaves))*Math.PI/180;
                var a2 = ((index + 1) * (360/numLeaves))*Math.PI/180;
                var x1 = x + (radius1 * Math.cos(a1) + (1/radius1));
                var y1 = y + (radius1 * Math.sin(a1) + (1/radius1));
                var x2 = x + (radius1 * Math.cos(a2) + (1/radius1));
                var y2 = y + (radius1 * Math.sin(a2) + (1/radius1));
                var x3 = x + (radius2 * Math.cos(a2) + (1/radius2));
                var y3 = y + (radius2 * Math.sin(a2) + (1/radius2));
                var x4 = x + (radius2 * Math.cos(a1) + (1/radius2));
                var y4 = y + (radius2 * Math.sin(a1) + (1/radius2));

                visualizer.ctx.strokeStyle = visualizationThemeService.styles.flower.leavesBorder;
                visualizer.ctx.lineWidth = 1;
                visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.flower.leavesColor,index/freqData.length);
                visualizer.ctx.beginPath();
                visualizer.ctx.moveTo(x2,y2);
                visualizer.ctx.bezierCurveTo(x3,y3, x4,y4, x1,y1);
                visualizer.ctx.stroke();
                visualizer.ctx.fill();
                visualizer.ctx.closePath();

                if (visualizationThemeService.styles.flower.showLines) {
                    visualizer.ctx.strokeStyle= hexToRGBA(visualizationThemeService.styles.flower.lineColor,dbLevel/60);
                    visualizer.ctx.beginPath();
                    visualizer.ctx.lineWidth = visualizationThemeService.styles.flower.lineSize;
                    visualizer.ctx.moveTo(x1,y1);
                    visualizer.ctx.lineTo(
                        x + (radius2*(parseInt(visualizationThemeService.styles.flower.lineLength,10)/10) * Math.cos(a1) ),
                        y + (radius2*(parseInt(visualizationThemeService.styles.flower.lineLength,10)/10) * Math.sin(a1) )
                    );
                    visualizer.ctx.stroke();
                    visualizer.ctx.closePath();
                }


                visualizer.ctx.fillStyle = visualizationThemeService.styles.flower.budBumpsColor;
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.flower.budBumpsBorder;
                visualizer.ctx.lineWidth = 1;
                visualizer.ctx.beginPath();
                visualizer.ctx.arc(x1, y1, (dbLevel/2) + (radius1/parseInt(visualizationThemeService.styles.flower.budBumpsRadius,10)), 0,	2 * Math.PI, true);
                visualizer.ctx.fill();
                visualizer.ctx.stroke();
                visualizer.ctx.closePath();

            }

            visualizer.ctx.fillStyle=visualizationThemeService.styles.flower.budColor;
            visualizer.ctx.strokeStyle = visualizationThemeService.styles.flower.budBorder;
            visualizer.ctx.lineWidth = 2;
            visualizer.ctx.beginPath();
            visualizer.ctx.arc(x, y, innerRadius , 0,	2 * Math.PI, true);
            visualizer.ctx.fill();
            visualizer.ctx.stroke();
            visualizer.ctx.closePath();

            if (visualizationThemeService.styles.flower.showScope) {
                var percent2;
                var timeArray = visualizer.getTimeArray();
                var padding = 2;
                var barWidth = (innerRadius-padding) * 2 / timeArray.length;
                for (index = 0; index < timeArray.length; index++) {
                    var percent1 = timeArray[index] / 256;
                    index < timeArray.length ?
                        percent2 = timeArray[index+1] / 256 :
                        percent2 = timeArray[index  ] / 256;

                    var offset1, offset2;
                    index == 0 ?
                        offset1 = visualizationResizeService.canvasInfo.canvasHeightHalf :
                        offset1 = visualizationResizeService.canvasInfo.canvasHeightHalf + (innerRadius*2*(percent1-0.5));
                    index == timeArray.length-1 ?
                        offset2 = visualizationResizeService.canvasInfo.canvasHeightHalf :
                        offset2 = visualizationResizeService.canvasInfo.canvasHeightHalf + (innerRadius*2*(percent2-0.5));

                    visualizer.ctx.beginPath();
                    visualizer.ctx.lineWidth = 2;
                    visualizer.ctx.strokeStyle = visualizationThemeService.styles.flower.scopeColor;
                    visualizer.ctx.moveTo(index*barWidth + padding +(visualizationResizeService.canvasInfo.canvasWidthHalf-innerRadius)           ,offset1);
                    visualizer.ctx.lineTo(index*barWidth + padding +(visualizationResizeService.canvasInfo.canvasWidthHalf-innerRadius) + barWidth,offset2);
                    visualizer.ctx.stroke();
                    visualizer.ctx.closePath();
                }
            }

        };
        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------DOWNWARD SPIRAL------*/
        /*------------------------------------------------------------------------------------------------------------*/
        visualizer.visSpiral = function() {

            if (visualizationThemeService.styles.downwardSpiral.stereoSplit) {
                var freqArrayL = visualizer.getFreqArrayLeft();
                var freqArrayR = visualizer.getFreqArrayRight();

                for (var index = 0; index < freqArrayL.length; index++) {
                    if (index % 2 == 0) {

                        var startX = visualizationResizeService.canvasInfo.canvasWidthOneQuarter;
                        var startY = visualizationResizeService.canvasInfo.canvasHeightHalf;
                        var a1 = ((index + 0) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        var a2 = ((index + 1) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        var radius = freqArrayL[index] * 3;

                        visualizer.ctx.strokeStyle = visualizationThemeService.styles.downwardSpiral.borderColor;
                        visualizer.ctx.lineWidth = visualizationThemeService.styles.downwardSpiral.borderWidth;

                        visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.downwardSpiral.color,index/255);

                        visualizer.ctx.beginPath();
                        visualizer.ctx.moveTo(startX,startY);
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
                        visualizer.ctx.lineTo(startX,startY);
                        visualizer.ctx.stroke();
                        visualizer.ctx.fill();
                    }
                }
                for (index = 0; index < freqArrayR.length; index++) {
                    if (index % 2 == 0) {
                        startX = visualizationResizeService.canvasInfo.canvasWidthThreeQuarters;
                        startY = visualizationResizeService.canvasInfo.canvasHeightHalf;
                        a1 = ((index + 0) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        a2 = ((index + 1) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        radius = freqArrayR[index] * 3;

                        visualizer.ctx.strokeStyle = visualizationThemeService.styles.downwardSpiral.borderColor;
                        visualizer.ctx.lineWidth = visualizationThemeService.styles.downwardSpiral.borderWidth;

                        visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.downwardSpiral.color,index/255);

                        visualizer.ctx.beginPath();
                        visualizer.ctx.moveTo(startX,startY);
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
                        visualizer.ctx.lineTo(startX,startY);
                        visualizer.ctx.stroke();
                        visualizer.ctx.fill();
                    }
                }

            }
            else {
                var freqArray = visualizer.getFreqArray();
                for (index = 0; index < freqArray.length; index++) {
                    if (index % 2 == 0) {
                        startX = visualizationResizeService.canvasInfo.canvasWidthHalf;
                        startY = visualizationResizeService.canvasInfo.canvasHeightHalf;
                        a1 = ((index + 0) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        a2 = ((index + 1) * (360/visualizationThemeService.styles.downwardSpiral.numRect))*Math.PI/180;
                        radius = freqArray[index] * 3;

                        visualizer.ctx.strokeStyle = visualizationThemeService.styles.downwardSpiral.borderColor;
                        visualizer.ctx.lineWidth = visualizationThemeService.styles.downwardSpiral.borderWidth;

                        visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.downwardSpiral.color,index/255);

                        visualizer.ctx.beginPath();
                        visualizer.ctx.moveTo(startX,startY);
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a1)),startY + (radius * Math.sin(a1)));
                        visualizer.ctx.lineTo(startX + (radius * Math.cos(a2)),startY + (radius * Math.sin(a2)));
                        visualizer.ctx.lineTo(startX,startY);
                        visualizer.ctx.stroke();
                        visualizer.ctx.fill();
                    }
                }
            }
        };



        /*------------------------------------------------------------------------------------------------------------*/
        /*--------------------------------------------------------------------------------------BARS------------------*/
        /*------------------------------------------------------------------------------------------------------------*/
        visualizer.visBars = function() {
            var freqArray = visualizer.getFreqArray();
            var width = parseInt(visualizationThemeService.styles.bars.width,10);
            for (var index = 0; index < freqArray.length; index++) {
                var chunkHeight = parseInt((freqArray[index] * -2),10);
                var chunkWidth = visualizationResizeService.canvasInfo.chunkWidth-visualizationResizeService.canvasInfo.chunkSpacer;
                visualizer.ctx.beginPath();
                visualizer.ctx.rect(index * visualizationResizeService.canvasInfo.chunkWidth * width,
                    visualizationResizeService.canvasInfo.canvasHeight + (visualizationThemeService.styles.bars.borderWidth/2),
                    chunkWidth * width,
                    chunkHeight);
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.bars.borderColor;
                visualizer.ctx.lineWidth = visualizationThemeService.styles.bars.borderWidth;
                visualizer.ctx.fillStyle = visualizationThemeService.styles.bars.color;
                visualizer.ctx.fill();
                visualizer.ctx.stroke();
            }
        };


        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------BARCODE--------------*/
        /*------------------------------------------------------------------------------------------------------------*/
        visualizer.visBarcode = function() {
            var freqArray = visualizer.getSmallArray( parseInt(visualizationThemeService.styles.barcode.spacing,10));

            visualizer.ctx.beginPath();
            visualizer.ctx.lineWidth = visualizationThemeService.styles.barcode.thickness;
            visualizer.ctx.lineCap = "round";
            visualizer.ctx.lineJoin = "round";
            visualizer.ctx.strokeStyle = visualizationThemeService.styles.barcode.color;

            var chunkWidth = visualizationResizeService.canvasInfo.canvasWidthHalf/freqArray.length;

            for (var i = 1; i < visualizationThemeService.styles.barcode.total; i++) {
                for (var index = freqArray.length; index > 0; index--) {
                    var chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    var chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    visualizer.ctx.moveTo((freqArray.length-index)*chunkWidth, chunkHeight + visualizationResizeService.canvasInfo.canvasHeight-5);
                    visualizer.ctx.lineTo((freqArray.length-index)*chunkWidth, chunkHeight2 + visualizationResizeService.canvasInfo.canvasHeight-5);
                }
                for (index = 0; index < freqArray.length; index++) {
                    chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    visualizer.ctx.moveTo(index*chunkWidth + (visualizationResizeService.canvasInfo.canvasWidthHalf), chunkHeight  + visualizationResizeService.canvasInfo.canvasHeight-5);
                    visualizer.ctx.lineTo(index*chunkWidth + (visualizationResizeService.canvasInfo.canvasWidthHalf), chunkHeight2 + visualizationResizeService.canvasInfo.canvasHeight-5);
                }
                visualizer.ctx.stroke();
            }
        };


        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------BUMPS------------*/
        /*------------------------------------------------------------------------------------------------------------*/
        var leftOfset = 5;
        var topOffset = 5;
        var total;
        var index, chunkHeight, chunkHeight2;
        visualizer.visBumps = function() {
            visualizer.ctx.lineWidth = 1;
            var freqArray = visualizer.getFreqArray(50);
            var chunkWidth = visualizationResizeService.canvasInfo.canvasWidthHalf/freqArray.length;

            total = !visualizationThemeService.styles.bumps.mirror ?
                visualizationThemeService.styles.bumps.total :
                    visualizationThemeService.styles.bumps.total > 10 ?
                        10 :
                        visualizationThemeService.styles.bumps.total;

            for (var i = 1; i < total; i++) {

                visualizer.ctx.beginPath();
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.bumps.bottomLeft;
                for (index = 0; index < freqArray.length; index++) {
                    chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    visualizer.ctx.moveTo((freqArray.length-index)*chunkWidth + (chunkWidth*1.5) - leftOfset, chunkHeight + visualizationResizeService.canvasInfo.canvasHeight-topOffset);
                    visualizer.ctx.lineTo((freqArray.length-index)*chunkWidth + (chunkWidth/2) - leftOfset, chunkHeight2 + visualizationResizeService.canvasInfo.canvasHeight-topOffset);
                }
                visualizer.ctx.stroke();
                visualizer.ctx.closePath();

                visualizer.ctx.beginPath();
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.bumps.bottomRight;
                for (index = 0; index < freqArray.length; index++) {
                    chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10) / i;
                    visualizer.ctx.moveTo(index*chunkWidth + (chunkWidth/2)   + (visualizationResizeService.canvasInfo.canvasWidthHalf) - leftOfset, chunkHeight  + visualizationResizeService.canvasInfo.canvasHeight-topOffset);
                    visualizer.ctx.lineTo(index*chunkWidth + (chunkWidth*1.5) + (visualizationResizeService.canvasInfo.canvasWidthHalf) - leftOfset, chunkHeight2 + visualizationResizeService.canvasInfo.canvasHeight-topOffset);
                }
                visualizer.ctx.stroke();
                visualizer.ctx.closePath();
            }
            if (visualizationThemeService.styles.bumps.mirror) {
                for (i = 1; i < total; i++) {
                    visualizer.ctx.beginPath();
                    visualizer.ctx.strokeStyle = visualizationThemeService.styles.bumps.topLeft;
                    for (index = 0; index < freqArray.length; index++) {
                        chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256),10) / i;
                        chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256),10) / i;
                        visualizer.ctx.moveTo((freqArray.length-index)*chunkWidth + (chunkWidth*1.5) - leftOfset,  chunkHeight + topOffset);
                        visualizer.ctx.lineTo((freqArray.length-index)*chunkWidth + (chunkWidth/2) - leftOfset,  chunkHeight2 + topOffset);
                    }
                    visualizer.ctx.stroke();
                    visualizer.ctx.closePath();

                    visualizer.ctx.beginPath();
                    visualizer.ctx.strokeStyle = visualizationThemeService.styles.bumps.topRight;
                    for (index = 0; index < freqArray.length; index++) {
                        chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256),10) / i;
                        chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256),10) / i;
                        visualizer.ctx.moveTo(index*chunkWidth + (chunkWidth/2)   + (visualizationResizeService.canvasInfo.canvasWidthHalf) - leftOfset, chunkHeight + topOffset);
                        visualizer.ctx.lineTo(index*chunkWidth + (chunkWidth*1.5) + (visualizationResizeService.canvasInfo.canvasWidthHalf) - leftOfset, chunkHeight2 + topOffset);
                    }
                    visualizer.ctx.stroke();
                    visualizer.ctx.closePath();
                }
            }
        };



        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------MOUNTAINS------------*/
        /*------------------------------------------------------------------------------------------------------------*/
        visualizer.visMountains = function() {
            var freqArray = visualizer.getFreqArray();

            visualizer.ctx.beginPath();
            visualizer.ctx.lineWidth = visualizationThemeService.styles.mountains.thickness;
            visualizer.ctx.lineCap = "round";
            visualizer.ctx.lineJoin = "round";
            visualizer.ctx.strokeStyle = visualizationThemeService.styles.mountains.color;

            for (var index = 0; index < freqArray.length; index++) {
                var chunkHeight = parseInt((freqArray[index] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10);
                var chunkHeight2 = parseInt((freqArray[index+1] * visualizationResizeService.canvasInfo.canvasHeight / 256 * -1),10);
                var chunkWidth = visualizationResizeService.canvasInfo.chunkWidth * 2;
                visualizer.ctx.moveTo(index*chunkWidth + (chunkWidth/2), chunkHeight + visualizationResizeService.canvasInfo.canvasHeight-5);
                visualizer.ctx.lineTo(index*chunkWidth + (chunkWidth*1.5), chunkHeight2 + visualizationResizeService.canvasInfo.canvasHeight-5);
            }
            visualizer.ctx.stroke();
        };


        /*------------------------------------------------------------------------------------------------------------*/
        /*-----------------------------------------------------------------------------------------------SCOPE--------*/
        /*------------------------------------------------------------------------------------------------------------*/
        visualizer.visScope = function() {
            var percent2;
            var barWidth = visualizationResizeService.canvasInfo.canvasWidth /256;
            var timeArray = visualizer.getTimeArray();
            for (index = 0; index < timeArray.length; index++) {
                var percent = timeArray[index] / 256;
                index < timeArray.length ? percent2 = timeArray[index+1] / 256 : percent2 = timeArray[index] / 256;
                var height = visualizationResizeService.canvasInfo.canvasHeight * percent;
                var height2 = visualizationResizeService.canvasInfo.canvasHeight * percent2;
                var offset = visualizationResizeService.canvasInfo.canvasHeight - height - 1;
                var offset2 = visualizationResizeService.canvasInfo.canvasHeight - height2 - 1;
                visualizer.ctx.beginPath();
                visualizer.ctx.lineWidth = visualizationThemeService.styles.scope.thickness;
                visualizer.ctx.lineCap = "round";
                visualizer.ctx.lineJoin = "round";
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.scope.color;
                visualizer.ctx.moveTo(index*barWidth,offset);
                visualizer.ctx.lineTo(index*barWidth+barWidth,offset2);
                visualizer.ctx.stroke();
                visualizer.ctx.closePath();
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------TUNNEL-----*/
        /*------------------------------------------------------------------------------------------------------------*/

        var lines = [{r:0},{r:8}];
        visualizer.visTunnel = function() {

            var nextIndex = false;
            var db = visualizer.getAverageDB();

            visualizer.ctx.lineWidth = 1;

            visualizationThemeService.styles.tunnel.dbOpacity ?
                visualizer.ctx.strokeStyle = hexToRGBA(visualizationThemeService.styles.tunnel.color,db/60) :
                visualizer.ctx.strokeStyle = hexToRGBA(visualizationThemeService.styles.tunnel.color,1);

            for (var index = 0; index < lines.length + 1; index++) {
                if (lines[index] != undefined) {
                    lines[index].r += (Math.round( visualizationThemeService.styles.tunnel.speed * 10 ) / 10) + (Math.pow(lines[index].r,2) / 20000) + (db/3);
                    visualizer.ctx.beginPath();

                    visualizer.ctx.arc(
                        visualizationResizeService.canvasInfo.canvasWidthHalf,
                        visualizationResizeService.canvasInfo.canvasHeightHalf,
                        lines[index].r,
                        0,
                        2 * Math.PI,
                        true
                    );




                    visualizer.ctx.stroke();
                }
                else if (!nextIndex && lines.length){
                    nextIndex = true;
                    if (lines[index-1].r > 8) { lines.push({r:1}); }
                }
            }
            for (index = 0; index < lines.length; index++) {
                if (lines[index].r > visualizationResizeService.canvasInfo.canvasWidthHalf + 60) {lines.splice(index,1);}
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------MATH MACHINE---------*/
        /*------------------------------------------------------------------------------------------------------------*/

        visualizer.visMathMachine = function() {
            var points = [];
            var freqData = visualizer.getFreqArray();
            var opacity = visualizer.getAverageDB()/75;
            var totalSquares = parseInt(visualizationThemeService.styles.mathMachine.total,10);
            var totalLevels = parseInt(visualizationThemeService.styles.mathMachine.levels,10);
            var additionalRad = parseInt(visualizationThemeService.styles.mathMachine.radius,10);
            var freqInterval = parseInt(255 / (4 * totalSquares),10);

            visualizationThemeService.styles.mathMachine.dbOpacity ?
                visualizer.ctx.strokeStyle = hexToRGBA(visualizationThemeService.styles.mathMachine.squareColor,opacity) :
                visualizer.ctx.strokeStyle = visualizationThemeService.styles.mathMachine.squareColor;

            var center = {
                x: visualizationResizeService.canvasInfo.canvasWidthHalf,
                y: visualizationResizeService.canvasInfo.canvasHeightHalf
            };

            for (var i = 0; i < totalSquares * 4; i++) {
                points.push({
                    x: Math.cos(i * 360 / (totalSquares * 4) * (Math.PI / 180)),
                    y: Math.sin(i * 360 / (totalSquares * 4) * (Math.PI / 180))
                });
            }

            visualizer.ctx.lineWidth = 1;
            for (var lvl = totalLevels; lvl > 0; lvl-- ) {
                for ( var squareNum = 1; squareNum < (totalSquares+1); squareNum++) {

                    var pointIndex1 = squareNum+(0)-1;
                    var pointIndex2 = squareNum+(totalSquares)-1;
                    var pointIndex3 = squareNum+(totalSquares*2)-1;
                    var pointIndex4 = squareNum+(totalSquares*3)-1;
                    var rad1 = freqData[(0)*freqInterval] / (lvl/1.5) + additionalRad;
                    var rad2 = freqData[(squareNum)*freqInterval] / (lvl/1.5) + additionalRad;
                    var rad3 = freqData[(squareNum*2)*freqInterval] / (lvl/1.5) + additionalRad;
                    var rad4 = freqData[(squareNum*3)*freqInterval] / (lvl/1.5) + additionalRad;
                    var point1 = {x:center.x + (rad1 * points[pointIndex1].x),  y:center.y + (rad1 * points[pointIndex1].y)};
                    var point2 = {x:center.x + (rad2 * points[pointIndex2].x),  y:center.y + (rad2 * points[pointIndex2].y)};
                    var point3 = {x:center.x + (rad3 * points[pointIndex3].x),  y:center.y + (rad3 * points[pointIndex3].y)};
                    var point4 = {x:center.x + (rad4 * points[pointIndex4].x),  y:center.y + (rad4 * points[pointIndex4].y)};

                    visualizer.ctx.beginPath();
                    visualizer.ctx.moveTo(point1.x, point1.y);
                    visualizer.ctx.lineTo(point2.x, point2.y);
                    visualizer.ctx.lineTo(point3.x, point3.y);
                    visualizer.ctx.lineTo(point4.x, point4.y);
                    visualizer.ctx.lineTo(point1.x, point1.y);
                    visualizer.ctx.stroke();

                    if (lvl == 1 && visualizationThemeService.styles.mathMachine.pointLines) {
                        visualizer.ctx.moveTo(center.x, center.y); visualizer.ctx.lineTo(point1.x, point1.y);
                        visualizer.ctx.moveTo(center.x, center.y);	visualizer.ctx.lineTo(point2.x, point2.y);
                        visualizer.ctx.moveTo(center.x, center.y); visualizer.ctx.lineTo(point3.x, point3.y);
                        visualizer.ctx.moveTo(center.x, center.y);	visualizer.ctx.lineTo(point4.x, point4.y);
                        visualizer.ctx.stroke();
                    }

                }
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------------GRID-----------*/
        /*------------------------------------------------------------------------------------------------------------*/

        visualizer.visGrid = function() {
            var freqData = visualizer.getFreqArray();
            var dB = Math.round( (visualizer.getAverageDB() / 75) * 10) / 10;
            var spacing  = parseInt(visualizationThemeService.styles.grid.spacing, 10);
            var cellSize = parseInt(visualizationThemeService.styles.grid.cellSize,10);

            var clrTopDbOn  = hexToRGBA(visualizationThemeService.styles.grid.colorTop, dB);
            var clrBotDbOn  = hexToRGBA(visualizationThemeService.styles.grid.colorBot, dB);
            var clrTopDbOff = hexToRGBA(visualizationThemeService.styles.grid.colorTop, visualizationThemeService.styles.grid.dBOffBaseOpacity);
            var clrBotDbOff = hexToRGBA(visualizationThemeService.styles.grid.colorBot, visualizationThemeService.styles.grid.dBOffBaseOpacity);

            for (var y = 0; y < (parseInt(visualizationResizeService.canvasInfo.canvasHeight / (cellSize+spacing),10) + 1); y++) {
                for (var x = 0; x < (parseInt(visualizationResizeService.canvasInfo.canvasWidth  / (cellSize+spacing),10) + 1); x++) {

                    if (dB > 0 && freqData[x] > 0 && y < freqData[x]/(spacing+cellSize)*3) {
                        visualizationThemeService.styles.grid.dbOpacity ? visualizer.ctx.fillStyle = clrTopDbOn : visualizer.ctx.fillStyle = clrTopDbOff;
                    }
                    else {
                        visualizationThemeService.styles.grid.dbOpacity ? visualizer.ctx.fillStyle = clrBotDbOn : visualizer.ctx.fillStyle = clrBotDbOff;
                    }

                    visualizer.ctx.beginPath();
                    visualizer.ctx.rect(spacing + (x * (cellSize+spacing)), spacing + (y * (cellSize+spacing)), cellSize, cellSize);
                    visualizer.ctx.fill();

                }
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------CIRLCES----*/
        /*------------------------------------------------------------------------------------------------------------*/
        var circS = [];
        var circH = [];

        function createNewCircle (startingRadius) {
            return {
                c: rgbaBetweenTwoHexes(visualizationThemeService.styles.circles.color.min,visualizationThemeService.styles.circles.color.max,randomNumber(0,0.5,4)),
                r: startingRadius,
                x: visualizationResizeService.canvasInfo.canvasWidth + randomNumber(0,40),
                y: randomNumber(parseFloat(visualizationThemeService.styles.circles.padding), visualizationResizeService.canvasInfo.canvasHeight - visualizationThemeService.styles.circles.padding),
                xRemoval: randomNumber(1,20)
            };
        }

        visualizer.visCircleSpread = function() {

            var dB = visualizer.getAverageDB();
            var center = visualizationResizeService.canvasInfo.canvasHeightHalf;
            var squeeze = parseInt(visualizationThemeService.styles.circles.squeeze);

            for ( i = 0; i < circS.length; i++) {
                if (circS[i].y > center) { circS[i].y - squeeze < center ? circS[i].y = center : circS[i].y -= squeeze;	}
                if (circS[i].y < center) { circS[i].y + squeeze > center ? circS[i].y = center : circS[i].y += squeeze;	}
                circS[i].x -= (circS[i].xRemoval * visualizationThemeService.styles.circles.speedSolid);
                circS[i].r -= visualizationThemeService.styles.circles.reduction;
            }
            for (var i = 0; i < visualizationThemeService.styles.circles.solid.total; i++) {
                if (circS[i] == undefined && dB > 0) {
                    var x = randomNumber(1,10,0);
                    if (x == 1) {circS.push(createNewCircle(randomNumber(1,visualizationThemeService.styles.circles.solid.maxSize))); }

                }
                if (circS[i] != undefined){
                    if (circS[i].r < 0) {circS.splice(i,1);}
                }
            }

            for ( i = 0; i < circH.length; i++) {
                if (circH[i].y > center) { circH[i].y - squeeze < center ? circH[i].y = center : circH[i].y -= squeeze;	}
                if (circH[i].y < center) { circH[i].y + squeeze > center ? circH[i].y = center : circH[i].y += squeeze;	}
                circH[i].x -= (circH[i].xRemoval * visualizationThemeService.styles.circles.speedHighlight);
                circH[i].r -= visualizationThemeService.styles.circles.reduction;
            }
            for ( i = 0; i < visualizationThemeService.styles.circles.highlight.total; i++) {
                if (circH[i] == undefined && dB > 0) {circH.push(createNewCircle(randomNumber(1,visualizationThemeService.styles.circles.highlight.maxSize))); }
                if (circH[i] != undefined){
                    if (circH[i].r < 0) {circH.splice(i,1);}
                }
            }

            visualizer.ctx.shadowBlur = 0;
            visualizer.ctx.shadowBlur = 14;
            visualizer.ctx.shadowColor = '#000000';
            visualizer.ctx.shadowOffsetX = 0;
            visualizer.ctx.shadowOffsetY = 0;
            visualizer.ctx.lineWidth = 4;
            for ( i = 0; i < circH.length; i++) {
                if (circH[i].r > 0) {
                    var grd = visualizer.ctx.createRadialGradient(circH[i].x, circH[i].y, circH[i].r, circH[i].x, circH[i].y, 0);
                    visualizer.ctx.beginPath();
                    visualizer.ctx.arc(circH[i].x, circH[i].y, circH[i].r, 0, Math.PI*2, false);
                    grd.addColorStop(0,  circH[i].c);
                    grd.addColorStop(0.3,'rgba(0,0,0,0.5)');
                    grd.addColorStop(1,  'rgba(0,0,0,1)');
                    visualizer.ctx.fillStyle = grd;
                    visualizer.ctx.fill();
                    visualizer.ctx.closePath();
                }
            }

            visualizer.ctx.shadowBlur = 0;
            visualizer.ctx.shadowColor = '';
            visualizer.ctx.lineWidth = 0;
            for ( i = 0; i < circS.length; i++) {
                if (circS[i].r > 0) {
                    visualizer.ctx.beginPath();
                    visualizer.ctx.arc(circS[i].x, circS[i].y, circS[i].r, 0, Math.PI*2, false);
                    visualizer.ctx.fillStyle = circS[i].c;
                    visualizer.ctx.fill();
                    visualizer.ctx.closePath();
                }
            }
        };



        /*------------------------------------------------------------------------------------------------------------*/
        /*-----------------------------------------------------------------------------------------------Rectangle Blur-*/
        /*------------------------------------------------------------------------------------------------------------*/
        var spacing = 5;
        var rectCircles = [];

        function RectCircle() {
            var paddingSides = Math.floor(visualizationThemeService.styles.rectangleBlur.paddingSides);

            return {
                x: randomNumber(paddingSides,visualizationResizeService.canvasInfo.canvasWidth - paddingSides),
                y: visualizationResizeService.canvasInfo.canvasHeightHalf,
                r: randomNumber(0,visualizationThemeService.styles.rectangleBlur.circleMaxSize),
                xAdd:randomNumber(-1,1),
                yAdd:randomNumber(-1,1)
            }
        }

        visualizer.visRectangleBlur = function() {
            var paddingSides = Math.floor(visualizationThemeService.styles.rectangleBlur.paddingSides);
            var dbLevel = visualizer.getAverageDB();
            var freqArray = visualizer.getFreqArray();
            freqArray.splice(freqArray.length-200,200);
            var freqIndex = Math.floor(freqArray.length / visualizationThemeService.styles.rectangleBlur.columns);
            var chunkWidth = (visualizationResizeService.canvasInfo.canvasWidth - (paddingSides*2) ) / visualizationThemeService.styles.rectangleBlur.columns;
            visualizer.ctx.lineWidth = 1;

            var circleReduction = Math.floor(visualizationThemeService.styles.rectangleBlur.circleReduction)/10;

            for ( i =0; i < visualizationThemeService.styles.rectangleBlur.totalCircles; i++ ) {
                if (rectCircles[i] == undefined) {
                    rectCircles.push(new RectCircle());
                }
                rectCircles[i].x += rectCircles[i].xAdd;
                rectCircles[i].y += rectCircles[i].yAdd;
                rectCircles[i].r -= randomNumber(Math.floor(circleReduction/2),circleReduction);

                if (rectCircles[i].r < 0 ) {
                    rectCircles[i] = new RectCircle();
                }

                visualizer.ctx.beginPath();
                visualizer.ctx.arc(
                    rectCircles[i].x,
                    rectCircles[i].y,
                    rectCircles[i].r,
                    0, Math.PI*2, false);
                visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.rectangleBlur.circleColor, dbLevel/120 );
                visualizer.ctx.fill();

            }


            for (var column = 0; column < visualizationThemeService.styles.rectangleBlur.columns; column++) {

                var chunkHeight = parseInt((freqArray[column*freqIndex] * -2),10);
                var numOfCells = Math.floor(chunkHeight/visualizationThemeService.styles.rectangleBlur.cellSize);

                for ( var i = -1; i > numOfCells; i--) {
                    for (var topBottom = 0; topBottom < 2; topBottom++) {

                        visualizer.ctx.beginPath();
                        visualizer.ctx.strokeStyle = hexToRGBA(visualizationThemeService.styles.rectangleBlur.barBorder, (1 - (i / (numOfCells-1))).toFixed(1) );
                        visualizer.ctx.rect(
                            paddingSides + (column*chunkWidth) + spacing,
                            topBottom == 0 ?
                                visualizationResizeService.canvasInfo.canvasHeightHalf - (i*visualizationThemeService.styles.rectangleBlur.cellSize) + 5:
                                visualizationResizeService.canvasInfo.canvasHeightHalf - 5,
                            chunkWidth - (spacing*2),
                            i * visualizationThemeService.styles.rectangleBlur.cellSize
                        );
                        visualizer.ctx.stroke();

                        if (i > numOfCells/2) {
                            visualizer.ctx.fillStyle =visualizationThemeService.styles.rectangleBlur.barColor;
                            visualizer.ctx.fill();
                        }
                    }
                }

            }

        };



        /*------------------------------------------------------------------------------------------------------------*/
        /*------------------------------------------------------------------------------------------------CIRCLETHREADS*/
        /*------------------------------------------------------------------------------------------------------------*/
        var circleThreads = [];
        var circleThread = function() {
            return {
                r: visualizationThemeService.styles.circleThreads.reverse ? visualizationResizeService.canvasInfo.canvasHeightHalf : 0,
                radiusSpeed:
                    parseInt(
                        randomNumber(
                            parseInt(visualizationThemeService.styles.circleThreads.radiusSpeed/2,10) ,
                            parseInt(visualizationThemeService.styles.circleThreads.radiusSpeed),10)
                    )
            }
        };

        visualizer.visCircleThreads = function() {

            var freqArray = visualizer.getFreqArray(100);
            var freqIndex = Math.floor(freqArray.length / visualizationThemeService.styles.circleThreads.columns);
            var chunkWidth = Math.floor((visualizationResizeService.canvasInfo.canvasWidth - (visualizationThemeService.styles.circleThreads.paddingSides*2) ) / visualizationThemeService.styles.circleThreads.columns);

            for (var column = 0; column < visualizationThemeService.styles.circleThreads.columns; column++) {
                if (circleThreads[column] == undefined) {circleThreads[column] = [];}
                var freq = freqArray[freqIndex * column];
                for ( var i = 0; i < visualizationThemeService.styles.circleThreads.totalPerColumn; i++) {
                    if (circleThreads[column][i] == undefined) {circleThreads[column].push(circleThread());}


                    if(visualizationThemeService.styles.circleThreads.reverse ) {
                        freq > 0 ?
                            circleThreads[column][i].r -= (circleThreads[column][i].radiusSpeed + randomNumber(1,5) ):
                            circleThreads[column][i].r += (circleThreads[column][i].radiusSpeed * visualizationThemeService.styles.circleThreads.decaySpeed);

                    }
                    else {
                        freq > 0  ?
                            circleThreads[column][i].r += (circleThreads[column][i].radiusSpeed + randomNumber(1,5)) :
                            circleThreads[column][i].r -= (circleThreads[column][i].radiusSpeed * visualizationThemeService.styles.circleThreads.decaySpeed);

                    }


                    if (circleThreads[column][i].r > 0 && circleThreads[column][i].r < visualizationResizeService.canvasInfo.canvasHeightHalf) {

                        visualizer.ctx.lineWidth = 1;
                        visualizer.ctx.beginPath();
                        visualizer.ctx.arc(
                            parseInt(visualizationThemeService.styles.circleThreads.paddingSides,10) + ( (column + 0.5) * chunkWidth) ,
                            visualizationResizeService.canvasInfo.canvasHeightHalf,
                            circleThreads[column][i].r, 0, Math.PI*2, false);
                        visualizer.ctx.strokeStyle = hexToRGBA(
                            i % parseInt(visualizationThemeService.styles.circleThreads.highlightConsistency,10) == 0 ?
                                visualizationThemeService.styles.circleThreads.highlightColor :
                                visualizationThemeService.styles.circleThreads.color,
                            1 - (circleThreads[column][i].r / (visualizationResizeService.canvasInfo.canvasHeightHalf)));
                        visualizer.ctx.stroke();


                    }
                    else {
                        var chance = randomNumber(1,10,0);
                        if (chance == 1) {circleThreads[column][i] = circleThread();}
                    }

                }
            }
        };




        /*------------------------------------------------------------------------------------------------------------*/
        /*------------------------------------------------------------------------------------------------CIRCLE MOUNTAIN-*/
        /*------------------------------------------------------------------------------------------------------------*/

        visualizer.visCircleMountains = function() {
            var freqArray = visualizer.getFreqArray();
            freqArray.splice(freqArray.length-150,150);
            var freqIndex = Math.floor(freqArray.length / visualizationThemeService.styles.circleMountains.columns);
            var chunkWidth = (visualizationResizeService.canvasInfo.canvasWidth - (visualizationThemeService.styles.circleMountains.paddingSides*2) ) / visualizationThemeService.styles.circleMountains.columns;
            for (var column = 0; column < visualizationThemeService.styles.circleMountains.columns; column++) {
                var chunkHeight = parseInt((freqArray[column*freqIndex] * -3),10);
                var numOfCells = -1 * Math.floor(chunkHeight/visualizationThemeService.styles.circleMountains.verticalSpacing);
                for ( var i = 0; i < numOfCells; i++) {

                    visualizer.ctx.beginPath();
                    visualizer.ctx.arc(
                        parseInt(visualizationThemeService.styles.circleMountains.paddingSides,10) + ( (column + 0.5) * chunkWidth),
                        (visualizationResizeService.canvasInfo.canvasHeight-visualizationThemeService.styles.circleMountains.paddingBottom) - (i*visualizationThemeService.styles.circleMountains.verticalSpacing),
                        Math.pow(i*visualizationThemeService.styles.circleMountains.verticalSpacing,visualizationThemeService.styles.circleMountains.radiusGrowth) / 2,
                        0, Math.PI*2, false);

                    if (i == numOfCells-1) {
                        visualizer.ctx.lineWidth = visualizationThemeService.styles.circleMountains.tipThickness;
                        visualizer.ctx.strokeStyle = visualizationThemeService.styles.circleMountains.tipColor;
                    }
                    else {
                        visualizer.ctx.lineWidth = 1;
                        visualizer.ctx.strokeStyle = visualizationThemeService.styles.circleMountains.color;
                    }
                    visualizer.ctx.stroke();
                }
            }
        };












        /*------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------CIRCLE X4--*/
        /*------------------------------------------------------------------------------------------------------------*/
        var circlesX4 = [];

        function createNewCircleX4 () {
            // 1=top, 2=bottom, 3=left, 4=right
            var padX = parseFloat(visualizationThemeService.styles.circlesX4.padding) * visualizationResizeService.canvasInfo.canvasWidth;
            var padY = parseFloat(visualizationThemeService.styles.circlesX4.padding) * visualizationResizeService.canvasInfo.canvasHeight;
            var x = parseInt(randomNumber(padX, visualizationResizeService.canvasInfo.canvasWidth  - padX, 0),10);
            var y = parseInt(randomNumber(padY, visualizationResizeService.canvasInfo.canvasHeight - padY, 0),10);
            var newCircle = {
                removal: randomNumber(1,20),
                c: rgbaBetweenTwoHexes(visualizationThemeService.styles.circlesX4.colorMin,visualizationThemeService.styles.circlesX4.colorMax,parseFloat(visualizationThemeService.styles.circlesX4.opacity)),
                r: randomNumber(visualizationThemeService.styles.circlesX4.maxSize/2,visualizationThemeService.styles.circlesX4.maxSize),
                x:0,
                y:0,
                side: randomNumber(1,4,0)
            };


            switch (newCircle.side) {
                case '1': newCircle.x = x; newCircle.y = 0; break;
                case '2': newCircle.x = x; newCircle.y = visualizationResizeService.canvasInfo.canvasHeight; break;
                case '3': newCircle.x = 0; newCircle.y = y; break;
                case '4': newCircle.x = visualizationResizeService.canvasInfo.canvasWidth; newCircle.y = y;
            }
            return newCircle;
        }

        visualizer.visCircleSpreadX4 = function() {


            var dB = visualizer.getAverageDB();
            var yM = visualizationResizeService.canvasInfo.canvasHeightHalf;
            var xM = visualizationResizeService.canvasInfo.canvasWidthHalf;
            var squeeze = parseInt(visualizationThemeService.styles.circlesX4.squeeze);
            for (var i = 0; i < circlesX4.length; i++) {
                //LEFT TO RIGHT EDITS
                if (circlesX4[i].side == 3 || circlesX4[i].side == 4) {
                    if (circlesX4[i].y > yM) { circlesX4[i].y - squeeze < yM ? circlesX4[i].y = yM : circlesX4[i].y -= squeeze; }
                    if (circlesX4[i].y < yM) { circlesX4[i].y + squeeze > yM ? circlesX4[i].y = yM : circlesX4[i].y += squeeze;	}
                }
                if (circlesX4[i].side == 3) {circlesX4[i].x += (circlesX4[i].removal * visualizationThemeService.styles.circlesX4.speed);}
                if (circlesX4[i].side == 4) {circlesX4[i].x -= (circlesX4[i].removal * visualizationThemeService.styles.circlesX4.speed);}

                //TOP TO BOTTOM EDITS
                if (circlesX4[i].side == 1 || circlesX4[i].side == 2) {
                    if (circlesX4[i].x > xM) { circlesX4[i].x - squeeze < xM ? circlesX4[i].x = xM : circlesX4[i].x -= (squeeze*3); }
                    if (circlesX4[i].x < xM) { circlesX4[i].x + squeeze > xM ? circlesX4[i].x = xM : circlesX4[i].x += (squeeze*3);	}
                }
                if (circlesX4[i].side == 1) {circlesX4[i].y += (circlesX4[i].removal * visualizationThemeService.styles.circlesX4.speed);}
                if (circlesX4[i].side == 2) {circlesX4[i].y -= (circlesX4[i].removal * visualizationThemeService.styles.circlesX4.speed);}

                //radius edit for all
                circlesX4[i].r -= (dB > 0 ? visualizationThemeService.styles.circlesX4.reduction : visualizationThemeService.styles.circlesX4.reduction * 8) ;
            }


            //build new circles
            for (i = 0; i < visualizationThemeService.styles.circlesX4.total; i++) {
                if (circlesX4[i] == undefined && dB > 0) {
                    circlesX4.push(createNewCircleX4());
                }
                if (circlesX4[i] != undefined){
                    if (circlesX4[i].r < 0 ||
                        circlesX4[i].x < -310 ||
                        circlesX4[i].x > visualizationResizeService.canvasInfo.canvasWidth + 310 ||
                        circlesX4[i].y < -310 ||
                        circlesX4[i].y > visualizationResizeService.canvasInfo.canvasHeight + 310) {
                        circlesX4.splice(i,1);
                    }
                }
            }

            //draw circles
            for ( i = 0; i < circlesX4.length; i++) {
                if (circlesX4[i].r > 0) {
                    if (visualizationThemeService.styles.circlesX4.side[circlesX4[i].side-1]) {
                        visualizer.ctx.beginPath();
                        visualizer.ctx.arc(circlesX4[i].x, circlesX4[i].y, circlesX4[i].r, 0, Math.PI*2, false);
                        visualizer.ctx.fillStyle = circlesX4[i].c;
                        visualizer.ctx.fill();
                        visualizer.ctx.closePath();
                    }

                }
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------Fountain-*/
        /*------------------------------------------------------------------------------------------------------------*/
        var fountainCircles = [];

        function createNewFountainCircle () {
            // 1=top, 2=bottom, 3=left, 4=right
            var padX = parseFloat(visualizationThemeService.styles.fountain.padding) * visualizationResizeService.canvasInfo.canvasWidth;
            var x = parseInt(randomNumber(padX, visualizationResizeService.canvasInfo.canvasWidth  - padX, 0),10);
            var y = visualizationThemeService.styles.fountain.reverse ? 0 : visualizationResizeService.canvasInfo.canvasHeight;

            var newCircle = {
                c: rgbBetweenTwoHexes(visualizationThemeService.styles.fountain.minColor,visualizationThemeService.styles.fountain.maxColor),
                r: randomNumber(visualizationThemeService.styles.fountain.maxSize/2,visualizationThemeService.styles.fountain.maxSize),
                x: x,
                y: y,
                xRem: randomNumber(-1 * parseFloat(visualizationThemeService.styles.fountain.xForce),parseFloat(visualizationThemeService.styles.fountain.xForce)),
                yRem: randomNumber(
                    parseFloat(visualizationThemeService.styles.fountain.yForce),20,0) * (randomNumber(0,1,0) == 0 ? -1 : 1)
            };

            switch (newCircle.side) {
                case '1': newCircle.x = x; newCircle.y = 0; break;
                case '2': newCircle.x = x; newCircle.y = visualizationResizeService.canvasInfo.canvasHeight; break;
                case '3': newCircle.x = 0; newCircle.y = y; break;
                case '4': newCircle.x = visualizationResizeService.canvasInfo.canvasWidth; newCircle.y = y;
            }
            return newCircle;
        }

        visualizer.visFountain = function() {

            var dB = visualizer.getAverageDB();

            for (var i = 0; i < fountainCircles.length; i++) {
                var circ = fountainCircles[i];
                circ.x += circ.xRem;
                circ.y += circ.yRem;
                circ.r -= (dB > 0 ? visualizationThemeService.styles.fountain.reduction/20 : visualizationThemeService.styles.fountain.reduction /10) ;
            }

            //build new circles
            for (i = 0; i < visualizationThemeService.styles.fountain.total; i++) {
                if ( fountainCircles[i] != undefined && fountainCircles[i].r < 0) { fountainCircles.splice(i,1); }
                if ( fountainCircles[i] == undefined && dB > 0) {
                    if (randomNumber(0,10,0) == 0) { fountainCircles.push(createNewFountainCircle()); }
                }

                if (fountainCircles[i] != undefined) {
                    circ = fountainCircles[i];
                    if (circ.x < 0) { circ.xRem = (circ.xRem * -1)}
                    if (circ.y < 0) { circ.yRem = (circ.yRem * -1)}
                    if (circ.x > visualizationResizeService.canvasInfo.canvasWidth)  {circ.xRem = (circ.xRem * -1)}
                    if (circ.y > visualizationResizeService.canvasInfo.canvasHeight) {circ.yRem = (circ.yRem * -1)}
                }
            }

            //draw circles
            for ( i = 0; i < fountainCircles.length; i++) {
                if (fountainCircles[i].r > 0) {
                    visualizer.ctx.beginPath();
                    visualizer.ctx.arc(fountainCircles[i].x, fountainCircles[i].y, fountainCircles[i].r, 0, Math.PI*2, false);
                    visualizer.ctx.fillStyle = fountainCircles[i].c;
                    visualizer.ctx.fill();
                    visualizer.ctx.closePath();
                }
            }
        };


        /*------------------------------------------------------------------------------------------------------------*/
        /*-------------------------------------------------------------------------------------------------Particles--*/
        /*------------------------------------------------------------------------------------------------------------*/


        var particles = [];
        function createParticle() {
            return {
                position: { x: visualizationResizeService.canvasInfo.canvasWidthHalf, y: visualizationResizeService.canvasInfo.canvasHeightHalf },
                size: randomNumber(0.01,1),
                angle: 0,
                speed: 0.05+Math.random(),
                targetSize: 1,
                fillColor: randomRGBA(),
                orbit: Math.random(),
                direction: randomNumber(0,1,0)}
        }

        visualizer.visParticles = function() {
            var db = visualizer.getAverageDB() * visualizationThemeService.styles.particles.dbIntensity / 10;
                for (var i = 0; i < visualizationThemeService.styles.particles.total; i++) {
                    if (particles[i] == undefined) {particles.push( createParticle() ); }
                    var particle = particles[i];

                    var lp = { x: particle.position.x, y: particle.position.y };
                    particle.direction == 0 ?
                        particle.angle -= (particle.speed * visualizationThemeService.styles.particles.speed) :
                        particle.angle += (particle.speed * visualizationThemeService.styles.particles.speed);

                    var inner = parseFloat(visualizationThemeService.styles.particles.innerRadius);
                    var outer = parseFloat(visualizationThemeService.styles.particles.outerRadius);
                    var orbit =  inner + (particle.orbit * ( outer - inner ) );

                    particle.position.x = visualizationResizeService.canvasInfo.canvasWidthHalf + Math.cos(i + particle.angle) * ((orbit + db));
                    particle.position.y = visualizationResizeService.canvasInfo.canvasHeightHalf + Math.sin(i + particle.angle) * ((orbit + db));
                    visualizer.ctx.beginPath();
                    visualizer.ctx.fillStyle = particle.fillColor;

                    if (visualizationThemeService.styles.particles.tracerLines && db > 0) {
                        visualizer.ctx.strokeStyle = particle.fillColor;
                        visualizer.ctx.lineWidth = particle.size * visualizationThemeService.styles.particles.maxSize;
                        visualizer.ctx.moveTo(lp.x, lp.y);
                        visualizer.ctx.lineTo(particle.position.x, particle.position.y);
                        visualizer.ctx.stroke();
                    }
                    visualizer.ctx.arc(particle.position.x, particle.position.y, particle.size * visualizationThemeService.styles.particles.maxSize / 2, 0, Math.PI*2, true);
                    visualizer.ctx.fill();
                }
        };


        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------------SPIRAL GALAXY--*/
        /*------------------------------------------------------------------------------------------------------------*/
        var spiralParticles = [];
        function createSpiralParticle () {
            return {
                position: { x: visualizationResizeService.canvasInfo.canvasWidthHalf, y: visualizationResizeService.canvasInfo.canvasHeightHalf },
                size: randomNumber(0.01,1),
                angle: 0,
                speed: 0.01+Math.random(),
                targetSize: 1,
                orbit: Math.random() }

        }

        visualizer.visSpiralGalaxy = function() {
            for (var i = 0; i < visualizationThemeService.styles.spiralGalaxy.total; i++) {
                if (spiralParticles[i] == undefined) {spiralParticles.push( createSpiralParticle() ); }

                var particle = spiralParticles[i];
                var db = visualizer.getAverageDB();
                var lp = { x: particle.position.x, y: particle.position.y };
                var orbit = 1 + (visualizationResizeService.canvasInfo.canvasWidthHalf * particle.orbit);

                particle.angle += (particle.speed  * visualizationThemeService.styles.spiralGalaxy.speed) + ( db * visualizationThemeService.styles.spiralGalaxy.dbIntensity /800) ;
                particle.position.x = visualizationResizeService.canvasInfo.canvasWidthHalf + Math.cos(i + particle.angle) * orbit;
                particle.position.y = visualizationResizeService.canvasInfo.canvasHeightHalf + Math.sin(i + particle.angle) * orbit;

                visualizer.ctx.beginPath();
                visualizer.ctx.fillStyle = visualizationThemeService.styles.spiralGalaxy.color;

                if (db > 0 ) {
                    visualizer.ctx.strokeStyle = visualizationThemeService.styles.spiralGalaxy.color;
                    visualizer.ctx.lineWidth = particle.size * visualizationThemeService.styles.spiralGalaxy.maxSize;
                    visualizer.ctx.moveTo(lp.x, lp.y);
                    visualizer.ctx.lineTo(particle.position.x, particle.position.y);
                    visualizer.ctx.stroke();
                }

                visualizer.ctx.arc(particle.position.x, particle.position.y, particle.size * visualizationThemeService.styles.spiralGalaxy.maxSize / 2, 0, Math.PI*2, true);
                visualizer.ctx.fill();
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------------SPINNER-----------*/
        /*------------------------------------------------------------------------------------------------------------*/
        var spinnerRotate = 0;
        visualizer.visSpinner = function() {

            var db = visualizer.getAverageDB();
            var radiusCounter = parseFloat(visualizationThemeService.styles.spinner.innerRadius);
            var totalCircles = parseFloat(visualizationThemeService.styles.spinner.totalCircles);
            var linesPerLayer = parseFloat(visualizationThemeService.styles.spinner.linesPerLayer);
            var circleSize =  parseFloat(visualizationThemeService.styles.spinner.circleSize);
            var circlePadding = parseFloat(visualizationThemeService.styles.spinner.circlePadding);

            spinnerRotate == 360 ? spinnerRotate = 0 : spinnerRotate += parseFloat(visualizationThemeService.styles.spinner.speed);
            spinnerRotate += (db/parseFloat(visualizationThemeService.styles.spinner.dbSpeedImpact));


            for (var circle = 0; circle <= totalCircles; circle++) {

                for (var i = 0; i < linesPerLayer; i++) {

                    visualizer.ctx.beginPath();
                    visualizer.ctx.strokeStyle = hexToRGBA(visualizationThemeService.styles.spinner.color,1-(circle/totalCircles));
                    visualizer.ctx.lineWidth = visualizationThemeService.styles.spinner.lineThickness;
                    visualizer.ctx.beginPath();

                    var rotateValue = circle % 2 == 0 ? spinnerRotate*-1 : spinnerRotate;

                    var angle = i * (360 / linesPerLayer) * Math.PI/180 + rotateValue;
                    var dbAdjust =  db * parseFloat(visualizationThemeService.styles.spinner.dbStretch);
                    var startX = visualizationResizeService.canvasInfo.canvasWidthHalf  + (radiusCounter + circlePadding + dbAdjust) * Math.cos(angle);
                    var startY = visualizationResizeService.canvasInfo.canvasHeightHalf + (radiusCounter + circlePadding + dbAdjust) * Math.sin(angle);
                    var endX   = visualizationResizeService.canvasInfo.canvasWidthHalf  + (radiusCounter - (circlePadding*2) + circleSize + dbAdjust) * Math.cos(angle);
                    var endY   = visualizationResizeService.canvasInfo.canvasHeightHalf + (radiusCounter - (circlePadding*2) + circleSize + dbAdjust) * Math.sin(angle);

                    visualizer.ctx.moveTo(startX,startY);
                    visualizer.ctx.lineTo(endX,endY);
                    visualizer.ctx.stroke();


                }

                radiusCounter += circleSize;
            }
        };

        /*------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------------------------------------------------------------SQUARES-----------*/
        /*------------------------------------------------------------------------------------------------------------*/

        visualizer.visSquares = function() {
            var freqArray = visualizer.getFreqArray();
            var dB = Math.round( (visualizer.getAverageDB() / 75) * 10) / 10;
            var padding  = parseFloat(visualizationThemeService.styles.squares.padding);
            var cellSize = parseFloat(visualizationThemeService.styles.squares.cellSize);
            var horizontalCells = (parseInt( visualizationResizeService.canvasInfo.canvasHeight / (padding * 2 + cellSize ), 10) + 1);
            var verticalCells = (parseInt( visualizationResizeService.canvasInfo.canvasWidth  / (padding * 2 + cellSize ), 10) + 1);

            for (var xRow = 0; xRow < verticalCells; xRow++) {
            for (var yRow = horizontalCells; yRow >= 0; yRow--) {

                var x = (xRow * (padding * 2 + cellSize)) - padding;
                var y = (yRow * (padding * 2 + cellSize)) - padding;
                var additionalSizing = yRow/horizontalCells >  freqArray[xRow*3]/255 ?
                    (freqArray[xRow*3] * (parseFloat(visualizationThemeService.styles.squares.growth))) :
                    0;

                visualizer.ctx.beginPath();
                visualizer.ctx.strokeStyle =
                    additionalSizing == 0 ?
                        dB > 0 ?
                            visualizationThemeService.styles.squares.borderColor :
                            hexToRGBA(visualizationThemeService.styles.squares.borderColorQuiet,0.2)
                        : visualizationThemeService.styles.squares.borderColorDb;

                visualizer.ctx.fillStyle = hexToRGBA(visualizationThemeService.styles.squares.fillColor,additionalSizing == 0 ? 0 : 0.2);
                visualizer.ctx.lineWidth = 1;

                visualizer.ctx.rect(
                    x + (padding*2) - (additionalSizing/2),
                    y + (padding*2) - (additionalSizing/2),
                    cellSize + additionalSizing,
                    cellSize + additionalSizing);

                visualizer.ctx.stroke();
                visualizer.ctx.fill();
                visualizer.ctx.closePath();

            }}
        };



		/*------------------------------------------------------------------------------------------------------------*/
		/*-------------------------------------------------------------------------------------------------Particles 2--*/
		/*------------------------------------------------------------------------------------------------------------*/


		var whirlyParticles = [];
		function createWhirlyParticle() {
			return {
				position: { x: visualizationResizeService.canvasInfo.canvasWidthHalf, y: visualizationResizeService.canvasInfo.canvasHeightHalf },
				size: randomNumber(0.01,1),
				fillColor: randomRGBA(),
				xMod: randomNumber(-10,10),
				yMod: randomNumber(-10,10),
				angle: 0,
				speed: 0.01+Math.random(),
				orbit: Math.random()
			}
		}

		visualizer.visWhirlyParticles = function() {
			var db = visualizer.getAverageDB() * visualizationThemeService.styles.whirlyParticles.dbIntensity / 10;
			for (var i = 0; i < visualizationThemeService.styles.whirlyParticles.total; i++) {
				if (whirlyParticles[i] == undefined) {whirlyParticles.push( createWhirlyParticle() ); }

				var particle = whirlyParticles[i];
				particle.position.x += particle.xMod;
				particle.position.y += particle.yMod;
				particle.angle += (particle.speed  * visualizationThemeService.styles.whirlyParticles.speed) + ( db * visualizationThemeService.styles.whirlyParticles.dbIntensity /800) ;

				if (db > 0) {
					var orbit = (visualizationResizeService.canvasInfo.canvasWidthHalf * particle.orbit) / (255/db);
					particle.position.x += Math.cos(i + particle.angle) * orbit;
					particle.position.y += Math.sin(i + particle.angle) * orbit;
					if (particle.position.x < 0 || particle.position.x > visualizationResizeService.canvasInfo.canvasWidth  ||
						particle.position.y < 0 || particle.position.y > visualizationResizeService.canvasInfo.canvasHeight ||
						particle.size < 0) {
						whirlyParticles[i] = createWhirlyParticle();
					}
				}
				else {

				}
				particle.size -= 0.02;
				if (particle.size > 0) {
					visualizer.ctx.beginPath();
					visualizer.ctx.fillStyle = db > 0 ? particle.fillColor : visualizationThemeService.styles.whirlyParticles.baseColor;
					visualizer.ctx.arc(particle.position.x, particle.position.y, particle.size * visualizationThemeService.styles.whirlyParticles.maxSize / 2, 0, Math.PI*2, true);
					visualizer.ctx.fill();
				}
			}
		};


		/*------------------------------------------------------------------------------------------------------------*/
		/*-------------------------------------------------------------------------------------------------Hex Map ---*/
		/*------------------------------------------------------------------------------------------------------------*/

		var numberOfSides = 6,
			size = 30,
			lineSize = 1;

		function drawHex(hex) {
			visualizer.ctx.moveTo (hex.x +  size * Math.cos(0), hex.y +  size *  Math.sin(0) );
			for (var i = 1; i <= numberOfSides;i += 1) {
				visualizer.ctx.lineTo (hex.x + size * Math.cos(i * 2 * Math.PI / numberOfSides), hex.y + size * Math.sin(i * 2 * Math.PI / numberOfSides));
			}
		};

		var hexes = [];
		for (var y = 0; (y * size) <= (visualizationResizeService.canvasInfo.canvasHeight); y++) {
			hexes.push([]);
			for (var x = 0; (x*size) <= visualizationResizeService.canvasInfo.canvasWidth; x++) {
				hexes[y].push({
					x: y % 2 == 0 ?
						x * (size - lineSize) * 3.5 - ((size-lineSize)*1.75) :
						x * (size - lineSize) * 3.5,
					y: y * (size - lineSize)
				})
			}
		}

		visualizer.visHexMap = function() {
			for ( var y = 0; (y*size) < visualizationResizeService.canvasInfo.canvasHeight; y++) {
					for (var x = 0; (x*size) < visualizationResizeService.canvasInfo.canvasWidth; x++) {
						visualizer.ctx.beginPath();
						drawHex(hexes[y][x]);
						visualizer.ctx.strokeStyle = y % 2 == 0 ? "#FF0000" : "#FFFFFF";
						visualizer.ctx.lineWidth = 1;
						visualizer.ctx.stroke();
						visualizer.ctx.fillStyle = "#FFFFFF";
						visualizer.ctx.fillText(x +':'+ y,hexes[y][x].x-15,hexes[y][x].y);
					}


			}
		}
	});