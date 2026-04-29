const LEVELS = [
    {
        id: 1,
        name: '协作入门',
        description: '学习基本移动和推箱子',
        timeLimit: 120,
        map: [
            '############',
            '#          #',
            '#  1    2  #',
            '#          #',
            '#   $  $   #',
            '#          #',
            '#   .  .   #',
            '#          #',
            '############'
        ]
    },
    {
        id: 2,
        name: '错位走位',
        description: '配合走位，避免互相阻挡',
        timeLimit: 150,
        map: [
            '################',
            '#              #',
            '#  $  $  $    #',
            '#              #',
            '#  1        2 #',
            '#              #',
            '#  .  .  .    #',
            '#              #',
            '################'
        ]
    },
    {
        id: 3,
        name: '多箱协作',
        description: '需要配合推动多个箱子',
        timeLimit: 180,
        map: [
            '##################',
            '#                #',
            '#  $  $  $  $   #',
            '#                #',
            '#  1  ####  2    #',
            '#     #  #       #',
            '#  .  .  .  .    #',
            '#                #',
            '##################'
        ]
    },
    {
        id: 4,
        name: '迷宫挑战',
        description: '复杂迷宫，需要规划路线',
        timeLimit: 240,
        map: [
            '##########################',
            '#                        #',
            '#  $  $  $              #',
            '#                        #',
            '#  1  ############  2  #',
            '#     #              #   #',
            '#  .  #  .  .       #  #',
            '#     #              #   #',
            '#  ####         ####   #',
            '#                        #',
            '#  $  $                #',
            '#  .  .                #',
            '#                        #',
            '##########################'
        ]
    },
    {
        id: 5,
        name: '终极协作',
        description: '需要高度配合才能通关',
        timeLimit: 300,
        map: [
            '##################################',
            '#                                #',
            '#  $  $  $  $  $  $  $        #',
            '#                                #',
            '#  1  ########################  2 #',
            '#     #                      #    #',
            '#  .  #  .  .  .  .  .  .   #  #',
            '#     #                      #    #',
            '#  #  ######################  #  #',
            '#  #                      #  #  #',
            '#  #  $  $  $  $  $       #  #',
            '#  #  .  .  .  .  .       #  #',
            '#  #                      #  #  #',
            '#  ########################  #  #',
            '#                                #',
            '##################################'
        ]
    }
];

const LEVEL_UTILS = {
    getLevel: function(levelId) {
        return LEVELS.find(level => level.id === levelId) || LEVELS[0];
    },

    getLevelCount: function() {
        return LEVELS.length;
    },

    parseMap: function(mapData) {
        const map = [];
        const targets = [];
        const boxes = [];
        let player1Pos = null;
        let player2Pos = null;

        for (let y = 0; y < mapData.length; y++) {
            const row = [];
            for (let x = 0; x < mapData[y].length; x++) {
                const char = mapData[y][x];
                let tile = 'floor';

                switch (char) {
                    case '#':
                        tile = 'wall';
                        break;
                    case '.':
                        tile = 'target';
                        targets.push({ x, y });
                        break;
                    case '$':
                        tile = 'floor';
                        boxes.push({ x, y });
                        break;
                    case '*':
                        tile = 'target';
                        targets.push({ x, y });
                        boxes.push({ x, y });
                        break;
                    case '1':
                        tile = 'floor';
                        player1Pos = { x, y };
                        break;
                    case '2':
                        tile = 'floor';
                        player2Pos = { x, y };
                        break;
                    case '+1':
                        tile = 'target';
                        targets.push({ x, y });
                        player1Pos = { x, y };
                        break;
                    case '+2':
                        tile = 'target';
                        targets.push({ x, y });
                        player2Pos = { x, y };
                        break;
                    case 'X':
                        tile = 'random-obstacle';
                        break;
                    case ' ':
                        tile = 'floor';
                        break;
                    default:
                        tile = 'floor';
                        break;
                }

                row.push(tile);
            }
            map.push(row);
        }

        console.log(`关卡解析: 箱子数=${boxes.length}, 目标点数=${targets.length}`);

        return {
            map,
            targets,
            boxes,
            player1Pos,
            player2Pos,
            width: map[0] ? map[0].length : 0,
            height: map.length
        };
    }
};