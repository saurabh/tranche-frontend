(this["webpackJsonpjibrel-defi-dapp"]=this["webpackJsonpjibrel-defi-dapp"]||[]).push([[41],{839:function(n,e,t){"use strict";t.r(e);var r=t(15),a=t.n(r),i=(t(223),t(224));t(47),t(83),t(168);function o(n,e,t,r,a,i,o){try{var u=n[i](o),s=u.value}catch(c){return void t(c)}u.done?e(s):Promise.resolve(s).then(r,a)}function u(n){return function(){var e=this,t=arguments;return new Promise((function(r,a){var i=n.apply(e,t);function u(n){o(i,r,a,u,s,"next",n)}function s(n){o(i,r,a,u,s,"throw",n)}u(void 0)}))}}e.default=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=n.heading,t=n.description,r=n.icon,o=n.html,s=n.button;return function(){var n=u(a.a.mark((function n(u){var c,d,l,p;return a.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(c=u.wallet,d=u.address,l=u.stateSyncStatus,p=u.stateStore,null!==d){n.next=5;break}if(!l.address){n.next=5;break}return n.next=5,new Promise((function(n){l.address&&l.address.then(n),setTimeout((function(){null===d&&n()}),500)}));case 5:if(p.address.get()||!c||!c.name){n.next=7;break}return n.abrupt("return",{heading:e||"Login and Authorize Your Wallet",description:t||"This dapp requires access to your wallet, please login and authorize access to your ".concat(c.name," accounts to continue."),eventCode:"loginFail",action:c.connect,icon:r||i.c,html:o,button:s});case 7:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}()}}}]);
//# sourceMappingURL=41.32cd106b.chunk.js.map