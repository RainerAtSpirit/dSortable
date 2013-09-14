define(['knockout'], function( ko ) {

    var ctor = function( id, name, gender ) {
        this.id = id;
        this.name = ko.observable(name);
        this.gender = gender;
    };


    return ctor;

});