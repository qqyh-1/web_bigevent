$(function () {

  var layer = layui.layer
  var form = layui.form

  initCate()
  // 初始化富文本编辑器
  initEditor()
  // 定义加载文章分类方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // d动态的往结构里添加可选项，不会被layui所监听到，需要调用form.render()方法进行重新渲染
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面按钮添加绑定事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 为隐藏的文件上传框，绑定change事件，监听变化
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    if (files.length === 0) {
      return
    }
    // 将获取到的文件列表数组转化为URL地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })


  // 默认的art_state属性是已发布
  var art_state = '已发布'
  // 点击了存为草稿键后，让art_state属性为草稿
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })


  // 监听表单的提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 将表单里面的数据存到formData对象中
    var fd = new FormData($(this)[0])
    // 将state属性与值添加到对象中
    fd.append('state', art_state)
    // 将裁剪后的图片，输出为二进制文件
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作， 将文件添加到formData对象上
        fd.append('cover_img', blob)
        // 发起ajax请求
        publishArticle(fd)
      })


  })

  // 定义发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交 FormData数据，必须添加如下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败!')
        }
        layer.msg('发布文章成功!')
        // 发布成功之后，立即跳转到文章列表页
        location.href = '/article/art_list.html'
      }
    })
  }

})

