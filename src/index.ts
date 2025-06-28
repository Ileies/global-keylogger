import WinKeyServer from "./WinKeyServer";
import TimeGame from "./timeGame";
import type {KeyEvent, MouseEvent} from "./types";

const mode = process.argv[2] ?? "default";
const logFile: string = "c:/users/public/global-keylogger.log";
let times: { [key: number]: { time: number, amount: number } } = {};
const timeGame = new TimeGame();

await Bun.write(logFile, "Started\n");

async function keyDown(e: KeyEvent) {
    // vKey, rawKey, scanCode
    if (mode === "timegame") await timeGame.animation();
}

async function keyUp(e: KeyEvent) {
    // vKey, rawKey, scanCode, time, amount
    if (mode === "timegame") await timeGame.stopAnimation(e);
}

async function mouseDown(e: MouseEvent) {
    // vKey, locationX, locationY
}

async function mouseUp(e: MouseEvent) {
    // vKey, locationX, locationY, time
}

new WinKeyServer(async function (e) {
    let amount: number = 0;
    let time: number = 0;
    const logEntry: { [key: string]: any } = {
        t: new Date().valueOf(),
        d: e.isDown ? 1 : 0,
        m: e.isMouse ? 1 : 0,
        k: e.vKey
    };

    if (e.isDown) {
        if (times[e.vKey]) {
            times[e.vKey].amount += 1;
            return;
        }
        times[e.vKey] = {time: Date.now(), amount: 1};
        if (e.isMouse) await mouseDown(e);
        else await keyDown(e);
    } else {
        if (!times[e.vKey]) return;
        time = Date.now() - times[e.vKey].time;
        logEntry.ti = time;
        if (e.isMouse) await mouseUp({time, ...e});
        else {
            const amount = times[e.vKey].amount;
            logEntry.a = amount;
            await keyUp({...e, time, amount});
        }
        delete times[e.vKey];
    }

    if (e.isMouse) {
        logEntry.x = e.locationX;
        logEntry.y = e.locationY;
    } else {
        logEntry.n = e.rawKey;
        logEntry.c = e.scanCode;
    }
    await Bun.write(logFile, JSON.stringify(logEntry) + '\n');
}).start().then();


