angular.module('RoomDraw.controllers')
.controller('mainCtrl', ['Authentication', 'DrawYear','getTeams','$scope', '$rootScope', '$location', '$timeout', '$http', 'UserDetails', 'Requests','Verification',
	function(Authentication, DrawYear,getTeams, $scope, $rootScope, $location, $timeout, $http, UserDetails, Requests,Verification) {

		$scope.login = function() {
			Authentication.login();
		};

		$scope.logout = function() {
			Authentication.logout();
			
      		Materialize.toast('You have successfully logged out!', 5000, 'teal accent-4');
		};

		$rootScope.room_info = {}; /////BINDING MODEL FOR EACH PERSON IN THE GROUP
		$rootScope.members_in_team =[];////////FOR ROOMCHOICES
		$scope.init = function() {
			//console.log($rootScope.currentUser.uid);
			var year= DrawYear.year()  
			var get_teams =getTeams.getTeams();
			get_teams.$loaded().then(function(data) {
			 $rootScope.teams = data; //used in orderedList
			 $rootScope.unordered = data //used for unorderedList
			})

			var shuffled = getTeams.get_shuffled();
			shuffled.$loaded().then(function(data) {
			 $rootScope.shuffled = data; 
			 //console.log(data);
			 delete $rootScope.shuffled.$id;
			 delete $rootScope.shuffled.$$conf;
			 delete $rootScope.shuffled.$priority;
			 _.forEach($rootScope.shuffled,function(luv){
				//console.log(luv)
				_.forEach(luv,function(group){
					var time =group.time;
					//console.log($rootScope.time.getHours())
					console.log(time);
					var binder_length= group.members.length;
					
					if(group.id == $rootScope.currentUser.uid){
						console.log("USER CREATED TEAM", group.name);
						if($rootScope.time.getHours()==parseInt(time[0]+time[1])){
							if($rootScope.time.getMinutes()>=parseInt(time[3]+time[4])){
								console.log("its timeeeee")
								$rootScope.team_name = group.name
								group.show=true;							
								_.forEach(group.members,function(member){
									$rootScope.room_info[member.name] ={dorm:"",room:""};
									$rootScope.members_in_team.push(member.name);
									//console.log($rootScope.room_info);
									//console.log(member.name);
								})
								}
						}
						if($rootScope.time.getHours()>parseInt(time[0]+time[1])){
								console.log("its timeeeee")
								group.show=true;
								_.forEach(group.members,function(member){
									$rootScope.room_info[member.name] ={dorm:"",room:""};
									$rootScope.members_in_team.push(member.name);
									//console.log($rootScope.room_info)
									//console.log(member.name);
								})
						}
					}
					console.log($rootScope.room_info);
				})
			 })
			})
			//console.log($rootScope.room_info);
			
		}
		//$scope.roomPick={roomId:"",dormId:""};

		$scope.verification = function(){
			Verification.write($rootScope.members_in_team,$rootScope.room_info)
			
			$location.path('/submitRoomChoices');
		}

		$scope.changeRooms = function(person){
			//console.log(person.name);
			//console.log($rootScope.room_info);
			//console.log(picked);
			var who = person.name;
			//console.log(who);

			$scope.Person = $rootScope.room_info[who];
			$scope.Person_dorm = $scope.Person.dorm;
			//console.log($scope.Person_dorm)
			console.log("picked", $scope.Person_dorm);
			$scope.rooms = $rootScope.dormRooms[$scope.Person_dorm]
			console.log($scope.rooms);
		}

		$scope.showRoomInfo = function(){
			console.log($rootScope.room_info);
		}

		$scope.init2 = function(data){
			$rootScope.dormRooms = data;
			$rootScope.dorms = Object.keys($rootScope.dormRooms)
			//console.log($rootScope.dorms);
			//console.log($rootScope.dormRooms)
		}



		
		$scope.time = function(){
			var time = new Date();
			$rootScope.time = time;
			//console.log(time.getHours())
;		}
		$scope.time();
		
		$rootScope.year= 2015;
		/////////////////////////////////////
		$scope.team_detail={name:""}
		$scope.members = [{id:'member1'}];
		$scope.addNewMember=function(){
			 var memberLength=$scope.members.length + 1;
			$scope.members.push({id:'member'+ memberLength})
		}
		$scope.removeMember=function(){
			var LastMemberLength=$scope.members.length-1;
			$scope.members.splice(LastMemberLength)
		}
		$scope.evaluateTeam = function(){
			var luvScores={'2016':5, '2016E':4.5, '2017':3, '2017E': 2.5, '2018':1, '2018E':0.5}
			var _ = require('lodash')
			$scope.EvaluatedTeam={teamName:$scope.team_detail.name , members:[], score:"" }
			$scope.mem_bers = []
			$scope.teamLength=$scope.members.length;
			$scope.score=0;
			_.forEach($scope.members,function(i){
				$scope.score = $scope.score + luvScores[i.classyear];
				$scope.mem_bers.push({name: i.name, classyear: i.classyear})
			})
			$scope.final_luv = $scope.score/$scope.teamLength
			//console.log($scope.final_luv);
			$scope.EvaluatedTeam.members = $scope.mem_bers
			$scope.EvaluatedTeam.score = $scope.final_luv;
			//console.log($scope.EvaluatedTeam);
			$scope.addTeam()
		}
		$scope.getRooms = function(){
			var url = '/2015/getRooms';
			Requests.getRooms(url , $scope.init2);
		}
		$scope.writeRooms = function(){
			var url = '/2015/writeRooms';
			Requests.writeRooms(url);
		}

		$scope.addTeam = function() {
			var url = '/2015/addTeam';
			$scope.EvaluatedTeam.team_id = $rootScope.currentUser.uid;
			Requests.addTeam(url, $scope.EvaluatedTeam, $scope.init);
		};
		$scope.time_keeper = function(){
			$rootScope.time = new Date();
			$scope.display_roomPick();
		}

		// $scope.display_roomPick = function(){
		// 	var shuffled = getTeams.get_shuffled();
		// 	shuffled.$loaded().then(function(data) {
		// 	 $rootScope.shuffled = data; 
		// 	})
		// 	_.forEach($rootScope.shuffled,function(luv){
		// 		_.forEach(luv,function(group){
		// 			var time =group.time;
		// 			console.log(time)
		// 			if($rootScope.time.getHours()>=parseInt(time[0]+time[1])){
		// 				if($rootScope.time.getMinutes()>=parseInt(time[3]+time[4])){
		// 					console.log("its timeeeee")
		// 					group.show=true;
		// 				}
		// 			}

		// 		})
		// 	})
		// 	$scope.time_keeper();
		// }
		// $scope.createTeam = function() {
		// 	var url = '/competitions/Bot Olympics/register';
		// 	$scope.team.team_id = $rootScope.currentUser.uid;
		// 	Requests.createTeam(url, $scope.team, $scope.init);
		// };

		// $scope.joinTeam = function(team_id) {
		// 	var url 		= '/competitions/Bot Olympics/teams/' + team_id + '/members/',
		// 			object 	= {user_id: $rootScope.currentUser.uid};
		// 	console.log(url, object);
		// 	Requests.joinTeam(url, object, $scope.init);
		// };

		// $scope.registerTeam = function(team_id) {
		// 	var url = '/competitions/Bot Olympics/register/' + team_id;
		// 	Requests.registerTeam(url, {registerId: team_id, user_id: $rootScope.currentUser.uid});
		// };

		// $scope.acceptMember = function(memberId) {
		// 	$scope.team_id =  $rootScope.currentUser.uid;
		// 	var url = '/competitions/Bot Olympics/teams/' + $scope.team_id + '/members/' + memberId;
		// 	Requests.acceptMember(url, $scope.init);
		// };

		// $scope.declineMember = function(memberId) {
		// 	$scope.team_id =  $rootScope.currentUser.uid;
		// 	var url = '/competitions/Bot Olympics/teams/' + $scope.team_id + '/members/' + memberId;
		// 	Requests.declineMember(url, $scope.init);
		// };

		$scope.init();
		//$scope.display_roomPick();
	}
]);
