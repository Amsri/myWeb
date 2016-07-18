
// 关闭顶部通知条
(function attention(){
	var info=$('info');
	var alert=info.getElementsByTagName('p')[1];
	function closeInfo(){
		if(getCookie('close')){
			info.style.display='none';
		}else{
			alert.onclick=function(){
				info.style.display='none';
				setCookie('close',true,1)
			}
		}
	}
	closeInfo();
})();

// 关注“网易教育产品部”/登录
(function login(){
	var login=$('Login');
	var btn=$('btn');
	var concern=$('concern');
	var cancel=getElementsByClassName(concern,'cancel')[0];
	var close=getElementsByClassName(login,'close')[0];
	var form = $('loginForm');
	var input=form.getElementsByTagName('input');
	var label=form.getElementsByTagName('label');
	var submit=form.getElementsByTagName('button')[0];
		
	//查看是否已登录
	addEvent(btn,'click',function(){
		//已登录 关注
		if (getCookie('loginSuc')) {
			get('http://study.163.com/webDev/attention.htm','', function(data){
				if(data==1){
					setCookie('followSuc',true,36500);
					btn.style.display='none';
					concern.style.display='inline-block';
				}
			});			
		} else{
			//未登录显示登录弹窗
			login.style.display='block';
		}
	});
	
	//取消关注
	addEvent(cancel,'click',function(){
		removeCookie('followSuc');
		btn.style.display='';
		concern.style.display='none';
	});	
	
	//关闭登录窗口
	addEvent(close,'click',function(){
		Login.style.display='none';
	});	
	
	// label兼容
	function focus(i){
		//当input获取焦点时，label隐藏
		addEvent(input[i],'focus',function(){
			label[i].style.display='none';
		});
		//当input失去焦点时，如果input框中有内容则label隐藏，如果没有内容则label显示
		addEvent(input[i],'blur',function(){
			label[i].style.display=input[i].value===''?'block':'none';
		});
	}
	focus(0);
	focus(1);	
	
	//登录提交
	addEvent(submit,'click',function(){
		var usnm=hex_md5(input[0].value);
		var pswd=hex_md5(input[1].value);
		get('http://study.163.com/webDev/login.htm',{userName:usnm,password:pswd},function(data){
			if (data==1) {
				setCookie('loginSuc',true,1);
				Login.style.display='none';
				get('http://study.163.com/webDev/attention.htm','', function(data){
				if(data==1){
					setCookie('followSuc',true,36500);
					btn.style.display='none';
					concern.style.display='inline-block';
				}
			});	
			} else{
				alert('匹配用户名密码失败，请重新输入！');
			}
		})
	});
})();

//幻灯片轮播
(function slide(){
	var slide=$('slide');
	var pointer=$('pointer');
	var alink=slide.getElementsByTagName('a')[0];
	var img=slide.getElementsByTagName('img')[0];
	var ali=pointer.getElementsByTagName('li');
	
	var data=[
		{href:'http://open.163.com/',src:'img/banner/banner1.jpg'},
		{href:'http://study.163.com/',src:'img/banner/banner2.jpg'},
		{href:'http://www.icourse163.org/',src:'img/banner/banner3.jpg'}
	];
	var len=data.length;
	
	//初始化
	for(var i=0;i<len;i++){
		var li=document.createElement('li');
		pointer.appendChild(li);
		//点击切换至指定图片
		ali[i].index=i;
		ali[i].onclick =function(){
			num = this.index;
			show(this.index);
		};
	}	
	var num=0;
	alink.href=data[num].href;
	img.src=data[num].src;
	ali[num].className='z-crt';
	
	//500ms淡入
	function fadein (ele) {
	    var stepLength = 1/50;
	    if (parseFloat(ele.style.opacity)) {
	        ele.style.opacity = 0;
	    }
	    function step () {
	        if (parseFloat(ele.style.opacity)+stepLength <1) {
	            ele.style.opacity = parseFloat(ele.style.opacity)+stepLength;
	        } else {
	            ele.style.opacity = 1;
	            clearInterval(setIntervalId);
	        }
	    }
	    var setIntervalId = setInterval(step, 10);
	}
	
	//图片显示
	function show(n){
		for(var i=0;i<len;i++){
			ali[i].className='';
		}		
		alink.href=data[n].href;
		img.src=data[n].src;
		ali[n].className='z-crt';
		fadein(img);
	}
	
	//5s自动切换
	var timer;
	function autoPlay(){		
		function change(){
			num=(num+1)%len;
			show(num);
		}
		timer=setInterval(change, 5000);	
	}
	autoPlay();
	
	//鼠标悬停暂停切换
	addEvent(slide,'mouseover',function(){
		clearInterval(timer);
	});
	
	//鼠标移开继续自动切换
	addEvent(slide,'mouseout',function(){
		autoPlay();
	});	
})();


