function _classCallCheck(t,a){if(!(t instanceof a))throw new TypeError("Cannot call a class as a function")}!function(t){var a={};function e(s){if(a[s])return a[s].exports;var r=a[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}e.m=t,e.c=a,e.d=function(t,a,s){e.o(t,a)||Object.defineProperty(t,a,{enumerable:!0,get:s})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,a){if(1&a&&(t=e(t)),8&a)return t;if(4&a&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(e.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&a&&"string"!=typeof t)for(var r in t)e.d(s,r,(function(a){return t[a]}).bind(null,r));return s},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,a){return Object.prototype.hasOwnProperty.call(t,a)},e.p="",e(e.s="fmah")}({fmah:function(t,a,e){"use strict";e.r(a);var s=function t(a){_classCallCheck(this,t),this.shipData=a,this.accumulatedThreat=0,this.armour=a.totalArmour,this.shield=a.totalShield,this.threat=a.threat},r=function t(){_classCallCheck(this,t),this.threatMulti=1},i=function t(){_classCallCheck(this,t),this.quantity=0,this.quantityEnd=0,this.lost=0,this.exploded=0,this.kills=0,this.oneShotted=0,this.oneShotDone=0,this.damageDone=0,this.armourDamageDone=0,this.shieldDamageDone=0,this.damageTaken=0,this.armourDamageTaken=0,this.shieldDamageTaken=0,this.deathTargets=0,this.aliveTargets=0,this.aliveTargetsShield=0,this.aliveTargetsNoShield=0,this.explosionTriggered=0,this.shotTaken=0,this.shotTakenDeath=0,this.shieldRegenerationReceived=0,this.threatAvg=0,this.threatQta=0,this.shipHit=0,this.defenceHit=0},n=function t(){_classCallCheck(this,t),this.name=""},o=function t(){_classCallCheck(this,t),this.won=!1};function h(t,a){for(var e=0,s=a.shieldPercent*a.adaptivePrecision,r=a.armourPercent*a.adaptivePrecision,i=(a.defencePercent-1)*a.adaptivePrecision,n=0,o=t.length;n<o;n++)e+=t[n].totalThreat,e+=t[n].alive.length*a.precision,e+=s*t[n].withShield,e+=r*t[n].withArmour,t[n].isDefence&&(e+=i*t[n].alive.length);for(var h,l=Math.random()*e,d=0,u=0,p=t.length;u<p;u++)for(var g=0,c=t[u].ships.length;g<c;g++)if(d+=(h=t[u].ships[g]).threat,t[u].isDefence&&h.armour>0&&(d+=i),h.shield>0?d+=s:h.armour>0&&(d+=r,d+=a.precision),d>=l)return h}function l(t,a,e,s){var r=0,i=t.damage;a.shipData.isDefence&&(i*=t.defencePercent);var n=a.armour>=a.shipData.totalArmour&&a.shield>=a.shipData.totalShield;if(a.shield>0){var o=0;if(i*=t.shieldPercent,(i-=a.shipData.shieldReduction)>0){var h=a.shield;a.shield-=i,a.shield>0?(o=i,i=0):(i=-1*a.shield/t.shieldPercent,o=h,a.shipData.withShield--,a.shipData.withArmour++),a.shipData.stats.rounds[s].damageTaken+=o,a.shipData.stats.rounds[s].shieldDamageTaken+=o,e.shipData.stats.rounds[s].damageDone+=o,e.shipData.stats.rounds[s].shieldDamageDone+=o,e.shipData.stats.rounds[s].aliveTargetsShield++,r+=o}}else e.shipData.stats.rounds[s].aliveTargetsNoShield++;if(i>0&&(i*=t.armourPercent,(i-=a.shipData.armourReduction)>0)){var d=a.armour;a.armour-=i;var u=Math.max(d-a.armour,0);a.shipData.stats.rounds[s].damageTaken+=u,a.shipData.stats.rounds[s].armourDamageTaken+=u,e.shipData.stats.rounds[s].damageDone+=u,e.shipData.stats.rounds[s].armourDamageDone+=u,r+=u}if(r>0&&(e.accumulatedThreat+=r*t.threatMulti),a.armour>0&&a.armour<a.shipData.explosionThreshold){var p=1-a.armour/a.shipData.explosionThreshold;Math.random()<p&&(a.armour=0,a.shipData.stats.rounds[s].exploded++,e.shipData.stats.rounds[s].explosionTriggered++,a.shipData.explosionDamage>0&&e.armour>0&&l(a.shipData.explosionWeapon,e,a,s))}if(a.armour<=0){var g=a.shipData.alive.indexOf(a);g>=0&&a.shipData.alive.splice(g,1),a.shipData.withArmour--,a.shipData.stats.rounds[s].lost++,e.shipData.stats.rounds[s].kills++,n&&(a.shipData.stats.rounds[s].oneShotted++,e.shipData.stats.rounds[s].oneShotDone++)}}addEventListener("message",(function(t){var a=function(t){for(var a=new o,e=[t.enemyFleet,t.playerFleet],d=function(t,a){e[t].forEach((function(a){a.ships=[],a.alive=[],a.targets=0===t?e[1]:e[0],a.explosionDamage>0&&(a.explosionWeapon=new r,a.explosionWeapon.shieldPercent=1,a.explosionWeapon.armourPercent=1,a.explosionWeapon.damage=a.explosionDamage),a.totalThreat=a.threat*a.quantity,a.stats=new n,a.stats.name=a.name,a.stats.designId=a.designId,a.stats.player=1===t,a.stats.total=new i,a.stats.total.quantity=a.quantity,a.stats.rounds=new Array(5);for(var o=0,h=a.weapons.length;o<h;o++)a.weapons[o].armourPercent/=100,a.weapons[o].shieldPercent/=100;for(var l=0;l<5;l++)a.stats.rounds[l]=new i;for(var d=0;d<a.quantity;d++){var u=new s(a);a.ships.push(u),a.alive.push(u)}a.totalShield>0?(a.withArmour=0,a.withShield=a.quantity):(a.withArmour=a.quantity,a.withShield=0)}))},u=0,p=e.length;u<p;u++)d(u);for(var g=0;g<5;g++){for(var c=0;c<2;c++)for(var f=e[c],v=0,m=f.length;v<m;v++){var D=f[v];D.stats.rounds[g].quantity=D.ships.length;for(var T=0,y=D.ships.length;T<y;T++)for(var S=D.ships[T],k=0,w=D.weapons.length;k<w;k++){var x=h(S.shipData.targets,D.weapons[k]);x&&(x.shipData.stats.rounds[g].shotTaken++,x.shipData.isDefence?S.shipData.stats.rounds[g].defenceHit++:S.shipData.stats.rounds[g].shipHit++,x.armour>0?(S.shipData.stats.rounds[g].aliveTargets++,l(D.weapons[k],x,S,g)):(S.shipData.stats.rounds[g].deathTargets++,x.shipData.stats.rounds[g].shotTakenDeath++))}}for(var P=0;P<2;P++)for(var A=e[P],b=0,q=A.length;b<q;b++){for(var C=0,_=A[b].ships.length;C<_;C++){var M=A[b].ships[C].threat+A[b].ships[C].accumulatedThreat;A[b].stats.rounds[g].threatAvg+=M,A[b].stats.total.threatAvg+=M}A[b].ships.length>0?A[b].stats.rounds[g].threatAvg/=A[b].ships.length:A[b].stats.rounds[g].threatAvg=0,A[b].stats.total.threatQta+=A[b].ships.length}for(var R=0;R<2;R++)for(var H=e[R],I=0,O=H.length;I<O;I++){var j=H[I];if(j.ships=j.alive.slice(),j.stats.rounds[g].quantityEnd=j.alive.length,g<4){j.totalThreat=0;for(var E=0,F=j.alive.length;E<F;E++)j.alive[E].threat+=j.alive[E].accumulatedThreat,j.totalThreat+=j.alive[E].threat}}for(var W=0;W<2;W++){for(var N=e[W],Q=0,L=new Array,z=0,B=N.length;z<B;z++){var G=N[z];Q+=G.shieldRecharge*G.alive.length;for(var J=0,K=G.alive.length;J<K;J++)G.alive[J].shield>0&&G.alive[J].shield<G.alive[J].shipData.totalShield&&L.push(G.alive[J])}if(Q>0&&L.length>0)for(var U=0,V=(L=L.sort((function(t,a){return(t.shipData.totalShield-t.shield)/t.shipData.totalShield-(a.shipData.totalShield-a.shield)/a.shipData.totalShield}))).length;U<V;U++)if(Q>0){var X=L[U].shield;L[U].shield=Math.min(L[U].shield+Q,L[U].shipData.totalShield);var Y=L[U].shield-X;Q-=Y,L[U].shipData.stats.rounds[g].shieldRegenerationReceived+=Y}}if(t.enemyFleet.findIndex((function(t){return t.ships.length>0}))<0||t.playerFleet.findIndex((function(t){return t.ships.length>0}))<0)break}a.gameId=t.gameId,a.playerLost=t.playerFleet.map((function(t){return{id:t.designId,lost:t.quantity-t.ships.length}})),a.enemyLost=t.enemyFleet.map((function(t){return{id:t.designId,lost:t.quantity-t.ships.length}})),a.stats=[];for(var Z=0,$=e.length;Z<$;Z++)e[Z].forEach((function(t){for(var e=0;e<5;e++)t.stats.total.exploded+=t.stats.rounds[e].exploded,t.stats.total.kills+=t.stats.rounds[e].kills,t.stats.total.lost+=t.stats.rounds[e].lost,t.stats.total.quantityEnd=t.alive.length,t.stats.total.oneShotted+=t.stats.rounds[e].oneShotted,t.stats.total.shotTaken+=t.stats.rounds[e].shotTaken,t.stats.total.shotTakenDeath+=t.stats.rounds[e].shotTakenDeath,t.stats.total.aliveTargetsShield+=t.stats.rounds[e].aliveTargetsShield,t.stats.total.aliveTargetsNoShield+=t.stats.rounds[e].aliveTargetsNoShield,t.stats.total.explosionTriggered+=t.stats.rounds[e].explosionTriggered,t.stats.total.oneShotDone+=t.stats.rounds[e].oneShotDone,t.stats.total.deathTargets+=t.stats.rounds[e].deathTargets,t.stats.total.aliveTargets+=t.stats.rounds[e].aliveTargets,t.stats.total.damageDone+=t.stats.rounds[e].damageDone,t.stats.total.armourDamageDone+=t.stats.rounds[e].armourDamageDone,t.stats.total.shieldDamageDone+=t.stats.rounds[e].shieldDamageDone,t.stats.total.damageTaken+=t.stats.rounds[e].damageTaken,t.stats.total.armourDamageTaken+=t.stats.rounds[e].armourDamageTaken,t.stats.total.shieldDamageTaken+=t.stats.rounds[e].shieldDamageTaken,t.stats.total.shieldRegenerationReceived+=t.stats.rounds[e].shieldRegenerationReceived,t.stats.total.shipHit+=t.stats.rounds[e].shipHit,t.stats.total.defenceHit+=t.stats.rounds[e].defenceHit;t.stats.total.threatAvg=t.stats.total.threatQta>0?t.stats.total.threatAvg/t.stats.total.threatQta:0,a.stats.push(t.stats)}));return a.endTime=t.endTime,a}(t.data);postMessage(a)}))}});