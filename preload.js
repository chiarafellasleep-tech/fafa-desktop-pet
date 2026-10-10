const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  move: (x, y) => ipcRenderer.send('pet:move', { x, y }),
  quit: () => ipcRenderer.send('pet:quit')
});
