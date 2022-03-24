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
	moveLine : function(line, start, end, turningPoint){
		line.children("polyline").attr("points", 
			start[0] 	+ "," + start[1] 	+ " " +
			end[0] 		+ "," + end[1] 		+ " ");
	},
	
	/*
	 * 重构所有连向某个结点的线的显示，传参结构为nodes数组的一个单元结构
	 * node:被拖动的节点
	 * nodes:当前画布上的所有节点（dom元素）
	 * lines:当前画布上的多有线条（dom元素）
	 * outs:所有从被拖动节点连出的箭头
	 * ins:所有指向被拖动节点的箭头
	 */
	resetLines : function(node, nodes, lines, outs, ins) {
		var endpoints;
		//dy = DELTA left
		//dx = DELTA top
		var Deg, dx, dy,lineId;
		
		/*重画指出的线*/
		for(var i=outs.length-1 ; i>=0 ; i--){
			lineId = outs[i].lineId;
			if(outs[i].lineType == "line_of_centers"){//连心线
				endpoints = this.getEndpoints(node, nodes[outs[i].toShapeId]);
				this.moveLine(lines[outs[i].lineId], endpoints.start, endpoints.end);
			} else if(outs[i].lineType == "turning_line"){ //手动折线
				endpoints = this.getEndpoints(node, outs[i].turningPoint);
				var points = lines[outs[i].lineId].children("polyline").attr("points").split(" ");
				points[0] = endpoints.start.join();
				lines[outs[i].lineId].children("polyline").attr("points", points.join(" "));
			}
			Deg = this.getDeg(endpoints.end[1] - endpoints.start[1], endpoints.end[0] - endpoints.start[0]);
			
			dy = Math.sin(Deg)*30-10;
			dx = Math.cos(Deg)*30-10;
			$("#"+lineId+" .start").css({
				top:endpoints.start[1] + dy,
				left:endpoints.start[0] + dx
			});
			
			if(outs[i].lineType != "turning_line"){
				dy = Math.sin(Deg+Math.PI)*30 -10;
				dx = Math.cos(Deg+Math.PI)*30 -10;
				$("#" + lineId + " .end").css({
					top : endpoints.end[1] + dy,
					left : endpoints.end[0] + dx
				});
			}
		}
		
		/*重画指入的线*/
		for(var i=ins.length-1 ; i>=0 ; i--){
			lineId = ins[i].lineId;
			if(ins[i].lineType == "line_of_centers"){//连心线
				endpoints = this.getEndpoints(nodes[ins[i].fromShapeId], node);
				this.moveLine(lines[ins[i].lineId],endpoints.start, endpoints.end);
			} else if(ins[i].lineType == "turning_line"){ //手动折线
				endpoints = this.getEndpoints(ins[i].turningPoint, node);
				var points = lines[ins[i].lineId].children("polyline").attr("points").split(" ");
				points[2] = endpoints.end.join();
				lines[ins[i].lineId].children("polyline").attr("points", points.join(" "));
			}
			
			Deg = this.getDeg(endpoints.end[1] - endpoints.start[1], endpoints.end[0] - endpoints.start[0]);
			if(ins[i].lineType != "turning_line"){
				dy = Math.sin(Deg)*30-10;
				dx = Math.cos(Deg)*30-10;
				$("#"+lineId+" .start").css({
					top:endpoints.start[1] + dy,
					left:endpoints.start[0] + dx
				});
			}
			
			dy = Math.sin(Deg + Math.PI)*30 - 10;
			dx = Math.cos(Deg + Math.PI)*30 - 10;
			$("#"+lineId+" .end").css({
				top:endpoints.end[1] + dy,
				left : endpoints.end[0] + dx
			});
		}
	},
	
	/*获取角度*/
	getDeg : function(dx, dy){
		var sin = dx / Math.sqrt(dx*dx + dy*dy);
		var Deg = Math.abs(Math.asin(sin));
		
		if(dx > 0){
			if(dy < 0){
				Deg = Math.PI - Deg;
			}
		} else if(dx < 0){
			if(dy < 0){
				Deg = Math.PI + Deg;
			} else if(dy > 0){
				Deg = 2*Math.PI - Deg
			}
		}
		
		return Deg;
	},
		
	/**
	 * 拖动线段生成转折点
	 * startNode:开始节点
	 * endNode:结束节点
	 * turningPoint:转折点
	 * line:线段
	 */
	dragLine : function(startNode, endNode, turningPoint, line){
		var arr = this.getEndpoints(startNode, turningPoint);
		line.attr("points", 
			this.getEndpoints(startNode, turningPoint).start.join() + 
			" " + 
			turningPoint.join() + 
			" " + 
			this.getEndpoints(turningPoint, endNode).end.join())
	},
	
	/*
	 * 计算连线的起点和终点
	 * 1.点和矩形连线
	 * 2.矩形和矩形连线
	 * 
	 * 返回值:{
	 * 		start:[],
	 * 		end:[]
	 * }
	 */
	getEndpoints : function(startPoint, endPoint){
		var start , end , center;
		
		/*
		 * 在获取起点之前，要先知道第二个节点中心
		 * （其实是知道任意一个节点的中心点）
		 */
		if(endPoint instanceof Array){ //如果是数组，说endPoint是点
			center = [endPoint[0] ,endPoint[1]];
		} else { //否则是矩形，计算中心点
			var p2 = endPoint.position();
			center = [p2.left+endPoint.width()/2 , p2.top+endPoint.height()/2];
		}
		
		/*获取起点*/
		if(startPoint instanceof Array){ //如果是数组，说endPoint是点
			start = startPoint;
		} else { //
			var p1 = startPoint.position();
			start = this.getPoint([p1.left, p1.top],startPoint.outerWidth(),startPoint.outerHeight(),center);
		}
		
		/*获取终点*/
		if(endPoint instanceof Array){
			end = endPoint;
		} else {
			var p2 = endPoint.position();
			end = this.getPoint([p2.left, p2.top],endPoint.outerWidth(),endPoint.outerHeight(),start);
		}
		
		return {
			"start" : start,
			"end" 	: end
		};
	},
	
	/**
	 * 在矩形中心与矩形外任意一点作连心线时，获取该连线与矩形的边的交点
	 * p1：矩形左上角坐标，数组
	 * w：矩形的width
	 * h：矩形的height
	 * p2：矩形外的点，数组
	 */
	getPoint : function(p1, w, h, p2){
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
		
		return [x, y];
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

/**
 * 线条数据结构
 * @param chartId
 * @param id 线条id
 * @param type 线条代表的关系（继承，实现，关联，聚合。。。）
 * @param from 线条的开始节点
 * @param to 线条的结束节点
 * @param desc 线条描述
 */
function Line(chartId, id, type, from, to, desc){
	this.lineId			= id;
	this.fromShapeId 	= from;
	this.toShapeId		= to;
	this.relationType 	= type;
	this.description	= desc;
	this.domainsChartId	= chartId;
	this.lineType		= "line_of_centers";
	/*后续操作赋值*/
	this.points;
	this.turningPoint;
}

/*关联箭头*/
function AssociatedLine(chartId, id, type, from, to, desc){
	Line.call(this, chartId, id, type, from, to, desc);
	this.multiplicity	= {
		test : "1",
		type : "",
		name : "",
		left : 0,
		top : 0
	};
}

/*节点数据结构*/
function DomainShape(id, charid, name, point, type, desc){
	this.shapeId		= id;
	this.position 		= point;
	this.shapeType		= type;
	this.name			= name;
	this.description	= desc;
	this.domainsChartId	= charid;
}

/****************************顶级数据结构****************************/
/**
 * 实体类
 * @param id
 * @param charid
 * @param name
 * @param point
 * @param type
 * @param desc
 * @param isAbstract
 * @param isMapped
 */
function EntityShape(id,charid,name,point,type,desc,isAbstract,isMapped){
	DomainShape.call(this, id,charid,name,point,type,desc); 		//继承DomainShap
	
	this.parentName			= null;			//父类
	this.implementsNameSet 	= [];			//实现（连线时接连产生，有可能要自动实现方法）
	
	this.properties 		= []; 			//属性数组（属性对象数组）
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
//	this.actions 	= [];	//
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
