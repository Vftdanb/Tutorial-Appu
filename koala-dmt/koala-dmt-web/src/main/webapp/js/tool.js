/*线条画笔工具*/
svgGraph = {
	/*画一条线*/
	drawLine : function(start ,end , name){
		var line = $("#line-template ."+name).clone();
		var pline = line.children();
		
		/*线条的路径*/
		pline.attr("points", 
			start[0]	+ "," + start[1] 	+ " " + 
			end[0]		+ "," + end[1] 		+ " ");
			
		return line;
	} ,
	
	/*移动一条直线*/
	moveLine : function(line ,start ,end){
		line.children("polyline").attr("points", 
			start[0] 	+ "," + start[1] 	+ " " +
			end[0] 		+ "," + end[1] 		+ " ");
	},
	
	//重构所有连向某个结点的线的显示，传参结构为nodes数组的一个单元结构
	resetLines : function(node, nodes, lines, outLines, inLines) {
		var line,startNode,endNode;
		var endPoints;
		
		/*重画指出的线*/
		for(var i in outLines){
			endpoints = this.getStartEnd(node,nodes[outLines[i].toShapeId]);
			this.moveLine(lines[i], endpoints.start, endpoints.end);
		}
		
		/*重画指入的线*/
		for(var i in inLines){
			endpoints = this.getStartEnd(nodes[inLines[i].fromShapeId],node);
			this.moveLine(lines[i], endpoints.start, endpoints.end);
		}
	},
	
	/*
	 * 当两个节点之间连直线时，计算连线的起点和终点
	 */
	getStartEnd : function(n1,n2){
		var p1 = n1.position(),
			p2 = n2.position(),
			c1 = {
				left : p1.left + n1.outerWidth()/2,
				top : p1.top + n1.outerHeight()/2
			},
			c2 = {
				left : p2.left + n2.width()/2,
				top : p2.top + n2.height()/2
			},
			start 	= this.getPoint(p1,n1.outerWidth(),n1.outerHeight(),c2),
			end 	= this.getPoint(p2,n2.outerWidth(),n2.outerHeight(),c1);
			
		return {
			"start" : start,
			"end" 	: end
		};
	},
	
	/**
	 * 在矩形中心与矩形外任意一点连线时，获取该连线与矩形的边的交点
	 * p1：矩形左上角坐标
	 * w：矩形的width
	 * h：矩形的height
	 * p2：矩形外的点
	 */
	getPoint : function(p1,w,h,p2){
		var x1,y1,x,y;
		
		x1 = p1.left + w/2;
		y1 = p1.top + h/2;
		
		var tan1 = (p2.top - y1) / (p2.left - x1);
		var tan2 = h/w;
		
		if(Math.abs(tan1) > Math.abs(tan2)){
			var dx = Math.abs( (h*(p2.left-x1)) / (2*(p2.top-y1)) );
			
			dx = (p2.left > x1 ? dx : -dx);
			x = p1.left + w/2 + dx;
			y = (p2.top > y1 ? p1.top+h : p1.top);
		} else {
			var dy = Math.abs( (w*(p2.top-y1)) / (2*(p2.left-x1)) );
			
			dy = (p2.top > y1 ? dy : -dy);
			y = p1.top + h/2 + dy;
			x = (p2.left > x1 ? p1.left+w : p1.left);
		}
		
		return [x,y];
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
	
	/*获取元素的绝对位置*/
	domPosition : function(dom) {
		var t = dom.offsetTop,
			l = dom.offsetLeft;
			dom = dom.offsetParent;
		
		while (dom) {
			t += dom.offsetTop;
			l += dom.offsetLeft;
			dom = dom.offsetParent;
		};
		
		return {
			top : t,
			left : l
		};
	},
	
	/*找出和某个节点连接的所有线条（分连出和连入两种）*/
	findRelatedLines : function(nodeId,lines){
		var outLines = {}, inLines = {};
		for(var i in lines){
			if(lines[i].toShapeId == nodeId){
				inLines[i] = lines[i];
			} else if(lines[i].fromShapeId == nodeId){
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

































/*uml图对象*/
function DomainChar(name){
	this.project 		= null;
	this.name			= name;
	this.domainShapeDtos = null;
	this.lineDtos		= null;
}

/*线条数据结构*/
function Line(chartId,type,from,to,desc){
	this.fromShapeId 	= from;
	this.toShapeId		= to;
	this.lineType 		= type;
	this.description	= desc;
	this.domainsChartId	= chartId;
}

/*节点数据结构*/
function DomainShape(id,charid,name,point,type,desc){
	this.shapeId			= id;
	this.leftTopPoint 		= point;
	this.shapeType			= type;
	this.name				= name;
	this.description		= desc;
	this.domainsChartId		= charid;
}

/****************************顶级数据结构****************************/
/*实体类*/
function EntityShape(id,charid,name,point,type,desc,isAbstract,isMapped){
	DomainShape.call(this, id,charid,name,point,type,desc); 		//继承DomainShap
	
	this.extends			= null;			//父类(连线时级联产生)
	this.implementsList 	= [];			//实现（连线时接连产生，有可能要自动实现方法）
	this.constants			= [];			//常量数组（常量对象数组）
	
	
	this.properties 		= []; 			//属性数组（属性对象数组）
	this.actions			= []; 			//行为数组（行为对象数组）
	this.isAbstractEntity 	= isAbstract;
	this.isMappedSuperClass = isMapped;
	
}

/*值对象*/
function ValueObject(id,charid,name,point,type,desc){
	DomainShape.call(this, id,charid,name,point,type,desc);
	
	this.name 			=  name;
}
/*接口类*/
function InterfaceShape(id,charid,name,point,type,desc){
	DomainShape.call(this, id,charid,name,point,type,desc);
	
	this.name 		= name;
	this.actions 	= [];	//
}
/*枚举*/
function EnumShape(){
	this.enumItems = [];
}



/****************************二级数据结构****************************/
/*属性类*/
function Property(name,type){
	this.name 			= name;
	this.type 			= type;
	this.genericity		= null;
	this.propertyScope	= "private";
	this.relation		= null;
	this.nullable		= true;
	this.isUnique		= false;
	this.transientPro	= false;
	this.relation		= null;		//manytonone,manytomany...
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

/*工程类*/
function Project(name){
	this.name = name;
}