$(function () {
  // 获取表单
  var form = layui.form
  var layer = layui.layer
  // 自己定义规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1-6字符之间！'
      }
    }
  })

  initUserInfo()
  // 初始化页面基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败')
        }
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置事件
    e.preventDefault()
    // 让表单还原到上次的状态
    initUserInfo()
  })


  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败!')
        }
        layer.msg('更新用户信息成功!')
        // 想办法调用父类的方法来渲染头像列表，现在所在的位置是子类
        window.parent.getUserInfo()
      }
    })
  })
})