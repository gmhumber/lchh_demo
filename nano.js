/*
Nano Ajax Library
(c) Schien Dong, Antradar Software Inc.

License: www.antradar.com/license.php
Documentation: www.antradar.com/docs-nano-ajax-manual

Warning: this copy of Nano Ajax Library is modified for running in Gyroscope. Use the public version for general purpose applications.

ver g4.5
*/

function gid(d){return document.getElementById(d);}

function hb(){var now=new Date(); var hb=now.getTime();return hb;}

function ajxb(u,data,callback,myhb){
	var method='POST';
	if (data==null) method='GET';
	
	if (document.wssid) u=u+'&wssid_='+document.wssid;
	
	var rq=xmlHTTPRequestObject();
	if (myhb==null) myhb=hb();
	rq.open(method, u+'&hb='+myhb,false);
	rq.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
	rq.send(data);
	if (callback) callback(rq);
	return rq.responseText;	
}

function ajxnb(rq,u,f,data){
	if (document.wssid) u=u+'&wssid_='+document.wssid;	
	rq.onreadystatechange=f;
	var method='POST'; if (!data) method='GET';
	rq.open(method,u+'&hb='+hb(),true);
	rq.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
	rq.send(data);  	
}

function reajxpgn(c,p){
	var ct=gid(c);
	if (ct==null) return;
	if (!ct.reloadparams) {
		if (p) reajxpgn(p); else console.warn('reload params not set');
		return;
	}
	ajxpgn(c,ct.reloadparams.u,ct.reloadparams.d,ct.reloadparams.e,ct.reloadparams.data,ct.reloadparams.callack,ct.reloadparams.slowtimer,ct.reloadparams.runonce);		
}

function cancelgswi(ct){
	if (ct.gswi){
		if (ct.gswi.parentNode) ct.gswi.parentNode.removeChild(ct.gswi);
		ct.style.opacity=''; ct.style.alpha=''; ct.style.color='';
		ct.gswi=null;
	}	
}

function ajxpgn(c,u,d,e,data,callback,slowtimer,runonce,gskey){
	var ct=gid(c);
	if (ct==null) return;
	if (runonce&&ct.reqobj!=null) return;
	
	ct.reloadparams={u:u,d:d,e:e,data:data,callback:callback,slowtimer:slowtimer,runonce:runonce};
	
	if (document.wssid) u=u+'&wssid_='+document.wssid;
	
  if (gskey!=null) {
	  //rq.setRequestHeader('X-GSREQ-KEY',gskey);
	  if (data==null) data='X-GSREQ-KEY='+gskey;
	  else data+='&X-GSREQ-KEY='+gskey;
	  
  }
			
	var f=function(c){return function(){
		if (rq.readyState==4){
			
    	    var xtatus=rq.getResponseHeader('X-STATUS');
		    if (rq.status==403||(xtatus|0)==403){
				if (self.skipconfirm) skipconfirm();
				window.location.href='login.php';
				return;
			}

			if (ct.reqobj!=null){
				ct.reqobj=null;
			}

			if (ct.slowtimer) clearTimeout(ct.slowtimer);
			
			cancelgswi(ct);		
			
			if (rq.status==401||(xtatus|0)==401){
				ajxjs(self.showgssubscription,'gssubscriptions.js');
				showgssubscription();
			    return;
			}
				

			var apperror=rq.getResponseHeader('apperror');
			if (apperror!=null&&apperror!=''){
				if (ct.slowtimerorg){ct.innerHTML=ct.slowtimerorg;ct.slowtimerorg=null;}
				var errfunc=rq.getResponseHeader('errfunc');
				if (callback&&typeof(callback)=='object'&&callback.length>0){
					callback[1](errfunc,decodeURIComponent(apperror),rq);					
				} else {
					if (errfunc!=null&&errfunc!=''&&self[errfunc.toLowerCase()]){
						self[errfunc.toLowerCase()](decodeURIComponent(apperror));
					} else alert(decodeURIComponent(apperror));
				}
				
				return;	
			}

			
			if (ct.abortflag) {ct.abortflag=null;return;}
			
			ct.innerHTML=rq.responseText;
			
			if (d) ct.style.display='block';
			
			if (e){
				//supposedly deprecated, nothing to eval here
				
				var i;
				var scripts=gid(c).getElementsByTagName('script');
				for (i=0;i<scripts.length;i++) eval(scripts[i].innerHTML);
				scripts=null;				
				
			}			
			
			if (callback){
				if (typeof(callback)=='object'&&callback.length>0) callback[0](rq); else callback(rq);
			}
		}	  
	}}	
	
	var rq=xmlHTTPRequestObject();
	
	if (ct.reqobj!=null)  {ct.abortflag=1;ct.reqobj.abort();cancelgswi(ct);}
	ct.reqobj=rq;
	if (!slowtimer) slowtimer=800;
	
	ct.slowtimer=setTimeout(function(){

		if (ct.style.display=='none') ct.style.display='block';
		var first=ct.firstChild;
		if (ct.gswi) return;
		var wi=document.createElement('img'); wi.src='imgs/hourglass.gif'; ct.gswi=wi;
		if (gid('statusc')!=ct) wi.style.margin='10px';
		if (first==null) ct.appendChild(wi); else ct.insertBefore(wi,first);
		ct.style.opacity=0.5; ct.style.filter='alpha(50)'; ct.style.color='#999999';
		//ct.innerHTML='<img src="imgs/hourglass.gif" class="hourglass"><span style="opacity:0.5;filter:alpha(opacity=50);color:#999999;">'+ct.innerHTML+'</span>';
	},slowtimer);

	ajxnb(rq,u,f(c),data);
	
}



