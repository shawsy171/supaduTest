(function(){
	var dropdown = document.querySelector('.dropdown img');
	var dropdownBox = document.getElementById('dropdown-box');

	var addEvent = function (el, ev, fn, args) {

		if (el.addEventListener) {
			el.addEventListener(ev, function(){fn(args) }, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + ev, fn(el, toggle));
		} else {
			el['on' + ev] = fn(el, toggle);
		};
	};

	// var toggleClass = function (args) {

	// 	var el = args['elToToggle'],
	// 		toggle = args['toggleClass'],
	// 		toggleClasslen = toggle.length,
	// 		classesInEl = el.getAttribute("class") || '',
	// 		startChar = classesInEl.indexOf(toggle);
	// 		
	// 	if( startChar > -1 ) {
	// 		var cutLength = classesInEl.length - toggleClasslen;

	// 		classesInEl = classesInEl.substring(0, cutLength - 1);

	// 		el.setAttribute("class" ,classesInEl);

	// 	} else {
	// 		el.setAttribute("class" ,classesInEl + ' ' + toggle);
	// 	}
	// };

	var toggleClass = function (args) {

		var el = args['elToToggle'],
			classesInEl = el.getAttribute("class") || '',
			toggle = args['toggleClass'];
			startChar = classesInEl.indexOf(toggle),
			toggleClasslen = toggle.length,
			endChar = startChar + toggleClasslen,
			newClassList = '';
			console.log(classesInEl.split(''))
		if( startChar > -1 ) {
			var classArr = classesInEl.split(''),
				classArrLen = classArr.length,
				i = 0;
			while(classArrLen--){
				if(i >= startChar-1 && i <= endChar-1 ) {
					
				} else {
					newClassList += classArr[i];
				}

				i++;
			}

			el.setAttribute("class" ,newClassList);

		} else {
			el.setAttribute("class" ,classesInEl + ' ' + toggle);
		}
	};
	/*toggleClass can have multipule classes*/
	var options = {
		'elToToggle': dropdownBox, 
	 	'toggleClass': 'open'
	}

	addEvent(dropdown, 'click', toggleClass, options );
})();