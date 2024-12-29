import 'zone.js/node'; // Required for Angular Universal
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import * as cors from 'cors'; // Import the CORS middleware
import { join } from 'path';
import { AppServerModule } from './src/main.server';
import { AppServerModuleNgFactory } from './src/main.server.ngfactory';

// Enable production mode for faster rendering
enableProdMode();

const app = express();
const distFolder = join(process.cwd(), 'dist/my-angular-ssr-app/browser');

// Enable CORS for all origins (you can restrict this if needed)
app.use(cors());

// Use Angular Universal's express engine
app.engine(
  'html',
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  })
);

app.set('view engine', 'html');
app.set('views', distFolder);

// Serve static files from /browser
app.get('*.*', express.static(distFolder));

// All regular routes use the Universal engine
app.all('*', (req, res) => {
  res.render('index', { req });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Node server listening on http://localhost:${port}`);
});
