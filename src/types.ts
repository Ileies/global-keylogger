export interface InputEvent {
    isMouse: boolean;
    isDown: boolean;
    vKey: number;
    rawKey: string;
    scanCode: number;
    locationX: number;
    locationY: number;
}
export interface KeyEvent {
    isDown: boolean;
    vKey: number;
    rawKey: string;
    scanCode: number;
    time?: number;
    amount?: number;
}
export interface MouseEvent {
    isDown: boolean;
    vKey: number;
    locationX: number;
    locationY: number;
    time?: number;
}
