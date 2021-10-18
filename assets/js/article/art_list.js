$(function () {

  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义一个查询的参数对象，将来请求数据的时候， 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1,  //页码值，默认请求第一页的数据
    pagesize: 2,   // 每页显示多少条数据
    cate_id: '', //文章分类的 Id
    state: ''   //文章的状态，可选值有：已发布、草稿
  }



  initTable()
  initCate()


  // 获取文章列表数据方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败!')
        }
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        renderPage(res.total)
      }
    })
  }

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())
    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }


  // 初始化文章分类下拉菜单
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          layer.msg('获取分类数据失败')
        }
        // 使用模板引擎渲染所有分类选择框
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr) // 动态的往结构里添加可选项，并没有被layui所监听到
        // 通过layui方法重新渲染可选项的结构
        form.render()
      }
    })
  }

  // 监听筛选表单的提交事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单里面的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为那个查询的参考对象赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的情况渲染列表区域
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用laypage方法来渲染分页结构
    laypage.render({
      elem: 'pageBox',  //用来渲染分页的盒子 
      count: total,   // 一共有多少条数据
      limit: q.pagesize,  //  每页显示几条数据
      curr: q.pagenum,   // 指定当前页码停留的位置 
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [1, 2, 3, 5, 10],
      // 点击页码进行切换，发生jump 回调
      // 触发 jump 回调的方式有两种
      // 1.点击页码进行切换   2.使用了laypage.render方法
      jump: function (obj, first) {
        // 可以通过first值来判断通过那种方式进行的jump回调，jump默认为True
        // 把最新的页码值赋值给 查询参数对象q
        q.pagenum = obj.curr
        // 把最新的条目数赋值给 参数查询对象q, 然后通过jump回调触发渲染
        q.pagesize = obj.limit
        // 根据最新的查询参数对象 q 进行渲染列表数据
        if (!first) {  //  如果first不是true，进进行jump回调，是通过点击页码进行切换触发jump回调的
          initTable()
        }
      }
    })
  }


  // 通过代理方式，将删除按钮绑定事件
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length  // 获取删除按钮的个数
    var id = $(this).attr('data-id')  // 获取id
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败!')
          }
          layer.msg('删除文章成功!')
          // initTable()  // 重新渲染界面  此时会有bug 页面上的数据删除完，上一页的数据不会渲染出来，因为此时q.pagenum还是删除前的q.pagenum

          // 此时判断列表上的数据，删除完成后，列表上的数据荣国还有，就继续停留在当前的页面，如果没有了，就让q.pagenum - 1后在渲染界面
          if (len === 1) {  // 如果len = 1 删除完成之后，里面的数据就都没有了，就让他渲染上一个界面

            // 当前页码最小的值只能是1，在1的界面删除完毕后，也只能停留在1 上
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()  // 经过判断条件在渲染界面
        }
      })
      layer.close(index)  // 关闭弹出层
    })


    
  })


})

