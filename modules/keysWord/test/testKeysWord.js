"use strict";

var chai = require("chai");
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require("sinon");
chai.use(sinonChai);
var keysWord = require("../keysWord.js");
var users = require("../../users/users.js");


describe("KeysWord", function() {

    var keyWord;
    var mockSocketHandler;
    var mockTwitterCatcher;
    var mockEsConnector;
    var user;

    beforeEach(function () {
        mockSocketHandler = sinon.spy();
        mockTwitterCatcher = sinon.spy();
        mockTwitterCatcher.trackKeyWord = sinon.spy();
        mockEsConnector = sinon.spy();
        var socket = sinon.stub();
        socket.returns({
            request: {
                session:{
                    passport:{
                        user: {}
                    }
                }
            }
        });
        user = users.addUser( socket() );

        keysWord.mock( mockSocketHandler, mockTwitterCatcher );
        keyWord = keysWord.addKeyWord( "keyWordTest", "fr", 5, user );
        keyWord.mock( mockSocketHandler, mockEsConnector );
    });

    it("Peut ajouter un keyword", function (){
        expect( keyWord.name ).to.eql( "keyWordTest" );
        expect( keysWord.getAll().length ).to.eql( 1 );
        expect( mockTwitterCatcher.trackKeyWord ).calledWith( keyWord );
    });

    it("Peut mettre sur pause le stream d'un mot", function(){
        expect( keyWord.isWait ).to.eql(false);
        expect( keysWord.waitKeyWord(keyWord.id) ).to.eql( keyWord );
        expect( keyWord.stream ).to.eql(false);
        expect( keyWord.isWait ).to.eql(true);
    });

    it("Peut resumer un keyWord", function(){

        expect( keysWord.waitKeyWord(keyWord.id) ).to.eql( keyWord );
        expect( keyWord.isWait ).to.eql( true );
        expect( keyWord.stream ).to.eql( false );
        expect( keysWord.resumeKeyWord(keyWord.id) ).to.eql( keyWord );
        expect( keyWord.isWait ).to.eql( false );
        expect( keyWord.stream ).to.eql(true);

    });

    it("Peut recuperer un keyword par son id", function (){
        expect( keysWord.getById( keyWord.id ) ).to.eql( keyWord );
    });

    it("Peut recuperer un keyword par son nom", function (){
        expect( keysWord.getByName( "keyWordTest").id ).to.eql( keyWord.id );
    });

    it("Peut suprimmer un keyword", function(){
        expect( keysWord.delById( keyWord.id )).to.eql( true );
        expect( keysWord.getAll().length ).to.eql( 0 );
    });

    it("Peut dire que le keyWord existe deja", function(){
        expect( keysWord.isNewKeyWord( keyWord.name ) ).to.eql( false );
    });

    it("Peut dire si le keyWord est valide ou non", function(){
        var keyWordTest = "keyWord";
        var options = {
            lang: "fr",
            occurence: 5
        };

        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( true );

        keyWordTest = "maxLengthIsExceded";
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( false );

        keyWordTest = "kk";
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( false );

        keyWordTest = "keyWord";
        options.lang = "jp";
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( false );

        options.lang = "fr";
        options.occurence = 1;
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( false );

        options.occurence = 101;
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( false );

        options.occurence = 10;
        expect( keysWord.isValidKeyWord( keyWordTest, options ) ).to.eql( true );


    });

    it("Peut dire que le keyWord n'existe pas deja", function(){
        expect( keysWord.isNewKeyWord( "keyQuiNexistePas" ) ).to.eql( true );
    });

    describe("2 keysWord", function(){
        var keyWord2;
        var user2;

        beforeEach(function(){
            var socket = sinon.stub();
            socket.returns({
                request: {
                    session:{
                        passport:{
                            user: {}
                        }
                    }
                }
            });
            user2 = users.addUser( socket() );

            keyWord2 = keysWord.addKeyWord( "keyWordTest2", "fr", 10, user2 );
        });

        it("Peut recuperer deux keyword", function(){
            expect( keysWord.getAll().length ).to.eql( 2 );
            keysWord.delById( keyWord2.id );

        });

        it("Peut recuperer le json de deux keysWord", function(){
            expect( keysWord.getJson()).to.eql( [ { id: keyWord.id, value: keyWord.name}, { id: keyWord2.id, value: keyWord2.name } ] );
            expect( keysWord.getJson()).to.eql( [ { id: keyWord.id, value: keyWord.name}, { id: keyWord2.id, value: keyWord2.name } ] );
        });

        afterEach(function(){
            keysWord.delById( keyWord2.id );
            users.delUserById( user2.id );
        });
    });

    describe("user", function(){

        it("Peut recuperer le mot et dire qu'il est le proprietaire", function(){
            expect( keysWord.getJsonByUser( user )[0].id ).to.eql( keyWord.id );
            expect( keysWord.getJsonByUser( user )[0].isMine ).to.eql( true );
        });

        describe("2 keysWord", function() {
            var keyWord2;

            beforeEach(function(){
                keyWord2 = keysWord.addKeyWord("keyWordTest2", "fr", 10, user);

            });

            it("Peut recuperer deux keyWord en etant le proprietaire", function () {

                expect(keysWord.getJsonByUser(user).length).to.eql(2);
                expect(keysWord.getJsonByUser(user)[0].id).to.eql(keyWord.id);
                expect(keysWord.getJsonByUser(user)[0].isMine).to.eql(true);
                expect(keysWord.getJsonByUser(user)[1].id).to.eql(keyWord2.id);
                expect(keysWord.getJsonByUser(user)[1].isMine).to.eql(true);
                keysWord.delById( keyWord2.id );

            });

            it("Peut recuperer deux keysWord en etant proprietaire que du premier", function () {
                var socket = sinon.stub();
                socket.returns({
                    request: {
                        session:{
                            passport:{
                                user: {}
                            }
                        }
                    }
                });
                var user3 = users.addUser( socket() );

                var keyWord3 = keysWord.addKeyWord("keyWordTest2", "fr", 10, user3);

                expect(keysWord.getJsonByUser(user).length).to.eql(3);

                expect(keysWord.getJsonByUser(user)[0].isMine).to.eql(true);
                expect(keysWord.getJsonByUser(user)[1].isMine).to.eql(true);
                expect(keysWord.getJsonByUser(user)[2].isMine).to.eql(undefined);
                keysWord.delById( keyWord3.id );
                users.delUserById( user3.id );

            });

            afterEach(function () {
                keysWord.delById( keyWord2.id );

            });
        });

    });

    afterEach(function(){
        keysWord.delById( keyWord.id );
        users.delUserById( user.id );
    });
});