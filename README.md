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
account and OAuth 2.0 JWT bearer tokens.  

The strategy is constructed with 2 parameters
``` javascript
    new VsoOAuth2Strategy(options, verify)
```

Applications must supply a `verify` callback, for which the function signature is:
``` javascript
    function([req], accessToken, refreshToken, [params], profile, done) { ... }
````

The use of the req argument is controlled by the option 
 
The verify callback is responsible for finding or creating the user, and invoking `done` with the following arguments:
``` javascript
    done(err, user, info);
```

`user` should be set to `false` to indicate an authentication failure.

Additional `info` can optionally be passed as a third argument, typically
used to display informational messages.  If an exception occured, `err`
should be set.
 
Options:
- `authorizationURL`  URL used to obtain an authorization grant (default: VSO auth url)
- `tokenURL`          URL used to obtain an access token (default: VSO token url)
- `profileURL`        URL used to obtain a user profile (default: VSO user profile url)
- `sessionKey`        key used to store auth info on session (default: 'vso:' + authorizationURL hostname)
- `clientID`          identifies client to service provider
- `clientSecret`      secret used to establish ownership of the client identifer
- `callbackURL`       URL to which the service provider will redirect the user after obtaining authorization
- `passReqToCallback` when `true`, `req` is the first argument to the verify callback (default: `false`)

```javascript
    passport.use(
        new VsoOAuth2Strategy({
                clientID: VSO_CLIENT_ID,
                clientSecret: VSO_CLIENT_SECRET,
                callbackURL: "http://www.example.com/auth/vso/callback",
                passReqToCallback: true
            },
            function(req, accessToken, refreshToken, params, profile, done) {
                // token expiration info available from params.expires_in
                User.findOrCreate({ vsoId: profile.id }, function (err, user) {
                    return done(err, user);
                });
            }
        )
    );
```
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
