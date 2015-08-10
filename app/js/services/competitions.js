angular.module('RoomDraw.services')
  .factory('Competitions', ['$cookies', '$firebaseObject', 'Refs',
    function($cookies, $firebaseObject, Refs) {  
      
      var botOlympics = function() {
        var competition = $firebaseObject(Refs.bot_olympics);
        return competition;
      };

      return {
        botOlympics: botOlympics
      };
    }
  ]);
