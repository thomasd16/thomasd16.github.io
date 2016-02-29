(function () {
	//Magic numbers
	var spacing = 7;
	var startY = 0;
	var clothWidth = 50;
	var clothHeight = 30;
	var gravity = 0x40;
	
	
	var points = [];
	var mouse = {
		px: 0,
		py: 0,
		x: 0,
		y: 0,
		down: 0,
		out:true,
		button: 0
	};
	var canvas = document.getElementById('c');
	var ctx = canvas.getContext('2d');
	var frame = (window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
		});
	function point(x,y) {
		x <<= 8;
		y <<= 8;
		points.push({ 
			x:x,
			y:y,
			px:x,
			py:y
		});
	}
	function init() {
		canvas.width = 560;
		canvas.height = 280;
		canvas.addEventListener("mouseout", function (e) {
			mouse.out =  true;
			mouse.down = false;
			e.preventDefault()
		});
		canvas.addEventListener("mousedown", function (e) {
			mouse.button = e.which;
			mouse.down = true;
			e.preventDefault();
		},false);
		canvas.addEventListener("mouseup", function (e) {
			mouse.down = false;
			e.preventDefault();
		},false);
		canvas.addEventListener("mousemove", function (e) {
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
			if (mouse.out) {
				mouse.px = mouse.x;
				mouse.py = mouse.y;
				mouse.out = false;
			}
			e.preventDefault();
		}, false);
		createPoints();
		update();
	}
	
	function createPoints() {
		var startX = (canvas.width - clothWidth*spacing)/2;
		for (var y = 0; y < clothHeight; y ++ ) {
			for (var x = 0;x < clothWidth; x++) {
				point(startX+x*spacing, startY+y*spacing);
			}
		}
	}
	
	function draw() {
			
		ctx.strokeStyle = '#888';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		var friend;
		var point;
		for (var i = 0; i < points.length; i++) {
			point = points[i];
			if (i >= clothWidth) {
				friend = points[i-clothWidth];
				ctx.moveTo(point.x>>8, point.y>>8);
				ctx.lineTo(friend.x>>8, friend.y>>8);
			}
			if (i % clothWidth !== 0) {
				friend = points[i-1];
				ctx.moveTo(point.x>>8, point.y>>8);
				ctx.lineTo(friend.x>>8, friend.y>>8);
			}
		}
		ctx.stroke();
	}
	function resolvepoints(p1n, p2n) {
		var p1 = points[p1n];
		var p2 = points[p2n];
		var deltaX = p1.x - p2.x;
		var deltaY = p1.y - p2.y;
		var dist = Math.sqrt(deltaX*deltaX+deltaY*deltaY)|0;
		if (dist < (spacing<<8)) return;
		//kinda forgot how this works
		var div = (((dist<<1)/((spacing<<8)-dist))|0);
		deltaX = (deltaX/div)|0;
		deltaY = (deltaY/div)|0;
		p1.x += deltaX;
		p1.y += deltaY;
		if (p2n > clothWidth) {
			p2.x -= deltaX;
			p2.y -= deltaY;
		}
		
	}
	function resolve() {
		for (var i = clothWidth; i<points.length; i++) {
			if (i%clothWidth !== 0) 
				resolvepoints(i, i-1);
			resolvepoints(i, i-clothWidth);
		}
	}
	function um() {
		if (mouse.down) {
			console.log("mouse");
			for (var i = clothWidth; i < points.length; i++) {
				point = points[i];
				var deltaX = point.x - (mouse.x << 8);
				var deltaY = point.y - (mouse.y << 8);
				if (Math.sqrt(deltaY * deltaY + deltaX * deltaX) < (20<<8)) {
					point.px = point.x - ((mouse.x << 8) - (mouse.px << 8)) ;
					point.py = point.y - ((mouse.y << 8) - (mouse.py << 8)) ;
				}
			}
		}
	}
	
	function momentum() {
		var point;
		var deltaX;
		var deltaY;
		var newX;
		var newY;
		for (var i = clothWidth; i < points.length; i++) {
			point = points[i];
			deltaX = point.x - point.px;
			deltaY = point.y - point.py;
			
			deltaX -= (deltaX >> 6);
			deltaY -= (deltaY >> 6) - gravity;
			
			deltaX = Math.abs(deltaX) > 0x4F ? deltaX :0;
			
			newX = point.x + deltaX;
			newY = point.y + deltaY;
			
			point.px = point.x;
			point.py = point.y;
			
			point.x = newX;
			point.y = newY;
		}
	}
	function update() {
		momentum();
		resolve();
		resolve();
		resolve();
		um();
		draw();
		mouse.px = mouse.x;
		mouse.py = mouse.y;
		frame(update);
	}
	
	init();
}(window));
