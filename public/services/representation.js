"use strict";

angularApp.service('representation', function( ){
        var representation;

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

            for( var levelId in representation.words ){

                var level = representation.words[levelId];

                for( var wordId in level.content ){

                    var word = level.content[wordId];
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
                var father = findById(fatherName);
                father.sons = father.sons || [];
                father.sons.push(word.word);
            }
        };

        var getCurrentWord = function(){
            return representation || "";
        };

        return {
            setRepresentation: setData,
            findChildren: findChildren,
            findById: findById,
            tellFathers: tellFathers,
            getRepresentation: function(){
                return representation;
            },
            tweetCount : {
                value: 0
            },
            getCurrentWord: getCurrentWord

    };
});