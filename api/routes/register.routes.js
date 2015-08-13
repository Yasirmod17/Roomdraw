var Firebase = require('firebase'),
  _ = require('lodash');
var unique_scores=[];
var year = ""
var id_to_group = {};///for matching id to group function.
var stopper = true; //stop he ping-pong between time_allocation and write_to_database function
var dorm_rooms = {'Morris Pratt':['101A','101B','102','103','104','201','202A','202B'],
                  'Valentine':['301A','301B','302','303','304','305A','305B']};
///Read dorm_rooms from a file

module.exports = function(app, config) {
  var root = new Firebase(config.firebase.rootRefUrl);
  var iterations = root.child('iterations');
  var usersRef = root.child('users');
  //var draw_year = iterations.year(); 

  var check_if_competition_exist = function(data, id) {
    return _.findWhere(data, function(val, key) {
      return key === id;

    });
  };


  var check_for_team_id = function(data, id){
    team_id_available = false;
    _.forEach(data, function(val, key){
      if(key === id) {
        team_id_available = true;
        return team_id_available;
      }
      else{
      _.forEach(val.members, function(val, key){
        if (key === id) {
          team_id_available = true;
          return team_id_available;
        }
      });
      }
    });
    return team_id_available;
  };


  ///////////MO functions start


//write_rooms(dorm_rooms);


// Fisher-Yates shuffle algorithm
  var shuffle = function(sourceArray) {
    for (var n = 0; n < sourceArray.length - 1; n++) {
        var k = n + Math.floor(Math.random() * (sourceArray.length - n));

        var temp = sourceArray[k];
        sourceArray[k] = sourceArray[n];
        sourceArray[n] = temp;
    }
    return sourceArray;
  };

  var write_rooms = function(dorm_rooms,year){
    iterations.child(year).child("Dormitories").set(null,function(error){
      if(!error){
        var available_dorms = Object.keys(dorm_rooms);
         console.log("DORMS DELETED");
         _.forEach(available_dorms,function(dorm){
         var dormrooms = dorm_rooms[dorm];
         console.log(dormrooms);
         iterations.child(year).child('Dormitories').child(dorm).set({
            available_rooms:dormrooms
          }, function(error) {
          if(!error){
            console.log(dorm,"DONE--------------------------------");
          }
          })
        })
      }


    })
    console.log("ALL DORMS WRITTEN")
  }

  var sort_groups_by_score =function(data){
    //console.log('sorting')
    var data_array=[];
    _.forEach(data,function(i){
      data_array.push(i)
    })
    //console.log(data_array);
    data_array.sort(function(a, b){
      //console.log("in sorting function");
      var key=Object.keys(a)[2];
      //var key2=Object.keys(b)[2];
      console.log(key);

      return (b.score-a.score);
    })
    
    console.log(data_array)  ///its is a list with objects in descending order of scores
    add_score_to_set(data_array);
    //add_score_to_set(new_groups);
    //return(data_array)
  }
  
  var check_for_group_id = function(groups, id){
    //console.log("IN function")
    group_id_available=false;
    _.forEach(groups, function(val, key){
      //console.log("IN foreach")
      //console.log(key)
      //console.log(id)
      if(key === id) {
        console.log("IN if")

        group_id_available = true;
        return group_id_available;
      }
    });
    return group_id_available;
  }
  var add_score_to_set = function(sorted_data){
    _.forEach(sorted_data,function(group){
      if(!_.include(unique_scores,group.score)){
        unique_scores.push(group.score)
        }
      
    })
    console.log(unique_scores);
    create_luv_objects(unique_scores,sorted_data);
  }  

  //seperate all different luv scores and shuffle the goupps within them
  var create_luv_objects = function(score_list, group_list){
    var parent_object = {};
    _.forEach(score_list, function(i){
      var score_object =[];
      _.forEach(group_list,function(group){
        if(group.score == i){
          score_object.push(group);
        }
      })
      parent_object[i] = score_object;
    })
    console.log(parent_object);
    shuffled_parent_object = {};
    _.forEach(score_list,function(child){
      console.log(child);
      
      //var key =  Object.keys(child);
      //console.log(key);
      console.log(parent_object[child]);
      var new_child = shuffle(parent_object[child])
      shuffled_parent_object[child] = new_child;
    })
    console.log(shuffled_parent_object)
    write_to_database(shuffled_parent_object,score_list);
  }
  var write_to_database = function(shuffled_parent_object,score_list){
    // keys_change = Object.keys(shuffled_parent_object);
    // for(i=0;i<keys_change.length,i++){
    //   keys_change(i).replace('_','.');
    // }
    iterations.child(year).child("shuffled_luv").set(null,function(error){
      if(!error){
        console.log("PREVIOUS LUVS DELETED");
        for(i=0;i<score_list.length;i++){
          a=score_list[i]
        //_.forEachRight(score_list,function(a){ //write small luvs first
          console.log(a);
          var b = Math.round(a * 100) / 100
          var b=b.toString()
          b = b.replace('.','_')
          //b=Math.round10(a, -1);
          //console.log(b);
          console.log(shuffled_parent_object[a])
          //console.log(shuffled_parent_object[a].name)
          _.forEach(shuffled_parent_object[a],function(i){
            console.log(i)
          iterations.child(year).child('shuffled_luv').child(b).child(i.name).set({
            members: i.members,
            name: i.name,
            score: i.score,
            show:"",
            time:i.time,
            id:i.id 
          }, function(error) {
          if(!error){
            console.log("Succesfully wrote group");
          }
          })
        })
        }
        //)
      if(stopper){
        console.log("in if stopper");
        time_allcoation();
      } 
      }
    }) 
    console.log("----------ALL LUVS WRITTEN----------")
    
  }

var time_allcoation = function(){
  iterations.child(year).child('shuffled_luv').once('value',function(snap){
    var groups=snap.val();
    console.log(groups);
    var day_done=false;
    //var start_time= 20:00;
    //var timeSlots = [2000,2015,2030,2045,2100,2115,2130,2145,2200,2215,2230,2245,2000,2315,2330,2345]
    var timeSlots = ['20:00','20:15','20:30','20:45','21:00','21:15','21:30','21:45','22:00','22:15','22:30','22:45','20:00','23:15','23:30','23:45']
    var counter=1;
    var index= 0;
    _.forEach(groups, function(luv){
      _.forEach(luv,function(group){
        if (counter == 0){
          counter=1;
          index=index+1;
          if(index == timeSlots.length){
            day_done=true;
            return;
          }
        }

          group['time'] = timeSlots[index]
          counter =counter-1;
          console.log(group);

      })

    })
    //console.log(groups)
    console.log(day_done);
    stopper = false;
    placeholder_object= {};
    keys_change=Object.keys(groups);
    console.log(keys_change);
    console.log(groups);
    var old_groups = groups
    var new_groups = {}
    for(i=0;i<keys_change.length;i++){

      group = old_groups[keys_change[i]];
      var key_in_luv_group = Object.keys(group);
      one_group =group[key_in_luv_group[0]]
      console.log("-------")
      console.log(one_group);
      console.log(one_group.score);
      //console.log(one_group[score]); 
      console.log("////////////////")
      new_key = keys_change[i].replace('_','.');
      new_groups[one_group.score] = group;
      //delete groups.keys_change[i];
    }
    console.log(new_groups);
    write_to_database(new_groups,unique_scores); //re-weite to shuffled -luv database child
  })
}
var disable_group_permission = function(group_name,group_score){
  var b = Math.round(group_score * 100) / 100
  var b=b.toString()
  b = b.replace('.','_')
  console.log(b)
  console.log(group_name);
  iterations.child(year).child('shuffled_luv').child(b).child(group_name).update({
      time:'30:00'
    }, function(error) {
    if(!error){
      console.log("Succesfully removed group permission");
    }
    })
}
//UNTESTED FUNCTIONS/////
var match_id_to_name = function(){
  iterations.child(year).child('groups').once('value',function(snap){
     var all_groups=snap.val();
     var id_to_group = {};
     //var id = Object.keys(all_groups);
     _.forEach(all_groups,function(group){
        id_to_group[group.id] = group.name;
     })
    console.log(id_to_group);
    //return(id_to_group);
})
}

////////////////////////////////////////////////////MO functions END

 


 var check_if_team_exist = function(data, team_id) {
    return _.findWhere(data, function(val, key) {
      return key === team_id;
    });
  }; 


  app.route('/competitions').get(function(req, res) {
    competition.once('value', function(snap) {
      var snapValues = snap.val();
      if (snapValues) {
        res.json(snapValues);
      } else {
        res.json({error:"invalid competition name"});
      }
    });
  });

  app.route('/competitions').post(function(req, res) {
    var existing_competitions, new_competition = req.body;
    console.log(new_competition);
    new_competition.created_date = Firebase.ServerValue.TIMESTAMP;
    competition.child(new_competition.name).set(new_competition, function(error) {
      if (!error) {
        res.json(new_competition);
      } else {
        res.json({
          error: 'Could create a new competition'
        });
      }
    });
    // competition.once('value', function(snap) {
    //   check_if_competition_exist = snap.hasChild(new_competition.name);
    //   if (check_if_competition_exist) {
    //     res.json({
    //       error: 'This competition already exists'
    //     });
    //   } else {
    //     competition.child(new_competition.name).set(new_competition, function(error) {
    //       if (!error) {
    //         res.json(new_competition);
    //       } else {
    //         res.json({
    //           error: 'error'
    //         });
    //       }
    //     });
    //   }
    // });
  });

  app.route('/competitions/:competitionName').get(function(req, res) {
    competition.once('value', function(snap) {
      var snapValues = snap.val();
      snapValues = _.findWhere(snapValues, function(val, key) {
        return key === req.params.competitionName;
      });
      if (snapValues) {
        res.json(snapValues);
      } else {
        res.json({error:"invalid competition name"});
      }
    });
  });

  app.route('/competitions/:competitionName').put(function(req, res) {
    var existing_competitions;
    competitionName = req.params.competitionName;
    existing_competitions = req.body;
    existing_competitions.updated_date = Firebase.ServerValue.TIMESTAMP;

    competition.once('value', function(snap) {
      check_if_competition_exist = check_if_competition_exist(snap.val(), competitionName);
      if (!check_if_competition_exist) {
        res.json({
          error: 'This competition does not exists'
        });
      } else {
        existing_competitions = _.extend(check_if_competition_exist, existing_competitions);
        competition.child(competitionName).set(existing_competitions, function(error) {
          if (!error) {
            res.json(existing_competitions);
          } else {
            res.json({
              error: 'You can\'t update this competition'
            });
          }
        });
      }
    });
  });


///////////MO routes start------------------------------
  app.route('/:year/getRooms').get(function(req,res){
    console.log("Trying to get rooms,backend");
    iterations.child(req.params.year).child('Dormitories').once('value',function(snap){
      var groups=snap.val();
      console.log(groups);
      res.send(groups);
    })
  });

  app.route('/:year/writeRooms').get(function(req,res){
    console.log("Trying to write rooms,backend");
    write_rooms(dorm_rooms,req.params.year);
    console.log(req.params.year);
    res.send("Writing Rooms");
  })


  app.route('/:year/addTeam').post(function(req, res){
    
    //console.log(req.body);
    year= req.params.year;
    console.log("add team backend");
    //console.log(iterations);
    //console.log(req.params.year);
    iterations.child(req.params.year).child('groups').once('value',function(snap){
      var groups=snap.val();
      

      check_for_group_id(groups, req.body.team_id);
      //console.log(group_id_available)
      if(group_id_available){
        res.json({
          error: 'You are already a memeber of a group'
        });
      }
      else{
        var team_name_exists=false
        if(!group_id_available){
          //console.log("!group_id_available");
          _.forEach(groups,function(group){
            if(group.name.toLowerCase()== req.body.teamName.toLowerCase()){
              console.log('team name in use')
              res.json({error:"Team name in use"});
              team_name_exists=true;
            }
          });
        //console.log("done with if");
        }
        if(!team_name_exists){
          //console.log('!group_id_available else')
          var question= req.body.members;
          //console.log(question)
          var member_in_team = false;
          iterations.child(req.params.year).child('groups').once('value',function(snap){
            var all_members_object=snap.val();
            var all_members=[];
            _.forEach(all_members_object,function(i){
              //console.log(i)
              all_members.push(i)
            })
            
            //console.log(all_members);
            _.forEach(all_members,function(i){
              _.forEach(question,function(j){
                //console.log(j.name);
                _.forEach(i.members, function(k){
                  if(k.name.toLowerCase() ==j.name.toLowerCase()){
                    console.log(k.name,j.name);
                    member_in_team = true;
                    res.json({error: "A member is already in a team"})
                    return;
                  }
                })
              })
            });
            console.log(member_in_team);
            if(member_in_team == false){
              iterations.child(req.params.year).child('groups').child(req.body.team_id).set({
                name: req.body.teamName,
                members: req.body.members,
                score: req.body.score,
                id:req.body.team_id,///added this to make it easier to match team_id to name
                time:'', ///added this to make it easier to add time
                show:""
              }, function(error) {
                if(!error){
                  res.send('TEAM SUCCESSFULLY CREATED!')
                  console.log("done")
                  //////to be sorted/////
                  iterations.child(req.params.year).child('groups').once('value',function(snap){
                    console.log('getting groups');
                    var groups=snap.val();
                    console.log(groups)
                    console.log("unsorted array");
                    var new_groups = sort_groups_by_score(groups)
                    // console.log("sorted coming up")
                    // console.log(new_groups);}) /////THIS IS A LIST!
                 })   
                }
                else {
                  res.json({
                    error: 'Team not successfully created'
                  });
                }
              });
            }
            
          });
        }  
      }
    });
  })

  app.route('/:year/saveRoomChoices').post(function(req,res){
    year = req.params.year;
    iterations.child(req.params.year).child('Dormitories').once('value', function(snap) {
      var removed_rooms={};
      var dorms = snap.val();
      var room_info = req.body;
      console.log(req.body);
      var group_name = room_info.group_name;
      var group_score = room_info.group_score;
      delete room_info.group_name;
      delete room_info.group_score;
      console.log(room_info);
      console.log(group_name)
      console.log(group_score)
      var people_names =  Object.keys(room_info);
      console.log(people_names);
      _.forEach(people_names,function(person_name){
        var person_detail = room_info[person_name];
        var dorm_choice = person_detail.dorm;
        console.log(dorm_choice);
        removed_rooms[dorm_choice]=[];
        console.log(person_detail.room);
        iterations.child(req.params.year).child('Picked').child(person_name).set({
          detail:person_detail
        },function(error){
          if(!error){
            console.log("ROOM CHOICE SAVED",person_name);
            //console.log(dorms.dorm_choice);
            console.log(dorms[dorm_choice].available_rooms);
            var initial_rooms_available = dorms[dorm_choice].available_rooms;
            console.log(initial_rooms_available);
            var  new_rooms_available = [];
            _.forEach(initial_rooms_available,function(room){
              if (room != person_detail.room){
                if(_.include(removed_rooms[person_detail.dorm],room)){
                  console.log('previously removed',room)
                }
                else{
                new_rooms_available.push(room);
                }
              }
              else{

                removed_rooms[person_detail.dorm].push(person_detail.room);
              }
            })
            console.log(new_rooms_available)
            console.log(removed_rooms);
            iterations.child(req.params.year).child('Dormitories').child(dorm_choice).set({
              available_rooms:new_rooms_available
            },function(error) {
                if(!error){
                  //res.send('ROOM CHOICES SAVED. CONGRATULATIONS!')
                  console.log("Available rooms Updated",person_name);   
                }
                else {
                  res.json({
                    error: 'Rooms not successfully Updated'
                  });
                }
              })
          }
          else{
            res.json({error: 'Room choice not saved'})
          } 
        })  
      })
    disable_group_permission(group_name,group_score);
    res.send("Room choices saved");
    })
  })
  

//////////MO routes end------------------------------

  app.route('/competitions/:competitionName/register').post(function(req, res) {
    competition.child(req.params.competitionName).child('teams').once('value', function(snap) {
      var teams = snap.val();
      check_for_team_id(teams, req.body.team_id);
      if (team_id_available) {
        res.json({
          error: 'You are already a memeber of a team'
        });
      } else {
        competition.child(req.params.competitionName).child('teams').child(req.body.team_id).set({
          name: req.body.name,
          description: req.body.description,
          registered: false
        }, function(error) {
          if (!error) {
            usersRef.child(req.body.team_id).once('value', function(userSnap) {
              var user = userSnap.val();
              if(user) {
                var userObj = {
                  name: user.name,
                  picture: user.picture,
                  accepted: true
                };
                competition.child(req.params.competitionName).child('teams').child(req.body.team_id).child('members').child(req.body.team_id).set(userObj, function(error) {
                  if (error) {
                    res.json({error: 'you were unable to join the team automatically'});
                  } else {
                    res.json(req.body);
                  }
                });
              }
            });
          } else {
            res.json({
              error: 'Team not successfully created'
            });
          }
        });
      }
    });
  });

  app.route('/competitions/:competitionName/register').put(function(req, res) {
    competition.child(req.params.competitionName).child('teams').once('value', function(snap) {
      team_id_available = snap.hasChild(req.body.team_id);
      registered_team = _.findWhere(snap.val(), function(val, key) {
        return key === req.body.team_id;
      });
      check_for_false_in_team = _.contains(registered_team.members, false);
      if (!team_id_available) {
        res.json({
          error: 'Team does not exist'
        });
      } else {
        if (check_for_false_in_team) {
          res.json({
            error: 'You have a pending request for your team'
          });
        } else {
          registered_team.registered = true;
          competition.child(req.params.competitionName).child('teams').child(req.body.team_id).set(registered_team);

        }
      }
    });
  });


  app.route('/competitions/:competitionName/teams/:teamId/members').post(function(req, res) {
    team_id = req.params.teamId;
    competition_name = req.params.competitionName;
    competition.child(req.params.competitionName).child('teams').once('value', function(snap) {
      snapValues = snap.val();
      team_exist = check_if_team_exist(snapValues, team_id);
      new_member = check_for_team_id(snapValues, req.body.user_id);
      if (team_exist && !new_member) {
        usersRef.child(req.body.user_id).once('value', function(userSnap) {
          var user = userSnap.val();
          if(user) {
            var userObj = {
              name: user.name,
              picture: user.picture,
              accepted: false
            };
            competition.child(req.params.competitionName).child('teams').child(team_id).child('members').child(req.body.user_id).set(userObj, function(error) {
              if (error) {
                res.json({error:'Your could not join this team'});
              } 
              else {
                res.json(req.body);
              }
            });
          }
        });
      }
      else{
        res.json({error: 'You are already a member of a team'});
      }
    });
  });

  app.route('/competitions/:competitionName/teams/:teamId/members/:memberId').delete(function(req, res) {
    team_id = req.params.teamId;
    competition_name = req.params.competitionName;
    competition.child(req.params.competitionName).child('teams').child(team_id).child('members').once('value', function(snap) {
      snapValues = snap.hasChild(req.params.memberId);
      if (!snapValues) {
        res.json({
          error: 'invalid member'
        });
      } else {
        competition.child(req.params.competitionName).child('teams').child(team_id).child('members').child(req.params.memberId).set(null, function(error) {
          if (error) {
            res.json({
              error: 'Not successfully deleted'
            });
          } else {
            res.json({
              success: req.params.memberId + 'successfully deleted'
            });
          }
        });
      }
    });
  });


  app.route('/competitions/:competitionName/teams/:teamId/members/:memberId').put(function(req, res) {
    team_id = req.params.teamId;
    competition_name = req.params.competitionName;
    competition.child(req.params.competitionName).child('teams').child(team_id).child('members').child(req.params.memberId).once('value', function(snap) {
      snapValues = snap.val();
      if(snapValues === null){
        res.json({error: 'invalid entry'});
      }
      else if (!snapValues.accepted) {
        competition.child(req.params.competitionName).child('teams').child(team_id).child('members').child(req.params.memberId).child('accepted').set(true, function(error) {
          if (error) {
            res.json({error:'You can\'t join the team'});
          } else {
            res.json(req.params.memberId);
          }
        });
      } else {
        competition.child(req.params.competitionName).child('teams').child(team_id).child('members').child(req.params.memberId).child('accepted').set(false, function(error) {
          if (error) {
            res.json({error: 'You can\'t join the team'});
          } else {
            res.json(req.params.memberId);
          }
        });
      }
    });
  });
};
