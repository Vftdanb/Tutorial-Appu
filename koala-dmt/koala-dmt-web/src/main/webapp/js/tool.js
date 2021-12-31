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
	resetLines : function(node, nodes, lines, outs, ins) {
		var line,startNode,endNode;
		var endPoints;
		
		/*重画指出的线*/
		for(var i=outs.length-1 ; i>=0 ; i--){
			endpoints = this.getEndpoints(node,nodes[outs[i].toShapeId]);
			this.moveLine(lines[outs[i].lineId],endpoints.start, endpoints.end);
		}
		
		/*重画指入的线*/
		for(var i=ins.length-1 ; i>=0 ; i--){
			endpoints = this.getEndpoints(nodes[ins[i].fromShapeId],node);
			this.moveLine(lines[ins[i].lineId],endpoints.start, endpoints.end);
		}
	},
	
	/*
	 * 当两个节点之间连直线时，计算连线的起点和终点
	 */
	getEndpoints : function(n1,n2){
		var start , end , center2;
		
		/*在获取起点之前，要先知道第二个节点中心*/
		if(n2 instanceof Array){
			center2 = [n2[0] ,n2[1]];
		} else {
			var p2 = n2.position();
			center2 = [p2.left+n2.width()/2 , p2.top+n2.height()/2];
		}
		
		/*获取起点*/
		if(n1 instanceof Array){
			start = n1;
		} else {
			var p1 = n1.position();
			start = this.getPoint([p1.left,p1.top],n1.outerWidth(),n1.outerHeight(),center2);
		}
		
		/*获取终点*/
		if(n2 instanceof Array){
			end = n2;
		} else {
			var p2 = n2.position();
			end = this.getPoint([p2.left,p2.top],n2.outerWidth(),n2.outerHeight(),start);
		}
		
		return {
			"start" : start,
			"end" 	: end
		};
	},
	
	/**
	 * 在矩形中心与矩形外任意一点连线时，获取该连线与矩形的边的交点
	 * p1：矩形左上角坐标，数组
	 * w：矩形的width
	 * h：矩形的height
	 * p2：矩形外的点，数组
	 */
	getPoint : function(p1,w,h,p2){
		var x1,y1,x,y;
		
		x1 = p1[0] + w/2;
		y1 = p1[1] + h/2;
		
		var tan1 = (p2[1] - y1) / (p2[0] - x1);
		var tan2 = h/w;
		
		if(Math.abs(tan1) > Math.abs(tan2)){
			var dx = Math.abs( (h*(p2[0]-x1)) / (2*(p2[1]-y1)) );
			
			dx = (p2[0] > x1 ? dx : -dx);
			x = p1[0] + w/2 + dx;
			y = (p2[1] > y1 ? p1[1]+h : p1[1]);
		} else {
			var dy = Math.abs( (w*(p2[1]-y1)) / (2*(p2[0]-x1)) );
			
			dy = (p2[1] > y1 ? dy : -dy);
			y = p1[1] + h/2 + dy;
			x = (p2[0] > x1 ? p1[0]+w : p1[0]);
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
		var outLines = [], inLines = [];
		for(var i in lines){
			if(lines[i].toShapeId == nodeId){
				inLines.push(lines[i]);
			} else if(lines[i].fromShapeId == nodeId){
				outLines.push(lines[i]);
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

/*移除数组的指定索引的元素*/
Array.prototype.remove = function(i){
	this.splice(i,1);
};
/*内部使用 "===" 实现*/
Array.prototype.removeByEquals = function(target){
	for(var i=this.length-1 ; i>=0 ; i--){
		if(this[i] === target){
			this.remove(i);
		}
	}
};
/*字符串的第一个字母大写*/
String.prototype.firstUpcase = function(){	
	var str = this.toString();	
	return (str.substr(0,1).toUpperCase() + str.substr(1));
};

/*uml图对象*/
function DomainChar(name){
	this.project 		= null;
	this.name			= name;
	this.domainShapeDtos = null;
	this.lineDtos		= null;
}

/*线条数据结构*/
function Line(chartId,id,type,from,to,desc){
	this.lineId			= id;
	this.fromShapeId 	= from;
	this.toShapeId		= to;
	this.lineType 		= type;
	this.description	= desc;
	this.domainsChartId	= chartId;
}

/*节点数据结构*/
function DomainShape(id,charid,name,point,type,desc){
	this.shapeId		= id;
	this.position 		= point;
	this.shapeType		= type;
	this.name			= name;
	this.description	= desc;
	this.domainsChartId	= charid;
}

/****************************顶级数据结构****************************/

/*实体类*/
function EntityShape(id,charid,name,point,type,desc,isAbstract,isMapped){
	DomainShape.call(this, id,charid,name,point,type,desc); 		//继承DomainShap
	
	this.parentName			= null;			//父类
	this.implementsNameSet 	= [];			//实现（连线时接连产生，有可能要自动实现方法）
	
	this.properties 		= []; 			//属性数组（属性对象数组）
	this.actions			= []; 			//行为数组（行为对象数组）
	this.entityType 		= "ENTITY";
}

/*值对象*/
function ValueObject(id,charid,name,point,type,desc){
	DomainShape.call(this, id,charid,name,point,type,desc);
	
	this.name =  name;
}
/*接口类*/
function InterfaceShape(id,charid,name,point,type,desc){
	DomainShape.call(this, id,charid,name,point,type,desc);
	
	this.name 		= name;
	this.actions 	= [];	//
}
/*枚举*/
function EnumShape(id,charid,name,point,type,desc){
	DomainShape.call(this, id,charid,name,point,type,desc);
	this.enumItems = [];
}



/****************************二级数据结构****************************/
/*属性类*/
function Property(name, type){
	this.name 			= name;
	this.type 			= type;
	this.genericity		= null;
	this.relation		= null;
	this.nullable		= true;
	this.isUnique		= false;
	this.transientPro	= false;
	this.relation		= null;		//manytonone,manytomany...
}

/*常量类*/
function Constant(name ,type){
	this.name 	= name;
	this.type 	= type;
	this.value 	= null;
}
/*行为类*/
function Action(name ,returnType){
	this.name = name;
	this.type = returnType;
	this.parameters = [];
}

/*枚举项类*/
function EnumItem(name){
	this.name = name;
}

/****************************三级级数据结构****************************/
/*行为参数类*/
function Parameter(name ,type){
	this.name 	= name;
	this.type 	= type;
	this.number = null;
}

/*工程类*/
function Project(name){
	this.name = name;
}