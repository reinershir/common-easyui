/* 
 *easyui通用js代码
 * 
*/
var UI={
	 /**
	  * 
	  * @param parament 参数parament的说明 
	  * 参数parament是一个json格式，名称和用法和jquery ajax一致
	  * 此方法仅仅是添加了ajax发送请求时出现进度条
	  * parament.progressText是进度条的提示文字  已默认国际化无特殊要求可不填
	  * parament.autoCloseProgress 关闭进度条方式，默认在success回调函数中关闭,设置为false则在回调函数执行完毕后再关闭进度条
	  **/
		Ajax:function(parament){
			 $.ajax({
				 type:parament.type?parament.type:"post",
				 url:parament.url,
				 data:parament.data,
				 timeout:parament.timeout?parament.timeout:10000,
				 dataType:parament.dataType?parament.dataType:'json',
				 async:parament.async!=undefined?parament.async:true,
				 beforeSend:function(XMLHttpRequest){
				   var text = $.fn.datagrid.defaults.loadMsg;
				   if(parament.progressText)
					   text = parament.progressText;
		      	   $.messager.progress({text:text}); 
		      	   if(parament.beforeSend)
		      		   parament.beforeSend(XMLHttpRequest);
		         },
				 success:function(data){
					 if(data&&data.msg&&data.msg!="")
						 UI.showMessage(data.msg);
					 if(parament.autoCloseProgress==undefined||parament.autoCloseProgress==true){
						 $.messager.progress("close");
						 parament.success(data);
					 }else{
						 parament.success(data);
					 }
					 
				 },
				 error:function(response,error,exception){
					 $.messager.progress("close");
					 if(parament.error)
						 parament.error(request,error,exception);
					 if(response.status=='timeout'){
						 alert("ajax error,timeout!");
					 }else
						 UI.showMessage("请求出错，请联系管理员！");
					 console.info(response);
					 console.info(error);
					 console.info(exception);
					 
				 },
				 contentType:parament.contentType,
				 complete:parament.complete,
				 timeout:parament.timeout
			 });
		 },
		 
		 /**
		  *  弹窗显示信息
		  *  @param title 标题
		  *  @param text 内容
		  */
		 showMessage : function (text,title){
		 	$.messager.show({
		 		title:title?title:'提示',
		 		msg:'<center>'+text+'</center>',
		 		timeout:2000,
		 		showType:'show',
		 		style:{
		 			right:'',
		 			top:document.body.scrollTop+document.documentElement.scrollTop,
		 			bottom:''
		 		}
		 	});
		 },
		 /**
		  * 创建窗口 参数是json格式
		  * @param url url  
		  * @param title 窗口标题
		  * @param callback 点击确定按钮的回调函数
		  * @param width  窗口宽度 可以不指定
		  * @param height 窗口高度 可以不指定
		  * @param tools 添加额外按钮
		  **/
		 createWindow : function (parament){
			 if(!parament)
				 return;
			 var win;
			 var tools = [];
			 if(parament.tools){
				 for(var i = 0;i<parament.tools.length;i++){
					 tools.push(parament.tools[i]);
				 }
			 }
			 if(parament.callback){
				 tools.push({
					 iconCls:'icon-ok',
					 text:$.messager.defaults.ok,
					 handler:parament.callback//调用回调函数
					 
				 });
			 }
			 if(!parament.cancel){
				 tools.push({
					 text:$.messager.defaults.cancel,
					 iconCls:'icon-cancel',
					 handler:function(){
						 win.window("close");
					 }
				 });
			 }
			 win = $("<div/>").dialog({
				 title:parament.title,
				 onLoad:function(){
					if(parament.onLoad){
						parament.onLoad();
					}
					//添加权限检测
					/*if($.base.checkPermission) {
						$.base.checkPermission();
					}*/
				 },
		         width:parament.width?parament.width:$(window).width()>900?900:900*0.9,   
		         left:parament.left?parament.left:null,
		         top:parament.top?parament.top:null,
		   	  	 height:parament.height?parament.height:$(window).height()>600?600:600*0.9,    
		    	 modal:true,
		    	 method:parament.method?parament.method:'get',
		    	 queryParams:parament.queryParams?parament.queryParams:{},
		    	 href:parament.url,
		    	 onClose : function() {
		    		 if(parament.onClose)
		    			 parament.onClose();
		    		 win.dialog('destroy');
				 },
		    	 buttons:tools
			 });
			 return win;
		 },

		 /**
		  * easyui FORM表单说明
		  * @param id FORM的ID 如'#form'
		  * @param parament json格式 名称和原来的一样 添加了progressText(进度条文本),dataType(设置dataType='json')回调函数返回的值会自动转换成json格式
		  * parament.autoCloseProgress 关闭进度条方式，默认在success回调函数中关闭,设置为false则在回调函数执行完毕后再关闭进度条
		  * parament.autoValidate 是否自动验证，设置false不自动验证表单，默认自动验证在onSumit时验证
		  * parment.progress false表示不显示进度条
		  * parment.ok  配置createWindow使用的 确定按钮，如传入则用此方法控制该按钮
		  */
		 formSubmit:function (id,parament){
			 var form = $(id);
			 form.form({
					url:parament.url,
					novalidate:parament.novalidate?parament.novalidate:false,
					onSubmit:function(param){
						if((parament.autoValidate||parament.autoValidate==undefined)&&!form.form('validate'))
							return false;
						if(parament.progress!=false){
							var text = "Loading...";
							if(parament.progressText)
								text = parament.progressText;
					      	$.messager.progress({text:text}); 
						}
						if(parament.onSubmit){
							if(parament.onSubmit(param)==false)
								return false;
						}
						if(parament.ok)
							parament.ok.linkbutton("disable");//禁用确定按钮
					},
					onLoadError :function(){
						if(parament.progress!=false)
							$.messager.progress('close');
						if(parament.ok)
							parament.ok.linkbutton("enable");//启用确定按钮
						 if(parament.onLoadError)
							 parament.onLoadError();
					},
					success:function(data){
						if(!parament.dataType||(parament.dataType&&parament.dataType.toLowerCase()=="json")){
							try{
								data = eval('(' + data + ')');  // form表单必须手动转换为json 
							}catch(e){
								UI.showMessage("服务器出错，请联系管理员！");
							}  
						}
						if(parament.progress!=false){
							if(parament.autoCloseProgress==undefined||parament.autoCloseProgress==true){
								$.messager.progress("close");
							}
						}
						if(parament.ok)
							parament.ok.linkbutton("enable");//启用确定按钮
						if(data&&data.msg)
							UI.showMessage(data.msg);
						parament.success(data);
				       
				    },
				    onLoadError:function(){
				    	UI.showMessage("加载数据出错！");
				    }
				}).submit();
		 },
		 
		 
		 /**
		  * 通用datagrid删除方法，根据所选checkbox提交删除ajax请求
		  * @param dataGrid easyui datagrid的jquery对象
		  * @param url
		  * @param idName ID字段名称 默认名为:id
		  **/
		 deleteByDatagrid : function (dataGrid,url,idName,hintText){
				var selection = dataGrid.datagrid("getChecked");
				if(selection==null||selection.length<1){
					UI.showMessage('请勾选要操作的数据！',"提示");
					return;
				}
				$.messager.confirm('确认',hintText?hintText:'您确认想要删除所选数据吗？',function(r){    
				    if (r){ 
				    	var parament = new Array();
				    	//获取选择数据的ID
				    	for(var i =0;i<selection.length;i++){
				    		if(idName){
				    			parament.push(selection[i][''+idName]);
				    		}else
				    			parament.push(selection[i].id);
				    	}
				        UI.Ajax({
				        	url:url,
				        	data:{"ids":parament},
				        	dataType:'json',
				        	success:function(data){
				        		if(data){
				        			if(data.success){
				        				//不清除的话连续删除会获得已删除的数据ID
				        				dataGrid.datagrid('clearChecked');
				        				//reload
				        				dataGrid.datagrid("reload");
				        			}
				        		}
				        		
				        	}
				        });  
				    }    
				});  
		 },
		 

		/**
		 * 通用添加或修改方法
		 * @param parament json格式参数 包含参数有如下
		 * checkSelect boolean类型 检查是否选择了一行数据 默认flase
		 * title 标题
		 * windowUrl 要弹出窗口的URL
		 * url 添加方法的URL
		 * width 窗口宽度
		 * height 窗口高度
		 * formId 要提交的form Id
		 * datagrid datagrid jquery object
		 **/
		 addByWindow:function (parament){
			 var win = UI.createWindow({
					title:parament.title,
					url:parament.windowUrl,
					width:parament.width,
					height:parament.height,
					onClose:parament.onClose,
					callback:parament.callback==false?undefined:function(){
						UI.formSubmit(parament.formId, {
							url:parament.url,
							ok:$(this),
							onSubmit:parament.onSubmit?parament.onSubmit:undefined,
							success:function(data){
								if(data.success){
									if(parament.datagrid)
										parament.datagrid.datagrid('reload');
									win.window("close");
								}
								if(data&&data.msg){
									UI.showMessage(data.msg,'提示');
								}
								if(parament.success)
									parament.success(data);
							}
						});
					},
					onLoad:function(){
						if(parament.onLoad)
							parament.onLoad();
					}
				});
			 return win;
		 },
		 
		 /**
		 * 通用添加或修改方法
		 * @param parament json格式参数 包含参数有如下
		 * checkSelect boolean类型 检查是否选择了一行数据 默认flase
		 * title 标题
		 * url 要弹出窗口的URL
		 * width 窗口宽度
		 * height 窗口高度
		 * formId 要提交的form Id
		 * datagrid 添加或修改完成后要刷新的datagrid
		 * getUrl 获得数据详情时请求的URL，一般情况下不需要使用
		 * idField ID列名,使用getUrl获得数据时才需要
		 **/
		 updateByWindow:function (parament){
			var selection = parament.datagrid.datagrid("getSelected");
			if(selection==null||selection.length<1){
				UI.showMessage(parament.hintText?parament.hintText:'请选择要编辑的数据！');
				return;
			}
			 var win = UI.createWindow({
					title:parament.title,
					url:parament.windowUrl,
					width:parament.width,
					height:parament.height,
					onClose:parament.onClose,
					callback:parament.callback==false?undefined:function(){
						UI.formSubmit(parament.formId, {
							url:parament.url,
							ok:$(this),
							onSubmit:parament.onSubmit?parament.onSubmit:undefined,
							success:function(data){
								if(data.success){
									if(parament.datagrid)
										parament.datagrid.datagrid('reload');
									win.window("close");
								}
								if(data&&data.msg){
									UI.showMessage(data.msg);
								}
								if(parament.success)
									parament.success(data);
							}
						});
					},
					onLoad:function(){
						if(parament.getUrl){
							UI.Ajax({
								url:parament.getUrl,
								data:{"id":selection[''+parament.idField]},
								type:'get',
								success:function(data){
									$(parament.formId).form("load",data);
									if(parament.onLoad)
										parament.onLoad(data);
								}
							});
						}else{
							//载入数据至表单
							$(parament.formId).form("load",selection);
							if(parament.onLoad)
								parament.onLoad(selection);
						}
						
						
					}
				});
			 return win;
		 },
			 /**
			  *@see 初始化datagrid,以下是可填参数 
			  *@param url '远程加载数据的url'
			  *@param idField
			  *@param toolbar
			  *@param columns
			  */
			initDatagrid:function(gridId,parament){
				var datagrid = $(gridId);
				parament.checkbox = true;
				parament.selectOnCheck = false;
				parament.singleSelect = parament.singleSelect?parament.singleSelect:true;
				parament.checkOnSelect = false;
				parament.fitColumns = true;
				parament.pagination = true;
				parament.pageSize = parament.pageSize?parament.pageSize:20;
				parament.pageList = [10,20,40,50];
				parament.fit = true;
				parament.type = parament.type?parament.type : 'post';
				parament.onRowContextMenu = function(e, index, row) {
					e.preventDefault();
					$(this).datagrid('selectRow', index);
					$($(this).datagrid('options').menuSelector).menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				};
				datagrid.datagrid(parament); 
				return datagrid;
			},
			/**
			 * @param gridId 要初始化的datagrid ID
			 * @param parament 初始化参数，格式为JSON
			 * @param parament参数说明：
			 * columns 必填
			 * onClickCell事件不可用
			 * 其余和easyui datagrid参数一致
			 */
			initEditDataGrid:function(gridId,parament){
				var editIndex = [undefined];
				var datagrid = $(gridId);
				//初始化工具栏  
				var toolbar = [{
					iconCls: 'icon-add',
					plain:true,
					text:'添加',
					handler: function(){
						$.editGrid.append(datagrid,editIndex,parament.initData?parament.initData:undefined);
					}
				},{
					iconCls: 'icon-remove',
					plain:true,
					text:'删除',
					handler: function(){
						$.editGrid.removeit(datagrid,editIndex);
					}
				},{
					iconCls: 'icon-save',
					plain:true,
					text:'应用',
					handler: function(){
						$.editGrid.accept(datagrid,editIndex);
					}
				},{
					iconCls: 'icon-undo',
					plain:true,
					text:'复原',
					handler: function(){
						$.editGrid.reject(datagrid,editIndex);
					}
				}];
				//如果有额外的按钮
				if(parament.toolbar){
					for(var o in parament.toolbar){
						toolbar.push(o);
					}
				}
				parament.iconCls = 'icon-edit';
				parament.singleSelect = true;
				parament.toolbar = toolbar;
				parament.onClickCell = function(index, field){
					$.editGrid.onClickCell(datagrid,editIndex,index, field);
				};
				datagrid.datagrid(parament);
				return datagrid;
			}
}

