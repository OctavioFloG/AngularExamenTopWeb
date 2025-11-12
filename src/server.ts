import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

// 📁 Carpeta del frontend compilado
const browserDistFolder = join(import.meta.dirname, '../browser');

// 🚀 Inicializa Express y Angular SSR engine
const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
  })
);

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://cetech.roque.tecnm.mx/api',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api': '/api' },
    on: {
      proxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'https://cetech.roque.tecnm.mx');
      },
      proxyRes: (proxyRes, req) => {
        console.log(`➡️ [Proxy] ${req.method} ${req.url} → ${proxyRes.statusCode}`);
      },
      error: (err, req) => {
        console.error(`❌ [Proxy Error] ${req.method} ${req.url}: ${err.message}`);
      },
    },
  })
);

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4001;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`✅ SSR corriendo en http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
