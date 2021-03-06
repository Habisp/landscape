var express = require('express'),
    resmin = require('resmin'),
    app = express.createServer(),
    pubDir = __dirname + '/public';

try {
  var landscape = require('landscape');
} catch(e) {
  var landscape = require('../');
}
	
var resminConfig = {
    minify: true,
    gzip: true,
    merge: true,
    js: {
      jquery: [
        "//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"
      ],
      landscape: [
        "/bootstrap/js/bootstrap-transition.js",
        "/bootstrap/js/bootstrap-alert.js",
        "/bootstrap/js/bootstrap-modal.js",
        "/bootstrap/js/bootstrap-dropdown.js",
        "/bootstrap/js/bootstrap-scrollspy.js",
        "/bootstrap/js/bootstrap-tab.js",
        "/bootstrap/js/bootstrap-tooltip.js",
        "/bootstrap/js/bootstrap-popover.js",
        "/bootstrap/js/bootstrap-button.js",
        "/bootstrap/js/bootstrap-collapse.js",
        "/bootstrap/js/bootstrap-carousel.js",
        "/bootstrap/js/bootstrap-typeahead.js",
      ],
      app: [
        //"/js/prettify.js",
        "/js/application.js"
      ]
    },
    css: {
      all: [],
      landscape: [
        "/themes/bootstrap/theme.styl"
      ],
      app: [
        "/css/prettify.css"
      ]
    },
    stylus: function(style) {
      style.use(landscape());
    }
};

// Configure
app.configure(function(){
  app.set('view engine', 	'jade');
  app.set('view options', { layout: false });
  app.set('views', 		__dirname + '/views');
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

// Development
app.configure('development', function(){
  resminConfig.merge = false;
  resminConfig.gzip = false;
  resminConfig.minify = false;
  app.use(resmin.middleware(express, pubDir, resminConfig));
  app.use(express.static(pubDir));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Production
app.configure('production', function(){
  app.use(resmin.middleware(express, pubDir, resminConfig));
  var oneYear = 31557600000;
  app.use(express.static(pubDir, { maxAge: oneYear }));
  app.use(express.errorHandler()); 
});

// Register resmin dynamic helper
app.dynamicHelpers(resmin.dynamicHelper);

// Routes
app.get('/', function(req, res){
  res.render('index');
});

app.get('/scaffolding.html', function(req, res){
  var context = { xhr: req.xhr };
  res.render('scaffolding', context);
});

app.get('/base-css.html', function(req, res){
  var context = { xhr: req.xhr };
  res.render('base-css', context);
});

app.get('/components.html', function(req, res){
  var context = { xhr: req.xhr };
  res.render('components', context);
});

app.get('/javascript.html', function(req, res){
  var context = { xhr: req.xhr };
  res.render('javascript', context);
});

app.get('/stylus.html', function(req, res){
  var context = { xhr: req.xhr };
  res.render('stylus', context);
});

// Let's listen
app.listen(3000);