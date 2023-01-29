const { program } = require('commander');
const fetch = require('node-fetch');
const exportAppSearchEngine = require('./export-app-search-engine');
const importAppSearchEngine = require('./import-app-seach-engine');

async function main() {

  program
    .name('entsporter')
    .description('CLI to import and export Elastic App Search engine settings')
    .version('1.0.0');

  program.command('export-app-search-engine')
    .description('Export an App Search engine as JSON')
    .argument('<engine-name>', 'Name of the App Search engine to export')
    .requiredOption('--app-search-endpoint <value>', 'Must specify an App Search server endpoint, e.g. http://localhost:3002')
    .requiredOption('--app-search-private-key <value>', 'Must specify an App Search private key')
    .requiredOption('--output-json <value>', 'File to output the exported engine settings as JSON')
    .action((engineName, options, command) => {
      exportAppSearchEngine(engineName, options)
    });

  program.command('import-app-search-engine')
    .description("Import an App Search engine's settings from JSON into a new engine.")
    .argument('<engine-name>', 'Name of a new App Search engine to create with the specified engine settings')
    .requiredOption('--app-search-endpoint <value>', 'Must specify an App Search server endpoint, e.g. http://localhost:3002')
    .requiredOption('--app-search-private-key <value>', 'Must specify an App Search private key')
    .requiredOption('--input-json <value>', 'File containing exported engine settings JSON')
    .action((engineName, options, command) => {
      importAppSearchEngine(engineName, options)
    });

  await program.parseAsync(process.argv);
}


main();
