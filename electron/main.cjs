const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('path');

// Performance flags: disable background timer throttling, enable hardware acceleration
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('force_high_performance_gpu');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    title: 'Estación Versalles',
    backgroundColor: '#020b18',
    show: false, // Prevents white flash on startup
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      backgroundThrottling: false,
      spellcheck: false,
    },
    icon: path.join(__dirname, '..', 'public', 'assets', 'logo.jpeg'),
  });

  // Remove menu bar completely for full retro immersion
  Menu.setApplicationMenu(null);

  // Load the built application
  const distIndexPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(distIndexPath);

  // Show only when rendered to avoid flicker
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Single instance lock (prevent multiple concurrent game windows)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
