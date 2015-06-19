"use strict";

angularApp.service("representation", function( $rootScope, socket ){
    var representation;
    var _tweetCount = {
        value: 0
    };

    var findById = function( id ){

            for( var levelId in representation.words ){

                var level = representation.words[levelId];

                for( var wordId in level.content ){

                    var word = level.content[wordId];

                    if( word.word === id ){
                        return word;
                    }
                }
            }
        };

    var findChildren = function(){

        for( var i = 0; i < representation.words.length; i++ ){

            var level = representation.words[i];
            for( var j =0; j < level.content.length; j++ ){

                var word = level.content[j];
                tellFathers(word.word);

            }
        }
    };

    var setData = function( data ){
        representation = data;
        //findChildren();
    };

    var tellFathers = function( wordO ){

        var word = wordO.word ? wordO : findById( wordO );

        var fathers = word.references;

        for( var i = 0; i < fathers.length; i++ ){

            var fatherName = fathers[i];
            var father = findById( fatherName );
            father.sons = father.sons || [];
            father.sons.push(word.word);
        }
    };

    var getCurrentWord = function(){
        return representation || "";
    };

    var getCurrentTag = function(){
        return representation && representation.tag || "";
    };


    socket.on("representation", function( representationData ){

        setData( representationData );
        $rootScope.$broadcast("draw");

    });

    socket.on("tweetCount", function( tweetCount ){
        _tweetCount.value = tweetCount;
    });

    return {
        get: function(){
            return representation;
        },
        setRepresentation: setData,
        findChildren: findChildren,
        findById: findById,
        tellFathers: tellFathers,
        tweetCount : _tweetCount,
        getCurrentWord: getCurrentWord,
        getCurrentTag: getCurrentTag

    };
});