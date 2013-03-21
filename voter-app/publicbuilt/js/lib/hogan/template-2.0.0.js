/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan={};(function(e,t){function a(e){return String(e===null||e===undefined?"":e)}function f(e){return e=a(e),u.test(e)?e.replace(n,"&amp;").replace(r,"&lt;").replace(i,"&gt;").replace(s,"&#39;").replace(o,"&quot;"):e}e.Template=function(e,n,r,i){this.r=e||this.r,this.c=r,this.options=i,this.text=n||"",this.buf=t?[]:""},e.Template.prototype={r:function(e,t,n){return""},v:f,t:a,render:function(t,n,r){return this.ri([t],n||{},r)},ri:function(e,t,n){return this.r(e,t,n)},rp:function(e,t,n,r){var i=n[e];return i?(this.c&&typeof i=="string"&&(i=this.c.compile(i,this.options)),i.ri(t,n,r)):""},rs:function(e,t,n){var r=e[e.length-1];if(!l(r)){n(e,t,this);return}for(var i=0;i<r.length;i++)e.push(r[i]),n(e,t,this),e.pop()},s:function(e,t,n,r,i,s,o){var u;return l(e)&&e.length===0?!1:(typeof e=="function"&&(e=this.ls(e,t,n,r,i,s,o)),u=e===""||!!e,!r&&u&&t&&t.push(typeof e=="object"?e:t[t.length-1]),u)},d:function(e,t,n,r){var i=e.split("."),s=this.f(i[0],t,n,r),o=null;if(e==="."&&l(t[t.length-2]))return t[t.length-1];for(var u=1;u<i.length;u++)s&&typeof s=="object"&&i[u]in s?(o=s,s=s[i[u]]):s="";return r&&!s?!1:(!r&&typeof s=="function"&&(t.push(o),s=this.lv(s,t,n),t.pop()),s)},f:function(e,t,n,r){var i=!1,s=null,o=!1;for(var u=t.length-1;u>=0;u--){s=t[u];if(s&&typeof s=="object"&&e in s){i=s[e],o=!0;break}}return o?(!r&&typeof i=="function"&&(i=this.lv(i,t,n)),i):r?!1:""},ho:function(e,t,n,r,i){var s=this.c,o=this.options;o.delimiters=i;var r=e.call(t,r);return r=r==null?String(r):r.toString(),this.b(s.compile(r,o).render(t,n)),!1},b:t?function(e){this.buf.push(e)}:function(e){this.buf+=e},fl:t?function(){var e=this.buf.join("");return this.buf=[],e}:function(){var e=this.buf;return this.buf="",e},ls:function(e,t,n,r,i,s,o){var u=t[t.length-1],a=null;if(!r&&this.c&&e.length>0)return this.ho(e,u,n,this.text.substring(i,s),o);a=e.call(u);if(typeof a=="function"){if(r)return!0;if(this.c)return this.ho(a,u,n,this.text.substring(i,s),o)}return a},lv:function(e,t,n){var r=t[t.length-1],i=e.call(r);if(typeof i=="function"){i=a(i.call(r));if(this.c&&~i.indexOf("{{"))return this.c.compile(i,this.options).render(r,n)}return a(i)}};var n=/&/g,r=/</g,i=/>/g,s=/\'/g,o=/\"/g,u=/[&<>\"\']/,l=Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"}})(typeof exports!="undefined"?exports:Hogan);