$(function () {
       var socket = io();
       $('#form_chat').submit(function(){
         var dateString = new Date(Date.now());
         dateString = dateString.toString().split(" ");
         dateString = dateString[1] + " " + dateString[2] + "-" + dateString[3] + "-" + dateString[4];
         socket.emit('new message', {'user' : $('#user').val(), 'value' : $('#m').val(), 'time' : dateString});
         $('#m').val('');
         return false;
       });
       socket.on('new message', function(msg){
         console.log(msg);
         var dateString = new Date(Date.now());
         dateString = dateString.toString().split(" ");
         dateString = dateString[1] + " " + dateString[2] + "-" + dateString[3] + "-" + dateString[4];
         $('#messages').append($('<li>').text(msg.username + " says: ("+dateString+")"+msg.message));
         $('#chatWindow').scrollTop($('#chatWindow')[0].scrollHeight);
       });
     });
