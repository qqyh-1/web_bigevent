$(function () {
  getUserInfo()


  var layer = layui.layer
  // 点击按钮，实现退出功能
  $('#btnLogout').on('click', function () {
    // 提示用户是否确认
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 1. 清空本地存储中的 token
      localStorage.removeItem('token')
      // 2. 重新跳转到登录页面
      location.href = '/login.html'
      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})

// 获取用户信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败!')
      }
      renderAvatar(res.data)
    },
    // complete: function (res) {
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 清空token
    //     localStorage.removeItem('token')
    //     // 强制到login.html界面
    //     location.href = '/login.html'
    //   }
    // }
  })
}

// 渲染头像列表
function renderAvatar(user) {
  // 获取用户名称
  var name = user.nickname || user.username
  // 渲染欢迎样式
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 判断用户头像信息
  if (user.user_pic !== null) {
    // 设置图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show().siblings('.text-avatar').hide()
    // $('.text-avatar').hide()
  } else {
    var first = name[0].toUpperCase()
    $('.layui-nav-img').hide().siblings('.text-avatar').html(first).show()
    // $('.text-avatar').html(first).show()
  }

}