function ajxcss(f,css,cachekey,killflag){
	if (f==null) {
	  	var csl=document.createElement('link');
		csl.setAttribute('rel','stylesheet');
		csl.setAttribute('type','text/css');
		csl.setAttribute('href',css);
		if (cachekey) csl.setAttribute('id','ajxcss_'+cachekey);
		if (killflag&&gid('ajxcss_'+killflag)){
			gid('ajxcss_'+killflag).parentNode.removeChild(gid('ajxcss_'+killflag));	
		}
		document.getElementsByTagName("head").item(0).appendChild(csl);
	}
}

function xajx(url){
	if (!document.xjs_transport){
		var xjs=document.createElement('div');
		document.body.appendChild(xjs);
		document.xjs_transport=xjs;
	}
	
	var xjs=document.xjs_transport;
	var rq=document.createElement('script');
	rq.setAttribute('src',url);
	xjs.appendChild(rq);
	
	if (xjs.gc) clearTimeout(xjs.gc);
	xjs.gc=setTimeout(function(){
		xjs.innerHTML='';
	},3000);  
}

function ajxjs(f,js){if (f==null) eval(ajxb(js+'?'));} //unsafe

function sajxjs(flag,js){
	if (self[flag]!=null) return;
	var myhb=hb();
	ajxb(js+'?',null,null,myhb);
	xajxjs(flag,js+'?&hb='+myhb,function(){});
}

function xajxjs(strflags,src,callback,defer){
	var flags=strflags.split('.');
	var cur=self[flags[0]];
	var defed=1;
	if (!cur) defed=0;
	for (var i=1;i<flags.length;i++){
		if (cur) cur=cur[flags[i]];
		if (cur==null){defed=0;break;}
	}
	
	if (!defed&&!defer){
		var script=document.createElement('script');
		script.src=src;
		document.body.appendChild(script);
	}
	
	if (!defed) {setTimeout(function(){xajxjs(strflags,src,callback,1);},5);return;}
	callback();
}

function xmlHTTPRequestObject() {
	var obj = false;
	var objs = ["Microsoft.XMLHTTP","Msxml2.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP.4.0"];
	var success = false;
	for (var i=0; !success && i < objs.length; i++) {
		try {
			obj = new ActiveXObject(objs[i]);
			success = true;
		} catch (e) { obj = false; }
	}

	if (!obj) obj = new XMLHttpRequest();
	return obj;
}

function tagobjs(parentid,tags){
	var os=[];
	for (var i=0;i<tags.length;i++){
		var tag=tags[i];
		var oos=gid(parentid).getElementsByTagName(tag);
		for (ii=0;ii<oos.length;ii++) os.push(oos[ii]);
	}
	return os;
	
}

/*
Example:

mapobjevents(
	tagobjs('contactlist',['a','span']),
	{
		'anchor~onclick~showrec':['aid','atitle'],
		'deleter~onclick~delrec':['aid']
	}
);
			
*/
mapobjevents=function(os,ems,sel){
	if (sel==null) sel='atype';
	for (var i=0;i<os.length;i++){
		var o=os[i];
		if (!o.attributes||!o.attributes[sel]) continue;
		for (var k in ems){
			var parts=k.split('~');
			var typ=parts[0];
			if (typ!=o.attributes[sel].value) continue;
			var ev=parts[1];
			var func=parts[2];
			var attrs=ems[k];
			var params=[];
			for (var ii=0;ii<attrs.length;ii++) if (o.attributes[attrs[ii]]) params.push(o.attributes[attrs[ii]].value);
			
			self[func+'_']=function(fc,pms){
				return function(){
					if (self[fc]==null) console.log('Missing funciton: '+fc);
					else {
						if (document.debugevents) console.log(fc,pms); //debug
						self[fc].apply(null,pms);
					}
				}
			}
			params.push(o);
			o[ev]=self[func+'_'](func,params);
		}
		
	}	
}

document.debugevents=0;

function updategyroscope(){
	if (self.loadfs) loadfs('Gyroscope Updates','updategyroscope');
	else ajxpgn('gyroscope_updater',document.appsettings.codepage+'?cmd=updategyroscope',true,true);	
}

function hdpromote(css){
	if (typeof(document.documentElement.style.backgroundSize)=='string'&&window.devicePixelRatio>1){
		ajxcss(self.bgupgrade,css);
	}	
}

function encodeHTML(code){
	if (!self.encodeURIComponent) {alert('Unsupported browser'); return;}
	return encodeURIComponent(code);
}

function showhide(id){
	var d=gid(id);
	if (!d) return;
	if (!d.showing) {
		d.style.display='block';
		d.showing=true;	
	} else {
		d.style.display='none';
		d.showing=null;	
	}
}


