"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var keysWord = require("../keysWord.js");


describe("KeysWord", function() {

    var keyWord;
    var mockSocketHandler;
    var mockTwitterCatcher;
    var mockEsConnector;
    beforeEach(function () {
        mockSocketHandler = sinon.spy();
        mockTwitterCatcher = sinon.spy();
        mockTwitterCatcher.trackKeyWord = sinon.spy();
        mockEsConnector = sinon.spy();
        keysWord.mock( mockSocketHandler, mockTwitterCatcher );
        keyWord = keysWord.addKeyWord( "keyWordTest" );
        keyWord.mock( mockSocketHandler, mockEsConnector );
    });

    it("Peut ajouter un keyword", function () {
        expect( keyWord.name ).to.eql( "keyWordTest" );
        expect( keysWord.getAll().length ).to.eql( 1 );
        expect( mockTwitterCatcher.trackKeyWord ).calledWith( keyWord );
    });

    it("Peut recuperer un keyword par son id", function () {
        expect( keysWord.getById( keyWord.id ) ).to.eql( keyWord );
    });

    it("Peut recuperer un keyword par son nom", function () {
        expect( keysWord.getByName( "keyWordTest").id ).to.eql( keyWord.id );
    });

    it("Peut suprimmer un keyword", function(){
        keysWord.delById( keyWord.id );
        expect( keysWord.getAll().length ).to.eql( 0 );
    });

    it("Peut dire que le keyWord existe deja", function(){
        expect( keysWord.isNewKeyWord( keyWord.name ) ).to.eql( false );
    });

    it("Peut dire que le keyWord n'existe pas deja", function(){
        expect( keysWord.isNewKeyWord( "keyQuiNexistePas" ) ).to.eql( true );
    });

    describe("2 keysWord", function(){
        var keyWord2;

        beforeEach(function(){
            keyWord2 = keysWord.addKeyWord( "keyWordTest2" );

        });

        it("Peut recuperer deux keyword", function(){
            expect( keysWord.getAll().length ).to.eql( 2 );
            keysWord.delById( keyWord2.id );

        });

        it("Peut recuperer le json de deux keysWord", function(){
           expect( keysWord.getJson()).to.eql( [ keyWord.name, keyWord2.name ] );
        });

        afterEach(function(){
            keysWord.delById( keyWord2.id );
        });
    });

    afterEach(function(){
        keysWord.delById( keyWord.id );
    });
});