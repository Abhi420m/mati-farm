/**
 * ============================================================================
 * MATI FARM™ - INDEPENDENT STANDALONE E-COMMERCE & WHOLESALE SERVER
 * ============================================================================
 * Brand: Mati Farm™ Earthenware Pvt. Ltd.
 * Domain: matifarm.com
 * Products: Artisanal Terracotta Earthenware, Sacred Diyas & Commercial Chai Kulhads
 * Default Port: 4000 (Independent of other services)
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 4000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Security & Cross-Origin Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname || '/';

  // Normalize root path
  if (pathname === '/' || pathname === '/index.html' || pathname === '/mati-farm' || pathname === '/mati-farm.html') {
    pathname = '/index.html';
  }

  // API Route: Order Placement Endpoint
  if (req.method === 'POST' && pathname === '/api/orders') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const orderData = JSON.parse(body || '{}');
        const orderId = 'MF-' + Math.floor(100000 + Math.random() * 900000);
        console.log(`[MATI FARM ORDER] New order received: ${orderId} by ${orderData.name || 'Anonymous'}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          orderId: orderId,
          message: 'Order registered successfully with Mati Farm Kiln Logistics Hub.',
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload' }));
      }
    });
    return;
  }

  // API Route: Wholesale Inquiry Endpoint
  if (req.method === 'POST' && pathname === '/api/wholesale-inquiry') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const inquiryData = JSON.parse(body || '{}');
        console.log(`[MATI FARM B2B] Inquiry from ${inquiryData.company || 'Enterprise'} (${inquiryData.officer || 'Officer'})`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Commercial inquiry received. Mati Farm Institutional Logistics will contact within 2 hours.',
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Malformed inquiry payload' }));
      }
    });
    return;
  }

  // Static File Serving
  const safePath = path.normalize(path.join(BASE_DIR, pathname));
  if (!safePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA-style routing
      const indexPath = path.join(BASE_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found - Mati Farm Earthenware');
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache, must-revalidate' : 'public, max-age=86400'
    });
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ========================================================================
     🏺 MATI FARM™ - ARTISANAL EARTHENWARE & TABLEWARE PLATFORM
  ========================================================================
     Status       : ACTIVE & INDEPENDENT
     Local URL    : http://localhost:${PORT}/
     Network URL  : http://127.0.0.1:${PORT}/
     Architecture : Standalone D2C Retail & B2B Wholesale Marketplace
     Environment  : Production Ready
  ========================================================================
  `);
});
