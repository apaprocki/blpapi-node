var util = require('util');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var Q = require('q');
var blpapi = require(path.join(__dirname, '/build/Debug/blpapijs'));

exports.Session = function(args) {
    this.session = new blpapi.Session(args);
    var that = this;
    this.session.emit = function() {
        that.emit.apply(that, arguments);
    };
    this.session.Q = Q;
};
util.inherits(exports.Session, EventEmitter);

exports.Session.prototype.start =
    function(cb) {
        return Q.nbind(this.session.start, this.session)
                ().nodeify(cb);
    }
exports.Session.prototype.authorize =
    function(uri, cid, cb) {
        return Q.nbind(this.session.authorize, this.session)
                (uri, cid).nodeify(cb);
    }
exports.Session.prototype.stop =
    function(cb) {
        return Q.nbind(this.session.stop, this.session)
                ().nodeify(cb);
    }
exports.Session.prototype.destroy =
    function() {
        return this.session.destroy();
    }
exports.Session.prototype.openService =
    function(uri, cb) {
        return Q.nbind(this.session.openService, this.session)
                (uri).nodeify(cb);
    }
exports.Session.prototype.subscribe =
    function(sub, label, cb) {
        return Q.nbind(this.session.subscribe, this.session)
                (sub, label).nodeify(cb);
    }
exports.Session.prototype.resubscribe =
    function(sub, label, cb) {
        return Q.nbind(this.session.resubscribe, this.session)
                (sub, label).nodeify(cb);
    }
exports.Session.prototype.unsubscribe =
    function(sub, label) {
        return this.session.unsubscribe(sub, label);
    }
exports.Session.prototype.request =
    function(uri, name, request, label, cb) {
        var current = Q.defer();
        var handle = {
            // When 'current' is set to 'undefined', it indicates that there are
            // no more responses and 'readResponse' should return 'undefined'.
            readResponse: function(cb) {
                return current ? current.promise : Q(undefined);
            }
        };
        this.session.request(uri, name, request, label,
            function(err, response) {
                if (err) {
                    current.reject(err);
                } else {
                    current.resolve(response);
                    current = response ? Q.defer() : undefined;
                }
            });
        return handle;
    }

// Local variables:
// c-basic-offset: 4
// tab-width: 4
// indent-tabs-mode: nil
// End:
//
// vi: set shiftwidth=4 tabstop=4 expandtab:
// :indentSize=4:tabSize=4:noTabs=true:

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
// ----------------------------- END-OF-FILE ----------------------------------
