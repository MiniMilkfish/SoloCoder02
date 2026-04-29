const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard'
};

const LEVELS = [
    {
        id: 1,
        name: '协作入门',
        description: '学习基本移动和推箱子',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 120,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#   $      $   #',
            '#              #',
            '#   .      .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 2,
        name: '简单协作',
        description: '两个箱子，两个目标',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 120,
        map: [
            '################',
            '#              #',
            '#  1  $    $   #',
            '#              #',
            '#  2  .    .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 3,
        name: '并排推箱',
        description: '并排的箱子需要配合',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 150,
        map: [
            '####################',
            '#                  #',
            '#  1  $  $  $     #',
            '#                  #',
            '#  2  .  .  .     #',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 4,
        name: '入门迷宫',
        description: '简单的迷宫布局',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 150,
        map: [
            '################',
            '#              #',
            '#  1  ###  2   #',
            '#     #        #',
            '#  $  #  $     #',
            '#     #        #',
            '#  .  #  .     #',
            '#              #',
            '################'
        ]
    },
    {
        id: 5,
        name: '分区域',
        description: '玩家在不同区域',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 180,
        map: [
            '####################',
            '#                  #',
            '#  1  #######  2   #',
            '#     #     #      #',
            '#  $  #  $  #  $   #',
            '#     #     #      #',
            '#  .  #  .  #  .   #',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 6,
        name: '四周箱子',
        description: '箱子分布在四周',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 180,
        map: [
            '################',
            '#  $      $    #',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  .      .    #',
            '#              #',
            '#  $      $    #',
            '#              #',
            '#  .      .    #',
            '################'
        ]
    },
    {
        id: 7,
        name: '一列箱子',
        description: '纵向排列的箱子',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 180,
        map: [
            '################',
            '#              #',
            '#  1   $   2   #',
            '#      $       #',
            '#      $       #',
            '#              #',
            '#      .       #',
            '#      .       #',
            '#      .       #',
            '#              #',
            '################'
        ]
    },
    {
        id: 8,
        name: '角落挑战',
        description: '箱子在角落',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 180,
        map: [
            '################',
            '#  $           #',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  .           #',
            '#           $  #',
            '#              #',
            '#           .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 9,
        name: '中心箱子',
        description: '箱子在中心区域',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 180,
        map: [
            '################',
            '#              #',
            '#  1  $  $  2  #',
            '#              #',
            '#  .  $  $  .  #',
            '#              #',
            '#  .  $  $  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 10,
        name: '对称简单',
        description: '对称布局，协作入门',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 200,
        map: [
            '####################',
            '#                  #',
            '#  1  $  $    $  $ #',
            '#                  #',
            '#  .  .  .    .  . #',
            '#                  #',
            '#  2  $  $    $  $ #',
            '#                  #',
            '#  .  .  .    .  . #',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 11,
        name: '错位走位',
        description: '配合走位，避免互相阻挡',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 150,
        map: [
            '####################',
            '#                  #',
            '#  $  $  $        #',
            '#                  #',
            '#  1            2 #',
            '#                  #',
            '#  .  .  .        #',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 12,
        name: '多箱协作',
        description: '需要配合推动多个箱子',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 180,
        map: [
            '########################',
            '#                      #',
            '#  $  $  $  $          #',
            '#                      #',
            '#  1  #######  2       #',
            '#     #     #          #',
            '#  .  .  .  .          #',
            '#                      #',
            '########################'
        ]
    },
    {
        id: 13,
        name: '迷宫挑战',
        description: '复杂迷宫，需要规划路线',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 240,
        map: [
            '################',
            '#              #',
            '#  1  ###  2   #',
            '#     #        #',
            '#  $  #  $     #',
            '#     #        #',
            '#  .  #  .     #',
            '#              #',
            '################'
        ]
    },
    {
        id: 14,
        name: '交错推箱',
        description: '箱子交错排列',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 200,
        map: [
            '################',
            '#              #',
            '#  1  $  $  2  #',
            '#    $  $      #',
            '#  .  .  .  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 15,
        name: '双重迷宫',
        description: '两个迷宫区域',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 240,
        map: [
            '####################',
            '#                  #',
            '#  1  #####  2     #',
            '#     #   #        #',
            '#  $  # $ #  $     #',
            '#     #   #        #',
            '#  .  # . #  .     #',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 16,
        name: '环形推箱',
        description: '环形布局',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 200,
        map: [
            '################',
            '#  ##########  #',
            '#  #        #  #',
            '#  # 1  $  2 #  #',
            '#  #        #  #',
            '#  #  $  $  #  #',
            '#  #        #  #',
            '#  #  .  .  #  #',
            '#  #        #  #',
            '#  ##########  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 17,
        name: '分离区域',
        description: '玩家分离在不同区域',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 240,
        map: [
            '################',
            '#  1  ###   $  #',
            '#     #        #',
            '#  $  #  .     #',
            '#     #        #',
            '#  ##########  #',
            '#     #        #',
            '#  .  #  $     #',
            '#     #  .     #',
            '#     ###   2  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 18,
        name: '路径选择',
        description: '多条路径，选择正确的',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 240,
        map: [
            '################',
            '#              #',
            '#  1       2   #',
            '#  #   #   #   #',
            '#  $ # $ # $   #',
            '#  #   #   #   #',
            '#  . # . # .   #',
            '#  #   #   #   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 19,
        name: '分层迷宫',
        description: '多层迷宫结构',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 300,
        map: [
            '################',
            '#              #',
            '#  1  ###  2   #',
            '#  #  ###  #   #',
            '#  $  ###  $   #',
            '#  #  ###  #   #',
            '#  .  ###  .   #',
            '#  #  ###  #   #',
            '#  $  ###  $   #',
            '#  #  ###  #   #',
            '#  .  ###  .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 20,
        name: '协作迷宫',
        description: '需要配合才能通过',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 300,
        map: [
            '################',
            '#              #',
            '#  1  #####    #',
            '#     #   $    #',
            '#  $  #  ###   #',
            '#     #    #   #',
            '#  .  #    #   #',
            '#  ##########  #',
            '#     #        #',
            '#  2  #  $     #',
            '#     #  .     #',
            '#  .           #',
            '################'
        ]
    },
    {
        id: 21,
        name: '终极迷宫',
        description: '复杂迷宫协作',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 300,
        map: [
            '################',
            '#              #',
            '#  1    $      #',
            '#  ####  ###   #',
            '#  $    #   $  #',
            '#  #    #   #  #',
            '#  .    #   .  #',
            '#  ##########  #',
            '#              #',
            '#  2    $      #',
            '#  ####  ###   #',
            '#       #   .  #',
            '#  .    #      #',
            '#              #',
            '################'
        ]
    },
    {
        id: 22,
        name: '多箱挤压',
        description: '多箱相互挤压',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 300,
        map: [
            '################',
            '#              #',
            '#  1  $  $  2  #',
            '#              #',
            '#  $  $  $  $  #',
            '#              #',
            '#  $  $        #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 23,
        name: '死路陷阱',
        description: '小心别把箱子推到死路',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 300,
        map: [
            '################',
            '#  ###  ###    #',
            '#  #$#  #$#    #',
            '#  # #  # #    #',
            '#  1 #  # 2    #',
            '#  ###  ###    #',
            '#              #',
            '#  $    $      #',
            '#              #',
            '#  .    .      #',
            '#  .    .      #',
            '#              #',
            '################'
        ]
    },
    {
        id: 24,
        name: '交错迷宫',
        description: '高度交错的迷宫',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#  1  #    2   #',
            '#  #  #  # #   #',
            '#  $  #  # $   #',
            '#  #  #  # #   #',
            '#  .  #  # .   #',
            '#  ##########  #',
            '#     #        #',
            '#  $  #  $     #',
            '#     #        #',
            '#  .  #  .     #',
            '#              #',
            '################'
        ]
    },
    {
        id: 25,
        name: '双区域迷宫',
        description: '两个独立迷宫区域',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#  1  #######  #',
            '#     #     #  #',
            '#  $  #  $  #  #',
            '#     #     #  #',
            '#  .  #  .  #  #',
            '#  ##########  #',
            '#              #',
            '#  2  #######  #',
            '#     #     #  #',
            '#  $  #  $  #  #',
            '#     #     #  #',
            '#  .  #  .  #  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 26,
        name: '中心挑战',
        description: '所有箱子在中心',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  $  $  $  $  #',
            '#              #',
            '#  $  $  $  $  #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 27,
        name: '蛇形迷宫',
        description: '蛇形路径，需要规划',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#  1  #        #',
            '#  #  #  $  $  #',
            '#  #  #  #  #  #',
            '#     #  #  .  #',
            '#  #  #  #  #  #',
            '#  .  #  2  $  #',
            '#  #  ####  #  #',
            '#     #     #  #',
            '#  #  #  .  #  #',
            '#  .  #     #  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 28,
        name: '对称困难',
        description: '对称但困难的布局',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '####################',
            '#                  #',
            '#  1  $  $     $  $#',
            '#  #  #  #  #  #  #',
            '#     #  #  #     #',
            '#  #  #  #  #  #  #',
            '#  .  .  .  .  .  .#',
            '#  #  #  #  #  #  #',
            '#  2  $  $     $  $#',
            '#  #  #  #  #  #  #',
            '#     #  #  #     #',
            '#  #  #  #  #  #  #',
            '#  .  .  .  .  .  .#',
            '#                  #',
            '####################'
        ]
    },
    {
        id: 29,
        name: '迷宫塔',
        description: '多层迷宫塔',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '################',
            '#              #',
            '#  1  ######  #',
            '#  #  #    #  #',
            '#  $  #  $ #  #',
            '#  #  #  # #  #',
            '#  .  #  . #  #',
            '#  ##########  #',
            '#  2  ######  #',
            '#  #  #    #  #',
            '#  $  #  $ #  #',
            '#  #  #  # #  #',
            '#  .  #  . #  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 30,
        name: '终极协作',
        description: '需要高度配合才能通关',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '################',
            '#              #',
            '#  1  $  $  2  #',
            '#              #',
            '#  $  $  $  $  #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '#  $  $        #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 31,
        name: '简单训练1',
        description: '最基础的协作训练',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 60,
        map: [
            '##########',
            '#        #',
            '#  1  2  #',
            '#        #',
            '#  $  $  #',
            '#        #',
            '#  .  .  #',
            '#        #',
            '##########'
        ]
    },
    {
        id: 32,
        name: '简单训练2',
        description: '单人练习推箱子',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 90,
        map: [
            '##########',
            '#        #',
            '#  1  2  #',
            '#        #',
            '#  $  $  #',
            '#        #',
            '#  .  .  #',
            '#        #',
            '##########'
        ]
    },
    {
        id: 33,
        name: '两人分推',
        description: '两人分别推不同的箱子',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 90,
        map: [
            '############',
            '#          #',
            '#  1    2  #',
            '#          #',
            '#  $      $#',
            '#          #',
            '#  .      .#',
            '#          #',
            '############'
        ]
    },
    {
        id: 34,
        name: '中间障碍',
        description: '中间有墙壁分隔',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 120,
        map: [
            '############',
            '#          #',
            '#  1  #  2 #',
            '#     #    #',
            '#  $  #  $ #',
            '#     #    #',
            '#  .  #  . #',
            '#          #',
            '############'
        ]
    },
    {
        id: 35,
        name: 'L形路径',
        description: 'L形的推箱路径',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 120,
        map: [
            '############',
            '#    1     #',
            '#  ####### #',
            '#  #     # #',
            '#  $  2  $ #',
            '#  #     # #',
            '#  .  .  # #',
            '#  ####### #',
            '#          #',
            '############'
        ]
    },
    {
        id: 36,
        name: '三箱并排',
        description: '三个箱子并排',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 180,
        map: [
            '############',
            '#          #',
            '#  1    2  #',
            '#          #',
            '#  $$$     #',
            '#          #',
            '#  ...     #',
            '#          #',
            '############'
        ]
    },
    {
        id: 37,
        name: '四箱排列',
        description: '四个箱子需要规划',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 180,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  $  $  $  $  #',
            '#              #',
            '#  .  .  .  .  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 38,
        name: '双行箱子',
        description: '两行箱子交错',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 200,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  $  $  $     #',
            '#    $  $  $   #',
            '#  .  .  .     #',
            '#    .  .  .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 39,
        name: '角落推箱',
        description: '小心别把箱子推到角落',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 200,
        map: [
            '################',
            '#  $           #',
            '#  #           #',
            '#  1        2  #',
            '#  #           #',
            '#  .           #',
            '#           $  #',
            '#           #  #',
            '#           .  #',
            '#           #  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 40,
        name: '中心聚焦',
        description: '所有目标点在中心',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 240,
        map: [
            '################',
            '#  $      $    #',
            '#              #',
            '#      ..      #',
            '#  1        2  #',
            '#      ..      #',
            '#              #',
            '#  $      $    #',
            '#              #',
            '################'
        ]
    },
    {
        id: 41,
        name: '环形困难',
        description: '环形布局，困难模式',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 300,
        map: [
            '################',
            '#  ##########  #',
            '#  #        #  #',
            '#  # 1 $ $ 2 # #',
            '#  #        #  #',
            '#  #  $  $  #  #',
            '#  #        #  #',
            '#  #  .  .  #  #',
            '#  #        #  #',
            '#  #  .  .  #  #',
            '#  #        #  #',
            '#  ##########  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 42,
        name: '五排箱子',
        description: '五排箱子需要高度配合',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  $$$$$$$$$   #',
            '#              #',
            '#  .........   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 43,
        name: '双迷宫困难',
        description: '两个独立的困难迷宫',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 360,
        map: [
            '################',
            '#  1  ######## #',
            '#  #  #      # #',
            '#  $  #  $   # #',
            '#  #  #  #   # #',
            '#  .  #  .   # #',
            '#  ########## #',
            '#              #',
            '#  2  ######## #',
            '#  #  #      # #',
            '#  $  #  $   # #',
            '#  #  #  #   # #',
            '#  .  #  .   # #',
            '#              #',
            '################'
        ]
    },
    {
        id: 44,
        name: '交错困难',
        description: '高度交错的困难布局',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '################',
            '#  1  #    2   #',
            '#  #  #  # #   #',
            '#  $  #  # $   #',
            '#  #  #  # #   #',
            '#  .  #  # .   #',
            '#  #  #  # #   #',
            '#  $  #  # $   #',
            '#  #  #  # #   #',
            '#  .  #  # .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 45,
        name: '螺旋迷宫',
        description: '螺旋形的迷宫',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '################',
            '#  1  ######  #',
            '#     #    #  #',
            '#  $  #  $ #  #',
            '#  #  #  # #  #',
            '#  .  #  . #  #',
            '#  #  #### #  #',
            '#  #  2   #  #',
            '#  $  # $ #  #',
            '#  #  # # #  #',
            '#  .  # . #  #',
            '#  #######  #',
            '#              #',
            '################'
        ]
    },
    {
        id: 46,
        name: '八箱对称',
        description: '八个箱子，对称布局',
        difficulty: DIFFICULTY.EASY,
        timeLimit: 240,
        map: [
            '################',
            '#  $      $    #',
            '#              #',
            '#  $      $    #',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  .      .    #',
            '#              #',
            '#  .      .    #',
            '#              #',
            '################'
        ]
    },
    {
        id: 47,
        name: '六箱迷宫',
        description: '六个箱子在迷宫中',
        difficulty: DIFFICULTY.MEDIUM,
        timeLimit: 300,
        map: [
            '################',
            '#  1  #####    #',
            '#     #   $    #',
            '#  $  #  ###   #',
            '#     #    #   #',
            '#  .  #    #   #',
            '#  ##########  #',
            '#     #        #',
            '#  2  #  $     #',
            '#     #  .     #',
            '#  .  .        #',
            '#              #',
            '################'
        ]
    },
    {
        id: 48,
        name: '四迷宫挑战',
        description: '四个小迷宫区域',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 400,
        map: [
            '################',
            '#  1  ###  2   #',
            '#  #  ###  #   #',
            '#  $  ###  $   #',
            '#  #  ###  #   #',
            '#  .  ###  .   #',
            '#  ##########  #',
            '#  3  ###  4   #',
            '#  #  ###  #   #',
            '#  $  ###  $   #',
            '#  #  ###  #   #',
            '#  .  ###  .   #',
            '#              #',
            '################'
        ]
    },
    {
        id: 49,
        name: '十箱终极',
        description: '十个箱子的终极挑战',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 500,
        map: [
            '################',
            '#              #',
            '#  1        2  #',
            '#              #',
            '#  $$$$$$$$$$ #',
            '#              #',
            '#  .......... #',
            '#              #',
            '################'
        ]
    },
    {
        id: 50,
        name: '大师级',
        description: '大师级协作挑战',
        difficulty: DIFFICULTY.HARD,
        timeLimit: 600,
        map: [
            '################',
            '#  1  ######## #',
            '#  #  #    #  #',
            '#  $  #  $ #  #',
            '#  #  #  # #  #',
            '#  .  #  . #  #',
            '#  #  #######  #',
            '#  #  2   #    #',
            '#  $  # $ #    #',
            '#  #  # # #    #',
            '#  .  # . #    #',
            '#  #######     #',
            '#              #',
            '################'
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

    getLevelsByDifficulty: function(difficulty) {
        return LEVELS.filter(level => level.difficulty === difficulty);
    },

    getDifficultyName: function(difficulty) {
        const names = {
            [DIFFICULTY.EASY]: '简单',
            [DIFFICULTY.MEDIUM]: '中等',
            [DIFFICULTY.HARD]: '困难'
        };
        return names[difficulty] || '未知';
    },

    parseMap: function(mapData) {
        const map = [];
        const targets = [];
        const boxes = [];
        let player1Pos = null;
        let player2Pos = null;

        for (let y = 0; y < mapData.length; y++) {
            const row = [];
            const rowStr = mapData[y];
            
            for (let x = 0; x < rowStr.length; x++) {
                const char = rowStr[x];
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