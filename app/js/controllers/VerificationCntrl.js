angular.module('RoomDraw.controllers')
.controller('VerificationCntrl', ['Authentication', 'DrawYear','getTeams','$scope', '$rootScope', '$location', '$timeout', '$http', 'UserDetails', 'Requests','Verification',
	function(Authentication, DrawYear,getTeams, $scope, $rootScope, $location, $timeout, $http, UserDetails, Requests,Verification) {
		var temp = Verification.read();
		console.log(temp);
		$rootScope.room_info = temp[1]; /////BINDING MODEL FOR EACH PERSON IN THE GROUP
		$rootScope.members_in_team =temp[0];

		$scope.init = function(){
			$location.path('/');
		}

		$scope.saveRoomChoices = function(){
			var url = '/2015/saveRoomChoices';
			//$scope.EvaluatedTeam.team_id = $rootScope.currentUser.uid;
			Requests.saveRoomChoices(url, $rootScope.room_info,$scope.init)// $scope.init);
		}
	}])
//This controller uses a service(verification service) as a temporary placeholder for data when switching from maincntrl to this.