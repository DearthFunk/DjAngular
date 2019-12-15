angular.module('alertDialogModule', [])

    .directive('alertDialog', function () {
        return {
            restrict:'C',
            templateUrl:'modules/alertDialog/alertDialog.html',
            replace: true,
            link: function(scope,element)	{

                scope.title = '';
                scope.closeAble = false;
                scope.buttons = [];
                scope.message = '';
	            scope.height = 0;


                scope.closeDialog = function() {
                    scope.displayValue = 'none';
                };
                scope.closeDialog();
	            function getRectangle(obj) {

		            var r = { top: 0, left: 0, width: 0, height: 0 };

		            if(!obj)
			            return r;

		            else if(typeof obj == "string")
			            obj = document.getElementById(obj);


		            if(typeof obj != "object")
			            return r;

		            if(typeof obj.offsetTop != "undefined") {

			            r.height = parseInt(obj.offsetHeight);
			            r.width  = parseInt(obj.offsetWidth);
			            r.left = r.top = 0;

			            while(obj && obj.tagName != "BODY") {

				            r.top  += parseInt(obj.offsetTop);
				            r.left += parseInt(obj.offsetLeft);

				            obj = obj.offsetParent;
			            }
		            }
		            return r;
	            }

                scope.$on('alertDialog',function(event,data){
                    scope.displayValue = 'block';
                    scope.title = data.title;
                    scope.closeable = data.closeable;
                    scope.message = data.message;
                    scope.buttons = data.buttons;
	                var inner = element[0].children[0].children[1];
	               /*
	                console.log($(inner).height());
	                console.log(inner.style.offsetHeight);
	                console.log(inner.style.scrollHeight);

	                var actual_h = inner.offsetHeight;

	                if(parseInt(inner.style.paddingTop.replace('px','')) > 0){
		                actual_h=actual_h -  parseInt(inner.style.paddingTop.replace('px',''));

	                }
	                if(parseInt(inner.style.paddingBottom.replace('px','')) > 0){
		                actual_h=actual_h -  parseInt(inner.style.paddingBottom.replace('px',''));

	                }
	                console.log(actual_h);
	                console.log(getRectangle(inner));
	                console.log(inner);
	                console.log(window.getComputedStyle(inner).height);
	                console.log(window.getComputedStyle(inner).getPropertyValue("height"));
	                console.log(angular.element(inner));
	               // scope.height = data.height;
*/
                });


                scope.$on('alertDialogClose',function(){
                    scope.closeDialog();
                });
            }
        }
    });