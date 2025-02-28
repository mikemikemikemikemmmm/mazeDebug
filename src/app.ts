
import * as Pixi from 'pixi.js'
import Maze from './maze'
export default class RenderManager {
    appWidth: number
    rowLength: number
    tileWidth: number //px
    directionData: {
        [key: string]: {
            axis: 'y' | 'x',
            vector: -1 | 1,
            direction: 'up' | 'left' | 'down' | 'right'
        }
    }
    itemData: any
    //set in init
    app!: Pixi.Application
    maze!: Maze
    appContainer!: Pixi.Container
    keyBoardStatus!: { 'w': boolean, 'a': boolean, 's': boolean, 'd': boolean }
    endCoordinates!: number[][]
    endBounds!: any
    bindHandlePress!: (e: KeyboardEvent) => void
    bindHandleUnPress!: (e: KeyboardEvent) => void
    bindGameLoop!: () => void
    constructor(
        appWidth: number,
        rowLength: number
    ) {
        this.rowLength = rowLength
        this.appWidth = appWidth
        this.tileWidth = appWidth / rowLength
        this.app = new Pixi.Application({
            width: this.appWidth,
            height: this.appWidth,
            backgroundColor: 0xFFFFFF
        })
        this.init()
    }
    resetConfig() {
        this.app.ticker.remove(this.bindGameLoop)
        this.appContainer.destroy({
            children: true,
            texture: true
        })
    }
    init() {
        this.appContainer = new Pixi.Container()
        this.maze = new Maze()
        // this.endCoordinates = this.mazeIndexMapToCanvasCoordinate(this.maze.endIndex.row, this.maze.endIndex.col)
        // this.endBounds = {
        //     x: this.endCoordinates[0][0],
        //     y: this.endCoordinates[0][1],
        //     width: this.tileWidth,
        //     height: this.tileWidth
        // }
        // this.keyBoardListenManager = new KeyBoardManager()
        // this.ball = new Ball(this.tileWidth)
        // this.appContainer.addChild(this.maze.graphics, this.ball.graphics)
        // this.ball.graphics.x = (this.appWidth / 2) - this.ball.radius
        // this.ball.graphics.y = (this.appWidth / 2) - this.ball.radius
        // this.app.stage.addChild(this.appContainer)
        // this.bindGameLoop = this.gameLoop.bind(this)
        // this.app.ticker.add(this.bindGameLoop)
        // this.keyBoardListenManager.initKeyListener()
    }
    // handleWin() {
    //     this.keyBoardListenManager.removeKeyListender()
    //     if (window.confirm('win，another game?')) {
    //         this.resetConfig()
    //         this.init()
    //     } else {
    //         this.app.ticker.stop()
    //     }
    // }
    // mazeIndexMapToCanvasCoordinate(rowIndex: number, colIndex: number) {
    //     const leftTopPoint = [rowIndex * this.tileWidth, colIndex * this.tileWidth]
    //     return [leftTopPoint, leftTopPoint.map(coordinates => coordinates + this.tileWidth)]
    // }
    // isWallByXY(x: number, y: number) {
    //     const tileType = this.maze.maze[Math.ceil(x / this.tileWidth) - 1][Math.ceil(y / this.tileWidth) - 1]
    //     return tileType === '0' || tileType === '1' //0 is edge, 1 is wall
    // }
    // getMaxCoordinates(direction: 'up' | 'down' | 'left' | 'right', x: number, y: number) {//when touch wall
    //     switch (direction) {
    //         case 'up':
    //             return y - y % this.tileWidth + 2
    //         case 'right':
    //             return x - (x + this.ball.diameter) % this.tileWidth + this.tileWidth - 2
    //         case 'down':
    //             return y - (y + this.ball.diameter) % this.tileWidth + this.tileWidth - 2
    //         case 'left':
    //             return x - x % this.tileWidth + 2
    //     }
    // }
    // isTouchWall(direction: 'up' | 'down' | 'left' | 'right', x: number, y: number) {
    //     switch (direction) {
    //         case 'up':
    //             if (this.isWallByXY(x, y - this.ball.speed) ||
    //                 this.isWallByXY(x + this.ball.diameter, y - this.ball.speed)) {
    //                 return true
    //             }
    //             break
    //         case 'right':
    //             if (this.isWallByXY(x + this.ball.diameter + this.ball.speed, y) ||
    //                 this.isWallByXY(x + this.ball.diameter + this.ball.speed, y + this.ball.diameter)) {
    //                 return true
    //             }
    //             break
    //         case 'down':
    //             if (this.isWallByXY(x, y + this.ball.diameter + this.ball.speed) ||
    //                 this.isWallByXY(x + this.ball.diameter, y + this.ball.diameter + this.ball.speed)) {
    //                 return true
    //             }
    //             break
    //         case 'left':
    //             if (this.isWallByXY(x - this.ball.speed, y) ||
    //                 this.isWallByXY(x - this.ball.speed, y + this.ball.diameter)) {
    //                 return true
    //             }
    //             break
    //     }
    //     return false
    // }
    // handleKeyBoardStatus(keyCode: 'w' | 'a' | 's' | 'd') {
    //     if (this.ball.isTouchByBounds(this.endBounds)) {
    //         this.handleWin()
    //         return
    //     }
    //     const { x, y } = this.ball.graphics
    //     const { vector, direction, axis } = this.directionData[keyCode]
    //     if (this.isTouchWall(direction, x, y)) {
    //         this.ball.graphics[axis] = this.getMaxCoordinates(direction, x, y)
    //     } else {
    //         this.ball.graphics[axis] += this.ball.speed * vector
    //     }
    // }
    // gameLoop() {
    //     if (!this.keyBoardListenManager.keyBoardStatus['w'] || !this.keyBoardListenManager.keyBoardStatus['s']) {
    //         if (this.keyBoardListenManager.keyBoardStatus['w']) {
    //             this.handleKeyBoardStatus('w')
    //         }
    //         if (this.keyBoardListenManager.keyBoardStatus['s']) {
    //             this.handleKeyBoardStatus('s')
    //         }
    //     }
    //     if (!this.keyBoardListenManager.keyBoardStatus['a'] || !this.keyBoardListenManager.keyBoardStatus['d']) {
    //         if (this.keyBoardListenManager.keyBoardStatus['a']) {
    //             this.handleKeyBoardStatus('a')
    //         }
    //         if (this.keyBoardListenManager.keyBoardStatus['d']) {
    //             this.handleKeyBoardStatus('d')
    //         }
    //     }
    // }
}