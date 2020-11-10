(this["webpackJsonpjibrel-defi-dapp"]=this["webpackJsonpjibrel-defi-dapp"]||[]).push([[1],{1120:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isAsync=void 0;var r,o=n(1361),a=(r=o)&&r.__esModule?r:{default:r};var s="function"===typeof Symbol;function i(e){return s&&"AsyncFunction"===e[Symbol.toStringTag]}t.default=function(e){return i(e)?(0,a.default)(e):e},t.isAsync=i},1132:function(e,t,n){var r=n(1141);function o(){}e.exports=o,o.prototype.setEngine=function(e){var t=this;t.engine||(t.engine=e,e.on("block",(function(e){t.currentBlock=e})),e.on("start",(function(){t.start()})),e.on("stop",(function(){t.stop()})))},o.prototype.handleRequest=function(e,t,n){throw new Error("Subproviders should override `handleRequest`.")},o.prototype.emitPayload=function(e,t){this.engine.sendAsync(r(e),t)},o.prototype.stop=function(){},o.prototype.start=function(){}},1141:function(e,t,n){var r=n(1372),o=n(280);e.exports=function(e){return o({id:r(),jsonrpc:"2.0",params:[]},e)}},1166:function(e,t,n){var r=n(141).EventEmitter,o=n(275).inherits,a=n(1114),s=n(1254),i=n(1356),u=n(1365),c=n(1368),l=(n(1260),n(1141));function d(e){r.call(this),this.setMaxListeners(30),e=e||{};var t={sendAsync:this._handleAsync.bind(this)},n=e.blockTrackerProvider||t;this._blockTracker=e.blockTracker||new s({provider:n,pollingInterval:e.pollingInterval||4e3,setSkipCacheFlag:!0}),this._ready=new c,this.currentBlock=null,this._providers=[]}function f(e){return{number:a.toBuffer(e.number),hash:a.toBuffer(e.hash),parentHash:a.toBuffer(e.parentHash),nonce:a.toBuffer(e.nonce),mixHash:a.toBuffer(e.mixHash),sha3Uncles:a.toBuffer(e.sha3Uncles),logsBloom:a.toBuffer(e.logsBloom),transactionsRoot:a.toBuffer(e.transactionsRoot),stateRoot:a.toBuffer(e.stateRoot),receiptsRoot:a.toBuffer(e.receiptRoot||e.receiptsRoot),miner:a.toBuffer(e.miner),difficulty:a.toBuffer(e.difficulty),totalDifficulty:a.toBuffer(e.totalDifficulty),size:a.toBuffer(e.size),extraData:a.toBuffer(e.extraData),gasLimit:a.toBuffer(e.gasLimit),gasUsed:a.toBuffer(e.gasUsed),timestamp:a.toBuffer(e.timestamp),transactions:e.transactions}}e.exports=d,o(d,r),d.prototype.start=function(){var e=this,t=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],this);t._ready.go(),t._blockTracker.on("latest",(function(n){t._getBlockByNumberWithRetry(n,(function(n,r){if(n)e.emit("error",n);else{if(!r)return console.log(r),void e.emit("error",new Error("Could not find block"));var o=f(r);t._setCurrentBlock(o),t.emit("rawBlock",r),t.emit("latest",r)}}))})),t._blockTracker.on("sync",t.emit.bind(t,"sync")),t._blockTracker.on("error",t.emit.bind(t,"error")),t._running=!0,t.emit("start")},d.prototype.stop=function(){this._blockTracker.removeAllListeners(),this._running=!1,this.emit("stop")},d.prototype.isRunning=function(){return this._running},d.prototype.addProvider=function(e,t){"number"===typeof t?this._providers.splice(t,0,e):this._providers.push(e),e.setEngine(this)},d.prototype.removeProvider=function(e){var t=this._providers.indexOf(e);if(t<0)throw new Error("Provider not found.");this._providers.splice(t,1)},d.prototype.send=function(e){throw new Error("Web3ProviderEngine does not support synchronous requests.")},d.prototype.sendAsync=function(e,t){var n=this;n._ready.await((function(){Array.isArray(e)?i(e,n._handleAsync.bind(n),t):n._handleAsync(e,t)}))},d.prototype._getBlockByNumberWithRetry=function(e,t){var n=this,r=5;return void o();function o(){n._getBlockByNumber(e,a)}function a(e,n){return e?t(e):n?void t(null,n):r>0?(r--,void setTimeout((function(){o()}),1e3)):void t(null,null)}},d.prototype._getBlockByNumber=function(e,t){var n=l({method:"eth_getBlockByNumber",params:[e,!1],skipCache:!0});this._handleAsync(n,(function(e,n){return e?t(e):t(null,n.result)}))},d.prototype._handleAsync=function(e,t){var n=this,r=-1,o=null,a=null,s=[];function i(n,r){a=n,o=r,u(s,(function(e,t){e?e(a,o,t):t()}),(function(){var n={id:e.id,jsonrpc:e.jsonrpc,result:o};null!=a?(n.error={message:a.stack||a.message||a,code:-32e3},t(a,n)):t(null,n)}))}!function t(o){if(r+=1,s.unshift(o),r>=n._providers.length)i(new Error('Request for method "'+e.method+'" not handled by any subprovider. Please check your subprovider configuration to ensure this method is handled.'));else try{n._providers[r].handleRequest(e,t,i)}catch(a){i(a)}}()},d.prototype._setCurrentBlock=function(e){this.currentBlock=e,this.emit("block",e)}},1168:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){t|=0;for(var n=Math.max(e.length-t,0),r=Array(n),o=0;o<n;o++)r[o]=e[t+o];return r},e.exports=t.default},1170:function(e,t,n){var r=n(1373),o=n(1374),a=n(275).inherits,s=n(1114),i=n(1261),u=n(280),c=n(1262),l=n(1132),d=n(1385),f=/^[0-9A-Fa-f]+$/g;function p(e){this.nonceLock=c(1),e.getAccounts&&(this.getAccounts=e.getAccounts),e.processTransaction&&(this.processTransaction=e.processTransaction),e.processMessage&&(this.processMessage=e.processMessage),e.processPersonalMessage&&(this.processPersonalMessage=e.processPersonalMessage),e.processTypedMessage&&(this.processTypedMessage=e.processTypedMessage),this.approveTransaction=e.approveTransaction||this.autoApprove,this.approveMessage=e.approveMessage||this.autoApprove,this.approvePersonalMessage=e.approvePersonalMessage||this.autoApprove,this.approveDecryptMessage=e.approveDecryptMessage||this.autoApprove,this.approveEncryptionPublicKey=e.approveEncryptionPublicKey||this.autoApprove,this.approveTypedMessage=e.approveTypedMessage||this.autoApprove,e.signTransaction&&(this.signTransaction=e.signTransaction||m("signTransaction")),e.signMessage&&(this.signMessage=e.signMessage||m("signMessage")),e.signPersonalMessage&&(this.signPersonalMessage=e.signPersonalMessage||m("signPersonalMessage")),e.decryptMessage&&(this.decryptMessage=e.decryptMessage||m("decryptMessage")),e.encryptionPublicKey&&(this.encryptionPublicKey=e.encryptionPublicKey||m("encryptionPublicKey")),e.signTypedMessage&&(this.signTypedMessage=e.signTypedMessage||m("signTypedMessage")),e.recoverPersonalSignature&&(this.recoverPersonalSignature=e.recoverPersonalSignature),e.publishTransaction&&(this.publishTransaction=e.publishTransaction),this.estimateGas=e.estimateGas||this.estimateGas,this.getGasPrice=e.getGasPrice||this.getGasPrice}function h(e){return e.toLowerCase()}function v(e){var t=s.addHexPrefix(e);return s.isValidAddress(t)}function g(e){var t=s.addHexPrefix(e);return!s.isValidAddress(t)&&y(e)}function y(e){return"string"===typeof e&&("0x"===e.slice(0,2)&&e.slice(2).match(f))}function m(e){return function(t,n){n(new Error('ProviderEngine - HookedWalletSubprovider - Must provide "'+e+'" fn in constructor options'))}}e.exports=p,a(p,l),p.prototype.handleRequest=function(e,t,n){var o,a,s,i,c,l=this;switch(l._parityRequests={},l._parityRequestCount=0,e.method){case"eth_coinbase":return void l.getAccounts((function(e,t){if(e)return n(e);var r=t[0]||null;n(null,r)}));case"eth_accounts":return void l.getAccounts((function(e,t){if(e)return n(e);n(null,t)}));case"eth_sendTransaction":return o=e.params[0],void r([function(e){return l.validateTransaction(o,e)},function(e){return l.processTransaction(o,e)}],n);case"eth_signTransaction":return o=e.params[0],void r([function(e){return l.validateTransaction(o,e)},function(e){return l.processSignTransaction(o,e)}],n);case"eth_sign":return c=e.params[0],i=e.params[1],s=e.params[2]||{},a=u(s,{from:c,data:i}),void r([function(e){return l.validateMessage(a,e)},function(e){return l.processMessage(a,e)}],n);case"personal_sign":return function(){var t=e.params[0];if(g(e.params[1])&&v(t)){"[message, address]. This was previously handled incorrectly, ","and has been corrected automatically. ","Please switch this param order for smooth behavior in the future.",console.warn("The eth_personalSign method requires params ordered [message, address]. This was previously handled incorrectly, and has been corrected automatically. Please switch this param order for smooth behavior in the future."),c=e.params[0],i=e.params[1]}else i=e.params[0],c=e.params[1];s=e.params[2]||{},a=u(s,{from:c,data:i}),r([function(e){return l.validatePersonalMessage(a,e)},function(e){return l.processPersonalMessage(a,e)}],n)}();case"eth_decryptMessage":return function(){var t=e.params[0];if(g(e.params[1])&&v(t)){"[message, address]. This was previously handled incorrectly, ","and has been corrected automatically. ","Please switch this param order for smooth behavior in the future.",console.warn("The eth_decryptMessage method requires params ordered [message, address]. This was previously handled incorrectly, and has been corrected automatically. Please switch this param order for smooth behavior in the future."),c=e.params[0],i=e.params[1]}else i=e.params[0],c=e.params[1];s=e.params[2]||{},a=u(s,{from:c,data:i}),r([function(e){return l.validateDecryptMessage(a,e)},function(e){return l.processDecryptMessage(a,e)}],n)}();case"encryption_public_key":return function(){var t=e.params[0];r([function(e){return l.validateEncryptionPublicKey(t,e)},function(e){return l.processEncryptionPublicKey(t,e)}],n)}();case"personal_ecRecover":return function(){i=e.params[0];var t=e.params[1];s=e.params[2]||{},a=u(s,{sig:t,data:i}),l.recoverPersonalSignature(a,n)}();case"eth_signTypedData":case"eth_signTypedData_v3":case"eth_signTypedData_v4":return function(){var t=e.params[0],o=e.params[1];v(t)?(c=t,i=o):(i=t,c=o),s=e.params[2]||{},a=u(s,{from:c,data:i}),r([function(e){return l.validateTypedMessage(a,e)},function(e){return l.processTypedMessage(a,e)}],n)}();case"parity_postTransaction":return o=e.params[0],void l.parityPostTransaction(o,n);case"parity_postSign":return c=e.params[0],i=e.params[1],void l.parityPostSign(c,i,n);case"parity_checkRequest":return function(){var t=e.params[0];l.parityCheckRequest(t,n)}();case"parity_defaultAccount":return void l.getAccounts((function(e,t){if(e)return n(e);var r=t[0]||null;n(null,r)}));default:return void t()}},p.prototype.getAccounts=function(e){e(null,[])},p.prototype.processTransaction=function(e,t){var n=this;r([function(t){return n.approveTransaction(e,t)},function(e,t){return n.checkApproval("transaction",e,t)},function(t){return n.finalizeAndSubmitTx(e,t)}],t)},p.prototype.processSignTransaction=function(e,t){var n=this;r([function(t){return n.approveTransaction(e,t)},function(e,t){return n.checkApproval("transaction",e,t)},function(t){return n.finalizeTx(e,t)}],t)},p.prototype.processMessage=function(e,t){var n=this;r([function(t){return n.approveMessage(e,t)},function(e,t){return n.checkApproval("message",e,t)},function(t){return n.signMessage(e,t)}],t)},p.prototype.processPersonalMessage=function(e,t){var n=this;r([function(t){return n.approvePersonalMessage(e,t)},function(e,t){return n.checkApproval("message",e,t)},function(t){return n.signPersonalMessage(e,t)}],t)},p.prototype.processDecryptMessage=function(e,t){var n=this;r([function(t){return n.approveDecryptMessage(e,t)},function(e,t){return n.checkApproval("decryptMessage",e,t)},function(t){return n.decryptMessage(e,t)}],t)},p.prototype.processEncryptionPublicKey=function(e,t){var n=this;r([function(t){return n.approveEncryptionPublicKey(e,t)},function(e,t){return n.checkApproval("encryptionPublicKey",e,t)},function(t){return n.encryptionPublicKey(e,t)}],t)},p.prototype.processTypedMessage=function(e,t){var n=this;r([function(t){return n.approveTypedMessage(e,t)},function(e,t){return n.checkApproval("message",e,t)},function(t){return n.signTypedMessage(e,t)}],t)},p.prototype.autoApprove=function(e,t){t(null,!0)},p.prototype.checkApproval=function(e,t,n){n(t?null:new Error("User denied "+e+" signature."))},p.prototype.parityPostTransaction=function(e,t){var n=this,r=n._parityRequestCount,o="0x".concat(r.toString(16));n._parityRequestCount++,n.emitPayload({method:"eth_sendTransaction",params:[e]},(function(e,t){if(e)n._parityRequests[o]={error:e};else{var r=t.result;n._parityRequests[o]=r}})),t(null,o)},p.prototype.parityPostSign=function(e,t,n){var r=this,o=r._parityRequestCount,a="0x".concat(o.toString(16));r._parityRequestCount++,r.emitPayload({method:"eth_sign",params:[e,t]},(function(e,t){if(e)r._parityRequests[a]={error:e};else{var n=t.result;r._parityRequests[a]=n}})),n(null,a)},p.prototype.parityCheckRequest=function(e,t){var n=this._parityRequests[e]||null;return n?n.error?t(n.error):void t(null,n):t(null,null)},p.prototype.recoverPersonalSignature=function(e,t){var n;try{n=i.recoverPersonalSignature(e)}catch(r){return t(r)}t(null,n)},p.prototype.validateTransaction=function(e,t){if(void 0===e.from)return t(new Error("Undefined address - from address required to sign transaction."));this.validateSender(e.from,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to sign transaction for this address: "'.concat(e.from,'"')))}))},p.prototype.validateMessage=function(e,t){if(void 0===e.from)return t(new Error("Undefined address - from address required to sign message."));this.validateSender(e.from,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to sign message for this address: "'.concat(e.from,'"')))}))},p.prototype.validatePersonalMessage=function(e,t){return void 0===e.from?t(new Error("Undefined address - from address required to sign personal message.")):void 0===e.data?t(new Error("Undefined message - message required to sign personal message.")):y(e.data)?void this.validateSender(e.from,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to sign message for this address: "'.concat(e.from,'"')))})):t(new Error("HookedWalletSubprovider - validateMessage - message was not encoded as hex."))},p.prototype.validateDecryptMessage=function(e,t){return void 0===e.from?t(new Error("Undefined address - from address required to decrypt message.")):void 0===e.data?t(new Error("Undefined message - message required to decrypt message.")):y(e.data)?void this.validateSender(e.from,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to decrypt message for this address: "'.concat(e.from,'"')))})):t(new Error("HookedWalletSubprovider - validateDecryptMessage - message was not encoded as hex."))},p.prototype.validateEncryptionPublicKey=function(e,t){this.validateSender(e,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to obtain encryption public key for this address: "'.concat(e,'"')))}))},p.prototype.validateTypedMessage=function(e,t){return void 0===e.from?t(new Error("Undefined address - from address required to sign typed data.")):void 0===e.data?t(new Error("Undefined data - message required to sign typed data.")):void this.validateSender(e.from,(function(n,r){return n?t(n):r?void t():t(new Error('Unknown address - unable to sign message for this address: "'.concat(e.from,'"')))}))},p.prototype.validateSender=function(e,t){if(!e)return t(null,!1);this.getAccounts((function(n,r){if(n)return t(n);var o=-1!==r.map(h).indexOf(e.toLowerCase());t(null,o)}))},p.prototype.finalizeAndSubmitTx=function(e,t){var n=this;n.nonceLock.take((function(){r([n.fillInTxExtras.bind(n,e),n.signTransaction.bind(n),n.publishTransaction.bind(n)],(function(e,r){if(n.nonceLock.leave(),e)return t(e);t(null,r)}))}))},p.prototype.finalizeTx=function(e,t){var n=this;n.nonceLock.take((function(){r([n.fillInTxExtras.bind(n,e),n.signTransaction.bind(n)],(function(r,o){if(n.nonceLock.leave(),r)return t(r);t(null,{raw:o,tx:e})}))}))},p.prototype.publishTransaction=function(e,t){this.emitPayload({method:"eth_sendRawTransaction",params:[e]},(function(e,n){if(e)return t(e);t(null,n.result)}))},p.prototype.estimateGas=function(e,t){d(this.engine,e,t)},p.prototype.getGasPrice=function(e){this.emitPayload({method:"eth_gasPrice",params:[]},(function(t,n){if(t)return e(t);e(null,n.result)}))},p.prototype.fillInTxExtras=function(e,t){var n=e.from,r={};void 0===e.gasPrice&&(r.gasPrice=this.getGasPrice.bind(this)),void 0===e.nonce&&(r.nonce=this.emitPayload.bind(this,{method:"eth_getTransactionCount",params:[n,"pending"]})),void 0===e.gas&&(r.gas=this.estimateGas.bind(this,function(e){return{from:e.from,to:e.to,value:e.value,data:e.data,gas:e.gas,gasPrice:e.gasPrice,nonce:e.nonce}}(e))),o(r,(function(n,r){if(n)return t(n);var o={};r.gasPrice&&(o.gasPrice=r.gasPrice),r.nonce&&(o.nonce=r.nonce.result),r.gas&&(o.gas=r.gas),t(null,u(e,o))}))}},1172:function(e,t,n){var r=n(91),o=n(192),a=n(193),s=n(1212),i=n(1263),u=function(e){"use strict";a(n,e);var t=o(n);function n(){return r(this,n),t.call(this,(function(e){var t=e.blockTracker,n=e.provider,r=e.engine,o=i({blockTracker:t,provider:n}),a=o.events,s=o.middleware;return a.on("notification",(function(e){return r.emit("data",null,e)})),s}))}return n}(s);e.exports=u},1173:function(e,t,n){var r=n(91),o=n(192),a=n(193),s=n(1212),i=n(1214),u=function(e){"use strict";a(n,e);var t=o(n);function n(){return r(this,n),t.call(this,(function(e){var t=e.blockTracker,n=e.provider;e.engine;return i({blockTracker:t,provider:n})}))}return n}(s);e.exports=u},1203:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(){if(null!==e){var t=e;e=null,t.apply(this,arguments)}}},e.exports=t.default},1204:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(){if(null===e)throw new Error("Callback was already called.");var t=e;e=null,t.apply(this,arguments)}},e.exports=t.default},1212:function(e,t,n){var r=n(91),o=n(92),a=n(192),s=n(193),i=function(e){"use strict";s(n,e);var t=a(n);function n(e){var o;if(r(this,n),o=t.call(this),!e)throw new Error("JsonRpcEngineMiddlewareSubprovider - no constructorFn specified");return o._constructorFn=e,o}return o(n,[{key:"setEngine",value:function(e){if(this.middleware)throw new Error("JsonRpcEngineMiddlewareSubprovider - subprovider added to engine twice");var t=e._blockTracker,n=this._constructorFn({engine:e,provider:e,blockTracker:t});if(!n)throw new Error("JsonRpcEngineMiddlewareSubprovider - _constructorFn did not return middleware");if("function"!==typeof n)throw new Error("JsonRpcEngineMiddlewareSubprovider - specified middleware is not a function");this.middleware=n}},{key:"handleRequest",value:function(e,t,n){var r={id:e.id};this.middleware(e,r,(function(e){t((function(t,n,o){t?(delete r.result,r.error={message:t.message||t}):r.result=n,e?e(o):o()}))}),(function(e){if(e)return n(e);n(null,r.result)}))}}]),n}(n(1132));e.exports=i},1256:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){((0,r.default)(e)?f:p)(e,(0,l.default)(t),n)};var r=d(n(142)),o=d(n(1257)),a=d(n(1358)),s=d(n(1259)),i=d(n(1108)),u=d(n(1203)),c=d(n(1204)),l=d(n(1120));function d(e){return e&&e.__esModule?e:{default:e}}function f(e,t,n){n=(0,u.default)(n||i.default);var r=0,a=0,s=e.length;function l(e,t){e?n(e):++a!==s&&t!==o.default||n(null)}for(0===s&&n(null);r<s;r++)t(e[r],r,(0,c.default)(l))}var p=(0,s.default)(a.default,1/0);e.exports=t.default},1257:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={},e.exports=t.default},1258:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(t,n,u){if(u=(0,o.default)(u||r.default),e<=0||!t)return u(null);var c=(0,a.default)(t),l=!1,d=0,f=!1;function p(e,t){if(d-=1,e)l=!0,u(e);else{if(t===i.default||l&&d<=0)return l=!0,u(null);f||h()}}function h(){for(f=!0;d<e&&!l;){var t=c();if(null===t)return l=!0,void(d<=0&&u(null));d+=1,n(t.value,t.key,(0,s.default)(p))}f=!1}h()}};var r=u(n(1108)),o=u(n(1203)),a=u(n(1359)),s=u(n(1204)),i=u(n(1257));function u(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1259:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){return function(n,r,o){return e(n,t,r,o)}},e.exports=t.default},1260:function(e,t,n){var r=n(1205);function o(e){return"never"!==i(e)}function a(e){var t=s(e);return t>=e.params.length?e.params:"eth_getBlockByNumber"===e.method?e.params.slice(1):e.params.slice(0,t)}function s(e){switch(e.method){case"eth_getStorageAt":return 2;case"eth_getBalance":case"eth_getCode":case"eth_getTransactionCount":case"eth_call":case"eth_estimateGas":return 1;case"eth_getBlockByNumber":return 0;default:return}}function i(e){switch(e.method){case"web3_clientVersion":case"web3_sha3":case"eth_protocolVersion":case"eth_getBlockTransactionCountByHash":case"eth_getUncleCountByBlockHash":case"eth_getCode":case"eth_getBlockByHash":case"eth_getTransactionByHash":case"eth_getTransactionByBlockHashAndIndex":case"eth_getTransactionReceipt":case"eth_getUncleByBlockHashAndIndex":case"eth_getCompilers":case"eth_compileLLL":case"eth_compileSolidity":case"eth_compileSerpent":case"shh_version":return"perma";case"eth_getBlockByNumber":case"eth_getBlockTransactionCountByNumber":case"eth_getUncleCountByBlockNumber":case"eth_getTransactionByBlockNumberAndIndex":case"eth_getUncleByBlockNumberAndIndex":return"fork";case"eth_gasPrice":case"eth_getBalance":case"eth_getStorageAt":case"eth_getTransactionCount":case"eth_call":case"eth_estimateGas":case"eth_getFilterLogs":case"eth_getLogs":case"eth_blockNumber":return"block";case"net_version":case"net_peerCount":case"net_listening":case"eth_syncing":case"eth_sign":case"eth_coinbase":case"eth_mining":case"eth_hashrate":case"eth_accounts":case"eth_sendTransaction":case"eth_sendRawTransaction":case"eth_newFilter":case"eth_newBlockFilter":case"eth_newPendingTransactionFilter":case"eth_uninstallFilter":case"eth_getFilterChanges":case"eth_getWork":case"eth_submitWork":case"eth_submitHashrate":case"db_putString":case"db_getString":case"db_putHex":case"db_getHex":case"shh_post":case"shh_newIdentity":case"shh_hasIdentity":case"shh_newGroup":case"shh_addToGroup":case"shh_newFilter":case"shh_uninstallFilter":case"shh_getFilterChanges":case"shh_getMessages":return"never"}}e.exports={cacheIdentifierForPayload:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!o(e))return null;var n=t.includeBlockRef,s=n?e.params:a(e);return e.method+":"+r(s)},canCache:o,blockTagForPayload:function(e){var t=s(e);if(t>=e.params.length)return null;return e.params[t]},paramsWithoutBlockTag:a,blockTagParamIndex:s,cacheTypeForPayload:i}},1356:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(n(1357)),o=a(n(1364));function a(e){return e&&e.__esModule?e:{default:e}}t.default=(0,r.default)(o.default),e.exports=t.default},1357:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(t,n,a){return e(r.default,t,(0,o.default)(n),a)}};var r=a(n(1256)),o=a(n(1120));function a(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1358:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a){(0,r.default)(t)(e,(0,o.default)(n),a)};var r=a(n(1258)),o=a(n(1120));function a(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1359:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){if((0,r.default)(e))return function(e){var t=-1,n=e.length;return function(){return++t<n?{value:e[t],key:t}:null}}(e);var t=(0,o.default)(e);return t?function(e){var t=-1;return function(){var n=e.next();return n.done?null:(t++,{value:n.value,key:t})}}(t):function(e){var t=(0,a.default)(e),n=-1,r=t.length;return function(){var o=t[++n];return n<r?{value:e[o],key:o}:null}}(e)};var r=s(n(142)),o=s(n(1360)),a=s(n(197));function s(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1360:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return r&&e[r]&&e[r]()};var r="function"===typeof Symbol&&Symbol.iterator;e.exports=t.default},1361:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return(0,o.default)((function(t,n){var o;try{o=e.apply(this,t)}catch(a){return n(a)}(0,r.default)(o)&&"function"===typeof o.then?o.then((function(e){i(n,null,e)}),(function(e){i(n,e.message?e:new Error(e))})):n(null,o)}))};var r=s(n(73)),o=s(n(1362)),a=s(n(1363));function s(e){return e&&e.__esModule?e:{default:e}}function i(e,t,n){try{e(t,n)}catch(r){(0,a.default)(u,r)}}function u(e){throw e}e.exports=t.default},1362:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(){var t=(0,a.default)(arguments),n=t.pop();e.call(this,t,n)}};var r,o=n(1168),a=(r=o)&&r.__esModule?r:{default:r};e.exports=t.default},1363:function(e,t,n){"use strict";(function(e,r){Object.defineProperty(t,"__esModule",{value:!0}),t.hasNextTick=t.hasSetImmediate=void 0,t.fallback=l,t.wrap=d;var o,a=n(1168),s=(o=a)&&o.__esModule?o:{default:o};var i,u=t.hasSetImmediate="function"===typeof e&&e,c=t.hasNextTick="object"===typeof r&&"function"===typeof r.nextTick;function l(e){setTimeout(e,0)}function d(e){return function(t){var n=(0,s.default)(arguments,1);e((function(){t.apply(null,n)}))}}i=u?e:c?r.nextTick:l,t.default=d(i)}).call(this,n(282).setImmediate,n(40))},1364:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,a){a=a||r.default,t=t||[];var s=[],i=0,u=(0,o.default)(n);e(t,(function(e,t,n){var r=i++;u(e,(function(e,t){s[r]=t,n(e)}))}),(function(e){a(e,s)}))};var r=a(n(1108)),o=a(n(1120));function a(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1365:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a(n(1366)),o=a(n(1259));function a(e){return e&&e.__esModule?e:{default:e}}t.default=(0,o.default)(r.default,1),e.exports=t.default},1366:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n,s){(0,r.default)(t)(e,(0,o.default)((0,a.default)(n)),s)};var r=s(n(1258)),o=s(n(1367)),a=s(n(1120));function s(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1367:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(t,n,r){return e(t,r)}},e.exports=t.default},1368:function(e,t,n){var r=n(141).EventEmitter,o=n(275).inherits;function a(){r.call(this),this.isLocked=!0}e.exports=a,o(a,r),a.prototype.go=function(){this.isLocked=!1,this.emit("unlock")},a.prototype.stop=function(){this.isLocked=!0,this.emit("lock")},a.prototype.await=function(e){this.isLocked?this.once("unlock",e):setTimeout(e)}},1372:function(e,t){e.exports=function(){return Math.floor(Number.MAX_SAFE_INTEGER*Math.random())}},1373:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){if(t=(0,a.default)(t||o.default),!(0,r.default)(e))return t(new Error("First argument to waterfall must be an array of functions"));if(!e.length)return t();var n=0;function c(t){var r=(0,u.default)(e[n++]);t.push((0,i.default)(l)),r.apply(null,t)}function l(r){if(r||n===e.length)return t.apply(null,arguments);c((0,s.default)(arguments,1))}c([])};var r=c(n(65)),o=c(n(1108)),a=c(n(1203)),s=c(n(1168)),i=c(n(1204)),u=c(n(1120));function c(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1374:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){(0,o.default)(r.default,e,t)};var r=a(n(1256)),o=a(n(1375));function a(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1375:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,n){n=n||r.default;var i=(0,o.default)(t)?[]:{};e(t,(function(e,t,n){(0,s.default)(e)((function(e,r){arguments.length>2&&(r=(0,a.default)(arguments,1)),i[t]=r,n(e)}))}),(function(e){n(e,i)}))};var r=i(n(1108)),o=i(n(142)),a=i(n(1168)),s=i(n(1120));function i(e){return e&&e.__esModule?e:{default:e}}e.exports=t.default},1385:function(e,t,n){var r=n(1141);e.exports=function(e,t,n){e.sendAsync(r({method:"eth_estimateGas",params:[t]}),(function(e,t){if(e)return"no contract code at given address"===e.message?n(null,"0xcf08"):n(e);n(null,t.result)}))}}}]);
//# sourceMappingURL=1.a87534e1.chunk.js.map