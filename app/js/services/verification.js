angular.module('RoomDraw.services')
  .factory('Verification', ['$cookies', '$firebaseObject', 'Refs', '$rootScope',
    function($cookies, $firebaseObject, Refs,$rootScope) {  
      
      
     
      var write = function(a,b){
         $rootScope.hiddenMemberInfo = a;
         $rootScope.hidenRoomInfo = b;
      };
      
      var read = function(){
        return[$rootScope.hiddenMemberInfo,$rootScope.hidenRoomInfo];
      };


      return {
        write: write,
        read : read,
      };
    }
  ]);