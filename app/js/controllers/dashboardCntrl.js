var app = angular.module('RoomDraw.controllers');


app.controller('dashboardCntrl', ['Authentication', '$scope', '$rootScope', '$location', '$timeout', '$http', 'Competitions', 'UserDetails', 'Requests','getWinners',
	function(Authentication, $scope, $rootScope, $location, $timeout, $http, Competitions, UserDetails, Requests,getWinners) {

		//$scope.userName=$rootScope.currentUser.name;
		$scope.userName="Godson Ukpere" //for testing purpose
		$scope.userphoto=$rootScope.currentUser.picture;
		$scope.init = function() {
			var competitions = Competitions.botOlympics();
			competitions.$loaded().then(function(data) {
			$scope.competition = data;}
			);
			$scope.user=$rootScope.currentUser.uid;	
		}
		$scope.init2 = function(){
			$scope.userTeams=[]
			var all_competitions = getWinners.competitionGetter();
			all_competitions.$loaded().then(function(data) {
			$scope.competition = data;
			//console.log($scope.competition)
			var _ = require('lodash')
			//delete unwanted objects always present
			delete $scope.competition.$id;
			delete $scope.competition.$$conf;
			delete $scope.competition.$priority;
			//////////////////////find teams user is part of
			 _.forEach($scope.competition,function(i){
            	var team_list=i.teams;
            	//console.log(team_list);
            	var name = i.name;
            	//console.log(name);
            	
            	_.forEach(team_list,function(team){
            		members=team.members;
            		//console.log(members);
            		_.forEach(members,function(member){
            			if(_.include(member,$scope.userName)){
            				//console.log("YES, includes");
            				var name = i.name;
            				var pair={}
            				pair['Competition_name']=name;
            				pair['team_name']=team.name;
            				$scope.userTeams.push(pair);
            		}
            		})
            		
            	})
          });
			 //console.log($scope.userTeams);
		})}
		$scope.init3  = function(){
			$scope.competitionWon=[]
			var all_competitions = getWinners.competitionGetter();
			all_competitions.$loaded().then(function(data) {
			$scope.competition = data;
			//console.log($scope.competition)
			var _ = require('lodash')
			//delete unwanted objects always present
			delete $scope.competition.$id;
			delete $scope.competition.$$conf;
			delete $scope.competition.$priority;
			//////////////////////find teams user is part of
			 	_.forEach($scope.competition,function(i){
          var team_list=i.teams;
          //console.log(team_list);
         	var name = i.name;
         	//console.log(name);
					_.forEach(team_list,function(team){
      		members=team.members;
      		//console.log(members);
	      		_.forEach(members,function(member){
	      			if(_.include(member,$scope.userName)){
								if(team.winner != null){
									var pair={};
									pair['competition']=name;
									pair['won']=team.winner;
									$scope.competitionWon.push(pair)
								}
							}
						})
					})
				})
				//console.log($scope.competitionWon)
				$scope.init4();
			})
		}
		$scope.init4 = function(){
			//$scope.finishedAwards=[]
			var key={Overall:'Gold', Staff_favorite:'Silver', Most_useful:'Bronze',Best_ux:'Blue',
			Most_innovative:'green'};
			var _ = require('lodash');
			_.forEach($scope.competitionWon, function(i){
				$scope.pair={};
				$scope.awardHeader=[]
				$scope.awardHeader.push(i.competition)
				console.log($scope.awardHeader)
				var awardType=i.competition;
				var award=[];
				_.forEach(i.won,function(j){
						var Paward={};
						Paward['name'] =j ;
						//console.log(j);
						//console.log(key[j]);
						//console.log(key.j);
						Paward['color']= key[j];
						award.push(Paward);
						
				})
				$scope.pair[awardType]=award;
				
				//$scope.finishedAwards.push(pair);
			})
			console.log($scope.pair);
			//console.log($scope.finishedAwards);
		}

		$scope.init();
		$scope.init2();
		$scope.init3();
	}])