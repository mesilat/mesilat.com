Array.prototype.every||(Array.prototype.every=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b===void 0||b===null;for(var f=0;f<d;f++){if(f in c){if(e){if(!a(c[f],f,c)){return !1
}}else{if(!a.call(b,c[f],f,c)){return !1}}}}return !0}),Array.prototype.filter||(Array.prototype.filter=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b===void 0||b===null,f=[];for(var g=0;g<d;g++){if(g in c){var h=c[g];
e?a(c[g],g,c)&&f.push(h):a.call(b,c[g],g,c)&&f.push(h)}}return f}),Array.prototype.forEach||(Array.prototype.forEach=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b===void 0||b===null;for(var f=0;f<d;f++){f in c&&(e?a(c[f],f,c):a.call(b,c[f],f,c))
}}),Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){if(this===void 0||this===null){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b!==void 0&&b!==null;if(d===0){return -1}var f=0;
e&&(f=Number(b),f!==f?f=0:f!==0&&f!==Infinity&&f!==-Infinity&&(f=(f>0||-1)*Math.floor(Math.abs(f))));
if(f>=d){return -1}var g=f>=0?f:Math.max(d-Math.abs(f),0);for(;g<d;g++){if(g in c&&c[g]===a){return g
}}return -1}),Array.isArray=Array.isArray||function(a){return Object.prototype.toString.call(a)==="[object Array]"
},Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(a,b){if(this===void 0||this===null){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b!==void 0&&b!==null;if(d===0){return -1}var f=d;
e&&(f=Number(b),f!==f?f=0:f!==0&&f!==Infinity&&f!==-Infinity&&(f=(f>0||-1)*Math.floor(Math.abs(f))));
var g=f>=0?Math.min(f,d-1):d-Math.abs(f);for(;g>=0;g--){if(g in c&&c[g]===a){return g
}}return -1}),Array.prototype.map||(Array.prototype.map=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b===void 0||b===null,f=new Array(d);for(var g=0;
g<d;g++){g in c&&(e?f[g]=a(c[g],g,c):f[g]=a.call(b,c[g],g,c))}return f}),Array.prototype.reduce||(Array.prototype.reduce=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b!==void 0&&b!==null;if(d==0&&!e){throw new TypeError
}var f=0,g;if(e){g=b}else{do{if(f in c){g=c[f++];break}if(++f>=d){throw new TypeError
}}while(!0)}while(f<d){f in c&&(g=a(g,c[f],f,c)),f++}return g}),Array.prototype.reduceRight||(Array.prototype.reduceRight=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b!==void 0&&b!==null;if(d==0&&!e){throw new TypeError
}var f=d-1,g;if(e){g=b}else{do{if(f in this){g=c[f--];break}if(--f<0){throw new TypeError
}}while(!0)}while(f--){f in c&&(g=callbackfn(g,c[f],f,c))}return g}),Array.prototype.some||(Array.prototype.some=function(a,b){if(this===void 0||this===null||typeof a!="function"){throw new TypeError
}var c=Object(this),d=c.length>>>0,e=b===void 0||b===null;for(var f=0;f<d;f++){if(f in c){if(e){if(a(c[f],f,c)){return !0
}}else{if(a.call(b,c[f],f,c)){return !0}}}}return !1}),Date.now||(Date.now=function(){return +(new Date)
}),Date.prototype.toISOString||(Date.prototype.toISOString=function(){var a=function(b,c){return c=c||2,(b+="",b.length===c)?b:a("0"+b,c)
};return function(){var b=this.getUTCFullYear();b=(b<0?"-":b>9999?"+":"")+("00000"+Math.abs(b)).slice(0<=b&&b<=9999?-4:-6);
var c=[b,a(this.getUTCMonth()+1),a(this.getUTCDate())].join("-"),d=[a(this.getUTCHours()),a(this.getUTCMinutes()),a(this.getUTCSeconds())].join(":")+"."+a(this.getUTCMilliseconds(),3);
return[c,d].join("T")+"Z"}}()),Date.prototype.toJSON||(Date.prototype.toJSON=function(){var a=Object(this),b=a.toISOString;
if(typeof b!="function"){throw new TypeError}return b.call(a)}),Function.prototype.bind||(Function.prototype.bind=function(a){if(typeof this!="function"){throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
}var b=Array.prototype.slice,c=b.call(arguments,1),d=this,e=function(){},f=function(){if(e.prototype&&this instanceof e){var f=d.apply(new e,c.concat(b.call(arguments)));
return Object(f)===f?f:d}return d.apply(a,c.concat(b.call(arguments)))};return e.prototype=d.prototype,f.prototype=new e,f
}),function(){var a=function(a){if(a!==Object(a)){throw new TypeError("Object.getPrototypeOf called on non-object")
}};Object.getPrototypeOf||(typeof"test".__proto__=="object"?Object.getPrototypeOf=function(b){return a(b),b.__proto__
}:Object.getPrototypeOf=function(b){return a(b),b.constructor.prototype})}(),Object.keys||(Object.keys=function(){var a=Object.prototype.hasOwnProperty,b=!{toString:null}.propertyIsEnumerable("toString"),c=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],d=c.length;
return function(e){if(typeof e!="object"&&typeof e!="function"||e===null){throw new TypeError("Object.keys called on non-object")
}var f=[];for(var g in e){a.call(e,g)&&f.push(g)}if(b){for(var h=0;h<d;h++){a.call(e,c[h])&&f.push(c[h])
}}return f}}()),String.prototype.trim||(String.prototype.trim=function(){var a=/^\s+/,b=/\s+$/;
return function(){return this.replace(a,"").replace(b,"")}}());