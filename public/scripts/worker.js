self.addEventListener('push', e => {
    console.log("Push event received!");
    const options = {
        body: 'Test notification body',
        icon: 'http://example.com/images/icon.png',
    };
    e.waitUntil(
        self.registration.showNotification('Test Notification', options)
    );
});