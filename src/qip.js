(function(win){

    var doc = win.document;
	
    var Qip = {
        name : 'qip101',
        varsion : '1.0.01',

        id : function(id) {
            return doc.getElementById(id);
        },

        config : {
			stopOnError : false	// allow browser messages
        },
		
		log : function() {
			var msg = '';
			for (var ida = 0; ida < arguments.length; ida++) {
				msg += arguments[ida];
				if(ida < arguments.length - 1) {
					msg += ', ';
				}
			}
			if(typeof Android !== 'undefined') {
				Android.showToast(msg);
			} else if(typeof console !== 'undefined') {
				console.log(msg);
			} else{
				// alert
				alert(msg);
			}
		},
		
        utils : {
            now : Date.now || function() {
                return new Date().getTime;
            },
            isNum : function(val) {
                return (typeof val !== 'undefined' && val !== null && !isNaN(val) && val.trim() !== '');
            },
            rand : Math.random,
            randGen : function(min, max) {
                if(!min) min = 0;
                if(!max) max = 1;
                return ((Math.random() * (max - min + 1)) + min);
            },
            sin : Math.sin,
            cos : Math.cos,
            floor : Math.floor,
            atan2 : Math.atan2,
            toHex : function(val) {
                var ret = '', pos = 0;
                while(pos < val.length){
                    ret += val.charCodeAt(pos++).toString(16);
                }
                return ret;
            }
        },
		
        // DOM coords
        getPos : function(elem) {
            var offset = getOffsets(elem);
            var scroll = getScrolls(elem);
            return {
                x: offset.x - scroll.x,
                y: offset.y - scroll.y
            };

            function getOffsets(elem) {
                var position = {
                    x: 0,
                    y: 0
                };
                while (elem && !isBody(elem)) {
                    position.x += elem.offsetLeft;
                    position.y += elem.offsetTop;
                    elem = elem.offsetParent;
                }
                return position;
            }

            function getScrolls(elem) {
                var position = {
                    x: 0,
                    y: 0
                };
                while (elem && !isBody(elem)) {
                    position.x += elem.scrollLeft;
                    position.y += elem.scrollTop;
                    elem = elem.parentNode;
                }
                return position;
            }

            function isBody(element) {
                return (/^(?:body|html)$/i).test(element.tagName);
            }
        },

        event : {
            get: function(evn, win) {
                win = win || window;
                return evn || win.event;
            },
            getWheel: function(evn) {
                return evn.wheelDelta? evn.wheelDelta / 120 : -(evn.detail || 0) / 3;
            },
            isRightClick: function(evn) {
                return (evn.which == 3 || evn.button == 2);
            },
            getPos: function(evn, win) {
                win = win || window;
                evn = evn || win.event;
                doc = doc.documentElement || doc.body;
                var touches = evn.touches || evt.changedTouches;
                if(touches && touches.length) {
                    evn = evn.touches[0];
                }
                var page = {
                    x: evn.pageX || (evn.clientX + doc.scrollLeft),
                    y: evn.pageY || (evn.clientY + doc.scrollTop)
                };
                return page;
            },
            stop: function(evn) {
                if (typeof evn.stopPropagation !== 'undefined') {
                    evn.stopPropagation();
                }
                evn.cancelBubble = true;
                if (typeof evn.preventDefault !== 'undefined') {
                    evn.preventDefault();
                }
                else {
                    evn.returnValue = false;
                }
            }
        },
		
        addEvent : function(obj, type, func) {
            if (obj.addEventListener) {
                obj.addEventListener(type, func, false);
            }else{
                obj.attachEvent('on' + type, func);
            }
        }
    };
	
    // OOP functions
    Qip.oop = {
        /*
         * extend origin with ext attrs
         * if target: extends with both origin and ext attrs
         */
        extend : function(origin, ext, target) {
            if(target) {
                for (var key in origin) {
                    Qip.log(origin[key]);
                    if (origin.hasOwnProperty(key)) {
                        target[key] = origin[key];
                    }
                }
                for (key in ext){
                    if (ext.hasOwnProperty(key)) {
                        target[key] = ext[key];
                    }
                }
                return target;
            } else {
                for (var key in ext){
                    if (ext.hasOwnProperty(key)) {
                        origin[key] = ext[key];
                    }
                }
                return origin;
            }
        },
        
        merge : function(first, second) {
            var result = {};
            for (var key in first) {
                result[key] = first[key];
            }
            for (var key in second) {
                result[key] = second[key];
            }
            return result;
        },
        
        multimerge : function() {
            var result = {};
            var args = Array.prototype.slice.call(arguments, 1);
            
            for(key in args) {
                var obj = args[key];
                if(this.type(obj) !== 'object') {
                    continue;
                }
                for (var key in obj) {
                    result[key] = obj[key];
                }
            }
            return result;
        },

        lambda : function(val) {
            if(typeof val === 'function') {
                return val
            } else {
                return function() {
                    return val;
                };
            }
        },

        type : function(obj) {
            var type = typeof obj;
            if(type === 'object'){
                //Qip.type.prototype.toString(obj).match(/^\[object\s(.*)\]$/)[1].toLowerCase();
                type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
            }
            return type;
        },

        toArray : function(obj) {
            var type = this.type(obj);
            return type ? ((type != 'array') ? [ obj ] : obj) : [];
        },

        each : function(iterable, func) {
            var type = this.type(iterable);
            if (type == 'object') {
                for ( var key in iterable)
                    func(iterable[key], key);
            } else {
                for ( var i = 0, l = iterable.length; i < l; i++) {
                    func(iterable[i], i);
                }
            }
        },

        indexOf : function(array, item) {
            if(Array.indexOf){
                return array.indexOf(item);
            }
            for(var idx=0; idx<array.length; idx++) {
                if(array[idx] === item) return idx;
            }
            return -1;
        },

        map : function(array, func) {
            var res = [];
            this.each(array, function(elem, i) {
                res.push(func(elem, i));
            });
            return res;
        },

        /*
		 * Applica iterativamente la funzione "func" archiviando il risultato in un accumulatore
         */
        reduce : function(array, func, opt) {
            var len = array.length;
            if(len==0){
                return opt;
            }
            var accum = arguments.length == 3? opt : array[--len];
            while(len--) {
                accum = func(accum, array[len]);
            }
            return accum;
        },

        merge : function() {
            var mix = {};
            for (var i = 0, l = arguments.length; i < l; i++) {
                var object = arguments[i];
                if (this.type(object) != 'object')
                    continue;
                for (var key in object) {
                    var op = object[key], mp = mix[key];
                    mix[key] = (mp && this.type(op) == 'object' && this.type(mp) == 'object') ? this.merge(mp, op) : this.unlink(op);
                }
            }
            return mix;
        },

        unlink : function(object) {
            var unlinked;
            switch (this.type(object)) {
                case 'object':
                    unlinked = {};
                    for (var p in object)
                        unlinked[p] = this.unlink(object[p]);
                    break;
                case 'array':
                    unlinked = [];
                    for ( var i = 0, l = object.length; i < l; i++)
                        unlinked[i] = this.unlink(object[i]);
                    break;
                default:
                    return object;
            }
            return unlinked;
        },
		
        zip : function() {
            if(arguments.length === 0){
                return [];
            }
            for(var j=0, ans=[], l=arguments.length, ml=arguments[0].length; j<ml; j++) {
                for(var i=0, row=[]; i<l; i++) {
                    row.push(arguments[i][j]);
                }
                ans.push(row);
            }
            return ans;
        },
		
        destroy : function(elem) {
            this.clean(elem);
            if (elem.parentNode)
                elem.parentNode.removeChild(elem);
            if (elem.clearAttributes)
                elem.clearAttributes();
        },

        clean : function(elem) {
            for (var ch = elem.childNodes, i = 0, l = ch.length; i < l; i++) {
                this.destroy(ch[i]);
            }
        }
    };
	
	Qip.errman = {
		_handling : false,
		onerror : function(msg, url, line, col, error) {
			if(!Qip.errman._handling) {
				Qip.errman._handling = true;
				
				Qip.errman._handleError(msg, url, line, col, error);
				
				// procede con la gestione errori predefinita
				return Qip.config.stopOnError;
			}
		},
		
		_handleError : function(msg, url, line, col, error) {
			if(location && location.href) {
				if(location.href !== url) {
					msg = location.href + ' ' + msg;
				}
			}
			
			//throw new Error('Error 2');
			
			msg += ' ' + url + ' ' + line;
			if(col) {
				msg += ' ' + col;
			}
			if(error) {
				msg += ' ' + error;
			}
			Qip.log(msg );
			
			Qip.errman._handling = false;
		}
	};
	
	Qip.ajax = {
		getXmlHttpRequest : function (){
			if (window.XMLHttpRequest) {
				return new window.XMLHttpRequest();
			} else if (window.ActiveXObject) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.6.0");
				} catch (e) {}
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.3.0");
				} catch (e) {}
				try {
					return new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {}
				return null;
			}
			return null;
		},
		
		// synchronous request
		call : function(page, params) {
			// this == Qip.ajax
			var xhr = this.getXmlHttpRequest();
			if(xhr) {
				xhr.open('POST', page, false);    //+ "?" + params
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.setRequestHeader('Content-length', params.length);
				xhr.setRequestHeader('Connection', 'close');
				//xhr.setRequestHeader('Access-Control-Allow-Origin', page);
				xhr.send(params);
				return xhr.responseText;
			} else {
				Qip.log('XmlHttpRequest not supported');
				return false;
			}
		},

		// asynchronous request
		xhr : null,
		makeRequest : function(page, params) {
			this.xhr = this.getXmlHttpRequest();
			if(this.xhr) {
				this.xhr.onreadystatechange = this.getResponseValue;
				this.xhr.open('POST', page, false);    //+ "?" + params
				this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				this.xhr.setRequestHeader('Content-length', params.length);
				this.xhr.setRequestHeader('Connection', 'close');
				this.xhr.send(params);
			} else {
				Qip.log('XmlHttpRequest not supported');
				return false;
			}
		},

		getResponseValue : function() {
			if (this.xhr && this.xhr.readyState === 4) { // richiesta completata
				if (this.xhr.status === 200) {   // richiesta corretta (https://developer.mozilla.org/en/HTTP/HTTP_response_codes#200)
					return this.xhr.responseText;
				}
			}
			return false;
		},
		
		socketCall : function(url, pName, pValue) {
			var socket = io.connect(url);
			socket.on('connect', function () {
				socket.send(pName + '=' + pValue);
				socket.on('message', function (msg) {
					Qip.log(msg);
				});
			});
		}
	};
	
	Qip.guid = function() {
		// Base 62 chars
		var symbols = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		var guid = '';
		for (i = 0; i < 32; ++i) {
			guid += symbols.charAt(Math.random() * symbols.length);
		}
		return guid;
	}
	
    win.qip = Qip;
	win.onerror = Qip.errman.onerror;

})(window);
