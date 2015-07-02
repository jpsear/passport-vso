var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , http = require('http')
  , https = require('https')
  , VsoStrategy = require('passport-vso').Strategy;

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
    callbackURL: "https://localhost.azurewebsites.net/auth/vso/callback"
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

https.createServer({ pfx: fs.readFileSync(__dirname + '/certificate.pfx'), passphrase: 'Password' }, app).listen(443);

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


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

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
