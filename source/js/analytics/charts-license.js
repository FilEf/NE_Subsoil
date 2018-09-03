AmCharts.makeChart("chartdivLG1", {
    type: "serial",
    categoryField: "category",
    startDuration: 1,
    fontSize: 14,
    thousandsSeparator: " ",
    theme: "default",
    categoryAxis: {
        gridPosition: "start"
    },
    trendLines: [],
    graphs: [
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          id: "AmGraph-1",
          title: "Выдано лицензий по результатам конкурса",
          type: "column",
          valueField: "column-1"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          id: "AmGraph-2",
          title: "Выдано лицензий по результатам аукциона",
          type: "column",
          valueField: "column-2"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          id: "AmGraph-3",
          title: "Выдано лицензий без конкурса для геологического изучения",
          type: "column",
          valueField: "column-3"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          fillColors: "#E994E0",
          id: "AmGraph-4",
          lineColor: "#E994E0",
          title: "Выдано лицензий в порядке переоформления (ст.17-1",
          type: "column",
          valueField: "column-4"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          fillColors: "#27CEDE",
          id: "AmGraph-5",
          lineColor: "#27CEDE",
          title:
            'Выдано лицензий по п.19 "Положения о порядке лицензирования пользования недрами"',
          type: "column",
          valueField: "column-5"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          fillColors: "#9DBC6F",
          id: "AmGraph-6",
          lineColor: "#9DBC6F",
          title:
            'Выдано лицензий в соответствии с ФЗ "О соглашениях о разделе продукции"',
          type: "column",
          valueField: "column-6"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          fillColors: "#F0C083",
          id: "AmGraph-7",
          lineColor: "#F0C083",
          title: "Выдано лицензий при установлении факта открытия месторождения",
          type: "column",
          valueField: "column-7"
      },
      {
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          fillAlphas: 1,
          fillColors: "#DEE38F",
          id: "AmGraph-8",
          lineColor: "#DEE38F",
          title: "Другие основания в соответствии с законодательством РФ",
          type: "column",
          valueField: "column-8"
      },
      {
          animationPlayed: true,
          balloonText:
            '[[title]] в [[category]]: <br><span style="font-size:18px"><b>[[value]]</b></span>',
          bullet: "round",
          bulletSize: 10,
          id: "AmGraph-9",
          lineThickness: 2,
          title: "Выдано лицензий за отчетный период",
          valueField: "column-9"
      }
    ],
    guides: [],
    valueAxes: [
      {
          id: "ValueAxis-1",
          stackType: "regular",
          title: "кол-во"
      }
    ],
    allLabels: [],
    balloon: {},
    legend: {
        enabled: true,
        fontSize: 10,
        useGraphSettings: true
    },
    titles: [
      {
          id: "Title-1",
          size: 18,
          text:
            "Сведения о кол-ве выданных лицензий с основанием выдачи за 2004-2016 гг."
      }
    ],
    dataProvider: [
      {
          category: "2004",
          "column-1": "159",
          "column-2": "163",
          "column-3": "421",
          "column-4": "1283",
          "column-5": "201",
          "column-6": "1",
          "column-7": "42",
          "column-8": "747",
          "column-9": "3017"
      },
      {
          category: "2005",
          "column-1": "130",
          "column-2": "505",
          "column-3": "267",
          "column-4": "981",
          "column-5": "94",
          "column-6": "3",
          "column-7": "25",
          "column-8": "1073",
          "column-9": "3078"
      },
      {
          category: "2006",
          "column-1": "83",
          "column-2": "517",
          "column-3": "414",
          "column-4": "974",
          "column-5": "82",
          "column-6": "",
          "column-7": "38",
          "column-8": "915",
          "column-9": "3023"
      },
      {
          category: "2007",
          "column-1": "89",
          "column-2": "515",
          "column-3": "312",
          "column-4": "973",
          "column-5": "",
          "column-6": "",
          "column-7": "76",
          "column-8": "1162",
          "column-9": "3127"
      },
      {
          category: "2008",
          "column-1": "64",
          "column-2": "328",
          "column-3": "204",
          "column-4": "1007",
          "column-5": "",
          "column-6": "",
          "column-7": "31",
          "column-8": "847",
          "column-9": "2481"
      },
      {
          category: "2009",
          "column-1": "13",
          "column-2": "80",
          "column-3": "241",
          "column-4": "596",
          "column-5": "",
          "column-6": "",
          "column-7": "39",
          "column-8": "931",
          "column-9": "1900"
      },
      {
          category: "2010",
          "column-1": "24",
          "column-2": "338",
          "column-3": "179",
          "column-4": "618",
          "column-5": "59",
          "column-6": "",
          "column-7": "97",
          "column-8": "920",
          "column-9": "2235"
      },
      {
          category: "2011",
          "column-1": "25",
          "column-2": "352",
          "column-3": "286",
          "column-4": "600",
          "column-5": "69",
          "column-6": "",
          "column-7": "37",
          "column-8": "1075",
          "column-9": "2444"
      },
      {
          category: "2012",
          "column-1": "51",
          "column-2": "332",
          "column-3": "339",
          "column-4": "500",
          "column-5": "117",
          "column-6": "",
          "column-7": "31",
          "column-8": "1215",
          "column-9": "2585"
      },
      {
          category: "2013",
          "column-1": "29",
          "column-2": "415",
          "column-3": "479",
          "column-4": "463",
          "column-5": "85",
          "column-6": "0",
          "column-7": "56",
          "column-8": "1063",
          "column-9": "2590"
      },
      {
          category: "2014",
          "column-1": "22",
          "column-2": "401",
          "column-3": "469",
          "column-4": "623",
          "column-5": "57",
          "column-6": "0",
          "column-7": "48",
          "column-8": "984",
          "column-9": "2604"
      },
      {
          category: "2015",
          "column-1": "27",
          "column-2": "375",
          "column-3": "564",
          "column-4": "684",
          "column-5": "106",
          "column-6": "0",
          "column-7": "28",
          "column-8": "1258",
          "column-9": "3042"
      },
      {
          category: "2016",
          "column-1": "23",
          "column-2": "349",
          "column-3": "661",
          "column-4": "1485",
          "column-5": "34",
          "column-6": "0",
          "column-7": "38",
          "column-8": "1140",
          "column-9": "3730"
      }
    ]
});