/*************************  Edit DataGrid  *******************************/

/**
 * 编辑一列
 */
$.extend($.fn.datagrid.methods, {
	editCell: function(jq,param){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field){
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
            var ed = $(this).datagrid('getEditor', param);
            if (ed){
                if ($(ed.target).hasClass('textbox-f')){
                    $(ed.target).textbox('textbox').focus();
                } else {
                    $(ed.target).focus();
                }
            }
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	},
    enableCellEditing: function(jq){
        return jq.each(function(){
            var dg = $(this);
            var opts = dg.datagrid('options');
            opts.oldOnClickCell = opts.onClickCell;
            opts.onClickCell = function(index, field){
                if (opts.editIndex != undefined){
                    if (dg.datagrid('validateRow', opts.editIndex)){
                        dg.datagrid('endEdit', opts.editIndex);
                        opts.editIndex = undefined;
                    } else {
                        return;
                    }
                }
                dg.datagrid('selectRow', index).datagrid('editCell', {
                    index: index,
                    field: field
                });
                opts.editIndex = index;
                opts.oldOnClickCell.call(this, index, field);
            }
        });
    }
});

$.editGrid={
		endEditing:function(editGrid,editIndex){
			if (editIndex[0] == undefined){return true}
			if (editGrid.datagrid('validateRow', editIndex[0])){
				editGrid.datagrid('endEdit',editIndex[0]);
				editIndex[0] = undefined;
				return true;
			} else {
				return false;
			}
		},


		onClickCell:function(editGrid,editIndex,index, field){
			//if (editIndex[0] != index){
				if ($.editGrid.endEditing(editGrid,editIndex)){
					editGrid.datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					var ed = editGrid.datagrid('getEditor', {index:index,field:field});
					if (ed){
						($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
					}
					editIndex[0] = index;
				} else {
					setTimeout(function(){
						editGrid.datagrid('selectRow',editIndex[0]);
					},0);
				}
			//}
		},
		append:function (editgrid,editIndex,data){
			if ($.editGrid.endEditing(editgrid,editIndex)){
				editgrid.datagrid('appendRow',data?data:{});
				editIndex[0] = editgrid.datagrid('getRows').length-1;
				editgrid.datagrid('selectRow', editIndex[0])
						.datagrid('beginEdit', editIndex[0]);
				
			}
		},
		removeit:function(editgrid,editIndex){
			if (editIndex[0] == undefined){return;}
			editgrid.datagrid('cancelEdit', editIndex[0])
					.datagrid('deleteRow', editIndex[0]);
			editIndex[0] = undefined;
		},
		accept:function (editgrid,editIndex){
			if ($.editGrid.endEditing(editgrid,editIndex)){
				editgrid.datagrid('acceptChanges');
			}
			console.info(editgrid.datagrid("getRows"));
		},
		reject:function (editgrid,editIndex){
			editgrid.datagrid('rejectChanges');
			editIndex[0] = undefined;
		}
};

/************************ Edit Datagrid End ************************************/


/**
 * 编辑表格默认设置
 */
$.extend($.fn.datagrid.defaults.editors, {
    combogrid: {
        init: function(container, options){
            var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
            input.combogrid(options);
            return input;
        },
        destroy: function(target){
            $(target).combogrid('destroy');
        },
        getValue: function(target){
            return $(target).combogrid('getValue');
        },
        setValue: function(target, value){
            $(target).combogrid('setValue', value);
        },
        resize: function(target, width){
            $(target).combogrid('resize',width);
        }
    }
});

/**
 * 为日期对象添加Format方法
 */
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 修改easyui datebox默认时间转换方法
 */
$.fn.datebox.defaults.parser = function(s){
	if(!s)return new Date();
	var dateStr = new Date(s).Format('yyyy-MM-dd');
	var date = new Date(dateStr);
	return date;
}

/**
 * 扩展easyui的validator插件rules，支持更多类型验证
 */
$.extend($.fn.validatebox.defaults.rules, {
	minLength : { // 判断最小长度
		validator : function(value, param) {
			return value.length >= param[0];
		},
		message : '最少输入 {0} 个字符'
	},
	length : { // 长度
		validator : function(value, param) {
			var len = $.trim(value).length;
			return len >= param[0] && len <= param[1];
		},
		message : "输入内容长度必须介于{0}和{1}之间"
	},
	phone : {// 验证电话号码
		validator : function(value) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
		},
		message : '格式不正确,请使用下面格式:020-88888888'
	},
	mobile : {// 验证手机号码
		validator : function(value) {
			return /^(13|15|18|17)\d{9}$/i.test(value);
		},
		message : '手机号码格式不正确'
	},
	phoneAndMobile : {// 电话号码或手机号码
		validator : function(value) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18)\d{9}$/i.test(value);
		},
		message : '电话号码或手机号码格式不正确'
	},
	idcard : {// 验证身份证
		validator : function(value) {
			return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
		},
		message : '身份证号码格式不正确'
	},
	intOrFloat : {// 验证整数或小数
		validator : function(value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message : '请输入数字，并确保格式正确'
	},
	currency : {// 验证货币
		validator : function(value) {
			return /^\d+(\.\d+)?$/i.test(value);
		},
		message : '货币格式不正确'
	},
	qq : {// 验证QQ,从10000开始
		validator : function(value) {
			return /^[1-9]\d{4,9}$/i.test(value);
		},
		message : 'QQ号码格式不正确'
	},
	integer : {// 验证整数
		validator : function(value) {
			return /^[+]?[0-9]+\d*$/i.test(value);
		},
		message : '请输入整数'
	},
	chinese : {// 验证中文
		validator : function(value) {
			return /^[\u0391-\uFFE5]+$/i.test(value);
		},
		message : '请输入中文'
	},
	chineseAndLength : {// 验证中文及长度
		validator : function(value) {
			var len = $.trim(value).length;
			if (len >= param[0] && len <= param[1]) {
				return /^[\u0391-\uFFE5]+$/i.test(value);
			}
		},
		message : '请输入中文'
	},
	english : {// 验证英语
		validator : function(value) {
			return /^[A-Za-z]+$/i.test(value);
		},
		message : '请输入英文'
	},
	englishAndLength : {// 验证英语及长度
		validator : function(value, param) {
			var len = $.trim(value).length;
			if (len >= param[0] && len <= param[1]) {
				return /^[A-Za-z]+$/i.test(value);
			}
		},
		message : '请输入英文'
	},
	englishUpperCase : {// 验证英语大写
		validator : function(value) {
			return /^[A-Z]+$/.test(value);
		},
		message : '请输入大写英文'
	},
	unnormal : {// 验证是否包含空格和非法字符
		validator : function(value) {
			return /.+/i.test(value);
		},
		message : '输入值不能为空和包含其他非法字符'
	},
	username : {// 验证用户名
		validator : function(value) {
			return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
		},
		message : '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
	},
	faxno : {// 验证传真
		validator : function(value) {
			return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
		},
		message : '传真号码不正确'
	},
	zip : {// 验证邮政编码
		validator : function(value) {
			return /^[1-9]\d{5}$/i.test(value);
		},
		message : '邮政编码格式不正确'
	},
	ip : {// 验证IP地址
		validator : function(value) {
			return /d+.d+.d+.d+/i.test(value);
		},
		message : 'IP地址格式不正确'
	},
	name : {// 验证姓名，可以是中文或英文
		validator : function(value) {
			return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
		},
		message : '请输入姓名'
	},
	engOrChinese : {// 可以是中文或英文
		validator : function(value) {
			return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
		},
		message : '请输入中文'
	},
	engOrChineseAndLength : {// 可以是中文或英文
		validator : function(value) {
			var len = $.trim(value).length;
			if (len >= param[0] && len <= param[1]) {
				return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
			}
		},
		message : '请输入中文或英文'
	},
	carNo : {
		validator : function(value) {
			return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
		},
		message : '车牌号码无效（例：粤B12350）'
	},
	carenergin : {
		validator : function(value) {
			return /^[a-zA-Z0-9]{16}$/.test(value);
		},
		message : '发动机型号无效(例：FG6H012345654584)'
	},
	same : {
		validator : function(value, param) {
			if ($("#" + param[0]).val() != "" && value != "") {
				return $("#" + param[0]).val() == value;
			} else {
				return true;
			}
		},
		message : '两次输入的密码不一致!'
	}
});

