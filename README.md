# snowily

A prototype/proof of concept of creative ski map. By combining height, location, weather and direction data, the applications tries to predict the the snow conditions at certain areas in the resort and from that prediction create a ski map, that colors the slopes according to snow conditions rather than difficulty level. The actual snow-type classification isn't implemented in this phase, but the colors is generated randomly just to present the interface.

## Start it
[Install node](https://docs.npmjs.com/getting-started/installing-node) to be able to use npm (the node package manager).
Then, to install all the dependencies and fire up the app, run:

```bash
npm install
npm run start
```

Then you're good to go, open up a browser and go to [localhost:8080](http://localhost:8080).

## Data
Data via [interactive things](https://github.com/interactivethings/swiss-maps/).