AmCharts.makeChart("chartdivLG2", {
    "type": "serial",
    "categoryField": "category",
    "startDuration": 1,
    "fontSize": 15,
    "theme": "light",
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-1",
		    "labelText": "[[value]]",
		    "title": "Всего лицензий",
		    "type": "column",
		    "valueField": "column-1"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 20,
		    "text": "Распределение количества действующих лицензий по годам в 2003-2017 гг."
		}
    ],
    "dataProvider": [
		{
		    "category": "2003",
		    "column-1": "13571"
		},
		{
		    "category": "2004",
		    "column-1": "13883"
		},
		{
		    "category": "2005",
		    "column-1": "14311"
		},
		{
		    "category": "2006",
		    "column-1": "15130"
		},
		{
		    "category": "2007",
		    "column-1": "15752"
		},
		{
		    "category": "2008",
		    "column-1": "15791"
		},
		{
		    "category": "2009",
		    "column-1": "15675"
		},
		{
		    "category": "2010",
		    "column-1": "15702"
		},
		{
		    "category": "2011",
		    "column-1": "15942"
		},
		{
		    "category": "2012",
		    "column-1": "16393"
		},
		{
		    "category": "2013",
		    "column-1": "17071"
		},
		{
		    "category": "2014",
		    "column-1": "17549"
		},
		{
		    "category": "2015",
		    "column-1": "14928"
		},
		{
		    "category": "2016",
		    "column-1": "15664"
		},
		{
		    "category": "2017",
		    "column-1": "16258"
		}
    ]
});

