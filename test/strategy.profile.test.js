/* global describe, it, expect, before */
/* jshint expr: true, multistr: true */

var VsoStrategy = require('../lib/strategy');
var fs = require('fs');


describe('Strategy#userProfile', function() {
    
  var strategy =  new VsoStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
  
  // mock
  strategy._oauth2.get = function(url, accessToken, callback) {
    if (url != 'https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=1.0') { return callback(new Error('wrong url argument')); }
    if (accessToken != 'token') { return callback(new Error('wrong token argument')); }
    
    return fs.readFile('test/data/example.json', 'utf8', function(err, data) {
      return callback(err, data);
    });
  };
    
  describe('loading profile', function() {
    var profile;
    
    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if (err) { return done(err); }
        profile = p;
        done();
      });
    });
    
    it('should parse profile', function() {
      expect(profile.provider).to.equal('vso');
      
      expect(profile.id).to.equal('a1778743-90ef-4a3a-94be-25890febe65a');
      expect(profile.username).to.equal('6e993fd4-194e-43e1-8073-3c0899bd7769');
      expect(profile.displayName).to.equal('Roberto Tamburello');
      
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('Roberto@contoso.com');
      expect(profile.emails[0].type).to.equal('account');
      expect(profile.emails[0].primary).to.be.true;
    });
    
    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });
    
    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });
  });
  
  describe('encountering an error', function() {
    var err, profile;
    
    before(function(done) {
      strategy.userProfile('wrong-token', function(e, p) {
        err = e;
        profile = p;
        done();
      });
    });
    
    it('should error', function() {
      expect(err).to.be.an.instanceOf(Error);
      expect(err.constructor.name).to.equal('InternalOAuthError');
      expect(err.message).to.equal('Failed to fetch user profile');
    });
    
    it('should not load profile', function() {
      expect(profile).to.be.undefined;
    });
  });
  
});
