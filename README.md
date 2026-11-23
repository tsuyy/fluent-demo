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

## Data

The demo runs on Yvonne's own Apple Watch data (Jan 2022 to Oct 2026).

## Where things are

- `src/screens/`: Home, What Fluent noticed, Something Feels Different, Movement & Recovery, Heart & Nervous System, Sleep, Moments, and the two follow-up flows.
- `src/components/charts/`: chart components. Each states a takeaway computed from the data it draws.
- `src/data/yvonne/`: exported JSON for Yvonne's screens. Written by the private pipeline (`export_master.py`), not edited by hand.

## Baseline rule

Every comparison uses the mean of the previous 30 days, excluding the day scored, with at least 14 readings. The live snapshot cards on Something Feels Different use a labelled 90-day average.

## Privacy

Yvonne's data is exported from a local pipeline and contains personal health information. Do not publish `src/data/yvonne/` outside this project.
