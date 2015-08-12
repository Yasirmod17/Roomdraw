angular.module('RoomDraw.services')
  .factory('Requests', ['$cookies', '$http',
    function($cookies, $http) {
    	return {
        addTeam: function(url, object, callback){
          console.log("AddTeam http.requests");
          console.log(object)
          $http.post(url, object)
          .success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback();
            Materialize.toast('Your team was created!', 5000, 'teal accent-4');
          })
          .error(function(err) {
            console.log(err);
            //Materialize.toast('ERROR:'+ err, 5000, 'red darken-3');
            Materialize.toast('ERROR: Team could not be created!\nPlease, try again later.', 5000, 'red darken-3');
            return err;
          });
        },


        writeRooms: function(url){
          console.log(url,"http requests")
          $http.get(url)
          .success(function(data){
            if(data.error) {
              Materialize.toast('ERROR: Couldnt write rooms' , 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            //callback(data)
          })
          .error(function(err){
            Materialize.toast('ERROR: Couldnt try to write rooms' , 5000, 'red darken-3');
            return err;
          });
        },

        getRooms: function(url, callback){
          console.log(url,"http requests")
          $http.get(url)
          .success(function(data){
            if(data.error) {
              Materialize.toast('ERROR: Couldnt get rooms' , 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback(data)
          })
          .error(function(err){
            Materialize.toast('ERROR: Couldnt try to get rooms' , 5000, 'red darken-3');
            return err;
          });
        },

        saveRoomChoices: function(url,object,callback){
          $http.post(url,object)
          .success(function(data){
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback();
            Materialize.toast('Your rooms choices have been saved!', 5000, 'teal accent-4');
          })
          .error(function(err) {
            Materialize.toast('ERROR: Room choices cant be saved\nPlease, try again later.', 5000, 'red darken-3');
            return err;
          })
        },

        createTeam: function(url, object, callback) {
          $http.post(url, object)
          .success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback();
            Materialize.toast('Your team was created!', 5000, 'teal accent-4');
          })
          .error(function(err) {
            Materialize.toast('ERROR: Team could not be created!\nPlease, try again later.', 5000, 'red darken-3');
            return err;
          });
        },

    		joinTeam: function(url, object, callback) {
    			$http.post(url, object)
    			.success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
    				console.log(data);
            callback();
            Materialize.toast('You have successfully joined the team!', 5000, 'teal accent-4');
    			})
    			.error(function(err) {
            Materialize.toast('ERROR: Team could not be joined!\nPlease, try again later.', 5000, 'red darken-3');
            console.log(err);
    				return err;
    			});
    		},

    		registerTeam: function(url, object, callback) {
    			$http.put(url, object)
    			.success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
    				console.log(data);
            callback();
            Materialize.toast('Your team was successfully registered!', 5000, 'teal accent-4');
    			})
    			.error(function(err) {
            Materialize.toast('ERROR: Team could not be registered!\nPlease, try again later.', 5000, 'red darken-3');
    				return err;
    			});
    		},
        
        acceptMember: function(url, callback) {
          $http.put(url)
          .success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback();
            Materialize.toast('Member has been successfully accepted!', 5000, 'teal accent-4');
          })
          .error(function(err) {
            Materialize.toast('ERROR: Member could not be accepted!\nPlease, try again later.', 5000, 'red darken-3');
            return err;
          });
        },

        declineMember: function(url, callback) {
          $http.delete(url)
          .success(function(data) {
            if(data.error) {
              Materialize.toast('ERROR: ' + data.error, 5000, 'red darken-3');
              return data.error;
            }
            console.log(data);
            callback();
            Materialize.toast('Member has been successfully rejected!', 5000, 'teal accent-4');
          })
          .error(function(err) {
            Materialize.toast('ERROR: Member could not be rejected!\nPlease, try again later.', 5000, 'red darken-3');
            return err;
          });
        }
    	};
    }
  ]);
