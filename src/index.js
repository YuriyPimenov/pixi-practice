// import { run } from "./game";
// import { run } from "./game2";
// import { run } from "./hunter";
// import { run } from "./points";
import { Game } from "./turist/game";
window.onload = () => {
    let game = new Game();
    game.run();
};
