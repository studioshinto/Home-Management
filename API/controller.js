var mongoose = require('mongoose'),
	Room = mongoose.model('Room');
    

exports.findNewRoom = function(req, res) {
	console.log("Starting Matchmaking: "+req.query.playerID);
	Room.findOne({player2ID: null, winner: 0}, function(err, returnedRoom) {
		if (err) throw err;
		//if no room is found, start a new room and wait for oppenent
		if (!returnedRoom) {
            var newRoom = new Room({
                player1ID: req.query.playerID,
                player1Name: req.query.playerName, 
                player2ID: null, 
                player2Name: null, 
                lastUpdate: new Date(),
                state: {
                    gameBoard: [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]],
                    wins: [0,0,0,0,0,0,0,0,0],
                    turn: 1
                },
                winner: 0,
                level: 0,
                disconnect: false
            });
            newRoom.save(function(err, room) {
                if (err) throw err;
                return res.json({owner: true, roomID: room._id});
            });
		} else {
            //else join the room
            if(returnedRoom.player1ID == req.query.playerID){
                return res.json({owner: true, roomID: returnedRoom._id, opponent: null});
            }else{
                returnedRoom.player2ID = req.query.playerID;
                returnedRoom.player2Name = req.query.playerName;
                returnedRoom.save(function(err, room) {
                    if (err) throw err;
                    return res.json({owner: false, roomID: returnedRoom._id, opponent: returnedRoom.player1Name});
                });
            }
		}
	});
};

exports.rejoin = function(req, res) {
	console.log("Attempting to rejoin: "+req.query.roomID);
	Room.findOne({_id: req.query.roomID, winner: null, lastUpdate: { $gte : new Date( Date.now() - 60000 ) }}, function(err, returnedRoom) {
        if (err) throw err;
		//if no room is found return the error
		if (!returnedRoom) {
            return res.json("Game can not be rejoined");
		} else {
            //else check room info
            if(returnedRoom.Player1 == req.query.playerID || returnedRoom.Player2 == req.query.playerID){
                return res.json("Success");
            }else{
                return res.json("Game can not be rejoined");
            }
		}
	});
};