$.manage = {
		requireCombogrid:function(){
			if($(this).combogrid("grid").datagrid("getSelected")==null)
				$(this).combogrid("setValue",'');
		},
		getClearToolbar:function(combogrid){
			var tools = [{
				 iconCls:'icon-remove',
				 text:'清除已选数据',
				 handler:function(){
					 combogrid.combogrid("clear");
				 }
			 }];
			return tools;
		},
		/**
		 * 将datagrid中的数据以隐藏输入框的方式插入到form中
		 * @param form form的ID
		 * @param datagrid 表格对象
		 * @param paramName 保存该数据的对象名
		 * @param valueName 要保存数据的字段名，数据类型为数组可传多个字段
		 */
		addParamenter:function(form,datagrid,paramName,valueNames){
			var html = "";
			if($("#divValue").length<1){
				html = "<div id='divValue'></div>";
				$(form).append(html);
				html="";
			}
			datagrid.datagrid('acceptChanges');
			var rows = datagrid.datagrid("getRows");
			if (rows.length>0) {
				for (var i=0;i<rows.length;i++) {
					for(var j = 0;j<valueNames.length;j++){
						if(rows[i][valueNames[j]]){
							html+="<input type='hidden' name='"+paramName+"["+i+"]."+valueNames[j]+
							"' value='"+rows[i][valueNames[j]]+"' />";
						}
					}
				}
			}
			$("#divValue").html(html);
		},
		nameFilter : function(v,r,i){
			if(r&&r.name)
				return r.name;
		},
		companyFilter:function(node){
			for(var n in node){
				node[n]["id"]=node[n].companyId;
				node[n]["text"]=node[n].name;
				if(node[n].children&&node[n].children.length>0)
					$.manage.companyFilter(node[n].children);
			}
			return node;
		}
	};
		
		$.format = {
				statusFormat : function (v,r,i){
					if(r.status&&r.status==1)
						return '启用';
					else
						return '禁用';
				},
				yesOrNo : function (v,r,i){
					if(v&&v==1)
						return '是';
					else
						return '否';
				},
				dateFormat :function (v,r,i){
						return new Date(v).Format("yyyy-MM-dd");
				},
				dateTimeFormat :function (v,r,i){
						return new Date(v).Format("yyyy-MM-dd hh:mm:ss");
				}
		};
