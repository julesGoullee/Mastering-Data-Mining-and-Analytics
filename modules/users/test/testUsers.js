"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var users = require("../users.js");
var KeyWord = require("../../keysWord/keyWord.js");


describe("User", function() {

    var user;

    beforeEach(function () {
        var socket = sinon.stub();
        socket.returns({
            request: {
                profile: {}
            }
        });
        user = users.addUser( socket() );
    });

    it("Peut ajouter un user", function () {
        expect( users.getUsers()[0].id ).to.eql( user.id );
    });

    it("Peut recuperer un user par son id", function () {
        expect( users.getById(user.id).id ).to.eql( user.id );
    });

    it("Peut suprimmer un user", function(){
        users.delUserById( user.id );
        expect( users.getUsers().length ).to.eql( 0 );
    });

    it("Peut recuperer deux users", function(){
        var socket = sinon.stub();
        socket.returns({
            request: {
                session: {
                    passport: {
                        user: {}
                    }
                }
            }
        });
        var user2 = users.addUser( socket() );
        expect( users.getUsers().length ).to.eql( 2 );
        users.delUserById( user2.id );

    });

    describe("KeyWord", function(){

        var keyWord;

        beforeEach(function(){
            keyWord = KeyWord( "keyWordTest", "fr", 5, user );
            user.addKeyWord( keyWord );

        });

        it("Peut ajouter un mot a tracker", function(){

            expect( user.getKeysWord().length ).to.eql(1);
            expect( user.getKeysWord()[0] ).to.eql( keyWord );
        });

        it("Peut suprimmer un mot a tracker", function(){
            expect( user.delKeyWord( keyWord.id )).to.eql( true );

            expect( user.getKeysWord().length ).to.eql(0);

        });

        it("Peut dire si le mot et un des sien", function(){

            expect(user.isMyKeyWord( keyWord.id )).to.eql( true );

            var socket = sinon.stub();
            socket.returns({
                request: {
                    session: {
                        passport: {
                            user: {}
                        }
                    }
                }
            });

            var user2 = users.addUser( socket() );
            var keyWord2 = KeyWord( "keyWordTest2", "fr", 5, user2 );
            user2.addKeyWord( keyWord2 );


            expect(user.isMyKeyWord( keyWord2.id )).to.eql( false );
            expect(user2.isMyKeyWord( keyWord2.id )).to.eql( true );

            users.delUserById( user2.id );
            user.delKeyWord( keyWord2.id );

        });

        it("Peut dire que l'user est pret pour ajouter un stream", function(){
            expect( user.isReadyForStream() ).to.eql( true );

        });

        it("Peut dire que l'user n'est pas pret pour ajouter un stream", function(){
            expect( user.isReadyForStream() ).to.eql( true );
            var keyWord2 = KeyWord( "keyWordTest2", "fr", 5, user );

            user.addKeyWord( keyWord2 );
            expect( user.isReadyForStream() ).to.eql( false );

        });

        afterEach(function(){
            user.delKeyWord( keyWord.id );
        });
    });

    afterEach(function(){
        users.delUserById( user.id );
    });
});