AmCharts.makeChart("chartdivLG3", {
    "type": "serial",
    "categoryField": "category",
    "columnSpacing": 4,
    "startDuration": 1,
    "fontSize": 15,
    "theme": "light",
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-1",
		    "labelText": "[[value]]",
		    "title": "Лицензиии на разведку и добычу ",
		    "type": "column",
		    "valueField": "column-1"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-2",
		    "labelText": "[[value]]",
		    "title": "Лицензии на поиск, оценку, разведку и добычу ",
		    "type": "column",
		    "valueField": "column-2"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletAlpha": 0,
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "gapPeriod": 1,
		    "id": "AmGraph-3",
		    "labelOffset": 4,
		    "labelText": "[[value]]",
		    "legendAlpha": 0,
		    "tabIndex": 0,
		    "title": "Лицензии на поиск",
		    "type": "column",
		    "valueField": "column-3"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 20,
		    "text": "Распределение действующих лицензий на драгоценные металлы по годам и виду пользования недрами"
		}
    ],
    "dataProvider": [
		{
		    "category": "2003",
		    "column-1": "1673",
		    "column-2": "1022",
		    "column-3": "400"
		},
		{
		    "category": "2004",
		    "column-1": "1622",
		    "column-2": "1011",
		    "column-3": "354"
		},
		{
		    "category": "2005",
		    "column-1": "1554",
		    "column-2": "1051",
		    "column-3": "338"
		},
		{
		    "category": "2006",
		    "column-1": "1474",
		    "column-2": "1079",
		    "column-3": "334"
		},
		{
		    "category": "2007",
		    "column-1": "1381",
		    "column-2": "1106",
		    "column-3": "315"
		},
		{
		    "category": "2008",
		    "column-1": "1235",
		    "column-2": "1039",
		    "column-3": "262"
		},
		{
		    "category": "2009",
		    "column-1": "1144",
		    "column-2": "948",
		    "column-3": "233"
		},
		{
		    "category": "2010",
		    "column-1": "1101",
		    "column-2": "1016",
		    "column-3": "191"
		},
		{
		    "category": "2011",
		    "column-1": "1045",
		    "column-2": "1083",
		    "column-3": "146"
		},
		{
		    "category": "2012",
		    "column-1": "1040",
		    "column-2": "1155",
		    "column-3": "167"
		},
		{
		    "category": "2013",
		    "column-1": "1087",
		    "column-2": "1242",
		    "column-3": "163"
		},
		{
		    "category": "2014",
		    "column-1": "1145",
		    "column-2": "1273",
		    "column-3": "141"
		},
		{
		    "category": "2015",
		    "column-1": "1133",
		    "column-2": "1365",
		    "column-3": "302"
		},
		{
		    "category": "2016",
		    "column-1": "1126",
		    "column-2": "1411",
		    "column-3": "609"
		},
		{
		    "category": "2017",
		    "column-1": "1167",
		    "column-2": "1424",
		    "column-3": "851"
		}
    ]
});

AmCharts.makeChart("chartdivLG4", {
    "type": "serial",
    "categoryField": "category",
    "columnSpacing": 4,
    "startDuration": 1,
    "fontSize": 15,
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-1",
		    "labelText": "[[value]]",
		    "title": "Лицензии на поиск",
		    "type": "column",
		    "valueField": "column-1"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-2",
		    "labelText": "[[value]]",
		    "title": "Лицензии на разведку и добычу ",
		    "type": "column",
		    "valueField": "column-2"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletAlpha": 0,
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "gapPeriod": 1,
		    "id": "AmGraph-3",
		    "labelOffset": 4,
		    "labelText": "[[value]]",
		    "legendAlpha": 0,
		    "tabIndex": 0,
		    "title": "Лицензии на на поиск, оценку, разведку и добычу ",
		    "type": "column",
		    "valueField": "column-3"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 20,
		    "text": "Распределение действующих лицензий на драгоценные камни и кристаллы  по годам и виду пользования недрами  \t\t"
		}
    ],
    "dataProvider": [
		{
		    "category": "2003",
		    "column-1": "53",
		    "column-2": "34",
		    "column-3": "17"
		},
		{
		    "category": "2004",
		    "column-1": "69",
		    "column-2": "36",
		    "column-3": "15"
		},
		{
		    "category": "2005",
		    "column-1": "101",
		    "column-2": "38",
		    "column-3": "11"
		},
		{
		    "category": "2006",
		    "column-1": "148",
		    "column-2": "39",
		    "column-3": "15"
		},
		{
		    "category": "2007",
		    "column-1": "123",
		    "column-2": "39",
		    "column-3": "14"
		},
		{
		    "category": "2008",
		    "column-1": "103",
		    "column-2": "39",
		    "column-3": "20"
		},
		{
		    "category": "2009",
		    "column-1": "92",
		    "column-2": "38",
		    "column-3": "18"
		},
		{
		    "category": "2010",
		    "column-1": "77",
		    "column-2": "35",
		    "column-3": "18"
		},
		{
		    "category": "2011",
		    "column-1": "47",
		    "column-2": "41",
		    "column-3": "16"
		},
		{
		    "category": "2012",
		    "column-1": "35",
		    "column-2": "39",
		    "column-3": "15"
		},
		{
		    "category": "2013",
		    "column-1": "33",
		    "column-2": "38",
		    "column-3": "12"
		},
		{
		    "category": "2014",
		    "column-1": "38",
		    "column-2": "39",
		    "column-3": "12"
		},
		{
		    "category": "2015",
		    "column-1": "33",
		    "column-2": "35",
		    "column-3": "14"
		},
		{
		    "category": "2016",
		    "column-1": "42",
		    "column-2": "37",
		    "column-3": "17"
		},
		{
		    "category": "2017",
		    "column-1": "60",
		    "column-2": "41",
		    "column-3": "19"
		}
    ]
});

