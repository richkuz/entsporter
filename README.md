# Entsporter

An import export tool for Enterprise Search engine settings.

<!-- sources: http://www.theargonath.cc/pictures/ents/ents.html https://cdn.player.one/sites/player.one/files/2016/02/01/enterprise-star-trek.jpg -->
![Entsporter](/entsporter.png)

Import and export Elastic App Search engine configuration, including:
* Schema configuration
* Curations
* Synonyms

Coming soon:
* Field weights and boosts
* Result settings

## Installation

Clone this repo and run:

```sh
npm install
```

## Usage

Export an App Search engine `parks` to a JSON file, `engine.json`.

```sh
npm run index.js export-app-search-engine parks \
  --app-search-endpoint "https://rkuzsma-8-6-jan-10.ent.us-central1.gcp.cloud.es.io" \
  --app-search-private-key "private-rijnrwf17grbg9jg8m1zam9q" \
  --output-json "engine.json"
```

Import an exported engine's settings from a file `engine.json` into a new engine, `new-parks`.

```sh
npm run index.js import-app-search-engine new-parks \
  --app-search-endpoint "https://rkuzsma-8-6-jan-10.ent.us-central1.gcp.cloud.es.io" \
  --app-search-private-key "private-rijnrwf17grbg9jg8m1zam9q" \
  --input-json "engine.json"
```
