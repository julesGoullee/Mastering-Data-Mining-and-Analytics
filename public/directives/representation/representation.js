"use strict";

angularApp.directive("representation", function( graphConfig, graph, representation ){
    var isFirst = true;

    return {
        restrict: "E",
        scope:{
        },
        link: function( scope, element ){

            scope.gravity = graphConfig.gravity;

            scope.$on("draw",function(){

                if( isFirst ){
                    isFirst = false;
                    var clientSize = {
                        width : $("body").width(),
                        height: $("body").height() - $("#topBar").height()
                    };

                    graph.addSvg( element[0], clientSize );
                    scope.$watch( "gravity", graph.setGravity, true );
                    graphConfig.onRestoreHiddenNodes(function(){
                        graph.showAll();
                    });
                }else{
                    graph.removeAllNode();
                }

                var links = [];

                for( var i= 0 ; i < representation.get().words.length; i ++ ){
                    var dataInLevel = representation.get().words[i];

                    for( var j = 0 ; j < dataInLevel.content.length; j++){
                        var wordObject =  dataInLevel.content[j];

                        graph.addNode( wordObject.word, dataInLevel.level );

                        if( wordObject.references.length > 0 ){
                            for( var k = 0; k < wordObject.references.length; k++){
                                graph.addLink( wordObject.word, wordObject.references[k]);

                                links.push({
                                    source:  wordObject.word,
                                    target: wordObject.references[k]
                                });
                            }
                        }
                    }
                }
                graph.update();

            });

            scope.$on("addWord", function( event, wordsObjects ){

                for ( var i = 0 ; i < wordsObjects.length; i++ ){

                    if( !representation.get().words[ wordsObjects[i].level ]){

                        representation.get().words[ wordsObjects[i].level ] = {
                            content : [],
                            date: new Date().toDateString(),
                            level : wordsObjects[i].level
                        }
                    }

                    representation.get().words[ wordsObjects[i].level ].content.push( wordsObjects[i] );
                    graph.addNode( wordsObjects[i].word, wordsObjects[i].level );

                    if( wordsObjects[i].references.length > 0 ){

                        for( var j = 0; j < wordsObjects[i].references.length; j++ ){
                            graph.addLink( wordsObjects[i].word, wordsObjects[i].references[j] );
                        }
                    }

                }
                graph.update();
            });

        }
    }
});