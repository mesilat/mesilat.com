/*!
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){lunr.stemmerSupport={Among:function(s,substring_i,result,method){this.toCharArray=function(s){var sLength=s.length,charArr=new Array(sLength);
for(var i=0;i<sLength;i++){charArr[i]=s.charCodeAt(i)}return charArr};if(!s&&s!=""||!substring_i&&substring_i!=0||!result){throw"Bad Among initialisation: s:"+s+", substring_i: "+substring_i+", result: "+result
}this.s_size=s.length;this.s=this.toCharArray(s);this.substring_i=substring_i;this.result=result;
this.method=method},SnowballProgram:function(){var current;return{bra:0,ket:0,limit:0,cursor:0,limit_backward:0,setCurrent:function(word){current=word;
this.cursor=0;this.limit=word.length;this.limit_backward=0;this.bra=this.cursor;this.ket=this.limit
},getCurrent:function(){var result=current;current=null;return result},in_grouping:function(s,min,max){if(this.cursor<this.limit){var ch=current.charCodeAt(this.cursor);
if(ch<=max&&ch>=min){ch-=min;if(s[ch>>3]&1<<(ch&7)){this.cursor++;return true}}}return false
},in_grouping_b:function(s,min,max){if(this.cursor>this.limit_backward){var ch=current.charCodeAt(this.cursor-1);
if(ch<=max&&ch>=min){ch-=min;if(s[ch>>3]&1<<(ch&7)){this.cursor--;return true}}}return false
},out_grouping:function(s,min,max){if(this.cursor<this.limit){var ch=current.charCodeAt(this.cursor);
if(ch>max||ch<min){this.cursor++;return true}ch-=min;if(!(s[ch>>3]&1<<(ch&7))){this.cursor++;
return true}}return false},out_grouping_b:function(s,min,max){if(this.cursor>this.limit_backward){var ch=current.charCodeAt(this.cursor-1);
if(ch>max||ch<min){this.cursor--;return true}ch-=min;if(!(s[ch>>3]&1<<(ch&7))){this.cursor--;
return true}}return false},eq_s:function(s_size,s){if(this.limit-this.cursor<s_size){return false
}for(var i=0;i<s_size;i++){if(current.charCodeAt(this.cursor+i)!=s.charCodeAt(i)){return false
}}this.cursor+=s_size;return true},eq_s_b:function(s_size,s){if(this.cursor-this.limit_backward<s_size){return false
}for(var i=0;i<s_size;i++){if(current.charCodeAt(this.cursor-s_size+i)!=s.charCodeAt(i)){return false
}}this.cursor-=s_size;return true},find_among:function(v,v_size){var i=0,j=v_size,c=this.cursor,l=this.limit,common_i=0,common_j=0,first_key_inspected=false;
while(true){var k=i+(j-i>>1),diff=0,common=common_i<common_j?common_i:common_j,w=v[k];
for(var i2=common;i2<w.s_size;i2++){if(c+common==l){diff=-1;break}diff=current.charCodeAt(c+common)-w.s[i2];
if(diff){break}common++}if(diff<0){j=k;common_j=common}else{i=k;common_i=common}if(j-i<=1){if(i>0||j==i||first_key_inspected){break
}first_key_inspected=true}}while(true){var w=v[i];if(common_i>=w.s_size){this.cursor=c+w.s_size;
if(!w.method){return w.result}var res=w.method();this.cursor=c+w.s_size;if(res){return w.result
}}i=w.substring_i;if(i<0){return 0}}},find_among_b:function(v,v_size){var i=0,j=v_size,c=this.cursor,lb=this.limit_backward,common_i=0,common_j=0,first_key_inspected=false;
while(true){var k=i+(j-i>>1),diff=0,common=common_i<common_j?common_i:common_j,w=v[k];
for(var i2=w.s_size-1-common;i2>=0;i2--){if(c-common==lb){diff=-1;break}diff=current.charCodeAt(c-1-common)-w.s[i2];
if(diff){break}common++}if(diff<0){j=k;common_j=common}else{i=k;common_i=common}if(j-i<=1){if(i>0||j==i||first_key_inspected){break
}first_key_inspected=true}}while(true){var w=v[i];if(common_i>=w.s_size){this.cursor=c-w.s_size;
if(!w.method){return w.result}var res=w.method();this.cursor=c-w.s_size;if(res){return w.result
}}i=w.substring_i;if(i<0){return 0}}},replace_s:function(c_bra,c_ket,s){var adjustment=s.length-(c_ket-c_bra),left=current.substring(0,c_bra),right=current.substring(c_ket);
current=left+s+right;this.limit+=adjustment;if(this.cursor>=c_ket){this.cursor+=adjustment
}else{if(this.cursor>c_bra){this.cursor=c_bra}}return adjustment},slice_check:function(){if(this.bra<0||this.bra>this.ket||this.ket>this.limit||this.limit>current.length){throw"faulty slice operation"
}},slice_from:function(s){this.slice_check();this.replace_s(this.bra,this.ket,s)},slice_del:function(){this.slice_from("")
},insert:function(c_bra,c_ket,s){var adjustment=this.replace_s(c_bra,c_ket,s);if(c_bra<=this.bra){this.bra+=adjustment
}if(c_bra<=this.ket){this.ket+=adjustment}},slice_to:function(){this.slice_check();
return current.substring(this.bra,this.ket)},eq_v_b:function(s){return this.eq_s_b(s.length,s)
}}}};lunr.trimmerSupport={generateTrimmer:function(wordCharacters){var startRegex=new RegExp("^[^"+wordCharacters+"]+");
var endRegex=new RegExp("[^"+wordCharacters+"]+$");return function(token){if(typeof token.update==="function"){return token.update(function(s){return s.replace(startRegex,"").replace(endRegex,"")
})}else{return token.replace(startRegex,"").replace(endRegex,"")}}}}}});(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){lunr.multiLanguage=function(){var languages=Array.prototype.slice.call(arguments);
var nameSuffix=languages.join("-");var wordCharacters="";var pipeline=[];var searchPipeline=[];
for(var i=0;i<languages.length;++i){if(languages[i]=="en"){wordCharacters+="\\w";
pipeline.unshift(lunr.stopWordFilter);pipeline.push(lunr.stemmer);searchPipeline.push(lunr.stemmer)
}else{wordCharacters+=lunr[languages[i]].wordCharacters;pipeline.unshift(lunr[languages[i]].stopWordFilter);
pipeline.push(lunr[languages[i]].stemmer);searchPipeline.push(lunr[languages[i]].stemmer)
}}var multiTrimmer=lunr.trimmerSupport.generateTrimmer(wordCharacters);lunr.Pipeline.registerFunction(multiTrimmer,"lunr-multi-trimmer-"+nameSuffix);
pipeline.unshift(multiTrimmer);return function(){this.pipeline.reset();this.pipeline.add.apply(this.pipeline,pipeline);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add.apply(this.searchPipeline,searchPipeline)
}}}}});(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){function TinySegmenter(){var patterns={"[一二三四五六七八九十百千万億兆]":"M","[一-龠々〆ヵヶ]":"H","[ぁ-ん]":"I","[ァ-ヴーｱ-ﾝﾞｰ]":"K","[a-zA-Zａ-ｚＡ-Ｚ]":"A","[0-9０-９]":"N"};
this.chartype_=[];for(var i in patterns){var regexp=new RegExp;regexp.compile(i);
this.chartype_.push([regexp,patterns[i]])}this.BIAS__=-332;this.BC1__={HH:6,II:2461,KH:406,OH:-1378};
this.BC2__={AA:-3267,AI:2744,AN:-878,HH:-4070,HM:-1711,HN:4012,HO:3761,IA:1327,IH:-1184,II:-1332,IK:1721,IO:5492,KI:3831,KK:-8741,MH:-3132,MK:3334,OO:-2920};
this.BC3__={HH:996,HI:626,HK:-721,HN:-1307,HO:-836,IH:-301,KK:2762,MK:1079,MM:4034,OA:-1652,OH:266};
this.BP1__={BB:295,OB:304,OO:-125,UB:352};this.BP2__={BO:60,OO:-1762};this.BQ1__={BHH:1150,BHM:1521,BII:-1158,BIM:886,BMH:1208,BNH:449,BOH:-91,BOO:-2597,OHI:451,OIH:-296,OKA:1851,OKH:-1020,OKK:904,OOO:2965};
this.BQ2__={BHH:118,BHI:-1159,BHM:466,BIH:-919,BKK:-1720,BKO:864,OHH:-1139,OHM:-181,OIH:153,UHI:-1146};
this.BQ3__={BHH:-792,BHI:2664,BII:-299,BKI:419,BMH:937,BMM:8335,BNN:998,BOH:775,OHH:2174,OHM:439,OII:280,OKH:1798,OKI:-793,OKO:-2242,OMH:-2402,OOO:11699};
this.BQ4__={BHH:-3895,BIH:3761,BII:-4654,BIK:1348,BKK:-1806,BMI:-3385,BOO:-12396,OAH:926,OHH:266,OHK:-2036,ONN:-973};
this.BW1__={",と":660,",同":727,"B1あ":1404,"B1同":542,"、と":660,"、同":727,"」と":1682,"あっ":1505,"いう":1743,"いっ":-2055,"いる":672,"うし":-4817,"うん":665,"から":3472,"がら":600,"こう":-790,"こと":2083,"こん":-1262,"さら":-4143,"さん":4573,"した":2641,"して":1104,"すで":-3399,"そこ":1977,"それ":-871,"たち":1122,"ため":601,"った":3463,"つい":-802,"てい":805,"てき":1249,"でき":1127,"です":3445,"では":844,"とい":-4915,"とみ":1922,"どこ":3887,"ない":5713,"なっ":3015,"など":7379,"なん":-1113,"にし":2468,"には":1498,"にも":1671,"に対":-912,"の一":-501,"の中":741,"ませ":2448,"まで":1711,"まま":2600,"まる":-2155,"やむ":-1947,"よっ":-2565,"れた":2369,"れで":-913,"をし":1860,"を見":731,"亡く":-1886,"京都":2558,"取り":-2784,"大き":-2604,"大阪":1497,"平方":-2314,"引き":-1336,"日本":-195,"本当":-2423,"毎日":-2113,"目指":-724,"Ｂ１あ":1404,"Ｂ１同":542,"｣と":1682};
this.BW2__={"..":-11822,11:-669,"――":-5730,"−−":-13175,"いう":-1609,"うか":2490,"かし":-1350,"かも":-602,"から":-7194,"かれ":4612,"がい":853,"がら":-3198,"きた":1941,"くな":-1597,"こと":-8392,"この":-4193,"させ":4533,"され":13168,"さん":-3977,"しい":-1819,"しか":-545,"した":5078,"して":972,"しな":939,"その":-3744,"たい":-1253,"たた":-662,"ただ":-3857,"たち":-786,"たと":1224,"たは":-939,"った":4589,"って":1647,"っと":-2094,"てい":6144,"てき":3640,"てく":2551,"ては":-3110,"ても":-3065,"でい":2666,"でき":-1528,"でし":-3828,"です":-4761,"でも":-4203,"とい":1890,"とこ":-1746,"とと":-2279,"との":720,"とみ":5168,"とも":-3941,"ない":-2488,"なが":-1313,"など":-6509,"なの":2614,"なん":3099,"にお":-1615,"にし":2748,"にな":2454,"によ":-7236,"に対":-14943,"に従":-4688,"に関":-11388,"のか":2093,"ので":-7059,"のに":-6041,"のの":-6125,"はい":1073,"はが":-1033,"はず":-2532,"ばれ":1813,"まし":-1316,"まで":-6621,"まれ":5409,"めて":-3153,"もい":2230,"もの":-10713,"らか":-944,"らし":-1611,"らに":-1897,"りし":651,"りま":1620,"れた":4270,"れて":849,"れば":4114,"ろう":6067,"われ":7901,"を通":-11877,"んだ":728,"んな":-4115,"一人":602,"一方":-1375,"一日":970,"一部":-1051,"上が":-4479,"会社":-1116,"出て":2163,"分の":-7758,"同党":970,"同日":-913,"大阪":-2471,"委員":-1250,"少な":-1050,"年度":-8669,"年間":-1626,"府県":-2363,"手権":-1982,"新聞":-4066,"日新":-722,"日本":-7068,"日米":3372,"曜日":-601,"朝鮮":-2355,"本人":-2697,"東京":-1543,"然と":-1384,"社会":-1276,"立て":-990,"第に":-1612,"米国":-4268,"１１":-669};
this.BW3__={"あた":-2194,"あり":719,"ある":3846,"い.":-1185,"い。":-1185,"いい":5308,"いえ":2079,"いく":3029,"いた":2056,"いっ":1883,"いる":5600,"いわ":1527,"うち":1117,"うと":4798,"えと":1454,"か.":2857,"か。":2857,"かけ":-743,"かっ":-4098,"かに":-669,"から":6520,"かり":-2670,"が,":1816,"が、":1816,"がき":-4855,"がけ":-1127,"がっ":-913,"がら":-4977,"がり":-2064,"きた":1645,"けど":1374,"こと":7397,"この":1542,"ころ":-2757,"さい":-714,"さを":976,"し,":1557,"し、":1557,"しい":-3714,"した":3562,"して":1449,"しな":2608,"しま":1200,"す.":-1310,"す。":-1310,"する":6521,"ず,":3426,"ず、":3426,"ずに":841,"そう":428,"た.":8875,"た。":8875,"たい":-594,"たの":812,"たり":-1183,"たる":-853,"だ.":4098,"だ。":4098,"だっ":1004,"った":-4748,"って":300,"てい":6240,"てお":855,"ても":302,"です":1437,"でに":-1482,"では":2295,"とう":-1387,"とし":2266,"との":541,"とも":-3543,"どう":4664,"ない":1796,"なく":-903,"など":2135,"に,":-1021,"に、":-1021,"にし":1771,"にな":1906,"には":2644,"の,":-724,"の、":-724,"の子":-1000,"は,":1337,"は、":1337,"べき":2181,"まし":1113,"ます":6943,"まっ":-1549,"まで":6154,"まれ":-793,"らし":1479,"られ":6820,"るる":3818,"れ,":854,"れ、":854,"れた":1850,"れて":1375,"れば":-3246,"れる":1091,"われ":-605,"んだ":606,"んで":798,"カ月":990,"会議":860,"入り":1232,"大会":2217,"始め":1681,"市":965,"新聞":-5055,"日,":974,"日、":974,"社会":2024,"ｶ月":990};
this.TC1__={AAA:1093,HHH:1029,HHM:580,HII:998,HOH:-390,HOM:-331,IHI:1169,IOH:-142,IOI:-1015,IOM:467,MMH:187,OOI:-1832};
this.TC2__={HHO:2088,HII:-1023,HMM:-1154,IHI:-1965,KKH:703,OII:-2649};this.TC3__={AAA:-294,HHH:346,HHI:-341,HII:-1088,HIK:731,HOH:-1486,IHH:128,IHI:-3041,IHO:-1935,IIH:-825,IIM:-1035,IOI:-542,KHH:-1216,KKA:491,KKH:-1217,KOK:-1009,MHH:-2694,MHM:-457,MHO:123,MMH:-471,NNH:-1689,NNO:662,OHO:-3393};
this.TC4__={HHH:-203,HHI:1344,HHK:365,HHM:-122,HHN:182,HHO:669,HIH:804,HII:679,HOH:446,IHH:695,IHO:-2324,IIH:321,III:1497,IIO:656,IOO:54,KAK:4845,KKA:3386,KKK:3065,MHH:-405,MHI:201,MMH:-241,MMM:661,MOM:841};
this.TQ1__={BHHH:-227,BHHI:316,BHIH:-132,BIHH:60,BIII:1595,BNHH:-744,BOHH:225,BOOO:-908,OAKK:482,OHHH:281,OHIH:249,OIHI:200,OIIH:-68};
this.TQ2__={BIHH:-1401,BIII:-1033,BKAK:-543,BOOO:-5591};this.TQ3__={BHHH:478,BHHM:-1073,BHIH:222,BHII:-504,BIIH:-116,BIII:-105,BMHI:-863,BMHM:-464,BOMH:620,OHHH:346,OHHI:1729,OHII:997,OHMH:481,OIHH:623,OIIH:1344,OKAK:2792,OKHH:587,OKKA:679,OOHH:110,OOII:-685};
this.TQ4__={BHHH:-721,BHHM:-3604,BHII:-966,BIIH:-607,BIII:-2181,OAAA:-2763,OAKK:180,OHHH:-294,OHHI:2446,OHHO:480,OHIH:-1573,OIHH:1935,OIHI:-493,OIIH:626,OIII:-4007,OKAK:-8156};
this.TW1__={"につい":-4681,"東京都":2026};this.TW2__={"ある程":-2049,"いった":-1256,"ころが":-2434,"しょう":3873,"その後":-4430,"だって":-1049,"ていた":1833,"として":-4657,"ともに":-4517,"もので":1882,"一気に":-792,"初めて":-1512,"同時に":-8097,"大きな":-1255,"対して":-2721,"社会党":-3216};
this.TW3__={"いただ":-1734,"してい":1314,"として":-4314,"につい":-5483,"にとっ":-5989,"に当た":-6247,"ので,":-727,"ので、":-727,"のもの":-600,"れから":-3752,"十二月":-2287};
this.TW4__={"いう.":8576,"いう。":8576,"からな":-2348,"してい":2958,"たが,":1516,"たが、":1516,"ている":1538,"という":1349,"ました":5543,"ません":1097,"ようと":-4258,"よると":5865};
this.UC1__={A:484,K:93,M:645,O:-505};this.UC2__={A:819,H:1059,I:409,M:3987,N:5775,O:646};
this.UC3__={A:-1370,I:2311};this.UC4__={A:-2643,H:1809,I:-1032,K:-3450,M:3565,N:3876,O:6646};
this.UC5__={H:313,I:-1238,K:-799,M:539,O:-831};this.UC6__={H:-506,I:-253,K:87,M:247,O:-387};
this.UP1__={O:-214};this.UP2__={B:69,O:935};this.UP3__={B:189};this.UQ1__={BH:21,BI:-12,BK:-99,BN:142,BO:-56,OH:-95,OI:477,OK:410,OO:-2422};
this.UQ2__={BH:216,BI:113,OK:1759};this.UQ3__={BA:-479,BH:42,BI:1913,BK:-7198,BM:3160,BN:6427,BO:14761,OI:-827,ON:-3212};
this.UW1__={",":156,"、":156,"「":-463,"あ":-941,"う":-127,"が":-553,"き":121,"こ":505,"で":-201,"と":-547,"ど":-123,"に":-789,"の":-185,"は":-847,"も":-466,"や":-470,"よ":182,"ら":-292,"り":208,"れ":169,"を":-446,"ん":-137,"・":-135,"主":-402,"京":-268,"区":-912,"午":871,"国":-460,"大":561,"委":729,"市":-411,"日":-141,"理":361,"生":-408,"県":-386,"都":-718,"｢":-463,"･":-135};
this.UW2__={",":-829,"、":-829,"〇":892,"「":-645,"」":3145,"あ":-538,"い":505,"う":134,"お":-502,"か":1454,"が":-856,"く":-412,"こ":1141,"さ":878,"ざ":540,"し":1529,"す":-675,"せ":300,"そ":-1011,"た":188,"だ":1837,"つ":-949,"て":-291,"で":-268,"と":-981,"ど":1273,"な":1063,"に":-1764,"の":130,"は":-409,"ひ":-1273,"べ":1261,"ま":600,"も":-1263,"や":-402,"よ":1639,"り":-579,"る":-694,"れ":571,"を":-2516,"ん":2095,"ア":-587,"カ":306,"キ":568,"ッ":831,"三":-758,"不":-2150,"世":-302,"中":-968,"主":-861,"事":492,"人":-123,"会":978,"保":362,"入":548,"初":-3025,"副":-1566,"北":-3414,"区":-422,"大":-1769,"天":-865,"太":-483,"子":-1519,"学":760,"実":1023,"小":-2009,"市":-813,"年":-1060,"強":1067,"手":-1519,"揺":-1033,"政":1522,"文":-1355,"新":-1682,"日":-1815,"明":-1462,"最":-630,"朝":-1843,"本":-1650,"東":-931,"果":-665,"次":-2378,"民":-180,"気":-1740,"理":752,"発":529,"目":-1584,"相":-242,"県":-1165,"立":-763,"第":810,"米":509,"自":-1353,"行":838,"西":-744,"見":-3874,"調":1010,"議":1198,"込":3041,"開":1758,"間":-1257,"｢":-645,"｣":3145,"ｯ":831,"ｱ":-587,"ｶ":306,"ｷ":568};
this.UW3__={",":4889,1:-800,"−":-1723,"、":4889,"々":-2311,"〇":5827,"」":2670,"〓":-3573,"あ":-2696,"い":1006,"う":2342,"え":1983,"お":-4864,"か":-1163,"が":3271,"く":1004,"け":388,"げ":401,"こ":-3552,"ご":-3116,"さ":-1058,"し":-395,"す":584,"せ":3685,"そ":-5228,"た":842,"ち":-521,"っ":-1444,"つ":-1081,"て":6167,"で":2318,"と":1691,"ど":-899,"な":-2788,"に":2745,"の":4056,"は":4555,"ひ":-2171,"ふ":-1798,"へ":1199,"ほ":-5516,"ま":-4384,"み":-120,"め":1205,"も":2323,"や":-788,"よ":-202,"ら":727,"り":649,"る":5905,"れ":2773,"わ":-1207,"を":6620,"ん":-518,"ア":551,"グ":1319,"ス":874,"ッ":-1350,"ト":521,"ム":1109,"ル":1591,"ロ":2201,"ン":278,"・":-3794,"一":-1619,"下":-1759,"世":-2087,"両":3815,"中":653,"主":-758,"予":-1193,"二":974,"人":2742,"今":792,"他":1889,"以":-1368,"低":811,"何":4265,"作":-361,"保":-2439,"元":4858,"党":3593,"全":1574,"公":-3030,"六":755,"共":-1880,"円":5807,"再":3095,"分":457,"初":2475,"別":1129,"前":2286,"副":4437,"力":365,"動":-949,"務":-1872,"化":1327,"北":-1038,"区":4646,"千":-2309,"午":-783,"協":-1006,"口":483,"右":1233,"各":3588,"合":-241,"同":3906,"和":-837,"員":4513,"国":642,"型":1389,"場":1219,"外":-241,"妻":2016,"学":-1356,"安":-423,"実":-1008,"家":1078,"小":-513,"少":-3102,"州":1155,"市":3197,"平":-1804,"年":2416,"広":-1030,"府":1605,"度":1452,"建":-2352,"当":-3885,"得":1905,"思":-1291,"性":1822,"戸":-488,"指":-3973,"政":-2013,"教":-1479,"数":3222,"文":-1489,"新":1764,"日":2099,"旧":5792,"昨":-661,"時":-1248,"曜":-951,"最":-937,"月":4125,"期":360,"李":3094,"村":364,"東":-805,"核":5156,"森":2438,"業":484,"氏":2613,"民":-1694,"決":-1073,"法":1868,"海":-495,"無":979,"物":461,"特":-3850,"生":-273,"用":914,"町":1215,"的":7313,"直":-1835,"省":792,"県":6293,"知":-1528,"私":4231,"税":401,"立":-960,"第":1201,"米":7767,"系":3066,"約":3663,"級":1384,"統":-4229,"総":1163,"線":1255,"者":6457,"能":725,"自":-2869,"英":785,"見":1044,"調":-562,"財":-733,"費":1777,"車":1835,"軍":1375,"込":-1504,"通":-1136,"選":-681,"郎":1026,"郡":4404,"部":1200,"金":2163,"長":421,"開":-1432,"間":1302,"関":-1282,"雨":2009,"電":-1045,"非":2066,"駅":1620,"１":-800,"｣":2670,"･":-3794,"ｯ":-1350,"ｱ":551,"ｸﾞ":1319,"ｽ":874,"ﾄ":521,"ﾑ":1109,"ﾙ":1591,"ﾛ":2201,"ﾝ":278};
this.UW4__={",":3930,".":3508,"―":-4841,"、":3930,"。":3508,"〇":4999,"「":1895,"」":3798,"〓":-5156,"あ":4752,"い":-3435,"う":-640,"え":-2514,"お":2405,"か":530,"が":6006,"き":-4482,"ぎ":-3821,"く":-3788,"け":-4376,"げ":-4734,"こ":2255,"ご":1979,"さ":2864,"し":-843,"じ":-2506,"す":-731,"ず":1251,"せ":181,"そ":4091,"た":5034,"だ":5408,"ち":-3654,"っ":-5882,"つ":-1659,"て":3994,"で":7410,"と":4547,"な":5433,"に":6499,"ぬ":1853,"ね":1413,"の":7396,"は":8578,"ば":1940,"ひ":4249,"び":-4134,"ふ":1345,"へ":6665,"べ":-744,"ほ":1464,"ま":1051,"み":-2082,"む":-882,"め":-5046,"も":4169,"ゃ":-2666,"や":2795,"ょ":-1544,"よ":3351,"ら":-2922,"り":-9726,"る":-14896,"れ":-2613,"ろ":-4570,"わ":-1783,"を":13150,"ん":-2352,"カ":2145,"コ":1789,"セ":1287,"ッ":-724,"ト":-403,"メ":-1635,"ラ":-881,"リ":-541,"ル":-856,"ン":-3637,"・":-4371,"ー":-11870,"一":-2069,"中":2210,"予":782,"事":-190,"井":-1768,"人":1036,"以":544,"会":950,"体":-1286,"作":530,"側":4292,"先":601,"党":-2006,"共":-1212,"内":584,"円":788,"初":1347,"前":1623,"副":3879,"力":-302,"動":-740,"務":-2715,"化":776,"区":4517,"協":1013,"参":1555,"合":-1834,"和":-681,"員":-910,"器":-851,"回":1500,"国":-619,"園":-1200,"地":866,"場":-1410,"塁":-2094,"士":-1413,"多":1067,"大":571,"子":-4802,"学":-1397,"定":-1057,"寺":-809,"小":1910,"屋":-1328,"山":-1500,"島":-2056,"川":-2667,"市":2771,"年":374,"庁":-4556,"後":456,"性":553,"感":916,"所":-1566,"支":856,"改":787,"政":2182,"教":704,"文":522,"方":-856,"日":1798,"時":1829,"最":845,"月":-9066,"木":-485,"来":-442,"校":-360,"業":-1043,"氏":5388,"民":-2716,"気":-910,"沢":-939,"済":-543,"物":-735,"率":672,"球":-1267,"生":-1286,"産":-1101,"田":-2900,"町":1826,"的":2586,"目":922,"省":-3485,"県":2997,"空":-867,"立":-2112,"第":788,"米":2937,"系":786,"約":2171,"経":1146,"統":-1169,"総":940,"線":-994,"署":749,"者":2145,"能":-730,"般":-852,"行":-792,"規":792,"警":-1184,"議":-244,"谷":-1000,"賞":730,"車":-1481,"軍":1158,"輪":-1433,"込":-3370,"近":929,"道":-1291,"選":2596,"郎":-4866,"都":1192,"野":-1100,"銀":-2213,"長":357,"間":-2344,"院":-2297,"際":-2604,"電":-878,"領":-1659,"題":-792,"館":-1984,"首":1749,"高":2120,"｢":1895,"｣":3798,"･":-4371,"ｯ":-724,"ｰ":-11870,"ｶ":2145,"ｺ":1789,"ｾ":1287,"ﾄ":-403,"ﾒ":-1635,"ﾗ":-881,"ﾘ":-541,"ﾙ":-856,"ﾝ":-3637};
this.UW5__={",":465,".":-299,1:-514,E2:-32768,"]":-2762,"、":465,"。":-299,"「":363,"あ":1655,"い":331,"う":-503,"え":1199,"お":527,"か":647,"が":-421,"き":1624,"ぎ":1971,"く":312,"げ":-983,"さ":-1537,"し":-1371,"す":-852,"だ":-1186,"ち":1093,"っ":52,"つ":921,"て":-18,"で":-850,"と":-127,"ど":1682,"な":-787,"に":-1224,"の":-635,"は":-578,"べ":1001,"み":502,"め":865,"ゃ":3350,"ょ":854,"り":-208,"る":429,"れ":504,"わ":419,"を":-1264,"ん":327,"イ":241,"ル":451,"ン":-343,"中":-871,"京":722,"会":-1153,"党":-654,"務":3519,"区":-901,"告":848,"員":2104,"大":-1296,"学":-548,"定":1785,"嵐":-1304,"市":-2991,"席":921,"年":1763,"思":872,"所":-814,"挙":1618,"新":-1682,"日":218,"月":-4353,"査":932,"格":1356,"機":-1508,"氏":-1347,"田":240,"町":-3912,"的":-3149,"相":1319,"省":-1052,"県":-4003,"研":-997,"社":-278,"空":-813,"統":1955,"者":-2233,"表":663,"語":-1073,"議":1219,"選":-1018,"郎":-368,"長":786,"間":1191,"題":2368,"館":-689,"１":-514,"Ｅ２":-32768,"｢":363,"ｲ":241,"ﾙ":451,"ﾝ":-343};
this.UW6__={",":227,".":808,1:-270,E1:306,"、":227,"。":808,"あ":-307,"う":189,"か":241,"が":-73,"く":-121,"こ":-200,"じ":1782,"す":383,"た":-428,"っ":573,"て":-1014,"で":101,"と":-105,"な":-253,"に":-149,"の":-417,"は":-236,"も":-206,"り":187,"る":-135,"を":195,"ル":-673,"ン":-496,"一":-277,"中":201,"件":-800,"会":624,"前":302,"区":1792,"員":-1212,"委":798,"学":-960,"市":887,"広":-695,"後":535,"業":-697,"相":753,"社":-507,"福":974,"空":-822,"者":1811,"連":463,"郎":1082,"１":-270,"Ｅ１":306,"ﾙ":-673,"ﾝ":-496};
return this}TinySegmenter.prototype.ctype_=function(str){for(var i in this.chartype_){if(str.match(this.chartype_[i][0])){return this.chartype_[i][1]
}}return"O"};TinySegmenter.prototype.ts_=function(v){if(v){return v}return 0};TinySegmenter.prototype.segment=function(input){if(input==null||input==undefined||input==""){return[]
}var result=[];var seg=["B3","B2","B1"];var ctype=["O","O","O"];var o=input.split("");
for(i=0;i<o.length;++i){seg.push(o[i]);ctype.push(this.ctype_(o[i]))}seg.push("E1");
seg.push("E2");seg.push("E3");ctype.push("O");ctype.push("O");ctype.push("O");var word=seg[3];
var p1="U";var p2="U";var p3="U";for(var i=4;i<seg.length-3;++i){var score=this.BIAS__;
var w1=seg[i-3];var w2=seg[i-2];var w3=seg[i-1];var w4=seg[i];var w5=seg[i+1];var w6=seg[i+2];
var c1=ctype[i-3];var c2=ctype[i-2];var c3=ctype[i-1];var c4=ctype[i];var c5=ctype[i+1];
var c6=ctype[i+2];score+=this.ts_(this.UP1__[p1]);score+=this.ts_(this.UP2__[p2]);
score+=this.ts_(this.UP3__[p3]);score+=this.ts_(this.BP1__[p1+p2]);score+=this.ts_(this.BP2__[p2+p3]);
score+=this.ts_(this.UW1__[w1]);score+=this.ts_(this.UW2__[w2]);score+=this.ts_(this.UW3__[w3]);
score+=this.ts_(this.UW4__[w4]);score+=this.ts_(this.UW5__[w5]);score+=this.ts_(this.UW6__[w6]);
score+=this.ts_(this.BW1__[w2+w3]);score+=this.ts_(this.BW2__[w3+w4]);score+=this.ts_(this.BW3__[w4+w5]);
score+=this.ts_(this.TW1__[w1+w2+w3]);score+=this.ts_(this.TW2__[w2+w3+w4]);score+=this.ts_(this.TW3__[w3+w4+w5]);
score+=this.ts_(this.TW4__[w4+w5+w6]);score+=this.ts_(this.UC1__[c1]);score+=this.ts_(this.UC2__[c2]);
score+=this.ts_(this.UC3__[c3]);score+=this.ts_(this.UC4__[c4]);score+=this.ts_(this.UC5__[c5]);
score+=this.ts_(this.UC6__[c6]);score+=this.ts_(this.BC1__[c2+c3]);score+=this.ts_(this.BC2__[c3+c4]);
score+=this.ts_(this.BC3__[c4+c5]);score+=this.ts_(this.TC1__[c1+c2+c3]);score+=this.ts_(this.TC2__[c2+c3+c4]);
score+=this.ts_(this.TC3__[c3+c4+c5]);score+=this.ts_(this.TC4__[c4+c5+c6]);score+=this.ts_(this.UQ1__[p1+c1]);
score+=this.ts_(this.UQ2__[p2+c2]);score+=this.ts_(this.UQ3__[p3+c3]);score+=this.ts_(this.BQ1__[p2+c2+c3]);
score+=this.ts_(this.BQ2__[p2+c3+c4]);score+=this.ts_(this.BQ3__[p3+c2+c3]);score+=this.ts_(this.BQ4__[p3+c3+c4]);
score+=this.ts_(this.TQ1__[p2+c1+c2+c3]);score+=this.ts_(this.TQ2__[p2+c2+c3+c4]);
score+=this.ts_(this.TQ3__[p3+c1+c2+c3]);score+=this.ts_(this.TQ4__[p3+c2+c3+c4]);
var p="O";if(score>0){result.push(word);word="";p="B"}p1=p2;p2=p3;p3=p;word+=seg[i]
}result.push(word);return result};lunr.TinySegmenter=TinySegmenter}});
/*!
 * Lunr languages, `Danish` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.da=function(){this.pipeline.reset();this.pipeline.add(lunr.da.trimmer,lunr.da.stopWordFilter,lunr.da.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.da.stemmer)
}};lunr.da.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.da.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.da.wordCharacters);lunr.Pipeline.registerFunction(lunr.da.trimmer,"trimmer-da");
lunr.da.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function DanishStemmer(){var a_0=[new Among("hed",-1,1),new Among("ethed",0,1),new Among("ered",-1,1),new Among("e",-1,1),new Among("erede",3,1),new Among("ende",3,1),new Among("erende",5,1),new Among("ene",3,1),new Among("erne",3,1),new Among("ere",3,1),new Among("en",-1,1),new Among("heden",10,1),new Among("eren",10,1),new Among("er",-1,1),new Among("heder",13,1),new Among("erer",13,1),new Among("s",-1,2),new Among("heds",16,1),new Among("es",16,1),new Among("endes",18,1),new Among("erendes",19,1),new Among("enes",18,1),new Among("ernes",18,1),new Among("eres",18,1),new Among("ens",16,1),new Among("hedens",24,1),new Among("erens",24,1),new Among("ers",16,1),new Among("ets",16,1),new Among("erets",28,1),new Among("et",-1,1),new Among("eret",30,1)],a_1=[new Among("gd",-1,-1),new Among("dt",-1,-1),new Among("gt",-1,-1),new Among("kt",-1,-1)],a_2=[new Among("ig",-1,1),new Among("lig",0,1),new Among("elig",1,1),new Among("els",-1,1),new Among("løst",-1,2)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,48,0,128],g_s_ending=[239,254,42,3,0,0,0,0,0,0,0,0,0,0,0,0,16],I_x,I_p1,S_ch,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_mark_regions(){var v_1,c=sbp.cursor+3;I_p1=sbp.limit;if(0<=c&&c<=sbp.limit){I_x=c;
while(true){v_1=sbp.cursor;if(sbp.in_grouping(g_v,97,248)){sbp.cursor=v_1;break}sbp.cursor=v_1;
if(v_1>=sbp.limit){return}sbp.cursor++}while(!sbp.out_grouping(g_v,97,248)){if(sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_p1=sbp.cursor;if(I_p1<I_x){I_p1=I_x}}}function r_main_suffix(){var among_var,v_1;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_0,32);sbp.limit_backward=v_1;if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:sbp.slice_del();break;case 2:if(sbp.in_grouping_b(g_s_ending,97,229)){sbp.slice_del()
}break}}}}function r_consonant_pair(){var v_1=sbp.limit-sbp.cursor,v_2;if(sbp.cursor>=I_p1){v_2=sbp.limit_backward;
sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;if(sbp.find_among_b(a_1,4)){sbp.bra=sbp.cursor;
sbp.limit_backward=v_2;sbp.cursor=sbp.limit-v_1;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;
sbp.bra=sbp.cursor;sbp.slice_del()}}else{sbp.limit_backward=v_2}}}function r_other_suffix(){var among_var,v_1=sbp.limit-sbp.cursor,v_2,v_3;
sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"st")){sbp.bra=sbp.cursor;if(sbp.eq_s_b(2,"ig")){sbp.slice_del()
}}sbp.cursor=sbp.limit-v_1;if(sbp.cursor>=I_p1){v_2=sbp.limit_backward;sbp.limit_backward=I_p1;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_2,5);sbp.limit_backward=v_2;if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:sbp.slice_del();v_3=sbp.limit-sbp.cursor;r_consonant_pair();
sbp.cursor=sbp.limit-v_3;break;case 2:sbp.slice_from("løs");break}}}}function r_undouble(){var v_1;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
if(sbp.out_grouping_b(g_v,97,248)){sbp.bra=sbp.cursor;S_ch=sbp.slice_to(S_ch);sbp.limit_backward=v_1;
if(sbp.eq_v_b(S_ch)){sbp.slice_del()}}else{sbp.limit_backward=v_1}}}this.stem=function(){var v_1=sbp.cursor;
r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;r_main_suffix();sbp.cursor=sbp.limit;
r_consonant_pair();sbp.cursor=sbp.limit;r_other_suffix();sbp.cursor=sbp.limit;r_undouble();
return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.da.stemmer,"stemmer-da");lunr.da.stopWordFilter=lunr.generateStopWordFilter("ad af alle alt anden at blev blive bliver da de dem den denne der deres det dette dig din disse dog du efter eller en end er et for fra ham han hans har havde have hende hendes her hos hun hvad hvis hvor i ikke ind jeg jer jo kunne man mange med meget men mig min mine mit mod ned noget nogle nu når og også om op os over på selv sig sin sine sit skal skulle som sådan thi til ud under var vi vil ville vor være været".split(" "));
lunr.Pipeline.registerFunction(lunr.da.stopWordFilter,"stopWordFilter-da")}});
/*!
 * Lunr languages, `German` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.de=function(){this.pipeline.reset();this.pipeline.add(lunr.de.trimmer,lunr.de.stopWordFilter,lunr.de.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.de.stemmer)
}};lunr.de.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.de.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.de.wordCharacters);lunr.Pipeline.registerFunction(lunr.de.trimmer,"trimmer-de");
lunr.de.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function GermanStemmer(){var a_0=[new Among("",-1,6),new Among("U",0,2),new Among("Y",0,1),new Among("ä",0,3),new Among("ö",0,4),new Among("ü",0,5)],a_1=[new Among("e",-1,2),new Among("em",-1,1),new Among("en",-1,2),new Among("ern",-1,1),new Among("er",-1,1),new Among("s",-1,3),new Among("es",5,2)],a_2=[new Among("en",-1,1),new Among("er",-1,1),new Among("st",-1,2),new Among("est",2,1)],a_3=[new Among("ig",-1,1),new Among("lich",-1,1)],a_4=[new Among("end",-1,1),new Among("ig",-1,2),new Among("ung",-1,1),new Among("lich",-1,3),new Among("isch",-1,2),new Among("ik",-1,2),new Among("heit",-1,3),new Among("keit",-1,4)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,8,0,32,8],g_s_ending=[117,30,5],g_st_ending=[117,30,4],I_x,I_p2,I_p1,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(c1,c2,v_1){if(sbp.eq_s(1,c1)){sbp.ket=sbp.cursor;if(sbp.in_grouping(g_v,97,252)){sbp.slice_from(c2);
sbp.cursor=v_1;return true}}return false}function r_prelude(){var v_1=sbp.cursor,v_2,v_3,v_4,v_5;
while(true){v_2=sbp.cursor;sbp.bra=v_2;if(sbp.eq_s(1,"ß")){sbp.ket=sbp.cursor;sbp.slice_from("ss")
}else{if(v_2>=sbp.limit){break}sbp.cursor=v_2+1}}sbp.cursor=v_1;while(true){v_3=sbp.cursor;
while(true){v_4=sbp.cursor;if(sbp.in_grouping(g_v,97,252)){v_5=sbp.cursor;sbp.bra=v_5;
if(habr1("u","U",v_4)){break}sbp.cursor=v_5;if(habr1("y","Y",v_4)){break}}if(v_4>=sbp.limit){sbp.cursor=v_3;
return}sbp.cursor=v_4+1}}}function habr2(){while(!sbp.in_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}function r_mark_regions(){I_p1=sbp.limit;I_p2=I_p1;var c=sbp.cursor+3;
if(0<=c&&c<=sbp.limit){I_x=c;if(!habr2()){I_p1=sbp.cursor;if(I_p1<I_x){I_p1=I_x}if(!habr2()){I_p2=sbp.cursor
}}}}function r_postlude(){var among_var,v_1;while(true){v_1=sbp.cursor;sbp.bra=v_1;
among_var=sbp.find_among(a_0,6);if(!among_var){return}sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("y");
break;case 2:case 5:sbp.slice_from("u");break;case 3:sbp.slice_from("a");break;case 4:sbp.slice_from("o");
break;case 6:if(sbp.cursor>=sbp.limit){return}sbp.cursor++;break}}}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_standard_suffix(){var among_var,v_1=sbp.limit-sbp.cursor,v_2,v_3,v_4;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_1,7);if(among_var){sbp.bra=sbp.cursor;
if(r_R1()){switch(among_var){case 1:sbp.slice_del();break;case 2:sbp.slice_del();
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"s")){sbp.bra=sbp.cursor;if(sbp.eq_s_b(3,"nis")){sbp.slice_del()
}}break;case 3:if(sbp.in_grouping_b(g_s_ending,98,116)){sbp.slice_del()}break}}}sbp.cursor=sbp.limit-v_1;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_2,4);if(among_var){sbp.bra=sbp.cursor;
if(r_R1()){switch(among_var){case 1:sbp.slice_del();break;case 2:if(sbp.in_grouping_b(g_st_ending,98,116)){var c=sbp.cursor-3;
if(sbp.limit_backward<=c&&c<=sbp.limit){sbp.cursor=c;sbp.slice_del()}}break}}}sbp.cursor=sbp.limit-v_1;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_4,8);if(among_var){sbp.bra=sbp.cursor;
if(r_R2()){switch(among_var){case 1:sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"ig")){sbp.bra=sbp.cursor;
v_2=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"e")){sbp.cursor=sbp.limit-v_2;if(r_R2()){sbp.slice_del()
}}}break;case 2:v_3=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"e")){sbp.cursor=sbp.limit-v_3;
sbp.slice_del()}break;case 3:sbp.slice_del();sbp.ket=sbp.cursor;v_4=sbp.limit-sbp.cursor;
if(!sbp.eq_s_b(2,"er")){sbp.cursor=sbp.limit-v_4;if(!sbp.eq_s_b(2,"en")){break}}sbp.bra=sbp.cursor;
if(r_R1()){sbp.slice_del()}break;case 4:sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,2);
if(among_var){sbp.bra=sbp.cursor;if(r_R2()&&among_var==1){sbp.slice_del()}}break}}}}this.stem=function(){var v_1=sbp.cursor;
r_prelude();sbp.cursor=v_1;r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;
r_standard_suffix();sbp.cursor=sbp.limit_backward;r_postlude();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.de.stemmer,"stemmer-de");lunr.de.stopWordFilter=lunr.generateStopWordFilter("aber alle allem allen aller alles als also am an ander andere anderem anderen anderer anderes anderm andern anderr anders auch auf aus bei bin bis bist da damit dann das dasselbe dazu daß dein deine deinem deinen deiner deines dem demselben den denn denselben der derer derselbe derselben des desselben dessen dich die dies diese dieselbe dieselben diesem diesen dieser dieses dir doch dort du durch ein eine einem einen einer eines einig einige einigem einigen einiger einiges einmal er es etwas euch euer eure eurem euren eurer eures für gegen gewesen hab habe haben hat hatte hatten hier hin hinter ich ihm ihn ihnen ihr ihre ihrem ihren ihrer ihres im in indem ins ist jede jedem jeden jeder jedes jene jenem jenen jener jenes jetzt kann kein keine keinem keinen keiner keines können könnte machen man manche manchem manchen mancher manches mein meine meinem meinen meiner meines mich mir mit muss musste nach nicht nichts noch nun nur ob oder ohne sehr sein seine seinem seinen seiner seines selbst sich sie sind so solche solchem solchen solcher solches soll sollte sondern sonst um und uns unse unsem unsen unser unses unter viel vom von vor war waren warst was weg weil weiter welche welchem welchen welcher welches wenn werde werden wie wieder will wir wird wirst wo wollen wollte während würde würden zu zum zur zwar zwischen über".split(" "));
lunr.Pipeline.registerFunction(lunr.de.stopWordFilter,"stopWordFilter-de")}});
/*!
 * Lunr languages, `Spanish` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.es=function(){this.pipeline.reset();this.pipeline.add(lunr.es.trimmer,lunr.es.stopWordFilter,lunr.es.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.es.stemmer)
}};lunr.es.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.es.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.es.wordCharacters);lunr.Pipeline.registerFunction(lunr.es.trimmer,"trimmer-es");
lunr.es.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function SpanishStemmer(){var a_0=[new Among("",-1,6),new Among("á",0,1),new Among("é",0,2),new Among("í",0,3),new Among("ó",0,4),new Among("ú",0,5)],a_1=[new Among("la",-1,-1),new Among("sela",0,-1),new Among("le",-1,-1),new Among("me",-1,-1),new Among("se",-1,-1),new Among("lo",-1,-1),new Among("selo",5,-1),new Among("las",-1,-1),new Among("selas",7,-1),new Among("les",-1,-1),new Among("los",-1,-1),new Among("selos",10,-1),new Among("nos",-1,-1)],a_2=[new Among("ando",-1,6),new Among("iendo",-1,6),new Among("yendo",-1,7),new Among("ándo",-1,2),new Among("iéndo",-1,1),new Among("ar",-1,6),new Among("er",-1,6),new Among("ir",-1,6),new Among("ár",-1,3),new Among("ér",-1,4),new Among("ír",-1,5)],a_3=[new Among("ic",-1,-1),new Among("ad",-1,-1),new Among("os",-1,-1),new Among("iv",-1,1)],a_4=[new Among("able",-1,1),new Among("ible",-1,1),new Among("ante",-1,1)],a_5=[new Among("ic",-1,1),new Among("abil",-1,1),new Among("iv",-1,1)],a_6=[new Among("ica",-1,1),new Among("ancia",-1,2),new Among("encia",-1,5),new Among("adora",-1,2),new Among("osa",-1,1),new Among("ista",-1,1),new Among("iva",-1,9),new Among("anza",-1,1),new Among("logía",-1,3),new Among("idad",-1,8),new Among("able",-1,1),new Among("ible",-1,1),new Among("ante",-1,2),new Among("mente",-1,7),new Among("amente",13,6),new Among("ación",-1,2),new Among("ución",-1,4),new Among("ico",-1,1),new Among("ismo",-1,1),new Among("oso",-1,1),new Among("amiento",-1,1),new Among("imiento",-1,1),new Among("ivo",-1,9),new Among("ador",-1,2),new Among("icas",-1,1),new Among("ancias",-1,2),new Among("encias",-1,5),new Among("adoras",-1,2),new Among("osas",-1,1),new Among("istas",-1,1),new Among("ivas",-1,9),new Among("anzas",-1,1),new Among("logías",-1,3),new Among("idades",-1,8),new Among("ables",-1,1),new Among("ibles",-1,1),new Among("aciones",-1,2),new Among("uciones",-1,4),new Among("adores",-1,2),new Among("antes",-1,2),new Among("icos",-1,1),new Among("ismos",-1,1),new Among("osos",-1,1),new Among("amientos",-1,1),new Among("imientos",-1,1),new Among("ivos",-1,9)],a_7=[new Among("ya",-1,1),new Among("ye",-1,1),new Among("yan",-1,1),new Among("yen",-1,1),new Among("yeron",-1,1),new Among("yendo",-1,1),new Among("yo",-1,1),new Among("yas",-1,1),new Among("yes",-1,1),new Among("yais",-1,1),new Among("yamos",-1,1),new Among("yó",-1,1)],a_8=[new Among("aba",-1,2),new Among("ada",-1,2),new Among("ida",-1,2),new Among("ara",-1,2),new Among("iera",-1,2),new Among("ía",-1,2),new Among("aría",5,2),new Among("ería",5,2),new Among("iría",5,2),new Among("ad",-1,2),new Among("ed",-1,2),new Among("id",-1,2),new Among("ase",-1,2),new Among("iese",-1,2),new Among("aste",-1,2),new Among("iste",-1,2),new Among("an",-1,2),new Among("aban",16,2),new Among("aran",16,2),new Among("ieran",16,2),new Among("ían",16,2),new Among("arían",20,2),new Among("erían",20,2),new Among("irían",20,2),new Among("en",-1,1),new Among("asen",24,2),new Among("iesen",24,2),new Among("aron",-1,2),new Among("ieron",-1,2),new Among("arán",-1,2),new Among("erán",-1,2),new Among("irán",-1,2),new Among("ado",-1,2),new Among("ido",-1,2),new Among("ando",-1,2),new Among("iendo",-1,2),new Among("ar",-1,2),new Among("er",-1,2),new Among("ir",-1,2),new Among("as",-1,2),new Among("abas",39,2),new Among("adas",39,2),new Among("idas",39,2),new Among("aras",39,2),new Among("ieras",39,2),new Among("ías",39,2),new Among("arías",45,2),new Among("erías",45,2),new Among("irías",45,2),new Among("es",-1,1),new Among("ases",49,2),new Among("ieses",49,2),new Among("abais",-1,2),new Among("arais",-1,2),new Among("ierais",-1,2),new Among("íais",-1,2),new Among("aríais",55,2),new Among("eríais",55,2),new Among("iríais",55,2),new Among("aseis",-1,2),new Among("ieseis",-1,2),new Among("asteis",-1,2),new Among("isteis",-1,2),new Among("áis",-1,2),new Among("éis",-1,1),new Among("aréis",64,2),new Among("eréis",64,2),new Among("iréis",64,2),new Among("ados",-1,2),new Among("idos",-1,2),new Among("amos",-1,2),new Among("ábamos",70,2),new Among("áramos",70,2),new Among("iéramos",70,2),new Among("íamos",70,2),new Among("aríamos",74,2),new Among("eríamos",74,2),new Among("iríamos",74,2),new Among("emos",-1,1),new Among("aremos",78,2),new Among("eremos",78,2),new Among("iremos",78,2),new Among("ásemos",78,2),new Among("iésemos",78,2),new Among("imos",-1,2),new Among("arás",-1,2),new Among("erás",-1,2),new Among("irás",-1,2),new Among("ís",-1,2),new Among("ará",-1,2),new Among("erá",-1,2),new Among("irá",-1,2),new Among("aré",-1,2),new Among("eré",-1,2),new Among("iré",-1,2),new Among("ió",-1,2)],a_9=[new Among("a",-1,1),new Among("e",-1,2),new Among("o",-1,1),new Among("os",-1,1),new Among("á",-1,1),new Among("é",-1,2),new Among("í",-1,1),new Among("ó",-1,1)],g_v=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,1,17,4,10],I_p2,I_p1,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(){if(sbp.out_grouping(g_v,97,252)){while(!sbp.in_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}return true}function habr2(){if(sbp.in_grouping(g_v,97,252)){var v_1=sbp.cursor;
if(habr1()){sbp.cursor=v_1;if(!sbp.in_grouping(g_v,97,252)){return true}while(!sbp.out_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}}return false}return true}function habr3(){var v_1=sbp.cursor,v_2;if(habr2()){sbp.cursor=v_1;
if(!sbp.out_grouping(g_v,97,252)){return}v_2=sbp.cursor;if(habr1()){sbp.cursor=v_2;
if(!sbp.in_grouping(g_v,97,252)||sbp.cursor>=sbp.limit){return}sbp.cursor++}}I_pV=sbp.cursor
}function habr4(){while(!sbp.in_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function r_mark_regions(){var v_1=sbp.cursor;I_pV=sbp.limit;
I_p1=I_pV;I_p2=I_pV;habr3();sbp.cursor=v_1;if(habr4()){I_p1=sbp.cursor;if(habr4()){I_p2=sbp.cursor
}}}function r_postlude(){var among_var;while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_0,6);
if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("a");continue;
case 2:sbp.slice_from("e");continue;case 3:sbp.slice_from("i");continue;case 4:sbp.slice_from("o");
continue;case 5:sbp.slice_from("u");continue;case 6:if(sbp.cursor>=sbp.limit){break
}sbp.cursor++;continue}}break}}function r_RV(){return I_pV<=sbp.cursor}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_attached_pronoun(){var among_var;
sbp.ket=sbp.cursor;if(sbp.find_among_b(a_1,13)){sbp.bra=sbp.cursor;among_var=sbp.find_among_b(a_2,11);
if(among_var&&r_RV()){switch(among_var){case 1:sbp.bra=sbp.cursor;sbp.slice_from("iendo");
break;case 2:sbp.bra=sbp.cursor;sbp.slice_from("ando");break;case 3:sbp.bra=sbp.cursor;
sbp.slice_from("ar");break;case 4:sbp.bra=sbp.cursor;sbp.slice_from("er");break;case 5:sbp.bra=sbp.cursor;
sbp.slice_from("ir");break;case 6:sbp.slice_del();break;case 7:if(sbp.eq_s_b(1,"u")){sbp.slice_del()
}break}}}}function habr5(a,n){if(!r_R2()){return true}sbp.slice_del();sbp.ket=sbp.cursor;
var among_var=sbp.find_among_b(a,n);if(among_var){sbp.bra=sbp.cursor;if(among_var==1&&r_R2()){sbp.slice_del()
}}return false}function habr6(c1){if(!r_R2()){return true}sbp.slice_del();sbp.ket=sbp.cursor;
if(sbp.eq_s_b(2,c1)){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()}}return false}function r_standard_suffix(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_6,46);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:if(!r_R2()){return false}sbp.slice_del();break;case 2:if(habr6("ic")){return false
}break;case 3:if(!r_R2()){return false}sbp.slice_from("log");break;case 4:if(!r_R2()){return false
}sbp.slice_from("u");break;case 5:if(!r_R2()){return false}sbp.slice_from("ente");
break;case 6:if(!r_R1()){return false}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,4);
if(among_var){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del();if(among_var==1){sbp.ket=sbp.cursor;
if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()}}}}}break;case 7:if(habr5(a_4,3)){return false
}break;case 8:if(habr5(a_5,3)){return false}break;case 9:if(habr6("at")){return false
}break}return true}return false}function r_y_verb_suffix(){var among_var,v_1;if(sbp.cursor>=I_pV){v_1=sbp.limit_backward;
sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_7,12);sbp.limit_backward=v_1;
if(among_var){sbp.bra=sbp.cursor;if(among_var==1){if(!sbp.eq_s_b(1,"u")){return false
}sbp.slice_del()}return true}}return false}function r_verb_suffix(){var among_var,v_1,v_2,v_3;
if(sbp.cursor>=I_pV){v_1=sbp.limit_backward;sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_8,96);sbp.limit_backward=v_1;if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:v_2=sbp.limit-sbp.cursor;if(sbp.eq_s_b(1,"u")){v_3=sbp.limit-sbp.cursor;
if(sbp.eq_s_b(1,"g")){sbp.cursor=sbp.limit-v_3}else{sbp.cursor=sbp.limit-v_2}}else{sbp.cursor=sbp.limit-v_2
}sbp.bra=sbp.cursor;case 2:sbp.slice_del();break}}}}function r_residual_suffix(){var among_var,v_1;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_9,8);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:if(r_RV()){sbp.slice_del()}break;case 2:if(r_RV()){sbp.slice_del();
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"u")){sbp.bra=sbp.cursor;v_1=sbp.limit-sbp.cursor;
if(sbp.eq_s_b(1,"g")){sbp.cursor=sbp.limit-v_1;if(r_RV()){sbp.slice_del()}}}}break
}}}this.stem=function(){var v_1=sbp.cursor;r_mark_regions();sbp.limit_backward=v_1;
sbp.cursor=sbp.limit;r_attached_pronoun();sbp.cursor=sbp.limit;if(!r_standard_suffix()){sbp.cursor=sbp.limit;
if(!r_y_verb_suffix()){sbp.cursor=sbp.limit;r_verb_suffix()}}sbp.cursor=sbp.limit;
r_residual_suffix();sbp.cursor=sbp.limit_backward;r_postlude();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.es.stemmer,"stemmer-es");lunr.es.stopWordFilter=lunr.generateStopWordFilter("a al algo algunas algunos ante antes como con contra cual cuando de del desde donde durante e el ella ellas ellos en entre era erais eran eras eres es esa esas ese eso esos esta estaba estabais estaban estabas estad estada estadas estado estados estamos estando estar estaremos estará estarán estarás estaré estaréis estaría estaríais estaríamos estarían estarías estas este estemos esto estos estoy estuve estuviera estuvierais estuvieran estuvieras estuvieron estuviese estuvieseis estuviesen estuvieses estuvimos estuviste estuvisteis estuviéramos estuviésemos estuvo está estábamos estáis están estás esté estéis estén estés fue fuera fuerais fueran fueras fueron fuese fueseis fuesen fueses fui fuimos fuiste fuisteis fuéramos fuésemos ha habida habidas habido habidos habiendo habremos habrá habrán habrás habré habréis habría habríais habríamos habrían habrías habéis había habíais habíamos habían habías han has hasta hay haya hayamos hayan hayas hayáis he hemos hube hubiera hubierais hubieran hubieras hubieron hubiese hubieseis hubiesen hubieses hubimos hubiste hubisteis hubiéramos hubiésemos hubo la las le les lo los me mi mis mucho muchos muy más mí mía mías mío míos nada ni no nos nosotras nosotros nuestra nuestras nuestro nuestros o os otra otras otro otros para pero poco por porque que quien quienes qué se sea seamos sean seas seremos será serán serás seré seréis sería seríais seríamos serían serías seáis sido siendo sin sobre sois somos son soy su sus suya suyas suyo suyos sí también tanto te tendremos tendrá tendrán tendrás tendré tendréis tendría tendríais tendríamos tendrían tendrías tened tenemos tenga tengamos tengan tengas tengo tengáis tenida tenidas tenido tenidos teniendo tenéis tenía teníais teníamos tenían tenías ti tiene tienen tienes todo todos tu tus tuve tuviera tuvierais tuvieran tuvieras tuvieron tuviese tuvieseis tuviesen tuvieses tuvimos tuviste tuvisteis tuviéramos tuviésemos tuvo tuya tuyas tuyo tuyos tú un una uno unos vosotras vosotros vuestra vuestras vuestro vuestros y ya yo él éramos".split(" "));
lunr.Pipeline.registerFunction(lunr.es.stopWordFilter,"stopWordFilter-es")}});
/*!
 * Lunr languages, `Finnish` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.fi=function(){this.pipeline.reset();this.pipeline.add(lunr.fi.trimmer,lunr.fi.stopWordFilter,lunr.fi.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.fi.stemmer)
}};lunr.fi.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.fi.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.fi.wordCharacters);lunr.Pipeline.registerFunction(lunr.fi.trimmer,"trimmer-fi");
lunr.fi.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function FinnishStemmer(){var a_0=[new Among("pa",-1,1),new Among("sti",-1,2),new Among("kaan",-1,1),new Among("han",-1,1),new Among("kin",-1,1),new Among("hän",-1,1),new Among("kään",-1,1),new Among("ko",-1,1),new Among("pä",-1,1),new Among("kö",-1,1)],a_1=[new Among("lla",-1,-1),new Among("na",-1,-1),new Among("ssa",-1,-1),new Among("ta",-1,-1),new Among("lta",3,-1),new Among("sta",3,-1)],a_2=[new Among("llä",-1,-1),new Among("nä",-1,-1),new Among("ssä",-1,-1),new Among("tä",-1,-1),new Among("ltä",3,-1),new Among("stä",3,-1)],a_3=[new Among("lle",-1,-1),new Among("ine",-1,-1)],a_4=[new Among("nsa",-1,3),new Among("mme",-1,3),new Among("nne",-1,3),new Among("ni",-1,2),new Among("si",-1,1),new Among("an",-1,4),new Among("en",-1,6),new Among("än",-1,5),new Among("nsä",-1,3)],a_5=[new Among("aa",-1,-1),new Among("ee",-1,-1),new Among("ii",-1,-1),new Among("oo",-1,-1),new Among("uu",-1,-1),new Among("ää",-1,-1),new Among("öö",-1,-1)],a_6=[new Among("a",-1,8),new Among("lla",0,-1),new Among("na",0,-1),new Among("ssa",0,-1),new Among("ta",0,-1),new Among("lta",4,-1),new Among("sta",4,-1),new Among("tta",4,9),new Among("lle",-1,-1),new Among("ine",-1,-1),new Among("ksi",-1,-1),new Among("n",-1,7),new Among("han",11,1),new Among("den",11,-1,r_VI),new Among("seen",11,-1,r_LONG),new Among("hen",11,2),new Among("tten",11,-1,r_VI),new Among("hin",11,3),new Among("siin",11,-1,r_VI),new Among("hon",11,4),new Among("hän",11,5),new Among("hön",11,6),new Among("ä",-1,8),new Among("llä",22,-1),new Among("nä",22,-1),new Among("ssä",22,-1),new Among("tä",22,-1),new Among("ltä",26,-1),new Among("stä",26,-1),new Among("ttä",26,9)],a_7=[new Among("eja",-1,-1),new Among("mma",-1,1),new Among("imma",1,-1),new Among("mpa",-1,1),new Among("impa",3,-1),new Among("mmi",-1,1),new Among("immi",5,-1),new Among("mpi",-1,1),new Among("impi",7,-1),new Among("ejä",-1,-1),new Among("mmä",-1,1),new Among("immä",10,-1),new Among("mpä",-1,1),new Among("impä",12,-1)],a_8=[new Among("i",-1,-1),new Among("j",-1,-1)],a_9=[new Among("mma",-1,1),new Among("imma",0,-1)],g_AEI=[17,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8],g_V1=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,8,0,32],g_V2=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,32],g_particle_end=[17,97,24,1,0,0,0,0,0,0,0,0,0,0,0,0,8,0,32],B_ending_removed,S_x,I_p2,I_p1,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_mark_regions(){I_p1=sbp.limit;I_p2=I_p1;if(!habr1()){I_p1=sbp.cursor;
if(!habr1()){I_p2=sbp.cursor}}}function habr1(){var v_1;while(true){v_1=sbp.cursor;
if(sbp.in_grouping(g_V1,97,246)){break}sbp.cursor=v_1;if(v_1>=sbp.limit){return true
}sbp.cursor++}sbp.cursor=v_1;while(!sbp.out_grouping(g_V1,97,246)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}function r_R2(){return I_p2<=sbp.cursor}function r_particle_etc(){var among_var,v_1;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_0,10);if(among_var){sbp.bra=sbp.cursor;sbp.limit_backward=v_1;
switch(among_var){case 1:if(!sbp.in_grouping_b(g_particle_end,97,246)){return}break;
case 2:if(!r_R2()){return}break}sbp.slice_del()}else{sbp.limit_backward=v_1}}}function r_possessive(){var among_var,v_1,v_2;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_4,9);if(among_var){sbp.bra=sbp.cursor;sbp.limit_backward=v_1;
switch(among_var){case 1:v_2=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"k")){sbp.cursor=sbp.limit-v_2;
sbp.slice_del()}break;case 2:sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(3,"kse")){sbp.bra=sbp.cursor;
sbp.slice_from("ksi")}break;case 3:sbp.slice_del();break;case 4:if(sbp.find_among_b(a_1,6)){sbp.slice_del()
}break;case 5:if(sbp.find_among_b(a_2,6)){sbp.slice_del()}break;case 6:if(sbp.find_among_b(a_3,2)){sbp.slice_del()
}break}}else{sbp.limit_backward=v_1}}}function r_LONG(){return sbp.find_among_b(a_5,7)
}function r_VI(){return sbp.eq_s_b(1,"i")&&sbp.in_grouping_b(g_V2,97,246)}function r_case_ending(){var among_var,v_1,v_2;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_6,30);if(among_var){sbp.bra=sbp.cursor;sbp.limit_backward=v_1;
switch(among_var){case 1:if(!sbp.eq_s_b(1,"a")){return}break;case 2:case 9:if(!sbp.eq_s_b(1,"e")){return
}break;case 3:if(!sbp.eq_s_b(1,"i")){return}break;case 4:if(!sbp.eq_s_b(1,"o")){return
}break;case 5:if(!sbp.eq_s_b(1,"ä")){return}break;case 6:if(!sbp.eq_s_b(1,"ö")){return
}break;case 7:v_2=sbp.limit-sbp.cursor;if(!r_LONG()){sbp.cursor=sbp.limit-v_2;if(!sbp.eq_s_b(2,"ie")){sbp.cursor=sbp.limit-v_2;
break}}sbp.cursor=sbp.limit-v_2;if(sbp.cursor<=sbp.limit_backward){sbp.cursor=sbp.limit-v_2;
break}sbp.cursor--;sbp.bra=sbp.cursor;break;case 8:if(!sbp.in_grouping_b(g_V1,97,246)||!sbp.out_grouping_b(g_V1,97,246)){return
}break}sbp.slice_del();B_ending_removed=true}else{sbp.limit_backward=v_1}}}function r_other_endings(){var among_var,v_1,v_2;
if(sbp.cursor>=I_p2){v_1=sbp.limit_backward;sbp.limit_backward=I_p2;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_7,14);if(among_var){sbp.bra=sbp.cursor;sbp.limit_backward=v_1;
if(among_var==1){v_2=sbp.limit-sbp.cursor;if(sbp.eq_s_b(2,"po")){return}sbp.cursor=sbp.limit-v_2
}sbp.slice_del()}else{sbp.limit_backward=v_1}}}function r_i_plural(){var v_1;if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;
sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;if(sbp.find_among_b(a_8,2)){sbp.bra=sbp.cursor;
sbp.limit_backward=v_1;sbp.slice_del()}else{sbp.limit_backward=v_1}}}function r_t_plural(){var among_var,v_1,v_2,v_3,v_4,v_5;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
if(sbp.eq_s_b(1,"t")){sbp.bra=sbp.cursor;v_2=sbp.limit-sbp.cursor;if(sbp.in_grouping_b(g_V1,97,246)){sbp.cursor=sbp.limit-v_2;
sbp.slice_del();sbp.limit_backward=v_1;v_3=sbp.limit-sbp.cursor;if(sbp.cursor>=I_p2){sbp.cursor=I_p2;
v_4=sbp.limit_backward;sbp.limit_backward=sbp.cursor;sbp.cursor=sbp.limit-v_3;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_9,2);if(among_var){sbp.bra=sbp.cursor;sbp.limit_backward=v_4;
if(among_var==1){v_5=sbp.limit-sbp.cursor;if(sbp.eq_s_b(2,"po")){return}sbp.cursor=sbp.limit-v_5
}sbp.slice_del();return}}}}sbp.limit_backward=v_1}}function r_tidy(){var v_1,v_2,v_3,v_4;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;v_2=sbp.limit-sbp.cursor;
if(r_LONG()){sbp.cursor=sbp.limit-v_2;sbp.ket=sbp.cursor;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;
sbp.bra=sbp.cursor;sbp.slice_del()}}sbp.cursor=sbp.limit-v_2;sbp.ket=sbp.cursor;if(sbp.in_grouping_b(g_AEI,97,228)){sbp.bra=sbp.cursor;
if(sbp.out_grouping_b(g_V1,97,246)){sbp.slice_del()}}sbp.cursor=sbp.limit-v_2;sbp.ket=sbp.cursor;
if(sbp.eq_s_b(1,"j")){sbp.bra=sbp.cursor;v_3=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"o")){sbp.cursor=sbp.limit-v_3;
if(sbp.eq_s_b(1,"u")){sbp.slice_del()}}else{sbp.slice_del()}}sbp.cursor=sbp.limit-v_2;
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"o")){sbp.bra=sbp.cursor;if(sbp.eq_s_b(1,"j")){sbp.slice_del()
}}sbp.cursor=sbp.limit-v_2;sbp.limit_backward=v_1;while(true){v_4=sbp.limit-sbp.cursor;
if(sbp.out_grouping_b(g_V1,97,246)){sbp.cursor=sbp.limit-v_4;break}sbp.cursor=sbp.limit-v_4;
if(sbp.cursor<=sbp.limit_backward){return}sbp.cursor--}sbp.ket=sbp.cursor;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;
sbp.bra=sbp.cursor;S_x=sbp.slice_to();if(sbp.eq_v_b(S_x)){sbp.slice_del()}}}}this.stem=function(){var v_1=sbp.cursor;
r_mark_regions();B_ending_removed=false;sbp.limit_backward=v_1;sbp.cursor=sbp.limit;
r_particle_etc();sbp.cursor=sbp.limit;r_possessive();sbp.cursor=sbp.limit;r_case_ending();
sbp.cursor=sbp.limit;r_other_endings();sbp.cursor=sbp.limit;if(B_ending_removed){r_i_plural();
sbp.cursor=sbp.limit}else{sbp.cursor=sbp.limit;r_t_plural();sbp.cursor=sbp.limit}r_tidy();
return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.fi.stemmer,"stemmer-fi");lunr.fi.stopWordFilter=lunr.generateStopWordFilter("ei eivät emme en et ette että he heidän heidät heihin heille heillä heiltä heissä heistä heitä hän häneen hänelle hänellä häneltä hänen hänessä hänestä hänet häntä itse ja johon joiden joihin joiksi joilla joille joilta joina joissa joista joita joka joksi jolla jolle jolta jona jonka jos jossa josta jota jotka kanssa keiden keihin keiksi keille keillä keiltä keinä keissä keistä keitä keneen keneksi kenelle kenellä keneltä kenen kenenä kenessä kenestä kenet ketkä ketkä ketä koska kuin kuka kun me meidän meidät meihin meille meillä meiltä meissä meistä meitä mihin miksi mikä mille millä miltä minkä minkä minua minulla minulle minulta minun minussa minusta minut minuun minä minä missä mistä mitkä mitä mukaan mutta ne niiden niihin niiksi niille niillä niiltä niin niin niinä niissä niistä niitä noiden noihin noiksi noilla noille noilta noin noina noissa noista noita nuo nyt näiden näihin näiksi näille näillä näiltä näinä näissä näistä näitä nämä ole olemme olen olet olette oli olimme olin olisi olisimme olisin olisit olisitte olisivat olit olitte olivat olla olleet ollut on ovat poikki se sekä sen siihen siinä siitä siksi sille sillä sillä siltä sinua sinulla sinulle sinulta sinun sinussa sinusta sinut sinuun sinä sinä sitä tai te teidän teidät teihin teille teillä teiltä teissä teistä teitä tuo tuohon tuoksi tuolla tuolle tuolta tuon tuona tuossa tuosta tuota tähän täksi tälle tällä tältä tämä tämän tänä tässä tästä tätä vaan vai vaikka yli".split(" "));
lunr.Pipeline.registerFunction(lunr.fi.stopWordFilter,"stopWordFilter-fi")}});
/*!
 * Lunr languages, `French` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.fr=function(){this.pipeline.reset();this.pipeline.add(lunr.fr.trimmer,lunr.fr.stopWordFilter,lunr.fr.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.fr.stemmer)
}};lunr.fr.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.fr.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.fr.wordCharacters);lunr.Pipeline.registerFunction(lunr.fr.trimmer,"trimmer-fr");
lunr.fr.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function FrenchStemmer(){var a_0=[new Among("col",-1,-1),new Among("par",-1,-1),new Among("tap",-1,-1)],a_1=[new Among("",-1,4),new Among("I",0,1),new Among("U",0,2),new Among("Y",0,3)],a_2=[new Among("iqU",-1,3),new Among("abl",-1,3),new Among("Ièr",-1,4),new Among("ièr",-1,4),new Among("eus",-1,2),new Among("iv",-1,1)],a_3=[new Among("ic",-1,2),new Among("abil",-1,1),new Among("iv",-1,3)],a_4=[new Among("iqUe",-1,1),new Among("atrice",-1,2),new Among("ance",-1,1),new Among("ence",-1,5),new Among("logie",-1,3),new Among("able",-1,1),new Among("isme",-1,1),new Among("euse",-1,11),new Among("iste",-1,1),new Among("ive",-1,8),new Among("if",-1,8),new Among("usion",-1,4),new Among("ation",-1,2),new Among("ution",-1,4),new Among("ateur",-1,2),new Among("iqUes",-1,1),new Among("atrices",-1,2),new Among("ances",-1,1),new Among("ences",-1,5),new Among("logies",-1,3),new Among("ables",-1,1),new Among("ismes",-1,1),new Among("euses",-1,11),new Among("istes",-1,1),new Among("ives",-1,8),new Among("ifs",-1,8),new Among("usions",-1,4),new Among("ations",-1,2),new Among("utions",-1,4),new Among("ateurs",-1,2),new Among("ments",-1,15),new Among("ements",30,6),new Among("issements",31,12),new Among("ités",-1,7),new Among("ment",-1,15),new Among("ement",34,6),new Among("issement",35,12),new Among("amment",34,13),new Among("emment",34,14),new Among("aux",-1,10),new Among("eaux",39,9),new Among("eux",-1,1),new Among("ité",-1,7)],a_5=[new Among("ira",-1,1),new Among("ie",-1,1),new Among("isse",-1,1),new Among("issante",-1,1),new Among("i",-1,1),new Among("irai",4,1),new Among("ir",-1,1),new Among("iras",-1,1),new Among("ies",-1,1),new Among("îmes",-1,1),new Among("isses",-1,1),new Among("issantes",-1,1),new Among("îtes",-1,1),new Among("is",-1,1),new Among("irais",13,1),new Among("issais",13,1),new Among("irions",-1,1),new Among("issions",-1,1),new Among("irons",-1,1),new Among("issons",-1,1),new Among("issants",-1,1),new Among("it",-1,1),new Among("irait",21,1),new Among("issait",21,1),new Among("issant",-1,1),new Among("iraIent",-1,1),new Among("issaIent",-1,1),new Among("irent",-1,1),new Among("issent",-1,1),new Among("iront",-1,1),new Among("ît",-1,1),new Among("iriez",-1,1),new Among("issiez",-1,1),new Among("irez",-1,1),new Among("issez",-1,1)],a_6=[new Among("a",-1,3),new Among("era",0,2),new Among("asse",-1,3),new Among("ante",-1,3),new Among("ée",-1,2),new Among("ai",-1,3),new Among("erai",5,2),new Among("er",-1,2),new Among("as",-1,3),new Among("eras",8,2),new Among("âmes",-1,3),new Among("asses",-1,3),new Among("antes",-1,3),new Among("âtes",-1,3),new Among("ées",-1,2),new Among("ais",-1,3),new Among("erais",15,2),new Among("ions",-1,1),new Among("erions",17,2),new Among("assions",17,3),new Among("erons",-1,2),new Among("ants",-1,3),new Among("és",-1,2),new Among("ait",-1,3),new Among("erait",23,2),new Among("ant",-1,3),new Among("aIent",-1,3),new Among("eraIent",26,2),new Among("èrent",-1,2),new Among("assent",-1,3),new Among("eront",-1,2),new Among("ât",-1,3),new Among("ez",-1,2),new Among("iez",32,2),new Among("eriez",33,2),new Among("assiez",33,3),new Among("erez",32,2),new Among("é",-1,2)],a_7=[new Among("e",-1,3),new Among("Ière",0,2),new Among("ière",0,2),new Among("ion",-1,1),new Among("Ier",-1,2),new Among("ier",-1,2),new Among("ë",-1,4)],a_8=[new Among("ell",-1,-1),new Among("eill",-1,-1),new Among("enn",-1,-1),new Among("onn",-1,-1),new Among("ett",-1,-1)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,128,130,103,8,5],g_keep_with_s=[1,65,20,0,0,0,0,0,0,0,0,0,0,0,0,0,128],I_p2,I_p1,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(c1,c2,v_1){if(sbp.eq_s(1,c1)){sbp.ket=sbp.cursor;if(sbp.in_grouping(g_v,97,251)){sbp.slice_from(c2);
sbp.cursor=v_1;return true}}return false}function habr2(c1,c2,v_1){if(sbp.eq_s(1,c1)){sbp.ket=sbp.cursor;
sbp.slice_from(c2);sbp.cursor=v_1;return true}return false}function r_prelude(){var v_1,v_2;
while(true){v_1=sbp.cursor;if(sbp.in_grouping(g_v,97,251)){sbp.bra=sbp.cursor;v_2=sbp.cursor;
if(habr1("u","U",v_1)){continue}sbp.cursor=v_2;if(habr1("i","I",v_1)){continue}sbp.cursor=v_2;
if(habr2("y","Y",v_1)){continue}}sbp.cursor=v_1;sbp.bra=v_1;if(!habr1("y","Y",v_1)){sbp.cursor=v_1;
if(sbp.eq_s(1,"q")){sbp.bra=sbp.cursor;if(habr2("u","U",v_1)){continue}}sbp.cursor=v_1;
if(v_1>=sbp.limit){return}sbp.cursor++}}}function habr3(){while(!sbp.in_grouping(g_v,97,251)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,251)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}function r_mark_regions(){var v_1=sbp.cursor;I_pV=sbp.limit;
I_p1=I_pV;I_p2=I_pV;if(sbp.in_grouping(g_v,97,251)&&sbp.in_grouping(g_v,97,251)&&sbp.cursor<sbp.limit){sbp.cursor++
}else{sbp.cursor=v_1;if(!sbp.find_among(a_0,3)){sbp.cursor=v_1;do{if(sbp.cursor>=sbp.limit){sbp.cursor=I_pV;
break}sbp.cursor++}while(!sbp.in_grouping(g_v,97,251))}}I_pV=sbp.cursor;sbp.cursor=v_1;
if(!habr3()){I_p1=sbp.cursor;if(!habr3()){I_p2=sbp.cursor}}}function r_postlude(){var among_var,v_1;
while(true){v_1=sbp.cursor;sbp.bra=v_1;among_var=sbp.find_among(a_1,4);if(!among_var){break
}sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("i");break;case 2:sbp.slice_from("u");
break;case 3:sbp.slice_from("y");break;case 4:if(sbp.cursor>=sbp.limit){return}sbp.cursor++;
break}}}function r_RV(){return I_pV<=sbp.cursor}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_standard_suffix(){var among_var,v_1;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_4,43);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:if(!r_R2()){return false}sbp.slice_del();break;case 2:if(!r_R2()){return false
}sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"ic")){sbp.bra=sbp.cursor;if(!r_R2()){sbp.slice_from("iqU")
}else{sbp.slice_del()}}break;case 3:if(!r_R2()){return false}sbp.slice_from("log");
break;case 4:if(!r_R2()){return false}sbp.slice_from("u");break;case 5:if(!r_R2()){return false
}sbp.slice_from("ent");break;case 6:if(!r_RV()){return false}sbp.slice_del();sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_2,6);if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:if(r_R2()){sbp.slice_del();
sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()
}}}break;case 2:if(r_R2()){sbp.slice_del()}else{if(r_R1()){sbp.slice_from("eux")}}break;
case 3:if(r_R2()){sbp.slice_del()}break;case 4:if(r_RV()){sbp.slice_from("i")}break
}}break;case 7:if(!r_R2()){return false}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,3);
if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:if(r_R2()){sbp.slice_del()
}else{sbp.slice_from("abl")}break;case 2:if(r_R2()){sbp.slice_del()}else{sbp.slice_from("iqU")
}break;case 3:if(r_R2()){sbp.slice_del()}break}}break;case 8:if(!r_R2()){return false
}sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del();
sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"ic")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()
}else{sbp.slice_from("iqU")}break}}}break;case 9:sbp.slice_from("eau");break;case 10:if(!r_R1()){return false
}sbp.slice_from("al");break;case 11:if(r_R2()){sbp.slice_del()}else{if(!r_R1()){return false
}else{sbp.slice_from("eux")}}break;case 12:if(!r_R1()||!sbp.out_grouping_b(g_v,97,251)){return false
}sbp.slice_del();break;case 13:if(r_RV()){sbp.slice_from("ant")}return false;case 14:if(r_RV()){sbp.slice_from("ent")
}return false;case 15:v_1=sbp.limit-sbp.cursor;if(sbp.in_grouping_b(g_v,97,251)&&r_RV()){sbp.cursor=sbp.limit-v_1;
sbp.slice_del()}return false}return true}return false}function r_i_verb_suffix(){var among_var,v_1;
if(sbp.cursor<I_pV){return false}v_1=sbp.limit_backward;sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_5,35);if(!among_var){sbp.limit_backward=v_1;return false
}sbp.bra=sbp.cursor;if(among_var==1){if(!sbp.out_grouping_b(g_v,97,251)){sbp.limit_backward=v_1;
return false}sbp.slice_del()}sbp.limit_backward=v_1;return true}function r_verb_suffix(){var among_var,v_2,v_3;
if(sbp.cursor<I_pV){return false}v_2=sbp.limit_backward;sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_6,38);if(!among_var){sbp.limit_backward=v_2;return false
}sbp.bra=sbp.cursor;switch(among_var){case 1:if(!r_R2()){sbp.limit_backward=v_2;return false
}sbp.slice_del();break;case 2:sbp.slice_del();break;case 3:sbp.slice_del();v_3=sbp.limit-sbp.cursor;
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"e")){sbp.bra=sbp.cursor;sbp.slice_del()}else{sbp.cursor=sbp.limit-v_3
}break}sbp.limit_backward=v_2;return true}function r_residual_suffix(){var among_var,v_1=sbp.limit-sbp.cursor,v_2,v_4,v_5;
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"s")){sbp.bra=sbp.cursor;v_2=sbp.limit-sbp.cursor;
if(sbp.out_grouping_b(g_keep_with_s,97,232)){sbp.cursor=sbp.limit-v_2;sbp.slice_del()
}else{sbp.cursor=sbp.limit-v_1}}else{sbp.cursor=sbp.limit-v_1}if(sbp.cursor>=I_pV){v_4=sbp.limit_backward;
sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_7,7);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:if(r_R2()){v_5=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"s")){sbp.cursor=sbp.limit-v_5;
if(!sbp.eq_s_b(1,"t")){break}}sbp.slice_del()}break;case 2:sbp.slice_from("i");break;
case 3:sbp.slice_del();break;case 4:if(sbp.eq_s_b(2,"gu")){sbp.slice_del()}break}}sbp.limit_backward=v_4
}}function r_un_double(){var v_1=sbp.limit-sbp.cursor;if(sbp.find_among_b(a_8,5)){sbp.cursor=sbp.limit-v_1;
sbp.ket=sbp.cursor;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;sbp.bra=sbp.cursor;
sbp.slice_del()}}}function r_un_accent(){var v_1,v_2=1;while(sbp.out_grouping_b(g_v,97,251)){v_2--
}if(v_2<=0){sbp.ket=sbp.cursor;v_1=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"é")){sbp.cursor=sbp.limit-v_1;
if(!sbp.eq_s_b(1,"è")){return}}sbp.bra=sbp.cursor;sbp.slice_from("e")}}function habr5(){if(!r_standard_suffix()){sbp.cursor=sbp.limit;
if(!r_i_verb_suffix()){sbp.cursor=sbp.limit;if(!r_verb_suffix()){sbp.cursor=sbp.limit;
r_residual_suffix();return}}}sbp.cursor=sbp.limit;sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"Y")){sbp.bra=sbp.cursor;
sbp.slice_from("i")}else{sbp.cursor=sbp.limit;if(sbp.eq_s_b(1,"ç")){sbp.bra=sbp.cursor;
sbp.slice_from("c")}}}this.stem=function(){var v_1=sbp.cursor;r_prelude();sbp.cursor=v_1;
r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;habr5();sbp.cursor=sbp.limit;
r_un_double();sbp.cursor=sbp.limit;r_un_accent();sbp.cursor=sbp.limit_backward;r_postlude();
return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.fr.stemmer,"stemmer-fr");lunr.fr.stopWordFilter=lunr.generateStopWordFilter("ai aie aient aies ait as au aura aurai auraient aurais aurait auras aurez auriez aurions aurons auront aux avaient avais avait avec avez aviez avions avons ayant ayez ayons c ce ceci celà ces cet cette d dans de des du elle en es est et eu eue eues eurent eus eusse eussent eusses eussiez eussions eut eux eûmes eût eûtes furent fus fusse fussent fusses fussiez fussions fut fûmes fût fûtes ici il ils j je l la le les leur leurs lui m ma mais me mes moi mon même n ne nos notre nous on ont ou par pas pour qu que quel quelle quelles quels qui s sa sans se sera serai seraient serais serait seras serez seriez serions serons seront ses soi soient sois soit sommes son sont soyez soyons suis sur t ta te tes toi ton tu un une vos votre vous y à étaient étais était étant étiez étions été étée étées étés êtes".split(" "));
lunr.Pipeline.registerFunction(lunr.fr.stopWordFilter,"stopWordFilter-fr")}});
/*!
 * Lunr languages, `Hungarian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.hu=function(){this.pipeline.reset();this.pipeline.add(lunr.hu.trimmer,lunr.hu.stopWordFilter,lunr.hu.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.hu.stemmer)
}};lunr.hu.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.hu.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.hu.wordCharacters);lunr.Pipeline.registerFunction(lunr.hu.trimmer,"trimmer-hu");
lunr.hu.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function HungarianStemmer(){var a_0=[new Among("cs",-1,-1),new Among("dzs",-1,-1),new Among("gy",-1,-1),new Among("ly",-1,-1),new Among("ny",-1,-1),new Among("sz",-1,-1),new Among("ty",-1,-1),new Among("zs",-1,-1)],a_1=[new Among("á",-1,1),new Among("é",-1,2)],a_2=[new Among("bb",-1,-1),new Among("cc",-1,-1),new Among("dd",-1,-1),new Among("ff",-1,-1),new Among("gg",-1,-1),new Among("jj",-1,-1),new Among("kk",-1,-1),new Among("ll",-1,-1),new Among("mm",-1,-1),new Among("nn",-1,-1),new Among("pp",-1,-1),new Among("rr",-1,-1),new Among("ccs",-1,-1),new Among("ss",-1,-1),new Among("zzs",-1,-1),new Among("tt",-1,-1),new Among("vv",-1,-1),new Among("ggy",-1,-1),new Among("lly",-1,-1),new Among("nny",-1,-1),new Among("tty",-1,-1),new Among("ssz",-1,-1),new Among("zz",-1,-1)],a_3=[new Among("al",-1,1),new Among("el",-1,2)],a_4=[new Among("ba",-1,-1),new Among("ra",-1,-1),new Among("be",-1,-1),new Among("re",-1,-1),new Among("ig",-1,-1),new Among("nak",-1,-1),new Among("nek",-1,-1),new Among("val",-1,-1),new Among("vel",-1,-1),new Among("ul",-1,-1),new Among("nál",-1,-1),new Among("nél",-1,-1),new Among("ból",-1,-1),new Among("ról",-1,-1),new Among("tól",-1,-1),new Among("bõl",-1,-1),new Among("rõl",-1,-1),new Among("tõl",-1,-1),new Among("ül",-1,-1),new Among("n",-1,-1),new Among("an",19,-1),new Among("ban",20,-1),new Among("en",19,-1),new Among("ben",22,-1),new Among("képpen",22,-1),new Among("on",19,-1),new Among("ön",19,-1),new Among("képp",-1,-1),new Among("kor",-1,-1),new Among("t",-1,-1),new Among("at",29,-1),new Among("et",29,-1),new Among("ként",29,-1),new Among("anként",32,-1),new Among("enként",32,-1),new Among("onként",32,-1),new Among("ot",29,-1),new Among("ért",29,-1),new Among("öt",29,-1),new Among("hez",-1,-1),new Among("hoz",-1,-1),new Among("höz",-1,-1),new Among("vá",-1,-1),new Among("vé",-1,-1)],a_5=[new Among("án",-1,2),new Among("én",-1,1),new Among("ánként",-1,3)],a_6=[new Among("stul",-1,2),new Among("astul",0,1),new Among("ástul",0,3),new Among("stül",-1,2),new Among("estül",3,1),new Among("éstül",3,4)],a_7=[new Among("á",-1,1),new Among("é",-1,2)],a_8=[new Among("k",-1,7),new Among("ak",0,4),new Among("ek",0,6),new Among("ok",0,5),new Among("ák",0,1),new Among("ék",0,2),new Among("ök",0,3)],a_9=[new Among("éi",-1,7),new Among("áéi",0,6),new Among("ééi",0,5),new Among("é",-1,9),new Among("ké",3,4),new Among("aké",4,1),new Among("eké",4,1),new Among("oké",4,1),new Among("áké",4,3),new Among("éké",4,2),new Among("öké",4,1),new Among("éé",3,8)],a_10=[new Among("a",-1,18),new Among("ja",0,17),new Among("d",-1,16),new Among("ad",2,13),new Among("ed",2,13),new Among("od",2,13),new Among("ád",2,14),new Among("éd",2,15),new Among("öd",2,13),new Among("e",-1,18),new Among("je",9,17),new Among("nk",-1,4),new Among("unk",11,1),new Among("ánk",11,2),new Among("énk",11,3),new Among("ünk",11,1),new Among("uk",-1,8),new Among("juk",16,7),new Among("ájuk",17,5),new Among("ük",-1,8),new Among("jük",19,7),new Among("éjük",20,6),new Among("m",-1,12),new Among("am",22,9),new Among("em",22,9),new Among("om",22,9),new Among("ám",22,10),new Among("ém",22,11),new Among("o",-1,18),new Among("á",-1,19),new Among("é",-1,20)],a_11=[new Among("id",-1,10),new Among("aid",0,9),new Among("jaid",1,6),new Among("eid",0,9),new Among("jeid",3,6),new Among("áid",0,7),new Among("éid",0,8),new Among("i",-1,15),new Among("ai",7,14),new Among("jai",8,11),new Among("ei",7,14),new Among("jei",10,11),new Among("ái",7,12),new Among("éi",7,13),new Among("itek",-1,24),new Among("eitek",14,21),new Among("jeitek",15,20),new Among("éitek",14,23),new Among("ik",-1,29),new Among("aik",18,26),new Among("jaik",19,25),new Among("eik",18,26),new Among("jeik",21,25),new Among("áik",18,27),new Among("éik",18,28),new Among("ink",-1,20),new Among("aink",25,17),new Among("jaink",26,16),new Among("eink",25,17),new Among("jeink",28,16),new Among("áink",25,18),new Among("éink",25,19),new Among("aitok",-1,21),new Among("jaitok",32,20),new Among("áitok",-1,22),new Among("im",-1,5),new Among("aim",35,4),new Among("jaim",36,1),new Among("eim",35,4),new Among("jeim",38,1),new Among("áim",35,2),new Among("éim",35,3)],g_v=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,1,17,52,14],I_p1,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_mark_regions(){var v_1=sbp.cursor,v_2;I_p1=sbp.limit;if(sbp.in_grouping(g_v,97,252)){while(true){v_2=sbp.cursor;
if(sbp.out_grouping(g_v,97,252)){sbp.cursor=v_2;if(!sbp.find_among(a_0,8)){sbp.cursor=v_2;
if(v_2<sbp.limit){sbp.cursor++}}I_p1=sbp.cursor;return}sbp.cursor=v_2;if(v_2>=sbp.limit){I_p1=v_2;
return}sbp.cursor++}}sbp.cursor=v_1;if(sbp.out_grouping(g_v,97,252)){while(!sbp.in_grouping(g_v,97,252)){if(sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_p1=sbp.cursor}}function r_R1(){return I_p1<=sbp.cursor}function r_v_ending(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_1,2);if(among_var){sbp.bra=sbp.cursor;
if(r_R1()){switch(among_var){case 1:sbp.slice_from("a");break;case 2:sbp.slice_from("e");
break}}}}function r_double(){var v_1=sbp.limit-sbp.cursor;if(!sbp.find_among_b(a_2,23)){return false
}sbp.cursor=sbp.limit-v_1;return true}function r_undouble(){if(sbp.cursor>sbp.limit_backward){sbp.cursor--;
sbp.ket=sbp.cursor;var c=sbp.cursor-1;if(sbp.limit_backward<=c&&c<=sbp.limit){sbp.cursor=c;
sbp.bra=c;sbp.slice_del()}}}function r_instrum(){var among_var;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_3,2);if(among_var){sbp.bra=sbp.cursor;if(r_R1()){if(among_var==1||among_var==2){if(!r_double()){return
}}sbp.slice_del();r_undouble()}}}function r_case(){sbp.ket=sbp.cursor;if(sbp.find_among_b(a_4,44)){sbp.bra=sbp.cursor;
if(r_R1()){sbp.slice_del();r_v_ending()}}}function r_case_special(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_5,3);if(among_var){sbp.bra=sbp.cursor;
if(r_R1()){switch(among_var){case 1:sbp.slice_from("e");break;case 2:case 3:sbp.slice_from("a");
break}}}}function r_case_other(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_6,6);
if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:case 2:sbp.slice_del();
break;case 3:sbp.slice_from("a");break;case 4:sbp.slice_from("e");break}}}}function r_factive(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_7,2);if(among_var){sbp.bra=sbp.cursor;
if(r_R1()){if(among_var==1||among_var==2){if(!r_double()){return}}sbp.slice_del();
r_undouble()}}}function r_plural(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_8,7);
if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:sbp.slice_from("a");
break;case 2:sbp.slice_from("e");break;case 3:case 4:case 5:case 6:case 7:sbp.slice_del();
break}}}}function r_owned(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_9,12);
if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:case 4:case 7:case 9:sbp.slice_del();
break;case 2:case 5:case 8:sbp.slice_from("e");break;case 3:case 6:sbp.slice_from("a");
break}}}}function r_sing_owner(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_10,31);
if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:case 4:case 7:case 8:case 9:case 12:case 13:case 16:case 17:case 18:sbp.slice_del();
break;case 2:case 5:case 10:case 14:case 19:sbp.slice_from("a");break;case 3:case 6:case 11:case 15:case 20:sbp.slice_from("e");
break}}}}function r_plur_owner(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_11,42);
if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:case 4:case 5:case 6:case 9:case 10:case 11:case 14:case 15:case 16:case 17:case 20:case 21:case 24:case 25:case 26:case 29:sbp.slice_del();
break;case 2:case 7:case 12:case 18:case 22:case 27:sbp.slice_from("a");break;case 3:case 8:case 13:case 19:case 23:case 28:sbp.slice_from("e");
break}}}}this.stem=function(){var v_1=sbp.cursor;r_mark_regions();sbp.limit_backward=v_1;
sbp.cursor=sbp.limit;r_instrum();sbp.cursor=sbp.limit;r_case();sbp.cursor=sbp.limit;
r_case_special();sbp.cursor=sbp.limit;r_case_other();sbp.cursor=sbp.limit;r_factive();
sbp.cursor=sbp.limit;r_owned();sbp.cursor=sbp.limit;r_sing_owner();sbp.cursor=sbp.limit;
r_plur_owner();sbp.cursor=sbp.limit;r_plural();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.hu.stemmer,"stemmer-hu");lunr.hu.stopWordFilter=lunr.generateStopWordFilter("a abban ahhoz ahogy ahol aki akik akkor alatt amely amelyek amelyekben amelyeket amelyet amelynek ami amikor amit amolyan amíg annak arra arról az azok azon azonban azt aztán azután azzal azért be belül benne bár cikk cikkek cikkeket csak de e ebben eddig egy egyes egyetlen egyik egyre egyéb egész ehhez ekkor el ellen elsõ elég elõ elõször elõtt emilyen ennek erre ez ezek ezen ezt ezzel ezért fel felé hanem hiszen hogy hogyan igen ill ill. illetve ilyen ilyenkor ismét ison itt jobban jó jól kell kellett keressünk keresztül ki kívül között közül legalább legyen lehet lehetett lenne lenni lesz lett maga magát majd majd meg mellett mely melyek mert mi mikor milyen minden mindenki mindent mindig mint mintha mit mivel miért most már más másik még míg nagy nagyobb nagyon ne nekem neki nem nincs néha néhány nélkül olyan ott pedig persze rá s saját sem semmi sok sokat sokkal szemben szerint szinte számára talán tehát teljes tovább továbbá több ugyanis utolsó után utána vagy vagyis vagyok valaki valami valamint való van vannak vele vissza viszont volna volt voltak voltam voltunk által általában át én éppen és így õ õk õket össze úgy új újabb újra".split(" "));
lunr.Pipeline.registerFunction(lunr.hu.stopWordFilter,"stopWordFilter-hu")}});
/*!
 * Lunr languages, `Italian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.it=function(){this.pipeline.reset();this.pipeline.add(lunr.it.trimmer,lunr.it.stopWordFilter,lunr.it.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.it.stemmer)
}};lunr.it.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.it.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.it.wordCharacters);lunr.Pipeline.registerFunction(lunr.it.trimmer,"trimmer-it");
lunr.it.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function ItalianStemmer(){var a_0=[new Among("",-1,7),new Among("qu",0,6),new Among("á",0,1),new Among("é",0,2),new Among("í",0,3),new Among("ó",0,4),new Among("ú",0,5)],a_1=[new Among("",-1,3),new Among("I",0,1),new Among("U",0,2)],a_2=[new Among("la",-1,-1),new Among("cela",0,-1),new Among("gliela",0,-1),new Among("mela",0,-1),new Among("tela",0,-1),new Among("vela",0,-1),new Among("le",-1,-1),new Among("cele",6,-1),new Among("gliele",6,-1),new Among("mele",6,-1),new Among("tele",6,-1),new Among("vele",6,-1),new Among("ne",-1,-1),new Among("cene",12,-1),new Among("gliene",12,-1),new Among("mene",12,-1),new Among("sene",12,-1),new Among("tene",12,-1),new Among("vene",12,-1),new Among("ci",-1,-1),new Among("li",-1,-1),new Among("celi",20,-1),new Among("glieli",20,-1),new Among("meli",20,-1),new Among("teli",20,-1),new Among("veli",20,-1),new Among("gli",20,-1),new Among("mi",-1,-1),new Among("si",-1,-1),new Among("ti",-1,-1),new Among("vi",-1,-1),new Among("lo",-1,-1),new Among("celo",31,-1),new Among("glielo",31,-1),new Among("melo",31,-1),new Among("telo",31,-1),new Among("velo",31,-1)],a_3=[new Among("ando",-1,1),new Among("endo",-1,1),new Among("ar",-1,2),new Among("er",-1,2),new Among("ir",-1,2)],a_4=[new Among("ic",-1,-1),new Among("abil",-1,-1),new Among("os",-1,-1),new Among("iv",-1,1)],a_5=[new Among("ic",-1,1),new Among("abil",-1,1),new Among("iv",-1,1)],a_6=[new Among("ica",-1,1),new Among("logia",-1,3),new Among("osa",-1,1),new Among("ista",-1,1),new Among("iva",-1,9),new Among("anza",-1,1),new Among("enza",-1,5),new Among("ice",-1,1),new Among("atrice",7,1),new Among("iche",-1,1),new Among("logie",-1,3),new Among("abile",-1,1),new Among("ibile",-1,1),new Among("usione",-1,4),new Among("azione",-1,2),new Among("uzione",-1,4),new Among("atore",-1,2),new Among("ose",-1,1),new Among("ante",-1,1),new Among("mente",-1,1),new Among("amente",19,7),new Among("iste",-1,1),new Among("ive",-1,9),new Among("anze",-1,1),new Among("enze",-1,5),new Among("ici",-1,1),new Among("atrici",25,1),new Among("ichi",-1,1),new Among("abili",-1,1),new Among("ibili",-1,1),new Among("ismi",-1,1),new Among("usioni",-1,4),new Among("azioni",-1,2),new Among("uzioni",-1,4),new Among("atori",-1,2),new Among("osi",-1,1),new Among("anti",-1,1),new Among("amenti",-1,6),new Among("imenti",-1,6),new Among("isti",-1,1),new Among("ivi",-1,9),new Among("ico",-1,1),new Among("ismo",-1,1),new Among("oso",-1,1),new Among("amento",-1,6),new Among("imento",-1,6),new Among("ivo",-1,9),new Among("ità",-1,8),new Among("istà",-1,1),new Among("istè",-1,1),new Among("istì",-1,1)],a_7=[new Among("isca",-1,1),new Among("enda",-1,1),new Among("ata",-1,1),new Among("ita",-1,1),new Among("uta",-1,1),new Among("ava",-1,1),new Among("eva",-1,1),new Among("iva",-1,1),new Among("erebbe",-1,1),new Among("irebbe",-1,1),new Among("isce",-1,1),new Among("ende",-1,1),new Among("are",-1,1),new Among("ere",-1,1),new Among("ire",-1,1),new Among("asse",-1,1),new Among("ate",-1,1),new Among("avate",16,1),new Among("evate",16,1),new Among("ivate",16,1),new Among("ete",-1,1),new Among("erete",20,1),new Among("irete",20,1),new Among("ite",-1,1),new Among("ereste",-1,1),new Among("ireste",-1,1),new Among("ute",-1,1),new Among("erai",-1,1),new Among("irai",-1,1),new Among("isci",-1,1),new Among("endi",-1,1),new Among("erei",-1,1),new Among("irei",-1,1),new Among("assi",-1,1),new Among("ati",-1,1),new Among("iti",-1,1),new Among("eresti",-1,1),new Among("iresti",-1,1),new Among("uti",-1,1),new Among("avi",-1,1),new Among("evi",-1,1),new Among("ivi",-1,1),new Among("isco",-1,1),new Among("ando",-1,1),new Among("endo",-1,1),new Among("Yamo",-1,1),new Among("iamo",-1,1),new Among("avamo",-1,1),new Among("evamo",-1,1),new Among("ivamo",-1,1),new Among("eremo",-1,1),new Among("iremo",-1,1),new Among("assimo",-1,1),new Among("ammo",-1,1),new Among("emmo",-1,1),new Among("eremmo",54,1),new Among("iremmo",54,1),new Among("immo",-1,1),new Among("ano",-1,1),new Among("iscano",58,1),new Among("avano",58,1),new Among("evano",58,1),new Among("ivano",58,1),new Among("eranno",-1,1),new Among("iranno",-1,1),new Among("ono",-1,1),new Among("iscono",65,1),new Among("arono",65,1),new Among("erono",65,1),new Among("irono",65,1),new Among("erebbero",-1,1),new Among("irebbero",-1,1),new Among("assero",-1,1),new Among("essero",-1,1),new Among("issero",-1,1),new Among("ato",-1,1),new Among("ito",-1,1),new Among("uto",-1,1),new Among("avo",-1,1),new Among("evo",-1,1),new Among("ivo",-1,1),new Among("ar",-1,1),new Among("ir",-1,1),new Among("erà",-1,1),new Among("irà",-1,1),new Among("erò",-1,1),new Among("irò",-1,1)],g_v=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,128,128,8,2,1],g_AEIO=[17,65,0,0,0,0,0,0,0,0,0,0,0,0,0,128,128,8,2],g_CG=[17],I_p2,I_p1,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(c1,c2,v_1){if(sbp.eq_s(1,c1)){sbp.ket=sbp.cursor;if(sbp.in_grouping(g_v,97,249)){sbp.slice_from(c2);
sbp.cursor=v_1;return true}}return false}function r_prelude(){var among_var,v_1=sbp.cursor,v_2,v_3,v_4;
while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_0,7);if(among_var){sbp.ket=sbp.cursor;
switch(among_var){case 1:sbp.slice_from("à");continue;case 2:sbp.slice_from("è");
continue;case 3:sbp.slice_from("ì");continue;case 4:sbp.slice_from("ò");continue;
case 5:sbp.slice_from("ù");continue;case 6:sbp.slice_from("qU");continue;case 7:if(sbp.cursor>=sbp.limit){break
}sbp.cursor++;continue}}break}sbp.cursor=v_1;while(true){v_2=sbp.cursor;while(true){v_3=sbp.cursor;
if(sbp.in_grouping(g_v,97,249)){sbp.bra=sbp.cursor;v_4=sbp.cursor;if(habr1("u","U",v_3)){break
}sbp.cursor=v_4;if(habr1("i","I",v_3)){break}}sbp.cursor=v_3;if(sbp.cursor>=sbp.limit){sbp.cursor=v_2;
return}sbp.cursor++}}}function habr2(v_1){sbp.cursor=v_1;if(!sbp.in_grouping(g_v,97,249)){return false
}while(!sbp.out_grouping(g_v,97,249)){if(sbp.cursor>=sbp.limit){return false}sbp.cursor++
}return true}function habr3(){if(sbp.in_grouping(g_v,97,249)){var v_1=sbp.cursor;
if(sbp.out_grouping(g_v,97,249)){while(!sbp.in_grouping(g_v,97,249)){if(sbp.cursor>=sbp.limit){return habr2(v_1)
}sbp.cursor++}return true}return habr2(v_1)}return false}function habr4(){var v_1=sbp.cursor,v_2;
if(!habr3()){sbp.cursor=v_1;if(!sbp.out_grouping(g_v,97,249)){return}v_2=sbp.cursor;
if(sbp.out_grouping(g_v,97,249)){while(!sbp.in_grouping(g_v,97,249)){if(sbp.cursor>=sbp.limit){sbp.cursor=v_2;
if(sbp.in_grouping(g_v,97,249)&&sbp.cursor<sbp.limit){sbp.cursor++}return}sbp.cursor++
}I_pV=sbp.cursor;return}sbp.cursor=v_2;if(!sbp.in_grouping(g_v,97,249)||sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_pV=sbp.cursor}function habr5(){while(!sbp.in_grouping(g_v,97,249)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,249)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function r_mark_regions(){var v_1=sbp.cursor;I_pV=sbp.limit;
I_p1=I_pV;I_p2=I_pV;habr4();sbp.cursor=v_1;if(habr5()){I_p1=sbp.cursor;if(habr5()){I_p2=sbp.cursor
}}}function r_postlude(){var among_var;while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_1,3);
if(!among_var){break}sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("i");
break;case 2:sbp.slice_from("u");break;case 3:if(sbp.cursor>=sbp.limit){return}sbp.cursor++;
break}}}function r_RV(){return I_pV<=sbp.cursor}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_attached_pronoun(){var among_var;
sbp.ket=sbp.cursor;if(sbp.find_among_b(a_2,37)){sbp.bra=sbp.cursor;among_var=sbp.find_among_b(a_3,5);
if(among_var&&r_RV()){switch(among_var){case 1:sbp.slice_del();break;case 2:sbp.slice_from("e");
break}}}}function r_standard_suffix(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_6,51);
if(!among_var){return false}sbp.bra=sbp.cursor;switch(among_var){case 1:if(!r_R2()){return false
}sbp.slice_del();break;case 2:if(!r_R2()){return false}sbp.slice_del();sbp.ket=sbp.cursor;
if(sbp.eq_s_b(2,"ic")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()}}break;case 3:if(!r_R2()){return false
}sbp.slice_from("log");break;case 4:if(!r_R2()){return false}sbp.slice_from("u");
break;case 5:if(!r_R2()){return false}sbp.slice_from("ente");break;case 6:if(!r_RV()){return false
}sbp.slice_del();break;case 7:if(!r_R1()){return false}sbp.slice_del();sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_4,4);if(among_var){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del();
if(among_var==1){sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()
}}}}}break;case 8:if(!r_R2()){return false}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_5,3);
if(among_var){sbp.bra=sbp.cursor;if(among_var==1){if(r_R2()){sbp.slice_del()}}}break;
case 9:if(!r_R2()){return false}sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;
if(r_R2()){sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"ic")){sbp.bra=sbp.cursor;
if(r_R2()){sbp.slice_del()}}}}break}return true}function r_verb_suffix(){var among_var,v_1;
if(sbp.cursor>=I_pV){v_1=sbp.limit_backward;sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_7,87);if(among_var){sbp.bra=sbp.cursor;if(among_var==1){sbp.slice_del()
}}sbp.limit_backward=v_1}}function habr6(){var v_1=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;
if(sbp.in_grouping_b(g_AEIO,97,242)){sbp.bra=sbp.cursor;if(r_RV()){sbp.slice_del();
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"i")){sbp.bra=sbp.cursor;if(r_RV()){sbp.slice_del();
return}}}}sbp.cursor=sbp.limit-v_1}function r_vowel_suffix(){habr6();sbp.ket=sbp.cursor;
if(sbp.eq_s_b(1,"h")){sbp.bra=sbp.cursor;if(sbp.in_grouping_b(g_CG,99,103)){if(r_RV()){sbp.slice_del()
}}}}this.stem=function(){var v_1=sbp.cursor;r_prelude();sbp.cursor=v_1;r_mark_regions();
sbp.limit_backward=v_1;sbp.cursor=sbp.limit;r_attached_pronoun();sbp.cursor=sbp.limit;
if(!r_standard_suffix()){sbp.cursor=sbp.limit;r_verb_suffix()}sbp.cursor=sbp.limit;
r_vowel_suffix();sbp.cursor=sbp.limit_backward;r_postlude();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.it.stemmer,"stemmer-it");lunr.it.stopWordFilter=lunr.generateStopWordFilter("a abbia abbiamo abbiano abbiate ad agl agli ai al all alla alle allo anche avemmo avendo avesse avessero avessi avessimo aveste avesti avete aveva avevamo avevano avevate avevi avevo avrai avranno avrebbe avrebbero avrei avremmo avremo avreste avresti avrete avrà avrò avuta avute avuti avuto c che chi ci coi col come con contro cui da dagl dagli dai dal dall dalla dalle dallo degl degli dei del dell della delle dello di dov dove e ebbe ebbero ebbi ed era erano eravamo eravate eri ero essendo faccia facciamo facciano facciate faccio facemmo facendo facesse facessero facessi facessimo faceste facesti faceva facevamo facevano facevate facevi facevo fai fanno farai faranno farebbe farebbero farei faremmo faremo fareste faresti farete farà farò fece fecero feci fosse fossero fossi fossimo foste fosti fu fui fummo furono gli ha hai hanno ho i il in io l la le lei li lo loro lui ma mi mia mie miei mio ne negl negli nei nel nell nella nelle nello noi non nostra nostre nostri nostro o per perché più quale quanta quante quanti quanto quella quelle quelli quello questa queste questi questo sarai saranno sarebbe sarebbero sarei saremmo saremo sareste saresti sarete sarà sarò se sei si sia siamo siano siate siete sono sta stai stando stanno starai staranno starebbe starebbero starei staremmo staremo stareste staresti starete starà starò stava stavamo stavano stavate stavi stavo stemmo stesse stessero stessi stessimo steste stesti stette stettero stetti stia stiamo stiano stiate sto su sua sue sugl sugli sui sul sull sulla sulle sullo suo suoi ti tra tu tua tue tuo tuoi tutti tutto un una uno vi voi vostra vostre vostri vostro è".split(" "));
lunr.Pipeline.registerFunction(lunr.it.stopWordFilter,"stopWordFilter-it")}});
/*!
 * Lunr languages, `Japanese` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Chad Liu
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}var isLunr2=lunr.version[0]=="2";lunr.ja=function(){this.pipeline.reset();this.pipeline.add(lunr.ja.trimmer,lunr.ja.stopWordFilter,lunr.ja.stemmer);
if(isLunr2){this.tokenizer=lunr.ja.tokenizer}else{if(lunr.tokenizer){lunr.tokenizer=lunr.ja.tokenizer
}if(this.tokenizerFn){this.tokenizerFn=lunr.ja.tokenizer}}};var segmenter=new lunr.TinySegmenter;
lunr.ja.tokenizer=function(obj){var i;var str;var len;var segs;var tokens;var char_;
var sliceLength;var sliceStart;var sliceEnd;var segStart;if(!arguments.length||obj==null||obj==undefined){return[]
}if(Array.isArray(obj)){return obj.map(function(t){return isLunr2?new lunr.Token(t.toLowerCase()):t.toLowerCase()
})}str=obj.toString().toLowerCase().replace(/^\s+/,"");for(i=str.length-1;i>=0;i--){if(/\S/.test(str.charAt(i))){str=str.substring(0,i+1);
break}}tokens=[];len=str.length;for(sliceEnd=0,sliceStart=0;sliceEnd<=len;sliceEnd++){char_=str.charAt(sliceEnd);
sliceLength=sliceEnd-sliceStart;if(char_.match(/\s/)||sliceEnd==len){if(sliceLength>0){segs=segmenter.segment(str.slice(sliceStart,sliceEnd)).filter(function(token){return !!token
});segStart=sliceStart;for(i=0;i<segs.length;i++){if(isLunr2){tokens.push(new lunr.Token(segs[i],{position:[segStart,segs[i].length],index:tokens.length}))
}else{tokens.push(segs[i])}segStart+=segs[i].length}}sliceStart=sliceEnd+1}}return tokens
};lunr.ja.stemmer=function(){return function(word){return word}}();lunr.Pipeline.registerFunction(lunr.ja.stemmer,"stemmer-ja");
lunr.ja.wordCharacters="一二三四五六七八九十百千万億兆一-龠々〆ヵヶぁ-んァ-ヴーｱ-ﾝﾞa-zA-Zａ-ｚＡ-Ｚ0-9０-９";lunr.ja.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.ja.wordCharacters);
lunr.Pipeline.registerFunction(lunr.ja.trimmer,"trimmer-ja");lunr.ja.stopWordFilter=lunr.generateStopWordFilter("これ それ あれ この その あの ここ そこ あそこ こちら どこ だれ なに なん 何 私 貴方 貴方方 我々 私達 あの人 あのかた 彼女 彼 です あります おります います は が の に を で え から まで より も どの と し それで しかし".split(" "));
lunr.Pipeline.registerFunction(lunr.ja.stopWordFilter,"stopWordFilter-ja");lunr.jp=lunr.ja;
lunr.Pipeline.registerFunction(lunr.jp.stemmer,"stemmer-jp");lunr.Pipeline.registerFunction(lunr.jp.trimmer,"trimmer-jp");
lunr.Pipeline.registerFunction(lunr.jp.stopWordFilter,"stopWordFilter-jp")}});
/*!
 * Lunr languages, `Dutch` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.nl=function(){this.pipeline.reset();this.pipeline.add(lunr.nl.trimmer,lunr.nl.stopWordFilter,lunr.nl.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.nl.stemmer)
}};lunr.nl.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.nl.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.nl.wordCharacters);lunr.Pipeline.registerFunction(lunr.nl.trimmer,"trimmer-nl");
lunr.nl.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function DutchStemmer(){var a_0=[new Among("",-1,6),new Among("á",0,1),new Among("ä",0,1),new Among("é",0,2),new Among("ë",0,2),new Among("í",0,3),new Among("ï",0,3),new Among("ó",0,4),new Among("ö",0,4),new Among("ú",0,5),new Among("ü",0,5)],a_1=[new Among("",-1,3),new Among("I",0,2),new Among("Y",0,1)],a_2=[new Among("dd",-1,-1),new Among("kk",-1,-1),new Among("tt",-1,-1)],a_3=[new Among("ene",-1,2),new Among("se",-1,3),new Among("en",-1,2),new Among("heden",2,1),new Among("s",-1,3)],a_4=[new Among("end",-1,1),new Among("ig",-1,2),new Among("ing",-1,1),new Among("lijk",-1,3),new Among("baar",-1,4),new Among("bar",-1,5)],a_5=[new Among("aa",-1,-1),new Among("ee",-1,-1),new Among("oo",-1,-1),new Among("uu",-1,-1)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,128],g_v_I=[1,0,0,17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,128],g_v_j=[17,67,16,1,0,0,0,0,0,0,0,0,0,0,0,0,128],I_p2,I_p1,B_e_found,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_prelude(){var among_var,v_1=sbp.cursor,v_2,v_3;while(true){sbp.bra=sbp.cursor;
among_var=sbp.find_among(a_0,11);if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("a");
continue;case 2:sbp.slice_from("e");continue;case 3:sbp.slice_from("i");continue;
case 4:sbp.slice_from("o");continue;case 5:sbp.slice_from("u");continue;case 6:if(sbp.cursor>=sbp.limit){break
}sbp.cursor++;continue}}break}sbp.cursor=v_1;sbp.bra=v_1;if(sbp.eq_s(1,"y")){sbp.ket=sbp.cursor;
sbp.slice_from("Y")}else{sbp.cursor=v_1}while(true){v_2=sbp.cursor;if(sbp.in_grouping(g_v,97,232)){v_3=sbp.cursor;
sbp.bra=v_3;if(sbp.eq_s(1,"i")){sbp.ket=sbp.cursor;if(sbp.in_grouping(g_v,97,232)){sbp.slice_from("I");
sbp.cursor=v_2}}else{sbp.cursor=v_3;if(sbp.eq_s(1,"y")){sbp.ket=sbp.cursor;sbp.slice_from("Y");
sbp.cursor=v_2}else{if(habr1(v_2)){break}}}}else{if(habr1(v_2)){break}}}}function habr1(v_1){sbp.cursor=v_1;
if(v_1>=sbp.limit){return true}sbp.cursor++;return false}function r_mark_regions(){I_p1=sbp.limit;
I_p2=I_p1;if(!habr2()){I_p1=sbp.cursor;if(I_p1<3){I_p1=3}if(!habr2()){I_p2=sbp.cursor
}}}function habr2(){while(!sbp.in_grouping(g_v,97,232)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,232)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}function r_postlude(){var among_var;while(true){sbp.bra=sbp.cursor;
among_var=sbp.find_among(a_1,3);if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("y");
break;case 2:sbp.slice_from("i");break;case 3:if(sbp.cursor>=sbp.limit){return}sbp.cursor++;
break}}}}function r_R1(){return I_p1<=sbp.cursor}function r_R2(){return I_p2<=sbp.cursor
}function r_undouble(){var v_1=sbp.limit-sbp.cursor;if(sbp.find_among_b(a_2,3)){sbp.cursor=sbp.limit-v_1;
sbp.ket=sbp.cursor;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;sbp.bra=sbp.cursor;
sbp.slice_del()}}}function r_e_ending(){var v_1;B_e_found=false;sbp.ket=sbp.cursor;
if(sbp.eq_s_b(1,"e")){sbp.bra=sbp.cursor;if(r_R1()){v_1=sbp.limit-sbp.cursor;if(sbp.out_grouping_b(g_v,97,232)){sbp.cursor=sbp.limit-v_1;
sbp.slice_del();B_e_found=true;r_undouble()}}}}function r_en_ending(){var v_1;if(r_R1()){v_1=sbp.limit-sbp.cursor;
if(sbp.out_grouping_b(g_v,97,232)){sbp.cursor=sbp.limit-v_1;if(!sbp.eq_s_b(3,"gem")){sbp.cursor=sbp.limit-v_1;
sbp.slice_del();r_undouble()}}}}function r_standard_suffix(){var among_var,v_1=sbp.limit-sbp.cursor,v_2,v_3,v_4,v_5,v_6;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,5);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:if(r_R1()){sbp.slice_from("heid")}break;case 2:r_en_ending();
break;case 3:if(r_R1()&&sbp.out_grouping_b(g_v_j,97,232)){sbp.slice_del()}break}}sbp.cursor=sbp.limit-v_1;
r_e_ending();sbp.cursor=sbp.limit-v_1;sbp.ket=sbp.cursor;if(sbp.eq_s_b(4,"heid")){sbp.bra=sbp.cursor;
if(r_R2()){v_2=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"c")){sbp.cursor=sbp.limit-v_2;
sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"en")){sbp.bra=sbp.cursor;r_en_ending()
}}}}sbp.cursor=sbp.limit-v_1;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_4,6);
if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:if(r_R2()){sbp.slice_del();
v_3=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"ig")){sbp.bra=sbp.cursor;
if(r_R2()){v_4=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,"e")){sbp.cursor=sbp.limit-v_4;
sbp.slice_del();break}}}sbp.cursor=sbp.limit-v_3;r_undouble()}break;case 2:if(r_R2()){v_5=sbp.limit-sbp.cursor;
if(!sbp.eq_s_b(1,"e")){sbp.cursor=sbp.limit-v_5;sbp.slice_del()}}break;case 3:if(r_R2()){sbp.slice_del();
r_e_ending()}break;case 4:if(r_R2()){sbp.slice_del()}break;case 5:if(r_R2()&&B_e_found){sbp.slice_del()
}break}}sbp.cursor=sbp.limit-v_1;if(sbp.out_grouping_b(g_v_I,73,232)){v_6=sbp.limit-sbp.cursor;
if(sbp.find_among_b(a_5,4)&&sbp.out_grouping_b(g_v,97,232)){sbp.cursor=sbp.limit-v_6;
sbp.ket=sbp.cursor;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;sbp.bra=sbp.cursor;
sbp.slice_del()}}}}this.stem=function(){var v_1=sbp.cursor;r_prelude();sbp.cursor=v_1;
r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;r_standard_suffix();
sbp.cursor=sbp.limit_backward;r_postlude();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.nl.stemmer,"stemmer-nl");lunr.nl.stopWordFilter=lunr.generateStopWordFilter(" aan al alles als altijd andere ben bij daar dan dat de der deze die dit doch doen door dus een eens en er ge geen geweest haar had heb hebben heeft hem het hier hij hoe hun iemand iets ik in is ja je kan kon kunnen maar me meer men met mij mijn moet na naar niet niets nog nu of om omdat onder ons ook op over reeds te tegen toch toen tot u uit uw van veel voor want waren was wat werd wezen wie wil worden wordt zal ze zelf zich zij zijn zo zonder zou".split(" "));
lunr.Pipeline.registerFunction(lunr.nl.stopWordFilter,"stopWordFilter-nl")}});
/*!
 * Lunr languages, `Norwegian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.no=function(){this.pipeline.reset();this.pipeline.add(lunr.no.trimmer,lunr.no.stopWordFilter,lunr.no.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.no.stemmer)
}};lunr.no.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.no.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.no.wordCharacters);lunr.Pipeline.registerFunction(lunr.no.trimmer,"trimmer-no");
lunr.no.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function NorwegianStemmer(){var a_0=[new Among("a",-1,1),new Among("e",-1,1),new Among("ede",1,1),new Among("ande",1,1),new Among("ende",1,1),new Among("ane",1,1),new Among("ene",1,1),new Among("hetene",6,1),new Among("erte",1,3),new Among("en",-1,1),new Among("heten",9,1),new Among("ar",-1,1),new Among("er",-1,1),new Among("heter",12,1),new Among("s",-1,2),new Among("as",14,1),new Among("es",14,1),new Among("edes",16,1),new Among("endes",16,1),new Among("enes",16,1),new Among("hetenes",19,1),new Among("ens",14,1),new Among("hetens",21,1),new Among("ers",14,1),new Among("ets",14,1),new Among("et",-1,1),new Among("het",25,1),new Among("ert",-1,3),new Among("ast",-1,1)],a_1=[new Among("dt",-1,-1),new Among("vt",-1,-1)],a_2=[new Among("leg",-1,1),new Among("eleg",0,1),new Among("ig",-1,1),new Among("eig",2,1),new Among("lig",2,1),new Among("elig",4,1),new Among("els",-1,1),new Among("lov",-1,1),new Among("elov",7,1),new Among("slov",7,1),new Among("hetslov",9,1)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,48,0,128],g_s_ending=[119,125,149,1],I_x,I_p1,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_mark_regions(){var v_1,c=sbp.cursor+3;I_p1=sbp.limit;if(0<=c||c<=sbp.limit){I_x=c;
while(true){v_1=sbp.cursor;if(sbp.in_grouping(g_v,97,248)){sbp.cursor=v_1;break}if(v_1>=sbp.limit){return
}sbp.cursor=v_1+1}while(!sbp.out_grouping(g_v,97,248)){if(sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_p1=sbp.cursor;if(I_p1<I_x){I_p1=I_x}}}function r_main_suffix(){var among_var,v_1,v_2;
if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_0,29);sbp.limit_backward=v_1;if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:sbp.slice_del();break;case 2:v_2=sbp.limit-sbp.cursor;if(sbp.in_grouping_b(g_s_ending,98,122)){sbp.slice_del()
}else{sbp.cursor=sbp.limit-v_2;if(sbp.eq_s_b(1,"k")&&sbp.out_grouping_b(g_v,97,248)){sbp.slice_del()
}}break;case 3:sbp.slice_from("er");break}}}}function r_consonant_pair(){var v_1=sbp.limit-sbp.cursor,v_2;
if(sbp.cursor>=I_p1){v_2=sbp.limit_backward;sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;
if(sbp.find_among_b(a_1,2)){sbp.bra=sbp.cursor;sbp.limit_backward=v_2;sbp.cursor=sbp.limit-v_1;
if(sbp.cursor>sbp.limit_backward){sbp.cursor--;sbp.bra=sbp.cursor;sbp.slice_del()
}}else{sbp.limit_backward=v_2}}}function r_other_suffix(){var among_var,v_1;if(sbp.cursor>=I_p1){v_1=sbp.limit_backward;
sbp.limit_backward=I_p1;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_2,11);if(among_var){sbp.bra=sbp.cursor;
sbp.limit_backward=v_1;if(among_var==1){sbp.slice_del()}}else{sbp.limit_backward=v_1
}}}this.stem=function(){var v_1=sbp.cursor;r_mark_regions();sbp.limit_backward=v_1;
sbp.cursor=sbp.limit;r_main_suffix();sbp.cursor=sbp.limit;r_consonant_pair();sbp.cursor=sbp.limit;
r_other_suffix();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.no.stemmer,"stemmer-no");lunr.no.stopWordFilter=lunr.generateStopWordFilter("alle at av bare begge ble blei bli blir blitt både båe da de deg dei deim deira deires dem den denne der dere deres det dette di din disse ditt du dykk dykkar då eg ein eit eitt eller elles en enn er et ett etter for fordi fra før ha hadde han hans har hennar henne hennes her hjå ho hoe honom hoss hossen hun hva hvem hver hvilke hvilken hvis hvor hvordan hvorfor i ikke ikkje ikkje ingen ingi inkje inn inni ja jeg kan kom korleis korso kun kunne kva kvar kvarhelst kven kvi kvifor man mange me med medan meg meget mellom men mi min mine mitt mot mykje ned no noe noen noka noko nokon nokor nokre nå når og også om opp oss over på samme seg selv si si sia sidan siden sin sine sitt sjøl skal skulle slik so som som somme somt så sånn til um upp ut uten var vart varte ved vere verte vi vil ville vore vors vort vår være være vært å".split(" "));
lunr.Pipeline.registerFunction(lunr.no.stopWordFilter,"stopWordFilter-no")}});
/*!
 * Lunr languages, `Portuguese` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.pt=function(){this.pipeline.reset();this.pipeline.add(lunr.pt.trimmer,lunr.pt.stopWordFilter,lunr.pt.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.pt.stemmer)
}};lunr.pt.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.pt.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.pt.wordCharacters);lunr.Pipeline.registerFunction(lunr.pt.trimmer,"trimmer-pt");
lunr.pt.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function PortugueseStemmer(){var a_0=[new Among("",-1,3),new Among("ã",0,1),new Among("õ",0,2)],a_1=[new Among("",-1,3),new Among("a~",0,1),new Among("o~",0,2)],a_2=[new Among("ic",-1,-1),new Among("ad",-1,-1),new Among("os",-1,-1),new Among("iv",-1,1)],a_3=[new Among("ante",-1,1),new Among("avel",-1,1),new Among("ível",-1,1)],a_4=[new Among("ic",-1,1),new Among("abil",-1,1),new Among("iv",-1,1)],a_5=[new Among("ica",-1,1),new Among("ância",-1,1),new Among("ência",-1,4),new Among("ira",-1,9),new Among("adora",-1,1),new Among("osa",-1,1),new Among("ista",-1,1),new Among("iva",-1,8),new Among("eza",-1,1),new Among("logía",-1,2),new Among("idade",-1,7),new Among("ante",-1,1),new Among("mente",-1,6),new Among("amente",12,5),new Among("ável",-1,1),new Among("ível",-1,1),new Among("ución",-1,3),new Among("ico",-1,1),new Among("ismo",-1,1),new Among("oso",-1,1),new Among("amento",-1,1),new Among("imento",-1,1),new Among("ivo",-1,8),new Among("aça~o",-1,1),new Among("ador",-1,1),new Among("icas",-1,1),new Among("ências",-1,4),new Among("iras",-1,9),new Among("adoras",-1,1),new Among("osas",-1,1),new Among("istas",-1,1),new Among("ivas",-1,8),new Among("ezas",-1,1),new Among("logías",-1,2),new Among("idades",-1,7),new Among("uciones",-1,3),new Among("adores",-1,1),new Among("antes",-1,1),new Among("aço~es",-1,1),new Among("icos",-1,1),new Among("ismos",-1,1),new Among("osos",-1,1),new Among("amentos",-1,1),new Among("imentos",-1,1),new Among("ivos",-1,8)],a_6=[new Among("ada",-1,1),new Among("ida",-1,1),new Among("ia",-1,1),new Among("aria",2,1),new Among("eria",2,1),new Among("iria",2,1),new Among("ara",-1,1),new Among("era",-1,1),new Among("ira",-1,1),new Among("ava",-1,1),new Among("asse",-1,1),new Among("esse",-1,1),new Among("isse",-1,1),new Among("aste",-1,1),new Among("este",-1,1),new Among("iste",-1,1),new Among("ei",-1,1),new Among("arei",16,1),new Among("erei",16,1),new Among("irei",16,1),new Among("am",-1,1),new Among("iam",20,1),new Among("ariam",21,1),new Among("eriam",21,1),new Among("iriam",21,1),new Among("aram",20,1),new Among("eram",20,1),new Among("iram",20,1),new Among("avam",20,1),new Among("em",-1,1),new Among("arem",29,1),new Among("erem",29,1),new Among("irem",29,1),new Among("assem",29,1),new Among("essem",29,1),new Among("issem",29,1),new Among("ado",-1,1),new Among("ido",-1,1),new Among("ando",-1,1),new Among("endo",-1,1),new Among("indo",-1,1),new Among("ara~o",-1,1),new Among("era~o",-1,1),new Among("ira~o",-1,1),new Among("ar",-1,1),new Among("er",-1,1),new Among("ir",-1,1),new Among("as",-1,1),new Among("adas",47,1),new Among("idas",47,1),new Among("ias",47,1),new Among("arias",50,1),new Among("erias",50,1),new Among("irias",50,1),new Among("aras",47,1),new Among("eras",47,1),new Among("iras",47,1),new Among("avas",47,1),new Among("es",-1,1),new Among("ardes",58,1),new Among("erdes",58,1),new Among("irdes",58,1),new Among("ares",58,1),new Among("eres",58,1),new Among("ires",58,1),new Among("asses",58,1),new Among("esses",58,1),new Among("isses",58,1),new Among("astes",58,1),new Among("estes",58,1),new Among("istes",58,1),new Among("is",-1,1),new Among("ais",71,1),new Among("eis",71,1),new Among("areis",73,1),new Among("ereis",73,1),new Among("ireis",73,1),new Among("áreis",73,1),new Among("éreis",73,1),new Among("íreis",73,1),new Among("ásseis",73,1),new Among("ésseis",73,1),new Among("ísseis",73,1),new Among("áveis",73,1),new Among("íeis",73,1),new Among("aríeis",84,1),new Among("eríeis",84,1),new Among("iríeis",84,1),new Among("ados",-1,1),new Among("idos",-1,1),new Among("amos",-1,1),new Among("áramos",90,1),new Among("éramos",90,1),new Among("íramos",90,1),new Among("ávamos",90,1),new Among("íamos",90,1),new Among("aríamos",95,1),new Among("eríamos",95,1),new Among("iríamos",95,1),new Among("emos",-1,1),new Among("aremos",99,1),new Among("eremos",99,1),new Among("iremos",99,1),new Among("ássemos",99,1),new Among("êssemos",99,1),new Among("íssemos",99,1),new Among("imos",-1,1),new Among("armos",-1,1),new Among("ermos",-1,1),new Among("irmos",-1,1),new Among("ámos",-1,1),new Among("arás",-1,1),new Among("erás",-1,1),new Among("irás",-1,1),new Among("eu",-1,1),new Among("iu",-1,1),new Among("ou",-1,1),new Among("ará",-1,1),new Among("erá",-1,1),new Among("irá",-1,1)],a_7=[new Among("a",-1,1),new Among("i",-1,1),new Among("o",-1,1),new Among("os",-1,1),new Among("á",-1,1),new Among("í",-1,1),new Among("ó",-1,1)],a_8=[new Among("e",-1,1),new Among("ç",-1,2),new Among("é",-1,1),new Among("ê",-1,1)],g_v=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,3,19,12,2],I_p2,I_p1,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_prelude(){var among_var;while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_0,3);
if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("a~");continue;
case 2:sbp.slice_from("o~");continue;case 3:if(sbp.cursor>=sbp.limit){break}sbp.cursor++;
continue}}break}}function habr2(){if(sbp.out_grouping(g_v,97,250)){while(!sbp.in_grouping(g_v,97,250)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}return true}function habr3(){if(sbp.in_grouping(g_v,97,250)){while(!sbp.out_grouping(g_v,97,250)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}}I_pV=sbp.cursor;return true}function habr4(){var v_1=sbp.cursor,v_2,v_3;
if(sbp.in_grouping(g_v,97,250)){v_2=sbp.cursor;if(habr2()){sbp.cursor=v_2;if(habr3()){return
}}else{I_pV=sbp.cursor}}sbp.cursor=v_1;if(sbp.out_grouping(g_v,97,250)){v_3=sbp.cursor;
if(habr2()){sbp.cursor=v_3;if(!sbp.in_grouping(g_v,97,250)||sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_pV=sbp.cursor}}function habr5(){while(!sbp.in_grouping(g_v,97,250)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,250)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function r_mark_regions(){var v_1=sbp.cursor;I_pV=sbp.limit;
I_p1=I_pV;I_p2=I_pV;habr4();sbp.cursor=v_1;if(habr5()){I_p1=sbp.cursor;if(habr5()){I_p2=sbp.cursor
}}}function r_postlude(){var among_var;while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_1,3);
if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("ã");continue;
case 2:sbp.slice_from("õ");continue;case 3:if(sbp.cursor>=sbp.limit){break}sbp.cursor++;
continue}}break}}function r_RV(){return I_pV<=sbp.cursor}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_standard_suffix(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_5,45);if(!among_var){return false
}sbp.bra=sbp.cursor;switch(among_var){case 1:if(!r_R2()){return false}sbp.slice_del();
break;case 2:if(!r_R2()){return false}sbp.slice_from("log");break;case 3:if(!r_R2()){return false
}sbp.slice_from("u");break;case 4:if(!r_R2()){return false}sbp.slice_from("ente");
break;case 5:if(!r_R1()){return false}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_2,4);
if(among_var){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del();if(among_var==1){sbp.ket=sbp.cursor;
if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()}}}}}break;case 6:if(!r_R2()){return false
}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,3);if(among_var){sbp.bra=sbp.cursor;
if(among_var==1){if(r_R2()){sbp.slice_del()}}}break;case 7:if(!r_R2()){return false
}sbp.slice_del();sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_4,3);if(among_var){sbp.bra=sbp.cursor;
if(among_var==1){if(r_R2()){sbp.slice_del()}}}break;case 8:if(!r_R2()){return false
}sbp.slice_del();sbp.ket=sbp.cursor;if(sbp.eq_s_b(2,"at")){sbp.bra=sbp.cursor;if(r_R2()){sbp.slice_del()
}}break;case 9:if(!r_RV()||!sbp.eq_s_b(1,"e")){return false}sbp.slice_from("ir");
break}return true}function r_verb_suffix(){var among_var,v_1;if(sbp.cursor>=I_pV){v_1=sbp.limit_backward;
sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_6,120);if(among_var){sbp.bra=sbp.cursor;
if(among_var==1){sbp.slice_del()}sbp.limit_backward=v_1;return true}sbp.limit_backward=v_1
}return false}function r_residual_suffix(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_7,7);
if(among_var){sbp.bra=sbp.cursor;if(among_var==1){if(r_RV()){sbp.slice_del()}}}}function habr6(c1,c2){if(sbp.eq_s_b(1,c1)){sbp.bra=sbp.cursor;
var v_1=sbp.limit-sbp.cursor;if(sbp.eq_s_b(1,c2)){sbp.cursor=sbp.limit-v_1;if(r_RV()){sbp.slice_del()
}return false}}return true}function r_residual_form(){var among_var,v_1,v_2,v_3;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_8,4);if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:if(r_RV()){sbp.slice_del();
sbp.ket=sbp.cursor;v_1=sbp.limit-sbp.cursor;if(habr6("u","g")){habr6("i","c")}}break;
case 2:sbp.slice_from("c");break}}}function habr1(){if(!r_standard_suffix()){sbp.cursor=sbp.limit;
if(!r_verb_suffix()){sbp.cursor=sbp.limit;r_residual_suffix();return}}sbp.cursor=sbp.limit;
sbp.ket=sbp.cursor;if(sbp.eq_s_b(1,"i")){sbp.bra=sbp.cursor;if(sbp.eq_s_b(1,"c")){sbp.cursor=sbp.limit;
if(r_RV()){sbp.slice_del()}}}}this.stem=function(){var v_1=sbp.cursor;r_prelude();
sbp.cursor=v_1;r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;habr1();
sbp.cursor=sbp.limit;r_residual_form();sbp.cursor=sbp.limit_backward;r_postlude();
return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.pt.stemmer,"stemmer-pt");lunr.pt.stopWordFilter=lunr.generateStopWordFilter("a ao aos aquela aquelas aquele aqueles aquilo as até com como da das de dela delas dele deles depois do dos e ela elas ele eles em entre era eram essa essas esse esses esta estamos estas estava estavam este esteja estejam estejamos estes esteve estive estivemos estiver estivera estiveram estiverem estivermos estivesse estivessem estivéramos estivéssemos estou está estávamos estão eu foi fomos for fora foram forem formos fosse fossem fui fôramos fôssemos haja hajam hajamos havemos hei houve houvemos houver houvera houveram houverei houverem houveremos houveria houveriam houvermos houverá houverão houveríamos houvesse houvessem houvéramos houvéssemos há hão isso isto já lhe lhes mais mas me mesmo meu meus minha minhas muito na nas nem no nos nossa nossas nosso nossos num numa não nós o os ou para pela pelas pelo pelos por qual quando que quem se seja sejam sejamos sem serei seremos seria seriam será serão seríamos seu seus somos sou sua suas são só também te tem temos tenha tenham tenhamos tenho terei teremos teria teriam terá terão teríamos teu teus teve tinha tinham tive tivemos tiver tivera tiveram tiverem tivermos tivesse tivessem tivéramos tivéssemos tu tua tuas tém tínhamos um uma você vocês vos à às éramos".split(" "));
lunr.Pipeline.registerFunction(lunr.pt.stopWordFilter,"stopWordFilter-pt")}});
/*!
 * Lunr languages, `Romanian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.ro=function(){this.pipeline.reset();this.pipeline.add(lunr.ro.trimmer,lunr.ro.stopWordFilter,lunr.ro.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.ro.stemmer)
}};lunr.ro.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.ro.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.ro.wordCharacters);lunr.Pipeline.registerFunction(lunr.ro.trimmer,"trimmer-ro");
lunr.ro.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function RomanianStemmer(){var a_0=[new Among("",-1,3),new Among("I",0,1),new Among("U",0,2)],a_1=[new Among("ea",-1,3),new Among("aţia",-1,7),new Among("aua",-1,2),new Among("iua",-1,4),new Among("aţie",-1,7),new Among("ele",-1,3),new Among("ile",-1,5),new Among("iile",6,4),new Among("iei",-1,4),new Among("atei",-1,6),new Among("ii",-1,4),new Among("ului",-1,1),new Among("ul",-1,1),new Among("elor",-1,3),new Among("ilor",-1,4),new Among("iilor",14,4)],a_2=[new Among("icala",-1,4),new Among("iciva",-1,4),new Among("ativa",-1,5),new Among("itiva",-1,6),new Among("icale",-1,4),new Among("aţiune",-1,5),new Among("iţiune",-1,6),new Among("atoare",-1,5),new Among("itoare",-1,6),new Among("ătoare",-1,5),new Among("icitate",-1,4),new Among("abilitate",-1,1),new Among("ibilitate",-1,2),new Among("ivitate",-1,3),new Among("icive",-1,4),new Among("ative",-1,5),new Among("itive",-1,6),new Among("icali",-1,4),new Among("atori",-1,5),new Among("icatori",18,4),new Among("itori",-1,6),new Among("ători",-1,5),new Among("icitati",-1,4),new Among("abilitati",-1,1),new Among("ivitati",-1,3),new Among("icivi",-1,4),new Among("ativi",-1,5),new Among("itivi",-1,6),new Among("icităi",-1,4),new Among("abilităi",-1,1),new Among("ivităi",-1,3),new Among("icităţi",-1,4),new Among("abilităţi",-1,1),new Among("ivităţi",-1,3),new Among("ical",-1,4),new Among("ator",-1,5),new Among("icator",35,4),new Among("itor",-1,6),new Among("ător",-1,5),new Among("iciv",-1,4),new Among("ativ",-1,5),new Among("itiv",-1,6),new Among("icală",-1,4),new Among("icivă",-1,4),new Among("ativă",-1,5),new Among("itivă",-1,6)],a_3=[new Among("ica",-1,1),new Among("abila",-1,1),new Among("ibila",-1,1),new Among("oasa",-1,1),new Among("ata",-1,1),new Among("ita",-1,1),new Among("anta",-1,1),new Among("ista",-1,3),new Among("uta",-1,1),new Among("iva",-1,1),new Among("ic",-1,1),new Among("ice",-1,1),new Among("abile",-1,1),new Among("ibile",-1,1),new Among("isme",-1,3),new Among("iune",-1,2),new Among("oase",-1,1),new Among("ate",-1,1),new Among("itate",17,1),new Among("ite",-1,1),new Among("ante",-1,1),new Among("iste",-1,3),new Among("ute",-1,1),new Among("ive",-1,1),new Among("ici",-1,1),new Among("abili",-1,1),new Among("ibili",-1,1),new Among("iuni",-1,2),new Among("atori",-1,1),new Among("osi",-1,1),new Among("ati",-1,1),new Among("itati",30,1),new Among("iti",-1,1),new Among("anti",-1,1),new Among("isti",-1,3),new Among("uti",-1,1),new Among("işti",-1,3),new Among("ivi",-1,1),new Among("ităi",-1,1),new Among("oşi",-1,1),new Among("ităţi",-1,1),new Among("abil",-1,1),new Among("ibil",-1,1),new Among("ism",-1,3),new Among("ator",-1,1),new Among("os",-1,1),new Among("at",-1,1),new Among("it",-1,1),new Among("ant",-1,1),new Among("ist",-1,3),new Among("ut",-1,1),new Among("iv",-1,1),new Among("ică",-1,1),new Among("abilă",-1,1),new Among("ibilă",-1,1),new Among("oasă",-1,1),new Among("ată",-1,1),new Among("ită",-1,1),new Among("antă",-1,1),new Among("istă",-1,3),new Among("ută",-1,1),new Among("ivă",-1,1)],a_4=[new Among("ea",-1,1),new Among("ia",-1,1),new Among("esc",-1,1),new Among("ăsc",-1,1),new Among("ind",-1,1),new Among("ând",-1,1),new Among("are",-1,1),new Among("ere",-1,1),new Among("ire",-1,1),new Among("âre",-1,1),new Among("se",-1,2),new Among("ase",10,1),new Among("sese",10,2),new Among("ise",10,1),new Among("use",10,1),new Among("âse",10,1),new Among("eşte",-1,1),new Among("ăşte",-1,1),new Among("eze",-1,1),new Among("ai",-1,1),new Among("eai",19,1),new Among("iai",19,1),new Among("sei",-1,2),new Among("eşti",-1,1),new Among("ăşti",-1,1),new Among("ui",-1,1),new Among("ezi",-1,1),new Among("âi",-1,1),new Among("aşi",-1,1),new Among("seşi",-1,2),new Among("aseşi",29,1),new Among("seseşi",29,2),new Among("iseşi",29,1),new Among("useşi",29,1),new Among("âseşi",29,1),new Among("işi",-1,1),new Among("uşi",-1,1),new Among("âşi",-1,1),new Among("aţi",-1,2),new Among("eaţi",38,1),new Among("iaţi",38,1),new Among("eţi",-1,2),new Among("iţi",-1,2),new Among("âţi",-1,2),new Among("arăţi",-1,1),new Among("serăţi",-1,2),new Among("aserăţi",45,1),new Among("seserăţi",45,2),new Among("iserăţi",45,1),new Among("userăţi",45,1),new Among("âserăţi",45,1),new Among("irăţi",-1,1),new Among("urăţi",-1,1),new Among("ârăţi",-1,1),new Among("am",-1,1),new Among("eam",54,1),new Among("iam",54,1),new Among("em",-1,2),new Among("asem",57,1),new Among("sesem",57,2),new Among("isem",57,1),new Among("usem",57,1),new Among("âsem",57,1),new Among("im",-1,2),new Among("âm",-1,2),new Among("ăm",-1,2),new Among("arăm",65,1),new Among("serăm",65,2),new Among("aserăm",67,1),new Among("seserăm",67,2),new Among("iserăm",67,1),new Among("userăm",67,1),new Among("âserăm",67,1),new Among("irăm",65,1),new Among("urăm",65,1),new Among("ârăm",65,1),new Among("au",-1,1),new Among("eau",76,1),new Among("iau",76,1),new Among("indu",-1,1),new Among("ându",-1,1),new Among("ez",-1,1),new Among("ească",-1,1),new Among("ară",-1,1),new Among("seră",-1,2),new Among("aseră",84,1),new Among("seseră",84,2),new Among("iseră",84,1),new Among("useră",84,1),new Among("âseră",84,1),new Among("iră",-1,1),new Among("ură",-1,1),new Among("âră",-1,1),new Among("ează",-1,1)],a_5=[new Among("a",-1,1),new Among("e",-1,1),new Among("ie",1,1),new Among("i",-1,1),new Among("ă",-1,1)],g_v=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,2,32,0,0,4],B_standard_suffix_removed,I_p2,I_p1,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(c1,c2){if(sbp.eq_s(1,c1)){sbp.ket=sbp.cursor;if(sbp.in_grouping(g_v,97,259)){sbp.slice_from(c2)
}}}function r_prelude(){var v_1,v_2;while(true){v_1=sbp.cursor;if(sbp.in_grouping(g_v,97,259)){v_2=sbp.cursor;
sbp.bra=v_2;habr1("u","U");sbp.cursor=v_2;habr1("i","I")}sbp.cursor=v_1;if(sbp.cursor>=sbp.limit){break
}sbp.cursor++}}function habr2(){if(sbp.out_grouping(g_v,97,259)){while(!sbp.in_grouping(g_v,97,259)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}return false}return true}function habr3(){if(sbp.in_grouping(g_v,97,259)){while(!sbp.out_grouping(g_v,97,259)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}}return false}function habr4(){var v_1=sbp.cursor,v_2,v_3;if(sbp.in_grouping(g_v,97,259)){v_2=sbp.cursor;
if(habr2()){sbp.cursor=v_2;if(!habr3()){I_pV=sbp.cursor;return}}else{I_pV=sbp.cursor;
return}}sbp.cursor=v_1;if(sbp.out_grouping(g_v,97,259)){v_3=sbp.cursor;if(habr2()){sbp.cursor=v_3;
if(sbp.in_grouping(g_v,97,259)&&sbp.cursor<sbp.limit){sbp.cursor++}}I_pV=sbp.cursor
}}function habr5(){while(!sbp.in_grouping(g_v,97,259)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}while(!sbp.out_grouping(g_v,97,259)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function r_mark_regions(){var v_1=sbp.cursor;I_pV=sbp.limit;
I_p1=I_pV;I_p2=I_pV;habr4();sbp.cursor=v_1;if(habr5()){I_p1=sbp.cursor;if(habr5()){I_p2=sbp.cursor
}}}function r_postlude(){var among_var;while(true){sbp.bra=sbp.cursor;among_var=sbp.find_among(a_0,3);
if(among_var){sbp.ket=sbp.cursor;switch(among_var){case 1:sbp.slice_from("i");continue;
case 2:sbp.slice_from("u");continue;case 3:if(sbp.cursor>=sbp.limit){break}sbp.cursor++;
continue}}break}}function r_RV(){return I_pV<=sbp.cursor}function r_R1(){return I_p1<=sbp.cursor
}function r_R2(){return I_p2<=sbp.cursor}function r_step_0(){var among_var,v_1;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_1,16);if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:sbp.slice_del();
break;case 2:sbp.slice_from("a");break;case 3:sbp.slice_from("e");break;case 4:sbp.slice_from("i");
break;case 5:v_1=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(2,"ab")){sbp.cursor=sbp.limit-v_1;
sbp.slice_from("i")}break;case 6:sbp.slice_from("at");break;case 7:sbp.slice_from("aţi");
break}}}}function r_combo_suffix(){var among_var,v_1=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_2,46);if(among_var){sbp.bra=sbp.cursor;if(r_R1()){switch(among_var){case 1:sbp.slice_from("abil");
break;case 2:sbp.slice_from("ibil");break;case 3:sbp.slice_from("iv");break;case 4:sbp.slice_from("ic");
break;case 5:sbp.slice_from("at");break;case 6:sbp.slice_from("it");break}B_standard_suffix_removed=true;
sbp.cursor=sbp.limit-v_1;return true}}return false}function r_standard_suffix(){var among_var,v_1;
B_standard_suffix_removed=false;while(true){v_1=sbp.limit-sbp.cursor;if(!r_combo_suffix()){sbp.cursor=sbp.limit-v_1;
break}}sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_3,62);if(among_var){sbp.bra=sbp.cursor;
if(r_R2()){switch(among_var){case 1:sbp.slice_del();break;case 2:if(sbp.eq_s_b(1,"ţ")){sbp.bra=sbp.cursor;
sbp.slice_from("t")}break;case 3:sbp.slice_from("ist");break}B_standard_suffix_removed=true
}}}function r_verb_suffix(){var among_var,v_1,v_2;if(sbp.cursor>=I_pV){v_1=sbp.limit_backward;
sbp.limit_backward=I_pV;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_4,94);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:v_2=sbp.limit-sbp.cursor;if(!sbp.out_grouping_b(g_v,97,259)){sbp.cursor=sbp.limit-v_2;
if(!sbp.eq_s_b(1,"u")){break}}case 2:sbp.slice_del();break}}sbp.limit_backward=v_1
}}function r_vowel_suffix(){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_5,5);
if(among_var){sbp.bra=sbp.cursor;if(r_RV()&&among_var==1){sbp.slice_del()}}}this.stem=function(){var v_1=sbp.cursor;
r_prelude();sbp.cursor=v_1;r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;
r_step_0();sbp.cursor=sbp.limit;r_standard_suffix();sbp.cursor=sbp.limit;if(!B_standard_suffix_removed){sbp.cursor=sbp.limit;
r_verb_suffix();sbp.cursor=sbp.limit}r_vowel_suffix();sbp.cursor=sbp.limit_backward;
r_postlude();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.ro.stemmer,"stemmer-ro");lunr.ro.stopWordFilter=lunr.generateStopWordFilter("acea aceasta această aceea acei aceia acel acela acele acelea acest acesta aceste acestea aceşti aceştia acolo acord acum ai aia aibă aici al ale alea altceva altcineva am ar are asemenea asta astea astăzi asupra au avea avem aveţi azi aş aşadar aţi bine bucur bună ca care caut ce cel ceva chiar cinci cine cineva contra cu cum cumva curând curînd când cât câte câtva câţi cînd cît cîte cîtva cîţi că căci cărei căror cărui către da dacă dar datorită dată dau de deci deja deoarece departe deşi din dinaintea dintr- dintre doi doilea două drept după dă ea ei el ele eram este eu eşti face fata fi fie fiecare fii fim fiu fiţi frumos fără graţie halbă iar ieri la le li lor lui lângă lîngă mai mea mei mele mereu meu mi mie mine mult multă mulţi mulţumesc mâine mîine mă ne nevoie nici nicăieri nimeni nimeri nimic nişte noastre noastră noi noroc nostru nouă noştri nu opt ori oricare orice oricine oricum oricând oricât oricînd oricît oriunde patra patru patrulea pe pentru peste pic poate pot prea prima primul prin puţin puţina puţină până pînă rog sa sale sau se spate spre sub sunt suntem sunteţi sută sînt sîntem sînteţi să săi său ta tale te timp tine toate toată tot totuşi toţi trei treia treilea tu tăi tău un una unde undeva unei uneia unele uneori unii unor unora unu unui unuia unul vi voastre voastră voi vostru vouă voştri vreme vreo vreun vă zece zero zi zice îi îl îmi împotriva în  înainte înaintea încotro încât încît între întrucât întrucît îţi ăla ălea ăsta ăstea ăştia şapte şase şi ştiu ţi ţie".split(" "));
lunr.Pipeline.registerFunction(lunr.ro.stopWordFilter,"stopWordFilter-ro")}});
/*!
 * Lunr languages, `Russian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.ru=function(){this.pipeline.reset();this.pipeline.add(lunr.ru.trimmer,lunr.ru.stopWordFilter,lunr.ru.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.ru.stemmer)
}};lunr.ru.wordCharacters="Ѐ-҄҇-ԯᴫᵸⷠ-ⷿꙀ-ꚟ︮︯";lunr.ru.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.ru.wordCharacters);
lunr.Pipeline.registerFunction(lunr.ru.trimmer,"trimmer-ru");lunr.ru.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function RussianStemmer(){var a_0=[new Among("в",-1,1),new Among("ив",0,2),new Among("ыв",0,2),new Among("вши",-1,1),new Among("ивши",3,2),new Among("ывши",3,2),new Among("вшись",-1,1),new Among("ившись",6,2),new Among("ывшись",6,2)],a_1=[new Among("ее",-1,1),new Among("ие",-1,1),new Among("ое",-1,1),new Among("ые",-1,1),new Among("ими",-1,1),new Among("ыми",-1,1),new Among("ей",-1,1),new Among("ий",-1,1),new Among("ой",-1,1),new Among("ый",-1,1),new Among("ем",-1,1),new Among("им",-1,1),new Among("ом",-1,1),new Among("ым",-1,1),new Among("его",-1,1),new Among("ого",-1,1),new Among("ему",-1,1),new Among("ому",-1,1),new Among("их",-1,1),new Among("ых",-1,1),new Among("ею",-1,1),new Among("ою",-1,1),new Among("ую",-1,1),new Among("юю",-1,1),new Among("ая",-1,1),new Among("яя",-1,1)],a_2=[new Among("ем",-1,1),new Among("нн",-1,1),new Among("вш",-1,1),new Among("ивш",2,2),new Among("ывш",2,2),new Among("щ",-1,1),new Among("ющ",5,1),new Among("ующ",6,2)],a_3=[new Among("сь",-1,1),new Among("ся",-1,1)],a_4=[new Among("ла",-1,1),new Among("ила",0,2),new Among("ыла",0,2),new Among("на",-1,1),new Among("ена",3,2),new Among("ете",-1,1),new Among("ите",-1,2),new Among("йте",-1,1),new Among("ейте",7,2),new Among("уйте",7,2),new Among("ли",-1,1),new Among("или",10,2),new Among("ыли",10,2),new Among("й",-1,1),new Among("ей",13,2),new Among("уй",13,2),new Among("л",-1,1),new Among("ил",16,2),new Among("ыл",16,2),new Among("ем",-1,1),new Among("им",-1,2),new Among("ым",-1,2),new Among("н",-1,1),new Among("ен",22,2),new Among("ло",-1,1),new Among("ило",24,2),new Among("ыло",24,2),new Among("но",-1,1),new Among("ено",27,2),new Among("нно",27,1),new Among("ет",-1,1),new Among("ует",30,2),new Among("ит",-1,2),new Among("ыт",-1,2),new Among("ют",-1,1),new Among("уют",34,2),new Among("ят",-1,2),new Among("ны",-1,1),new Among("ены",37,2),new Among("ть",-1,1),new Among("ить",39,2),new Among("ыть",39,2),new Among("ешь",-1,1),new Among("ишь",-1,2),new Among("ю",-1,2),new Among("ую",44,2)],a_5=[new Among("а",-1,1),new Among("ев",-1,1),new Among("ов",-1,1),new Among("е",-1,1),new Among("ие",3,1),new Among("ье",3,1),new Among("и",-1,1),new Among("еи",6,1),new Among("ии",6,1),new Among("ами",6,1),new Among("ями",6,1),new Among("иями",10,1),new Among("й",-1,1),new Among("ей",12,1),new Among("ией",13,1),new Among("ий",12,1),new Among("ой",12,1),new Among("ам",-1,1),new Among("ем",-1,1),new Among("ием",18,1),new Among("ом",-1,1),new Among("ям",-1,1),new Among("иям",21,1),new Among("о",-1,1),new Among("у",-1,1),new Among("ах",-1,1),new Among("ях",-1,1),new Among("иях",26,1),new Among("ы",-1,1),new Among("ь",-1,1),new Among("ю",-1,1),new Among("ию",30,1),new Among("ью",30,1),new Among("я",-1,1),new Among("ия",33,1),new Among("ья",33,1)],a_6=[new Among("ост",-1,1),new Among("ость",-1,1)],a_7=[new Among("ейше",-1,1),new Among("н",-1,2),new Among("ейш",-1,1),new Among("ь",-1,3)],g_v=[33,65,8,232],I_p2,I_pV,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr3(){while(!sbp.in_grouping(g_v,1072,1103)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function habr4(){while(!sbp.out_grouping(g_v,1072,1103)){if(sbp.cursor>=sbp.limit){return false
}sbp.cursor++}return true}function r_mark_regions(){I_pV=sbp.limit;I_p2=I_pV;if(habr3()){I_pV=sbp.cursor;
if(habr4()){if(habr3()){if(habr4()){I_p2=sbp.cursor}}}}}function r_R2(){return I_p2<=sbp.cursor
}function habr2(a,n){var among_var,v_1;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a,n);
if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:v_1=sbp.limit-sbp.cursor;
if(!sbp.eq_s_b(1,"а")){sbp.cursor=sbp.limit-v_1;if(!sbp.eq_s_b(1,"я")){return false
}}case 2:sbp.slice_del();break}return true}return false}function r_perfective_gerund(){return habr2(a_0,9)
}function habr1(a,n){var among_var;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a,n);
if(among_var){sbp.bra=sbp.cursor;if(among_var==1){sbp.slice_del()}return true}return false
}function r_adjective(){return habr1(a_1,26)}function r_adjectival(){var among_var;
if(r_adjective()){habr2(a_2,8);return true}return false}function r_reflexive(){return habr1(a_3,2)
}function r_verb(){return habr2(a_4,46)}function r_noun(){habr1(a_5,36)}function r_derivational(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_6,2);if(among_var){sbp.bra=sbp.cursor;
if(r_R2()&&among_var==1){sbp.slice_del()}}}function r_tidy_up(){var among_var;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_7,4);if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:sbp.slice_del();
sbp.ket=sbp.cursor;if(!sbp.eq_s_b(1,"н")){break}sbp.bra=sbp.cursor;case 2:if(!sbp.eq_s_b(1,"н")){break
}case 3:sbp.slice_del();break}}}this.stem=function(){r_mark_regions();sbp.cursor=sbp.limit;
if(sbp.cursor<I_pV){return false}sbp.limit_backward=I_pV;if(!r_perfective_gerund()){sbp.cursor=sbp.limit;
if(!r_reflexive()){sbp.cursor=sbp.limit}if(!r_adjectival()){sbp.cursor=sbp.limit;
if(!r_verb()){sbp.cursor=sbp.limit;r_noun()}}}sbp.cursor=sbp.limit;sbp.ket=sbp.cursor;
if(sbp.eq_s_b(1,"и")){sbp.bra=sbp.cursor;sbp.slice_del()}else{sbp.cursor=sbp.limit
}r_derivational();sbp.cursor=sbp.limit;r_tidy_up();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.ru.stemmer,"stemmer-ru");lunr.ru.stopWordFilter=lunr.generateStopWordFilter("алло без близко более больше будем будет будете будешь будто буду будут будь бы бывает бывь был была были было быть в важная важное важные важный вам вами вас ваш ваша ваше ваши вверх вдали вдруг ведь везде весь вниз внизу во вокруг вон восемнадцатый восемнадцать восемь восьмой вот впрочем времени время все всегда всего всем всеми всему всех всею всю всюду вся всё второй вы г где говорил говорит год года году да давно даже далеко дальше даром два двадцатый двадцать две двенадцатый двенадцать двух девятнадцатый девятнадцать девятый девять действительно дел день десятый десять для до довольно долго должно другая другие других друго другое другой е его ее ей ему если есть еще ещё ею её ж же жизнь за занят занята занято заняты затем зато зачем здесь значит и из или им именно иметь ими имя иногда их к каждая каждое каждые каждый кажется как какая какой кем когда кого ком кому конечно которая которого которой которые который которых кроме кругом кто куда лет ли лишь лучше люди м мало между меля менее меньше меня миллионов мимо мира мне много многочисленная многочисленное многочисленные многочисленный мной мною мог могут мож может можно можхо мои мой мор мочь моя моё мы на наверху над надо назад наиболее наконец нам нами нас начала наш наша наше наши не него недавно недалеко нее ней нельзя нем немного нему непрерывно нередко несколько нет нею неё ни нибудь ниже низко никогда никуда ними них ничего но ну нужно нх о об оба обычно один одиннадцатый одиннадцать однажды однако одного одной около он она они оно опять особенно от отовсюду отсюда очень первый перед по под пожалуйста позже пока пор пора после посреди потом потому почему почти прекрасно при про просто против процентов пятнадцатый пятнадцать пятый пять раз разве рано раньше рядом с сам сама сами самим самими самих само самого самой самом самому саму свое своего своей свои своих свою сеаой себе себя сегодня седьмой сейчас семнадцатый семнадцать семь сих сказал сказала сказать сколько слишком сначала снова со собой собою совсем спасибо стал суть т та так такая также такие такое такой там твой твоя твоё те тебе тебя тем теми теперь тех то тобой тобою тогда того тоже только том тому тот тою третий три тринадцатый тринадцать ту туда тут ты тысяч у уж уже уметь хорошо хотеть хоть хотя хочешь часто чаще чего человек чем чему через четвертый четыре четырнадцатый четырнадцать что чтоб чтобы чуть шестнадцатый шестнадцать шестой шесть эта эти этим этими этих это этого этой этом этому этот эту я \ufeffа".split(" "));
lunr.Pipeline.registerFunction(lunr.ru.stopWordFilter,"stopWordFilter-ru")}});
/*!
 * Lunr languages, `Swedish` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.sv=function(){this.pipeline.reset();this.pipeline.add(lunr.sv.trimmer,lunr.sv.stopWordFilter,lunr.sv.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.sv.stemmer)
}};lunr.sv.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.sv.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.sv.wordCharacters);lunr.Pipeline.registerFunction(lunr.sv.trimmer,"trimmer-sv");
lunr.sv.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function SwedishStemmer(){var a_0=[new Among("a",-1,1),new Among("arna",0,1),new Among("erna",0,1),new Among("heterna",2,1),new Among("orna",0,1),new Among("ad",-1,1),new Among("e",-1,1),new Among("ade",6,1),new Among("ande",6,1),new Among("arne",6,1),new Among("are",6,1),new Among("aste",6,1),new Among("en",-1,1),new Among("anden",12,1),new Among("aren",12,1),new Among("heten",12,1),new Among("ern",-1,1),new Among("ar",-1,1),new Among("er",-1,1),new Among("heter",18,1),new Among("or",-1,1),new Among("s",-1,2),new Among("as",21,1),new Among("arnas",22,1),new Among("ernas",22,1),new Among("ornas",22,1),new Among("es",21,1),new Among("ades",26,1),new Among("andes",26,1),new Among("ens",21,1),new Among("arens",29,1),new Among("hetens",29,1),new Among("erns",21,1),new Among("at",-1,1),new Among("andet",-1,1),new Among("het",-1,1),new Among("ast",-1,1)],a_1=[new Among("dd",-1,-1),new Among("gd",-1,-1),new Among("nn",-1,-1),new Among("dt",-1,-1),new Among("gt",-1,-1),new Among("kt",-1,-1),new Among("tt",-1,-1)],a_2=[new Among("ig",-1,1),new Among("lig",0,1),new Among("els",-1,1),new Among("fullt",-1,3),new Among("löst",-1,2)],g_v=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,24,0,32],g_s_ending=[119,127,149],I_x,I_p1,sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function r_mark_regions(){var v_1,c=sbp.cursor+3;I_p1=sbp.limit;if(0<=c||c<=sbp.limit){I_x=c;
while(true){v_1=sbp.cursor;if(sbp.in_grouping(g_v,97,246)){sbp.cursor=v_1;break}sbp.cursor=v_1;
if(sbp.cursor>=sbp.limit){return}sbp.cursor++}while(!sbp.out_grouping(g_v,97,246)){if(sbp.cursor>=sbp.limit){return
}sbp.cursor++}I_p1=sbp.cursor;if(I_p1<I_x){I_p1=I_x}}}function r_main_suffix(){var among_var,v_2=sbp.limit_backward;
if(sbp.cursor>=I_p1){sbp.limit_backward=I_p1;sbp.cursor=sbp.limit;sbp.ket=sbp.cursor;
among_var=sbp.find_among_b(a_0,37);sbp.limit_backward=v_2;if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:sbp.slice_del();break;case 2:if(sbp.in_grouping_b(g_s_ending,98,121)){sbp.slice_del()
}break}}}}function r_consonant_pair(){var v_1=sbp.limit_backward;if(sbp.cursor>=I_p1){sbp.limit_backward=I_p1;
sbp.cursor=sbp.limit;if(sbp.find_among_b(a_1,7)){sbp.cursor=sbp.limit;sbp.ket=sbp.cursor;
if(sbp.cursor>sbp.limit_backward){sbp.bra=--sbp.cursor;sbp.slice_del()}}sbp.limit_backward=v_1
}}function r_other_suffix(){var among_var,v_2;if(sbp.cursor>=I_p1){v_2=sbp.limit_backward;
sbp.limit_backward=I_p1;sbp.cursor=sbp.limit;sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_2,5);
if(among_var){sbp.bra=sbp.cursor;switch(among_var){case 1:sbp.slice_del();break;case 2:sbp.slice_from("lös");
break;case 3:sbp.slice_from("full");break}}sbp.limit_backward=v_2}}this.stem=function(){var v_1=sbp.cursor;
r_mark_regions();sbp.limit_backward=v_1;sbp.cursor=sbp.limit;r_main_suffix();sbp.cursor=sbp.limit;
r_consonant_pair();sbp.cursor=sbp.limit;r_other_suffix();return true}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.sv.stemmer,"stemmer-sv");lunr.sv.stopWordFilter=lunr.generateStopWordFilter("alla allt att av blev bli blir blivit de dem den denna deras dess dessa det detta dig din dina ditt du där då efter ej eller en er era ert ett från för ha hade han hans har henne hennes hon honom hur här i icke ingen inom inte jag ju kan kunde man med mellan men mig min mina mitt mot mycket ni nu när någon något några och om oss på samma sedan sig sin sina sitta själv skulle som så sådan sådana sådant till under upp ut utan vad var vara varför varit varje vars vart vem vi vid vilka vilkas vilken vilket vår våra vårt än är åt över".split(" "));
lunr.Pipeline.registerFunction(lunr.sv.stopWordFilter,"stopWordFilter-sv")}});
/*!
 * Lunr languages, `Turkish` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
;
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */
(function(root,factory){if(typeof define==="function"&&define.amd){define(factory)
}else{if(typeof exports==="object"){module.exports=factory()}else{factory()(root.lunr)
}}})(this,function(){return function(lunr){if("undefined"===typeof lunr){throw new Error("Lunr is not present. Please include / require Lunr before this script.")
}if("undefined"===typeof lunr.stemmerSupport){throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.")
}lunr.tr=function(){this.pipeline.reset();this.pipeline.add(lunr.tr.trimmer,lunr.tr.stopWordFilter,lunr.tr.stemmer);
if(this.searchPipeline){this.searchPipeline.reset();this.searchPipeline.add(lunr.tr.stemmer)
}};lunr.tr.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ";
lunr.tr.trimmer=lunr.trimmerSupport.generateTrimmer(lunr.tr.wordCharacters);lunr.Pipeline.registerFunction(lunr.tr.trimmer,"trimmer-tr");
lunr.tr.stemmer=function(){var Among=lunr.stemmerSupport.Among,SnowballProgram=lunr.stemmerSupport.SnowballProgram,st=new function TurkishStemmer(){var a_0=[new Among("m",-1,-1),new Among("n",-1,-1),new Among("miz",-1,-1),new Among("niz",-1,-1),new Among("muz",-1,-1),new Among("nuz",-1,-1),new Among("müz",-1,-1),new Among("nüz",-1,-1),new Among("mız",-1,-1),new Among("nız",-1,-1)],a_1=[new Among("leri",-1,-1),new Among("ları",-1,-1)],a_2=[new Among("ni",-1,-1),new Among("nu",-1,-1),new Among("nü",-1,-1),new Among("nı",-1,-1)],a_3=[new Among("in",-1,-1),new Among("un",-1,-1),new Among("ün",-1,-1),new Among("ın",-1,-1)],a_4=[new Among("a",-1,-1),new Among("e",-1,-1)],a_5=[new Among("na",-1,-1),new Among("ne",-1,-1)],a_6=[new Among("da",-1,-1),new Among("ta",-1,-1),new Among("de",-1,-1),new Among("te",-1,-1)],a_7=[new Among("nda",-1,-1),new Among("nde",-1,-1)],a_8=[new Among("dan",-1,-1),new Among("tan",-1,-1),new Among("den",-1,-1),new Among("ten",-1,-1)],a_9=[new Among("ndan",-1,-1),new Among("nden",-1,-1)],a_10=[new Among("la",-1,-1),new Among("le",-1,-1)],a_11=[new Among("ca",-1,-1),new Among("ce",-1,-1)],a_12=[new Among("im",-1,-1),new Among("um",-1,-1),new Among("üm",-1,-1),new Among("ım",-1,-1)],a_13=[new Among("sin",-1,-1),new Among("sun",-1,-1),new Among("sün",-1,-1),new Among("sın",-1,-1)],a_14=[new Among("iz",-1,-1),new Among("uz",-1,-1),new Among("üz",-1,-1),new Among("ız",-1,-1)],a_15=[new Among("siniz",-1,-1),new Among("sunuz",-1,-1),new Among("sünüz",-1,-1),new Among("sınız",-1,-1)],a_16=[new Among("lar",-1,-1),new Among("ler",-1,-1)],a_17=[new Among("niz",-1,-1),new Among("nuz",-1,-1),new Among("nüz",-1,-1),new Among("nız",-1,-1)],a_18=[new Among("dir",-1,-1),new Among("tir",-1,-1),new Among("dur",-1,-1),new Among("tur",-1,-1),new Among("dür",-1,-1),new Among("tür",-1,-1),new Among("dır",-1,-1),new Among("tır",-1,-1)],a_19=[new Among("casına",-1,-1),new Among("cesine",-1,-1)],a_20=[new Among("di",-1,-1),new Among("ti",-1,-1),new Among("dik",-1,-1),new Among("tik",-1,-1),new Among("duk",-1,-1),new Among("tuk",-1,-1),new Among("dük",-1,-1),new Among("tük",-1,-1),new Among("dık",-1,-1),new Among("tık",-1,-1),new Among("dim",-1,-1),new Among("tim",-1,-1),new Among("dum",-1,-1),new Among("tum",-1,-1),new Among("düm",-1,-1),new Among("tüm",-1,-1),new Among("dım",-1,-1),new Among("tım",-1,-1),new Among("din",-1,-1),new Among("tin",-1,-1),new Among("dun",-1,-1),new Among("tun",-1,-1),new Among("dün",-1,-1),new Among("tün",-1,-1),new Among("dın",-1,-1),new Among("tın",-1,-1),new Among("du",-1,-1),new Among("tu",-1,-1),new Among("dü",-1,-1),new Among("tü",-1,-1),new Among("dı",-1,-1),new Among("tı",-1,-1)],a_21=[new Among("sa",-1,-1),new Among("se",-1,-1),new Among("sak",-1,-1),new Among("sek",-1,-1),new Among("sam",-1,-1),new Among("sem",-1,-1),new Among("san",-1,-1),new Among("sen",-1,-1)],a_22=[new Among("miş",-1,-1),new Among("muş",-1,-1),new Among("müş",-1,-1),new Among("mış",-1,-1)],a_23=[new Among("b",-1,1),new Among("c",-1,2),new Among("d",-1,3),new Among("ğ",-1,4)],g_vowel=[17,65,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,8,0,0,0,0,0,0,1],g_U=[1,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,1],g_vowel1=[1,64,16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],g_vowel2=[17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,130],g_vowel3=[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],g_vowel4=[17],g_vowel5=[65],g_vowel6=[65],B_c_s_n_s,I_strlen,g_habr=[["a",g_vowel1,97,305],["e",g_vowel2,101,252],["ı",g_vowel3,97,305],["i",g_vowel4,101,105],["o",g_vowel5,111,117],["ö",g_vowel6,246,252],["u",g_vowel5,111,117]],sbp=new SnowballProgram;
this.setCurrent=function(word){sbp.setCurrent(word)};this.getCurrent=function(){return sbp.getCurrent()
};function habr1(g_v,n1,n2){while(true){var v_1=sbp.limit-sbp.cursor;if(sbp.in_grouping_b(g_v,n1,n2)){sbp.cursor=sbp.limit-v_1;
break}sbp.cursor=sbp.limit-v_1;if(sbp.cursor<=sbp.limit_backward){return false}sbp.cursor--
}return true}function r_check_vowel_harmony(){var v_1,v_2;v_1=sbp.limit-sbp.cursor;
habr1(g_vowel,97,305);for(var i=0;i<g_habr.length;i++){v_2=sbp.limit-sbp.cursor;var habr=g_habr[i];
if(sbp.eq_s_b(1,habr[0])&&habr1(habr[1],habr[2],habr[3])){sbp.cursor=sbp.limit-v_1;
return true}sbp.cursor=sbp.limit-v_2}sbp.cursor=sbp.limit-v_2;if(!sbp.eq_s_b(1,"ü")||!habr1(g_vowel6,246,252)){return false
}sbp.cursor=sbp.limit-v_1;return true}function habr2(f1,f2){var v_1=sbp.limit-sbp.cursor,v_2;
if(f1()){sbp.cursor=sbp.limit-v_1;if(sbp.cursor>sbp.limit_backward){sbp.cursor--;
v_2=sbp.limit-sbp.cursor;if(f2()){sbp.cursor=sbp.limit-v_2;return true}}}sbp.cursor=sbp.limit-v_1;
if(f1()){sbp.cursor=sbp.limit-v_1;return false}sbp.cursor=sbp.limit-v_1;if(sbp.cursor<=sbp.limit_backward){return false
}sbp.cursor--;if(!f2()){return false}sbp.cursor=sbp.limit-v_1;return true}function habr3(f1){return habr2(f1,function(){return sbp.in_grouping_b(g_vowel,97,305)
})}function r_mark_suffix_with_optional_n_consonant(){return habr3(function(){return sbp.eq_s_b(1,"n")
})}function r_mark_suffix_with_optional_s_consonant(){return habr3(function(){return sbp.eq_s_b(1,"s")
})}function r_mark_suffix_with_optional_y_consonant(){return habr3(function(){return sbp.eq_s_b(1,"y")
})}function r_mark_suffix_with_optional_U_vowel(){return habr2(function(){return sbp.in_grouping_b(g_U,105,305)
},function(){return sbp.out_grouping_b(g_vowel,97,305)})}function r_mark_possessives(){return sbp.find_among_b(a_0,10)&&r_mark_suffix_with_optional_U_vowel()
}function r_mark_sU(){return r_check_vowel_harmony()&&sbp.in_grouping_b(g_U,105,305)&&r_mark_suffix_with_optional_s_consonant()
}function r_mark_lArI(){return sbp.find_among_b(a_1,2)}function r_mark_yU(){return r_check_vowel_harmony()&&sbp.in_grouping_b(g_U,105,305)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_nU(){return r_check_vowel_harmony()&&sbp.find_among_b(a_2,4)}function r_mark_nUn(){return r_check_vowel_harmony()&&sbp.find_among_b(a_3,4)&&r_mark_suffix_with_optional_n_consonant()
}function r_mark_yA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_4,2)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_nA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_5,2)}function r_mark_DA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_6,4)
}function r_mark_ndA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_7,2)}function r_mark_DAn(){return r_check_vowel_harmony()&&sbp.find_among_b(a_8,4)
}function r_mark_ndAn(){return r_check_vowel_harmony()&&sbp.find_among_b(a_9,2)}function r_mark_ylA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_10,2)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_ki(){return sbp.eq_s_b(2,"ki")}function r_mark_ncA(){return r_check_vowel_harmony()&&sbp.find_among_b(a_11,2)&&r_mark_suffix_with_optional_n_consonant()
}function r_mark_yUm(){return r_check_vowel_harmony()&&sbp.find_among_b(a_12,4)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_sUn(){return r_check_vowel_harmony()&&sbp.find_among_b(a_13,4)}function r_mark_yUz(){return r_check_vowel_harmony()&&sbp.find_among_b(a_14,4)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_sUnUz(){return sbp.find_among_b(a_15,4)}function r_mark_lAr(){return r_check_vowel_harmony()&&sbp.find_among_b(a_16,2)
}function r_mark_nUz(){return r_check_vowel_harmony()&&sbp.find_among_b(a_17,4)}function r_mark_DUr(){return r_check_vowel_harmony()&&sbp.find_among_b(a_18,8)
}function r_mark_cAsInA(){return sbp.find_among_b(a_19,2)}function r_mark_yDU(){return r_check_vowel_harmony()&&sbp.find_among_b(a_20,32)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_ysA(){return sbp.find_among_b(a_21,8)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_ymUs_(){return r_check_vowel_harmony()&&sbp.find_among_b(a_22,4)&&r_mark_suffix_with_optional_y_consonant()
}function r_mark_yken(){return sbp.eq_s_b(3,"ken")&&r_mark_suffix_with_optional_y_consonant()
}function habr4(){var v_1=sbp.limit-sbp.cursor;if(!r_mark_ymUs_()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yDU()){sbp.cursor=sbp.limit-v_1;if(!r_mark_ysA()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yken()){return true}}}}return false}function habr5(){if(r_mark_cAsInA()){var v_1=sbp.limit-sbp.cursor;
if(!r_mark_sUnUz()){sbp.cursor=sbp.limit-v_1;if(!r_mark_lAr()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yUm()){sbp.cursor=sbp.limit-v_1;if(!r_mark_sUn()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yUz()){sbp.cursor=sbp.limit-v_1}}}}}if(r_mark_ymUs_()){return false}}return true
}function habr6(){if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();var v_1=sbp.limit-sbp.cursor;
sbp.ket=sbp.cursor;if(!r_mark_DUr()){sbp.cursor=sbp.limit-v_1;if(!r_mark_yDU()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_ysA()){sbp.cursor=sbp.limit-v_1;if(!r_mark_ymUs_()){sbp.cursor=sbp.limit-v_1
}}}}B_c_s_n_s=false;return false}return true}function habr7(){if(!r_mark_nUz()){return true
}var v_1=sbp.limit-sbp.cursor;if(!r_mark_yDU()){sbp.cursor=sbp.limit-v_1;if(!r_mark_ysA()){return true
}}return false}function habr8(){var v_1=sbp.limit-sbp.cursor,v_2;if(!r_mark_sUnUz()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yUz()){sbp.cursor=sbp.limit-v_1;if(!r_mark_sUn()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yUm()){return true}}}}sbp.bra=sbp.cursor;sbp.slice_del();v_2=sbp.limit-sbp.cursor;
sbp.ket=sbp.cursor;if(!r_mark_ymUs_()){sbp.cursor=sbp.limit-v_2}return false}function r_stem_nominal_verb_suffixes(){var v_1=sbp.limit-sbp.cursor,v_2;
sbp.ket=sbp.cursor;B_c_s_n_s=true;if(habr4()){sbp.cursor=sbp.limit-v_1;if(habr5()){sbp.cursor=sbp.limit-v_1;
if(habr6()){sbp.cursor=sbp.limit-v_1;if(habr7()){sbp.cursor=sbp.limit-v_1;if(habr8()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_DUr()){return}sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;v_2=sbp.limit-sbp.cursor;
if(!r_mark_sUnUz()){sbp.cursor=sbp.limit-v_2;if(!r_mark_lAr()){sbp.cursor=sbp.limit-v_2;
if(!r_mark_yUm()){sbp.cursor=sbp.limit-v_2;if(!r_mark_sUn()){sbp.cursor=sbp.limit-v_2;
if(!r_mark_yUz()){sbp.cursor=sbp.limit-v_2}}}}}if(!r_mark_ymUs_()){sbp.cursor=sbp.limit-v_2
}}}}}}sbp.bra=sbp.cursor;sbp.slice_del()}function r_stem_suffix_chain_before_ki(){var v_1,v_2,v_3,v_4;
sbp.ket=sbp.cursor;if(r_mark_ki()){v_1=sbp.limit-sbp.cursor;if(r_mark_DA()){sbp.bra=sbp.cursor;
sbp.slice_del();v_2=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;
sbp.slice_del();r_stem_suffix_chain_before_ki()}else{sbp.cursor=sbp.limit-v_2;if(r_mark_possessives()){sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();
r_stem_suffix_chain_before_ki()}}}return true}sbp.cursor=sbp.limit-v_1;if(r_mark_nUn()){sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;v_3=sbp.limit-sbp.cursor;if(r_mark_lArI()){sbp.bra=sbp.cursor;
sbp.slice_del()}else{sbp.cursor=sbp.limit-v_3;sbp.ket=sbp.cursor;if(!r_mark_possessives()){sbp.cursor=sbp.limit-v_3;
if(!r_mark_sU()){sbp.cursor=sbp.limit-v_3;if(!r_stem_suffix_chain_before_ki()){return true
}}}sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;
sbp.slice_del();r_stem_suffix_chain_before_ki()}}return true}sbp.cursor=sbp.limit-v_1;
if(r_mark_ndA()){v_4=sbp.limit-sbp.cursor;if(r_mark_lArI()){sbp.bra=sbp.cursor;sbp.slice_del()
}else{sbp.cursor=sbp.limit-v_4;if(r_mark_sU()){sbp.bra=sbp.cursor;sbp.slice_del();
sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();r_stem_suffix_chain_before_ki()
}}else{sbp.cursor=sbp.limit-v_4;if(!r_stem_suffix_chain_before_ki()){return false
}}}return true}}return false}function habr9(v_1){sbp.ket=sbp.cursor;if(!r_mark_ndA()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_nA()){return false}}var v_2=sbp.limit-sbp.cursor;if(r_mark_lArI()){sbp.bra=sbp.cursor;
sbp.slice_del()}else{sbp.cursor=sbp.limit-v_2;if(r_mark_sU()){sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();
r_stem_suffix_chain_before_ki()}}else{sbp.cursor=sbp.limit-v_2;if(!r_stem_suffix_chain_before_ki()){return false
}}}return true}function habr10(v_1){sbp.ket=sbp.cursor;if(!r_mark_ndAn()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_nU()){return false}}var v_2=sbp.limit-sbp.cursor;if(!r_mark_sU()){sbp.cursor=sbp.limit-v_2;
if(!r_mark_lArI()){return false}}sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;
if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();r_stem_suffix_chain_before_ki()
}return true}function habr11(){var v_1=sbp.limit-sbp.cursor,v_2;sbp.ket=sbp.cursor;
if(!r_mark_nUn()){sbp.cursor=sbp.limit-v_1;if(!r_mark_ylA()){return false}}sbp.bra=sbp.cursor;
sbp.slice_del();v_2=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;
sbp.slice_del();if(r_stem_suffix_chain_before_ki()){return true}}sbp.cursor=sbp.limit-v_2;
sbp.ket=sbp.cursor;if(!r_mark_possessives()){sbp.cursor=sbp.limit-v_2;if(!r_mark_sU()){sbp.cursor=sbp.limit-v_2;
if(!r_stem_suffix_chain_before_ki()){return true}}}sbp.bra=sbp.cursor;sbp.slice_del();
sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();r_stem_suffix_chain_before_ki()
}return true}function habr12(){var v_1=sbp.limit-sbp.cursor,v_2,v_3;sbp.ket=sbp.cursor;
if(!r_mark_DA()){sbp.cursor=sbp.limit-v_1;if(!r_mark_yU()){sbp.cursor=sbp.limit-v_1;
if(!r_mark_yA()){return false}}}sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;
v_2=sbp.limit-sbp.cursor;if(r_mark_possessives()){sbp.bra=sbp.cursor;sbp.slice_del();
v_3=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;if(!r_mark_lAr()){sbp.cursor=sbp.limit-v_3
}}else{sbp.cursor=sbp.limit-v_2;if(!r_mark_lAr()){return true}}sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;r_stem_suffix_chain_before_ki();return true}function r_stem_noun_suffixes(){var v_1=sbp.limit-sbp.cursor,v_2,v_3;
sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();r_stem_suffix_chain_before_ki();
return}sbp.cursor=sbp.limit-v_1;sbp.ket=sbp.cursor;if(r_mark_ncA()){sbp.bra=sbp.cursor;
sbp.slice_del();v_2=sbp.limit-sbp.cursor;sbp.ket=sbp.cursor;if(r_mark_lArI()){sbp.bra=sbp.cursor;
sbp.slice_del()}else{sbp.cursor=sbp.limit-v_2;sbp.ket=sbp.cursor;if(!r_mark_possessives()){sbp.cursor=sbp.limit-v_2;
if(!r_mark_sU()){sbp.cursor=sbp.limit-v_2;sbp.ket=sbp.cursor;if(!r_mark_lAr()){return
}sbp.bra=sbp.cursor;sbp.slice_del();if(!r_stem_suffix_chain_before_ki()){return}}}sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();
r_stem_suffix_chain_before_ki()}}return}sbp.cursor=sbp.limit-v_1;if(habr9(v_1)){return
}sbp.cursor=sbp.limit-v_1;if(habr10(v_1)){return}sbp.cursor=sbp.limit-v_1;sbp.ket=sbp.cursor;
if(r_mark_DAn()){sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;v_3=sbp.limit-sbp.cursor;
if(r_mark_possessives()){sbp.bra=sbp.cursor;sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;
sbp.slice_del();r_stem_suffix_chain_before_ki()}}else{sbp.cursor=sbp.limit-v_3;if(r_mark_lAr()){sbp.bra=sbp.cursor;
sbp.slice_del();r_stem_suffix_chain_before_ki()}else{sbp.cursor=sbp.limit-v_3;r_stem_suffix_chain_before_ki()
}}return}sbp.cursor=sbp.limit-v_1;if(habr11()){return}sbp.cursor=sbp.limit-v_1;if(r_mark_lArI()){sbp.bra=sbp.cursor;
sbp.slice_del();return}sbp.cursor=sbp.limit-v_1;if(r_stem_suffix_chain_before_ki()){return
}sbp.cursor=sbp.limit-v_1;if(habr12()){return}sbp.cursor=sbp.limit-v_1;sbp.ket=sbp.cursor;
if(!r_mark_possessives()){sbp.cursor=sbp.limit-v_1;if(!r_mark_sU()){return}}sbp.bra=sbp.cursor;
sbp.slice_del();sbp.ket=sbp.cursor;if(r_mark_lAr()){sbp.bra=sbp.cursor;sbp.slice_del();
r_stem_suffix_chain_before_ki()}}function r_post_process_last_consonants(){var among_var;
sbp.ket=sbp.cursor;among_var=sbp.find_among_b(a_23,4);if(among_var){sbp.bra=sbp.cursor;
switch(among_var){case 1:sbp.slice_from("p");break;case 2:sbp.slice_from("ç");break;
case 3:sbp.slice_from("t");break;case 4:sbp.slice_from("k");break}}}function habr13(){while(true){var v_1=sbp.limit-sbp.cursor;
if(sbp.in_grouping_b(g_vowel,97,305)){sbp.cursor=sbp.limit-v_1;break}sbp.cursor=sbp.limit-v_1;
if(sbp.cursor<=sbp.limit_backward){return false}sbp.cursor--}return true}function habr14(v_1,c1,c2){sbp.cursor=sbp.limit-v_1;
if(habr13()){var v_2=sbp.limit-sbp.cursor;if(!sbp.eq_s_b(1,c1)){sbp.cursor=sbp.limit-v_2;
if(!sbp.eq_s_b(1,c2)){return true}}sbp.cursor=sbp.limit-v_1;var c=sbp.cursor;sbp.insert(sbp.cursor,sbp.cursor,c2);
sbp.cursor=c;return false}return true}function r_append_U_to_stems_ending_with_d_or_g(){var v_1=sbp.limit-sbp.cursor;
if(!sbp.eq_s_b(1,"d")){sbp.cursor=sbp.limit-v_1;if(!sbp.eq_s_b(1,"g")){return}}if(habr14(v_1,"a","ı")){if(habr14(v_1,"e","i")){if(habr14(v_1,"o","u")){habr14(v_1,"ö","ü")
}}}}function r_more_than_one_syllable_word(){var v_1=sbp.cursor,v_2=2,v_3;while(true){v_3=sbp.cursor;
while(!sbp.in_grouping(g_vowel,97,305)){if(sbp.cursor>=sbp.limit){sbp.cursor=v_3;
if(v_2>0){return false}sbp.cursor=v_1;return true}sbp.cursor++}v_2--}}function habr15(v_1,n1,c1){while(!sbp.eq_s(n1,c1)){if(sbp.cursor>=sbp.limit){return true
}sbp.cursor++}I_strlen=n1;if(I_strlen!=sbp.limit){return true}sbp.cursor=v_1;return false
}function r_is_reserved_word(){var v_1=sbp.cursor;if(habr15(v_1,2,"ad")){sbp.cursor=v_1;
if(habr15(v_1,5,"soyad")){return false}}return true}function r_postlude(){var v_1=sbp.cursor;
if(r_is_reserved_word()){return false}sbp.limit_backward=v_1;sbp.cursor=sbp.limit;
r_append_U_to_stems_ending_with_d_or_g();sbp.cursor=sbp.limit;r_post_process_last_consonants();
return true}this.stem=function(){if(r_more_than_one_syllable_word()){sbp.limit_backward=sbp.cursor;
sbp.cursor=sbp.limit;r_stem_nominal_verb_suffixes();sbp.cursor=sbp.limit;if(B_c_s_n_s){r_stem_noun_suffixes();
sbp.cursor=sbp.limit_backward;if(r_postlude()){return true}}}return false}};return function(token){if(typeof token.update==="function"){return token.update(function(word){st.setCurrent(word);
st.stem();return st.getCurrent()})}else{st.setCurrent(token);st.stem();return st.getCurrent()
}}}();lunr.Pipeline.registerFunction(lunr.tr.stemmer,"stemmer-tr");lunr.tr.stopWordFilter=lunr.generateStopWordFilter("acaba altmış altı ama ancak arada aslında ayrıca bana bazı belki ben benden beni benim beri beş bile bin bir biri birkaç birkez birçok birşey birşeyi biz bizden bize bizi bizim bu buna bunda bundan bunlar bunları bunların bunu bunun burada böyle böylece da daha dahi de defa değil diye diğer doksan dokuz dolayı dolayısıyla dört edecek eden ederek edilecek ediliyor edilmesi ediyor elli en etmesi etti ettiği ettiğini eğer gibi göre halen hangi hatta hem henüz hep hepsi her herhangi herkesin hiç hiçbir iki ile ilgili ise itibaren itibariyle için işte kadar karşın katrilyon kendi kendilerine kendini kendisi kendisine kendisini kez ki kim kimden kime kimi kimse kırk milyar milyon mu mü mı nasıl ne neden nedenle nerde nerede nereye niye niçin o olan olarak oldu olduklarını olduğu olduğunu olmadı olmadığı olmak olması olmayan olmaz olsa olsun olup olur olursa oluyor on ona ondan onlar onlardan onları onların onu onun otuz oysa pek rağmen sadece sanki sekiz seksen sen senden seni senin siz sizden sizi sizin tarafından trilyon tüm var vardı ve veya ya yani yapacak yapmak yaptı yaptıkları yaptığı yaptığını yapılan yapılması yapıyor yedi yerine yetmiş yine yirmi yoksa yüz zaten çok çünkü öyle üzere üç şey şeyden şeyi şeyler şu şuna şunda şundan şunları şunu şöyle".split(" "));
lunr.Pipeline.registerFunction(lunr.tr.stopWordFilter,"stopWordFilter-tr")}});lunr.multiLanguage("en","da","de","es","fi","fr","hu","it","ja","nl","no","pt","ro","ru","sv","tr");