
(() => {
  // Add the EDUNEXA app manifest to the page.
  if (!document.querySelector('link[rel="manifest"]')) {
    const manifest = document.createElement("link");
    manifest.rel = "manifest";
    manifest.href = "./manifest.json";
    document.head.appendChild(manifest);
  }

  // Set the app's browser theme colour.
  let theme = document.querySelector('meta[name="theme-color"]');

  if (!theme) {
    theme = document.createElement("meta");
    theme.name = "theme-color";
    document.head.appendChild(theme);
  }

  theme.content = "#073d2b";

  // Register offline support.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js")
        .catch(error => {
          console.error("EDUNEXA offline setup:", error);
        });
    });
  }
})();
