self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};

    const title = data.title || "Notification";
    const body = data.body || "You have a new message";

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: "/icon.png", // optional
        })
    );
});

