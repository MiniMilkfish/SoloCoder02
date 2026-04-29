document.addEventListener('DOMContentLoaded', function() {
    const game = new Game();
    game.init();

    window.gameInstance = game;

    console.log('双人协作推箱子游戏已加载完成！');
    console.log('玩家1控制: W/A/S/D 移动, Q 推箱子');
    console.log('玩家2控制: I/J/K/L 移动, U 推箱子');
    console.log('快捷键: R 重置关卡, Space 暂停/继续');
});