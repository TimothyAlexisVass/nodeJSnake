process.stdin.setRawMode(true);
process.stdin.on('data', key => {
	if (key == '\u001B\u005B\u0041') {
		if(direction != 'down') {
			direction = 'up';
		}
	}
	if (key == '\u001B\u005B\u0043') {
		if(direction != 'left') {
			direction = 'right'; 
		}
	}
	if (key == '\u001B\u005B\u0042') {
		if(direction != 'up') {
			direction = 'down';
		}
	}
	if (key == '\u001B\u005B\u0044') {
		if(direction != 'right') {
			direction = 'left';
		}
	}
	// Return key or Ctrl+C
	if (key == '\u000D' || key == '\u0003') {
		console.clear();
		process.exit();
	}
});

let	score = 0,
	width = 39,
	height = 21,
	direction = 'right',
	headY = Math.ceil(height / 2 - 1),
	headX = Math.ceil(width / 2 - 1),
	bodyY = [headY],
	bodyX = [headX],
	rewardY,
	rewardX;

const EMPTY = [];
// Initialize EMPTY board
for(let y = 0; y < height; y++) {
	EMPTY.push([]);
	for(let x = 0; x < width; x++) {
		EMPTY[y].push(' ');
	}
}

let board = JSON.parse(JSON.stringify(EMPTY));

const addReward = () => {
	do {
		rewardY = Math.floor(Math.random() * (height));
		rewardX = Math.floor(Math.random() * (width));
	} while (board[rewardY][rewardX] !== ' ');
}
addReward();

const updateBoard = () => {
	if(direction === 'right') {
		headX += 1;
		if(headX == width) {
			headX = 0;
		}
	}
	if(direction === 'left') {
		headX -= 1;
		if(headX < 0) {
			headX = width - 1;
		}
	}
	if(direction === 'up') {
		headY += 1;
		if(headY == height) {
			headY = 0;
		}
	}
	if(direction === 'down') {
		headY -= 1;
		if(headY < 0) {
			headY = height - 1;
		}
	}

	bodyX.unshift(headX);
	bodyY.unshift(headY);

	if (headX === rewardX && headY === rewardY) {
		score += 1;
		addReward();
	}
	else if (board[headY][headX] === '▒') {
		clearInterval(gameOn);
		console.clear();
		console.log('Score: ' + score)
		return;
	}
	else {
		bodyX.pop();
		bodyY.pop();
	}

	board = JSON.parse(JSON.stringify(EMPTY));
	board[rewardY][rewardX] = '•';
	
	for(let i in bodyX) {
		board[bodyY[i]][bodyX[i]] = '▒';
	}

	console.clear();
	console.log(' ' + '█'.repeat(width));
	for(let y = height - 1; y >= 0; y--) {
		console.log('█' + board[y].join('') + '█')
	}
	console.log(' ' + '█'.repeat(width));
	console.log(' '.repeat(Math.ceil(width/2-3 - score.toString().length)) + 'Score: ' + score);
}

const gameOn = setInterval(function () {updateBoard()}, 100);