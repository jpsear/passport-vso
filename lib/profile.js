/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }
  
  var profile = {};
  profile.id = json.id;
  profile.username = json.publicAlias;
  profile.displayName = json.displayName;
  
  if (json.emailAddress)
    profile.emails = [{ value: json.emailAddress, type: 'account', primary: true }];
  
  profile.photos = [{
    value: 'https://apis.live.net/v5.0/' + json.id + '/picture'
  }];
  
  return profile;
};
