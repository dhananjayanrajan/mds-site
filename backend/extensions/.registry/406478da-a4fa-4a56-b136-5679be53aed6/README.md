# Directus Extension – QR Code

A Directus extension that **generates a QR Code locally** from a given link and **automatically saves it in the Directus Files collection**.

![QR Code Preview](./assets/directus-extension-QRCode.png)

---

## 🧩 Description

This extension can be used inside a **Directus Flow** to create a QR Code without relying on any external service.  
It uses the [`qr-image`](https://github.com/alexeyten/qr-image) library to generate the QR Code directly on the server side.

The generated QR Code is stored in the `directus_files` collection, with both its filename and title derived from the provided link.

---

📦 **GitHub Repository:** [Tsuunen/directus-extension-QRCode](https://github.com/Tsuunen/directus-extension-QRCode)

---

MIT 2025
