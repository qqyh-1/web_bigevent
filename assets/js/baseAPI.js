// 在调用任何 $.det(),$.post, $ajax()时，会先调用$.ajaxPrefilter函数， 拿到我们给Ajax配制的对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})