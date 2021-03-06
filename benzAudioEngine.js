(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.benzAudioEngine = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author BenzLeung(https://github.com/BenzLeung)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @date 2017/3/30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by JetBrains PhpStorm.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 每位工程师都有保持代码优雅的义务
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * each engineer has a duty to keep the code elegant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _audioContext = require('./audioContext');

var _audioContext2 = _interopRequireDefault(_audioContext);

var _bufferCache = require('./bufferCache');

var _bufferCache2 = _interopRequireDefault(_bufferCache);

var _lifeAudio = require('./lifeAudio');

var _lifeAudio2 = _interopRequireDefault(_lifeAudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BenzAudio = function () {
    function BenzAudio(src, loopStart, loopEnd) {
        _classCallCheck(this, BenzAudio);

        this._bufferObj = _bufferCache2.default.load(src);
        this._id = 0;
        this._startTime = 0;
        this._playedTime = 0;
        this._paused = true;
        this._source = null;
        this._loopStart = loopStart;
        this._loopEnd = loopEnd;
        if (this._bufferObj) {
            this._id = _lifeAudio2.default.save(this);
        }
    }

    _createClass(BenzAudio, [{
        key: '_createNode',
        value: function _createNode() {
            var _this = this;

            if (!this._bufferObj) {
                return;
            }
            var buffer = this._bufferObj.getBuffer();
            if (!buffer) {
                return;
            }
            var s = _audioContext2.default['createBufferSource']();
            s['buffer'] = buffer;
            s['connect'](_audioContext2.default.desNode);
            s['onended'] = function () {
                if (!_this._paused) {
                    _lifeAudio2.default.release(_this._id);
                }
            };
            if (this._loopEnd) {
                s['loop'] = true;
                s['loopStart'] = this._loopStart;
                s['loopEnd'] = this._loopEnd;
            }
            this._source = s;
        }
    }, {
        key: 'play',
        value: function play() {
            if (this._source && !this._paused) {
                return this._id;
            }
            this._paused = false;
            this._createNode();
            if (!this._source) {
                return 0;
            }
            this._startTime = _audioContext2.default.currentTime - this._playedTime;
            if (this._source.start) this._source.start(0, this._playedTime);else if (this._source['noteGrainOn']) this._source['noteGrainOn'](0, this._playedTime);else this._source['noteOn'](0, this._playedTime);
            return this._id;
        }
    }, {
        key: 'pause',
        value: function pause() {
            this._playedTime = _audioContext2.default.currentTime - this._startTime;
            this._paused = true;
            if (this._loopEnd) {
                while (this._playedTime >= this._loopEnd) {
                    this._playedTime -= this._loopEnd - this._loopStart;
                }
            }
            if (this._source) {
                this._source.stop();
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            this._paused = false;
            if (this._source) {
                this._source.stop();
            }
            _lifeAudio2.default.release(this._id);
        }
    }]);

    return BenzAudio;
}();

exports.default = BenzAudio;

},{"./audioContext":3,"./bufferCache":5,"./lifeAudio":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @file 加载音频文件并缓存
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author BenzLeung(https://github.com/BenzLeung)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @date 2017/3/30
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by JetBrains PhpStorm.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 每位工程师都有保持代码优雅的义务
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * each engineer has a duty to keep the code elegant
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _audioContext = require('./audioContext');

var _audioContext2 = _interopRequireDefault(_audioContext);

var _bufferCache = require('./bufferCache');

var _bufferCache2 = _interopRequireDefault(_bufferCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BenzBuffer = function () {
    function BenzBuffer(src, buffer) {
        _classCallCheck(this, BenzBuffer);

        var inCache = _bufferCache2.default.load(src);
        if (inCache) {
            return inCache;
        }
        this._src = src;
        this._buffer = buffer || _audioContext2.default['createBuffer'](1, 1, 22050);
        this._isLoaded = !!buffer;
        this._onLoadFuncQueue = [];
        _bufferCache2.default.save(src, this);
        if (!this._isLoaded) {
            this._load();
        }
    }

    _createClass(BenzBuffer, [{
        key: '_load',
        value: function _load() {
            var _this = this;

            var request = new XMLHttpRequest();
            request.open('GET', this._src, true);
            request.responseType = 'arraybuffer';
            request.onload = function () {
                _audioContext2.default['decodeAudioData'](request.response, function (data) {
                    _this._buffer = data;
                    _this._isLoaded = true;
                    for (var i = 0, len = _this._onLoadFuncQueue.length; i < len; i++) {
                        var cb = _this._onLoadFuncQueue[i];
                        if (typeof cb === 'function') {
                            cb();
                        }
                    }
                    _this._onLoadFuncQueue = [];
                }, function () {
                    //decode fail
                    _this._isLoaded = true;
                    for (var i = 0, len = _this._onLoadFuncQueue.length; i < len; i++) {
                        var cb = _this._onLoadFuncQueue[i];
                        if (typeof cb === 'function') {
                            cb();
                        }
                    }
                    _this._onLoadFuncQueue = [];
                });
            };
            request.send();
        }
    }, {
        key: 'onload',
        value: function onload(fn) {
            if (typeof fn !== 'function') {
                return;
            }
            if (this._isLoaded) {
                fn();
            } else {
                this._onLoadFuncQueue.push(fn);
            }
        }
    }, {
        key: 'getBuffer',
        value: function getBuffer() {
            return this._buffer;
        }
    }, {
        key: 'createSprite',
        value: function createSprite(startTime, endTime, customName) {
            var _this2 = this;

            var name = customName || '';
            if (!name) {
                var i = 1;
                while (_bufferCache2.default.load(this._src + '$' + i)) {
                    i++;
                }
                name = this._src + '$' + i;
            }

            this.onload(function () {
                var sampleRate = _this2._buffer['sampleRate'];
                var startSample = Math.floor(sampleRate * startTime);
                var endSample = Math.ceil(sampleRate * endTime);
                var numberOfChannels = _this2._buffer['numberOfChannels'];

                var spriteBuffer = _audioContext2.default['createBuffer'](numberOfChannels, endSample - startSample, sampleRate);
                for (var c = 0; c < numberOfChannels; c++) {
                    var target = spriteBuffer['getChannelData'](c);
                    var source = _this2._buffer['getChannelData'](c);
                    for (var s = startSample, t = 0; s < endSample; s++, t++) {
                        target[t] = source[s];
                    }
                }

                new BenzBuffer(name, spriteBuffer);
            });
            return name;
        }
    }]);

    return BenzBuffer;
}();

exports.default = BenzBuffer;

},{"./audioContext":3,"./bufferCache":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @file 公共的 Web Audio API Context
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

var ctx = null;
var volumeNode = void 0;
var compressor = void 0;
var isMuted = false;
var volumeBeforeMuted = 1.0;

/*let emptyFunc = () => {};
ctx.setGlobalVolume = emptyFunc;
ctx.getGlobalVolume = emptyFunc;
ctx.setGlobalMuted = emptyFunc;
ctx.getGlobalMuted = emptyFunc;
ctx.desNode = null;*/

if (AudioContext) {
    ctx = new AudioContext();
    volumeNode = ctx['createGain']();
    compressor = ctx['createDynamicsCompressor']();
    compressor['connect'](volumeNode);
    volumeNode['connect'](ctx['destination']);
    volumeNode['gain'].value = 1.0;
    ctx.desNode = compressor;

    ctx.setGlobalVolume = function (vol) {
        if (!isMuted) {
            volumeNode['gain'].value = vol;
        }
        volumeBeforeMuted = vol;
    };
    ctx.getGlobalVolume = function () {
        return volumeBeforeMuted;
    };
    ctx.setGlobalMuted = function (muted) {
        isMuted = muted;
        if (muted) {
            volumeNode['gain'].value = 0;
        } else {
            volumeNode['gain'].value = volumeBeforeMuted;
        }
    };
    ctx.getGlobalMuted = function () {
        return isMuted;
    };
}

exports.default = ctx;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _audioContext = require('./audioContext');

var _audioContext2 = _interopRequireDefault(_audioContext);

var _bufferCache = require('./bufferCache');

var _bufferCache2 = _interopRequireDefault(_bufferCache);

var _lifeAudio = require('./lifeAudio');

var _lifeAudio2 = _interopRequireDefault(_lifeAudio);

var _BenzBuffer = require('./BenzBuffer');

var _BenzBuffer2 = _interopRequireDefault(_BenzBuffer);

var _BenzAudio = require('./BenzAudio');

var _BenzAudio2 = _interopRequireDefault(_BenzAudio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyFunc = function emptyFunc() {}; /**
                                          * @file 一个简单的声音引擎，基于 Web Audio API，es6版本
                                          * @author BenzLeung(https://github.com/BenzLeung)
                                          * @date 2017/3/30
                                          * @license MIT
                                          * @version 0.2.3
                                          * Created by JetBrains PhpStorm.
                                          *
                                          * 每位工程师都有保持代码优雅的义务
                                          * each engineer has a duty to keep the code elegant
                                          */

var benzAudioEngine = {
    support: function support() {
        return false;
    },
    load: emptyFunc,
    unload: emptyFunc,
    sprite: emptyFunc,
    play: emptyFunc,
    pause: emptyFunc,
    stop: emptyFunc,
    setVolume: emptyFunc,
    setMuted: emptyFunc,
    getMuted: function getMuted() {
        return true;
    },
    pauseAll: emptyFunc,
    stopAll: emptyFunc
};

if (_audioContext2.default) {
    benzAudioEngine = {

        /**
         * 是否支持 Web Audio API
         * @return {boolean}
         */
        support: function support() {
            return true;
        },

        /**
         * 加载音频文件
         * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
         * @param {function} [callback] 所有音频文件加载完毕后的回调
         */
        load: function load(srcArray, callback) {
            if (!(srcArray instanceof Array)) {
                srcArray = [srcArray];
            }
            var loadedCount = 0;
            var buf = void 0;

            var _loop = function _loop(i, len) {
                buf = new _BenzBuffer2.default(srcArray[i]);
                buf.onload(function () {
                    loadedCount++;
                    if (loadedCount >= len) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                });
            };

            for (var i = 0, len = srcArray.length; i < len; i++) {
                _loop(i, len);
            }
        },

        /**
         * 卸载音频文件，释放内存
         * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
         */
        unload: function unload(srcArray) {
            if (!(srcArray instanceof Array)) {
                srcArray = [srcArray];
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = srcArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var s = _step.value;

                    _bufferCache2.default.release(s);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        },

        /**
         * 建立 Audio Sprites。也就是把某个音频的某一小片段取出来。
         * @param {string} src 音频文件路径
         * @param {object} spriteData 使用一个固定格式定义小片段的名字、开始时间、结束时间
         *                 {
         *                    '名字1' : [开始时间, 结束时间],
         *                    '名字2' : [开始时间, 结束时间],
         *                    ...
         *                 }
         * @example
         *      benzAudioEngine.sprite('path/to/a.mp3', {
         *         'a.mp3$1' : [0.0, 1.5],
         *         'a.mp3$2' : [1.85, 2.63],
         *         'feel free to name the sprite' : [3.14, 6.66]
         *      });
         *      benzAudioEngine.play('a.mp3$1');
         *      benzAudioEngine.play('a.mp3$2');
         *      benzAudioEngine.play('feel free to name the sprite');
         */
        sprite: function sprite(src, spriteData) {
            var sourceBuffer = _bufferCache2.default.load(src);
            for (var name in spriteData) {
                if (spriteData.hasOwnProperty(name)) {
                    sourceBuffer.createSprite(spriteData[name][0], spriteData[name][1], name);
                }
            }
        },

        /**
         * 播放音频文件，若文件尚未加载，则不播放（不会自动加载，也不会返回任何提示，
         *      因为游戏音效宁可不发声也不要延时发声）
         * @param {string} src 音频文件路径
         * @param {number} [loopStart] 循环开始时间
         * @param {number} [loopEnd] 循环结束时间，若不指定，则音频只播放一次
         * @return {int} 返回一个ID值，这个ID值用于操作暂停和停止，若不需要暂停和停止，
         *               则不需要理会这个返回值（不设置循环的话，音频播放完毕会自动停止）
         */
        play: function play(src, loopStart, loopEnd) {
            var a = new _BenzAudio2.default(src, loopStart, loopEnd);
            return a.play();
        },


        /**
         * 暂停某个音频
         * @param {int} id 要暂停的音频的ID
         */
        pause: function pause(id) {
            var a = _lifeAudio2.default.load(id);
            if (a) {
                a.pause();
            }
        },


        /**
         * 继续播放某个音频
         * @param {int} id 已经暂停的音频的ID
         */
        resume: function resume(id) {
            var a = _lifeAudio2.default.load(id);
            if (a) {
                a.play();
            }
        },


        /**
         * 停止某个音频
         * @param {int} id 要暂停的音频的ID
         */
        stop: function stop(id) {
            var a = _lifeAudio2.default.load(id);
            if (a) {
                a.stop();
            }
        },


        /**
         * 设置音量，这是所有音频的统一音量，暂时没有对某个音频单独设置音量的功能
         * @param {number} vol 音量值，范围是 0.0 - 1.0
         */
        setVolume: function setVolume(vol) {
            _audioContext2.default.setGlobalVolume(vol);
        },

        /**
         * 获得当前音量
         * @return {number} 音量，0.0 - 1.0
         */
        getVolume: function getVolume() {
            return _audioContext2.default.getGlobalVolume();
        },

        /**
         * 设置静音，所有音频都静音，暂时没有对某个音频单独设置的功能
         * @param {boolean} muted 是否静音，true 为静音， false 为不静音
         */
        setMuted: function setMuted(muted) {
            _audioContext2.default.setGlobalMuted(muted);
        },

        /**
         * 获得当前是否已静音
         * @return {boolean}
         */
        getMuted: function getMuted() {
            return _audioContext2.default.getGlobalMuted();
        },

        /**
         * 暂停所有音频
         */
        pauseAll: function pauseAll() {
            var all = _lifeAudio2.default.getAll();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = all[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var a = _step2.value;

                    if (a) {
                        a.pause();
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        },

        /**
         * 停止所有音频
         */
        stopAll: function stopAll() {
            var all = _lifeAudio2.default.getAll();
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = all[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var a = _step3.value;

                    if (a) {
                        a.stop();
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    };
}

exports.default = benzAudioEngine;

},{"./BenzAudio":1,"./BenzBuffer":2,"./audioContext":3,"./bufferCache":5,"./lifeAudio":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @file 缓存已经 load 过的 buffer
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var resList = {};

function save(src, bufferObject) {
    if (bufferObject) {
        resList[src] = bufferObject;
    }
}

function load(src) {
    if (resList.hasOwnProperty(src)) {
        return resList[src];
    }
    return null;
}

function release(src) {
    if (resList.hasOwnProperty(src)) {
        delete resList[src];
    }
}

exports.default = {
    save: save,
    load: load,
    release: release
};

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @file 存储正在播放的音频，并分配id
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var nextId = 1;
var idRecycled = [];
var audioMap = {};

function allocId() {
    if (idRecycled.length) {
        return idRecycled.shift();
    }
    return nextId++;
}

function recycledId(id) {
    idRecycled.push(id);
}

function save(audioObject) {
    var id = allocId();
    audioMap[id] = audioObject;
    return id;
}

function load(id) {
    if (audioMap.hasOwnProperty(id)) {
        return audioMap[id];
    }
    return null;
}

function release(id) {
    if (audioMap.hasOwnProperty(id)) {
        delete audioMap[id];
        recycledId(id);
    }
}

function getAll() {
    return [].concat(_toConsumableArray(audioMap.values()));
}

exports.default = {
    save: save,
    load: load,
    release: release,
    getAll: getAll
};

},{}],7:[function(require,module,exports){
'use strict';

/**
 * @file browserify 入口
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/12/9
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

module.exports = require('./benzAudioEngine.js').default;

},{"./benzAudioEngine.js":4}]},{},[7])(7)
});