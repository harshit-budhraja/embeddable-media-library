const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config({ path: path.join(__dirname, "sample.env") });

if (dotenv.error) {
    throw new Error(dotenv.error);
}
const { SERVER_PORT = 3000 } = dotenv.parsed;

const app = express();

app.use(cors());

// serve assets
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'prod.html'));
});

app.get('/stage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stage.html'));
});

app.get('/local/:port', (req, res) => {
    const port = String(req.params.port || '').trim();
    if (!/^\d+$/.test(port)) {
        return res.status(400).send('Invalid port');
    }

    // Runtime host override so a single local bundle works for any port.
    const ikHost = `http://localhost:${port}`;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    return res.send(`<!DOCTYPE html>
<html>
  <head>
    <title>ImageKit Media Library Widget (local ${port})</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/static/css/styles.css">
  </head>
  <body>
    <h1 class="text-center">ImageKit Media Library Widget (local ${port})</h1>
    <div class="wrapper">
      <div id="container"></div>
    </div>
  </body>

  <script>
    window.IK_MEDIA_LIBRARY_WIDGET_IK_HOST = ${JSON.stringify(ikHost)};
  </script>
  <script src="/static/imagekit-media-library-widget.min.js"></script>

  <script>
    var pluginOptions = {
      container: '#container',
      className: 'media-library-widget',
      dimensions: { height: '100%', width: '100%' },
      view: 'modal',
      renderOpenButton: true,
    };

    var mediaLibraryWidget = new IKMediaLibraryWidget(pluginOptions, (payload) => {
      console.log(payload);
    });
  </script>
</html>`);
});

app.listen(SERVER_PORT);
