
/* 平滑滚动  */
$('.navigation li a').bind('click.smoothscroll', function(e) {
    e.preventDefault();
    $(this).addClass('active') //当前状态添加active样式
	.parent().siblings().children('a').removeClass('active'); //其他为原始样式
    $('html,body').animate({
        scrollTop: $(this.hash).offset().top
    }, 1200);
});

/* 小于992px导航显示 */
$('.toggle-menu').click(function(){
	var $menu=$('.responsive-menu');
	if($menu.is(':visible')){
		$menu.hide(800);
	}else{
		$menu.show(800);
	}
});