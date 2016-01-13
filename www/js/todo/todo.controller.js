angular.module('starter')

.controller('TodoCtrl', function($scope, $ionicModal, $ionicListDelegate, Task) {
    // No need for testing data anymore
    $scope.tasks = Task.query();
    $scope.taskToAdd = {};
    $scope.modalMode = 'Add';

    // Create and load the Modal
    $ionicModal.fromTemplateUrl('js/todo/new-task.html', function(modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    var listView = $ionicListDelegate.$getByHandle('task-list');

    // Called when the form is submitted
    $scope.saveTask = function() {

        if ($scope.modalMode === 'Add') {
            var taskToSendToServer = new Task(angular.copy($scope.taskToAdd));

            taskToSendToServer.$save(function(serverTask) {
                $scope.tasks.push(serverTask);
            });

        } else {
            Task.update({
                id: $scope.taskToAdd._id
            }, $scope.taskToAdd);
        }

        $scope.taskModal.hide();
        $scope.taskToAdd = {};

        listView.closeOptionButtons();
    };

    // Open our new task modal
    $scope.newTask = function() {
        $scope.modalMode = 'Add';
        $scope.taskModal.show();
    };

    // Close the new task modal
    $scope.closeNewTask = function() {
        $scope.taskModal.hide();
    };

    //Edit task
    $scope.edit = function(task) {
        $scope.modalMode = 'Edit';
        $scope.taskToAdd = task;
        $scope.taskModal.show();
    };

    //Delete task
    $scope.delete = function(index, task) {
        Task.remove({
            id: task._id
        }).$promise.then(function() {
            $scope.tasks.splice(index, 1);
        });
    };

});