AmCharts.makeChart("chartdivLG5", {
    "type": "serial",
	"categoryField": "category",
	"columnSpacing": 4,
	"startDuration": 1,
	"fontSize": 15,
	"theme": "light",
	"thousandsSeparator": " ",
	"categoryAxis": {
		"gridPosition": "start"
	},
	"trendLines": [],
	"graphs": [
		{
			"balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
			"bulletColor": "",
			"fillAlphas": 1,
			"fontSize": 10,
			"id": "AmGraph-1",
			"labelText": "[[value]]",
			"title": "Лицензии  на разведку и добычу ",
			"type": "column",
			"valueField": "column-1"
		},
		{
			"balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
			"fillAlphas": 1,
			"fontSize": 10,
			"id": "AmGraph-2",
			"labelText": "[[value]]",
			"title": "Лицензии  на поиски, оценку, разведку и добычу ",
			"type": "column",
			"valueField": "column-2"
		},
		{
			"balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
			"bulletAlpha": 0,
			"bulletColor": "",
			"fillAlphas": 1,
			"fontSize": 10,
			"gapPeriod": 1,
			"id": "AmGraph-3",
			"labelOffset": 4,
			"labelText": "[[value]]",
			"legendAlpha": 0,
			"tabIndex": 0,
			"title": "Лицензии  на поиск",
			"type": "column",
			"valueField": "column-3"
		}
	],
	"guides": [],
	"valueAxes": [
		{
			"id": "ValueAxis-1",
			"title": "кол-во"
		}
	],
	"allLabels": [],
	"balloon": {},
	"legend": {
		"enabled": true,
		"useGraphSettings": true
	},
	"titles": [
		{
			"id": "Title-1",
			"size": 20,
			"text": "Распределение действующих лицензий на твердые полезные ископаемые по годам и виду пользования недрами  "
		}
	],
	"dataProvider": [
		{
			"category": "2003",
			"column-1": "717",
			"column-2": "159",
			"column-3": "127"
		},
		{
			"category": "2004",
			"column-1": "694",
			"column-2": "148",
			"column-3": "103"
		},
		{
			"category": "2005",
			"column-1": "690",
			"column-2": "139",
			"column-3": "105"
		},
		{
			"category": "2006",
			"column-1": "721",
			"column-2": "177",
			"column-3": "121"
		},
		{
			"category": "2007",
			"column-1": "805",
			"column-2": "189",
			"column-3": "180"
		},
		{
			"category": "2008",
			"column-1": "807",
			"column-2": "170",
			"column-3": "209"
		},
		{
			"category": "2009",
			"column-1": "782",
			"column-2": "161",
			"column-3": "201"
		},
		{
			"category": "2010",
			"column-1": "785",
			"column-2": "141",
			"column-3": "210"
		},
		{
			"category": "2011",
			"column-1": "778",
			"column-2": "145",
			"column-3": "217"
		},
		{
			"category": "2012",
			"column-1": "770",
			"column-2": "152",
			"column-3": "235"
		},
		{
			"category": "2013",
			"column-1": "758",
			"column-2": "146",
			"column-3": "271"
		},
		{
			"category": "2014",
			"column-1": "765",
			"column-2": "143",
			"column-3": "308"
		},
		{
			"category": "2015",
			"column-1": "758",
			"column-2": "188",
			"column-3": "305"
		},
		{
			"category": "2016",
			"column-1": "758",
			"column-2": "198",
			"column-3": "304"
		},
		{
			"category": "2017",
			"column-1": "754",
			"column-2": "210",
			"column-3": "292"
		}
	]
});

