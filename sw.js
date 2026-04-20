/**
 * HR 出勤紀錄系統 - 離線引擎 (v5 強制更新版)
 * 確保 GitHub Pages 資源 100% 預載。
 */

const CACHE_NAME = 'hr-attendance-v5';

// 必須與 index.html 引用資源完全一致
const ASSETS = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 1. 安裝：強制預載
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 開始快取 v5 最終版資源...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. 激活：立即接管並清除舊快取 (清除 v1~v4)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(() => self.clients.claim())
  );
});

// 3. 請求攔截：Cache First
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});