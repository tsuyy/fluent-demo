# Fluent demo

Interactive React prototype for the [Fluent case study](https://fluent.yvntsu.design): an interpretive layer for personal health data that states what it observes, offers a tentative reading, and asks the person whether it fits.

The language is authored, not model-generated. No AI model runs in the demo, and responses are scripted.

## Run it

```
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

React 19, Vite, framer-motion, and nivo plus hand-written SVG charts.

## Personas

- **Yvonne**: the primary path, built from real Apple Watch data (Jan 2022 to Oct 2026).
- **Jamie, Robert, Alex**: fictional personas with hand-written data, used to test whether the same system holds up with different amounts of data and different life stages. Alex has steps only, no wearable.

## Where things are

- `src/screens/`: Home, What Fluent noticed, Something Feels Different, Movement & Recovery, Heart & Nervous System, Sleep, Moments, and the two follow-up flows.
- `src/components/charts/`: chart components. Each states a takeaway computed from the data it draws.
- `src/data/yvonne/`: exported JSON for Yvonne's screens. Written by the private pipeline (`export_master.py`), not edited by hand.
- `src/data/{jamie,robert,alex}/`: persona data. Robert's bedtime file is illustrative.

## Baseline rule

Every comparison uses the mean of the previous 30 days, excluding the day scored, with at least 14 readings. The live snapshot cards on Something Feels Different use a labelled 90-day average.

## Privacy

Yvonne's data is exported from a local pipeline and contains personal health information. Do not publish `src/data/yvonne/` outside this project.
