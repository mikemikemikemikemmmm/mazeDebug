import { APP_WIDTH } from "./const";
import Maze from "./maze";
const canvasDom = document.createElement("canvas");
canvasDom.width = APP_WIDTH
canvasDom.height = APP_WIDTH
document.body.appendChild(canvasDom);
const ctx = canvasDom.getContext("2d");
if (ctx) {
    new Maze(ctx)
}