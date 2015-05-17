"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var twitterCatcher = require("../twitterCatcher.js");
var KeyWord = require("../../keysWord/keyWord.js");


describe("twitter catcher", function() {

    var keyWord;
    var mockSocketHandler;
    var mockTwtConnector;
    var mockEsConnector;

    beforeEach(function () {
        mockSocketHandler = sinon.spy();
        mockTwtConnector = sinon.spy();
        mockTwtConnector.onData = sinon.spy();
        mockEsConnector = sinon.spy();
        mockEsConnector.addNewEntry = sinon.stub();
        mockEsConnector.dropIndexByTag = sinon.spy();
        keyWord = KeyWord( "keyWordTest"  );
        keyWord.onNewTweet = sinon.spy();
        keyWord.mock( mockSocketHandler, mockEsConnector );
        twitterCatcher.mock( mockTwtConnector, mockEsConnector );
        twitterCatcher.trackKeyWord( keyWord );
    });

    it("Peut lancer la capture du mot", function () {
        expect( keyWord.isReady).to.eql( true );
        expect( keyWord.onStack).to.eql( false );
        expect( mockTwtConnector.onData).calledWith( keyWord.name );
    });

    describe("Declanchement d'un tweet", function(){

        var tweet;
        var callbackOnData;
        var mockAddNewEntryPromise;
        var callbackPromise;

        beforeEach(function(){

            mockAddNewEntryPromise = sinon.stub();
            mockAddNewEntryPromise.then = sinon.stub();
            tweet = sinon.spy();
            tweet.text = "un tweet de test";
            callbackOnData = mockTwtConnector.onData.args[0][1];
            mockEsConnector.addNewEntry.returns( mockAddNewEntryPromise );
            callbackOnData( tweet );
            callbackPromise = mockAddNewEntryPromise.then.args[0][0];

            callbackPromise();
        });

        it("Peut ajouter le tweet dans es", function(){
            expect( mockEsConnector.addNewEntry ).calledWith( keyWord, tweet.text );
        });

        it("Peut mettre en attente le deuxieme temps que le premier n'est pas finis de traiter", function(){
            var tweet2 = sinon.spy();
            tweet2.text = "un deuxieme tweet de test";
            callbackOnData( tweet2 );
            callbackPromise = mockAddNewEntryPromise.then.args[0][0];
            callbackPromise();
            expect( keyWord.onStack ).to.eql( true );
        });

        it("Peut executer le deuxieme traitement une fois le premier terminer", function(){
            var tweet2 = sinon.spy();
            var callbackOnNewTweet = keyWord.onNewTweet.args[0][0];
            tweet2.text = "un deuxieme tweet de test";
            callbackOnData( tweet2 );
            callbackPromise = mockAddNewEntryPromise.then.args[0][0];
            callbackPromise();
            expect( keyWord.onStack ).to.eql( true );
            callbackOnNewTweet( keyWord );
            expect( keyWord.onStack ).to.eql( false );
            expect( keyWord.isReady ).to.eql( false );
            callbackOnNewTweet( keyWord );
            expect( keyWord.isReady ).to.eql( true );

        });

        it("Peut traiter deux tweet l'un apres l'autre", function(){
            expect( keyWord.isReady ).to.eql( false );
            expect( keyWord.onStack ).to.eql( false );

            var callbackOnNewTweet = keyWord.onNewTweet.args[0][0];
            callbackOnNewTweet( keyWord );
            expect( keyWord.isReady ).to.eql( true );
            expect( keyWord.onStack ).to.eql( false );

            var tweet2 = sinon.spy();
            tweet2.text = "un deuxieme tweet de test";
            callbackOnData( tweet2 );
            callbackPromise = mockAddNewEntryPromise.then.args[0][0];
            callbackPromise();
            expect( keyWord.isReady ).to.eql( false );
            expect( keyWord.onStack ).to.eql( false );
            callbackOnNewTweet( keyWord );
            expect( keyWord.isReady ).to.eql( true );
            expect( keyWord.onStack ).to.eql( false );

        });

    });
});