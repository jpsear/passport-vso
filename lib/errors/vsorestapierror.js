/**
 * `VsoRestApiError` error.
 *
 * References:
 *   - http://msdn.microsoft.com/en-us/library/live/hh243648.aspx#error
 *
 * @constructor
 * @param {String} [message]
 * @param {String} [code]
 * @api public
 */
function VsoRestApiError(message, code) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'VsoRestApiError';
  this.message = message;
  this.code = code;
}

/**
 * Inherit from `Error`.
 */
VsoRestApiError.prototype.__proto__ = Error.prototype;


/**
 * Expose `LiveConnectAPIError`.
 */
module.exports = VsoRestApiError;
