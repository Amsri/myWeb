// 通过id获取元素
function $ (id) {
    return document.getElementById(id);
}

// 通过classname获取元素
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
            classNameStr,
            flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

// 事件监听器
function addEvent(node,event,handler){
    if (!!node.addEventListener){
        node.addEventListener(event,handler,!1);
    }else{
        node.attachEvent('on'+event,handler);
    }
}	

// 设置cookie
function setCookie (name, value, expires) {
	var oDate = new Date();
    oDate.setDate( oDate.getDate() + expires);
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    cookie += '; expires=' + oDate.toGMTString();
    document.cookie = cookie;
}

// 获取cookie
function getCookie (key) {
    var all = document.cookie;
    if (all === '')
        return all;
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var name = list[i].split('=');
        if(name[0] === key ){
            return decodeURI(name[1]);
        }
    }
}

// 移除cookie
function removeCookie (name) {
    setCookie(name,'',-1);
}

//Ajax请求get方法
function get(url,options,callback){
	//参数序列化
	function serialize (data) {
    if (!data) return '';
    var pairs = [];
    for (var name in data){
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
	}
	
	//跨域兼容
	function createCORSRequest(method, url) {  
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) { 
		    xhr.open(method, url, true);  	   
		} else if (typeof XDomainRequest != "undefined") {   
		  xhr = new XDomainRequest();  
		  xhr.open(method, url);  	   
		} else {    
		  xhr = null;  	   
		}  
		return xhr;  
	}
	
	var xhr = createCORSRequest('get', url + '?' + serialize(options));
	if (xhr) {
		xhr.onload = function() {           
            callback(xhr.responseText);            
        }
		xhr.onerror = function() {
	    	alert("request failed : " + xhr.status);
	  	};
		xhr.send();
	}
}
