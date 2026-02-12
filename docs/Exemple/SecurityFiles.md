17. Validate the sender of all IPC messages
You should always validate incoming IPC messages sender property to ensure you aren't performing actions or sending information to untrusted renderers.

Why?
All Web Frames can in theory send IPC messages to the main process, including iframes and child windows in some scenarios. If you have an IPC message that returns user data to the sender via event.reply or performs privileged actions that the renderer can't natively, you should ensure you aren't listening to third party web frames.

You should be validating the sender of all IPC messages by default.

How?
main.js (Main Process)
// Bad
ipcMain.handle('get-secrets', () => {
  return getSecrets()
})

// Good
ipcMain.handle('get-secrets', (e) => {
  if (!validateSender(e.senderFrame)) return null
  return getSecrets()
})

function validateSender (frame) {
  // Value the host of the URL using an actual URL parser and an allowlist
  if ((new URL(frame.url)).host === 'electronjs.org') return true
  return false
}

18. Avoid usage of the file:// protocol and prefer usage of custom protocols
You should serve local pages from a custom protocol instead of the file:// protocol.

Why?
The file:// protocol gets more privileges in Electron than in a web browser and even in browsers it is treated differently to http/https URLs. Using a custom protocol allows you to be more aligned with classic web url behavior while retaining even more control about what can be loaded and when.

Pages running on file:// have unilateral access to every file on your machine meaning that XSS issues can be used to load arbitrary files from the users machine. Using a custom protocol prevents issues like this as you can limit the protocol to only serving a specific set of files.

How?
Follow the protocol.handle examples to learn how to serve files / content from a custom protocol.


---

Here is how to use protocol in the right way for files:

Register a custom protocol and intercept existing protocol requests.

Process: Main

An example of implementing a protocol that has the same effect as the file:// protocol:

```javascript
const { app, protocol, net } = require('electron')

const path = require('node:path')
const url = require('node:url')

app.whenReady().then(() => {
  protocol.handle('atom', (request) => {
    const filePath = request.url.slice('atom://'.length)
    return net.fetch(url.pathToFileURL(path.join(__dirname, filePath)).toString())
  })
})
```
note
All methods unless specified can only be used after the ready event of the app module gets emitted.

Using protocol with a custom partition or session
A protocol is registered to a specific Electron session object. If you don't specify a session, then your protocol will be applied to the default session that Electron uses. However, if you define a partition or session on your browserWindow's webPreferences, then that window will use a different session and your custom protocol will not work if you just use electron.protocol.XXX.

To have your custom protocol work in combination with a custom session, you need to register it to that session explicitly.

const { app, BrowserWindow, net, protocol, session } = require('electron')

const path = require('node:path')
const url = require('node:url')

app.whenReady().then(() => {
  const partition = 'persist:example'
  const ses = session.fromPartition(partition)

  ses.protocol.handle('atom', (request) => {
    const filePath = request.url.slice('atom://'.length)
    return net.fetch(url.pathToFileURL(path.resolve(__dirname, filePath)).toString())
  })

  const mainWindow = new BrowserWindow({ webPreferences: { partition } })
})

Methods
The protocol module has the following methods:

protocol.registerSchemesAsPrivileged(customSchemes)
customSchemes CustomScheme[]
note
This method can only be used before the ready event of the app module gets emitted and can be called only once.

Registers the scheme as standard, secure, bypasses content security policy for resources, allows registering ServiceWorker, supports fetch API, streaming video/audio, and V8 code cache. Specify a privilege with the value of true to enable the capability.

An example of registering a privileged scheme, that bypasses Content Security Policy:

const { protocol } = require('electron')

protocol.registerSchemesAsPrivileged([
  { scheme: 'foo', privileges: { bypassCSP: true } }
])

A standard scheme adheres to what RFC 3986 calls generic URI syntax. For example http and https are standard schemes, while file is not.

Registering a scheme as standard allows relative and absolute resources to be resolved correctly when served. Otherwise the scheme will behave like the file protocol, but without the ability to resolve relative URLs.

For example when you load following page with custom protocol without registering it as standard scheme, the image will not be loaded because non-standard schemes can not recognize relative URLs:

<body>
  <img src='test.png'>
</body>

Registering a scheme as standard will allow access to files through the FileSystem API. Otherwise the renderer will throw a security error for the scheme.

By default web storage apis (localStorage, sessionStorage, webSQL, indexedDB, cookies) are disabled for non standard schemes. So in general if you want to register a custom protocol to replace the http protocol, you have to register it as a standard scheme.

Protocols that use streams (http and stream protocols) should set stream: true. The <video> and <audio> HTML elements expect protocols to buffer their responses by default. The stream flag configures those elements to correctly expect streaming responses.

protocol.handle(scheme, handler)
scheme string - scheme to handle, for example https or my-app. This is the bit before the : in a URL.
handler Function<GlobalResponse | Promise<GlobalResponse>>
request GlobalRequest
Register a protocol handler for scheme. Requests made to URLs with this scheme will delegate to this handler to determine what response should be sent.

Either a Response or a Promise<Response> can be returned.

Example:

const { app, net, protocol } = require('electron')

const path = require('node:path')
const { pathToFileURL } = require('node:url')

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true
    }
  }
])

app.whenReady().then(() => {
  protocol.handle('app', (req) => {
    const { host, pathname } = new URL(req.url)
    if (host === 'bundle') {
      if (pathname === '/') {
        return new Response('<h1>hello, world</h1>', {
          headers: { 'content-type': 'text/html' }
        })
      }
      // NB, this checks for paths that escape the bundle, e.g.
      // app://bundle/../../secret_file.txt
      const pathToServe = path.resolve(__dirname, pathname)
      const relativePath = path.relative(__dirname, pathToServe)
      const isSafe = relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
      if (!isSafe) {
        return new Response('bad', {
          status: 400,
          headers: { 'content-type': 'text/html' }
        })
      }

      return net.fetch(pathToFileURL(pathToServe).toString())
    } else if (host === 'api') {
      return net.fetch('https://api.my-server.com/' + pathname, {
        method: req.method,
        headers: req.headers,
        body: req.body
      })
    }
  })
})


See the MDN docs for Request and Response for more details.

protocol.unhandle(scheme)
scheme string - scheme for which to remove the handler.
Removes a protocol handler registered with protocol.handle.

protocol.isProtocolHandled(scheme)
scheme string
Returns boolean - Whether scheme is already handled.