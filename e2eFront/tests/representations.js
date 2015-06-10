describe('representation', function () {

    var representationService;

    var structureData;
    beforeEach(module('testApp'));

    beforeEach(inject(function (_representationService_) {
        representationService = _representationService_;
    }));

    describe('children', function () {

        beforeEach(function () {
            structureData = angular.copy(mockData.structureData);
        });

        it('find', function () {
            representationService.setData(structureData);

            var wordName = "MotLvl2-1";
            var word = representationService.findById(wordName);
            expect(word).toBeDefined();
            expect(word.word).toBe(wordName);
        });

        it('find father', function () {
            representationService.setData(structureData);

            var wordName = "MotLvl2-1";
            representationService.tellFathers(wordName);

            var fatherName = "MotLvl1-1";
            var father = representationService.findById(fatherName);

            expect(father.sons.length).toBe(1);
            expect(father.sons[0]).toBe(wordName);
            console.log(representationService.getRepresentation())
        });

        it('find children', function () {
            representationService.setData(structureData);


            var wordName = "MotLvl2-1";
            var fatherName = "MotLvl1-1";
            var father = representationService.findById(fatherName);

            expect(father.sons.length).toBe(3);
            expect(father.sons[0]).toBe(wordName);
        });

    });

});