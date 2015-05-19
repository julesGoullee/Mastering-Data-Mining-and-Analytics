"use strict";

angularApp.factory("graph", function(){

    var color = d3.scale.category20();

    var force = d3.layout.force()
        .linkStrength(1)
        .friction(0.9)
        .linkDistance(50)
        .charge(-60)
        .gravity(0.1)
        .theta(0.8)
        .alpha(0.1);


    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 10])
        .on("zoom", zoomed);

    var nodes = force.nodes();
    var links = force.links();
    var vis;

    function addSvg ( rootElement, clientSize ){

        force.size([clientSize.width, clientSize.height])
            .on("tick", onTicks );

        var svg = d3.select( rootElement ).append("svg:svg")
            .attr("width", clientSize.width)
            .attr("height", clientSize.height)
            .append("g")
            .call( zoom );

        var rect = svg.append("rect")
            .attr("width", clientSize.width)
            .attr("height", clientSize.height)
            .style("fill", "none")
            .style("pointer-events", "all");

        vis = svg.append("g");

    }

    var update = function () {

            var link = vis.selectAll("line.link")
                .data(links, function(d) { return d.source.id + "-" + d.target.id; });

            link.enter().insert("line")
                .attr("class", "link");

            link.exit().remove();

            var node = vis.selectAll("g.node")
                .data(nodes, function(d) { return d.id;});

            var nodeEnter = node.enter().append("g")
                .on("mouseover", mouseOver)
                .on("mouseout", mouseOut)
                .attr("class", "node");

            nodeEnter.append("text")
                .attr("class", "nodetext")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function(d) {return d.id});

            nodeEnter.append("circle")
                .style("fill", function(d) { return color(d.level); })
                .attr("r", 8);

            node.exit().remove();

            force.start();
        };

    function findNode( id ){
        for( var i=0; i < nodes.length; i++ ){
            if( nodes[i].id === id ){
                return nodes[i];
            }
        }
    }

    function findNodeIndex( id ) {
        for( var i = 0; i < nodes.length; i++ ){
            if( nodes[i].id === id ){
                return i;
            }
        }
        return false;
    }

    function zoomed() {
        vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function onTicks(){
        vis.selectAll("line.link").attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        vis.selectAll("g.node").attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

    function mouseOver() {

        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 12);

        d3.select(this).select("text").transition()
            .duration(750)
            .style("font-size", "15px");
    }

    function mouseOut() {
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 8);
        d3.select(this).select("text").transition()
            .duration(750)
            .style("font-size", "13px");
    }

    return {
        addSvg : addSvg,
        addNode : function (id, level) {
            nodes.push({
                id:id,
                level: level
            });
        },
        removeNode : function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] === n)||(links[i]['target'] == n)) links.splice(i,1);
                else i++;
            }
            var index = findNodeIndex(id);
            if(index !== undefined) {
                nodes.splice(index, 1);
                update();
            }
        },
        addLink : function( sourceId, targetId ){
            var sourceNode = findNode(sourceId);
            var targetNode = findNode(targetId);

            if( (sourceNode !== undefined) && (targetNode !== undefined) ){
                links.push({"source": sourceNode, "target": targetNode});
            }
        },
        setGravity: function( newGravity ){
            force.gravity( newGravity.value );
            force.resume();
        },
        update: function(){
            update();
        }
    };
});