(function (document) {
	const MATRIX_WIDTH = 20;
	const MATRIX_HEIGHT = 20;
	const CL_BLANK = 0;
	const CL_FULL = 1;
	const CL_APPLE = 2;
	var board = (function () {
		var matrix = [],
		table = document.createElement("table"),
		tr, td, i, ii;
		table.classList.add("snake");
		document.getElementById('game').appendChild(table);
		for (i = 0; i < MATRIX_HEIGHT; i++) {
			tr = document.createElement("tr");
			table.appendChild(tr);
			for (ii = 0; ii < MATRIX_WIDTH; ii++) {
				td = document.createElement("td");
				td.className = "blank";
				matrix.push(td);
				tr.appendChild(td); 
			}
		}
		return {
			git: function (row, col) {
				return (row < 0 || col < 0 || row >= MATRIX_HEIGHT || col >= MATRIX_WIDTH)?
					"full": matrix[row * MATRIX_WIDTH + col].className;
			},
			sit: function (row, col, value) {
				matrix[row * MATRIX_WIDTH + col].className = value;
			}
		}
	}()),
	rpos ,
	cpos ,
	rtail,
	ctail,
	interval,
	toAdd = 1,
	direction = "up";

	
	function newApple() {
		var row, col;
		do {
			row = Math.floor(Math.random()*MATRIX_HEIGHT);
			col = Math.floor(Math.random()*MATRIX_WIDTH);
		} while(board.git(row, col) !== "blank");
		board.sit(row, col, "apple");
	}
	newApple();
	window.addEventListener("keydown", function (event) {
		console.log(event.keyCode);
		if (event.keyCode == 87) 
			direction = "up";
		if (event.keyCode == 65)
			direction = "left";
		if (event.keyCode == 83)
			direction = "down";
		if (event.keyCode == 68)
			direction = "right";
		
	}, true);

	function advance() {
		switch (direction) {
			case "up": rpos--; break;
			case "left": cpos--; break;
			case "down": rpos++; break;
			case "right": cpos++; break;
		}
		switch (board.git(rpos, cpos)) {
			case "apple":
				toAdd += 3;
				newApple();
				break;
			case "full":
				alert ("your score is: "+rtail.length);
				window.clearInterval(interval);
				return;
		}
		board.sit(rpos, cpos, "full");
		ctail.push(cpos);
		rtail.push(rpos);
		if (toAdd) {
			toAdd--;
		} else {
			board.sit(rtail.shift(), ctail.shift(), "blank");
		}
		
	}
	document.getElementById("start").addEventListener("click", function () {
		interval = window.setInterval(advance,200);		
		rpos = Math.floor(MATRIX_HEIGHT/2);
		cpos = Math.floor(MATRIX_WIDTH/2);
		rtail=[rpos];
		ctail=[cpos];
		board.sit(rpos, cpos, "full");
		var i,ii;
		for (i = 0; i < MATRIX_HEIGHT; i++) {
			for (ii = 0; ii < MATRIX_HEIGHT; ii++) {
				board.sit(i,ii,"blank");
			}
		}
		newApple();
	}, false);
	
}(document));
