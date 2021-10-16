$(function () {

  // 获取表单
  var form = layui.form
  var layer = layui.layer
  // 定制自己的校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格!'],
    samePwd: function (value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同!'
      } 
    },
    rePwd: function (value) {
      if (value !== $('[name=newPwd]').val()) {
        return '两次输入的新密码不同!'
      }
    }
    
  })


  // 监控表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(), 
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更改密码失败')
        }
        layer.msg('更改密码成功')
        $('.layui-form')[0].reset()
      }
    })
  })

})