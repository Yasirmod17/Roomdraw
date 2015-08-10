angular.module('RoomDraw.services')
  .factory('getTeams', ['$cookies', '$firebaseObject', 'Refs',
    function($cookies, $firebaseObject, Refs) {  
      
      
      var get_groups = function(){
        var groups = $firebaseObject(Refs.groups);
        return groups;
      };

      var get_shuffled = function(){
        var shuffled = $firebaseObject(Refs.shuffled);
        return shuffled;
      };

      var getTeams = function() {
        var teams = $firebaseObject(Refs.year);
        //console.log(teams);
        return teams;
      };

      return {
        getTeams: getTeams,
        get_shuffled : get_shuffled,
        get_groups : get_groups
      };
    }
  ]);