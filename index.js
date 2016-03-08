var myApp = angular.module('myApp', ['ngRoute','ngFormValidation'])

//ng-route config
.config(['$routeProvider', '$locationProvider','formValidationDecorationsProvider', 'formValidationErrorsProvider',function ($routeProvider, $locationProvider,formValidationDecorationsProvider, formValidationErrorsProvider){
  formValidationDecorationsProvider.useBuiltInDecorator('bootstrap');
  formValidationErrorsProvider.useBuiltInErrorListRenderer('bootstrap');
  $routeProvider
    .when('/home', {
      templateUrl: 'default.html',
    })
    .when('/contact-info/:contact_index', {
      templateUrl: 'contact_info.html',
      controller: 'contactInfoCtrl'
    })
    .when('/add', {
      templateUrl: 'contact_form.html',
      controller: 'addContactCtrl'
    })
    .when('/edit/:contact_index', {
      templateUrl: 'contact_form.html',
      controller: 'editContactCtrl'
    })
    .otherwise({redirectTo: '/home'});
}])

// controllers
.controller('navCtrl', ['$scope',function ($scope) {
  $scope.nav = {
    navItems: ['Home'],
    selectedIndex: 0,
    navClick: function ($index) {
      $scope.nav.selectedIndex = $index;
    }
  };
}])

.controller('homeCtrl',['$scope','ContactService', function ($scope, ContactService){
  $scope.contacts = ContactService.getContacts();

  $scope.removeContact = function (item) {
    var index = $scope.contacts.indexOf(item);
    $scope.contacts.splice(index, 1);
    $scope.removed = 'Contact successfully removed.';
  };

}])

.controller('contactInfoCtrl', ['$scope','$routeParams',function ($scope, $routeParams){
  var index = $routeParams.contact_index;
  $scope.currentContact = $scope.contacts[index];
}])

.controller('addContactCtrl',['$scope','$location', function ($scope, $location) {
  //needed to show the correct button on the contact form
  $scope.path = $location.path();

  $scope.addContact = function () {
    var contact = $scope.currentContact;
    contact.id = $scope.contacts.length;
    $scope.contacts.push(contact);
  };
  
}])

.controller('editContactCtrl',['$scope','$routeParams', function ($scope, $routeParams){
  $scope.index = $routeParams.contact_index;
  $scope.currentContact = $scope.contacts[$scope.index];
}])

.controller('uploadTestCtrl',['$scope',function($scope){

    $scope.doUpload = function(){

        console.log('title',$scope.title);
        console.log('uploadFile',$scope.uploadFile);
        alert('Do upload. See console for data');
   }
    
}])

.controller('dtCtrl',['$scope','dateFilter', function ($scope, dateFilter) {
         
        if($scope.currentContact !== undefined)
          $scope.currentContact.dt = new Date($scope.currentContact.dt) ;
        
         //$scope.currentContact.dt = $scope.dt = ($scope.currentContact === undefined) ? "" : new Date($scope.currentContact.dt) ;
}])

// directives
.directive('contact', [function () {
  return {
    restrict: 'EC',
    replace: false,
    templateUrl: 'contact.html'
  }
}])

.directive('fileField', [function() {
  return {
    require:'ngModel',
    restrict: 'E',
    template:'<button type="button" class="btn-primary"><ng-transclude></ng-transclude><input type="file" style="display:none"></button>',
    replace:true,
    transclude:true,
    link: function (scope, element, attrs, ngModel) {
        //set default bootstrap class
        if(!attrs.class && !attrs.ngClass){
            element.addClass('btn');
        }

        var fileField = element.find('input');

        fileField.bind('change', function(event){
            scope.$evalAsync(function () {
              ngModel.$setViewValue(event.target.files[0]);
              if(attrs.preview){
                var reader = new FileReader();
                reader.onload = function (e) {
                    scope.$evalAsync(function(){
                        scope[attrs.preview]=e.target.result;
                    });
                };
                reader.readAsDataURL(event.target.files[0]);
              }
            });
        });
        fileField.bind('click',function(e){
            e.stopPropagation();
        });
        element.bind('click',function(e){
            e.preventDefault();
            fileField[0].click()
        });        
    }
    
  };
}])

.directive(
        'dateInput',
        [function(dateFilter) {
            return {
                require: 'ngModel',
                template: '<input type="date"></input>',
                replace: true,
                link: function(scope, elm, attrs, ngModelCtrl) {
                    ngModelCtrl.$formatters.unshift(function (modelValue) {
                        return dateFilter(modelValue, 'yyyy-MM-dd');
                    });
                    
                    ngModelCtrl.$parsers.unshift(function(viewValue) {
                        return new Date(viewValue);
                    });
                },
            };
}])

// services
.factory('ContactService', [function () {
  var factory = {};

  factory.getContacts = function () {
    return contactList;
  }

  // contact list, usually would be a separate database
  var contactList = [
    {id: 0, fname: 'Alex', lname: 'Martin', email: 'alex@martin.com', phone: '123-456-7890', company: 'Google', dt: '1990-12-01'},
    {id: 1, fname: 'Theon', lname: 'Greyjoy', email: 'tgreyjoy@winterfell.com', phone: '123-456-7890', company: 'MicroSoft', dt: '2005-03-08'},
    {id: 2, fname: 'Samwell', lname: 'Tarly', email: 'starly@castleblack.com', phone: '123-456-7890', company: 'Amazon', dt: '1998-08-28'},
    {id: 3, fname: 'Jon', lname: 'Snow', email: 'jsnow@castleblack.com', phone: '123-456-7890', company: 'Chevron',dt: '2001-02-05'},
    {id: 4, fname: 'Arya', lname: 'Stark', email: 'waterdancer@winterfell.com', phone: '123-456-7890',  company: 'Yahoo', dt: '2004-11-12'}
    
  ];
  
  return factory;
}]);