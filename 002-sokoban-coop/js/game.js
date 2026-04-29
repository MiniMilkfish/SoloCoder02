class Game {
    constructor() {
        this.currentLevelId = 1;
        this.currentDifficulty = null;
        this.filteredLevelIds = [];
        this.gameState = null;
        this.isGameOver = false;
        this.isPaused = false;
        
        this.totalSteps = 0;
        this.elapsedTime = 0;
        this.timeLimit = 0;
        
        this.timerInterval = null;
        this.randomObstacleInterval = null;
        this.timerEnabled = CONFIG.GAME_SETTINGS.timerEnabled;
        this.randomObstacleEnabled = CONFIG.GAME_SETTINGS.randomObstacleEnabled;
        
        this.renderer = null;
        this.eventManager = null;
    }

    init() {
        this.renderer = new Renderer(this);
        this.eventManager = new EventManager(this);
        
        this.updateFilteredLevels();
        if (this.filteredLevelIds.length > 0) {
            this.currentLevelId = this.filteredLevelIds[0];
        }
        
        this.loadLevel(this.currentLevelId);
        this.eventManager.bindEvents();
        
        this.renderer.updateUI();
        
        const savedData = Utils.loadFromLocalStorage();
        if (savedData) {
            this.showLoadGameConfirm(savedData);
        }
    }

    updateFilteredLevels() {
        if (this.currentDifficulty === null) {
            this.filteredLevelIds = LEVELS.map(level => level.id);
        } else {
            this.filteredLevelIds = LEVELS
                .filter(level => level.difficulty === this.currentDifficulty)
                .map(level => level.id);
        }
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.updateFilteredLevels();
        
        if (this.filteredLevelIds.length > 0) {
            this.currentLevelId = this.filteredLevelIds[0];
            this.loadLevel(this.currentLevelId);
        }
        
        this.renderer.updateUI();
        this.renderer.updateDifficultyButtons();
    }

    getCurrentLevelIndex() {
        return this.filteredLevelIds.indexOf(this.currentLevelId);
    }

    loadLevel(levelId) {
        this.currentLevelId = levelId;
        const level = LEVEL_UTILS.getLevel(levelId);
        const parsedMap = LEVEL_UTILS.parseMap(level.map);

        this.gameState = {
            map: parsedMap.map,
            targets: parsedMap.targets,
            boxes: parsedMap.boxes.map(box => ({ ...box })),
            player1: new Player(1, parsedMap.player1Pos.x, parsedMap.player1Pos.y),
            player2: new Player(2, parsedMap.player2Pos.x, parsedMap.player2Pos.y),
            width: parsedMap.width,
            height: parsedMap.height
        };

        this.isGameOver = false;
        this.isPaused = false;
        this.totalSteps = 0;
        this.elapsedTime = 0;
        this.timeLimit = level.timeLimit || CONFIG.GAME_SETTINGS.defaultTimeLimit;

        this.stopTimer();
        this.stopRandomObstacles();

        this.startTimer();

        if (this.randomObstacleEnabled) {
            this.startRandomObstacles();
        }

        this.renderer.render();
        this.renderer.updateUI();
        this.hideMessage();
    }

    resetLevel() {
        this.loadLevel(this.currentLevelId);
        this.showMessage('关卡已重置', 'info', 1500);
    }

    restartGame() {
        Utils.clearLocalStorage();
        this.updateFilteredLevels();
        if (this.filteredLevelIds.length > 0) {
            this.currentLevelId = this.filteredLevelIds[0];
            this.loadLevel(this.currentLevelId);
        }
        this.showMessage('游戏已全局重启', 'info', 1500);
    }

    nextLevel() {
        const currentIndex = this.getCurrentLevelIndex();
        if (currentIndex < this.filteredLevelIds.length - 1) {
            this.currentLevelId = this.filteredLevelIds[currentIndex + 1];
            this.loadLevel(this.currentLevelId);
            this.saveProgress();
        } else {
            this.showMessage('恭喜！已完成所有关卡！', 'success', 3000);
        }
    }

    prevLevel() {
        const currentIndex = this.getCurrentLevelIndex();
        if (currentIndex > 0) {
            this.currentLevelId = this.filteredLevelIds[currentIndex - 1];
            this.loadLevel(this.currentLevelId);
            this.saveProgress();
        }
    }

    movePlayer(playerId, direction) {
        if (this.isGameOver || this.isPaused) return false;

        const player = playerId === 1 ? this.gameState.player1 : this.gameState.player2;
        if (!player) return false;

        const dir = CONFIG.DIRECTIONS[direction];
        if (!dir) return false;

        const newX = player.x + dir.dx;
        const newY = player.y + dir.dy;

        if (!player.canMoveTo(newX, newY, this.gameState)) {
            return false;
        }

        player.moveTo(newX, newY);
        player.lastDirection = direction;
        this.totalSteps++;

        this.renderer.render();
        this.renderer.updateUI();
        this.checkWinCondition();

        return true;
    }

    pushBox(playerId, direction) {
        if (this.isGameOver || this.isPaused) return false;

        const player = playerId === 1 ? this.gameState.player1 : this.gameState.player2;
        if (!player) return false;

        const box = player.getBoxInDirection(direction, this.gameState);
        if (!box) return false;

        const pushDirection = player.getPushDirection(box, direction);
        if (!pushDirection) return false;

        if (!player.canPushBox(box, direction, this.gameState)) {
            return false;
        }

        const newBoxX = box.x + pushDirection.dx;
        const newBoxY = box.y + pushDirection.dy;

        box.x = newBoxX;
        box.y = newBoxY;
        player.steps++;
        this.totalSteps++;

        this.renderer.render();
        this.renderer.updateUI();
        this.checkWinCondition();

        return true;
    }

    checkWinCondition() {
        const allBoxesOnTarget = this.gameState.boxes.every(box => 
            this.gameState.targets.some(target => 
                target.x === box.x && target.y === box.y
            )
        );

        if (allBoxesOnTarget && this.gameState.boxes.length > 0) {
            this.handleWin();
        }
    }

    handleWin() {
        this.isGameOver = true;
        this.stopTimer();
        this.stopRandomObstacles();
        
        this.saveProgress();
        
        const currentIndex = this.getCurrentLevelIndex();
        const isLastLevel = currentIndex >= this.filteredLevelIds.length - 1;
        
        this.renderer.showModal(
            '关卡完成！',
            `恭喜完成第 ${this.currentLevelId} 关！\n总步数: ${this.totalSteps}\n用时: ${Utils.formatTime(this.elapsedTime)}`,
            'success',
            () => {
                if (!isLastLevel) {
                    this.nextLevel();
                } else {
                    this.showMessage('恭喜通关所有关卡！', 'success', 5000);
                }
            }
        );
    }

    handleFail() {
        this.isGameOver = true;
        this.stopTimer();
        this.stopRandomObstacles();

        this.renderer.showModal(
            '时间到！',
            '很遗憾，时间用完了。\n点击确定重新开始本关。',
            'fail',
            () => {
                this.resetLevel();
            }
        );
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.elapsedTime++;
            this.renderer.updateUI();

            if (this.timerEnabled && this.elapsedTime >= this.timeLimit) {
                this.handleFail();
            }
        }, 1000);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.stopTimer();
            this.showMessage('游戏已暂停', 'info', 2000);
        } else {
            if (!this.isGameOver) {
                this.startTimer();
            }
            this.hideMessage();
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    toggleTimer() {
        this.timerEnabled = !this.timerEnabled;
        
        if (this.timerEnabled && !this.isGameOver) {
            this.startTimer();
        } else {
            this.stopTimer();
        }

        this.renderer.updateUI();
        this.renderer.updateTimerButton();
    }

    startRandomObstacles() {
        this.stopRandomObstacles();
        
        this.randomObstacleInterval = setInterval(() => {
            this.updateRandomObstacles();
        }, CONFIG.GAME_SETTINGS.randomObstacleInterval);
    }

    stopRandomObstacles() {
        if (this.randomObstacleInterval) {
            clearInterval(this.randomObstacleInterval);
            this.randomObstacleInterval = null;
        }
    }

    toggleRandomObstacles() {
        this.randomObstacleEnabled = !this.randomObstacleEnabled;
        
        if (this.randomObstacleEnabled && !this.isGameOver) {
            this.startRandomObstacles();
        } else {
            this.stopRandomObstacles();
            this.clearRandomObstacles();
        }

        this.renderer.updateRandomObstacleButton();
    }

    updateRandomObstacles() {
        this.clearRandomObstacles();

        const emptyPositions = [];
        for (let y = 0; y < this.gameState.map.length; y++) {
            for (let x = 0; x < this.gameState.map[y].length; x++) {
                if (this.gameState.map[y][x] === 'floor') {
                    const hasBox = this.gameState.boxes.some(b => b.x === x && b.y === y);
                    const hasPlayer1 = this.gameState.player1.x === x && this.gameState.player1.y === y;
                    const hasPlayer2 = this.gameState.player2.x === x && this.gameState.player2.y === y;
                    
                    if (!hasBox && !hasPlayer1 && !hasPlayer2) {
                        emptyPositions.push({ x, y });
                    }
                }
            }
        }

        const numObstacles = Math.min(3, Math.floor(emptyPositions.length / 10));
        const shuffled = Utils.shuffleArray(emptyPositions);
        
        for (let i = 0; i < numObstacles; i++) {
            const pos = shuffled[i];
            if (pos) {
                this.gameState.map[pos.y][pos.x] = 'random-obstacle';
            }
        }

        this.renderer.render();
        this.showMessage('障碍物位置已更新！', 'info', 1500);
    }

    clearRandomObstacles() {
        for (let y = 0; y < this.gameState.map.length; y++) {
            for (let x = 0; x < this.gameState.map[y].length; x++) {
                if (this.gameState.map[y][x] === 'random-obstacle') {
                    this.gameState.map[y][x] = 'floor';
                }
            }
        }
    }

    saveProgress() {
        const saveData = {
            currentLevelId: this.currentLevelId,
            currentDifficulty: this.currentDifficulty,
            totalSteps: this.totalSteps,
            elapsedTime: this.elapsedTime,
            timestamp: Date.now()
        };
        Utils.saveToLocalStorage(saveData);
    }

    loadProgress(savedData) {
        if (savedData && savedData.currentLevelId) {
            if (savedData.currentDifficulty !== undefined) {
                this.currentDifficulty = savedData.currentDifficulty;
                this.updateFilteredLevels();
            }
            this.currentLevelId = savedData.currentLevelId;
            this.loadLevel(this.currentLevelId);
            this.showMessage('已加载存档', 'info', 1500);
        }
    }

    showLoadGameConfirm(savedData) {
        const timeAgo = Math.floor((Date.now() - savedData.timestamp) / 1000);
        let timeAgoText = '';
        
        if (timeAgo < 60) {
            timeAgoText = `${timeAgo} 秒前`;
        } else if (timeAgo < 3600) {
            timeAgoText = `${Math.floor(timeAgo / 60)} 分钟前`;
        } else {
            timeAgoText = `${Math.floor(timeAgo / 3600)} 小时前`;
        }

        this.renderer.showModal(
            '发现存档',
            `检测到之前的游戏进度：\n关卡: ${savedData.currentLevelId}\n总步数: ${savedData.totalSteps}\n保存时间: ${timeAgoText}\n\n是否继续上次的游戏？`,
            'info',
            () => {
                this.loadProgress(savedData);
            },
            () => {
                Utils.clearLocalStorage();
            }
        );
    }

    showMessage(text, type, duration) {
        this.renderer.showMessage(text, type, duration);
    }

    hideMessage() {
        this.renderer.hideMessage();
    }
}

