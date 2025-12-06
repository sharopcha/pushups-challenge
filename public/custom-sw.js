self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    // ignore malformed payload
  }

  const title = data.title || "Push-Up Challenge";
  const body = data.body || "New activity";
  const url = data.url || "/dashboard";

  const options = {
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      const existing = allClients.find((client) =>
        client.url.includes(self.location.origin)
      );
      if (existing) {
        existing.focus();
        existing.navigate(url);
      } else {
        clients.openWindow(url);
      }
    })()
  );
});
