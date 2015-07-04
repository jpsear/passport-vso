/* global describe, it, expect */
/* jshint expr: true */

var VsoStrategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new VsoStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    },
    function() {});
    
  it('should be named vso', function() {
    expect(strategy.name).to.equal('vso');
  });
  
});
