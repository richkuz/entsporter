# Entsporter

An import export tool for Enterprise Search engine settings.

<!-- sources: http://www.theargonath.cc/pictures/ents/ents.html https://cdn.player.one/sites/player.one/files/2016/02/01/enterprise-star-trek.jpg -->
![Entsporter](/entsporter.png)

Import and export Elastic App Search engine configuration, including:
* Schema configuration
* Curations
* Synonyms
* Field weights
* Boosts
* Result settings
* Precision tuning setting

Only tested with 8.6 App Search managed engines so far. It _probably_ works with versions as far back as 7.17.

## Installation

Clone this repo and run:

```sh
npm install
```

## Usage

Export an App Search engine `parks` to a JSON file, `engine.json`.

```sh
npm run index.js export-app-search-engine parks \
  --app-search-endpoint "https://my-cloud-deployment.ent.us-central1.gcp.cloud.es.io" \
  --app-search-private-key "private-REDACTED" \
  --output-json "engine.json"
```

Import an exported engine's settings from a file `engine.json` into a new engine, `new-parks`.

```sh
npm run index.js import-app-search-engine new-parks \
  --app-search-endpoint "https://my-cloud-deployment.ent.us-central1.gcp.cloud.es.io" \
  --app-search-private-key "private-REDACTED" \
  --input-json "engine.json"
```
