/*

 Titanium Cloud Module

 This module is used across three distinct platforms (iOS, Android, and Mobile Web), each with their own architectural
 demands upon it.

 Appcelerator Titanium is Copyright (c) 2009-2014 by Appcelerator, Inc.
 and licensed under the Apache Public License (version 2)

 Copyright 2008 Netflix, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 in FIPS PUB 180-1
 Version 2.1a Copyright Paul Johnston 2000 - 2002.
 Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 Distributed under the BSD License
 See http://pajhome.org.uk/crypt/md5 for details.
*/
defineCloud(exports);

function defineCloud(l) {
	var b;

	function o(b, a, d) {
		if (void 0 === a) throw "Argument " + b + " was not provided!";
		if (typeof a != d) throw "Argument " + b + " was an unexpected type! Expected: " + d + ", Received: " + typeof a;
	}

	function w(b, a, d, c) {
		l.debug && Ti.API.info('ACS Request: { url: "' + b + '", verb: "' + a + '", data: ' + JSON.stringify(d) + " })");
		g.send(b, a, d, function(a) {
			if (c) {
				var d = a.response || {};
				a.meta && "ok" == a.meta.status ? (d.success = !0, d.error = !1, d.meta = a.meta, l.debug && Ti.API.info(JSON.stringify(d))) : (d.success = !1, d.error = !0, d.code = a.meta ? a.meta.code : a.statusCode, d.message = a.meta ? a.meta.message : a.message || a.statusText, l.debug && Ti.API.error(d.code + ": " + d.message));
				c(d)
			}
		})
	}

	function s(b, a) {
		o("data", b, "object");
		o("callback", a, "function");
		x(this);
		this.url || (this.url = this.restNamespace + "/" + this.restMethod + ".json");
		w(this.url, this.verb, b, a)
	}

	function i() {
		s.call(this, 2 == arguments.length ? arguments[0] : {}, 2 == arguments.length ? arguments[1] : arguments[0])
	}

	function x(b) {
		b.restNamespace || (b.restNamespace = b.property.toLowerCase());
		b.restMethod ||
			(b.restMethod = b.method.toLowerCase())
	}

	function v(b, a) {
		b[a >> 5] |= 128 << 24 - a % 32;
		b[(a + 64 >> 9 << 4) + 15] = a;
		for (var d = Array(80), c = 1732584193, h = -271733879, f = -1732584194, e = 271733878, k = -1009589776, j = 0; j < b.length; j += 16) {
			for (var g = c, i = h, t = f, A = e, l = k, m = 0; 80 > m; m++) {
				d[m] = 16 > m ? b[j + m] : (d[m - 3] ^ d[m - 8] ^ d[m - 14] ^ d[m - 16]) << 1 | (d[m - 3] ^ d[m - 8] ^ d[m - 14] ^ d[m - 16]) >>> 31;
				var n = c << 5 | c >>> 27,
					o;
				o = 20 > m ? h & f | ~h & e : 40 > m ? h ^ f ^ e : 60 > m ? h & f | h & e | f & e : h ^ f ^ e;
				n = p(p(n, o), p(p(k, d[m]), 20 > m ? 1518500249 : 40 > m ? 1859775393 : 60 > m ? -1894007588 : -899497514));
				k = e;
				e = f;
				f =
					h << 30 | h >>> 2;
				h = c;
				c = n
			}
			c = p(c, g);
			h = p(h, i);
			f = p(f, t);
			e = p(e, A);
			k = p(k, l)
		}
		return [c, h, f, e, k]
	}

	function p(b, a) {
		var d = (b & 65535) + (a & 65535);
		return (b >> 16) + (a >> 16) + (d >> 16) << 16 | d & 65535
	}

	function y(b) {
		for (var a = [], d = (1 << r) - 1, c = 0; c < b.length * r; c += r) a[c >> 5] |= (b.charCodeAt(c / r) & d) << 32 - r - c % 32;
		return a
	}

	function n(e, a, d, c, h) {
		var f = !1;
		this.appKey = e;
		this.oauthKey = a;
		this.oauthSecret = d;
		this.apiBaseURL = c ? c : b.sdk.url.baseURL;
		this.authBaseURL = h ? h : b.sdk.url.authBaseURL;
		this.useThreeLegged = function(a) {
			f = a;
			this.oauthKey || (this.oauthKey =
				this.appKey)
		};
		this.isThreeLegged = function() {
			return f
		};
		return this
	}
	var u = {
		PROPERTY_TYPE_ONLY_LATEST: 0,
		PROPERTY_TYPE_SLASH_COMBINE: 1,
		PROPERTY_TYPE_IGNORE: 2
	};
	u.build = function a(d, c) {
		var b = c.children || [],
			f;
		for (f in b)
			if (b.hasOwnProperty(f)) {
				var e = b[f],
					k = e.propertyTypes || c.propertyTypes || {};
				k.children = u.PROPERTY_TYPE_IGNORE;
				for (var j in c)
					if (c.hasOwnProperty(j)) switch (k[j] || u.PROPERTY_TYPE_ONLY_LATEST) {
						case u.PROPERTY_TYPE_ONLY_LATEST:
							e[j] = void 0 === e[j] ? c[j] : e[j];
							break;
						case u.PROPERTY_TYPE_SLASH_COMBINE:
							var g =
								[];
							c[j] && g.push(c[j]);
							e[j] && g.push(e[j]);
							e[j] = g.join("/")
					}
					e.method && !e.children ? d[e.method] = function(a) {
					return function() {
						return a.executor.apply(a, arguments)
					}
				}(e) : e.property && a(d[e.property] = {}, e)
			}
	};
	u.build(l, {
		verb: "GET",
		executor: s,
		children: [{
			method: "sendRequest",
			executor: function(a, d) {
				o("params", a, "object");
				o("url", a.url, "string");
				o("method", a.method, "string");
				o("callback", d, "function");
				w(a.url, a.method, a.data ? a.data : {}, d)
			}
		}, {
			method: "hasStoredSession",
			executor: function() {
				Ti.API.warn("Cloud.hasStoredSession has been deprecated. Use Cloud.sessionId property");
				return g.hasStoredSession()
			}
		}, {
			method: "retrieveStoredSession",
			executor: function() {
				Ti.API.warn("Cloud.retrieveStoredSession has been deprecated. Use Cloud.sessionId property");
				return g.retrieveStoredSession()
			}
		}, {
			property: "ACLs",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "show"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "addUser",
				restMethod: "add",
				verb: "POST"
			}, {
				method: "removeUser",
				restMethod: "remove",
				verb: "DELETE"
			}, {
				method: "checkUser",
				restMethod: "check"
			}]
		}, {
			property: "Chats",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "query"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "queryChatGroups",
				restMethod: "query_chat_groups",
				executor: i
			}, {
				method: "getChatGroups",
				restMethod: "get_chat_groups",
				executor: i
			}]
		}, {
			property: "Checkins",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "query",
				executor: i
			}, {
				method: "show"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Clients",
			children: [{
				method: "geolocate",
				executor: i
			}]
		}, {
			property: "Objects",
			executor: function(a, d) {
				var c;
				a && "object" == typeof a && (o("data.classname", a.classname, "string"), x(this), this.url = this.restNamespace + "/" + a.classname + "/" + this.restMethod + ".json", c = a.classname, delete a.classname);
				s.call(this, a, d);
				a.classname = c
			},
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "query"
			}]
		}, {
			property: "Emails",
			restNamespace: "custom_mailer",
			children: [{
				method: "send",
				verb: "POST",
				restMethod: "email_from_template"
			}]
		}, {
			property: "Events",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "showOccurrences",
				restMethod: "show/occurrences"
			}, {
				method: "query",
				executor: i
			}, {
				method: "queryOccurrences",
				restMethod: "query/occurrences",
				executor: i
			}, {
				method: "search",
				executor: i
			}, {
				method: "searchOccurrences",
				restMethod: "search/occurrences",
				executor: i
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Files",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "query",
				executor: i
			}, {
				method: "show"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Friends",
			children: [{
				method: "add",
				verb: "POST"
			}, {
				method: "requests",
				executor: i
			}, {
				method: "approve",
				verb: "PUT"
			}, {
				method: "remove",
				verb: "DELETE"
			}, {
				method: "search"
			}]
		}, {
			property: "GeoFences",
			restNamespace: "geo_fences",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "query"
			}]
		}, {
			property: "KeyValues",
			children: [{
				method: "set",
				verb: "PUT"
			}, {
				method: "get"
			}, {
				method: "append",
				verb: "PUT"
			}, {
				method: "increment",
				restMethod: "incrby",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Likes",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			},{
				method: "query",
				executor: i
			}]
		}, {
			property: "Messages",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "reply",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "showInbox",
				restMethod: "show/inbox",
				executor: i
			}, {
				method: "showSent",
				restMethod: "show/sent",
				executor: i
			}, {
				method: "showThreads",
				restMethod: "show/threads",
				executor: i
			}, {
				method: "showThread",
				restMethod: "show/thread"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "removeThread",
				restMethod: "delete/thread",
				verb: "DELETE"
			}]
		}, {
			property: "Photos",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "search"
			}, {
				method: "query",
				executor: i
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "PhotoCollections",
			restNamespace: "collections",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "search"
			}, {
				method: "showSubcollections",
				restMethod: "show/subcollections"
			}, {
				method: "showPhotos",
				restMethod: "show/photos"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Places",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "search",
				executor: i
			}, {
				method: "show"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}, {
				method: "query",
				executor: i
			}]
		}, {
			property: "Posts",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "query",
				executor: i
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "PushNotifications",
			restNamespace: "push_notification",
			verb: "POST",
			children: [{
				method: "subscribe"
			}, {
				method: "unsubscribe",
				verb: "DELETE"
			}, {
				method: "notify"
			}, {
				method: "query",
				verb: "GET"
			}, {
				method: "subscribeToken",
				restMethod: "subscribe_token"
			}, {
				method: "unsubscribeToken",
				restMethod: "unsubscribe_token",
				verb: "DELETE"
			}, {
				method: "updateSubscription",
				restMethod: "subscription/update",
				verb: "PUT"
			}, {
				method: "notifyTokens",
				restMethod: "notify_tokens"
			}, {
				method: "resetBadge",
				restMethod: "reset_badge",
				verb: "PUT"
			}, {
				method: "setBadge",
				restMethod: "set_badge",
				verb: "PUT",
				executor: i
			}, {
				method: "queryChannels",
				restMethod: "channels/query",
				verb: "GET",
				executor: i
			}, {
				method: "showChannels",
				restMethod: "channels/show",
				verb: "GET"
			}]
		}, {
			property: "PushSchedules",
			restNamespace: "push_schedules",
			children: [{
				method: "create",
				restMethod: "create",
				verb: "POST"
			}, {
				method: "query",
				restMethod: "query",
				executor: i
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Reviews",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "query"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "SocialIntegrations",
			restNamespace: "users",
			children: [{
				method: "externalAccountLogin",
				restMethod: "external_account_login",
				verb: "POST"
			}, {
				method: "externalAccountLink",
				restMethod: "external_account_link",
				verb: "POST"
			}, {
				method: "externalAccountUnlink",
				restMethod: "external_account_unlink",
				verb: "DELETE"
			}, {
				method: "searchFacebookFriends",
				restNamespace: "social",
				restMethod: "facebook/search_friends",
				executor: i
			}]
		}, {
			property: "Statuses",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "show"
			}, {
				method: "search"
			}, {
				method: "query",
				executor: i
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE"
			}]
		}, {
			property: "Users",
			children: [{
				method: "create",
				verb: "POST"
			}, {
				method: "login",
				verb: "POST"
			}, {
				method: "show"
			}, {
				method: "showMe",
				restMethod: "show/me",
				executor: function(a) {
					s.call(this, {}, a)
				}
			}, {
				method: "search",
				executor: i
			}, {
				method: "query",
				executor: i
			}, {
				method: "update",
				verb: "PUT"
			}, {
				method: "logout",
				executor: function(a) {
					s.call(this, {}, function(d) {
						g.reset();
						a(d)
					})
				}
			}, {
				method: "remove",
				restMethod: "delete",
				verb: "DELETE",
				executor: function() {
					var a = arguments;
					s.call(this, 2 == a.length ? a[0] : {}, function(d) {
						g.reset();
						(2 == a.length ? a[1] : a[0])(d)
					})
				}
			}, {
				method: "requestResetPassword",
				restMethod: "request_reset_password"
			}, {
				method: "resendConfirmation",
				restMethod: "resend_confirmation"
			}]
		}]
	});
	var e;
	null == e && (e = {});
	e.setProperties = function(a, d) {
		if (null != a && null != d)
			for (var c in d) a[c] = d[c];
		return a
	};
	e.setProperties(e, {
		percentEncode: function(a) {
			if (null ==
				a) return "";
			if (a instanceof Array) {
				for (var d = ""; 0 < a.length; ++a) "" != d && (d += "&"), d += e.percentEncode(a[0]);
				return d
			}
			a = encodeURIComponent(a);
			a = a.replace(/\!/g, "%21");
			a = a.replace(/\*/g, "%2A");
			a = a.replace(/\'/g, "%27");
			a = a.replace(/\(/g, "%28");
			return a = a.replace(/\)/g, "%29")
		},
		decodePercent: function(a) {
			null != a && (a = a.replace(/\+/g, " "));
			return decodeURIComponent(a)
		},
		getParameterList: function(a) {
			if (null == a) return [];
			if ("object" != typeof a) return e.decodeForm(a + "");
			if (a instanceof Array) return a;
			var d = [],
				c;
			for (c in a) d.push([c,
				a[c]
			]);
			return d
		},
		getParameterMap: function(a) {
			if (null == a) return {};
			if ("object" != typeof a) return e.getParameterMap(e.decodeForm(a + ""));
			if (a instanceof Array) {
				for (var d = {}, c = 0; c < a.length; ++c) {
					var b = a[c][0];
					void 0 === d[b] && (d[b] = a[c][1])
				}
				return d
			}
			return a
		},
		getParameter: function(a, d) {
			if (a instanceof Array)
				for (var c = 0; c < a.length; ++c) {
					if (a[c][0] == d) return a[c][1]
				} else return e.getParameterMap(a)[d];
			return null
		},
		formEncode: function(a) {
			for (var d = "", a = e.getParameterList(a), c = 0; c < a.length; ++c) {
				var b = a[c][1];
				null ==
					b && (b = "");
				"" != d && (d += "&");
				d += e.percentEncode(a[c][0]) + "=" + e.percentEncode(b)
			}
			return d
		},
		decodeForm: function(a) {
			for (var d = [], a = a.split("&"), c = 0; c < a.length; ++c) {
				var b = a[c];
				if ("" != b) {
					var f = b.indexOf("="),
						g;
					0 > f ? (g = e.decodePercent(b), b = null) : (g = e.decodePercent(b.substring(0, f)), b = e.decodePercent(b.substring(f + 1)));
					d.push([g, b])
				}
			}
			return d
		},
		setParameter: function(a, d, c) {
			var b = a.parameters;
			if (b instanceof Array) {
				for (a = 0; a < b.length; ++a) b[a][0] == d && (void 0 === c ? b.splice(a, 1) : (b[a][1] = c, c = void 0));
				void 0 !== c &&
					b.push([d, c])
			} else b = e.getParameterMap(b), b[d] = c, a.parameters = b
		},
		setParameters: function(a, d) {
			for (var c = e.getParameterList(d), b = 0; b < c.length; ++b) e.setParameter(a, c[b][0], c[b][1])
		},
		completeRequest: function(a, d) {
			null == a.method && (a.method = "GET");
			var c = e.getParameterMap(a.parameters);
			null == c.oauth_consumer_key && e.setParameter(a, "oauth_consumer_key", d.consumerKey || "");
			null == c.oauth_token && null != d.token && e.setParameter(a, "oauth_token", d.token);
			null == c.oauth_version && e.setParameter(a, "oauth_version", "1.0");
			null == c.oauth_timestamp && e.setParameter(a, "oauth_timestamp", e.timestamp());
			null == c.oauth_nonce && e.setParameter(a, "oauth_nonce", e.nonce(6));
			e.SignatureMethod.sign(a, d)
		},
		setTimestampAndNonce: function(a) {
			e.setParameter(a, "oauth_timestamp", e.timestamp());
			e.setParameter(a, "oauth_nonce", e.nonce(6))
		},
		addToURL: function(a, d) {
			newURL = a;
			if (null != d) {
				var c = e.formEncode(d);
				0 < c.length && (newURL = 0 > a.indexOf("?") ? newURL + "?" : newURL + "&", newURL += c)
			}
			return newURL
		},
		getAuthorizationHeader: function(a, d) {
			for (var c = 'OAuth realm="' +
					e.percentEncode(a) + '"', b = e.getParameterList(d), f = 0; f < b.length; ++f) {
				var g = b[f],
					k = g[0];
				0 == k.indexOf("oauth_") && (c += "," + e.percentEncode(k) + '="' + e.percentEncode(g[1]) + '"')
			}
			return c
		},
		correctTimestamp: function(a) {
			e.timeCorrectionMsec = 1E3 * a - (new Date).getTime()
		},
		timeCorrectionMsec: 0,
		timestamp: function() {
			var a = (new Date).getTime() + e.timeCorrectionMsec;
			return Math.floor(a / 1E3)
		},
		nonce: function(a) {
			for (var d = e.nonce.CHARS, b = "", h = 0; h < a; ++h) var f = Math.floor(Math.random() * d.length),
				b = b + d.substring(f, f + 1);
			return b
		}
	});
	e.nonce.CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	e.declareClass = function(a, d, b) {
		var e = a[d];
		a[d] = b;
		if (null != b && null != e)
			for (var f in e) "prototype" != f && (b[f] = e[f]);
		return b
	};
	e.declareClass(e, "SignatureMethod", function() {});
	e.setProperties(e.SignatureMethod.prototype, {
		sign: function(a) {
			var d = this.getSignature(e.SignatureMethod.getBaseString(a));
			e.setParameter(a, "oauth_signature", d);
			return d
		},
		initialize: function(a, d) {
			var b;
			b = null != d.accessorSecret && 9 < a.length && "-Accessor" ==
				a.substring(a.length - 9) ? d.accessorSecret : d.consumerSecret;
			this.key = e.percentEncode(b) + "&" + e.percentEncode(d.tokenSecret)
		}
	});
	e.setProperties(e.SignatureMethod, {
		sign: function(a, d) {
			var b = e.getParameterMap(a.parameters).oauth_signature_method;
			if (null == b || "" == b) b = "HMAC-SHA1", e.setParameter(a, "oauth_signature_method", b);
			e.SignatureMethod.newMethod(b, d).sign(a)
		},
		newMethod: function(a, d) {
			var b = e.SignatureMethod.REGISTERED[a];
			if (null != b) {
				var h = new b;
				h.initialize(a, d);
				return h
			}
			var b = Error("signature_method_rejected"),
				f = "";
			for (h in e.SignatureMethod.REGISTERED) "" != f && (f += "&"), f += e.percentEncode(h);
			b.oauth_acceptable_signature_methods = f;
			throw b;
		},
		REGISTERED: {},
		registerMethodClass: function(a, b) {
			for (var c = 0; c < a.length; ++c) e.SignatureMethod.REGISTERED[a[c]] = b
		},
		makeSubclass: function(a) {
			var b = e.SignatureMethod,
				c = function() {
					b.call(this)
				};
			c.prototype = new b;
			c.prototype.getSignature = a;
			return c.prototype.constructor = c
		},
		getBaseString: function(a) {
			var b = a.action,
				c = b.indexOf("?");
			if (0 > c) c = a.parameters;
			else
				for (var c = e.decodeForm(b.substring(c +
						1)), h = e.getParameterList(a.parameters), f = 0; f < h.length; ++f) c.push(h[f]);
			return e.percentEncode(a.method.toUpperCase()) + "&" + e.percentEncode(e.SignatureMethod.normalizeUrl(b)) + "&" + e.percentEncode(e.SignatureMethod.normalizeParameters(c))
		},
		normalizeUrl: function(a) {
			var b = e.SignatureMethod.parseUri(a),
				a = b.protocol.toLowerCase(),
				c = b.authority.toLowerCase();
			if ("http" == a && 80 == b.port || "https" == a && 443 == b.port) {
				var h = c.lastIndexOf(":");
				0 <= h && (c = c.substring(0, h))
			}(b = b.path) || (b = "/");
			return a + "://" + c + b
		},
		parseUri: function(a) {
			for (var b =
					"source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(","), a = /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(a), c = {}, e = 14; e--;) c[b[e]] = a[e] || "";
			return c
		},
		normalizeParameters: function(a) {
			if (null == a) return "";
			for (var b = e.getParameterList(a), a = [], c = 0; c < b.length; ++c) {
				var h = b[c];
				"oauth_signature" != h[0] && a.push([e.percentEncode(h[0]) + " " + e.percentEncode(h[1]),
					h
				])
			}
			a.sort(function(a, b) {
				return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0
			});
			b = [];
			for (c = 0; c < a.length; ++c) b.push(a[c][1]);
			return e.formEncode(b)
		}
	});
	e.SignatureMethod.registerMethodClass(["PLAINTEXT", "PLAINTEXT-Accessor"], e.SignatureMethod.makeSubclass(function() {
		return this.key
	}));
	e.SignatureMethod.registerMethodClass(["HMAC-SHA1", "HMAC-SHA1-Accessor"], e.SignatureMethod.makeSubclass(function(a) {
		z = "=";
		var b = this.key,
			c = y(b);
		16 < c.length && (c = v(c, b.length * r));
		for (var e = Array(16), b = Array(16), f = 0; 16 > f; f++) e[f] = c[f] ^ 909522486,
			b[f] = c[f] ^ 1549556828;
		a = v(e.concat(y(a)), 512 + a.length * r);
		a = v(b.concat(a), 672);
		c = "";
		for (b = 0; b < 4 * a.length; b += 3) {
			e = (a[b >> 2] >> 8 * (3 - b % 4) & 255) << 16 | (a[b + 1 >> 2] >> 8 * (3 - (b + 1) % 4) & 255) << 8 | a[b + 2 >> 2] >> 8 * (3 - (b + 2) % 4) & 255;
			for (f = 0; 4 > f; f++) c = 8 * b + 6 * f > 32 * a.length ? c + z : c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 6 * (3 - f) & 63)
		}
		return c
	}));
	var z = "",
		r = 8;
	n.prototype.sendRequest = function(a, d, c, h) {
		var f = b.js.sdk.utils.getAuthType(this);
		if (f == b.constants.unknown) h(b.constants.noAppKeyError);
		else {
			var g =
				this.apiBaseURL + "/" + b.sdk.url.version + "/" + a,
				g = f == b.constants.app_key ? g + (b.constants.keyParam + this.appKey) : g + (b.constants.oauthKeyParam + this.oauthKey);
			null == c && (c = {});
			d = d ? d.toUpperCase() : b.constants.get_method;
			c[b.constants.suppressCode] = "true";
			if (!this.isThreeLegged()) {
				var k = b.js.sdk.utils.getCookie(b.constants.sessionId);
				k || (k = this.session_id);
				k && (g = -1 != g.indexOf("?") ? g + ("&" + b.constants.sessionId + "=" + k) : g + ("?" + b.constants.sessionId + "=" + k))
			}
			if (this.isThreeLegged()) {
				if (!this.accessToken && (k = this.getSession())) this.accessToken =
					k.access_token;
				this.accessToken && (c[b.constants.accessToken] = this.accessToken)
			}
			k = c;
			if (Ti.App.analytics) {
				var j = k.analytics || {};
				j.id = Ti.Platform.createUUID();
				Ti.Platform.id && (j.mid = Ti.Platform.id);
				j.aguid = Ti.App.guid;
				j.event = "cloud." + a.replace(/\//g, ".").replace(/\.json/, "");
				j.deploytype = Ti.App.deployType || "development";
				j.sid = Ti.App.sessionId;
				k.ti_analytics = JSON.stringify(j)
			}
			c = b.js.sdk.utils.cleanInvalidData(c);
			if (a = b.js.sdk.utils.getFileObject(c)) {
				try {
					var i;
					i = a.toString().match(/TiFilesystemFile/) ?
						a.read() : a;
					if (!i) {
						h(b.constants.fileLoadError);
						return
					}
					c[b.constants.file] ? (delete c[b.constants.file], c[b.constants.file] = i) : c[b.constants.photo] && (delete c[b.constants.photo], c[b.constants.photo] = i)
				} catch (l) {
					h(b.constants.fileLoadError);
					return
				}
				i = {};
				if (f == b.constants.oauth || f == b.constants.three_legged_oauth) f = {
						method: d,
						action: g,
						parameters: []
					}, b.js.sdk.utils.populateOAuthParameters(f.parameters, this.oauthKey), this.oauthSecret && e.completeRequest(f, {
						consumerSecret: this.oauthSecret
					}), i[b.constants.oauth_header] =
					e.getAuthorizationHeader("", f.parameters)
			} else if (i = {}, f == b.constants.oauth || f == b.constants.three_legged_oauth) {
				var f = {
						method: d,
						action: g,
						parameters: []
					},
					t;
				for (t in c) c.hasOwnProperty(t) && f.parameters.push([t, c[t]]);
				b.js.sdk.utils.populateOAuthParameters(f.parameters, this.oauthKey);
				this.oauthSecret && e.completeRequest(f, {
					consumerSecret: this.oauthSecret
				});
				i[b.constants.oauth_header] = e.getAuthorizationHeader("", f.parameters)
			}
			b.js.sdk.utils.sendAppceleratorRequest(g, d, c, i, h, this)
		}
	};
	n.prototype.sendAuthRequest =
		function(a) {
			if (b.js.sdk.utils.getAuthType(this) !== b.constants.three_legged_oauth) alert("wrong authorization type!");
			else {
				var a = a || {},
					d = this.authBaseURL,
					d = d + "/oauth/authorize" + (b.constants.oauthKeyParam + this.oauthKey),
					d = d + (b.constants.clientIdParam + this.oauthKey),
					d = d + (b.constants.responseTypeParam + "token"),
					a = a.params || {};
				a.action = "login";
				a.url = d;
				var c = this,
					e = a.cb;
				e && delete a.cb;
				b.js.sdk.ui(a, function(a) {
					c.saveSession(a);
					e && e(a)
				})
			}
		};
	n.prototype.signUpRequest = function(a) {
		if (b.js.sdk.utils.getAuthType(this) !==
			b.constants.three_legged_oauth) alert("wrong authorization type!");
		else {
			var a = a || {},
				d = this.authBaseURL,
				d = d + "/users/sign_up" + (b.constants.oauthKeyParam + this.oauthKey),
				d = d + (b.constants.clientIdParam + this.oauthKey),
				a = a.params || {};
			a.action = "signup";
			a.url = d;
			var c = this,
				e = a.cb;
			e && delete a.cb;
			b.js.sdk.ui(a, function(a) {
				c.saveSession(a);
				e && e(a)
			})
		}
	};
	n.prototype.saveSession = function(a) {
		if (!a || !a.access_token) return this.authorized = !1;
		b.js.sdk.utils.setCookie(b.constants.accessToken, a.access_token);
		b.js.sdk.utils.setCookie(b.constants.expiresIn,
			a.expires_in);
		this.accessToken = a.access_token;
		this.expiresIn = a.expires_in;
		return this.authorized = !0
	};
	n.prototype.getSession = function() {
		var a = {};
		a.access_token = b.js.sdk.utils.getCookie(b.constants.accessToken);
		a.expires_in = b.js.sdk.utils.getCookie(b.constants.expiresIn);
		if (!a.access_token) return this.authorized = !1;
		this.accessToken = a.access_token;
		this.expiresIn = a.expires_in;
		this.authorized = !0;
		return a
	};
	n.prototype.clearSession = function() {
		b.js.sdk.utils.setCookie(b.constants.accessToken, "");
		b.js.sdk.utils.setCookie(b.constants.expiresIn,
			"");
		delete this.accessToken;
		delete this.expiresIn;
		this.authorized = !1
	};
	n.prototype.checkStatus = function() {
		return this.getSession() ? !0 : !1
	};
	b = void 0;
	b = {
		constants: {},
		js: {}
	};
	b.js.sdk = {};
	b.js.sdk.utils = {};
	b.sdk = {};
	b.sdk.url = {};
	b.sdk.url.baseURL = "https://api.cloud.appcelerator.com";
	b.sdk.url.authBaseURL = "https://secure-identity.cloud.appcelerator.com";
	b.sdk.url.version = "v1";
	b.constants.get_method = "GET";
	b.constants.post_method = "POST";
	b.constants.put_method = "PUT";
	b.constants.delete_method = "DELETE";
	b.constants.app_key =
		1;
	b.constants.oauth = 2;
	b.constants.three_legged_oauth = 3;
	b.constants.unknown = -1;
	b.constants.keyParam = "?key=";
	b.constants.oauthKeyParam = "?oauth_consumer_key=";
	b.constants.clientIdParam = "&client_id=";
	b.constants.redirectUriParam = "&redirect_uri=";
	b.constants.responseTypeParam = "&response_type=";
	b.constants.accessToken = "access_token";
	b.constants.expiresIn = "expires_in";
	b.constants.appKey = "app_key";
	b.constants.json = "json";
	b.constants.sessionId = "_session_id";
	b.constants.sessionCookieName = "Cookie";
	b.constants.responseCookieName =
		"Set-Cookie";
	b.constants.file = "file";
	b.constants.suppressCode = "suppress_response_codes";
	b.constants.response_wrapper = "response_wrapper";
	b.constants.photo = "photo";
	b.constants.method = "_method";
	b.constants.name = "name";
	b.constants.value = "value";
	b.constants.oauth_header = "Authorization";
	b.constants.noAppKeyError = {
		meta: {
			status: "fail",
			code: 409,
			message: "Application key is not provided."
		}
	};
	b.constants.fileLoadError = {
		meta: {
			status: "fail",
			code: 400,
			message: "Unable to load file"
		}
	};
	b.js.sdk.utils.getSessionParams =
		function() {
			var a = null,
				d = b.js.sdk.utils.getCookie(b.constants.sessionId);
			d && (a = b.constants.sessionId + "=" + d);
			return a
		};
	b.js.sdk.utils.cookieMap = [];
	b.js.sdk.utils.cookieMap[b.constants.sessionId] = "sessionId";
	b.js.sdk.utils.cookieMap[b.constants.accessToken] = "accessToken";
	b.js.sdk.utils.cookieMap[b.constants.expiresIn] = "expiresIn";
	b.js.sdk.utils.getCookie = function(a) {
		return (a = b.js.sdk.utils.cookieMap[a]) && l[a] || null
	};
	b.js.sdk.utils.setCookie = function(a, d) {
		var c = b.js.sdk.utils.cookieMap[a];
		c && ("" === d ?
			delete l[c] : l[c] = d)
	};
	b.js.sdk.utils.deleteCookie = function(a) {
		(a = b.js.sdk.utils.cookieMap[a]) && delete l[a]
	};
	b.js.sdk.utils.getAuthType = function(a) {
		if (a) {
			if (a.isThreeLegged()) return b.constants.three_legged_oauth;
			if (a.appKey) return b.constants.app_key;
			if (a.oauthKey && a.oauthSecret) return b.constants.oauth
		}
		return b.constants.unknown
	};
	b.js.sdk.utils.getFileObject = function(a) {
		if (a)
			for (var d in a)
				if (a.hasOwnProperty(d) && (d == b.constants.photo || d == b.constants.file)) return a[d];
		return null
	};
	b.js.sdk.utils.cleanInvalidData =
		function(a) {
			if (a) {
				for (var d in a)
					if (a.hasOwnProperty(d)) {
						null == a[d] && delete a[d];
						if ("object" == typeof a[d]) {
							if (d == b.constants.photo || d == b.constants.file) continue;
							a[d] = JSON.stringify(a[d])
						}
						if (!0 === a[d] || !1 === a[d]) a[d] = a[d] ? 1 : 0
					}
				return a
			}
			return {}
		};
	b.js.sdk.utils.uploadMessageCallback = function(a) {
		return a && a.data ? JSON.parse(a.data) : {}
	};
	b.js.sdk.utils.getOAuthParameters = function(a) {
		var b = "";
		if (a)
			for (var a = e.getParameterList(a), c = 0; c < a.length; ++c) {
				var h = a[c],
					f = h[0];
				0 == f.indexOf("oauth_") && "oauth_token" !=
					f && (b += "&" + e.percentEncode(f) + "=" + e.percentEncode(h[1]))
			}
		0 < b.length && (b = b.substring(1));
		return b
	};
	b.js.sdk.utils.populateOAuthParameters = function(a, b) {
		a && b && (a.push(["oauth_version", "1.0"]), a.push(["oauth_consumer_key", b]), a.push(["oauth_signature_method", "HMAC-SHA1"]), a.push(["oauth_nonce", e.nonce(15)]))
	};
	b.js.sdk.utils.sendAppceleratorRequest = function(a, d, c, h, f, g) {
		var i = Ti.Network.createHTTPClient({
				timeout: 6E4,
				onsendstream: function(b) {
					l.onsendstream && l.onsendstream({
						url: a,
						progress: b.progress
					})
				},
				ondatastream: function(b) {
					l.ondatastream && l.ondatastream({
						url: a,
						progress: b.progress
					})
				},
				onerror: function(a) {
					var b = {};
					if (this.responseText) {
						var c = this.responseText;
						try {
							(c = c.trim()) && 0 < c.length && (b = JSON.parse(c))
						} catch (d) {
							b = d
						}
					}
					b.message || (b.message = a.error);
					b.error = !0;
					b.statusText = this.statusText;
					b.status = this.status;
					b.meta && (b.metaString = JSON.stringify(b.meta));
					f(b)
				},
				onload: function() {
					var a = JSON.parse(this.responseText);
					if (a && a.meta && (a.metaString = JSON.stringify(a.meta), a.meta.session_id)) {
						var c = a.meta.session_id;
						b.js.sdk.utils.setCookie(b.constants.sessionId, c);
						g.session_id = c
					}
					f(a)
				}
			}),
			j = a;
		if (d.toUpperCase() == b.constants.get_method || d.toUpperCase() == b.constants.delete_method) {
			var n = "",
				q;
			for (q in c) c.hasOwnProperty(q) && (n += "&" + q + "=" + e.percentEncode(c[q]));
			0 < n.length && (j = 0 < a.indexOf("?") ? j + n : j + ("?" + n.substring(1)), c = {})
		}
		l.debug && (Ti.API.info(d + ": " + j), Ti.API.info("header: " + JSON.stringify(h)), Ti.API.info("data: " + JSON.stringify(c)));
		i.open(d, j);
		"mobileweb" != Ti.Platform.osname && i.setRequestHeader("Accept-Encoding",
			"gzip,deflate");
		if (h)
			for (q in h) h.hasOwnProperty(q) && i.setRequestHeader(q, h[q]);
		i.send(c)
	};
	b.js.sdk.utils.decodeQS = function(a) {
		var b = decodeURIComponent,
			c = {},
			a = a.split("&"),
			e, f;
		for (e = 0; e < a.length; e++)(f = a[e].split("=", 2)) && f[0] && (c[b(f[0])] = b(f[1]));
		return c
	};
	b.js.sdk.utils.guid = function() {
		return "f" + (1073741824 * Math.random()).toString(16).replace(".", "")
	};
	b.js.sdk.utils.copy = function(a, b, c, e) {
		for (var f in b)
			if (c || "undefined" === typeof a[f]) a[f] = e ? e(b[f]) : b[f];
		return a
	};
	var g = {
		session: null,
		fetchSetting: function(a,
			b) {
			var c, e = "production" == Ti.App.deployType.toLowerCase() ? "production" : "development";
			return (c = Ti.App.Properties.getString(a + "-" + e)) && "undefined" != c || (c = Ti.App.Properties.getString(a)) && "undefined" != c ? c : b
		},
		fetchSession: function() {
			var a = g.fetchSetting("acs-api-key", null),
				d = g.fetchSetting("acs-base-url", b.sdk.url.baseURL),
				c = g.fetchSetting("acs-authbase-url", b.sdk.url.authBaseURL),
				e = g.fetchSetting("acs-oauth-key", null),
				f = g.fetchSetting("acs-oauth-secret", null);
			return new n(a, e, f, d, c)
		}
	};
	g.getSession = function() {
		null ==
			g.session && (g.session = g.fetchSession());
		return g.session
	};
	g.send = function(a, b, c, e) {
		g.getSession().sendRequest(a, b, c, e)
	};
	g.hasStoredSession = function() {
		return !!b.js.sdk.utils.getCookie(b.constants.sessionId)
	};
	g.retrieveStoredSession = function() {
		return b.js.sdk.utils.getCookie(b.constants.sessionId)
	};
	g.reset = function() {
		b.js.sdk.utils.deleteCookie(b.constants.sessionId);
		g.session && (g.session.clearSession(), g.session = null)
	};
	g.secureSend = function(a, b) {
		var c = g.getSession();
		c.useThreeLegged(!0);
		"secureCreate" ===
		a ? c.signUpRequest(b) : "secureLogin" === a && c.sendAuthRequest(b)
	};
	g.checkStatus = function() {
		return g.getSession().checkStatus()
	};
	b.js.sdk.UIManager = {
		redirect_uri: "acsconnect://success",
		displayModal: function(a) {
			function d(a) {
				var j = /^acsconnect:\/\/([^#]*)#(.*)/.exec(decodeURIComponent(a.url));
				if (j && 3 == j.length) {
					var l = null;
					if ("success" == j[1]) l = b.js.sdk.utils.decodeQS(j[2]);
					else if ("cancel" != j[1]) return;
					f.removeEventListener("beforeload", d);
					f.removeEventListener("load", d);
					i = l;
					null != c ? c.close() : e && e.close()
				}
				g &&
					"load" == a.type && (e.remove(g), g = null)
			}
			l.debug && Ti.API.info("ThreeLegged Request url: " + a.url);
			var c = null,
				e = Ti.UI.createWindow({
					fullscreen: !1,
					title: a.params.title || "Appcelerator Cloud Service"
				}),
				f = Ti.UI.createWebView({
					url: a.url,
					scalesPageToFit: !1,
					showScrollbars: !0
				}),
				g = Ti.UI.createLabel({
					text: "Loading, please wait...",
					color: "black",
					width: Ti.UI.SIZE || "auto",
					height: Ti.UI.SIZE || "auto",
					zIndex: 100
				}),
				i;
			f.addEventListener("beforeload", d);
			f.addEventListener("load", d);
			e.addEventListener("close", function() {
				a &&
					(a.cb && a.cb(i), f = e = g = a = i = null)
			});
			if ("android" != Ti.Platform.osname) {
				var j = Ti.UI.createButton({
					title: "close",
					width: "50%",
					height: "20%"
				});
				j.addEventListener("click", function() {
					c.close()
				});
				e.rightNavButton = j;
				if ("iphone" == Ti.Platform.osname || "ios" == Ti.Platform.osname) c = Ti.UI.iOS.createNavigationWindow({
					window: e
				})
			}
			e.add(f);
			e.add(g);
			null != c ? c.open({
				modal: !0
			}) : e.open()
		},
		processParams: function(a, d) {
			return {
				cb: d,
				url: a.url + b.constants.redirectUriParam + b.js.sdk.UIManager.redirect_uri,
				params: a
			}
		}
	};
	b.js.sdk.ui = function(a,
		d) {
		if ("mobileweb" === Ti.Platform.osname) alert("Three Legged OAuth is not currently supported on MobileWeb");
		else if (a.action) {
			var c = b.js.sdk.UIManager.processParams(a, d);
			c && b.js.sdk.UIManager.displayModal(c)
		} else alert('"action" is a required parameter for com.cocoafish.js.sdk.ui().')
	};
	return l
};