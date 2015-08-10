angular.module('RoomDraw.services')
  .factory('getWinners', ['$cookies', '$firebaseObject', 'Refs', 'Authentication',"$rootScope",
  function($cookies, $firebaseObject, Refs, Authentication,$rootScope) { 

    var userName=$rootScope.currentUser.name;
    //console.log(userName);
    var competitionGetter = function() {
          var _ = require('lodash')
          var competition = $firebaseObject(Refs.competitions);
         // console.log(competition)
          return competition;
        };

        return {
          competitionGetter: competitionGetter
        };
    }
  ]);