AmCharts.makeChart("chartdivLG6", {
    "type": "serial",
    "categoryField": "category",
    "startDuration": 1,
    "fontSize": 14,
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "id": "AmGraph-1",
		    "title": "Истечение установленного срока действия",
		    "type": "column",
		    "valueField": "column-1"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "",
		    "id": "AmGraph-2",
		    "title": "Отказ владельца",
		    "type": "column",
		    "valueField": "column-2"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "id": "AmGraph-3",
		    "title": "Невыполнение условий пользования недрами",
		    "type": "column",
		    "valueField": "column-3"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "#E994E0",
		    "id": "AmGraph-4",
		    "lineColor": "#E994E0",
		    "title": "Ликвидация предприятия",
		    "type": "column",
		    "valueField": "column-4"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "#FEFF85",
		    "id": "AmGraph-5",
		    "lineColor": "#FEFF85",
		    "title": "В связи с переоформлением",
		    "type": "column",
		    "valueField": "column-5"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "#EBBEE9",
		    "id": "AmGraph-6",
		    "lineColor": "#EBBEE9",
		    "title": "Решение суда",
		    "type": "column",
		    "valueField": "column-6"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "#F0C083",
		    "id": "AmGraph-7",
		    "lineColor": "#F0C083",
		    "title": "Прочие",
		    "type": "column",
		    "valueField": "column-7"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "fillAlphas": 1,
		    "fillColors": "#C1DDE0",
		    "id": "AmGraph-8",
		    "lineColor": "#C1DDE0",
		    "title": "Другие основания в соответствии с законодательством РФ",
		    "type": "column",
		    "valueField": "column-8"
		},
		{
		    "animationPlayed": true,
		    "balloonText": "[[title]] в [[category]]: <span style=\"font-size:18px\"><b>[[value]]</b></span>",
		    "bullet": "round",
		    "bulletSize": 10,
		    "id": "AmGraph-9",
		    "lineThickness": 2,
		    "title": "Аннулировано лицензий за отчетный период ",
		    "valueField": "column-9"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "stackType": "regular",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "fontSize": 10,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 18,
		    "text": "Распределение аннулированных лицензий по годам и причинам прекращения действия за 2004-2016 гг. по РФ"
		}
    ],
    "dataProvider": [
		{
		    "category": "2004",
		    "column-1": "773",
		    "column-2": "356",
		    "column-3": "132",
		    "column-4": "74",
		    "column-5": "1285",
		    "column-6": "5",
		    "column-8": "80",
		    "column-9": "2705"
		},
		{
		    "category": "2005",
		    "column-1": "793",
		    "column-2": "472",
		    "column-3": "165",
		    "column-4": "102",
		    "column-5": "982",
		    "column-6": "6",
		    "column-8": "130",
		    "column-9": "2650"
		},
		{
		    "category": "2006",
		    "column-1": "551",
		    "column-2": "398",
		    "column-3": "126",
		    "column-4": "83",
		    "column-5": "965",
		    "column-6": "6",
		    "column-8": "75",
		    "column-9": "2204"
		},
		{
		    "category": "2007",
		    "column-1": "532",
		    "column-2": "518",
		    "column-3": "163",
		    "column-4": "92",
		    "column-5": "953",
		    "column-6": "7",
		    "column-8": "240",
		    "column-9": "2505"
		},
		{
		    "category": "2008",
		    "column-1": "636",
		    "column-2": "432",
		    "column-3": "189",
		    "column-4": "84",
		    "column-5": "999",
		    "column-6": "9",
		    "column-8": "93",
		    "column-9": "2442"
		},
		{
		    "category": "2009",
		    "column-1": "648",
		    "column-2": "417",
		    "column-3": "158",
		    "column-4": "101",
		    "column-5": "582",
		    "column-6": "3",
		    "column-8": "107",
		    "column-9": "2016"
		},
		{
		    "category": "2010",
		    "column-1": "824",
		    "column-2": "432",
		    "column-3": "112",
		    "column-4": "166",
		    "column-5": "618",
		    "column-6": "13",
		    "column-8": "43",
		    "column-9": "2208"
		},
		{
		    "category": "2011",
		    "column-1": "806",
		    "column-2": "558",
		    "column-3": "85",
		    "column-4": "104",
		    "column-5": "600",
		    "column-6": "2",
		    "column-8": "49",
		    "column-9": "2204"
		},
		{
		    "category": "2012",
		    "column-1": "910",
		    "column-2": "482",
		    "column-3": "106",
		    "column-4": "83",
		    "column-5": "500",
		    "column-6": "4",
		    "column-8": "49",
		    "column-9": "2134"
		},
		{
		    "category": "2013",
		    "column-1": "800",
		    "column-2": "507",
		    "column-3": "52",
		    "column-4": "51",
		    "column-5": "463",
		    "column-6": "10",
		    "column-8": "29",
		    "column-9": "1912"
		},
		{
		    "category": "2014",
		    "column-1": "847",
		    "column-2": "474",
		    "column-3": "87",
		    "column-4": "37",
		    "column-5": "623",
		    "column-6": "0",
		    "column-8": "58",
		    "column-9": "2126"
		},
		{
		    "category": "2015",
		    "column-1": "959",
		    "column-2": "400",
		    "column-3": "99",
		    "column-4": "43",
		    "column-5": "684",
		    "column-6": "1",
		    "column-8": "3477",
		    "column-9": "5663"
		},
		{
		    "category": "2016",
		    "column-1": "467",
		    "column-2": "550",
		    "column-3": "134",
		    "column-4": "45",
		    "column-5": "1485",
		    "column-6": "2",
		    "column-8": "235",
		    "column-9": "2918"
		}
    ]
});

