angular.module('touchPadModule', [])

	.directive('touchPad', function (audioProcessingService, audioChannelsService, midiService,uiThemeService,$timeout) {
		return {
			restrict:'C',
			templateUrl:'modules/touchPad/touchPad.html',
			replace: true,
			link: function(scope,elem) {

				var cnvs = elem[0].children[0].children[0];
				var ctx = cnvs.getContext("2d");
				var startCircleX = 0;
				var startCircleY = 0;
				var sweeping = false;
				var	mouse = {};
				var maxPadCircleSize = 200;
				var maxNumOfCircles = 500;
				var numOfButtonsDown = 0;

				scope.$on('$destroy',       function(event, args) { $timeout.cancel(prom); });

				scope.padCircleSize = 0.25;
				scope.numOfCircles = 0.5;
				scope.optionWaveTypes = audioWaveTypes;
				scope.waveTypeX = 1;
				scope.waveTypeY = 2;
				scope.minFreqX = touchPadFreqXMin;
				scope.maxFreqX = touchPadFreqXMax;
				scope.minFreqY = touchPadFreqYMin;
				scope.maxFreqY = touchPadFreqYMax;
				scope.circles = [];


				function circleColor(minColor,maxColor,index) {
					var r, g, b;
					var min = minColor.replace('#','');
					var max = maxColor.replace('#','');
					var minR = parseInt(min.substring(0,2), 16);
					var minG = parseInt(min.substring(2,4), 16);
					var minB = parseInt(min.substring(4,6), 16);
					var maxR = parseInt(max.substring(0,2), 16);
					var maxG = parseInt(max.substring(2,4), 16);
					var maxB = parseInt(max.substring(4,6), 16);
					var difR = minR - maxR;
					var difG = minG - maxG;
					var difB = minB - maxB;
					if (difR < 0) {difR *= -1;}
					if (difG < 0) {difG *= -1;}
					if (difB < 0) {difB *= -1;}
					minR == maxR ? r = minR : minR < maxR ?
						r = minR + (difR * (index/ (scope.numOfCircles * maxNumOfCircles))) :
						r = minR - (difR * (index/(scope.numOfCircles * maxNumOfCircles)));
					minG == maxG ? g = minG : minG < maxG ?
						g = minG + (difG * (index/(scope.numOfCircles * maxNumOfCircles))) :
						g = minG - (difG * (index/(scope.numOfCircles * maxNumOfCircles)));
					minB == maxB ? b = minB : minB < maxB ?
						b = minB + (difB * (index/(scope.numOfCircles * maxNumOfCircles))) :
						b = minB - (difB * (index/(scope.numOfCircles * maxNumOfCircles)));
					return 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ',0.5)';
				}

				function Circle(index) {
					this.x = startCircleX;
					this.y = startCircleY;
					this.radius = (index/(scope.numOfCircles * maxNumOfCircles)) * (scope.padCircleSize * maxPadCircleSize);
					this.r = Math.floor(255 / (scope.numOfCircles * maxNumOfCircles) * index);
					this.b = Math.floor(255 - this.r);
					index > (scope.numOfCircles * maxNumOfCircles) - 2 ?
						this.c = uiThemeService.theme.styles.touchPad.animationStart :
						this.c = circleColor(uiThemeService.theme.styles.touchPad.animationEnd,uiThemeService.theme.styles.touchPad.animationMiddle,index);

					this.draw = function() {
						ctx.beginPath();
						ctx.shadowBlur = 0;
						ctx.fillStyle = this.c;
						ctx.lineWidth = 0;
						ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
						ctx.fill();
						ctx.closePath();

					}
				}
				scope.getFreqAndLocTP = function(data) {
					var gridNum = data.msg.data1;
					var cellW = parseInt(window.getComputedStyle(cnvs.parentNode,null).width.replace(/\D/g, '' )) / 8;
					var cellH = parseInt(window.getComputedStyle(cnvs.parentNode,null).height.replace(/\D/g, '' )) / 8;
					var y = Math.floor(gridNum / 16) * cellH + (cellH / 2);
					var x = gridNum % 16 * cellW + (cellW / 2);
					var freqX = (x / cnvs.getBoundingClientRect().width)  * (scope.maxFreqX - scope.minFreqX) + scope.minFreqX;
					var freqY = (1-(y / cnvs.getBoundingClientRect().height)) * (scope.maxFreqY - scope.minFreqY) + scope.minFreqY;
					return ({x:x,y:y,freqX:freqX,freqY:freqY})
				};
				scope.getFreqAndLocMS = function(args) {
					var x = args.pageX - cnvs.getBoundingClientRect().left;
					var y = args.pageY - cnvs.getBoundingClientRect().top;
					if (x < 0) {x = 0;}
					if (y < 0) {y = 0;}
					if (x > cnvs.getBoundingClientRect().width) {x = cnvs.getBoundingClientRect().width; }
					if (y > cnvs.getBoundingClientRect().height) {y = cnvs.getBoundingClientRect().height; }
					var freqX  = (x / cnvs.getBoundingClientRect().width) * (scope.maxFreqX - scope.minFreqX) + scope.minFreqX;
					var freqY  = (1-(y / cnvs.getBoundingClientRect().height)) * (scope.maxFreqY - scope.minFreqY) + scope.minFreqY;
					return ({x:x,y:y,freqX:freqX,freqY:freqY})
				};

				scope.$on("midiUpdate", function(event,data) {
					var key = scope.channel.LaunchPadKey;
					if (midiService.LaunchPad != undefined && midiService.LaunchPad.rightControls[key] != undefined) {
						if (midiService.LaunchPad.rightControls[key].active) {

							freqAndLoc = scope.getFreqAndLocTP(data);
							var whichCell = data.msg.data1.toString();

							for (var cell in midiService.LaunchPad.grid) {
								if (cell == whichCell) {

									if (data.msg.data2 == 127) {
										numOfButtonsDown++;
										midiService.LaunchPad.toggleGridKey("on",data.msg.data1,"green");

										if (numOfButtonsDown == 1) {
											audioProcessingService.startDualSineWave(scope.channel,scope.optionWaveTypes[scope.waveTypeX].val,scope.optionWaveTypes[scope.waveTypeY].val);
										}
										audioProcessingService.updateDualSineWave(scope.channel,freqAndLoc.freqX,freqAndLoc.freqY);
									}
									if (data.msg.data2 == 0) {
										numOfButtonsDown--;
										midiService.LaunchPad.toggleGridKey("off",data.msg.data1);

										if (numOfButtonsDown == 0) {
											audioProcessingService.stopDualSineWave(scope.channel); }
									}

								}
							}
						}
					}


				});

                var freqAndLoc = {x:0,y:0,freqX:0,freqY:0};
				scope.$on('mouseMoveEvent',   function(e,args)   {
					if (sweeping) {
						if(e) {e.preventDefault(); }
						freqAndLoc = scope.getFreqAndLocMS(args);
						mouse.x = freqAndLoc.x;
						mouse.y = freqAndLoc.y;
						audioProcessingService.updateDualSineWave(scope.channel,freqAndLoc.freqX,freqAndLoc.freqY);
					}
				});

				scope.$on('mouseUpEvent', function() {
					if (sweeping) {
						sweeping = false;
						toggleCursorMask(sweeping);
                        freqAndLoc = {x:0,y:0,freqX:0,freqY:0};
						audioProcessingService.stopDualSineWave(scope.channel);
					}
				});

                var x, y;
				scope.mouseDown = function(e,args) {
					sweeping = true;
					toggleCursorMask(sweeping);
                    freqAndLoc = scope.getFreqAndLocMS(e);
					mouse.x = e.pageX - cnvs.getBoundingClientRect().left;
					mouse.y = e.pageY - cnvs.getBoundingClientRect().top;
					startCircleX = mouse.x;
					startCircleY = mouse.y;
					scope.circles = [];

					for(var i = 0; i < (scope.numOfCircles * maxNumOfCircles); i++) {scope.circles.push(new Circle(i));	}
					x  = (mouse.x / cnvs.getBoundingClientRect().width) * (scope.maxFreqX - scope.minFreqX) + scope.minFreqX;
					y  = (1-(mouse.y / cnvs.getBoundingClientRect().height)) * (scope.maxFreqY - scope.minFreqY) + scope.minFreqY;
					audioProcessingService.startDualSineWave(scope.channel,scope.optionWaveTypes[scope.waveTypeX].val,scope.optionWaveTypes[scope.waveTypeY].val);
					audioProcessingService.updateDualSineWave(scope.channel,x,y);
				};

				var prom;
				var timer = function() {

					var cnvsW = parseInt(window.getComputedStyle(cnvs.parentNode,null).width.replace(/\D/g, '' ));
					var cnvsH = parseInt(window.getComputedStyle(cnvs.parentNode,null).height.replace(/\D/g, '' ));
					angular.element(cnvs).attr({
						width:  cnvsW + "px",
						height: cnvsH  + "px"
					});
					ctx.fillStyle = uiThemeService.theme.styles.touchPad.backgroundColor;
					ctx.fillRect(0, 0, cnvsW, cnvsH);
					drawPath(ctx,[{x:0,y:cnvsH},{x:cnvsW,y:0}],uiThemeService.theme.styles.touchPad.diagonalThickness,uiThemeService.theme.styles.touchPad.diagonalColor);

					if (sweeping) {
						for(var i = 0; i < (scope.numOfCircles * maxNumOfCircles); i++) {
							var c1 = scope.circles[i],
								c2 = scope.circles[i-1];
							var index = scope.circles.length - 1;
							scope.circles[index].draw();
							if(mouse.x+1 && mouse.y+1) {
								scope.circles[index].x = mouse.x;
								scope.circles[index].y = mouse.y;
								c1.draw();
							}
							if(i > 0) {
								c2.x += (c1.x - c2.x) * 0.6;
								c2.y += (c1.y - c2.y) * 0.6;
							}
						}
					}
                    ctx.font = "14px Arial";
                    ctx.fillStyle = uiThemeService.theme.styles.touchPad.textColor;
                    ctx.fillText("X: " + freqAndLoc.freqX, 10, 20);
                    ctx.fillText("Y: " + freqAndLoc.freqY, 10, 32);

					prom = $timeout(timer, 10);
				};
				timer();
			}
		}
	});