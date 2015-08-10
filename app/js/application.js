// defining modules
angular.module('RoomDraw.controllers', []);
angular.module('RoomDraw.services', []);

/* loading services */
require('./services/auth.js');
require('./services/refs.js');
require('./services/competitions.js');
require('./services/user.js');
require('./services/http.requests.js');
require('./services/http.requests.js');
require('./services/dashboardServices.js');
require('./services/drawyear.js');
require('./services/teamservice.js');

// loading controller
require('./controllers/mainCtrl.js');
require('./controllers/dashboardCntrl.js')

window.RoomDraw = angular.module('RoomDraw', [
	'ngRoute',
	'ngCookies',
	'firebase',
	'RoomDraw.controllers',
	'RoomDraw.services'
]);

RoomDraw.config(['$routeProvider','$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/', {
				templateUrl: 'views/startupPage.html',
				controller: 'mainCtrl'
			})
			.when('/getStarted', {
				templateUrl: 'views/home.html',
				controller: 'mainCtrl'
			})
			.otherwise({
				templateUrl: '404.html'
			});
	}]);

RoomDraw.run(['$rootScope', 'Authentication', 'Refs',
  function($rootScope, Authentication, Refs) {
  	Refs.root.onAuth(function(authData) {
  		if(authData) {
  			var user = {
          uid: authData.uid,
          name: authData.google.displayName,
          email: authData.google.email,
          accessToken: authData.google.accessToken,
          picture: authData.google.cachedUserProfile.picture
        };
  			$rootScope.currentUser = user;
  			console.log($rootScope.currentUser);
  			return $rootScope.currentUser;
  		}
      else {
      	Authentication.logout();
      }
    });
  }]);








$(function() {
	$('.how-link').on('click', function() {
		console.log("Clicked");
		$('.overlay').scrollTo('.content.how', 800);
	});
});
