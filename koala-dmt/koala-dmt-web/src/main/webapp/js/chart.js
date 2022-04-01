{
	"project": {
		"id": 1,
		"name": "first"
	},
	"id": "",
	"version": "",
	"name": "uml",
	"lineInfo": "[{\"lineId\":\"0b98933f471a4fe8b2bbac22d8b70e55\",\"fromShapeId\":\"f8ecc81d23645cb0f88ea9a54fd2abdf\",\"toShapeId\":\"0ec006ac3f493b85820a1c6213641cce\",\"relationType\":\"aggregate\",\"description\":null,\"lineType\":\"line_of_centers\",\"multiplicity\":{\"start\":{\"mapping\":\"1\",\"name\":\"\",\"position\":[]},\"end\":{\"mapping\":\"1\",\"name\":\"\",\"position\":[]}}},{\"lineId\":\"97204f3a451d511457d98ed402d27765\",\"fromShapeId\":\"12a769fea0713f5e415acac589ddc046\",\"toShapeId\":\"f8ecc81d23645cb0f88ea9a54fd2abdf\",\"relationType\":\"extends\",\"description\":null,\"lineType\":\"line_of_centers\"},{\"lineId\":\"410ea9987cbb4f241b6b269cecc146e4\",\"fromShapeId\":\"0ec006ac3f493b85820a1c6213641cce\",\"toShapeId\":\"12a769fea0713f5e415acac589ddc046\",\"relationType\":\"extends\",\"description\":null,\"lineType\":\"line_of_centers\"},{\"lineId\":\"bd7ac58a541e687248a6ae056726cfeb\",\"fromShapeId\":\"12a769fea0713f5e415acac589ddc046\",\"toShapeId\":\"f8ecc81d23645cb0f88ea9a54fd2abdf\",\"relationType\":\"aggregate\",\"description\":null,\"lineType\":\"turning_line\",\"multiplicity\":{\"start\":{\"mapping\":\"1\",\"name\":\"\",\"position\":[]},\"end\":{\"mapping\":\"1\",\"name\":\"\",\"position\":[]}},\"turningPoint\":[247,97],\"startPoint\":[\"339\",\"68.6923076923077\"],\"endPoint\":[\"247.9409090909091\",\"166\"]}]",
	"modelInfo": "[{\"shapeId\":\"f8ecc81d23645cb0f88ea9a54fd2abdf\",\"position\":{\"x\":199,\"y\":184},\"shapeType\":\"ENTITY\",\"name\":\"Entity1\",\"description\":\"\",\"domainsChartId\":0,\"parentName\":null,\"implementsNameSet\":[],\"properties\":[{\"name\":\"property1\",\"type\":\"String\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false},{\"name\":\"property2\",\"type\":\"String\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false},{\"name\":\"property3\",\"type\":\"Entity2\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false,\"autoBy\":\"0b98933f471a4fe8b2bbac22d8b70e55\"},{\"name\":\"property4\",\"type\":\"Entity3\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false,\"autoBy\":\"bd7ac58a541e687248a6ae056726cfeb\"}],\"entityType\":\"ENTITY\"},{\"shapeId\":\"0ec006ac3f493b85820a1c6213641cce\",\"position\":{\"x\":468,\"y\":154},\"shapeType\":\"ENTITY\",\"name\":\"Entity2\",\"description\":\"\",\"domainsChartId\":0,\"parentName\":\"Entity3\",\"implementsNameSet\":[],\"properties\":[{\"name\":\"property1\",\"type\":\"String\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false},{\"name\":\"property2\",\"type\":\"String\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false},{\"name\":\"property3\",\"type\":\"Entity1\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false,\"autoBy\":\"0b98933f471a4fe8b2bbac22d8b70e55\"}],\"entityType\":\"ENTITY\"},{\"shapeId\":\"12a769fea0713f5e415acac589ddc046\",\"position\":{\"x\":327,\"y\":7},\"shapeType\":\"ENTITY\",\"name\":\"Entity3\",\"description\":\"\",\"domainsChartId\":0,\"parentName\":\"Entity1\",\"implementsNameSet\":[],\"properties\":[{\"name\":\"property1\",\"type\":\"Entity1\",\"genericity\":null,\"relation\":null,\"nullable\":true,\"isUnique\":false,\"transientPro\":false,\"autoBy\":\"bd7ac58a541e687248a6ae056726cfeb\"}],\"entityType\":\"ENTITY\"}]",
	"domainShapeDtos": [
		{
			"shapeId": "f8ecc81d23645cb0f88ea9a54fd2abdf",
			"position": {
				"x": 199,
				"y": 184
			},
			"shapeType": "ENTITY",
			"name": "Entity1",
			"description": "",
			"domainsChartId": 0,
			"parentName": null,
			"implementsNameSet": [],
			"properties": [
				{
					"name": "property1",
					"type": "String",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false
				}, {
					"name": "property2",
					"type": "String",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false
				}, {
					"name": "property3",
					"type": "Entity2",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false,
					"autoBy": "0b98933f471a4fe8b2bbac22d8b70e55"
				}, {
					"name": "property4",
					"type": "Entity3",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false,
					"autoBy": "bd7ac58a541e687248a6ae056726cfeb"
				}
			],
			"entityType": "ENTITY"
		}, {
			"shapeId": "0ec006ac3f493b85820a1c6213641cce",
			"position": {
				"x": 468,
				"y": 154
			},
			"shapeType": "ENTITY",
			"name": "Entity2",
			"description": "",
			"domainsChartId": 0,
			"parentName": "Entity3",
			"implementsNameSet": [],
			"properties": [
				{
					"name": "property1",
					"type": "String",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false
				}, {
					"name": "property2",
					"type": "String",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false
				}, {
					"name": "property3",
					"type": "Entity1",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false,
					"autoBy": "0b98933f471a4fe8b2bbac22d8b70e55"
				}
			],
			"entityType": "ENTITY"
		}, {
			"shapeId": "12a769fea0713f5e415acac589ddc046",
			"position": {
				"x": 327,
				"y": 7
			},
			"shapeType": "ENTITY",
			"name": "Entity3",
			"description": "",
			"domainsChartId": 0,
			"parentName": "Entity1",
			"implementsNameSet": [],
			"properties": [
				{
					"name": "property1",
					"type": "Entity1",
					"genericity": null,
					"relation": null,
					"nullable": true,
					"isUnique": false,
					"transientPro": false,
					"autoBy": "bd7ac58a541e687248a6ae056726cfeb"
				}
			],
			"entityType": "ENTITY"
		}
	]
}