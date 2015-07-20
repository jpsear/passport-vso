# passport-vso


[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Visual Studio Online](http://www.visualstudio.com/) accounts using the OAuth 2.0 API.

This module lets you authenticate using Visual Studio Online in your Node.js 
applications. Visual Studio Online authentication can be easily and unobtrusively
integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-vso

## Usage

#### Configure Strategy

The Visual Studio Online authentication strategy authenticates users using a VSO
account and OAuth 2.0 JWT bearer tokens.  The strategy requires a `verify` callback,
which accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new VsoOAuth2Strategy({
        clientID: VSO_CLIENT_ID,
        clientSecret: VSO_CLIENT_SECRET,
        callbackURL: "http://www.example.com/auth/vso/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ vsoId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'vso'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/vso',
      passport.authenticate('vso', { scope: ['wl.signin', 'wl.basic'] }));

    app.get('/auth/vso/callback', 
      passport.authenticate('vso', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/hallipr/passport-vso/tree/master/examples/login).

## Tests

    $ npm install
    $ npm test

## Credits

  - [Patrick Hallisey](http://github.com/hallipr)
  - Mickey Mullin
  
Forked from [passport-windowslive](https://github.com/jaredhanson/passport-windowslive) by [Jared Hanson](https://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Patrick Hallisey
