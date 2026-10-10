const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('node:path');

let petWindow;

function createPetWindow() {
  const display = screen.getPrimaryDisplay().workArea;
  petWindow = new BrowserWindow({
    width: 300,
    height: 350,
    x: display.x + display.width - 340,
    y: display.y + display.height - 390,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  petWindow.setAlwaysOnTop(true, 'floating');
  petWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  ipcMain.on('pet:quit', () => app.quit());
  ipcMain.on('pet:move', (event, position) => {
    if (event.sender !== petWindow?.webContents) return;
    const { x, y } = position || {};
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const bounds = screen.getDisplayNearestPoint({ x, y }).workArea;
    const [width, height] = petWindow.getSize();
    petWindow.setPosition(
      Math.max(bounds.x, Math.min(Math.round(x), bounds.x + bounds.width - width)),
      Math.max(bounds.y, Math.min(Math.round(y), bounds.y + bounds.height - height))
    );
  });
  createPetWindow();
});

app.on('window-all-closed', () => app.quit());
