describe('representation', function () {

    var representation;

    var structureData;

    beforeEach( module('testApp', function( $provide ){
        $provide.value("socket", {
            on: function(){

            }
        });
    }));

    beforeEach(inject(function (_representation_) {
        representation = _representation_;
        structureData = angular.copy( mockData.structureData );
        representation.setRepresentation( structureData );
    }));


    it("Peut ajouter les data", function () {
        expect( representation.get() ).toBe( structureData );
    });

    it("Peut recuperer un mot par son id", function () {

        var wordName = "MotLvl2-1";
        var word = representation.findById( wordName );
        expect( word ).toBeDefined();
        expect( word.word ).toBe( wordName );
    });

    it('find father', function () {
        var wordName = "MotLvl2-1";
        representation.tellFathers( wordName );

        var fatherName = "MotLvl1-1";
        var father = representation.findById(fatherName);

        expect(father.sons.length).toBe( 1 );
        expect( father.sons[0] ).toBe( wordName );
    });

    it('find children', function () {

        var wordName = "MotLvl2-1";
        var fatherName = "MotLvl1-1";
        representation.tellFathers( representation.findById( wordName ) );
        var father = representation.findById( fatherName );

        expect(father.sons.length).toBe(1);
        expect(father.sons[0]).toBe(wordName);
    });

});