define(['knockout', 'durandal/system', 'durandal/composition', './student', './table'],
    function( ko, system, composition, Student, Table ) {

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

        //Setting up sortable before after events
        ko.bindingHandlers.sortable.beforeMove = this.verifyAssignments;
        ko.bindingHandlers.sortable.afterMove = this.updateLastAction;

        // Return async event to ensure that Durandal waits till it resolves
        return $.getJSON('./app/extras/sortable/config.json').then(function( response ) {

            extraStudents = createStudents(response.extraStudents);

            $.each(response.initialTables, function( idx, obj ) {
                initialTables.push(
                    new Table(obj.name, createStudents(obj.students))
                )
            });

            // Updating ko.observable Arrays
            self.tables(initialTables);
            self.availableStudents(extraStudents);

            //Internal
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

    // Adding bindingHandler using composition. http://durandaljs.com/documentation/Interacting-with-the-DOM/
    composition.addBindingHandler('sortable');
    composition.addBindingHandler('flash', {
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
    });

    return ctor;

});