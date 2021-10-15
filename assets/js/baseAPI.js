// 在调用任何 $.det(),$.post, $ajax()时，会先调用$.ajaxPrefilter函数， 拿到我们给Ajax配制的对象
$.ajaxPrefilter(function (options) {
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 为统一有权限的接口设置请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }


  // 全局挂在complete函数
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 清空token
      localStorage.removeItem('token')
      // 强制到login.html界面
      location.href = '/login.html'
    }
  }
})