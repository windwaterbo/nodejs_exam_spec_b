import Router from '@koa/router';
import fs from 'fs';
import path from 'path';
import swaggerSpec from './spec';

const swaggerRouter = new Router({ prefix: '/swagger' });

// Swagger 主 UI 页面
swaggerRouter.get('/', (ctx) => {
  const swaggerUiPath = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist', 'index.html');
  
  if (!fs.existsSync(swaggerUiPath)) {
    ctx.status = 404;
    ctx.body = 'Swagger UI not found. Please run: npm install';
    return;
  }

  let html = fs.readFileSync(swaggerUiPath, 'utf-8');
  // 替换 Swagger URL 指向我们的 API spec
  html = html.replace(
    'https://petstore.swagger.io/v2/swagger.json',
    '/swagger/spec.json'
  );
  
  // 修改相对路径为绝对路径，这样静态资源能够被正确加载
  html = html.replace(/href="\.\//g, 'href="/swagger/assets/');
  html = html.replace(/src="\.\//g, 'src="/swagger/assets/');
  
  ctx.type = 'text/html; charset=utf-8';
  ctx.body = html;
});

// OpenAPI JSON spec 端点
swaggerRouter.get('/spec.json', (ctx) => {
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = swaggerSpec;
});

// 自定义的 swagger-initializer.js (覆盖默认的)
swaggerRouter.get('/assets/swagger-initializer.js', (ctx) => {
  const initializerContent = `
window.onload = function() {
  // 禁用默认的 try-it-out 功能（可选）
  // 但为了方便测试，我们保留它
  
  const ui = SwaggerUIBundle({
    url: "/swagger/spec.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    persistAuthorization: true
  });
  
  window.ui = ui;
}
  `.trim();
  
  ctx.type = 'application/javascript; charset=utf-8';
  ctx.body = initializerContent;
});

// 提供 Swagger UI 静态资源 (CSS, JS, PNG 等)
swaggerRouter.get('/assets/:file+', (ctx) => {
  const fileName = ctx.params.file;
  
  // 跳过我们自定义的 swagger-initializer.js
  if (fileName === 'swagger-initializer.js') {
    return;
  }
  
  const swaggerUiPath = path.join(process.cwd(), 'node_modules', 'swagger-ui-dist', fileName);
  
  // 安全检查：确保请求的文件在 swagger-ui-dist 目录内
  const normalizedPath = path.normalize(swaggerUiPath);
  const swaggerUiBase = path.normalize(path.join(process.cwd(), 'node_modules', 'swagger-ui-dist'));
  
  if (!normalizedPath.startsWith(swaggerUiBase)) {
    ctx.status = 403;
    ctx.body = 'Forbidden';
    return;
  }

  if (!fs.existsSync(swaggerUiPath)) {
    ctx.status = 404;
    ctx.body = `File not found: ${fileName}`;
    return;
  }

  // 根据文件扩展名设置正确的内容类型
  const ext = path.extname(fileName).toLowerCase();
  const contentTypes: { [key: string]: string } = {
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
  };

  ctx.type = contentTypes[ext] || 'text/plain';
  ctx.body = fs.readFileSync(swaggerUiPath);
});

export default swaggerRouter;
