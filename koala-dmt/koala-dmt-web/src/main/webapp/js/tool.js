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
	findRelatedLines : function(nodeId, lines){
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
 * @param id 线条id
 * @param type 线条代表的关系（继承，实现，关联，聚合。。。）
 * @param from 线条的开始节点
 * @param to 线条的结束节点
 * @param desc 线条描述
 */
function Line(type, from, to, desc){
	this.id 			= commonTool.guid();
	this.fromShapeId 	= from;
	this.toShapeId		= to;
	this.relationType 	= type;
	this.description	= desc;
	this.lineType		= "line_of_centers";
	/*后续操作赋值*/
	this.points			= "";
	this.turningPoint;
}

/*关联箭头*/
function AssociatedLine(type, from, to, desc, startPosition, endPosition){
	Line.call(this, type, from, to, desc);
	
	this.multiplicity	= {
		start:{
			mapping : "1",
			name : "",
			position:{"left":0,"top":0} //left,top坐标
		},
		end:{
			mapping : "1",
			name : "",
			position:{} //left,top坐标
		}
	};
}


/**
 * 节点数据结构
 * @param id 
 * @param name
 * @param position
 * @param type
 * @param desc
 */
function DomainShape(name, position, type, desc){
	this.id				= commonTool.guid();
	this.position 		= position;
	this.shapeType		= type;
	this.name			= name;
	this.description	= desc;
}

/****************************顶级数据结构****************************/
/**
 * 实体类
 * @param id
 * @param name
 * @param position
 * @param type
 * @param desc
 * @param isAbstract
 * @param isMapped
 */
function EntityShape(name,position,type,desc,isAbstract,isMapped){
	DomainShape.call(this, name, position, type, desc); 		//继承DomainShap
	
	this.parentId			= null;
	this.parentName			= null;			//父类
	
	this.implementsIdSet	= [];			//实现列表
	this.implementsNameSet 	= [];			//实现（连线时接连产生，有可能要自动实现方法）
	
	this.properties 		= []; 			//属性数组（属性对象数组）
	this.actions			= [];
	this.entityType 		= "ENTITY";
}

/*接口类*/
function InterfaceShape(name, position, type, desc){
	DomainShape.call(this, name, position, type, desc);
	this.actions 	= [];
}

/*枚举*/
function EnumShape(name, position, type, desc){
	DomainShape.call(this, name, position, type, desc);
	this.enumItems = [];
}

/****************************二级数据结构****************************/
/*属性类*/
function Property(name, type, autoBy){
	this.id				= commonTool.guid();
	this.name 			= name;
	this.type 			= type;
	this.genericity		= null;
	this.relation		= null;
	this.nullable		= true;
	this.isUnique		= false;
	this.transientPro	= false;
	this.autoBy 		= autoBy;	//根据关联关系生成的属性，将拥有关联线的id
	this.relation		= null;		//manytonone,manytomany...
}

/*行为类*/
function Action(name){
	this.id			= commonTool.guid();
	this.name 		= name;
	this.returnType = "void";
	this.modifier 	= "public";
	this.arguments 	= [];
}

/*枚举项类*/
function EnumItem(name){
	this.id		= commonTool.guid();
	this.name 	= name;
}

/****************************三级级数据结构****************************/
/*行为参数类*/
function Argument(name ,type){
	this.id			= commonTool.guid();
	this.name 		= name;
	this.type 		= type;
	this.genericity = null;
}

/*工程类*/
function Project(name){
	this.name = name;
}
