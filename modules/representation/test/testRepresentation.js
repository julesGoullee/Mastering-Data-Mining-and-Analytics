"use strict";

var chai = require('chai');
var sinonChai = require("sinon-chai");
global.expect = chai.expect;
global.sinon = require('sinon');
chai.use(sinonChai);
//var mock = require("../../../test/mock.js");


describe("Représentation", function() {

    var _representation;
    var testKeyWord = "testKeyWord";

    beforeEach(function () {
        _representation = require("../representation.js")( testKeyWord );
    });

    it("Peut recuperer la representation vide", function () {
        var jsonRepresentation = _representation.getJson();
        expect(jsonRepresentation.tag).to.eql("testKeyWord");
        expect(jsonRepresentation.words).to.eql([]);
    });

    it("Peut ajouter un mot clé", function () {

        var newKeysWord = [
            {
                keyWord: "keyWordLvl0_1",
                occurence: 5,
                references: []
            }
        ];

        _representation.addKeysWords(newKeysWord, function(){
            var jsonRepresentation = _representation.getJson();

            expect(jsonRepresentation.words.length).to.eql(1);
            expect(jsonRepresentation.words[0].level).to.eql(0);
            expect(jsonRepresentation.words[0].content.length).to.eql(1);
            expect(jsonRepresentation.words[0].content[0].occurence).to.eql(newKeysWord[0].occurence);
            expect(jsonRepresentation.words[0].content[0].references).to.eql([]);
            expect(jsonRepresentation.words[0].content[0].word).to.eql(newKeysWord[0].keyWord);

        });
    });

    describe("Level 1", function() {
        var newKeysWord = [
            {
                keyWord: "keyWordLvl0_1",
                occurence: 5,
                references: []
            }
        ];

        beforeEach(function () {
            _representation.addKeysWords(newKeysWord, function(){});
        });

        it("Peut recuperer le mot deja capturer", function(){
            expect(_representation.getWordsAlreadyFlag()).to.eql([newKeysWord[0].keyWord]);
        });

        it("Peut ajouter un mot de niveau 1 qui reference le mot de niveau 0", function(){
            var newKeysWordLvl1 = [
                {
                    keyWord: "keyWordLvl1_1",
                    occurence: 6,
                    references: [newKeysWord.keyWord]
                }
            ];

            _representation.addKeysWords(newKeysWordLvl1, function(){
                var jsonRepresentation = _representation.getJson();

                expect(jsonRepresentation.words.length).to.eql(2);
                expect(jsonRepresentation.words[1].level).to.eql(1);
                expect(jsonRepresentation.words[1].content.length).to.eql(1);
                expect(jsonRepresentation.words[1].content[0].occurence).to.eql(newKeysWordLvl1[0].occurence);
                expect(jsonRepresentation.words[1].content[0].references).to.eql([newKeysWord.keyWord]);
                expect(jsonRepresentation.words[1].content[0].word).to.eql(newKeysWordLvl1[0].keyWord);

            });
        });

        describe("Deuxieme mots", function(){
            var newKeysWordLvl1_1 = [
                {
                    keyWord: "keyWordLvl1_1",
                    occurence: 6,
                    references: [newKeysWord.keyWord]
                }
            ];

            beforeEach(function () {
                _representation.addKeysWords(newKeysWordLvl1_1, function(){});
            });

            it("Peut recuperer les deux deja capturer a deux niveau differents", function(){
                expect(_representation.getWordsAlreadyFlag()).to.eql([newKeysWord[0].keyWord, newKeysWordLvl1_1[0].keyWord]);
            });

            it("Peut ajouter un deuxieme mot au meme niveau", function(){
                var newKeysWordLvl1_2 = [
                    {
                        keyWord: "keyWordLvl1_2",
                        occurence: 7,
                        references: [newKeysWord.keyWord]
                    }
                ];

                _representation.addKeysWords(newKeysWordLvl1_2, function(){
                    var jsonRepresentation = _representation.getJson();

                    expect(jsonRepresentation.words.length).to.eql(2);
                    expect(jsonRepresentation.words[1].level).to.eql(1);
                    expect(jsonRepresentation.words[1].content.length).to.eql(2);
                    expect(jsonRepresentation.words[1].content[1].occurence).to.eql(newKeysWordLvl1_2[0].occurence);
                    expect(jsonRepresentation.words[1].content[1].references).to.eql([newKeysWord.keyWord]);
                    expect(jsonRepresentation.words[1].content[1].word).to.eql(newKeysWordLvl1_2[0].keyWord);
                });
            });
        });
    });

    it("Peut ajouter plusieur mot en meme temps de niveau different", function(){
        var newKeysWord = [
            {
                keyWord: "keyWordLvl0_1",
                occurence: 5,
                references: []
            },
            {
                keyWord: "keyWordLvl1_1",
                occurence: 6,
                references: ["keyWordLvl0_1"]
            },
            {
                keyWord: "keyWordLvl1_2",
                occurence: 7,
                references: ["keyWordLvl0_1"]
            }
        ];

        _representation.addKeysWords(newKeysWord, function(){
            var jsonRepresentation = _representation.getJson();

            expect(jsonRepresentation.words.length).to.eql(2);
            expect(jsonRepresentation.words[0].level).to.eql(0);
            expect(jsonRepresentation.words[0].content.length).to.eql(1);
            expect(jsonRepresentation.words[0].content[0].occurence).to.eql(newKeysWord[0].occurence);
            expect(jsonRepresentation.words[0].content[0].references).to.eql([]);
            expect(jsonRepresentation.words[0].content[0].word).to.eql(newKeysWord[0].keyWord);

            expect(jsonRepresentation.words[1].level).to.eql(1);
            expect(jsonRepresentation.words[1].content.length).to.eql(2);
            expect(jsonRepresentation.words[1].content[0].occurence).to.eql(newKeysWord[1].occurence);
            expect(jsonRepresentation.words[1].content[0].references).to.eql([newKeysWord[0].keyWord]);
            expect(jsonRepresentation.words[1].content[0].word).to.eql(newKeysWord[1].keyWord);

            expect(jsonRepresentation.words[1].level).to.eql(1);
            expect(jsonRepresentation.words[1].content.length).to.eql(2);
            expect(jsonRepresentation.words[1].content[1].occurence).to.eql(newKeysWord[2].occurence);
            expect(jsonRepresentation.words[1].content[1].references).to.eql([newKeysWord[0].keyWord]);
            expect(jsonRepresentation.words[1].content[1].word).to.eql(newKeysWord[2].keyWord);
        });
    });

    describe("Level 2", function(){
        var newKeysWord = [
            {
                keyWord: "keyWordLvl0_1",
                occurence: 5,
                references: []
            },
            {
                keyWord: "keyWordLvl1_1",
                occurence: 6,
                references: ["keyWordLvl0_1"]
            },
            {
                keyWord: "keyWordLvl1_2",
                occurence: 7,
                references: ["keyWordLvl0_1"]
            }
        ];

        beforeEach(function(){
            _representation.addKeysWords(newKeysWord, function(){});
        });

        it("Peut ajouter un mot au niveau 2 qui a deux references ", function(){
            var newKeysWordLvl2 = [
                {
                    keyWord: "keyWordLvl2_1",
                    occurence: 5,
                    references: [newKeysWord[1].keyWord, newKeysWord[2].keyWord]
                }
            ];

            _representation.addKeysWords(newKeysWordLvl2, function() {
                var jsonRepresentation = _representation.getJson();

                expect(jsonRepresentation.words.length).to.eql(3);
                expect(jsonRepresentation.words[2].level).to.eql(2);
                expect(jsonRepresentation.words[2].content.length).to.eql(1);
                expect(jsonRepresentation.words[2].content[0].occurence).to.eql(newKeysWordLvl2[0].occurence);
                expect(jsonRepresentation.words[2].content[0].references).to.eql([newKeysWord[1].keyWord, newKeysWord[2].keyWord]);
                expect(jsonRepresentation.words[2].content[0].word).to.eql(newKeysWordLvl2[0].keyWord);
            });
        });

        describe("Ajout niveau inferieur", function(){
            var newKeysWordLvl2 = [
                {
                    keyWord: "keyWordLvl2_1",
                    occurence: 5,
                    references: [newKeysWord[1].keyWord, newKeysWord[2].keyWord]
                }
            ];

            beforeEach(function(){
                _representation.addKeysWords(newKeysWordLvl2, function(){});
            });

            it("Peut ajouter un mot au niveau inferieur au dernier", function(){
                var newKeysWordLvl1_3 = [
                    {
                        keyWord: "keyWordLvl1_3",
                        occurence: 2,
                        references: [newKeysWord[0].keyWord]
                    }
                ];
                _representation.addKeysWords(newKeysWordLvl1_3, function() {
                    var jsonRepresentation = _representation.getJson();

                    expect(jsonRepresentation.words.length).to.eql(3);
                    expect(jsonRepresentation.words[1].content.length).to.eql(3);
                    expect(jsonRepresentation.words[1].content[2].occurence).to.eql(newKeysWordLvl1_3[0].occurence);
                    expect(jsonRepresentation.words[1].content[2].references).to.eql([newKeysWord[0].keyWord]);
                    expect(jsonRepresentation.words[1].content[2].word).to.eql(newKeysWordLvl1_3[0].keyWord);
                });
            });

            it("Peut recuperer la liste des mots de niveau different && après ajout de niveau inferieur au dernier", function(){
                var newKeysWordLvl1_3 = [
                    {
                        keyWord: "keyWordLvl1_3",
                        occurence: 2,
                        references: [newKeysWord[0].keyWord]
                    }
                ];

                _representation.addKeysWords(newKeysWordLvl1_3, function() {
                    expect(_representation.getWordsAlreadyFlag())
                        .to.eql([newKeysWord[0].keyWord, newKeysWord[1].keyWord,newKeysWord[2].keyWord,newKeysWordLvl1_3[0].keyWord,newKeysWordLvl2[0].keyWord]);
                });
            });
        });
    });
});