const { Client } = require('@elastic/enterprise-search')
const fs = require('fs/promises');

async function importAppSearchEngine(engineName, options) {
  console.log(`Importing App Search engine settings into ${engineName}, host: ${options.appSearchEndpoint}`);
  const client = new Client({
    url: options.appSearchEndpoint,
    auth: {
      token: options.appSearchPrivateKey
    }
  });

  console.log(`Reading engine settings from ${options.inputJson}`);
  const engineJson = JSON.parse(await fs.readFile(options.inputJson, { encoding: 'utf8' }));
  console.dir(engineJson);

  await createEngine(client, engineName, engineJson);
  await importSchema(client, engineName, engineJson);
  await importSynonyms(client, engineName, engineJson);
  await importCurations(client, engineName, engineJson);
  await importSearchSettings(client, engineName, engineJson);
}

async function createEngine(client, engineName, engineJson) {
  console.log(`Creating engine ${engineName}`);

  // Abort if engine already exists
  try {
    const existingEngine = await client.app.getEngine({
      engine_name: engineName
    });
    console.error(`Engine ${engineName} already exists`);
    process.exit(1);
  }
  catch { // Engine does not exist, great!
  }

  const newEngineSettings = {
    name: engineName,
  }
  if (engineJson.read_only.language) {
    newEngineSettings.language = engineJson.read_only.language;
  }
  console.log(`New engine settings:`);
  console.dir(newEngineSettings);
  const result = await client.app.createEngine(newEngineSettings);
  if (result.errors) {
    console.error(result.errors)
    process.exit(1)
  }
}

async function importSchema(client, engineName, engineJson) {
  console.log(`Updating schema`);
  const result = await client.app.putSchema({
    engine_name: engineName,
    schema: engineJson.schema
  });
  if (result.errors) {
    console.error(result.errors)
    process.exit(1)
  }
}

async function importSynonyms(client, engineName, engineJson) {
  console.log(`Importing synonyms`);
  engineJson.synonyms.forEach(async (synonymSet) => {
    const result = await client.app.createSynonymSet({
      engine_name: engineName,
      synonyms: synonymSet.synonyms,
    });
    if (result.errors) {
      console.error(result.errors)
      process.exit(1)
    }
  });
}

async function importCurations(client, engineName, engineJson) {
  console.log(`Importing curations`);
  engineJson.curations.forEach(async (curation) => {
    const result = await client.app.createCuration({
      engine_name: engineName,
      queries: curation.queries,
      promoted_doc_ids: curation.promoted,
      hidden_doc_ids: curation.hidden,
    });
    if (result.errors) {
      console.error(result.errors)
      process.exit(1)
    }
  });
}

async function importSearchSettings(client, engineName, engineJson) {
  console.log(`Importing search settings`);
  const searchSettings = {
    engine_name: engineName,
    body: {},
  }
  if (engineJson.searchSettings.search_fields) {
    searchSettings.body.search_fields = engineJson.searchSettings.search_fields;
  }
  if (engineJson.searchSettings.result_fields) {
    searchSettings.body.result_fields = engineJson.searchSettings.result_fields;
  }
  if (engineJson.searchSettings.boosts) {
    searchSettings.body.boosts = engineJson.searchSettings.boosts;
  }
  if (engineJson.searchSettings.precision) {
    searchSettings.body.precision = engineJson.searchSettings.precision;
  }
  const result = await client.app.putSearchSettings(searchSettings);
  if (result.errors) {
    console.error(result.errors)
    process.exit(1)
  }
}

module.exports = importAppSearchEngine;
