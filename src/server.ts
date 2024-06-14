import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { minify } from 'html-minifier-terser';

const app = express();
const PORT = process.env.PORT || 3000;
const routesDir = path.join(__dirname, 'routes');
const staticDir = path.join(__dirname, 'static');

// Function to compress HTML content
const compressHTML = async (htmlContent: string): Promise<string> => {
  return await minify(htmlContent, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });
};

// Dynamically load and set up routes
const setupRoutes = () => {
  fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('.html')) {
      const routePath = `/${path.basename(file, '.html')}`;
      app.get(routePath, async (req: Request, res: Response) => {
        const filePath = path.join(routesDir, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const compressedContent = await compressHTML(htmlContent);
        res.send(compressedContent);
      });
    }
  });
};

// Middleware to watch for new HTML files and update routes
app.use((req, res, next) => {
  setupRoutes();
  next();
});

// Serve static files for CSS and images
app.use('/static', express.static(staticDir));

// Serve the routes directory statically (for adding new HTML files)
app.use('/routes', express.static(routesDir));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

