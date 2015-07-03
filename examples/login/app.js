var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var VsoStrategy = require('passport-vso').Strategy;

var VSO_CLIENT_ID = "B193AAA6-8D28-44C9-966B-FEC7F12B3AD6";
var VSO_CLIENT_SECRET = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im9PdmN6NU1fN3AtSGpJS2xGWHo5M3VfVjBabyJ9.eyJjaWQiOiJiMTkzYWFhNi04ZDI4LTQ0YzktOTY2Yi1mZWM3ZjEyYjNhZDYiLCJjc2kiOiI3ZTNjMjNmNy0zMGQ2LTQ3M2QtYjUwZS1kYzBjNjEzNjM4Y2EiLCJuYW1laWQiOiIyZGI3Nzg5ZS01ZjI3LTQxZjMtOWIzZS01ZDZkYWM5M2E4OTkiLCJpc3MiOiJhcHAudnNzcHMudmlzdWFsc3R1ZGlvLmNvbSIsImF1ZCI6ImFwcC52c3Nwcy52aXN1YWxzdHVkaW8uY29tIiwibmJmIjoxNDM1ODE2ODY5LCJleHAiOjE0NjczNTI4Njl9.PNMzKYQTg5_u36X17FKFXAEAE8y7jyDxWaqMthpk7Qfx3d1I3LC9iEtQ4EfX42EVItLrx1EYoNbV0vAkTyAaU61vZ3qrh-JIocEhl8Qh0zpyjGa6Ga-YKnOyC7cJgWzKltuiIjo81W8cPDW48dmiD3nMLxEVm951n6bajhskYg34w_03C6O9hJu27IeR98ekQpQsDsIk7av1ZPMp1Ir9AccsFtGO_iyjo1XLC3psEH-9yzIa8G4mjS4vxYiUFgyswp3ILe00G_iKu2Ux8eKa1pkjyOfPGhtgq8jRqk9pbgDF0RS1WlSLsKZKa4mcY6NIB3hmEKdTy5JPzygJHzpVzg";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Windows Live profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the VsoStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Windows Live
//   profile), and invoke a callback with a user object.
passport.use(new VsoStrategy({
    clientID: VSO_CLIENT_ID,
    clientSecret: VSO_CLIENT_SECRET,
    callbackURL: "https://localhost.net/auth/vso/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Windows Live profile is returned
      // to represent the logged-in user.  In a typical application, you would
      // want to associate the Windows Live account with a user record in your
      // database, and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/vso
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Windows Live authentication will involve
//   redirecting the user to live.com.  After authorization, Windows Live
//   will redirect the user back to this application at
//   /auth/vso/callback
app.get('/auth/vso',
  passport.authenticate('vso', { scope: ['profile'] }),
  function(req, res){
    // The request will be redirected to Windows Live for authentication, so
    // this function will not be called.
  });

// GET /auth/vso/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/vso/callback', 
  passport.authenticate('vso', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = app;
