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

## Example exported engine settings JSON output

```json
{
  "read_only": {
    "name": "parks",
    "type": "default",
    "language": null
  },
  "schema": {
    "visitors": "number",
    "square_km": "number",
    "world_heritage_site": "text",
    "date_established": "date",
    "description": "text",
    "location": "geolocation",
    "acres": "text",
    "title": "text",
    "nps_link": "text",
    "states": "text"
  },
  "synonyms": [
    {
      "id": "syn-63d6e042a612f5da3c598f44",
      "synonyms": [
        "laptop",
        "computer",
        "pc",
        "ipad"
      ]
    },
    {
      "id": "syn-63d6e02da612f519b8598f3d",
      "synonyms": [
        "luigi",
        "mario"
      ]
    }
  ],
  "curations": [
    {
      "id": "cur-63d6e012a612f5a3da598f2c",
      "queries": [
        "mountain"
      ],
      "promoted": [
        "park_saguaro"
      ],
      "hidden": [
        "park_rocky-mountain"
      ]
    },
    {
      "id": "cur-63d6df34a612f5ce8d598ef3",
      "queries": [
        "park",
        "query2 with terms"
      ],
      "promoted": [
        "park_saguaro"
      ],
      "hidden": []
    }
  ],
  "searchSettings": {
    "search_fields": {
      "world_heritage_site": {
        "weight": 1
      },
      "acres": {
        "weight": 9.6
      },
      "id": {
        "weight": 1
      },
      "title": {
        "weight": 1
      },
      "nps_link": {
        "weight": 1
      },
      "states": {
        "weight": 1
      }
    },
    "result_fields": {
      "visitors": {
        "raw": {}
      },
      "square_km": {
        "raw": {}
      },
      "world_heritage_site": {
        "raw": {}
      },
      "description": {
        "raw": {}
      },
      "acres": {
        "snippet": {
          "size": 100
        },
        "raw": {
          "size": 111
        }
      },
      "title": {
        "snippet": {
          "size": 25,
          "fallback": true
        },
        "raw": {}
      }
    },
    "boosts": {
      "visitors": [
        {
          "type": "value",
          "factor": 2.7,
          "value": [
            "5"
          ]
        }
      ],
      "square_km": [
        {
          "function": "exponential",
          "type": "functional",
          "factor": 4.7,
          "operation": "add"
        },
        {
          "function": "gaussian",
          "center": 1,
          "type": "proximity",
          "factor": 1
        }
      ],
      "world_heritage_site": [
        {
          "type": "value",
          "factor": 1,
          "value": [
            "true",
            "trooo"
          ]
        }
      ],
      "location": [
        {
          "function": "gaussian",
          "center": "5555",
          "type": "proximity",
          "factor": 0.4
        }
      ]
    },
    "precision": 5,
    "precision_enabled": true
  }
}
```
