
(() => {
  "use strict";

  // Register the EDUNEXA app manifest.
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "./manifest.json";
    document.head.appendChild(link);
  }

  // Set browser theme.
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
        .catch(error => console.error("EDUNEXA service worker:", error));
    });
  }

  // Check whether EDUNEXA is already installed.
  const isInstalled = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isInstalled()) return;

  let installPrompt = null;

  // Create installation button.
  const button = document.createElement("button");
  button.id = "edunexaInstallButton";
  button.type = "button";
  button.textContent = "⬇ Install EDUNEXA";

  Object.assign(button.style, {
    position: "fixed",
    right: "16px",
    bottom: "18px",
    zIndex: "99999",
    background: "#073d2b",
    color: "#ffffff",
    border: "2px solid #d6ad50",
    borderRadius: "30px",
    padding: "13px 19px",
    fontSize: "14px",
    fontWeight: "800",
    boxShadow: "0 5px 20px rgba(0,0,0,.22)",
    cursor: "pointer"
  });

  // Create installation instructions.
  const overlay = document.createElement("div");
  overlay.id = "edunexaInstallHelp";

  Object.assign(overlay.style, {
    display: "none",
    position: "fixed",
    inset: "0",
    zIndex: "100000",
    background: "rgba(0,0,0,.65)",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  });

  const panel = document.createElement("div");

  Object.assign(panel.style, {
    background: "#ffffff",
    color: "#17251e",
    width: "100%",
    maxWidth: "380px",
    borderRadius: "17px",
    padding: "25px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6"
  });

  const title = document.createElement("h2");
  title.textContent = "Install EDUNEXA";
  title.style.color = "#073d2b";

  const instructions = document.createElement("p");
  instructions.style.fontSize = "14px";
  instructions.style.margin = "15px 0";

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";

  Object.assign(close.style, {
    background: "#073d2b",
    color: "white",
    border: "0",
    borderRadius: "8px",
    padding: "11px 22px",
    fontWeight: "bold",
    cursor: "pointer"
  });

  panel.append(title, instructions, close);
  overlay.appendChild(panel);

  function showHelp(message) {
    instructions.textContent = message;
    overlay.style.display = "flex";
  }

  close.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", event => {
    if (event.target === overlay) {
      overlay.style.display = "none";
    }
  });

  // Show installation button.
  function addControls() {
    if (!document.body.contains(button)) {
      document.body.append(button, overlay);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addControls);
  } else {
    addControls();
  }

  // Listen for Android Chrome installation readiness.
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    button.textContent = "⬇ Install EDUNEXA";
  });

  // Handle installation button.
  button.addEventListener("click", async () => {
    if (installPrompt) {
      installPrompt.prompt();

      const result = await installPrompt.userChoice;
      installPrompt = null;

      if (result.outcome === "accepted") {
        button.remove();
      }

      return;
    }

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isIOS) {
      showHelp(
        "To install EDUNEXA on your iPhone or iPad: open this website in Safari, tap the Share button, choose Add to Home Screen, then tap Add."
      );
    } else {
      showHelp(
        "To install EDUNEXA, open this website in Chrome, tap the three-dot menu in the top-right corner, then choose Install app or Add to Home screen if available."
      );
    }
  });

  // Hide the button after successful installation.
  window.addEventListener("appinstalled", () => {
    button.remove();
    installPrompt = null;
  });
})();
    
