"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var KeyWord = require("../keyWord.js");


describe("KeyWord", function() {

    var keyWord;
    var mockSocketHandler;
    var mockEsConnector;
    var mockUserOwner;

    var callbackOnNewTweet;

    beforeEach(function () {
        mockSocketHandler = sinon.spy();
        mockSocketHandler.notifyInRoom = sinon.spy();
        mockEsConnector = sinon.spy();
        mockEsConnector.searchNewKeysWords = sinon.spy();
        mockEsConnector.getKeysWordsReferences = sinon.spy();
        callbackOnNewTweet = sinon.spy();
        mockUserOwner = sinon.spy();
        keyWord = KeyWord( "keyWordTest", "fr", 5, mockUserOwner );
        keyWord.mock( mockSocketHandler, mockEsConnector );

    });

    it("Peut ajouter un keyword", function () {
        expect( keyWord.name ).to.eql("keyWordTest");
        expect( keyWord.lang).to.eql("fr");
        expect( keyWord.occurence ).to.eql(5);
        expect( keyWord.tweetCount ).to.eql( 0 );
    });

    describe("callbackOnNewTweet", function(){

        var callbackSearchNewKeysWords;

        beforeEach(function(){
            keyWord.onNewTweet( callbackOnNewTweet );
            callbackSearchNewKeysWords = mockEsConnector.searchNewKeysWords.args[0][2];
        });

        it("Peut notifier la room du nouveau tweet count", function(){
            expect( keyWord.tweetCount ).to.eql( 1 );
            expect( mockSocketHandler.notifyInRoom ).calledWith( keyWord.id, "tweetCount", keyWord.tweetCount);
        });

        it("Peut rechercher d'un nouveau keysword", function(){
            callbackSearchNewKeysWords([]);
            expect( mockEsConnector.searchNewKeysWords ).calledWith( keyWord, "");
            expect( callbackOnNewTweet ).calledWith();
        });

        it("Peut rechercher les references d'un nouveau keysWord", function() {
            var newKeysWord = [{ key: "nouveauKeyWord" }];
            callbackSearchNewKeysWords( newKeysWord );
            expect( mockEsConnector.getKeysWordsReferences ).calledWith( keyWord, newKeysWord[0].key, "" );
        });

        describe("callbackGetKeysWordsReferences", function(){
            var callbackGetKeysWordsReferences;

            beforeEach(function(){
                var newKeysWord = [{ key: "nouveauKeyWord" }];
                callbackSearchNewKeysWords( newKeysWord );
                callbackGetKeysWordsReferences = mockEsConnector.getKeysWordsReferences.args[0][3];
                callbackGetKeysWordsReferences([]);
            });

            it("Peut ajouter un keyWord dans la representation", function(){
                expect( keyWord.representation.getWordsAlreadyFlag()).to.eql( [ "nouveauKeyWord" ] );
            });

            it("Peut notifier la room du nouveau keyWord", function(){
                expect( mockSocketHandler.notifyInRoom ).calledWith( keyWord.id, "newWord", [{ level: 0, references: [], word: "nouveauKeyWord" }] );
                expect( callbackOnNewTweet ).calledWith();
            });
        });

        describe("Plusieur keyword", function(){
            var callbackGetKeysWordsReferences;

            beforeEach(function(){
                var newKeysWord = [{ key: "nouveauKeyWord" }, { key: "nouveauKeyWord1" }];
                callbackSearchNewKeysWords( newKeysWord );
                mockEsConnector.getKeysWordsReferences.args[0][3]([]);
                callbackGetKeysWordsReferences = mockEsConnector.getKeysWordsReferences.args[1][3];
                callbackGetKeysWordsReferences([]);

            });

            it("Peut ajouter plusieur keysWord", function(){
                expect( keyWord.representation.getWordsAlreadyFlag()).to.eql( [ "nouveauKeyWord", "nouveauKeyWord1"] );
            });

            it("Peut notifier la room des nouveaux keyWord", function(){
                expect( mockSocketHandler.notifyInRoom ).calledWith( keyWord.id, "newWord",
                    [{ level: 0, references: [], word: "nouveauKeyWord" }, { level: 0, references: [], word: "nouveauKeyWord1" }]);
                expect( callbackOnNewTweet ).calledWith();
            });
        });

    });

});