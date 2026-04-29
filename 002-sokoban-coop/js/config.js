const CONFIG = {
    TILE_TYPES: {
        WALL: '#',
        FLOOR: ' ',
        TARGET: '.',
        BOX: '$',
        BOX_ON_TARGET: '*',
        PLAYER1: '1',
        PLAYER1_ON_TARGET: '+1',
        PLAYER2: '2',
        PLAYER2_ON_TARGET: '+2',
        RANDOM_OBSTACLE: 'X'
    },

    DIRECTIONS: {
        UP: { dx: 0, dy: -1 },
        DOWN: { dx: 0, dy: 1 },
        LEFT: { dx: -1, dy: 0 },
        RIGHT: { dx: 1, dy: 0 }
    },

    PLAYER_CONTROLS: {
        player1: {
            moveUp: 'KeyW',
            moveDown: 'KeyS',
            moveLeft: 'KeyA',
            moveRight: 'KeyD',
            push: 'KeyQ'
        },
        player2: {
            moveUp: 'KeyI',
            moveDown: 'KeyK',
            moveLeft: 'KeyJ',
            moveRight: 'KeyL',
            push: 'KeyU'
        }
    },

    GAME_SETTINGS: {
        defaultTimeLimit: 180,
        timerEnabled: false,
        randomObstacleEnabled: true,
        randomObstacleInterval: 10000,
        animationDuration: 150,
        localStorageKey: 'sokoban_coop_save'
    },

    CLASSES: {
        wall: 'wall',
        floor: 'floor',
        target: 'target',
        box: 'box',
        boxOnTarget: 'box-on-target',
        player1: 'player1',
        player1OnTarget: 'player1-on-target',
        player2: 'player2',
        player2OnTarget: 'player2-on-target',
        randomObstacle: 'random-obstacle',
        moving: 'moving',
        pushing: 'pushing'
    }
};