$(function () {
  var layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  // 为文件选择框添加shange事件判断文件选择框发生的变化
  $('#file').on('change', function (e) {
    // console.log(e);
    if (e.target.files === 0) {
      return layer.msg('上传文件失败!')
    }
    // 拿到用户选择的文件
    var file = e.target.files[0]
    // 将用户选择的文件创建成一个URL地址
    var imgURL = URL.createObjectURL(file)
    // 先销毁旧的裁剪区域，重新设置路径，创建新的裁剪区域
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', imgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })


  // 点击确定，上传头象
  $('#btnUpload').on('click', function () {
    // 拿到裁剪的图片，输出成base64格式的字符串
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    
    // 然后调用接口
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败')
        }
        layer.msg('更换头像成功')
        // 初始化主界面，将头像渲染成功
        window.parent.grtUserInfo()
      }
    })
  })
})