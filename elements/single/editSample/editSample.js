angular.module('editSampleElement', [])

	.directive('editSample', function(uiThemeService) {
		return {
			restrict:'C',
			scope: {
				sample: "=sample",
				sampleIndex: "=sampleIndex",
                selectedKit: "=selectedKit"
			},
			templateUrl:'elements/single/editSample/editSample.html',
			replace: true,
			link: function(scope,element) {

				var movingMarker = false;
				var cnvs = element[0].children[0];
				var ctx = cnvs.getContext("2d");
				var cnvsW = parseInt(window.getComputedStyle(cnvs.parentNode,null).width.replace(/\D/g, '' ));
				var cnvsH = parseInt(window.getComputedStyle(cnvs.parentNode,null).height.replace(/\D/g, '' ));
				var mid = cnvsH / 2;
				var padding = 2;

				angular.element(cnvs).attr({
					width:  cnvsW + "px",
					height: cnvsH  + "px"
				});

				scope.$on('samplePosUpdate',function(evernt,args){
					if (args == scope.sampleIndex) {
						scope.drawCovers();
					}
				});

                scope.$on('themeChangeEvent',function() {
                    scope.drawCovers();
                });

				scope.drawCovers = function() {
					ctx.fillStyle = uiThemeService.theme.styles.editSample.backgroundColor;
					ctx.rect(0,0,cnvsW,cnvsH);
					ctx.fill();
					ctx.fillStyle = uiThemeService.theme.styles.editSample.lineColor;
					var data = scope.sample.buffer.getChannelData(0);
					var step = Math.ceil( data.length / cnvsW );


					for(var i = 0; i < (cnvsW-padding); i++){
						var min = 1.0;
						var max = -1.0;
						for (var j = 0; j < step; j++) {
							var datum = data[(i*step)+j];
							if (datum < min) {min = datum;}
							if (datum > max) {max = datum;}
						}
						ctx.fillRect(
							i,
							( 1 + min) * mid,
							1,
							Math.max(1,(max-min)*mid)
						);
					}

					var l = scope.sample.kits[scope.selectedKit].startPos/scope.sample.buffer.duration * (cnvsW-padding);
					var r = scope.sample.kits[scope.selectedKit].endPos/scope.sample.buffer.duration * (cnvsW-padding);
					ctx.lineWidth = 2;

					ctx.beginPath();
					ctx.fillStyle = hexToRGBA(uiThemeService.theme.styles.editSample.backgroundColor,0.7);
					ctx.rect(0,0,l,cnvsH);
					ctx.fill();

					ctx.beginPath();
					ctx.fillStyle = uiThemeService.theme.styles.editSample.markers;
					ctx.rect(l,0,2,cnvsH);
					ctx.fill();

					ctx.beginPath();
					ctx.fillStyle = hexToRGBA(uiThemeService.theme.styles.editSample.backgroundColor,0.7);
					ctx.rect(r,0,cnvsW-r,cnvsH);
					ctx.fill();

					ctx.beginPath();
					ctx.fillStyle = uiThemeService.theme.styles.editSample.markers;
					ctx.rect(r,0,2,cnvsH);
					ctx.fill();
				};

				var startingPos = -1;
				scope.startMoving = function(e) {
					movingMarker = true;
					startingPos = (e.clientX - element[0].getBoundingClientRect().left)/(cnvsW-padding) * scope.sample.buffer.duration;
					scope.sample.kits[scope.selectedKit].startPos = startingPos;
					scope.sample.kits[scope.selectedKit].endPos = startingPos;
					toggleCursorMask(movingMarker);
					scope.drawCovers();
				};

				scope.$on('mouseUpEvent', function() {
					if (movingMarker) {
						movingMarker = false;
						startingPos = -1;
					}
					toggleCursorMask(movingMarker);
				});

				scope.$on('mouseMoveEvent',   function(e,args)   {
					if (movingMarker) {
						if (e) {e.preventDefault();}
						var newPos = (args.clientX - element[0].getBoundingClientRect().left) / (cnvsW-padding) * scope.sample.buffer.duration;
						if (newPos > startingPos) {
							scope.sample.kits[scope.selectedKit].startPos = startingPos;
							newPos > scope.sample.buffer.duration ?
								scope.sample.kits[scope.selectedKit].endPos = scope.sample.buffer.duration :
								scope.sample.kits[scope.selectedKit].endPos = newPos;
						}
						if (newPos < startingPos) {
							scope.sample.endPos = startingPos;
							newPos < 0 ?
								scope.sample.kits[scope.selectedKit].startPos = 0 :
								scope.sample.kits[scope.selectedKit].startPos = newPos;
						}
						scope.drawCovers();
					}
				});
				scope.drawCovers();
			}
		}
	});