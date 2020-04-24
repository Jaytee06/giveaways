const path = require('path');
const express = require('express');
const httpError = require('http-errors');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';
if (config.frontend == 'react'){
  distDir ='../../node_modules/material-dashboard-react/dist'
 }else{
  distDir ='../../dist/' ;
 }

let sitemap;
app.get('/sitemap.xml', function(req, res) {
    // res.header('Content-Type', 'application/xml');
    // res.header('Content-Encoding', 'gzip');
    // // if we have a cached entry send it
    // if (sitemap) {
    //     res.send(sitemap)
    //     return
    // }
    //
    // try {
    //     const smStream = new SitemapStream({ hostname: config.serverURL });
    //     const pipeline = smStream.pipe(createGzip());
    //
    //     // pipe your entries or directly write them.
    //     smStream.write({ url: '/page-1/',  changefreq: 'daily', priority: 0.3 })
    //     smStream.write({ url: '/page-2/',  changefreq: 'monthly',  priority: 0.7 })
    //     smStream.write({ url: '/page-3/'})    // changefreq: 'weekly',  priority: 0.5
    //     smStream.write({ url: '/page-4/',   img: "http://urlTest.com" })
    //     smStream.end()
    //
    //     // cache the response
    //     streamToPromise(pipeline).then(sm => sitemap = sm)
    //     // stream write the response
    //     pipeline.pipe(res).on('error', (e) => {throw e})
    // } catch (e) {
    //     console.error(e)
    //     res.status(500).end()
    // }
    res.sendFile('../../sitemap.xml');
});

//
app.use(express.static(path.join(__dirname, distDir)));
app.use(/^((?!(api)).)*/, (req, res) => {
  res.sendFile(path.join(__dirname, distDir + '/index.html'));
});

 //React server
app.use(express.static(path.join(__dirname, '../../node_modules/material-dashboard-react/dist')));
app.use(/^((?!(api)).)*/, (req, res) => {
res.sendFile(path.join(__dirname, '../../dist/index.html'));
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app._router.stack.forEach(function(r){
    if (r.route && r.route.path){
        console.log(r.route.path);
    }
});

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(passport.initialize());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404);
  return next(err);
});

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

module.exports = app;
