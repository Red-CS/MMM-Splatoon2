# MMM-Splatoon2

Displays current data about the Turf War, Ranked, and League matches of Splatoon 2.
API data provided by [https://splatoon2.ink](https://splatoon2.ink).

## Installation

`cd` into the `/modules` directory, then clone the project:

```bash
git clone https://www.github.com/Red-CS/MMM-Splatoon2
```

## Configuration

In MagicMirror's `config.js` file, add a new module with a config key in this format:

```json
config: {
    turf: true,
    ranked: true,
    league: true,
    updateInterval: 600,
    header: "Splatoon 2 Rotations"
}
```

### Options

- `turf`: (true/false) Display Turf War Rotations
- `ranked`: (true/false) Display Ranked Rotations
- `league`: (true/false) Display League Rotations
- `updateInterval`: (number) Time (in ms) it takes to check for updates
- `header`: (string) Shown name of the module
