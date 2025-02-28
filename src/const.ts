import tinycolor from "tinycolor2";
export const isDebugMode = (() => {

})()

export let SLEEP_MS = 100
export const COL_WIDTH = 20
export const ROW_LENGTH = 21  // must be 3+2n , n>=2
export const APP_WIDTH = COL_WIDTH * ROW_LENGTH
export function sleepSync(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, SLEEP_MS));
}

export enum ColStatus {
    Normal = "0",
    Inspect = "1",
    Current = "2"
}

export enum TwoColsType {
    NotVisited = "12",
    Visited = "33",
    BackToStartPoint = "36",
    HasBacktracked = "44"
}
export enum ColType {
    Boundry = "0",
    Wall = "1",
    NotVisited = "2",
    Visited = "3",
    HasBacktracked = "4",
    StartPoint = "6",
    EndPoint = "7"
} export const ColTypeColor: { [key in ColType]: string } = {
    [ColType.Boundry]: "rgba(255, 255, 255, 1)",       // #FFFFFF → 白色
    [ColType.Wall]: "rgba(0, 0, 0, 1)",               // #000000 → 黑色
    [ColType.NotVisited]: "rgba(255, 255, 255, 1)",   // #FFFFFF → 白色
    [ColType.Visited]: "rgba(0, 255, 0, 1)",         // #00FF00 → 绿色
    [ColType.HasBacktracked]: "rgba(100, 100, 100, 1)",  // #FF0000 → 红色
    [ColType.StartPoint]: "rgba(255, 255, 255, 1)",  // #FFFFFF → 白色
    [ColType.EndPoint]: "rgba(255, 255, 255, 1)"     // #FFFFFF → 白色
};
export const ColStatusColor: { [key in ColStatus]: string } = {
    [ColStatus.Current]: "rgba(0, 0, 255, 0.8)",
    [ColStatus.Inspect]: "rgba(255, 0, 0, 0.8)",
    [ColStatus.Normal]: "rgba(0, 0, 0, 0)",
};
export const getBlendedColor = (colType: ColType, colStatus: ColStatus) => {
    const blended = tinycolor.mix(ColTypeColor[colType], ColStatusColor[colStatus]);
    return blended.toRgbString()
}