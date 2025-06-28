# Global Keylogger

A TypeScript library for capturing global keyboard and mouse events on Windows systems. This project provides a high-performance, low-level interface to keyboard and mouse input events with detailed timing information.

## Features

- Global keyboard event capturing (key press, key release)
- Global mouse event capturing (button press, button release, position)
- Detailed event information (key codes, scan codes, timing, repeat count)
- Windows virtual key code mapping to human-readable names
- Built-in time measurement for key press duration
- Simple "Time Game" demo application

## Requirements

- Windows operating system
- [Bun](https://bun.sh/) runtime
- TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/global-keylogger.git
   cd global-keylogger
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

## Usage

### Basic Usage

Run the keylogger in default mode:

```bash
bun run start
```

This will start capturing keyboard and mouse events and log them to `c:/users/public/global-keylogger.log`.

### Time Game Mode

Run the keylogger with the time game feature:

```bash
bun run timegame
```

This starts a simple terminal game that measures how long you hold down keys and how many times you press them.

### Building

To build the project:

```bash
bun run build
```

This creates a minified bundle in the `build` directory.

## API

### WinKeyServer

The main class for capturing keyboard and mouse events.

```typescript
import WinKeyServer from "./WinKeyServer";
import type { InputEvent } from "./types";

// Create a new server with an event handler
const server = new WinKeyServer((event: InputEvent) => {
  console.log(`Key: ${event.rawKey}, Action: ${event.isDown ? 'down' : 'up'}`);
});

// Start the server
server.start().then(() => {
  console.log("Server started");
});
```

### Event Types

#### InputEvent

Base interface for all input events:

```typescript
interface InputEvent {
  isMouse: boolean;   // Whether this is a mouse event
  isDown: boolean;    // Whether the key/button is being pressed down
  vKey: number;       // Windows virtual key code
  rawKey: string;     // Human-readable key name
  scanCode: number;   // Hardware scan code
  locationX: number;  // X coordinate (mouse events only)
  locationY: number;  // Y coordinate (mouse events only)
}
```

#### KeyEvent

Extended interface for keyboard events:

```typescript
interface KeyEvent {
  isDown: boolean;    // Whether the key is being pressed down
  vKey: number;       // Windows virtual key code
  rawKey: string;     // Human-readable key name
  scanCode: number;   // Hardware scan code
  time?: number;      // Duration of key press (for key up events)
  amount?: number;    // Number of repeat events (for key up events)
}
```

#### MouseEvent

Extended interface for mouse events:

```typescript
interface MouseEvent {
  isDown: boolean;    // Whether the button is being pressed down
  vKey: number;       // Windows virtual key code for the mouse button
  locationX: number;  // X coordinate
  locationY: number;  // Y coordinate
  time?: number;      // Duration of button press (for button up events)
}
```

## How It Works

The project uses a Windows executable (`AggregatorHost.exe`) to capture global keyboard and mouse events at a low level. The TypeScript code communicates with this executable through standard input/output streams, parsing the event data and providing it to your application through a simple event listener interface.

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request