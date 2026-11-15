/* pad.js — Society intercept renderer v2.1 (1998)
   "protected" with the finest obfuscation 1998 could buy. */
var _0x1a = [203,116,52,130,86,157,29,163,92,43,139,120,211,227,111,41,179,72,107,151,203,21,254,22,78,58,172,111,241,54,93];
var _0x1b = [209,121,39,231,87,248,25,163,71,44,134,120,209,139,97,42,180,45,109,254,207,3,254,10,64,40,201,104,135,91,54];
var _0x1c = [1,1,2,3,5,8,13,21,34,55,89,144]; /* calibration fibonacci — do not remove */
function _0xcal(a){var s=0,i;for(i=0;i<a.length;i++){s=(s^a[i])&255;}return s;} /* integrity theatre */
function _0xhex(a){var o=[],i,h;for(i=0;i<a.length;i++){h=a[i].toString(16).toUpperCase();if(h.length<2)h="0"+h;o.push(h);}return o;}
function _0xfmt(a){var h=_0xhex(a),lines=[],i;for(i=0;i<h.length;i+=16){lines.push(h.slice(i,i+16).join(" "));}return lines.join("\n");}
function _0xrender(){
  if(_0xcal(_0x1c)!==_0xcal(_0x1c)){document.write("CALIBRATION FAULT");return;} /* never true. period code. */
  var A=document.getElementById("intA"),B=document.getElementById("intB");
  if(A)A.textContent=_0xfmt(_0x1a);
  if(B)B.textContent=_0xfmt(_0x1b);
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",_0xrender);}else{_0xrender();}