AmCharts.makeChart("chartdivLO1", {
    "type": "serial",
    "categoryField": "category",
    "columnSpacing": 4,
    "startDuration": 1,
    "fontSize": 15,
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-1",
		    "labelText": "[[value]]",
		    "title": "Лицензии  на разведку и добычу ",
		    "type": "column",
		    "valueField": "column-1"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-2",
		    "labelText": "[[value]]",
		    "title": "Лицензии  на поиск",
		    "type": "column",
		    "valueField": "column-2"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletAlpha": 0,
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "gapPeriod": 1,
		    "id": "AmGraph-3",
		    "labelOffset": 4,
		    "labelText": "[[value]]",
		    "legendAlpha": 0,
		    "tabIndex": 0,
		    "title": "Лицензии  на поиски, оценку, разведку и добычу  ",
		    "type": "column",
		    "valueField": "column-3"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 20,
		    "text": "Распределение действующих лицензий на углеводородное сырье по годам и виду пользования недрами  "
		}
    ],
    "dataProvider": [
		{
		    "category": "2003",
		    "column-1": "1763",
		    "column-2": "522",
		    "column-3": "288"
		},
		{
		    "category": "2004",
		    "column-1": "1779",
		    "column-2": "660",
		    "column-3": "278"
		},
		{
		    "category": "2005",
		    "column-1": "1803",
		    "column-2": "558",
		    "column-3": "321"
		},
		{
		    "category": "2006",
		    "column-1": "1839",
		    "column-2": "634",
		    "column-3": "454"
		},
		{
		    "category": "2007",
		    "column-1": "1892",
		    "column-2": "694",
		    "column-3": "558"
		},
		{
		    "category": "2008",
		    "column-1": "1924",
		    "column-2": "668",
		    "column-3": "643"
		},
		{
		    "category": "2009",
		    "column-1": "1934",
		    "column-2": "610",
		    "column-3": "671"
		},
		{
		    "category": "2010",
		    "column-1": "2018",
		    "column-2": "546",
		    "column-3": "725"
		},
		{
		    "category": "2011",
		    "column-1": "2033",
		    "column-2": "505",
		    "column-3": "748"
		},
		{
		    "category": "2012",
		    "column-1": "2043",
		    "column-2": "499",
		    "column-3": "775"
		},
		{
		    "category": "2013",
		    "column-1": "2051",
		    "column-2": "510",
		    "column-3": "832"
		},
		{
		    "category": "2014",
		    "column-1": "2077",
		    "column-2": "483",
		    "column-3": "853"
		},
		{
		    "category": "2015",
		    "column-1": "2081",
		    "column-2": "507",
		    "column-3": "913"
		},
		{
		    "category": "2016",
		    "column-1": "2091",
		    "column-2": "514",
		    "column-3": "991"
		},
		{
		    "category": "2017",
		    "column-1": "2101",
		    "column-2": "518",
		    "column-3": "1034"
		}
    ]
});