class Renderer {
    constructor(game) {
        this.game = game;
        this.boardElement = document.getElementById('game-board');
        this.messageElement = document.getElementById('game-message');
        this.modalElement = document.getElementById('game-modal');
    }

    render() {
        if (!this.game.gameState) return;

        const { map, targets, boxes, player1, player2, width, height } = this.game.gameState;

        this.boardElement.style.gridTemplateColumns = `repeat(${width}, 40px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${height}, 40px)`;
        this.boardElement.innerHTML = '';

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.x = x;
                tile.dataset.y = y;

                let tileType = map[y][x];
                const isTarget = targets.some(t => t.x === x && t.y === y);
                const box = boxes.find(b => b.x === x && b.y === y);
                const isPlayer1 = player1 && player1.x === x && player1.y === y;
                const isPlayer2 = player2 && player2.x === x && player2.y === y;

                if (box) {
                    if (isTarget) {
                        tile.classList.add(CONFIG.CLASSES.boxOnTarget);
                    } else {
                        tile.classList.add(CONFIG.CLASSES.box);
                    }
                } else if (isPlayer1) {
                    if (isTarget) {
                        tile.classList.add(CONFIG.CLASSES.player1OnTarget);
                    } else {
                        tile.classList.add(CONFIG.CLASSES.player1);
                    }
                } else if (isPlayer2) {
                    if (isTarget) {
                        tile.classList.add(CONFIG.CLASSES.player2OnTarget);
                    } else {
                        tile.classList.add(CONFIG.CLASSES.player2);
                    }
                } else if (isTarget) {
                    tile.classList.add(CONFIG.CLASSES.target);
                } else if (tileType === 'wall') {
                    tile.classList.add(CONFIG.CLASSES.wall);
                } else if (tileType === 'random-obstacle') {
                    tile.classList.add(CONFIG.CLASSES.randomObstacle);
                } else if (tileType === 'outside') {
                    tile.classList.add('outside');
                } else {
                    tile.classList.add(CONFIG.CLASSES.floor);
                }

                this.boardElement.appendChild(tile);
            }
        }
    }

    updateUI() {
        const { player1, player2 } = this.game.gameState;
        
        const currentIndex = this.game.getCurrentLevelIndex();
        document.getElementById('current-level').textContent = currentIndex + 1;
        document.getElementById('total-levels').textContent = this.game.filteredLevelIds.length;
        
        const difficultyDisplay = document.getElementById('current-difficulty');
        if (this.game.currentDifficulty === null) {
            difficultyDisplay.textContent = '全部';
        } else {
            difficultyDisplay.textContent = LEVEL_UTILS.getDifficultyName(this.game.currentDifficulty);
        }
        
        document.getElementById('step-count').textContent = this.game.totalSteps;
        document.getElementById('time-display').textContent = Utils.formatTime(this.game.elapsedTime);
        
        if (player1) {
            document.getElementById('player1-steps').textContent = player1.steps;
        }
        if (player2) {
            document.getElementById('player2-steps').textContent = player2.steps;
        }

        const timerInfo = document.getElementById('timer-info');
        const timeLimit = document.getElementById('time-limit');
        
        if (this.game.timerEnabled) {
            timerInfo.style.display = 'flex';
            const remaining = Math.max(0, this.game.timeLimit - this.game.elapsedTime);
            timeLimit.textContent = Utils.formatTime(remaining);
            
            if (remaining <= 10) {
                timeLimit.style.color = '#f87171';
            } else if (remaining <= 30) {
                timeLimit.style.color = '#fbbf24';
            } else {
                timeLimit.style.color = '#4ade80';
            }
        } else {
            timerInfo.style.display = 'none';
        }
    }

    updateTimerButton() {
        const btn = document.getElementById('btn-timer-toggle');
        if (this.game.timerEnabled) {
            btn.textContent = '关闭限时模式';
        } else {
            btn.textContent = '开启限时模式';
        }
    }

    updateRandomObstacleButton() {
        const btn = document.getElementById('btn-random-toggle');
        if (this.game.randomObstacleEnabled) {
            btn.textContent = '关闭随机障碍';
        } else {
            btn.textContent = '开启随机障碍';
        }
    }

    updateDifficultyButtons() {
        const buttons = {
            all: document.getElementById('btn-diff-all'),
            easy: document.getElementById('btn-diff-easy'),
            medium: document.getElementById('btn-diff-medium'),
            hard: document.getElementById('btn-diff-hard')
        };

        Object.values(buttons).forEach(btn => {
            if (btn) btn.classList.remove('btn-diff-active');
        });

        if (this.game.currentDifficulty === null && buttons.all) {
            buttons.all.classList.add('btn-diff-active');
        } else if (this.game.currentDifficulty === DIFFICULTY.EASY && buttons.easy) {
            buttons.easy.classList.add('btn-diff-active');
        } else if (this.game.currentDifficulty === DIFFICULTY.MEDIUM && buttons.medium) {
            buttons.medium.classList.add('btn-diff-active');
        } else if (this.game.currentDifficulty === DIFFICULTY.HARD && buttons.hard) {
            buttons.hard.classList.add('btn-diff-active');
        }
    }

    showMessage(text, type, duration = 2000) {
        this.messageElement.textContent = text;
        this.messageElement.className = `game-message ${type}`;
        this.messageElement.style.display = 'block';

        if (duration > 0) {
            setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }

    hideMessage() {
        this.messageElement.style.display = 'none';
    }

    showModal(title, message, type, onOk, onCancel) {
        const modal = this.modalElement;
        const modalContent = modal.querySelector('.modal-content');
        const titleEl = document.getElementById('modal-title');
        const messageEl = document.getElementById('modal-message');
        const btnOk = document.getElementById('modal-btn-ok');
        const btnCancel = document.getElementById('modal-btn-cancel');

        titleEl.textContent = title;
        messageEl.textContent = message;
        
        modalContent.className = `modal-content ${type}`;
        
        btnCancel.style.display = onCancel ? 'inline-block' : 'none';

        const handleOk = () => {
            modal.classList.remove('show');
            btnOk.removeEventListener('click', handleOk);
            btnCancel.removeEventListener('click', handleCancel);
            if (onOk) onOk();
        };

        const handleCancel = () => {
            modal.classList.remove('show');
            btnOk.removeEventListener('click', handleOk);
            btnCancel.removeEventListener('click', handleCancel);
            if (onCancel) onCancel();
        };

        btnOk.addEventListener('click', handleOk);
        btnCancel.addEventListener('click', handleCancel);

        modal.classList.add('show');
    }

    hideModal() {
        this.modalElement.classList.remove('show');
    }
}

