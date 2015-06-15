describe('KeysWord', function () {

    var keysWord;
    var mockWord = {
        id: 1
    };

    var mockWord2 = {
        id: 2
    };

    beforeEach( module('testApp', function( $provide ){
        $provide.value("socket", {
            on: function(){

            }
        });
    }));

    beforeEach(inject(function (_keysWord_) {
        keysWord = _keysWord_;
        keysWord.add( mockWord );
    }));


    it("Peut ajouter un keysWord", function () {
        expect( keysWord.get() ).toEqual( [mockWord] );
    });

});