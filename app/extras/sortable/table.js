define(['knockout'], function( ko ) {

    var ctor = function( id, students ) {
        this.students = ko.observableArray(students);
        this.students.id = id;
    };

    return ctor;

});