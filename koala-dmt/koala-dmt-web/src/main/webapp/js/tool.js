/*线条画笔工具*/
svgGraph = {
	/*画一条线*/
	drawLine : function(start ,end , name){
		var line = $("#line-template ."+name).clone();
		var path = line.children();
		
		/*线条的路径*/
		path.attr("d", 
			"M" + start[0] 	+ "," + start[1] 	+ " " + 
			"L" + end[0] 	+ "," + end[1] 		+ " ");
			
		return line;
	} ,
	
	/*移动一条直线*/
	moveLine : function(line ,start ,end){
		line.children("path").attr("d", 
			"M" + start[0] 	+ "," + start[1] 	+ " "+
			"L" + end[0] 	+ "," + end[1] 		+ " ");
	},
	
	//重构所有连向某个结点的线的显示，传参结构为nodes数组的一个单元结构
	resetLines : function(node, nodes, lines, outLines, inLines) {
		var line,startNode,endNode;
		var endPoints;
		
		/*重画指出的线*/
		for(var i in outLines){
			endpoints = this.getStartEnd(node,nodes[outLines[i].to].nodeObj);
			this.moveLine(lines[i].lineObj, endpoints.start, endpoints.end);
		}
		
		/*重画指入的线*/
		for(var i in inLines){
			endpoints = this.getStartEnd(nodes[inLines[i].from].nodeObj,node);
			this.moveLine(lines[i].lineObj, endpoints.start, endpoints.end);
		}
	},
	
	/*在画直线时，根据两个节点计算连线起止点*/
	getStartEnd : function(n1, n2) {
		var start = [],	end = [];
		//左右判断：
		var x11 = n1.position().left , x12 = n1.position().left + n1.outerWidth(), 
			x21 = n2.position().left , x22 = n2.position().left + n2.outerWidth();
			
		//结点2在结点1左边
		if (x11 >= x22) {
			start[0] = x11;
			end[0] = x22;
		} else if (x12 <= x21) {
			start[0] = x12;
			end[0] = x21;
		} else if (x11 <= x21 && x12 >= x21 && x12 <= x22) { //结点2在结点1水平部分重合
			start[0] = (x12 + x21) / 2;
			end[0] = start[0];
		} else if (x11 >= x21 && x12 <= x22) {
			start[0] = (x11 + x12) / 2;
			end[0] = start[0];
		} else if (x21 >= x11 && x22 <= x12) {
			start[0] = (x21 + x22) / 2;
			end[0] = start[0];
		} else if (x11 <= x22 && x12 >= x22) {
			start[0] = (x11 + x22) / 2;
			end[0] = start[0];
		}

		//上下判断：
		var y11 = n1.position().top, y12 = n1.position().top + n1.outerHeight(), 
			y21 = n2.position().top, y22 = n2.position().top + n2.outerHeight();
			
		//结点2在结点1上边
		if (y11 >= y22) {
			start[1] = y11;
			end[1] = y22;
		} else if (y12 <= y21) { //结点2在结点1下边
			start[1] = y12;
			end[1] = y21;
		} else if (y11 <= y21 && y12 >= y21 && y12 <= y22) { //结点2在结点1垂直部分重合
			start[1] = (y12 + y21) / 2;
			end[1] = start[1];
		} else if (y11 >= y21 && y12 <= y22) {
			start[1] = (y11 + y12) / 2;
			end[1] = start[1];
		} else if (y21 >= y11 && y22 <= y12) {
			start[1] = (y21 + y22) / 2;
			end[1] = start[1];
		} else if (y11 <= y22 && y12 >= y22) {
			start[1] = (y11 + y22) / 2;
			end[1] = start[1];
		}
		
		return {
			"start" : start,
			"end" 	: end
		};
	}
};

/*画html节点的画笔*/
domGraph = {
	/*选中节点*/
	focusItem : function(){
		
	},
	
	/*删除节点时，需要级联删除连线和与连线有关系的属性*/
	deleteNode : function(){
		
	},
	
	/*更新节点时，需要级联更新*/
	updateNode : function(){
		
	}
};
/*
 * 部分关系到节点和连线的操作，以及所有跟连线和节点无关的操作放在commonTool里
 */
commonTool = {
	/*用随机数作为元素的id*/
	guid : function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
	  	return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
	},
	
	/*获取鼠标真实位置*/
	mousePosition : function(e) {
		return {
			left : e.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
			top : e.clientY + document.documentElement.scrollTop - document.body.clientTop
		};
	},
	
	/*找出和某个节点连接的所有线条（分连出和连入两种）*/
	findRelatedLines : function(nodeId,lines){
		var outLines = [], inLines = [];
		for(var i in lines){
			if(lines[i].to == nodeId){
				inLines[i] = lines[i];
			} else if(lines[i].from == nodeId){
				outLines[i] = lines[i];
			}
		}
		
		return {
			outLines : outLines,
			inLines : inLines
		};
	},	
	/**
	 * 当节点的dom对象信息更新时，对应的节点缓存信息同步更新。导致调用该方法的事件 包括
	 * 节点名、属性名、属性类型、行为名、行为参数名、行为参数类型、行为返回值等信息更改
	 */
	maintainNodesData : function(){
		
	}
};





/****************************顶级数据结构****************************/
/*实体类*/
function Entity(name){
	this.package;
	this.name			= name;
	this.extends		= null;	//父类(连线时级联产生)
	this.implementsList = [];	//实现（连线时接连产生，有可能要自动实现方法）
	this.constants		= [];	//常量数组（常量对象数组）
	this.properties 	= []; 	//属性数组（属性对象数组）
	this.actions		= []; 	//行为数组（行为对象数组）
	
}
/*值对象*/
function ValueObject(name){
	this.name 			=  name;
}
/*接口类*/
function Interface(name){
	this.name 		= name;
	this.actions 	= [];	//
}
/*枚举*/
function Enum(name){
	this.name 		= name;
	this.enumItems 	= [];
}



/****************************二级数据结构****************************/
/*属性类*/
function Property(name,type){
	this.propertyName 	= name;
	this.propertyType 	= type;
	this.propertyScope	= null;
	this.relation		= null;
}

/*常量类*/
function Constant(name ,type){
	this.constantName 	= name;
	this.constantType 	= type;
	this.constantValue 	= null;
}
/*行为类*/
function Action(name ,returnType){
	this.actionName = name;
	this.returnType = returnType;
	this.parameters = [];
}

/*枚举项类*/
function EnumItem(name){
	this.enumName = name;
}

/****************************三级级数据结构****************************/
/*行为参数类*/
function Parameter(name ,type){
	this.parameterName 	= name;
	this.parameterType 	= type;
	this.sortNumber 	= null;
}