var t=Object.defineProperty,e=(e,i)=>{let r={};for(var s in e)t(r,s,{get:e[s],enumerable:!0});return i||t(r,Symbol.toStringTag,{value:"Module"}),r},i={pending:3,idle_zone:0,diameter:400,show_ticks:!0,show_power_toggle:!0,show_preset_indicator:!0,num_ticks:150,tick_degrees:300},r=/* @__PURE__ */e({card_description:()=>y,card_name:()=>v,default:()=>$,editor_ambient_temperature:()=>h,editor_dhw_entity:()=>m,editor_entity:()=>s,editor_hide_name:()=>n,editor_mode_select_entity:()=>f,editor_name:()=>o,editor_pending:()=>d,editor_readonly:()=>p,editor_show_power_toggle:()=>u,editor_show_preset_indicator:()=>_,editor_status_entity:()=>c,editor_step:()=>l,editor_theme:()=>a,editor_window_entity:()=>g}),s="Entity",o="Name",n="Hide name",a="Theme",l="Step override",d="Pending (seconds)",h="Ambient temperature sensor",c="Status text entity",p="Read-only mode",u="Power button",_="Preset icon",m="Hot water entity",g="Window/door sensor entity",f="Mode select entity",v="OpenTherm Thermostat Dial",y="Round-dial thermostat card for the ESPHome OpenTherm project — hot water, window, fault and mode badges, forked from thermostat-dark-card",$={editor_entity:s,editor_name:o,editor_hide_name:n,editor_theme:a,editor_step:l,editor_pending:d,editor_ambient_temperature:h,editor_status_entity:c,editor_readonly:p,editor_show_power_toggle:u,editor_show_preset_indicator:_,editor_dhw_entity:m,editor_window_entity:g,editor_mode_select_entity:f,card_name:v,card_description:y},b=/* #__PURE__ */Object.assign({"./languages/en.json":r}),w={};for(const[be,we]of Object.entries(b)){const t=be.replace("./languages/","").replace(".json","");w[t]=we.default}function x(t,e){var i,r,s,o,n;const a=null!=e?e:"en",l=null!==(i=null!==(r=w[a])&&void 0!==r?r:w[a.split("-")[0]])&&void 0!==i?i:w.en;return null!==(s=null!==(o=null==l?void 0:l[t])&&void 0!==o?o:null===(n=w.en)||void 0===n?void 0:n[t])&&void 0!==s?s:t}w["zh-Hans"]&&(w.zh=w["zh-Hans"],w["zh-CN"]=w["zh-Hans"]);var A,C,k,E,S=globalThis,M=S.ShadowRoot&&(void 0===S.ShadyCSS||S.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,T=Symbol(),P=/* @__PURE__ */new WeakMap,O=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==T)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(M&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=P.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&P.set(e,t))}return t}toString(){return this.cssText}},j=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,r)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[r+1],t[0]);return new O(i,t,T)},R=M?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new O("string"==typeof t?t:t+"",void 0,T))(e)})(t):t,{is:L,defineProperty:H,getOwnPropertyDescriptor:U,getOwnPropertyNames:N,getOwnPropertySymbols:D,getPrototypeOf:z}=Object,I=globalThis,B=I.trustedTypes,V=B?B.emptyScript:"",q=I.reactiveElementPolyfillSupport,Z=(t,e)=>t,W={toAttribute(t,e){switch(e){case Boolean:t=t?V:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},F=(t,e)=>!L(t,e),J={attribute:!0,type:String,converter:W,reflect:!1,useDefault:!1,hasChanged:F};null!==(C=(A=Symbol).metadata)&&void 0!==C||(A.metadata=Symbol("metadata")),null!==(k=I.litPropertyMetadata)&&void 0!==k||(I.litPropertyMetadata=/* @__PURE__ */new WeakMap);var K,Y=class extends HTMLElement{static addInitializer(t){var e;this._$Ei(),(null!==(e=this.l)&&void 0!==e?e:this.l=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=J){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(t,i,e);void 0!==r&&H(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){var r;const{get:s,set:o}=null!==(r=U(this.prototype,t))&&void 0!==r?r:{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=null==s?void 0:s.call(this);null==o||o.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){var e;return null!==(e=this.elementProperties.get(t))&&void 0!==e?e:J}static _$Ei(){if(this.hasOwnProperty(Z("elementProperties")))return;const t=z(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(Z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(Z("properties"))){const t=this.properties,e=[...N(t),...D(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=/* @__PURE__ */new Map;for(const[e,i]of this.elementProperties){const t=this._$Eu(e,i);void 0!==t&&this._$Eh.set(t,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(R(t))}else void 0!==t&&e.push(R(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=/* @__PURE__ */new Map,this._$E_(),this.requestUpdate(),null===(t=this.constructor.l)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$EO)&&void 0!==e?e:this._$EO=/* @__PURE__ */new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$EO)||void 0===e||e.delete(t)}_$E_(){const t=/* @__PURE__ */new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(M)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),r=S.litNonce;void 0!==r&&e.setAttribute("nonce",r),e.textContent=i.cssText,t.appendChild(e)}})(e,this.constructor.elementStyles),e}connectedCallback(){var t,e;null!==(t=this.renderRoot)&&void 0!==t||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$EO)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$EO)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(void 0!==r&&!0===i.reflect){var s;const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:W).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,r=i._$Eh.get(t);if(void 0!==r&&this._$Em!==r){var s,o,n;const t=i.getPropertyOptions(r),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:W;this._$Em=r;const l=a.fromAttribute(e,t.type);this[r]=null!==(o=null!=l?l:null===(n=this._$Ej)||void 0===n?void 0:n.get(r))&&void 0!==o?o:l,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(void 0!==t){var o,n,a;const l=this.constructor;if(!1===r&&(s=this[t]),null!==(o=i)&&void 0!==o||(i=l.getPropertyOptions(t)),!((null!==(n=i.hasChanged)&&void 0!==n?n:F)(s,e)||i.useDefault&&i.reflect&&s===(null===(a=this._$Ej)||void 0===a?void 0:a.get(t))&&!this.hasAttribute(l._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},o){var n,a,l;i&&!(null!==(n=this._$Ej)&&void 0!==n?n:this._$Ej=/* @__PURE__ */new Map).has(t)&&(this._$Ej.set(t,null!==(a=null!=o?o:e)&&void 0!==a?a:this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===r&&this._$Em!==t&&(null!==(l=this._$Eq)&&void 0!==l?l:this._$Eq=/* @__PURE__ */new Set).add(t))}async _$EP(){var t=this;t.isUpdatePending=!0;try{await t._$ES}catch(e){Promise.reject(e)}const e=t.scheduleUpdate();return null!=e&&await e,!t.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){var t;if(null!==(t=this.renderRoot)&&void 0!==t||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const i=this._$AL;try{var r;e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(r=this._$EO)||void 0===r||r.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$EO)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=/* @__PURE__ */new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[Z("elementProperties")]=/* @__PURE__ */new Map,Y[Z("finalized")]=/* @__PURE__ */new Map,null==q||q({ReactiveElement:Y}),(null!==(E=I.reactiveElementVersions)&&void 0!==E?E:I.reactiveElementVersions=[]).push("2.1.2");var G=globalThis,X=t=>t,Q=G.trustedTypes,tt=Q?Q.createPolicy("lit-html",{createHTML:t=>t}):void 0,et="$lit$",it=`lit$${Math.random().toFixed(9).slice(2)}$`,rt="?"+it,st=`<${rt}>`,ot=document,nt=()=>ot.createComment(""),at=t=>null===t||"object"!=typeof t&&"function"!=typeof t,lt=Array.isArray,dt="[ \t\n\f\r]",ht=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ct=/-->/g,pt=/>/g,ut=RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,mt=/"/g,gt=/^(?:script|style|textarea|title)$/i,ft=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),vt=ft(1),yt=ft(2),$t=(ft(3),Symbol.for("lit-noChange")),bt=Symbol.for("lit-nothing"),wt=/* @__PURE__ */new WeakMap,xt=ot.createTreeWalker(ot,129);function At(t,e){if(!lt(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==tt?tt.createHTML(e):e}var Ct=(t,e)=>{const i=t.length-1,r=[];let s,o=2===e?"<svg>":3===e?"<math>":"",n=ht;for(let l=0;l<i;l++){var a;const e=t[l];let i,d,h=-1,c=0;for(;c<e.length&&(n.lastIndex=c,d=n.exec(e),null!==d);)c=n.lastIndex,n===ht?"!--"===d[1]?n=ct:void 0!==d[1]?n=pt:void 0!==d[2]?(gt.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=ut):void 0!==d[3]&&(n=ut):n===ut?">"===d[0]?(n=null!==(a=s)&&void 0!==a?a:ht,h=-1):void 0===d[1]?h=-2:(h=n.lastIndex-d[2].length,i=d[1],n=void 0===d[3]?ut:'"'===d[3]?mt:_t):n===mt||n===_t?n=ut:n===ct||n===pt?n=ht:(n=ut,s=void 0);const p=n===ut&&t[l+1].startsWith("/>")?" ":"";o+=n===ht?e+st:h>=0?(r.push(i),e.slice(0,h)+et+e.slice(h)+it+p):e+it+(-2===h?l:p)}return[At(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),r]},kt=class t{constructor({strings:e,_$litType$:i},r){let s;this.parts=[];let o=0,n=0;const a=e.length-1,l=this.parts,[d,h]=Ct(e,i);if(this.el=t.createElement(d,r),xt.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=xt.nextNode())&&l.length<a;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(et)){const e=h[n++],i=s.getAttribute(t).split(it),r=/([.?@])?(.*)/.exec(e);l.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?Pt:"?"===r[1]?Ot:"@"===r[1]?jt:Tt}),s.removeAttribute(t)}else t.startsWith(it)&&(l.push({type:6,index:o}),s.removeAttribute(t));if(gt.test(s.tagName)){const t=s.textContent.split(it),e=t.length-1;if(e>0){s.textContent=Q?Q.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],nt()),xt.nextNode(),l.push({type:2,index:++o});s.append(t[e],nt())}}}else if(8===s.nodeType)if(s.data===rt)l.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(it,t+1));)l.push({type:7,index:o}),t+=it.length-1}o++}}static createElement(t,e){const i=ot.createElement("template");return i.innerHTML=t,i}};function Et(t,e,i=t,r){var s,o,n;if(e===$t)return e;let a=void 0!==r?null===(s=i._$Co)||void 0===s?void 0:s[r]:i._$Cl;const l=at(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==l&&(null==a||null===(o=a._$AO)||void 0===o||o.call(a,!1),void 0===l?a=void 0:(a=new l(t),a._$AT(t,i,r)),void 0!==r?(null!==(n=i._$Co)&&void 0!==n?n:i._$Co=[])[r]=a:i._$Cl=a),void 0!==a&&(e=Et(t,a._$AS(t,e.values),a,r)),e}var St=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:r}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:ot).importNode(i,!0);xt.currentNode=s;let o=xt.nextNode(),n=0,a=0,l=r[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new Mt(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Rt(o,this,t)),this._$AV.push(e),l=r[++a]}n!==(null==l?void 0:l.index)&&(o=xt.nextNode(),n++)}return xt.currentNode=ot,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},Mt=class t{get _$AU(){var t,e;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cv}constructor(t,e,i,r){var s;this.type=2,this._$AH=bt,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=null===(s=null==r?void 0:r.isConnected)||void 0===s||s}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Et(this,t,e),at(t)?t===bt||null==t||""===t?(this._$AH!==bt&&this._$AR(),this._$AH=bt):t!==this._$AH&&t!==$t&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>lt(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==bt&&at(this._$AH)?this._$AA.nextSibling.data=t:this.T(ot.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:r}=t,s="number"==typeof r?this._$AC(t):(void 0===r.el&&(r.el=kt.createElement(At(r.h,r.h[0]),this.options)),r);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.p(i);else{const t=new St(s,this),e=t.u(this.options);t.p(i),this.T(e),this._$AH=t}}_$AC(t){let e=wt.get(t.strings);return void 0===e&&wt.set(t.strings,e=new kt(t)),e}k(e){lt(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,s=0;for(const o of e)s===i.length?i.push(r=new t(this.O(nt()),this.O(nt()),this,this.options)):r=i[s],r._$AI(o),s++;s<i.length&&(this._$AR(r&&r._$AB.nextSibling,s),i.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t!==this._$AB;){const e=X(t).nextSibling;X(t).remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cv=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}},Tt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=bt,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(/* @__PURE__ */new String),this.strings=i):this._$AH=bt}_$AI(t,e=this,i,r){const s=this.strings;let o=!1;if(void 0===s)t=Et(this,t,e,0),o=!at(t)||t!==this._$AH&&t!==$t,o&&(this._$AH=t);else{var n;const r=t;let a,l;for(t=s[0],a=0;a<s.length-1;a++)l=Et(this,r[i+a],e,a),l===$t&&(l=this._$AH[a]),o||(o=!at(l)||l!==this._$AH[a]),l===bt?t=bt:t!==bt&&(t+=(null!==(n=l)&&void 0!==n?n:"")+s[a+1]),this._$AH[a]=l}o&&!r&&this.j(t)}j(t){t===bt?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}},Pt=class extends Tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===bt?void 0:t}},Ot=class extends Tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==bt)}},jt=class extends Tt{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Et(this,t,e,0))&&void 0!==i?i:bt)===$t)return;const r=this._$AH,s=t===bt&&r!==bt||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,o=t!==bt&&(r===bt||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(e=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==e?e:this.element,t):this._$AH.handleEvent(t)}},Rt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Et(this,t)}},Lt=G.litHtmlPolyfillSupport;null==Lt||Lt(kt,Mt),(null!==(K=G.litHtmlVersions)&&void 0!==K?K:G.litHtmlVersions=[]).push("3.3.3");var Ht,Ut,Nt=globalThis,Dt=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var r;const s=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:e;let o=s._$litPart$;if(void 0===o){var n;const t=null!==(n=null==i?void 0:i.renderBefore)&&void 0!==n?n:null;s._$litPart$=o=new Mt(e.insertBefore(nt(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return $t}};Dt._$litElement$=!0,Dt.finalized=!0,null===(Ht=Nt.litElementHydrateSupport)||void 0===Ht||Ht.call(Nt,{LitElement:Dt});var zt=Nt.litElementPolyfillSupport;null==zt||zt({LitElement:Dt}),(null!==(Ut=Nt.litElementVersions)&&void 0!==Ut?Ut:Nt.litElementVersions=[]).push("4.2.2");var It=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},Bt={attribute:!0,type:String,converter:W,reflect:!1,hasChanged:F},Vt=(t=Bt,e,i)=>{const{kind:r,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=/* @__PURE__ */new Map),"setter"===r&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===r){const{name:r}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(r,s,t,!0,i)},init(e){return void 0!==e&&this.C(r,void 0,t,e),e}}}if("setter"===r){const{name:r}=i;return function(i){const s=this[r];e.call(this,i),this.requestUpdate(r,s,t,!0,i)}}throw Error("Unsupported decorator location: "+r)};function qt(t){return(e,i)=>"object"==typeof i?Vt(t,e,i):((t,e,i)=>{const r=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),r?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function Zt(t){return Zt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Zt(t)}function Wt(t){var e=function(t,e){if("object"!=Zt(t)||!t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var r=i.call(t,e||"default");if("object"!=Zt(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==Zt(e)?e:e+""}function Ft(t,e,i){return(e=Wt(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function Jt(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),i.push.apply(i,r)}return i}function Kt(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?Jt(Object(i),!0).forEach(function(e){Ft(t,e,i[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):Jt(Object(i)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))})}return t}function Yt(t){return qt(Kt(Kt({},t),{},{state:!0,attribute:!1}))}var Gt=/* @__PURE__ */e({default:()=>Xt}),Xt={"dial-off-fill":"#555","dial-idle-fill":"#222","dial-heating-fill":"#e36304","dial-cooling-fill":"#007af1","dial-drying-fill":"#a68b00","dial-text-color":"#fff","dial-path-color":"rgba(255, 255, 255, 0.3)","dial-path-active-color":"rgba(255, 255, 255, 0.8)","dial-path-active-large-color":"rgba(255, 255, 255, 1)","dial-leaf-color":"#13eb13","dial-toggle-color":"grey"},Qt=/* @__PURE__ */e({default:()=>te}),te={"dial-off-fill":"transparent","dial-idle-fill":"transparent","dial-heating-fill":"transparent","dial-cooling-fill":"transparent","dial-drying-fill":"transparent","dial-text-color":"#f8fbff","dial-path-color":"rgba(255, 255, 255, 0.2)","dial-path-active-color":"#7fe8ff","dial-path-active-large-color":"#7fe8ff","dial-leaf-color":"#13eb13","dial-toggle-color":"rgba(255, 255, 255, 0.5)"},ee=/* @__PURE__ */e({default:()=>ie}),ie={"dial-off-fill":"#e0e0e0","dial-idle-fill":"#f5f5f5","dial-heating-fill":"#e36304","dial-cooling-fill":"#007af1","dial-drying-fill":"#a68b00","dial-text-color":"#212121","dial-path-color":"rgba(0, 0, 0, 0.25)","dial-path-active-color":"rgba(0, 0, 0, 0.6)","dial-path-active-large-color":"rgba(0, 0, 0, 0.9)","dial-leaf-color":"#0a8f0a","dial-toggle-color":"#757575"},re=/* @__PURE__ */e({default:()=>se}),se={"dial-off-fill":"transparent","dial-idle-fill":"transparent","dial-heating-fill":"transparent","dial-cooling-fill":"transparent","dial-drying-fill":"transparent","dial-text-color":"#fff","dial-path-color":"rgba(255, 255, 255, 0.3)","dial-path-active-color":"rgba(255, 255, 255, 0.8)","dial-path-active-large-color":"rgba(255, 255, 255, 1)","dial-leaf-color":"#13eb13","dial-toggle-color":"grey","colored-ticks":"true"},oe=/* #__PURE__ */Object.assign({"./dark.json":Gt,"./glassy.json":Qt,"./light.json":ee,"./transparent.json":re}),ne={};for(const[be,we]of Object.entries(oe)){const t=be.replace("./","").replace(".json","");ne[t]=we.default}var ae=class{constructor(t){this._host=t,t.addController(this)}hostDisconnected(){this._clearTimeout()}enterEditMode(){this._host.editing=!0,this._host.requestUpdate(),this._resetTimer()}pauseTimer(){this._clearTimeout()}resumeTimer(){this._resetTimer()}adjustTarget(t){var e;const i=this._host;if(!i.editing)return void this.enterEditMode();let r=(null!==(e=i.temperature)&&void 0!==e?e:i.min_temp)+t*i.target_temp_step;r=Math.min(Math.max(r,i.min_temp),i.max_temp),i.temperature=r,i.requestUpdate(),this._resetTimer()}adjustLow(t){var e,i;const r=this._host;if(!r.editing)return void this.enterEditMode();let s=(null!==(e=r.target_temp_low)&&void 0!==e?e:r.min_temp)+t*r.target_temp_step;const o=(null!==(i=r.target_temp_high)&&void 0!==i?i:r.max_temp)-r.idle_zone;s=Math.min(Math.max(s,r.min_temp),o),r.target_temp_low=s,r.requestUpdate(),this._resetTimer()}adjustHigh(t){var e,i;const r=this._host;if(!r.editing)return void this.enterEditMode();let s=(null!==(e=r.target_temp_high)&&void 0!==e?e:r.max_temp)+t*r.target_temp_step;const o=(null!==(i=r.target_temp_low)&&void 0!==i?i:r.min_temp)+r.idle_zone;s=Math.min(Math.max(s,o),r.max_temp),r.target_temp_high=s,r.requestUpdate(),this._resetTimer()}_resetTimer(){this._clearTimeout(),this._timeout=window.setTimeout(()=>{this._commitAndExit()},1e3*this._host.pending)}_clearTimeout(){void 0!==this._timeout&&(window.clearTimeout(this._timeout),this._timeout=void 0)}_commitAndExit(){const t=this._host;t.editing=!1,t.requestUpdate(),t.dual?t.dispatchEvent(new CustomEvent("temperature-changed",{bubbles:!0,composed:!0,detail:{target_temp_low:t.target_temp_low,target_temp_high:t.target_temp_high}})):t.dispatchEvent(new CustomEvent("temperature-changed",{bubbles:!0,composed:!0,detail:{temperature:t.temperature}}))}};function le(t,e,i){const r=e*Math.PI/180,s=t[0]-i[0],o=t[1]-i[1];return[s*Math.cos(r)-o*Math.sin(r)+i[0],s*Math.sin(r)+o*Math.cos(r)+i[1]]}function de(t,e,i){return t.map(t=>le(t,e,i))}function he(t){return`${t.map((t,e)=>`${0===e?"M":"L"}${t[0]} ${t[1]}`).join(" ")}Z`}function ce(t,e,i,r){return Math.round((t-e)/(i-e)*(r-1))}function pe(t,e,i){return Math.min(Math.max(t,e),i)}var ue,_e=j`
  :host {
    display: block;
  }

  .dial-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dial {
    user-select: none;
    cursor: pointer;
    touch-action: none;
    width: 100%;
    height: auto;

    /* Theme-aware colors */
    --dial-off-fill: #555;
    --dial-idle-fill: #222;
    --dial-heating-fill: #e36304;
    --dial-cooling-fill: #007af1;
    --dial-drying-fill: #a68b00;
    --dial-text-color: var(--primary-text-color, #fff);
    --dial-path-color: rgba(255, 255, 255, 0.3);
    --dial-path-active-color: rgba(255, 255, 255, 0.8);
    --dial-path-active-large-color: rgba(255, 255, 255, 1);
    --dial-leaf-color: #13eb13;
    --dial-toggle-color: var(--secondary-text-color, grey);
  }

  /* Disc background — colored by hvac_action */
  .dial-disc {
    transition: fill 0.5s ease, opacity 0.5s ease;
  }
  .dial-disc--off {
    fill: var(--dial-off-fill);
  }
  .dial-disc--idle {
    fill: var(--dial-idle-fill);
  }
  .dial-disc--heating {
    fill: var(--dial-heating-fill);
  }
  .dial-disc--cooling {
    fill: var(--dial-cooling-fill);
  }
  .dial-disc--drying {
    fill: var(--dial-drying-fill);
  }
  .dial-disc--preheating {
    fill: var(--dial-heating-fill);
  }
  .dial-disc--defrosting {
    fill: var(--dial-cooling-fill);
  }
  .dial-disc--fan {
    fill: var(--dial-idle-fill);
  }

  /* Off state uses grey fill (handled by disc color) */

  /* Ticks */
  .dial-tick {
    fill: var(--dial-path-color);
  }
  .dial-tick--active {
    fill: var(--dial-path-active-color);
  }
  .dial-tick--large {
    fill: var(--dial-path-active-large-color);
  }

  /* Center text */
  .dial-text {
    fill: var(--dial-text-color);
    text-anchor: middle;
    dominant-baseline: central;
    font-family: Helvetica, sans-serif;
  }
  .dial-text--ambient {
    font-size: 120px;
    font-weight: bold;
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  .dial-text--status {
    font-size: 22px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.8;
  }
  .dial-text--target {
    font-size: 120px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .dial-text--low,
  .dial-text--high {
    font-size: 60px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Edit mode: swap center text and show dual targets */
  :host([editing]) .dial-text--ambient {
    opacity: 0;
  }
  :host([editing]) .dial-text--target {
    opacity: 1;
  }
  :host([editing]) .dial-text--low,
  :host([editing]) .dial-text--high {
    opacity: 1;
  }

  /* Ring (edit mode indicator — thin outline at edge) */
  .dial-ring {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  :host([editing]) .dial-ring {
    opacity: 1;
  }

  /* Ring labels (temperature values on the tick ring) */
  .dial-ring-label {
    font-size: 22px;
    font-weight: bold;
  }

  /* Pointer tick — thicker, extends inward */
  .dial-pointer {
    fill: var(--dial-path-active-large-color);
  }
  :host([off]) .dial-pointer {
    fill: var(--dial-path-color);
  }

  /* Controls (chevrons) */
  .dial-chevron {
    cursor: pointer;
    opacity: 0.3;
    transition: opacity 0.15s ease;
  }
  .dial-chevron path {
    fill: none;
    stroke: var(--dial-text-color);
    stroke-width: 4px;
  }
  .dial-chevron:active {
    opacity: 1;
  }
  .dial-chevron:active path {
    stroke: white;
  }

  /* Indicators */
  .dial-preset {
    fill: var(--dial-leaf-color);
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .dial-preset--visible {
    opacity: 1;
  }

  .dial-power {
    cursor: pointer;
    transition: opacity 0.3s ease;
  }
  .dial-power path {
    fill: var(--dial-toggle-color);
    transition: fill 0.3s ease;
  }
  :host([off]) .dial-power path {
    fill: darkgrey;
  }
  :host(:not([off])) .dial-power path {
    fill: lightgrey;
  }
  .dial-power:hover {
    opacity: 0.8;
  }
  .dial-power--hidden {
    opacity: 0;
    pointer-events: none;
  }

  .dial-thermo {
    fill: var(--dial-path-active-color);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .dial-thermo--visible {
    opacity: 1;
  }
`;function me(t,e,i,r){var s,o=arguments.length,n=o<3?e:null===r?r=Object.getOwnPropertyDescriptor(e,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,r);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(n=(o<3?s(n):o>3?s(e,i,n):s(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}var ge=(ue=class extends Dt{constructor(...t){super(...t),this.current_temperature=0,this.temperature=null,this.target_temp_low=null,this.target_temp_high=null,this.min_temp=7,this.max_temp=35,this.target_temp_step=1,this.hvac_action=null,this.hvac_mode=null,this.preset_mode=null,this.diameter=400,this.num_ticks=150,this.tick_degrees=300,this.pending=3,this.idle_zone=0,this.show_ticks=!0,this.show_power_toggle=!0,this.show_preset_indicator=!0,this.readonly=!1,this.theme="dark",this.status_text=null,this.editing=!1,this._dragging=!1,this._didPointerInteract=!1,this._interaction=new ae(this)}get dual(){return null!==this.target_temp_low&&null!==this.target_temp_high}get _radius(){return this.diameter/2}get _outerRadius(){return this.diameter/30}get _innerRadius(){return this.diameter/8}get _offsetDegrees(){return 180-(360-this.tick_degrees)/2}updated(t){super.updated(t),t.has("editing")&&(this.editing?this.setAttribute("editing",""):this.removeAttribute("editing")),t.has("hvac_action")&&("off"===this.hvac_action?this.setAttribute("off",""):this.removeAttribute("off"))}render(){const t=this._radius,e=this._getColorStyle();return vt`
      <div class="dial-container">
        <svg
          viewBox="0 0 ${this.diameter} ${this.diameter}"
          class="dial"
          style=${e}
          @click=${this._handleDialClick}
          @contextmenu=${this._handleLongPress}
          @pointerdown=${this._handlePointerDown}
          @pointermove=${this._handlePointerMove}
          @pointerup=${this._handlePointerUp}
          @pointercancel=${this._handlePointerUp}
        >
          ${this._renderDisc()}
          ${this.show_ticks?this._renderTicks():""}
          ${function(t){const e=t/50;return yt`<circle
    cx=${t}
    cy=${t}
    r=${t-t/50-e}
    class="dial-ring"
    fill="none"
    stroke="white"
    stroke-width=${e}
  />`}(t)}
          ${this._renderRingLabels()}
          ${this._renderCenter()}
          ${this._renderIndicators()}
          ${this.editing?this._renderControls():""}
        </svg>
      </div>
    `}_getColorStyle(){const t=[];if(this.theme&&"dark"!==this.theme){const e=function(t){const e=ne[t];return e?Object.entries(e).filter(([t])=>"colored-ticks"!==t).map(([t,e])=>`--${t}: ${e}`).join("; "):""}(this.theme);e&&t.push(e)}if(this.colors&&(this.colors.heating&&t.push(`--dial-heating-fill: ${this.colors.heating}`),this.colors.cooling&&t.push(`--dial-cooling-fill: ${this.colors.cooling}`),this.colors.idle&&t.push(`--dial-idle-fill: ${this.colors.idle}`),this.colors.off&&t.push(`--dial-off-fill: ${this.colors.off}`)),function(t){const e=ne[t];return"true"===(null==e?void 0:e["colored-ticks"])}(this.theme)){var e;const i=this.editing?this._predictAction():null!==(e=this.hvac_action)&&void 0!==e?e:"off",r="light"===this.theme,s="transparent"===this.theme||"glassy"===this.theme,o={heating:"#e36304",cooling:"#007af1",drying:"#a68b00"}[i];o&&(s?(t.push(`--dial-path-active-color: ${o}`),t.push(`--dial-path-active-large-color: ${o}`)):r?(t.push(`--dial-path-active-color: color-mix(in srgb, ${o} 60%, black)`),t.push(`--dial-path-active-large-color: color-mix(in srgb, ${o} 50%, black)`)):(t.push(`--dial-path-active-color: color-mix(in srgb, ${o} 55%, white)`),t.push(`--dial-path-active-large-color: color-mix(in srgb, ${o} 40%, white)`)))}return t.join("; ")}_renderDisc(){var t;const e=this._radius;let i=null!==(t=this.hvac_action)&&void 0!==t?t:"off";this.editing&&(i=this._predictAction());const r=this.editing&&"idle"!==i&&"off"!==i?.5:1;return yt`
      <circle cx=${e} cy=${e} r=${e} class="dial-disc dial-disc--${i}" style="opacity: ${r}" />
    `}_predictAction(){const t=this.current_temperature,e=this.hvac_mode;return this.dual&&null!==this.target_temp_low&&null!==this.target_temp_high?t<this.target_temp_low?"heating":t>this.target_temp_high?"cooling":"idle":null!==this.temperature?this.temperature>t?"cool"===e?"idle":"heating":this.temperature<t?"heat"===e?"idle":"cooling":"idle":"off"}_renderTicks(){return function(t,e){const{numTicks:i,tickDegrees:r,radius:s,outerRadius:o,innerRadius:n,offsetDegrees:a}=t,{from:l,to:d,largeIndices:h}=e,c=r/i,p=[s,s],u=[];for(let _=0;_<i;_++){const t=h.includes(_),e=void 0!==l&&void 0!==d&&_>=l&&_<=d,i=he(de(t?[[s-.0075*s,o],[s+.0075*s,o],[s+.0075*s,n+.1*s],[s-.0075*s,n+.1*s]]:[[s-.005*s,o],[s+.005*s,o],[s+.005*s,n],[s-.005*s,n]],_*c-a,p));let r="dial-tick";e&&(r+=" dial-tick--active"),t&&(r+=" dial-tick--large"),u.push(yt`<path d=${i} class=${r} />`)}return yt`<g class="dial-ticks">${u}</g>`}({numTicks:this.num_ticks,tickDegrees:this.tick_degrees,radius:this._radius,outerRadius:this._outerRadius,innerRadius:this._innerRadius,offsetDegrees:this._offsetDegrees},this._computeTickRange())}_renderRingLabels(){const t=this._radius,e=this._outerRadius+(this._innerRadius-this._outerRadius)/2,i=(i,r=0)=>{const s=pe(i,this.min_temp,this.max_temp),o=this.tick_degrees*(s-this.min_temp)/(this.max_temp-this.min_temp)-this._offsetDegrees+r,n=le([t,e],o,[t,t]);return{x:n[0],y:n[1]}},r=e=>{const i=ce(pe(e,this.min_temp,this.max_temp),this.min_temp,this.max_temp,this.num_ticks)*(this.tick_degrees/this.num_ticks)-this._offsetDegrees,r=this._outerRadius,s=this._innerRadius-this._outerRadius,o=this._innerRadius+Math.round(.6*s),n=he(de([[t-.0125*t,r],[t+.0125*t,r],[t+.0125*t,o],[t-.0125*t,o]],i,[t,t]));return yt`
        <path d=${n} class="dial-pointer" />
      `},s=[];if(this.editing)if(this.dual&&null!==this.target_temp_low&&null!==this.target_temp_high){let t;t=this.current_temperature<this.target_temp_low?-8:(this.current_temperature,this.target_temp_high,8);const e=i(this.current_temperature,t);s.push(yt`
          ${r(this.target_temp_low)}
          ${r(this.target_temp_high)}
          <text x=${e.x} y=${e.y} class="dial-text dial-ring-label">${this._superscript(this.current_temperature)}</text>
        `)}else if(null!==this.temperature){const t=this.current_temperature<=this.temperature?-8:8,e=i(this.current_temperature,t);s.push(yt`
          ${r(this.temperature)}
          <text x=${e.x} y=${e.y} class="dial-text dial-ring-label">${this._superscript(this.current_temperature)}</text>
        `)}else{const t=i(this.current_temperature,-8);s.push(yt`
          <text x=${t.x} y=${t.y} class="dial-text dial-ring-label">${this._superscript(this.current_temperature)}</text>
        `)}else if(this.dual&&null!==this.target_temp_low&&null!==this.target_temp_high){let t,e;"heating"===this.hvac_action?(t=8,e=8):"cooling"===this.hvac_action?(t=-8,e=-8):(t=-8,e=8);const o=i(this.target_temp_low,t),n=i(this.target_temp_high,e);s.push(yt`
          ${r(this.current_temperature)}
          <text x=${o.x} y=${o.y} class="dial-text dial-ring-label">${this._superscript(this.target_temp_low)}</text>
          <text x=${n.x} y=${n.y} class="dial-text dial-ring-label">${this._superscript(this.target_temp_high)}</text>
        `)}else if(null!==this.temperature){const t=this.temperature>=this.current_temperature?8:-8,e=i(this.temperature,t);s.push(yt`
          ${r(this.current_temperature)}
          <text x=${e.x} y=${e.y} class="dial-text dial-ring-label">${this._superscript(this.temperature)}</text>
        `)}return yt`<g class="dial-ring-labels">${s}</g>`}_superscript(t){const e=Math.round(10*t)/10,i=Math.floor(e),r=Math.round(10*(e-i));return this.target_temp_step<1?yt`${i}<tspan font-size="12" dy="5">.${r}</tspan>`:yt`${i}`}_renderCenter(){const t=this._radius;return this.dual&&this.editing?yt`
        <g class="dial-center">
          <text x=${t} y=${t} class="dial-text dial-text--ambient">
            ${this._renderTempText(this.current_temperature)}
          </text>
          <text x=${t-t/3} y=${t} class="dial-text dial-text--low">
            ${this._renderTempTextSmall(this.target_temp_low)}
          </text>
          <text x=${t+t/3} y=${t} class="dial-text dial-text--high">
            ${this._renderTempTextSmall(this.target_temp_high)}
          </text>
        </g>
      `:yt`
      <g class="dial-center">
        ${this.status_text&&!this.editing?yt`
          <text x=${t} y=${t-.35*t} class="dial-text dial-text--status">${this.status_text.length>16?`${this.status_text.substring(0,14)}…`:this.status_text}</text>
        `:""}
        <text x=${t} y=${t} class="dial-text dial-text--ambient">
          ${this._renderTempText(this.current_temperature)}
        </text>
        ${null!==this.temperature?yt`
          <text x=${t} y=${t} class="dial-text dial-text--target">
            ${this._renderTempText(this.temperature)}
          </text>
        `:""}
      </g>
    `}_renderTempText(t){const e=Math.round(10*t)/10,i=Math.floor(e),r=Math.round(10*(e-i));return this.target_temp_step<1?yt`${i}<tspan font-size="40" dy="30">.${r}</tspan>`:yt`${i}`}_renderTempTextSmall(t){const e=Math.round(10*t)/10,i=Math.floor(e),r=Math.round(10*(e-i));return this.target_temp_step<1?yt`${i}<tspan font-size="22" dy="16">.${r}</tspan>`:yt`${i}`}_renderIndicators(){const t=this._radius,e=this._getPresetIcon(),i="dial-preset"+(!this.editing&&this.show_preset_indicator&&null!==this.preset_mode&&"none"!==this.preset_mode&&null!==e?" dial-preset--visible":""),r=t/5/24,s=t-24*r/2,o=t+.32*t,n=t/87,a=24*n,l=t-a/2,d=this.diameter-a-.05*t,h=t/87,c=24*h,p=t-c/2,u=this.diameter-c-.05*t;return yt`
      <g>
        ${null!==e?yt`
          <path
            d=${e}
            class=${i}
            transform="translate(${s}, ${o}) scale(${r})"
          />
        `:""}
        ${this.show_power_toggle?yt`
            <g class="dial-power ${this.editing?"dial-power--hidden":""}" @click=${this._handlePowerClick}>
              <rect
                x=${l}
                y=${d}
                width=${a}
                height=${a}
                fill="transparent"
              />
              <path
                d=${"M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"}
                transform="translate(${l}, ${d}) scale(${n})"
              />
            </g>
            <path
              d=${"M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"}
              class="dial-thermo ${this.editing?"dial-thermo--visible":""}"
              transform="translate(${p}, ${u}) scale(${h})"
            />
          `:""}
      </g>
    `}_getPresetIcon(){var t,e;if(!this.preset_mode||"none"===this.preset_mode)return null;const i={eco:"M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z",away:"M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22L6.66,19.7C7.14,19.87,7.64,20,8,20C19,20,22,3,22,3C21,5,14,5.25,9,6.25C4,7.25,2,11.5,2,13.5C2,15.5,3.75,17.25,3.75,17.25C7,8,17,8,17,8Z",home:"M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",sleep:"M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87,20.69,17.05,20.16,17.8C19.84,18.25,19.5,18.67,19.08,19.07C15.17,23,8.84,23,4.94,19.07C1.03,15.17,1.03,8.83,4.94,4.93C5.34,4.53,5.76,4.17,6.21,3.85C6.96,3.32,8.14,4.21,8.06,5.04C7.79,7.9,8.75,10.87,10.95,13.06C13.14,15.26,16.1,16.22,18.97,15.95Z",boost:"M17.66,11.2C17.43,10.9,17.15,10.64,16.89,10.38C16.22,9.78,15.46,9.35,14.82,8.72C13.33,7.26,13,4.85,13.95,3C13,3.23,12.17,3.75,11.46,4.32C8.87,6.4,7.85,10.07,9.07,13.22C9.11,13.32,9.15,13.42,9.15,13.55C9.15,13.77,9,13.97,8.8,14.05C8.57,14.15,8.33,14.09,8.14,13.93C8.08,13.88,8.04,13.83,8,13.76C6.87,12.33,6.69,10.28,7.45,8.64C5.78,10,4.87,12.3,5,14.47C5.06,14.97,5.12,15.47,5.29,15.97C5.43,16.57,5.7,17.17,6,17.7C7.08,19.43,8.95,20.67,10.96,20.92C13.1,21.19,15.39,20.8,16.89,19.32C18.55,17.68,19.15,15.15,18.43,12.97L18.3,12.66C18.1,12.16,17.83,11.68,17.66,11.2Z",comfort:"M12,7A5,5,0,1,0,17,12,5,5,0,0,0,12,7ZM12,2L14.39,5.42C13.65,5.15,12.84,5,12,5S10.36,5.15,9.61,5.42ZM3.34,7L7.5,6.65A6.86,6.86,0,0,0,5.42,9.61ZM3.34,17L5.42,14.39A6.86,6.86,0,0,0,7.5,17.35ZM12,22L9.61,18.58C10.36,18.85,11.16,19,12,19S13.65,18.85,14.39,18.58ZM20.66,17L16.5,17.35A6.86,6.86,0,0,0,18.58,14.39ZM20.66,7L18.58,9.61A6.86,6.86,0,0,0,16.5,6.65Z",activity:"M12,4A4,4,0,1,1,8,8,4,4,0,0,1,12,4ZM12,14C7.58,14,4,15.79,4,18V20H20V18C20,15.79,16.42,14,12,14Z"};var r;return(null===(t=this._presetIcons)||void 0===t?void 0:t[this.preset_mode])?null!==(r=i[this._presetIcons[this.preset_mode]])&&void 0!==r?r:null:null!==(e=i[this.preset_mode])&&void 0!==e?e:null}_renderControls(){const t=this._radius,e=t/3,i=t/3;return this.dual?yt`
        <g class="dial-controls">
          ${this._renderChevron(t-t/3,t-i,0,.7*e,"low-up")}
          ${this._renderChevron(t-t/3,t+i,180,.7*e,"low-down")}
          ${this._renderChevron(t+t/3,t-i,0,.7*e,"high-up")}
          ${this._renderChevron(t+t/3,t+i,180,.7*e,"high-down")}
        </g>
      `:yt`
      <g class="dial-controls">
        ${this._renderChevron(t,t-i,0,e,"target-up")}
        ${this._renderChevron(t,t+i,180,e,"target-down")}
      </g>
    `}_renderChevron(t,e,i,r,s){const o=r/2,n=`M${-o},0 L0,${-(.3*r)} L${o},0`,a=1.2*r;return yt`
      <g
        class="dial-chevron"
        data-id=${s}
        transform="translate(${t}, ${e}) rotate(${i})"
        @click=${this._handleChevronClick}
      >
        <rect
          x=${-a/2}
          y=${-a/2}
          width=${a}
          height=${a}
          fill="transparent"
        />
        <path d=${n} />
      </g>
    `}_handleDialClick(t){if(this.readonly)return;if(this._didPointerInteract)return void(this._didPointerInteract=!1);const e=t.target;e.closest(".dial-power")||e.closest(".dial-chevron")||this.editing||this._interaction.enterEditMode()}_handleLongPress(t){t.preventDefault(),this.dispatchEvent(new CustomEvent("more-info",{bubbles:!0,composed:!0}))}_handleChevronClick(t){t.stopPropagation();const e=t.currentTarget.dataset.id;if(e)switch(e){case"target-up":this._interaction.adjustTarget(1);break;case"target-down":this._interaction.adjustTarget(-1);break;case"low-up":this._interaction.adjustLow(1);break;case"low-down":this._interaction.adjustLow(-1);break;case"high-up":this._interaction.adjustHigh(1);break;case"high-down":this._interaction.adjustHigh(-1)}}_handlePowerClick(t){this.readonly||(t.stopPropagation(),this.dispatchEvent(new CustomEvent("toggle",{bubbles:!0,composed:!0})))}_handlePointerDown(t){if(this.readonly)return;if(!this.editing)return;const e=this._pointerToTemperature(t);null!==e&&(this._dragging=!0,this._didPointerInteract=!0,this._interaction.pauseTimer(),t.target.setPointerCapture(t.pointerId),this._setTemperatureFromRing(e),t.preventDefault())}_handlePointerMove(t){if(!this._dragging)return;const e=this._pointerToTemperature(t);null!==e&&(this._setTemperatureFromRing(e),t.preventDefault())}_handlePointerUp(t){this._dragging&&(this._dragging=!1,t.target.releasePointerCapture(t.pointerId),this._interaction.resumeTimer())}_pointerToTemperature(t){var e;const i=null===(e=this.shadowRoot)||void 0===e?void 0:e.querySelector("svg");if(!i)return null;const r=i.getBoundingClientRect(),s=this._radius,o=this.diameter/r.width,n=this.diameter/r.height,a=(t.clientX-r.left)*o-s,l=(t.clientY-r.top)*n-s;if(Math.sqrt(a*a+l*l)<.5*s)return null;let d=Math.atan2(-a,l)*(180/Math.PI);d<0&&(d+=360);const h=360-this.tick_degrees;if(d>360-h/2||d<h/2)return null;const c=(d-h/2)/this.tick_degrees,p=this.min_temp+c*(this.max_temp-this.min_temp);return pe(Math.round(p/this.target_temp_step)*this.target_temp_step,this.min_temp,this.max_temp)}_setTemperatureFromRing(t){var e,i;if(this.dual)if(Math.abs(t-(null!==(e=this.target_temp_low)&&void 0!==e?e:this.min_temp))<Math.abs(t-(null!==(i=this.target_temp_high)&&void 0!==i?i:this.max_temp))){var r;const e=(null!==(r=this.target_temp_high)&&void 0!==r?r:this.max_temp)-this.idle_zone;this.target_temp_low=pe(t,this.min_temp,e)}else{var s;const e=(null!==(s=this.target_temp_low)&&void 0!==s?s:this.min_temp)+this.idle_zone;this.target_temp_high=pe(t,e,this.max_temp)}else this.temperature=t;this.requestUpdate()}_computeTickRange(){const t=pe(ce(this.current_temperature,this.min_temp,this.max_temp,this.num_ticks),0,this.num_ticks-1);let e,i;const r=[];if(this.dual&&null!==this.target_temp_low&&null!==this.target_temp_high){const s=pe(ce(this.target_temp_low,this.min_temp,this.max_temp,this.num_ticks),0,this.num_ticks-1),o=pe(ce(this.target_temp_high,this.min_temp,this.max_temp,this.num_ticks),0,this.num_ticks-1);this.editing?r.push(t,s,o):r.push(s,o),s>t?(e=t,i=s):o<t&&(e=o,i=t)}else if(null!==this.temperature){const s=pe(ce(this.temperature,this.min_temp,this.max_temp,this.num_ticks),0,this.num_ticks-1);this.editing?r.push(t):r.push(s),s>t?(e=t,i=s):s<t&&(e=s,i=t)}return{from:e,to:i,largeIndices:r,predicted:this.editing}}},ue.styles=_e,ue);me([qt({type:Number})],ge.prototype,"current_temperature",void 0),me([qt({type:Number})],ge.prototype,"temperature",void 0),me([qt({type:Number})],ge.prototype,"target_temp_low",void 0),me([qt({type:Number})],ge.prototype,"target_temp_high",void 0),me([qt({type:Number})],ge.prototype,"min_temp",void 0),me([qt({type:Number})],ge.prototype,"max_temp",void 0),me([qt({type:Number})],ge.prototype,"target_temp_step",void 0),me([qt({type:String})],ge.prototype,"hvac_action",void 0),me([qt({type:String})],ge.prototype,"hvac_mode",void 0),me([qt({type:String})],ge.prototype,"preset_mode",void 0),me([qt({type:Number})],ge.prototype,"diameter",void 0),me([qt({type:Number})],ge.prototype,"num_ticks",void 0),me([qt({type:Number})],ge.prototype,"tick_degrees",void 0),me([qt({type:Number})],ge.prototype,"pending",void 0),me([qt({type:Number})],ge.prototype,"idle_zone",void 0),me([qt({type:Boolean})],ge.prototype,"show_ticks",void 0),me([qt({type:Boolean})],ge.prototype,"show_power_toggle",void 0),me([qt({type:Boolean})],ge.prototype,"show_preset_indicator",void 0),me([qt({type:Boolean})],ge.prototype,"readonly",void 0),me([qt({type:String,reflect:!0})],ge.prototype,"theme",void 0),me([qt({type:Object})],ge.prototype,"colors",void 0),me([qt({type:Object})],ge.prototype,"_presetIcons",void 0),me([qt({type:String})],ge.prototype,"status_text",void 0),me([Yt()],ge.prototype,"editing",void 0),ge=me([It("opentherm-thermostat-dial")],ge);var fe,ve={normal:"mdi:home-thermometer-outline",home:"mdi:home-thermometer-outline",eco:"mdi:leaf",away:"mdi:car-side",holiday:"mdi:beach",sleep:"mdi:power-sleep",boost:"mdi:fire"},ye=class extends Dt{static getConfigForm(){return{schema:[{name:"entity",required:!0,selector:{entity:{domain:"climate"}}},{name:"name",selector:{text:{}}},{type:"grid",name:"",flatten:!0,schema:[{name:"theme",selector:{select:{options:Object.keys(ne),mode:"dropdown"}}},{name:"step",selector:{number:{min:.5,max:5,step:.5,mode:"box"}}},{name:"pending",selector:{number:{min:1,max:30,step:1,mode:"box"}}}]},{name:"ambient_temperature",selector:{entity:{domain:"sensor"}}},{name:"status_entity",selector:{entity:{domain:["sensor","input_text"]}}},{type:"grid",name:"",flatten:!0,schema:[{name:"hide_name",selector:{boolean:{}}},{name:"readonly",selector:{boolean:{}}},{name:"show_power_toggle",selector:{boolean:{}}},{name:"show_preset_indicator",selector:{boolean:{}}}]},{type:"grid",name:"",flatten:!0,schema:[{name:"dhw_entity",selector:{entity:{domain:["binary_sensor","switch"]}}},{name:"window_entity",selector:{entity:{domain:"binary_sensor"}}},{name:"mode_select_entity",selector:{entity:{domain:"select"}}}]}],computeLabel:t=>{var e;const i=document.documentElement.lang||"en";return null!==(e=x(`editor_${t.name}`,i))&&void 0!==e?e:t.name}}}static getStubConfig(t){return{entity:(t?Object.keys(t.states).filter(t=>t.startsWith("climate.")):[])[0]||"climate.thermostat"}}setConfig(t){if(!(null==t?void 0:t.entity))throw new Error("Entity is required");this._config=Kt(Kt({},i),t)}getCardSize(){return 6}getGridOptions(){return{columns:6,min_columns:3}}shouldUpdate(t){var e;return!!this._config&&[this._config.entity,this._config.dhw_entity,this._config.window_entity,this._config.mode_select_entity,...null!==(e=this._config.problem_entities)&&void 0!==e?e:[]].filter(t=>!!t).some(e=>function(t,e,i){var r;if(e.has("_config"))return!0;const s=e.get("hass");return!s||s.states[i]!==(null===(r=t.hass)||void 0===r?void 0:r.states[i])}(this,t,e))}render(){var t,e,i,r,s,o,n,a,l,d,h,c,p,u,_;if(!this.hass||!this._config)return vt``;const m=this.hass.states[this._config.entity];if(!m)return vt`
        <ha-card>
          <div class="warning">Entity not found: ${this._config.entity}</div>
        </ha-card>
      `;const g=m.attributes;let f=g.current_temperature;if(this._config.ambient_temperature){const t=this.hass.states[this._config.ambient_temperature];t&&(f=parseFloat(t.state))}const v=g.hvac_action||m.state,y=m.state,$=g.preset_mode||null,b=null!==(t=g.temperature)&&void 0!==t?t:null,w=null!==(e=g.target_temp_low)&&void 0!==e?e:null,x=null!==(i=g.target_temp_high)&&void 0!==i?i:null,A=null!==(r=null!==(s=this._config.range_min)&&void 0!==s?s:g.min_temp)&&void 0!==r?r:7,C=null!==(o=null!==(n=this._config.range_max)&&void 0!==n?n:g.max_temp)&&void 0!==o?o:35,k=null!==(a=null!==(l=this._config.step)&&void 0!==l?l:g.target_temp_step)&&void 0!==a?a:.5,E=this._config.hide_name||!1===this._config.name?"":null!==(d=null!==(h=this._config.name)&&void 0!==h?h:g.friendly_name)&&void 0!==d?d:"";return vt`
      <ha-card>
        ${E?vt`<div class="card-title">${E}</div>`:""}
        <opentherm-thermostat-dial
          .current_temperature=${f}
          .temperature=${b}
          .target_temp_low=${w}
          .target_temp_high=${x}
          .min_temp=${A}
          .max_temp=${C}
          .target_temp_step=${k}
          .hvac_action=${v}
          .hvac_mode=${y}
          .preset_mode=${$}
          .diameter=${this._config.diameter}
          .num_ticks=${this._config.num_ticks}
          .tick_degrees=${this._config.tick_degrees}
          .pending=${this._config.pending}
          .idle_zone=${this._config.idle_zone}
          .show_ticks=${null===(c=this._config.show_ticks)||void 0===c||c}
          .show_power_toggle=${null===(p=this._config.show_power_toggle)||void 0===p||p}
          .show_preset_indicator=${null===(u=this._config.show_preset_indicator)||void 0===u||u}
          .readonly=${null!==(_=this._config.readonly)&&void 0!==_&&_}
          .theme=${this._config.theme}
          .colors=${this._config.colors}
          ._presetIcons=${this._config.preset_icons}
          .status_text=${this._resolveStatusText()}
          @temperature-changed=${this._handleTemperatureChanged}
          @toggle=${this._handleToggle}
          @more-info=${this._handleMoreInfo}
        ></opentherm-thermostat-dial>
        ${this._renderBadges()}
        ${this._renderModeChips()}
      </ha-card>
    `}_renderBadges(){var t,e;const i=this._config;if(!i.dhw_entity&&!i.window_entity&&!(null===(t=i.problem_entities)||void 0===t?void 0:t.length))return"";const r=!!i.dhw_entity&&this._isOn(i.dhw_entity),s=!!i.window_entity&&this._isOn(i.window_entity),o=(null!==(e=i.problem_entities)&&void 0!==e?e:[]).some(t=>this._isOn(t));return vt`
      <div class="badges">
        ${i.dhw_entity?vt`
          <div class="badge ${r?"badge--active":""}" @click=${this._handleDhwClick} title="Hot water">
            <ha-icon icon="mdi:water-boiler"></ha-icon>
          </div>
        `:""}
        ${i.window_entity?vt`
          <div class="badge ${s?"badge--warn":""}" title="Window">
            <ha-icon icon=${s?"mdi:window-open-variant":"mdi:window-closed-variant"}></ha-icon>
          </div>
        `:""}
        ${o?vt`
          <div class="badge badge--error" title="Problem detected">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
          </div>
        `:""}
      </div>
    `}_handleDhwClick(){const t=this._config;if(!t.dhw_entity)return;const e=this.hass.states[t.dhw_entity];if(!e||!t.dhw_entity.startsWith("switch."))return;const i="on"===e.state?"turn_off":"turn_on";this.hass.callService("switch",i,{entity_id:t.dhw_entity})}_isOn(t){var e;return"on"===(null===(e=this.hass.states[t])||void 0===e?void 0:e.state)}_renderModeChips(){var t;const e=this._config;if(!e.mode_select_entity)return"";const i=this.hass.states[e.mode_select_entity];if(!i)return"";const r=null!==(t=i.attributes.options)&&void 0!==t?t:[];if(!r.length)return"";const s=i.state;return vt`
      <div class="mode-chips">
        ${r.map(t=>{var i,r,o;const n=null!==(i=null!==(r=null===(o=e.mode_icons)||void 0===o?void 0:o[t])&&void 0!==r?r:ve[t.toLowerCase()])&&void 0!==i?i:"mdi:circle-outline";return vt`
            <button
              class="mode-chip ${t===s?"mode-chip--active":""}"
              @click=${()=>this._handleModeSelect(t)}
              title=${t}
            >
              <ha-icon icon=${n}></ha-icon>
              <span>${t}</span>
            </button>
          `})}
      </div>
    `}_handleModeSelect(t){const e=this._config;e.mode_select_entity&&this.hass.callService("select","select_option",{entity_id:e.mode_select_entity,option:t})}_handleTemperatureChanged(t){const e=t.detail;void 0!==e.temperature?this.hass.callService("climate","set_temperature",{entity_id:this._config.entity,temperature:e.temperature}):void 0!==e.target_temp_low&&this.hass.callService("climate","set_temperature",{entity_id:this._config.entity,target_temp_low:e.target_temp_low,target_temp_high:e.target_temp_high})}_handleToggle(){const t="off"===this.hass.states[this._config.entity].state?"turn_on":"turn_off";this.hass.callService("climate",t,{entity_id:this._config.entity})}_handleMoreInfo(){const t=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:this._config.entity}});this.dispatchEvent(t)}_resolveStatusText(){if(!this._config.status_entity)return null;const t=this.hass.states[this._config.status_entity];if(!t)return null;const e=t.state;return e&&"unknown"!==e&&"unavailable"!==e?e:null}static get styles(){return j`
      ha-card {
        padding: 16px;
        overflow: hidden;
      }
      .card-title {
        font-size: 1.2em;
        color: var(--secondary-text-color);
        text-align: center;
        padding-bottom: 8px;
        font-weight: 400;
      }
      .warning {
        padding: 16px;
        color: var(--error-color);
      }

      /* --- Badges row: hot water / window / problem --- */
      .badges {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 12px;
      }
      .badge {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--secondary-background-color, #2a2a2a);
        color: var(--secondary-text-color, #888);
        transition: background 0.2s ease, color 0.2s ease;
      }
      .badge ha-icon {
        --mdc-icon-size: 18px;
      }
      .badge--active {
        background: color-mix(in srgb, #29b6f6 25%, var(--secondary-background-color, #2a2a2a));
        color: #29b6f6;
        cursor: pointer;
      }
      .badge--warn {
        background: color-mix(in srgb, #ffa726 25%, var(--secondary-background-color, #2a2a2a));
        color: #ffa726;
      }
      .badge--error {
        background: color-mix(in srgb, #f44336 25%, var(--secondary-background-color, #2a2a2a));
        color: #f44336;
      }

      /* --- Mode chips row --- */
      .mode-chips {
        display: flex;
        gap: 6px;
        margin-top: 12px;
      }
      .mode-chip {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 6px 2px;
        border-radius: 10px;
        border: none;
        background: var(--secondary-background-color, #2a2a2a);
        color: var(--secondary-text-color, #888);
        font-size: 0.65rem;
        cursor: pointer;
        transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
      }
      .mode-chip ha-icon {
        --mdc-icon-size: 18px;
      }
      .mode-chip--active {
        background: var(--primary-color, #03a9f4);
        color: var(--text-primary-color, #fff);
        transform: translateY(-1px);
      }
      .mode-chip:active {
        transform: scale(0.95);
      }
    `}};me([qt({attribute:!1})],ye.prototype,"hass",void 0),me([Yt()],ye.prototype,"_config",void 0),ye=me([It("opentherm-thermostat-dial-card")],ye),console.info("%c OPENTHERM-THERMOSTAT-DIAL-CARD %c v1.0.0 ","color: white; background: #555; font-weight: 700;","color: white; background: #e36304; font-weight: 700;");var $e=null!==(fe=window.customCards)&&void 0!==fe?fe:[];window.customCards=$e,$e.push({type:"opentherm-thermostat-dial-card",name:x("card_name"),description:x("card_description"),preview:!0});