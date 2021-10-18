$(function () {


  var layer = layui.layer
  var form = layui.form

  initArtCateList()
  // 获取文章分类列表并渲染
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // 使用模板字符串进行渲染
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }


  var indexAdd = null
  // 点击添加类别--弹出层
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1, // 改变层次
      area: ['500px', '250px'], // 修改大小
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理方式，添加表单提交事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()  // 阻止事件默认提交行为不能忘记
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('新增文章分类失败!')
        }
        initArtCateList()
        layer.close(indexAdd)
        layer.msg('新增文章分类成功!')
      }
    })
  })

  // 通过代理方式，为编辑按钮绑定事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1, // 改变层次
      area: ['500px', '250px'], // 修改大小
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })


    // 发起根据id获取文章类别请求
    var id = $(this).attr('data-id')
    
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)  // layui的一种方法帮助快速渲染列表数据
      }
    })
  })


  // 通过代理方式，监听表单修改的提交事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新信息失败!')
        }
        layer.msg('更新信息成功!')
        layer.close(indexEdit)
        initArtCateList() // 更新完进行渲染
        
      }
    })
  })


  // 通过代理方式，为删除按钮绑定点击点击事件
  $('body').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除  layer自带的一种方法
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败!')
          }
          layer.msg('删除文章分类成功!')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})