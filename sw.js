/**
 * HR 出勤紀錄系統 - 離線引擎 (v7 真PWA版)
 * 功能：100% 預載資源，包含 manifest 描述檔，確保斷網環境完美運作。
 */

const CACHE_NAME = 'hr-attendance-v8.2';

// 必須與 index.html 引用資源完全一致，並加入 manifest.json
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. 安裝階段：強制預載最新資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 開始快取 v7 PWA 資源...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. 激活階段：立即接管並徹底清除舊快取 (v1~v6)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] 清理過期快取:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// 3. 請求攔截：斷網優先讀取快取 (Cache First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