//左侧内容区tab切换
(function fnTab(){
	var tab=$('tab');
	var tabLi=tab.getElementsByTagName('li');
	var list=$('list');
	var listUl=list.getElementsByTagName('ul');
	
	var page=$('page');
	var prv=getElementsByClassName(page,'prv')[0];
	var nxt=getElementsByClassName(page,'nxt')[0];
	var apage=page.getElementsByTagName('a');
	var plen=apage.length-1;
	
	//获取课程信息
	function getData(pn,tp,ele){
		get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:pn,psize:20,type:tp},function(data){
			var data=JSON.parse(data);
			ele.innerHTML='';
			for (var i=0;i<data.list.length;i++) {
				//课程详情
				var li=document.createElement('li');
				ele.appendChild(li);				
				
				data.list[i].categoryName=data.list[i].categoryName?data.list[i].categoryName:'无';
				data.list[i].price=data.list[i].price==0?'免费':'&yen;'+data.list[i].price;
								
				li.innerHTML=
				'<img src="'+data.list[i].middlePhotoUrl+'" />\
				<p class="name">'+data.list[i].name+'</p>\
				<p class="provider">'+data.list[i].provider+'</p>\
				<span>'+data.list[i].learnerCount+'</span>\
				<strong>'+data.list[i].price+'</strong>\
				<div class="details">\
					<img src="'+data.list[i].middlePhotoUrl+'" />\
					<h3>'+data.list[i].name+'</h3>\
					<span>'+data.list[i].learnerCount+"在学"+'</span>\
					<p class="prom">'+"发布者："+data.list[i].provider+'<br>'+"分类："+data.list[i].categoryName+'</p>\
					<p class="description">'+data.list[i].description+'</p>\
				</div>';
				
			}
		});
	};
		
	//初始设置
	var num=0;
	var pn=1;
		
	//当前选项卡
	function Tab(){
		for (var i=0;i<tabLi.length;i++) {
			tabLi[i].className='';
			listUl[i].style.display='none';
		}
		tabLi[num].className='active';
		listUl[num].style.display='block';
		tp=(num+1)*10;
		getData(pn,tp,listUl[num]);
	}
	Tab();
	
	//点击切换Tab	
	for (var i=0;i<tabLi.length;i++) {
		tabLi[i].index=i;
		tabLi[i].onclick=function(){
			num=this.index;
			Tab();
		}
	}
	
	//翻页器翻页(循环)
	var pageChange={
		//当前页面		
		pageon:function (){
			for (var i=1;i<plen;i++) {
				apage[i].className='';
			}
			apage[pn].className='active';
		},
		
		//跳转指定页面
		change:function(){
			for(var j=1;j<plen;j++){
				apage[j].index=j;
				apage[j].onclick=function(){
					pn=this.index;
					pageChange.pageon();
					getData(pn,tp,listUl[num]);
				}
			};
		},
							
		//前一页
		prvp:function(){
			pn--;
			if(pn==0){pn=plen-1;};			
			pageChange.pageon();
			getData(pn,tp,listUl[num]);
		},
				
		//后一页
		nxtp:function(){
			pn++;
			if(pn==plen){pn=1;};			
			pageChange.pageon();
			getData(pn,tp,listUl[num]);
		}
	};
	
	pageChange.pageon();
	pageChange.change();
	addEvent(prv,'click',function(){
		pageChange.prvp();
	});
	addEvent(nxt,'click',function(){
		pageChange.nxtp();
	});
				
})();

//右侧视频播放
(function play(){
	var vo=$('vo');
	var img=vo.getElementsByTagName('img')[0];
	var toplay=getElementsByClassName(vo,'toPlay')[0];
	var player=getElementsByClassName(vo,'m-player')[0];
	var close=getElementsByClassName(vo,'close')[0];
	var video=vo.getElementsByTagName('video')[0];
	
	//显示视频浮层
	addEvent(img,'click',function(){
		player.style.display='block';
	});
	addEvent(toplay,'click',function(){
		player.style.display='block';
	});
	
	//关闭视频浮层
	addEvent(close,'click',function(){
		player.style.display='none';
		video.pause();
	})
})();

//右侧热门推荐
(function hot(){
	var hot=$('hot');
	var ali=hot.getElementsByTagName('li');	
	
	//获取热门信息
	function getData(){
		get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data){
			var data=JSON.parse(data);			
			for (var i=0;i<data.length;i++) {
				var li=document.createElement('li');
				li.style.top=(-20+70*i)+'px';
				hot.appendChild(li);
				li.innerHTML=
				'<img src="'+data[i].smallPhotoUrl+'" />\
				<p>'+data[i].name+'</p>\
				<span>'+data[i].learnerCount+'</span>';
			}
			roll();
		});
	}
	getData();
	
	//每隔5秒滚动播放(循环)
	function roll(){
		function step(){
			for (var i=0;i<ali.length;i++) {
				var top=parseInt(ali[i].style.top);
				ali[i].style.top=(top-70)+'px';
				if(top==-720)ali[i].style.top=610+'px';
			}
		}
		var setIntervalId = setInterval(step, 5000);
	}
	
})();
