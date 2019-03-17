


class Room{
  constructor (maxPlayer){
    this.maxPlayer = maxPlayer;
    this.players = [];
    this.id = new Date().getTime();
  }
}


module.exports = class GameRoom{
    constructor () {
      this.rooms = [];
    }

    createRoom(){
      var newRoom = new Room(4);
      this.rooms.push(newRoom);
      return newRoom;
    }

    roomList(){
      return this.rooms;
    }

    getRoomById(id){
      for(var i=0;i<this.rooms.length;i++){
        if(this.rooms[i].id == id){
          return this.rooms[i];
        }
      }
      return null;
    }

    addPlayer(playerId, roomId){
      
    }
}
