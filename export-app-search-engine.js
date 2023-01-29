const { Client } = require('@elastic/enterprise-search')
const fs = require('fs/promises');

async function exportAppSearchEngine(engineName, options) {
  console.log(`Exporting App Search engine ${engineName}, host: ${options.appSearchEndpoint}`);
  const client = new Client({
    url: options.appSearchEndpoint,
    auth: {
      token: options.appSearchPrivateKey
    }
  });

  const engine = await client.app.getEngine({
    engine_name: engineName
  });
  if (engine.errors) {
    console.error(engine.errors)
    process.exit(1)
  }

  const engineJson = {
    read_only: {
      name: engine.name,
      type: engine.type,
      language: engine.language,
    }
  }

  engineJson.schema = await exportSchema(client, engineName);
  engineJson.synonyms = await exportSynonyms(client, engineName);
  engineJson.curations = await exportCurations(client, engineName);

  console.log(`Writing engine JSON to file ${options.outputJson}`);
  await fs.writeFile(options.outputJson, JSON.stringify(engineJson, undefined, 2));

  console.dir(engineJson);
}

async function exportSchema(client, engineName) {
  const schema = await client.app.getSchema({engine_name: engineName});
  if (schema.errors) {
    console.error(schema.errors);
    process.exit(1)
  }
  return schema;
}

async function exportSynonyms(client, engineName) {
  const synonyms = await client.app.listSynonymSets({engine_name: engineName});
  if (synonyms.errors) {
    console.error(synonyms.errors);
    process.exit(1)
  }
  if (synonyms.meta.page.total_pages > 1) {
    // TODO Handle paging
    console.warn("Only exporting first page of synonyms!");
  }
  return synonyms.results;
}

async function exportCurations(client, engineName) {
  const curations = await client.app.listCurations({engine_name: engineName});
  if (curations.errors) {
    console.error(curations.errors);
    process.exit(1)
  }
  if (curations.meta.page.total_pages > 1) {
    // TODO Handle paging
    console.warn("Only exporting first page of curations!");
  }
  return curations.results;
}

module.exports = exportAppSearchEngine;
