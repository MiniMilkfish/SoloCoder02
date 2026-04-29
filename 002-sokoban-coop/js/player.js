class Player {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color || (id === 1 ? '#4ade80' : '#60a5fa');
        this.steps = 0;
        this.lastDirection = null;
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
        this.steps++;
    }

    canMoveTo(newX, newY, gameState) {
        if (!this.isValidPosition(newX, newY, gameState)) {
            return false;
        }

        if (gameState.map[newY][newX] === 'wall') {
            return false;
        }

        if (gameState.map[newY][newX] === 'random-obstacle') {
            return false;
        }

        const otherPlayer = this.id === 1 ? gameState.player2 : gameState.player1;
        if (otherPlayer && otherPlayer.x === newX && otherPlayer.y === newY) {
            return false;
        }

        const hasBox = gameState.boxes.some(box => box.x === newX && box.y === newY);
        if (hasBox) {
            return false;
        }

        return true;
    }

    isValidPosition(x, y, gameState) {
        return x >= 0 && y >= 0 && 
               y < gameState.map.length && 
               x < gameState.map[y].length;
    }

    canPushBox(box, direction, gameState) {
        if (!this.isAdjacentToBox(box)) {
            return false;
        }

        const pushDirection = this.getPushDirection(box, direction);
        if (!pushDirection) {
            return false;
        }

        const newBoxX = box.x + pushDirection.dx;
        const newBoxY = box.y + pushDirection.dy;

        if (!this.isValidPosition(newBoxX, newBoxY, gameState)) {
            return false;
        }

        if (gameState.map[newBoxY][newBoxX] === 'wall') {
            return false;
        }

        if (gameState.map[newBoxY][newBoxX] === 'random-obstacle') {
            return false;
        }

        const otherBox = gameState.boxes.find(b => 
            b.x === newBoxX && b.y === newBoxY && b !== box
        );
        if (otherBox) {
            return false;
        }

        const player1 = gameState.player1;
        const player2 = gameState.player2;
        
        if ((player1 && player1.x === newBoxX && player1.y === newBoxY) ||
            (player2 && player2.x === newBoxX && player2.y === newBoxY)) {
            return false;
        }

        return true;
    }

    isAdjacentToBox(box) {
        const dx = Math.abs(this.x - box.x);
        const dy = Math.abs(this.y - box.y);
        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
    }

    getPushDirection(box, playerDirection) {
        const toBoxX = box.x - this.x;
        const toBoxY = box.y - this.y;

        if (toBoxX === 1 && playerDirection === 'RIGHT') return CONFIG.DIRECTIONS.RIGHT;
        if (toBoxX === -1 && playerDirection === 'LEFT') return CONFIG.DIRECTIONS.LEFT;
        if (toBoxY === 1 && playerDirection === 'DOWN') return CONFIG.DIRECTIONS.DOWN;
        if (toBoxY === -1 && playerDirection === 'UP') return CONFIG.DIRECTIONS.UP;

        return null;
    }

    getAdjacentBoxes(gameState) {
        const adjacentPositions = [
            { x: this.x + 1, y: this.y },
            { x: this.x - 1, y: this.y },
            { x: this.x, y: this.y + 1 },
            { x: this.x, y: this.y - 1 }
        ];

        return gameState.boxes.filter(box => 
            adjacentPositions.some(pos => pos.x === box.x && pos.y === box.y)
        );
    }

    getBoxInDirection(direction, gameState) {
        const dir = CONFIG.DIRECTIONS[direction];
        if (!dir) return null;

        const checkX = this.x + dir.dx;
        const checkY = this.y + dir.dy;

        return gameState.boxes.find(box => box.x === checkX && box.y === checkY);
    }

    getDirectionToBox(box) {
        const dx = box.x - this.x;
        const dy = box.y - this.y;

        if (dx === 1) return 'RIGHT';
        if (dx === -1) return 'LEFT';
        if (dy === 1) return 'DOWN';
        if (dy === -1) return 'UP';

        return null;
    }

    resetSteps() {
        this.steps = 0;
    }
}