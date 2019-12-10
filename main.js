const electron = require('electron')
// Module to control application life.
const {
  app,
  ipcMain,
  protocol,
  session,
} = electron
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
    },
  })
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.maximize()
    // mainWindow.webContents.send('net-message', {
    //   message: "a network event message.",
    //   protocol,
    //   session,
    // })
    // session.defaultSession.webRequest.onCompleted((details) => {
    //   mainWindow.webContents.send('net-message', { details })
    // })
    
    session.defaultSession.webRequest.onCompleted((details) => {
      const { url } = details
      mainWindow.webContents.send('net-message', details)
      if (url.includes('risk/control')) {
        mainWindow.webContents.send('risk-completed', { url })
        return
      }
      if (url.includes('web/cstm')) {
        mainWindow.webContents.send('cstm-completed', { url })
        return
      }
    })
    // session.defaultSession.webRequest.onCompleted(
    //   {
    //     urls: ['*r.png*']
    //     // "https://arms-retcode.aliyuncs.com/r.png?t=perf&times=1&page=c2c.huobi.co%2Fzh-cn%2Flogin&tag=&begin=1560951364159&dns=308&tcp=173&ssl=496&ttfb=248&trans=5&dom=306&res=611&firstbyte=730&fpt=749&tti=1055&ready=1634&load=2245&ct=4g&bandwidth=-1&navtype=Other&fmp=3335&sr=1536x864&vp=642x782&uid=9Fjyjwddzm56aU29j529vv549k6h&pid=botwexdz8t%402cf0b89f3ab1f97&_v=1.5.5&sid=g8j9Cx3t361a4e5jI0R8lyezCdz2&sampling=1&z=jx3a50m0"
    //   },
    //   (details) => {
    //     mainWindow.webContents.send('rpng-completed', { details })
    //   }
    // )
    // session.defaultSession.webRequest.onCompleted(
    //   {
    //     url: '*web/cstm*',
    //   },
    //   (details) => {
    //     mainWindow.webContents.send('cstm-completed', { details })
    //   }
    // )
    
    protocol.registerHttpProtocol('http', (request, callback) => {
      callback(request)
      // mainWindow.webContents.send('http-net-message', { request })
      mainWindow.webContents.executeJavaScript(`console.log("${JSON.stringify(request)}")`)
    })
  })

  setTimeout(() => {
    // ipcMain.
  }, 1000)

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
