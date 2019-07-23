



var familiesJSON;
fetch("assets/json/families.json")
.then(res => res.json())
.then((out) => {
  familiesJSON = out;
})
.catch(err => { throw err });



sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index)
      neighbors[k] = this.nodesIndex[k];

    return neighbors;
  });


/**
 * This is an example on how to use sigma filters plugin on a real-world graph.
 */
var filter;

/**
 * DOM utility functions
 */
var _ = {
  $: function (id) {
    return document.getElementById(id);
  },

  all: function (selectors) {
    return document.querySelectorAll(selectors);
  },

  removeClass: function(selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      // Bootstrap compatibility
      el.className = el.className.replace(cssClass, '');
    }
  },

  addClass: function (selectors, cssClass) {
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      // Bootstrap compatibility
      if (-1 == el.className.indexOf(cssClass)) {
        el.className += ' ' + cssClass;
      }
    }
  },

  show: function (selectors) {
    this.removeClass(selectors, 'hidden');
  },

  hide: function (selectors) {
    this.addClass(selectors, 'hidden');
  },

  toggle: function (selectors, cssClass) {
    var cssClass = cssClass || "hidden";
    var nodes = document.querySelectorAll(selectors);
    var l = nodes.length;
    for ( i = 0 ; i < l; i++ ) {
      var el = nodes[i];
      //el.style.display = (el.style.display != 'none' ? 'none' : '' );
      // Bootstrap compatibility
      if (-1 !== el.className.indexOf(cssClass)) {
        el.className = el.className.replace(cssClass, '');
      } else {
        el.className += ' ' + cssClass;
      }
    }
  }
};


function updatePane (graph, filter) {
  // get max degree
  var maxDegree = 0,
      actors = {};
  
  // read nodes
  graph.nodes().forEach(function(n) {
    maxDegree = Math.max(maxDegree, graph.degree(n.id));
    actors[n.attributes.actor] = true;
  })

  // min degree
  _.$('min-degree').max = maxDegree;
  _.$('max-degree-value').textContent = maxDegree;
  
  // node actor
  var nodeactorElt = _.$('node-actor');
  Object.keys(actors).forEach(function(c) {
    var optionElt = document.createElement("option");
    optionElt.text = c;
    nodeactorElt.add(optionElt);
  });

  // reset button
  _.$('reset-btn').addEventListener("click", function(e) {
    _.$('min-degree').value = 0;
    _.$('min-degree-val').textContent = '0';
    _.$('node-actor').selectedIndex = 0;
    filter.undo().apply();
    _.$('dump').textContent = '';
    _.hide('#dump');
  });
}

// Initialize sigma with the dataset:
//   e-Diaspora Moroccan corpus of websites
//   by Dana Diminescu & Matthieu Renault
//   http://www.e-diasporas.fr/wp/moroccan.html
sigma.parsers.gexf('graph/GEPHI_Families_Cluster2.gexf', {
  container: 'graph-container',
  settings: {
    edgeColor: 'source',
    defaultEdgeColor: '#fff',
    minEdgeSize: 1.5,
    defaultLabelColor: '#fff'
  }
}, function(s) {
  // Initialize the Filter API
  filter = new sigma.plugins.filter(s);

  updatePane(s.graph, filter);

  function applyMinDegreeFilter(e) {
    var v = e.target.value;
    _.$('min-degree-val').textContent = v;

    filter
      .undo('min-degree')
      .nodesBy(function(n) {
        return this.degree(n.id) >= v;
      }, 'min-degree')
      .apply();
  }

  function applyactorFilter(e) {
    var c = e.target[e.target.selectedIndex].value;
    filter
      .undo('node-actor')
      .nodesBy(function(n) {
        return !c.length || n.attributes.actor === c;
      }, 'node-actor')
      .apply();
  }

  _.$('min-degree').addEventListener("input", applyMinDegreeFilter);  // for Chrome and FF
  _.$('min-degree').addEventListener("change", applyMinDegreeFilter); // for IE10+, that sucks
  _.$('node-actor').addEventListener("change", applyactorFilter);


  
// We first need to save the original colors of our
      // nodes and edges, like this:
      s.graph.nodes().forEach(function(n) {
        n.originalColor = n.color;
      });
      s.graph.edges().forEach(function(e) {
        e.originalColor = e.color;
      });

      // When a node is clicked, we check for each node
      // if it is a neighbor of the clicked one. If not,
      // we set its color as grey, and else, it takes its
      // original color.
      // We do the same for the edges, and we only keep
      // edges that have both extremities colored.
      s.bind('clickNode', function(e) {
        var nodeId = e.data.node.id,
            toKeep = s.graph.neighbors(nodeId);
        toKeep[nodeId] = e.data.node;

        s.graph.nodes().forEach(function(n) {
          if (toKeep[n.id])
            n.color = n.originalColor;
          else
            n.color = '#555';
        });

        s.graph.edges().forEach(function(e) {
          if (toKeep[e.source] && toKeep[e.target])
            e.color = e.originalColor;
          else
            e.color = '#555';
        });

        // Since the data has been modified, we need to
        // call the refresh method to make the colors
        // update effective.
        s.refresh();

        showInformation( e.data.node);
        
        
      });

      // When the stage is clicked, we just color each
      // node and edge with its original color.
      s.bind('clickStage', function(e) {
        s.graph.nodes().forEach(function(n) {
          n.color = n.originalColor;
        });

        s.graph.edges().forEach(function(e) {
          e.color = e.originalColor;
        });

        // Same as in the previous event:
        s.refresh();
        var $lefty = $(".side-menu");
                $lefty.animate({
                left: -300
            });
      });


  var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
});


function showInformation(node) {

    var family = familiesJSON[node.name];
    console.log(name);
    if (family) {

        var $lefty = $(".side-menu");
        $lefty.family = $lefty.find(".family-name");
        $lefty.actor = $lefty.find(".actor");
        $lefty.attribution = $lefty.find(".attirbution");
        $lefty.first_seen = $lefty.find(".first-seen");
        $lefty.information = $lefty.find(".information");
        $lefty.connections = $lefty.find(".connections");
    
    
        $(" > h2", $lefty.family).html(node.label);
        $lefty.actor.html("<b>Family: </b>" + family.actor);
        $lefty.first_seen.html("<b>First seen: </b>" + family.first_seen);
        $lefty.attribution.html("<b>Attribution: </b>" + family.attribution);
        $lefty.information.html("<h3> Information </h3>" + family.information);
    
    
        $lefty.animate({
        left: 0});
    }

} 
