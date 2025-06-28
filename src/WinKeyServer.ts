import {execFile} from "child_process";
import WinGlobalKeyLookup from "./WinGlobalKeyLookup";
import type {InputEvent} from "./types";
import {ChildProcess} from "node:child_process";
import {join} from "path";

const sPath = "../bin/AggregatorHost.exe";

export default class WinKeyServer {
    protected listener: (e: InputEvent) => void;
    private proc?: ChildProcess;

    constructor(listener: (e: InputEvent) => void) {
        this.listener = listener;
    }

    async start() {
        this.proc = execFile(join(__dirname, sPath), {maxBuffer: Infinity, windowsHide: true});

        this.proc.stdout?.on("data", data => {
            const sData: string = data.toString();
            const lines: string[] = sData.trim().split(/\n/);
            const events: { event: InputEvent, eventId: string }[] = lines.map(line => {
                const lineData = line.replace(/\s+/, "").split(',');

                const [
                    type,
                    action,
                    sKeyCode,
                    sScanCode,
                    sLocationX,
                    sLocationY,
                    eventId,
                ] = lineData;

                const keyCode = Number.parseInt(sKeyCode, 10);
                const scanCode = Number.parseInt(sScanCode, 10);

                const key = WinGlobalKeyLookup[keyCode].name;

                const event: InputEvent = {
                    isMouse: type === 'MOUSE',
                    isDown: action === 'DOWN',
                    vKey: keyCode,
                    rawKey: key,
                    scanCode,
                    locationX: Number.parseFloat(sLocationX),
                    locationY: Number.parseFloat(sLocationY)
                };

                return {event, eventId};
            });

            for (let {event, eventId} of events) {
                this.listener(event);
                this.proc?.stdin?.write(`0,${eventId}\n`);
            }
        });
        console.log("Started");
        return new Promise<void>((res, err) => {
            this.proc?.on("error", err);
            this.proc?.on("spawn", res);
        });
    }
}
