import { writeFile, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { yellow } from './node_modules/colors/index.d';
// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';
// Load node modules
const colors = require('colors');
require('dotenv').config();

// Ensure that the environments directory exists
const envDir = dirname(targetPath);
if (!existsSync(envDir)) {
  console.log(colors.cyan(`Creating directory: ${envDir}`));
  mkdirSync(envDir, { recursive: true });
}

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: ${process.env['PRODUCTION']},
   apiUrl: '${process.env['API_URL']}',
   actualizeUrl: '${process.env['ACTUALIZE_URL']}',
   authUrl: '${process.env['AUTH_URL']}',
   reportsUrl: '${process.env['REPORTS_URL']}',
   favicon: '${process.env['FAVICON']}',
   isWeeklyReportsByDefault: ${
     process.env['IS_WEEKLY_REPORTS_BY_DEFAULT'] === 'true' ? true : false
   },
   authBot: '${process.env['AUTH_BOT']}',
   isMainServer: ${process.env['IS_MAIN_SERVER'] === 'true' ? true : false},
   siteTitle: '${process.env['SITE_TITLE'] || 'CryptoMasterSite'}',
};
`;
console.log(
  colors.magenta(
    'The file `environment.ts` will be written with the following content: \n'
  )
);
console.log(colors.grey(envConfigFile));
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      colors.magenta(
        `Angular environment.ts file generated correctly at ${targetPath} \n`
      )
    );
  }
});
writeFile(targetPathProd, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(
      colors.yellow(
        `Angular environment.prod.ts file generated correctly at ${targetPathProd} \n`
      )
    );
  }
});
