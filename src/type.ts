

//[up,right,bottom,left]

import { ColStatus, ColType } from "./const"

export const DIRECTION_VECTORS: [[number, number], [number, number], [number, number], [number, number]] = [[-1, 0], [0, 1], [1, 0], [0, -1]]

export type FourDirectionData = [string, string, string, string]


export type ExpandingStatus = 'hasBackToStart' | 'expandingRoad' | 'isBackPoint' | 'backtracking'
export type ColValue = `${ColType}${ColStatus}` //ColType+ColStatus
export type MazeMatrix = ColValue[][]
export interface BackPoint {
    stepNum: number,
    rowIndex: number,
    colIndex: number
}



export interface NextDirectionData {
    nextDirectionIndex: number,
    currentColChangeTo: ColType,
    expandingStatus: ExpandingStatus
}

export interface Position {
    row: number
    col: number
}