# common-easyui
一个高度封装的easyui插件，让开发者更加简便使用easyui进行交互，增删改查仅需几行代码。

目前封装的内容有：

  1、easyui验证框的扩展，支持更多类型验证
  
  2、可编辑的DataGrid
  
  3、增删改查交互的高度封装，仅需一个方法
  
  4、封装了弹出窗口，点击确定按钮可提交AJAX
  
  5、封装了消息提示，显示在顶部
  
  6、封装了AJAX和FormSubmit 支持在提交过程中显示“加载中...”
  
  
  ## API使用说明
  
  ### 可编辑DataGrid
  - **示例**
  ```HTML
  <table id="url_dategrid_add" title="URL列表" style="width:690px;">
	</table>
  ```
  
  ```JS
  
  var datagrid = UI.initEditDataGrid("#url_dategrid_add",{
        //参数与easyui原参数一致
				columns:[[    
		              {field:'id',hidden:true,width:40},
		              {field:'url',title:'URL',width:540,align:'center',
		            	  editor:{type:'textbox',options:{required:true,align:'center'}}
		              },    
		              {field:'timeout',title:'超时(毫秒)',width:100,align:'center',
		            	  editor:{type:'numberbox',options:{required:true,align:'center'}}
		              },    
		              {field:'status',title:'状态',width:40,align:'center',
		            	  editor:{type:'checkbox',options:{on:1,off:0}},
		              formatter:$.format.statusFormat
		              }
		          ]]
			});
  
  ```
  
   ### 新增数据
  - **说明**
  ```JS
  UI.addByWindow({
			title:'你的标题',
			windowUrl:"User/toAdd",//HTML或JSP地址
			width:800,
			height:450,
			formId:'#formUserAdd', //表单ID
			url:'User/add',       //提交表单的URL
			datagrid:userDatagrid// dataGrid的对象
			}
		});
  
   ```
   
     - **示例**
     
  ```JS
  var userDatagrid = $("#userDatagrid");
  function addUser(){
     UI.addByWindow({
			title:'你的标题',
			windowUrl:"User/toAdd",//HTML或JSP地址
			width:800,
			height:450,
			formId:'#formUserAdd', //表单ID
			url:'User/add',       //提交表单的URL
			datagrid:userDatagrid// dataGrid的对象
			}
		});
  }
   ```
   
   ```JAVA
   /**返回JSON的封装对象,msg为提示消息，当不为空时自动显示提示框**/
public class Result {
	
	private boolean success = false;
			
	private String msg;
	
	private Integer statusCode=200;
	
	private Map<Object,Object> attribute = new HashMap<>();

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Integer getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(Integer statusCode) {
		this.statusCode = statusCode;
	}

	public Map<Object, Object> getAttribute() {
		return attribute;
	}

	public void addAttribute(Object key,Object value){
		getAttribute().put(key, value);
	}

	
	
}
```
  
### 修改数据
  
  - **示例**
  
  ```JS
  /**
  和添加方法大同小异
  **/
  var userDatagrid = $("#userDatagrid");
  UI.updateByWindow({
			title:'<s:message code="label.edit"/><s:message code="m.user.info"/>',
			windowUrl:"User/toEdit", //编辑页面的跳转URL
			width:800,
			height:450,
			formId:'#formUserEdit',	//表单ID
			url:'User/update',		//提交表单时的URL
			datagrid:userDatagrid,
			idField:"userId",			//ID列名,使用getUrl获得数据时才需要
			getUrl:'User/getById',//获得用户信息详情的请求URL
			onLoad:function(data){ //页面加载完毕事件
				
			},
			onSubmit:function(){
				
			}
		});
  
  ```


### 删除数据
  - **说明**
  
   ```JS
   UI.deleteByDatagrid(userDatagrid, 'User/delete', "userId","您确定要删除所选数据吗？");
   
   ```
   
   参数1、2、3是必填参数，分别为datagrid对象，删除的Controller地址、ID列名，参数4为可选，是删除确认框的提示消息
   
    - **注意**
    
    **使用该方法必须使用datagrid的checkbox:true ，该方法仅识别勾选的数据,如：columns:[[{field:"userId",checkbox:true}]]
    
- **示例**
    
  ```JS
  function deleteUser(){
    UI.deleteByDatagrid(userDatagrid, "User/delete", "userId");
  }
	
  ```
  
    
### 其他

提示消息

 ```JS
     UI.showMessage("删除成功！");
 ```
    
创建窗口

```JS
      UI.createWindow({
        url:'',
        title:'',
        width:111,
        height:222,
        callback:function(){},
        tools:[{
		iconCls: 'icon-remove',
		plain:true,
		text:'删除',
		handler: function(){

		}
	}]
      });
```


- **说明**

创建窗口说明

	  * 创建窗口 参数是json格式
	  * @param url url  
	  * @param title 窗口标题
	  * @param callback 点击确定按钮的回调函数
	  * @param width  窗口宽度 可以不指定
	  * @param height 窗口高度 可以不指定
	  * @param tools 添加额外按钮
      
      
      
 - ** 提交表单说明 
```JS
	/**
		  * easyui FORM表单说明
		  * @param id FORM的ID 如'#form'
		  * @param parament json格式 名称和原来的一样 添加了progressText(进度条文本),dataType(设置dataType='json')回调函数返回的值会			自动转换成json格式
		  * parament.autoCloseProgress 关闭进度条方式，默认在success回调函数中关闭,设置为false则在回调函数执行完毕后再关闭进度条
		  * parament.autoValidate 是否自动验证，设置false不自动验证表单，默认自动验证在onSumit时验证
		  * parment.progress false表示不显示进度条
		  * parment.ok  配置createWindow使用的 确定按钮，如传入则用此方法控制该按钮
	  */
	UI.formSubmit("#formId",{
	url:'user/sava',
	success:function(){

	}
	}) 

```
    
