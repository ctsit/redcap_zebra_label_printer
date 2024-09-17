(()=>{"use strict";var e={972:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.API_URL=void 0,t.API_URL="http://localhost:9100/"},13:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(i,a){function s(e){try{c(n.next(e))}catch(e){a(e)}}function o(e){try{c(n.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,o)}c((n=n.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var r,n,i,a,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return a={next:o(0),throw:o(1),return:o(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function o(a){return function(o){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(i=2&a[0]?n.return:a[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,a[1])).done)return i;switch(n=0,i&&(a=[2&a[0],i.value]),a[0]){case 0:case 1:i=a;break;case 4:return s.label++,{value:a[1],done:!1};case 5:s.label++,n=a[1],a=[0];continue;case 7:a=s.ops.pop(),s.trys.pop();continue;default:if(!((i=(i=s.trys).length>0&&i[i.length-1])||6!==a[0]&&2!==a[0])){s=0;continue}if(3===a[0]&&(!i||a[1]>i[0]&&a[1]<i[3])){s.label=a[1];break}if(6===a[0]&&s.label<i[1]){s.label=i[1],i=a;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(a);break}i[2]&&s.ops.pop(),s.trys.pop();continue}a=t.call(e,s)}catch(e){a=[6,e],n=0}finally{r=i=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,o])}}};Object.defineProperty(t,"__esModule",{value:!0});var a=r(972);t.default=function(){var e=this;this.device={},this.getAvailablePrinters=function(){return n(e,void 0,void 0,(function(){var e,t,r,n;return i(this,(function(i){switch(i.label){case 0:e={method:"GET",headers:{"Content-Type":"text/plain;charset=UTF-8"}},t=a.API_URL+"available",i.label=1;case 1:return i.trys.push([1,4,,5]),[4,fetch(t,e)];case 2:return[4,i.sent().json()];case 3:return(r=i.sent())&&void 0!==r&&r.printer&&void 0!==r.printer&&r.printer.length>0?[2,r.printer]:[2,new Error("No printers available")];case 4:throw n=i.sent(),new Error(n);case 5:return[2]}}))}))},this.getDefaultPrinter=function(){return n(e,void 0,void 0,(function(){var e,t,r,n,s,o,c,u,l,h,d;return i(this,(function(i){switch(i.label){case 0:e={method:"GET",headers:{"Content-Type":"text/plain;charset=UTF-8"}},t=a.API_URL+"default",i.label=1;case 1:return i.trys.push([1,4,,5]),[4,fetch(t,e)];case 2:return[4,i.sent().text()];case 3:if((r=i.sent())&&void 0!==r&&"object"!=typeof r&&7===r.split("\n\t").length)return n=r.split("\n\t"),s=this.cleanUpString(n[1]),o=this.cleanUpString(n[2]),c=this.cleanUpString(n[3]),u=this.cleanUpString(n[4]),l=this.cleanUpString(n[5]),h=this.cleanUpString(n[6]),[2,{connection:c,deviceType:o,manufacturer:h,name:s,provider:l,uid:u,version:0}];throw new Error("There's no default printer");case 4:throw d=i.sent(),new Error(d);case 5:return[2]}}))}))},this.setPrinter=function(t){e.device=t},this.getPrinter=function(){return e.device},this.cleanUpString=function(e){return e.split(":")[1].trim()},this.checkPrinterStatus=function(){return n(e,void 0,void 0,(function(){var e,t,r,n,a,s,o;return i(this,(function(i){switch(i.label){case 0:return[4,this.write("~HQES")];case 1:return i.sent(),[4,this.read()];case 2:switch(e=i.sent(),t=[],n=e.charAt(70),a=e.charAt(88),s=e.charAt(87),o=e.charAt(84),r="0"===n,a){case"1":t.push("Paper out");break;case"2":t.push("Ribbon Out");break;case"4":t.push("Media Door Open");break;case"8":t.push("Cutter Fault")}switch(s){case"1":t.push("Printhead Overheating");break;case"2":t.push("Motor Overheating");break;case"4":t.push("Printhead Fault");break;case"8":t.push("Incorrect Printhead")}return"1"===o&&t.push("Printer Paused"),r||0!==t.length||t.push("Error: Unknown Error"),[2,{isReadyToPrint:r,errors:t.join()}]}}))}))},this.write=function(t){return n(e,void 0,void 0,(function(){var e,r,n,s;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,3]),e=a.API_URL+"write",r={device:this.device,data:t},n={method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(r)},[4,fetch(e,n)];case 1:return i.sent(),[3,3];case 2:throw s=i.sent(),new Error(s);case 3:return[2]}}))}))},this.read=function(){return n(e,void 0,void 0,(function(){var e,t,r,n;return i(this,(function(i){switch(i.label){case 0:return i.trys.push([0,3,,4]),e=a.API_URL+"read",t={device:this.device},r={method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(t)},[4,fetch(e,r)];case 1:return[4,i.sent().text()];case 2:return[2,i.sent()];case 3:throw n=i.sent(),new Error(n);case 4:return[2]}}))}))},this.print=function(t){return n(e,void 0,void 0,(function(){var e;return i(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this.write(t)];case 1:return r.sent(),[3,3];case 2:throw e=r.sent(),new Error(e);case 3:return[2]}}))}))}}}},t={};function r(n){var i=t[n];if(void 0!==i)return i.exports;var a=t[n]={exports:{}};return e[n].call(a.exports,a,a.exports,r),a.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var n=r(13),i=r.n(n);const a=ExternalModules.TLG.ExternalModule;$(document).ready((function(){const e=a,t="gen-bio-labels",{tagId:r,hasMultipleTags:n,tubeLabelGenFieldId:i,ptidFieldId:u,visitNumFieldId:l}=e.tt("emData");n&&alert(`Multiple fields on this form have the ${r} tag. The button will only be applied to the first field.`);const h=$(`#${i}-tr > td:nth-child(2)`),d=$(`#${u}-tr td:nth-child(2) input`),p=$(`#${l}-tr td:nth-child(2) input`);h.append($("<button />").html("Generate biospecimen labels").css({"margin-top":"5px"}).attr({type:"button",id:t,class:"btn btn-info btn-sm"}).prop("disabled",!0));const f=$(`#${t}`),b=()=>{d.val()&&p.val()?f.prop("disabled",!1):f.prop("disabled",!0)};d.on("input",(()=>b())),p.on("input",(()=>b())),b(),f.on("click",(async()=>{try{const e=d.val(),t=p.val(),r=await a.ajax("generateTubeLabels",{ptid:e,visit_num:t}),n=JSON.parse(r).map((e=>s(e.ptid,e.type,e.barcode_str))).join("");await c(n)||(alert("Printing failed. Downloading the label ZPL file..."),o(n))}catch(e){console.error("Error generating labels:",e)}}))}));const s=(e,t,r)=>`^XA^PW380^LL192^FO26,30^A0N,30,24^FD${r}^FS^FO32,60^BQN,2,2,Q,7^FDQA,${r}^FS^FO98,90^A0N,30,24^FD${e} ${t}^FS^FO315,45^BQN,2,2,Q,1^FDQA,${r}^FS^XZ`,o=e=>{const t=new Blob([e],{type:"text/plain"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download="biospecimen_tube_labels.zpl",document.body.appendChild(n),n.click(),document.body.removeChild(n)},c=async e=>{try{const t=new(i()),r=await t.getDefaultPrinter();if(!r)return alert("Please connect to a Zebra printer and try again."),!1;t.setPrinter(r);const n=await t.checkPrinterStatus();return n.isReadyToPrint?(alert("Printing labels..."),await t.print(e),!0):(console.error("Printer error(s):",n.errors),alert("Printer is not ready to print. Please check the printer and try again."),!1)}catch(e){return console.error("Printing failed:",e),!1}}})();