/*
  array element mean:
  0:外框, edge
  1:間隔, interval
  2:未造訪, Not visited
  3:已造訪, Visited
  4:已回朔, Backtracked
  5:不合法, illegal
  6:起點, starting point
  7:終點, end point
*/
/*
  vector array index mean:
  [up,right,down,left]
  0:上
  1:右
  2:下
  3:左
*/
import * as Pixi from 'pixi.js'
import { ROW_LENGTH, COL_WIDTH, ColStatus, ColType, TwoColsType, ColTypeColor, sleepSync, getBlendedColor } from './const'
import { BackPoint, ColValue, DIRECTION_VECTORS, FourDirectionData, MazeMatrix, NextDirectionData, Position } from './type'

export default class Maze {
    maze!: MazeMatrix
    endIndex!: Position
    graphics!: Pixi.Graphics
    currentPath: string = ''
    backPointList: BackPoint[] = []
    normalCol = {
        boundry: ColType.Boundry + ColStatus.Normal as ColValue,
        wall: ColType.Wall + ColStatus.Normal as ColValue,
        notVisited: ColType.NotVisited + ColStatus.Normal as ColValue,
    }
    startPositionIndex: Position = {
        row: 2, col: 2
    }
    constructor(private ctx: CanvasRenderingContext2D) {
        this.init()
    }
    showBackPointList() {

    }
    createMazeNotVisitedRow(): ColValue[] {//00,10,20,10,20,10,00
        const tempMazeRow = [this.normalCol.boundry]
        for (let index = 0; index < ROW_LENGTH - 2; index++) {
            if (index % 2 === 0) {
                tempMazeRow.push(this.normalCol.wall)
            } else {
                tempMazeRow.push(this.normalCol.notVisited)
            }
        }
        tempMazeRow.push(this.normalCol.boundry)
        return [...tempMazeRow]
    }
    createMazeWallRow(): ColValue[] {//00,10,10,10,10,10,10,10,00
        const tempRow = [this.normalCol.boundry]
        for (let index = 0; index < ROW_LENGTH - 2; index++) {
            tempRow.push(this.normalCol.wall)
        }
        tempRow.push(this.normalCol.boundry)
        return [...tempRow]
    }
    createMazeBoundryRow(): ColValue[] {//00,00,00,00,00,00,00,00
        const arr: ColValue[] = []
        for (let index = 0; index < ROW_LENGTH; index++) {
            arr.push(this.normalCol.boundry)
        }
        return [...arr]
    }
    createEmptyMaze() {
        const tempMaze: MazeMatrix = []
        const boundryRow = this.createMazeBoundryRow()
        tempMaze.push(boundryRow)
        for (let index = 0; index < (ROW_LENGTH - 3); index++) {
            if (index % 2 === 0) {
                const wallRow = this.createMazeWallRow()
                tempMaze.push(wallRow)
            } else {
                const notVisitedRow = this.createMazeNotVisitedRow()
                tempMaze.push(notVisitedRow)
            }
        }
        const wallRow = this.createMazeWallRow()
        tempMaze.push(wallRow)
        tempMaze.push(boundryRow)
        const colVal = (ColType.StartPoint + ColStatus.Normal) as ColValue
        tempMaze[this.startPositionIndex.row][this.startPositionIndex.col] = colVal//設置起點, set start point
        return [...tempMaze]
    }
    drawFourDirectionCol(row: number, col: number) {
        DIRECTION_VECTORS.forEach((directionVector: [number, number]) => {
            const [yVector, xVector] = directionVector
            const firstColType = this.getColType(row + yVector, col + xVector)
            const secondColType = this.getColType(row + yVector * 2, col + xVector * 2)
            this.drawCol(row + yVector, col + xVector, firstColType, ColStatus.Inspect)
            this.drawCol(row + yVector * 2, col + xVector * 2, secondColType, ColStatus.Inspect)
        });

    }
    drawFourDirectionColToNormal(row: number, col: number) {
        DIRECTION_VECTORS.forEach((directionVector: [number, number]) => {
            const [yVector, xVector] = directionVector
            this.drawColToNormal(row + yVector, col + xVector)
            this.drawColToNormal(row + yVector * 2, col + xVector * 2)
        });

    }
    getFourDirectionData(row: number, col: number): FourDirectionData {
        const fourDirectionData: FourDirectionData = ['', '', '', '']
        //[up,right,bottom,left]
        DIRECTION_VECTORS.forEach((directionVector: [number, number], directionIndex: number) => {
            const [yVector, xVector] = directionVector
            const firstColType = this.getColType(row + yVector, col + xVector)
            const secondColType = this.getColType(row + yVector * 2, col + xVector * 2)
            fourDirectionData[directionIndex] = firstColType + secondColType
        });
        return fourDirectionData
    }
    isTwoColsTypeExistInFourDir(fourDirs: FourDirectionData, TwoColsType: TwoColsType) {
        return fourDirs.includes(TwoColsType)
    }
    getNextDirection(fourDirsData: FourDirectionData): NextDirectionData {
        /*
        有12最優先
        有36則表示回到起點了
        若沒有12、36，只有13 33 則往33走 把本身加路徑變為已回朔，注意 終點不改變

        12 is top priority,
        
        if 36, meaning have be back to the starting point
        
        if without 12、36, and only has 13、33 ,then go 33, 
        making path and self to 4(backtracked).
        */
        const hasNotVisited = this.isTwoColsTypeExistInFourDir(fourDirsData, TwoColsType.NotVisited)
        if (hasNotVisited) {
            const notVisitedPaths: number[] = []
            fourDirsData.forEach((pathStr, directionIndex) => {
                if (pathStr === TwoColsType.NotVisited) {
                    notVisitedPaths.push(directionIndex)
                }
            });
            //if mutiple not visited ,random pick one 
            const randomIndex = Math.floor(Math.random() * (notVisitedPaths.length))
            // while (randomIndex === notVisitedPaths.length) {
            //     randomIndex = Math.floor(Math.random() * (notVisitedPaths.length))
            // }
            return {
                nextDirectionIndex: notVisitedPaths[randomIndex],
                currentColChangeTo: ColType.Visited,
                expandingStatus: 'expandingRoad'
            }
        }
        const isBackToStartPoint = this.isTwoColsTypeExistInFourDir(fourDirsData, TwoColsType.BackToStartPoint)
        if (isBackToStartPoint) {//回到起點, back to start point
            for (const directionIndex in fourDirsData) {
                if (fourDirsData[directionIndex] === TwoColsType.BackToStartPoint) {
                    return {
                        nextDirectionIndex: Number(directionIndex),
                        currentColChangeTo: ColType.HasBacktracked,
                        expandingStatus: 'hasBackToStart'
                    }
                }
            }
            //console.log('渲染結束'), render end
            throw Error("a")
        }
        const meetBackPoint = !this.isTwoColsTypeExistInFourDir(fourDirsData, TwoColsType.HasBacktracked) &&
            this.isTwoColsTypeExistInFourDir(fourDirsData, TwoColsType.Visited)
        if (meetBackPoint) {//折返起點, backtracked start point
            for (const directionIndex in fourDirsData) {
                if (fourDirsData[directionIndex] === TwoColsType.Visited) {
                    return {
                        nextDirectionIndex: Number(directionIndex),
                        currentColChangeTo: ColType.HasBacktracked,
                        expandingStatus: 'isBackPoint'
                    }

                }
            }
            //console.log('折返起點')
            throw Error("b")
        }
        const isBacktracking = this.isTwoColsTypeExistInFourDir(fourDirsData, TwoColsType.Visited)
        if (isBacktracking) {//折返中, backtracking
            for (const directionIndex in fourDirsData) {
                if (fourDirsData[directionIndex] === TwoColsType.Visited) {
                    return {
                        nextDirectionIndex: Number(directionIndex),
                        currentColChangeTo: ColType.HasBacktracked,
                        expandingStatus: 'backtracking'
                    }
                }
            }
            //console.log('需折返'), need to backtrack
            throw Error("c")
        }
        throw Error("d")
    }
    setColValue(row: number, col: number, colType: ColType, colStatus: ColStatus) {
        this.maze[row][col] = (colType + colStatus) as ColValue
    }
    setColType(row: number, col: number, colType: ColType) {
        const originStatus = this.maze[row][col][1]
        this.maze[row][col] = (colType + originStatus) as ColValue
    }
    getColType(row: number, col: number): ColType {
        return this.maze[row][col][0] as ColType
    }
    createEnd() {
        //find longest back point
        this.backPointList.sort(function (a, b) {
            return b.stepNum - a.stepNum;
        });
        const row = this.backPointList[0].rowIndex
        const col = this.backPointList[0].colIndex
        this.endIndex = { row, col }
        this.setColValue(row, col, ColType.EndPoint, ColStatus.Normal)
    }
    async expandRoad(startRow: number, startCol: number) {
        let currentRow = startRow
        let currentCol = startCol
        while (true) {
            this.drawFourDirectionCol(currentRow, currentCol)
            await sleepSync()
            const fourDirsData = this.getFourDirectionData(currentRow, currentCol)
            this.drawFourDirectionColToNormal(currentRow, currentCol)
            await sleepSync()
            const { nextDirectionIndex, currentColChangeTo, expandingStatus } = this.getNextDirection(fourDirsData)
            const [yVector, xVector] = DIRECTION_VECTORS[nextDirectionIndex]
            //change current step col ,but do not change start point
            if (this.getColType(currentRow, currentCol) !== ColType.StartPoint) {
                this.setColType(currentRow, currentCol, currentColChangeTo)
            }
            //change next step col
            this.setColType(currentRow + yVector, currentCol + xVector, currentColChangeTo)
            // this.maze[currentRow + yVector][currentCol + xVector] = currentColChangeTo
            if (expandingStatus === 'hasBackToStart') {
                this.currentPath += nextDirectionIndex
                break
            } else if (expandingStatus === 'expandingRoad') {
                this.currentPath += nextDirectionIndex
            } else if (expandingStatus === 'isBackPoint') {
                this.currentPath = this.currentPath.slice(0, -1);
                this.backPointList.push({ rowIndex: currentRow, colIndex: currentCol, stepNum: this.currentPath.length })
            } else if (expandingStatus === 'backtracking') {
                this.currentPath = this.currentPath.slice(0, -1);
            } else {
                throw Error('e')
            }
            //each round ,run two step
            currentRow = currentRow + yVector * 2
            currentCol = currentCol + xVector * 2
        }
    }
    async init() {
        const startRow = this.startPositionIndex.row
        const startCol = this.startPositionIndex.col
        this.maze = this.createEmptyMaze()
        this.drawAllMazeRect()
        await sleepSync()
        await this.expandRoad(startRow, startCol)
        this.createEnd()
        this.drawAllMazeRect()
    }
    setColStatus(row: number, col: number, status: ColStatus) {
        const originType = this.maze[row][col][0]
        this.maze[row][col] = (originType + status) as ColValue
    }
    setColToNormalStatus(row: number, col: number) {
        const originType = this.maze[row][col][0]
        this.maze[row][col] = (originType + ColStatus.Normal) as ColValue
    }
    drawAllMazeRect() {
        for (let row = 0; row < ROW_LENGTH; row++) {
            for (let col = 0; col < ROW_LENGTH; col++) {
                const colType = this.getColType(row, col)
                this.ctx.fillStyle = ColTypeColor[colType];
                this.ctx.fillRect(COL_WIDTH * row, COL_WIDTH * col, COL_WIDTH, COL_WIDTH);
            }
        }
    }
    drawCol(row: number, col: number, colType: ColType, colStatus: ColStatus) {
        this.ctx.fillStyle = getBlendedColor(colType, colStatus)
        this.ctx.fillRect(COL_WIDTH * row, COL_WIDTH * col, COL_WIDTH, COL_WIDTH);
    }
    drawColToNormal(row: number, col: number) {
        const colType = this.getColType(row, col)
        this.ctx.fillStyle = ColTypeColor[colType];
        this.ctx.fillRect(COL_WIDTH * row, COL_WIDTH * col, COL_WIDTH, COL_WIDTH);
    }
}