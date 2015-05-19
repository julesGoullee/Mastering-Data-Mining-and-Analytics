"use strict";

angularApp.factory("graph", function(){

    var color = d3.scale.category20();
    var fontSizeNodeText = 13;

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
            .call( zoom )
            .on("dblclick.zoom", null);//prevent zoom on double click

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
                .call( node_drag )
                .on("dblclick", dbClick)
                .attr("class", "node");

            nodeEnter.append("text")
                .attr("class", "nodetext")
                .attr("dx", 12)
                .attr("dy", ".35em")
                .text(function(d) {return d.id});

            nodeEnter.append("circle")
                .attr("class", "circle")
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
        console.log( d3.event.scale );
        vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

        fontSizeNodeText = d3.event.scale > 1 ? 13 / d3.event.scale  : 13;
        console.log( fontSizeNodeText );
        vis.selectAll("g.node text").transition()
            .duration(750)
            .style("font-size", fontSizeNodeText + "px");
    }

    //node events
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
            .style("font-size", fontSizeNodeText * 1.2 + "px");
    }

    function mouseOut() {
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", 8);
        d3.select(this).select("text").transition()
            .duration(750)
            .style("font-size", fontSizeNodeText + "px");
    }

    function dbClick( d ){
        d.fixed = false;
    }

    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);

    function dragstart() {
        d3.event.sourceEvent.stopPropagation();
        force.stop();
    }

    function dragmove(d) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        onTicks();
    }

    function dragend(d, i) {
        d.fixed = true;
        onTicks();
        force.resume();
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