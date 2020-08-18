/*! translate.js - v1.1.0 - 2015-06-16
 *  https://github.com/musterknabe/translate.js
 *  Copyright (c) 2015 Jonas Girnatis
 *  Licensed under MIT license
 */
;
!function(){var a=function(a){return !isNaN(parseFloat(a))&&isFinite(a)},b=function(a){return"object"==typeof a&&null!==a
},c=function(a){return"[object String]"===Object.prototype.toString.call(a)};window.libTranslate={getTranslationFunction:function(d,e){function f(a){if(d[a]){return d[a]
}var b=a.split(j),c=b[0],e=b[1];return d[c]&&d[c][e]?d[c][e]:null}function g(a,c){if(b(a)){var d,e=Object.keys(a);
if(0===e.length){return i&&console.log("[Translation] No plural forms found."),null
}for(var f=0;f<e.length;f++){0===e[f].indexOf("gt")&&(d=parseInt(e[f].replace("gt",""),10))
}a[c]?a=a[c]:c>d?a=a["gt"+d]:a.n?a=a.n:(i&&console.log('[Translation] No plural forms found for count:"'+c+'" in',a),a=a[Object.keys(a).reverse()[0]])
}return a}function h(a,b){return c(a)?a.replace(/\{(\w*)\}/g,function(a,c){return b.hasOwnProperty(c)?b.hasOwnProperty(c)?b[c]:c:(i&&console.log('Could not find replacement "'+c+'" in provided replacements object:',b),"{"+c+"}")
}):a}e=b(e)?e:{};var i=e.debug,j=e.namespaceSplitter||"::";return function(c){var d=b(arguments[1])?arguments[1]:b(arguments[2])?arguments[2]:{},e=a(arguments[1])?arguments[1]:a(arguments[2])?arguments[2]:null,j=f(c);
return null!==e&&(d.n=d.n?d.n:e,j=g(j,e)),j=h(j,d),null===j&&(j=i?"@@"+c+"@@":c,i&&console.log('Translation for "'+c+'" not found.')),j
}}}}();