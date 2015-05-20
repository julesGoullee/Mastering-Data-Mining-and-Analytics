"use strict";

angularApp.factory("graph", function(){

    var color = d3.scale.category10();

    var linkStyle = {
        strokeWidth: {
            value:2.5,
            def: 2.5
        }
    };

    var circleStyle = {
        r:{
            value:8 ,
            def: 8
        },
        strokeWidth:  {
            value:1.5,
            def: 1.5
        }
    };

    var textStyle = {
        fontSize : {
            value: 13,
            def:13
        }
    };

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

    var node_drag = d3.behavior.drag()
        .on("dragstart", dragStart)
        .on("drag", dragMove)
        .on("dragend", dragEnd);

    var nodes = force.nodes();
    var links = force.links();
    var vis;

    function addSvg ( rootElement, clientSize ){

        force.size([clientSize.width, clientSize.height])
            .on("tick", onTicks );

        var svg = d3.select( rootElement ).append("svg:svg")
            .attr("width", clientSize.width)
            .attr("height", clientSize.height)
            .on("contextmenu", function(){//prevent right click
                d3.event.preventDefault();
            })
            .call( zoom )
            .on("dblclick.zoom", null);//prevent zoom on double click


        vis = svg.append("g");

    }

    var update = function () {

        var link = vis.selectAll("line.link")
            .data(links, function(d) { return d.source.id + "-" + d.target.id; });

        link.enter().insert("line")
            .attr("class", "link")
            .style("stroke-width", linkStyle.strokeWidth.value );

        link.exit().remove();

        var node = vis.selectAll("g.node")
            .data(nodes, function(d) { return d.id;});

        var nodeEnter = node.enter().append("g")
            .on("mouseover", mouseOver)
            .on("mouseout", mouseOut)
            .call( node_drag )
            .on("dblclick", dbClick)
            .on('contextmenu', onRightClick)
            .attr("class", "node");

        nodeEnter.append("text")
            .attr("class", "nodetext")
            .attr("dx", textStyle.fontSize.value)
            .attr("dy", ".35em")
            .style("font-size", textStyle.fontSize.value)
            .text(function(d) {return d.id});

        nodeEnter.append("circle")
            .attr("class", "circle")
            .style("stroke-width", circleStyle.strokeWidth.value )
            .style("fill", function(d) { return color(d.level); })
            .attr("r", circleStyle.r.value );

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

    function getDirectNodeChildren( nodeId ){
        var directChildrens = [];
        for( var i = 0 ; i < links.length; i ++ ){
            if( links[i].target.id === nodeId ){
                directChildrens.push( links[i].source.id);
            }
        }
        return directChildrens;
    }

    function arrayUnique( array ) {

        var a = array.concat();

        for ( var i=0; i < a.length; ++i ) {

            for( var j=i+1; j < a.length; ++j ) {

                if( a[ i ] === a[ j ] ){

                    a.splice( j-- , 1 );
                }
            }
        }

        return a;
    }

    function getAllNodeChildrenOf( node ){
        var childrens = [];
        var newChildren = getDirectNodeChildren( node.id );

        var getNewChildren = function(newChildren){
            childrens = childrens.concat( newChildren );
            for( var i = 0 ; i < newChildren.length; i++ ){
                getNewChildren( getDirectNodeChildren( newChildren[i] ) );
            }
        };
        getNewChildren( newChildren );
        return arrayUnique( childrens );
    }
    //svg zoom
    function zoomed() {
        vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

        textStyle.fontSize.value = d3.event.scale > 1 ? textStyle.fontSize.def / d3.event.scale  : 13;
        vis.selectAll("g.node text").transition()
            .duration(500)
            .attr("dx", textStyle.fontSize.value)
            .style("font-size", textStyle.fontSize.value + "px");

        circleStyle.r.value = d3.event.scale > 1 ? circleStyle.r.def / d3.event.scale : 8;
        circleStyle.strokeWidth.value = d3.event.scale > 1 ? circleStyle.strokeWidth.def / d3.event.scale : 1.5;
        vis.selectAll("g.node circle").transition()
            .duration(500)
            .attr("r", circleStyle.r.value)
            .style("stroke-width", circleStyle.strokeWidth.value);

        linkStyle.strokeWidth.value = d3.event.scale > 1 ? linkStyle.strokeWidth.def / d3.event.scale : 1.5;
        vis.selectAll("line.link").transition()
            .duration(500)
            .style("stroke-width", linkStyle.strokeWidth.value);
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
            .attr("r", circleStyle.r.value * 1.2);

        d3.select(this).select("text").transition()
            .duration(750)
            .style("font-size", textStyle.fontSize.value * 1.2 + "px");
    }

    function mouseOut() {
        d3.select(this).select("circle").transition()
            .duration(750)
            .attr("r", circleStyle.r.value);
        d3.select(this).select("text").transition()
            .duration(750)
            .style("font-size", textStyle.fontSize.value + "px");
    }

    function dbClick( d ){
        d.fixed = false;
    }

    function dragStart() {
        d3.event.sourceEvent.stopPropagation();
        force.stop();
    }

    function dragMove( d ) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        onTicks();
    }

    function dragEnd( d ) {
        d.fixed = true;
        onTicks();
        force.resume();
    }

    function onRightClick( d ){
        d3.event.preventDefault();
        var idNodes = getAllNodeChildrenOf( d );

        //vis.selectAll("g.node").style("opacity", '1');
        //vis.selectAll("line.link").style("opacity", '1');

        vis.selectAll("g.node")
            .filter(function(d){
                for(var i = 0 ; i < idNodes.length; i++ ){
                    if( idNodes[i] === d.id ){
                        return true;
                    }
                }
                return false;
            })
            .style("opacity", '0.1');

        vis.selectAll("line.link")
            .filter(function(d){
                for(var i = 0 ; i < idNodes.length; i++ ){
                    if( idNodes[i] === d.source.id ){
                        return true;
                    }
                }
                return false;
            })
            .style("opacity", '0.1');
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