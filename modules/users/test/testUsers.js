"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
var users = require("../users.js");


describe("User", function() {

    var user;

    beforeEach(function () {
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

    afterEach(function(){
        users.delUserById( user.id );
    });
});