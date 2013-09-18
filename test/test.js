$(window).load(function(){
var Role = function (id, name, order) {
    this.id = id;
    this.name = ko.observable(name);
    this.order = ko.observable(order);
};

var Status = function (id, name, order) {
    this.id = id;
    this.name = ko.observable(name);
    this.order = ko.observable(order);
    //this.steps = ko.observableArray(steps);
};

var ProcessStep = function (id, enabled, icon, name, rulesCount, status, role, isInit) {
    this.id = id;
    this.enabled = ko.observable(enabled);
    this.icon = ko.observable(icon);
    this.name = ko.observable(name);
    this.rulesCount = ko.observable(rulesCount);
    this.status = status;
    this.role = role;
    this.isInit = isInit;
};

var ProcessStepModel = function (statusVals, roleVals, steps) {
    var self = this;
    self.statusVals = ko.observableArray(statusVals);
    self.roleVals = ko.observableArray(roleVals);
    self.steps = ko.observableArray(steps);
    self.CurrentStepLookup = function (role, status) {
       // console.log("Status: " + status + "   Role: " + role);
        //console.log("Length: " + self.steps().length);
        //console.log(self);
         for (var i = 0; i < self.steps().length; i++)
         {
             
              if (self.steps()[i].status === status && self.steps()[i].role === role)
              {
                  //console.log("Matched Role to Status");
                   return self.steps()[i];   
              }
         }
        return null;
    };
    self.Resort = function () {
        self.roleVals().sort();
        //self.roleVals()[0].name('test');
        //console.log( self.roleVals()[0].name);
    };
    
};

var Statuses = [
new Status(1, "Initialization", 100),
new Status(2, "In Queue", 200),
new Status(3, "In Progress", 300),
new Status(4, "Assigned", 400),
new Status(5, "Completed", 500)];

var Roles = [
new Role(1, "Manager", 100),
new Role(2, "Help Desk Coordinator", 200),
new Role(3, "Support", 300),
new Role(4, "Requestor", 400)];

var Steps = [
new ProcessStep(1, true, "icon", "Manager Init", 0, 1, 1, true),
new ProcessStep(2, true, "icon", "Manager InQue", 0, 2, 1, false),
new ProcessStep(3, true, "icon", "Support Assigned", 0, 4, 3, false)];

var vm = new ProcessStepModel(Statuses, Roles, Steps);
console.log(vm);
//ko.bindingHandlers.sortable.beforeMove = vm.verifyAssignments;
//ko.bindingHandlers.sortable.afterMove = vm.updateLastAction;

ko.applyBindings(vm, document.getElementById("#steps"));
});  
