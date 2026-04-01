const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "KinéGest",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadFile("index.html");
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});