class EventManager {
    constructor(game) {
        this.game = game;
        this.pressedKeys = new Set();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        document.getElementById('btn-reset').addEventListener('click', () => {
            this.game.resetLevel();
        });

        document.getElementById('btn-restart').addEventListener('click', () => {
            this.game.restartGame();
        });

        document.getElementById('btn-prev').addEventListener('click', () => {
            this.game.prevLevel();
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            this.game.nextLevel();
        });

        document.getElementById('btn-timer-toggle').addEventListener('click', () => {
            this.game.toggleTimer();
        });

        document.getElementById('btn-random-toggle').addEventListener('click', () => {
            this.game.toggleRandomObstacles();
        });

        document.getElementById('btn-diff-all').addEventListener('click', () => {
            this.game.setDifficulty(null);
        });

        document.getElementById('btn-diff-easy').addEventListener('click', () => {
            this.game.setDifficulty(DIFFICULTY.EASY);
        });

        document.getElementById('btn-diff-medium').addEventListener('click', () => {
            this.game.setDifficulty(DIFFICULTY.MEDIUM);
        });

        document.getElementById('btn-diff-hard').addEventListener('click', () => {
            this.game.setDifficulty(DIFFICULTY.HARD);
        });
    }

    handleKeyDown(e) {
        if (this.pressedKeys.has(e.code)) return;
        this.pressedKeys.add(e.code);

        const isPlayer1Move = Utils.getDirectionFromKey(e.code, 'player1');
        const isPlayer2Move = Utils.getDirectionFromKey(e.code, 'player2');
        const isPlayer1Push = Utils.isPushKey(e.code, 'player1');
        const isPlayer2Push = Utils.isPushKey(e.code, 'player2');

        if (isPlayer1Move) {
            e.preventDefault();
            const lastDirection = this.game.gameState.player1.lastDirection;
            
            if (isPlayer1Push || (lastDirection && lastDirection !== isPlayer1Move)) {
                const box = this.game.gameState.player1.getBoxInDirection(isPlayer1Move, this.game.gameState);
                if (box) {
                    this.game.pushBox(1, isPlayer1Move);
                } else {
                    this.game.movePlayer(1, isPlayer1Move);
                }
            } else {
                this.game.movePlayer(1, isPlayer1Move);
            }
        } else if (isPlayer2Move) {
            e.preventDefault();
            const lastDirection = this.game.gameState.player2.lastDirection;
            
            if (isPlayer2Push || (lastDirection && lastDirection !== isPlayer2Move)) {
                const box = this.game.gameState.player2.getBoxInDirection(isPlayer2Move, this.game.gameState);
                if (box) {
                    this.game.pushBox(2, isPlayer2Move);
                } else {
                    this.game.movePlayer(2, isPlayer2Move);
                }
            } else {
                this.game.movePlayer(2, isPlayer2Move);
            }
        } else if (isPlayer1Push) {
            e.preventDefault();
            const player = this.game.gameState.player1;
            if (player.lastDirection) {
                const box = player.getBoxInDirection(player.lastDirection, this.game.gameState);
                if (box) {
                    this.game.pushBox(1, player.lastDirection);
                }
            }
        } else if (isPlayer2Push) {
            e.preventDefault();
            const player = this.game.gameState.player2;
            if (player.lastDirection) {
                const box = player.getBoxInDirection(player.lastDirection, this.game.gameState);
                if (box) {
                    this.game.pushBox(2, player.lastDirection);
                }
            }
        }

        if (e.code === 'Space') {
            e.preventDefault();
            this.game.togglePause();
        }

        if (e.code === 'KeyR') {
            e.preventDefault();
            this.game.resetLevel();
        }
    }

    handleKeyUp(e) {
        this.pressedKeys.delete(e.code);
    }
}