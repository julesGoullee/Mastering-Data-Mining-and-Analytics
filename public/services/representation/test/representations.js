describe('representation', function () {

    var representation;

    var structureData;

    beforeEach(module('testApp'));

    beforeEach(inject(function (_representation_) {
        representation = _representation_;
    }));

    describe('children', function () {

        beforeEach(function () {
            structureData = angular.copy(mockData.structureData);
            representation.setRepresentation(structureData);
        });

        it('find', function () {

            var wordName = "MotLvl2-1";
            var word = representation.findById(wordName);
            expect(word).toBeDefined();
            expect(word.word).toBe(wordName);
        });

        it('find father', function () {
            var wordName = "MotLvl2-1";
            representation.tellFathers(wordName);

            var fatherName = "MotLvl1-1";
            var father = representation.findById(fatherName);

            expect(father.sons.length).toBe();
            expect(father.sons[0]).toBe(wordName);
            console.log(representation.getRepresentation())
        });

        it('find children', function () {

            var wordName = "MotLvl2-1";
            var fatherName = "MotLvl1-1";
            var father = representation.findByName( fatherName );

            expect(father.sons.length).toBe(3);
            expect(father.sons[0]).toBe(wordName);
        });

    });

});