
/* Fetching Families and Actors JSON */
var familiesJSON;
fetch("assets/json/families.json")
.then(res => res.json())
.then((out) => {
  familiesJSON = out;
})
.catch(err => { throw err });


/* Initialized and configure graph */

var dom = document.getElementById("container");
var myChart = echarts.init(dom, 'purple-passion');
var app = {};
var allNodes;

const arrayToObject = (array) =>
   array.reduce((obj, item) => {
     obj[item.id] = item
     return obj
   }, {});


option = null;
myChart.showLoading();
$.get('graph/GEPHI_Families_Cluster.gexf', function (xml) {
    myChart.hideLoading();
    
    var graph = echarts.dataTool.gexf.parse(xml);
    var categories = [];
    allNodes = arrayToObject(graph.nodes);
    
    graph.nodes.forEach(function (node) {
        node.itemStyle = null;
        node.value = node.symbolSize;
        node.symbolSize /= 1.5;
        node.label = {
            normal: {
                show: true
            }
        };
        categories.push({name: node.attributes.actor});
        node.category = node.attributes.actor;
    });
    option = {
        

        title: {
            text: 'Russian APT Ecosystem',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        feature: {
            magicType: {
                type: ['line', 'bar', 'stack', 'tiled']
            }
        },
        tooltip:  {
            formatter: function (params) {
                if (params.dataType == "node") {
                    var colorSpan = color => '<span style="display:inline-block;margin-left:5px;border-radius:10px;width:9px;height:9px;background-color:' + color + '"></span>';
                    // is node
                    res = "<b>Name</b>: " + params.data.name + "<br><b>Actor</b>: " + params.data.category + colorSpan(params.color) ;
                } else if (params.dataType == "edge") {
                    // is edge
                    res = allNodes[params.data.source].name + " > " + allNodes[params.data.target].name;
                }
                return res;
            }
        },
        legend: [{
            // selectedMode: 'single',
            data: categories.map(function (a) {
                return a.name;
            })
        }],
        animation: true,
        animationDuration: 1500,
        scaleLimit : {
        },
        animationEasingUpdate: 'quinticInOut',
        series : [
            {
                name: 'Russian APT Ecosystem',
                type: 'graph',
                layout: 'force',
                force: {
                    initLayout: 'circular',
                    edgeLength: 1200,
                    repulsion: 100000,
                    gravity: 0.4
                },
                
                data: graph.nodes,
                links: graph.links,
                categories: categories,
                roam: true,
                focusNodeAdjacency: true,
                draggable: true,
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                },
                label: {
                    position: 'outside',
                    //padding: 5,
                    //borderRadius: 5,
                    //borderWidth: 1,
                    //borderColor: 'rgba(255, 255, 255, 0.7)',
                    //backgroundColor: 'rgba(255, 255, 255, 1)',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0,
                    width: 2
                },
                emphasis: {
                    lineStyle: {
                        width: 8
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
}, 'xml');;
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}


/* Configure Click actions to show the menu */
myChart.on('click', {dataType: 'node'}, (params) => {
  if (params.dataType === 'node') {
      showInformation(params.data, params.color);
    /* you can check params to look for what you want to pick */
    myChart.dispatchAction({
        /* HighLight type */
        type: 'focusNodeAdjacency',
        /* OffLight type if you need */
        // type: 'unfocusNodeAdjacency',
        /* Positioning the series with seriesId/seriesIndex/seriesName */
        seriesIndex: 0,
        /* Positioning the node with dataIndex */
        dataIndex: params.dataIndex
    });
  }
  params.event.stop();
});

/* Set mouse cursor to Pointer on hover */
myChart.on('mousemove', params => {
    if (params.dataType === 'node') {
        myChart.getZr().setCursorStyle('pointer')
    } else {
        myChart.getZr().setCursorStyle('default')
    }
  });

  
  
/* Configure Click ouside node  to hide the menu */

$("#container").click(function () {
    var $lefty = $(".side-menu");
            $lefty.animate({
            left: -300
        });
});


/* zooming */



/* Configure Side Menu */

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    array.forEach(function(element) {
        if (!("title" in element) || !element["title"]) {
            return;
        }

        if (!("link" in element) || !element["link"]) {
            return;
        }
        // Create the list item:
        var item = document.createElement('li');
        // Create a link item
        var link = document.createElement('a');
        link.setAttribute('href', element["link"]);
        link.innerHTML = element["title"];
        // Set the list item contents:
        item.appendChild(link);
        // Add it to the list:
        list.appendChild(item);

    });

    // Finally, return the constructed list:
    return list;
}

function findFamilyInJson(name) {
    if (name in familiesJSON["families"]) {
        return familiesJSON["families"][name];
    } else if (name.split(' ')[0] in familiesJSON["families"]) {
        return familiesJSON["families"][name.split(' ')[0]];
    }
    console.log('false')
    return false;
}

function showInformation(node, color) {
  var family = findFamilyInJson(node.name);
  if (family) {
      var $lefty = $(".side-menu");
      $lefty.family = $lefty.find(".family-name");
      $lefty.actor = $lefty.find(".actor");
      // $lefty.attribution = $lefty.find(".attirbution");
      $lefty.first_seen = $lefty.find(".first-seen");
      $lefty.information = $lefty.find(".information");
      $lefty.connections = $lefty.find(".connections");
      $lefty.refs = $lefty.find(".references");

  
      $(" > h3", $lefty.family).html(node.name + " | <span>" + family.actor + "</span>");
      $(" > h3 > span", $lefty.family).css({'color': color, "font-weight" : "normal"});
      if (family["first_seen"]){
          $lefty.first_seen.html("<b>First seen: </b>" + family.first_seen);
      }

      if (family["references"]) {
          $lefty.refs.html("<b>References:</b>");
          $lefty.information.html(family.description);
          $lefty.refs.append(makeUL(family.references));
      }
  
  
      $lefty.animate({
      left: 0});
  }

} 
