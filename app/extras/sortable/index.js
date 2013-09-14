define(['knockout', 'durandal/system'], function( ko, system ) {

    var Student = function( id, name, gender ) {
        this.id = id;
        this.name = ko.observable(name);
        this.gender = gender;
    };

    var Table = function( id, students ) {
        this.students = ko.observableArray(students);
        this.students.id = id;
    };

    var ctor = function() {
        var self = this;
        this.tables = ko.observableArray([]);
        this.availableStudents = ko.observableArray([]);

        this.availableStudents.id = "Available Students";
        this.lastAction = ko.observable();
        this.lastError = ko.observable();
        this.maximumStudents = 4;
        this.isTableFull = function( parent ) {
            return parent().length < self.maximumStudents;
        };

        this.updateLastAction = function( arg ) {
            self.lastAction("Moved " + arg.item.name() + " from " + arg.sourceParent.id +
                " (seat " + (arg.sourceIndex + 1) + ") to " + arg.targetParent.id +
                " (seat " + (arg.targetIndex + 1) + ")");
        };

        //verify that if a fourth member is added, there is at least one member of each gender
        this.verifyAssignments = function( arg ) {
            var gender, found,
                parent = arg.targetParent;

            if ( parent.id !== "Available Students" && parent().length === 3 && parent.indexOf(arg.item) < 0 ) {
                gender = arg.item.gender;
                if ( !ko.utils.arrayFirst(parent(), function( student ) {
                    return student.gender !== gender;
                }) ) {
                    self.lastError("Cannot move " + arg.item.name() + " to " + arg.targetParent.id +
                        " because there would be too many " + gender + " students");
                    arg.cancelDrop = true;
                }
            }
        };
    };

    ctor.prototype.activate = function() {
        var self = this;
        var initialTables = [];
        var extraStudents = [];

        $.getJSON('./app/extras/sortable/config.json').then(function( response ) {
            system.log('Proceed with response', response);


            createStudents(response.extraStudents);


            $.each(response.initialTables, function( idx, obj ) {
                initialTables.push(
                    new Table(obj.name, createStudents(obj.students))
                )
            });

            self.tables(initialTables);
            self.availableStudents(extraStudents);

            //Internal function not visible outside $.getJSON
            function createStudents ( studentArray ) {
                var result = [];
                $.each(studentArray, function( idx, obj ) {
                    result.push(
                        new Student(obj.id, obj.name, obj.gender)
                    )
                });

                return result;
            }

        });

    };

    // Required bindingHandlers for the example
    ko.bindingHandlers.flash = {
        init: function( element ) {
            $(element).hide();
        },
        update: function( element, valueAccessor ) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if ( value ) {
                $(element).stop().hide().text(value).fadeIn(function() {
                    clearTimeout($(element).data("timeout"));
                    $(element).data("timeout", setTimeout(function() {
                        $(element).fadeOut();
                        valueAccessor()(null);
                    }, 3000));
                });
            }
        },
        timeout: null
    };

    return ctor;

});