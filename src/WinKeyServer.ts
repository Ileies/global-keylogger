import WinGlobalKeyLookup from "./WinGlobalKeyLookup";
import type {InputEvent} from "./types";

export default class WinKeyServer {
    protected listener: (e: InputEvent) => void;
    private proc?: ReturnType<typeof Bun.spawn>;

    constructor(listener: (e: InputEvent) => void) {
        this.listener = listener;
    }

    async start() {
        this.proc = Bun.spawn(["../bin/AggregatorHost.exe"], {
            stdin: "pipe",
            stdout: "pipe",
            stderr: "pipe",
            windowsHide: true,
        });

        // Read from the process's stdout
        if (this.proc?.stdout && this.proc.stdout instanceof ReadableStream) {
            const reader = this.proc.stdout.getReader();
            let {value, done} = await reader.read();
            while (!done) {
                const sData: string = new TextDecoder().decode(value);
                const lines: string[] = sData.trim().split(/\n/);
                const events: { event: InputEvent; eventId: string }[] = lines.map((line) => {
                    const lineData = line.replace(/\s+/, "").split(",");

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
                        isMouse: type === "MOUSE",
                        isDown: action === "DOWN",
                        vKey: keyCode,
                        rawKey: key,
                        scanCode,
                        locationX: Number.parseFloat(sLocationX),
                        locationY: Number.parseFloat(sLocationY),
                    };

                    return {event, eventId};
                });

                for (let {event, eventId} of events) {
                    this.listener(event);
                    if (!this.proc.stdin) return;
                    (this.proc.stdin as Bun.FileSink).write(`0,${eventId}\n`);
                }

                ({value, done} = await reader.read());
            }
        }

        console.log("Started");
        await this.proc.exited;
    }
}