AmCharts.makeChart("chartdivLCO1", {
    "type": "serial",
    "categoryField": "category",
    "columnSpacing": 4,
    "startDuration": 1,
    "fontSize": 15,
    "theme": "light",
    "thousandsSeparator": " ",
    "categoryAxis": {
        "gridPosition": "start"
    },
    "trendLines": [],
    "graphs": [
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-1",
		    "labelText": "[[value]]",
		    "title": "Лицензии  на разведку и добычу ",
		    "type": "column",
		    "valueField": "column-1"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "id": "AmGraph-2",
		    "labelText": "[[value]]",
		    "title": "Лицензии  на поиск",
		    "type": "column",
		    "valueField": "column-2"
		},
		{
		    "balloonText": "[[title]] в [[category]]: <br><b>[[value]]</b>",
		    "bulletAlpha": 0,
		    "bulletColor": "",
		    "fillAlphas": 1,
		    "fontSize": 10,
		    "gapPeriod": 1,
		    "id": "AmGraph-3",
		    "labelOffset": 4,
		    "labelText": "[[value]]",
		    "legendAlpha": 0,
		    "tabIndex": 0,
		    "title": "Лицензии  на поиски, оценку, разведку и добычу  ",
		    "type": "column",
		    "valueField": "column-3"
		}
    ],
    "guides": [],
    "valueAxes": [
		{
		    "id": "ValueAxis-1",
		    "title": "кол-во"
		}
    ],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [
		{
		    "id": "Title-1",
		    "size": 20,
		    "text": "Распределение действующих лицензий на уголь  по годам и виду пользования недрами  \t\t"
		}
    ],
    "dataProvider": [
		{
		    "category": "2003",
		    "column-1": "436",
		    "column-2": "30",
		    "column-3": "31"
		},
		{
		    "category": "2004",
		    "column-1": "439",
		    "column-2": "17",
		    "column-3": "29"
		},
		{
		    "category": "2005",
		    "column-1": "456",
		    "column-2": "18",
		    "column-3": "32"
		},
		{
		    "category": "2006",
		    "column-1": "457",
		    "column-2": "27",
		    "column-3": "28"
		},
		{
		    "category": "2007",
		    "column-1": "454",
		    "column-2": "24",
		    "column-3": "33"
		},
		{
		    "category": "2008",
		    "column-1": "444",
		    "column-2": "26",
		    "column-3": "39"
		},
		{
		    "category": "2009",
		    "column-1": "437",
		    "column-2": "23",
		    "column-3": "38"
		},
		{
		    "category": "2010",
		    "column-1": "446",
		    "column-2": "20",
		    "column-3": "41"
		},
		{
		    "category": "2011",
		    "column-1": "457",
		    "column-2": "17",
		    "column-3": "52"
		},
		{
		    "category": "2012",
		    "column-1": "476",
		    "column-2": "19",
		    "column-3": "78"
		},
		{
		    "category": "2013",
		    "column-1": "482",
		    "column-2": "15",
		    "column-3": "91"
		},
		{
		    "category": "2014",
		    "column-1": "480",
		    "column-2": "16",
		    "column-3": "94"
		},
		{
		    "category": "2015",
		    "column-1": "480",
		    "column-2": "42",
		    "column-3": "95"
		},
		{
		    "category": "2016",
		    "column-1": "468",
		    "column-2": "70",
		    "column-3": "98"
		},
		{
		    "category": "2017",
		    "column-1": "477",
		    "column-2": "66",
		    "column-3": "96"
		}
    ]
});

function modalOpen(number) {
    if (window.screen.width > 768) {
        $("#modals" + number).show();
    }
}

function modalClose(number) {
    if (window.screen.width > 768) {
        $("#modals" + number).hide();
    }
}
