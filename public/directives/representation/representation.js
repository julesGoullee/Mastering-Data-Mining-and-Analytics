"use strict";

angularApp.directive("representation", function(graphConfig){

    return {
        restrict: "E",
        scope:{
            words : "="
        },
        link: function( scope, element ){

            scope.gravity = graphConfig.gravity;
            var clientSize = {
                width : $("body").width(),
                height: $("body").height() - $("#topBar").height()
            };

            scope.words.draw = function(){
                var links = [];
                for( var i= 0 ; i < scope.words.values.length; i ++ ){
                    var dataInLevel = scope.words.values[i];
                    for( var j = 0 ; j < dataInLevel.content.length; j++){
                        var wordObject =  dataInLevel.content[j];

                        graph.addNode(wordObject.word, dataInLevel.level, true);

                        if( wordObject.references.length > 0 ){
                            for( var k = 0; k < wordObject.references.length; k++){
                                graph.addLink(wordObject.word, wordObject.references[k], true);

                                links.push({
                                    source:  wordObject.word,
                                    target: wordObject.references[k]
                                });
                            }
                        }
                    }
                }
                graph.update();

            };

            scope.words.addWord = function( wordsObjects ){
                for ( var i = 0 ; i < wordsObjects.length; i++ ){
                    if( !scope.words.values[ wordsObjects[i].level ]){
                        scope.words.values[ wordsObjects[i].level ] = {
                            content : [],
                            date: new Date().toDateString(),
                            level : wordsObjects[i].level
                        }
                    }
                    scope.words.values[ wordsObjects[i].level].content.push(wordsObjects[i]);
                    graph.addNode(wordsObjects[i].word, wordsObjects[i].level, true);

                    if( wordsObjects[i].references.length > 0 ){
                        for( var j = 0; j < wordsObjects[i].references.length; j++){
                            graph.addLink(wordsObjects[i].word, wordsObjects[i].references[j], true);
                        }
                    }

                }
                graph.update();
            };

            function Graph(el)  {

                var color = d3.scale.category20();

                // Add and remove elements on the graph object
                this.addNode = function (id, level, disableUpdate) {
                    nodes.push({
                        id:id,
                        level: level
                    });
                    if( disableUpdate !== true ){
                        update();
                    }
                };

                this.removeNode = function (id) {
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
                };

                this.addLink = function (sourceId, targetId, disableUpdate ) {
                    var sourceNode = findNode(sourceId);
                    var targetNode = findNode(targetId);

                    if((sourceNode !== undefined) && (targetNode !== undefined)) {
                        links.push({"source": sourceNode, "target": targetNode});
                        if( disableUpdate !== true ){
                            update();
                        }
                    }
                };

                this.update =  function(){
                    update();
                    force.gravity(scope.gravity.value)
                };

                var findNode = function (id) {
                    for (var i=0; i < nodes.length; i++) {
                        if (nodes[i].id === id)
                            return nodes[i]
                    }
                };

                var findNodeIndex = function (id) {
                    for (var i=0; i < nodes.length; i++) {
                        if (nodes[i].id === id)
                            return i
                    }
                };
                var zoom = d3.behavior.zoom()
                    .scaleExtent([0.1, 10])
                    .on("zoom", zoomed);

                var svg = d3.select(element[0]).append("svg:svg")
                    .attr("width", clientSize.width)
                    .attr("height", clientSize.height)
                    .append("g")
                    .call(zoom);

                var rect = svg.append("rect")
                    .attr("width", clientSize.width)
                    .attr("height", clientSize.height)
                    .style("fill", "none")
                    .style("pointer-events", "all");

                var vis = this.vis = svg.append("g");


                function zoomed() {
                    vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                }


                var force = d3.layout.force()
                    .gravity(scope.gravity.value)
                    .linkDistance(60)
                    .charge(-300)
                    .size([clientSize.width, clientSize.height]);

                var nodes = force.nodes(),
                    links = force.links();

                var update = function () {

                    var link = vis.selectAll("line.link")
                        .data(links, function(d) { return d.source.id + "-" + d.target.id; });

                    link.enter().insert("line")
                        .attr("class", "link");

                    link.exit().remove();

                    var node = vis.selectAll("g.node")
                        .data(nodes, function(d) { return d.id;});

                    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .call(force.drag);

                    nodeEnter.append("text")
                        .attr("class", "nodetext")
                        .attr("dx", 12)
                        .attr("dy", ".35em")
                        .text(function(d) {return d.id});

                    nodeEnter.append("circle")
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout)
                        .style("fill", function(d) { return color(d.level); })
                        .attr("r", 8);

                    node.exit().remove();

                    force.on("tick", function() {
                        link.attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });

                        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                    });

                    // Restart the force layout.
                    force.start();
                };

                function mouseover() {
                    d3.select(this).select("circle").transition()
                        .duration(750)
                        .attr("r", 16);
                }

                function mouseout() {
                    d3.select(this).select("circle").transition()
                        .duration(750)
                        .attr("r", 8);
                }
                // Make it all go
                update();
            }

            var graph = new Graph("#graph");

            scope.$watch( "gravity", graph.update, true );

        }
    }
});