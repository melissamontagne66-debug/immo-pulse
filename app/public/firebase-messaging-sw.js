// MOD-29 — Service worker Firebase Cloud Messaging.
// Reçoit les notifications push en arrière-plan et les affiche.
// La config Firebase est injectée par le client via les valeurs ci-dessous
// (remplacées manuellement lors de la mise en place du compte Firebase,
// ou laissées telles quelles : le SW reste inerte sans config valide).

/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Ces valeurs sont publiques par nature (clés web Firebase, visibles côté client).
const firebaseConfig = {
  apiKey: self.FIREBASE_API_KEY || '',
  authDomain: self.FIREBASE_AUTH_DOMAIN || '',
  projectId: self.FIREBASE_PROJECT_ID || '',
  storageBucket: self.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: self.FIREBASE_APP_ID || '',
};

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Message reçu alors que l'app est en arrière-plan / fermée
  messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || 'Immo Pulse';
    const options = {
      body: payload.notification?.body || '',
      icon: '/favicon.ico',
      data: payload.data || {},
    };
    self.registration.showNotification(title, options);
  });
}

// Clic sur la notification → focus sur l'app si ouverte, sinon ouverture.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow('./');
    })
  );
});
