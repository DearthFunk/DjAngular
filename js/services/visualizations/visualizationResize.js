angular.module('visualizationModule')

	.service('visualizationResizeService', function ($rootScope,$window) {
		var theCanvas = document.getElementById('bckgrndVisualizer');
		var canvasResizeScope = this;

        function updateValues() {

            theCanvas.style.width = $window.innerWidth +'px';
            theCanvas.style.height = $window.innerHeight + 'px';
            canvasResizeScope.canvasInfo = {

                chunkWidth : ($window.innerWidth / (audioBufferSize/2) ),
                chunkSpacer: ($window.innerWidth / (audioBufferSize/2) ) * 0.2,

                canvasHeight:               $window.innerHeight,
                canvasHeightHalf:           $window.innerHeight/2,
                canvasHeightOneQuarter:     $window.innerHeight/4,
                canvasHeightThreeQuarters:  $window.innerHeight*(3/4),

                canvasWidth:                $window.innerWidth,
                canvasWidthHalf:            $window.innerWidth/2,
                canvasWidthOneQuarter:      $window.innerWidth/4,
                canvasWidthThreeQuarters:   $window.innerWidth*(3/4)
            };
            angular.element(theCanvas).attr({
                width:  $window.innerWidth,
                height: $window.innerHeight
            });
        }
        updateValues();

		$window.onresize = function () {updateValues();};
	});
