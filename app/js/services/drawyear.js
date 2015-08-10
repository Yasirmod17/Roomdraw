angular.module('RoomDraw.services')
  .factory('DrawYear', ['$cookies', '$firebaseObject', 'Refs',
    function($cookies, $firebaseObject, Refs) {  
      
      var year = function() {
        var draw_year = $firebaseObject(Refs.year);
        return draw_year;
      };

      return {
        year: year
      };
    }
  ]);
