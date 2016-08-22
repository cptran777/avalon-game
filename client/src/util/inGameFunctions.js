module.exports = {
  // Addition of all players at the beginning of the game
  // Expects an array of objects with uid and color property
  addAllPlayers: function(players, selfId) {
    // Create the order by adding everyone up to the selfId on the players
    // list to the end of the render order and everyone after the selfId
    // is found to the beginning of the render order
    let renderOrderLeft = [];
    let renderOrderRight = [];

    for (let x = 0, foundSelf = false; x < players.length; x++) {
      if (players[x].uid === selfId) {
        foundSelf = true;
      } else {
        (foundSelf ? renderOrderLeft : renderOrderRight).push(players[x]);
      }
    }

    let renderOrder = renderOrderLeft.concat(renderOrderRight);

    // Set coordinates for each player based on render order
    // Players will be in a circle around the central origin point, with 
    // the camera taking the place of the current player at 0 degrees

    let playersWithPositions = this.setCircleCoordinates(renderOrder, 250);

    console.log('playersWithPositions', playersWithPositions);



    for (let y = 0; y < playersWithPositions.length; y++) {
      console.log('circle pos inside playersWithPositions', playersWithPositions[y].pos);
      this.addPlayer(
        playersWithPositions[y].uid, 
        playersWithPositions[y].color, 
        null, 
        playersWithPositions[y].pos);
    }

  },
  // When a player joins the game
  addPlayer: function(uid, color, role, circlePos) {
    console.log('circlePos inside addPlayer', circlePos);
    this.players.push({
      uid,
      x: 0,
      y: 0,
      color,
      role: this.roleColors['defaultColor'],
      pos: circlePos
    });      

    let sphereMaterial =
      new THREE.MeshLambertMaterial({
          color
      });
    let radius = 20,
        segments = 16,
        rings = 16;
    let sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, rings),
      sphereMaterial);

    sphere.name = uid;
    sphere.position.x = 0;
    sphere.pos = circlePos;

    this.scene.add(sphere);
  },
  removePlayer: function(uid) {
    this.removeObject(uid);    
    for (let x = 0; x < this.players.length; x++) {
      if (this.players[x].uid === uid) {
        this.players.splice(x, 1);
      }
    }
  },
  // Assign roles attaches the roles of the game to the player objects
  assignRoles: function(party, id, role) {
    if (role === 'MERLIN' || role === 'ASSASSIN' || role === 'MINION') {
      //Show minions as red to these characters
      for (let player in party) {
        if (player !== id) {
          if (party[player] === 'MINION' || party[player] === 'ASSASSIN') {
            this.scene.getObjectByName(player).material.color.setHex(this.roleColors['MINION']);
          }      
        }
      }
    }
  },
  stabMerlin: function(sendPickedMerlin) {
    this.addClickEventListener('stabMerlin', 1, sendPickedMerlin);

    setTimeout(()=>{
      //Remove sign and click event listener if no choice made
      this.removeObject('stabMerlin');
      this.removeClickEventListener();
    }, 5000);
  },
  // Allows the party leader to pick a party. 
  pickParty: function(sendPickedParty, partyNumber) {
    let pidsList = this.players.map(player => {
      return player.uid;
    });
    if (this.usingVR) {
      this.addVRPressEventListener('pickParty', partyNumber, sendPickedParty, {choices: pidsList});
    } else {
      this.addClickEventListener('pickParty', partyNumber, sendPickedParty, {choices: pidsList}); 
    }

    setTimeout(()=>{
      //Remove sign and click event listener if no choice made      
      this.removeObject('pickParty');
      this.removeClickEventListener();
    }, 30000);
  },
  // TODO: Pending field test to determine whether the buttons are well placed
  // at these new coordinates. 
  partyButtons: function(voteOnParty) {
    this.addButton(
      'accept', 
      0xFFFFFF, 
      { lenx: 35, leny: 80, lenz: 10 }, 
      { posx: -50, posy: -100, posz: 0 }
    );
    this.addButton(
      'reject', 
      0xFF0000, 
      { lenx: 35, leny: 80, lenz: 10 }, 
      { posx: 50, posy: -100, posz: 0 }
    );

    //All stages will have signs but not all stages will have buttons
    //Extend callback to remove buttons after choices have been made
    const votePartyCallback = (choice) => {
      voteOnParty(choice[0] === 'reject' ? false : true);
      
      this.removeObject('accept');
      this.removeObject('reject');      
    };

    if (this.usingVR) {
      this.addVRPressEventListener('approveParty', 1, votePartyCallback, {choices: ['accept', 'reject']});
    } else {
      this.addClickEventListener('approveParty', 1, votePartyCallback, {choices: ['accept', 'reject']});
    }

    setTimeout(()=>{
      this.removeObject('approveParty'); 
      this.removeObject('accept');
      this.removeObject('reject');       
      this.renderer.domElement.removeEventListener('click', this.clickEvent);
    }, 30000);
  },
  // TODO: Pending field tes to determine whether these buttons are
  // well placed at these coordinates 
  questButtons: function(voteOnQuest) {
    this.addButton(
      'success', 
      0x0000FF, 
      { lenx: 35, leny: 80, lenz: 10 }, 
      { posx: -50, posy: -100, posz: 0 }
    );    
    this.addButton(
      'fail', 
      0xFF0000, 
      { lenx: 35, leny: 80, lenz: 10 }, 
      { posx: 50, posy: -100, posz: 0 }
    );      

    //All stages will have signs but not all stages will have buttons
    //Extend callback to remove buttons after choices have been made
    const voteQuestCallback = (choice) =>{
      voteOnQuest(choice[0] === 'fail' ? false : true);
      //remove buttons
      this.removeObject('success');
      this.removeObject('fail');      
    };

    if (this.usingVR) {
      this.addVRPressEventListener('passQuest', 1, voteQuestCallback, {choices: ['success', 'fail']});
    } else {
      this.addClickEventListener('passQuest', 1, voteQuestCallback, {choices: ['success', 'fail']});
    }

    setTimeout(()=>{
      this.removeObject('passQuest');
      this.removeObject('success');
      this.removeObject('fail');        
      this.renderer.domElement.removeEventListener('click', this.clickEvent);
    }, 30000);
  }
};