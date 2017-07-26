$(function () {
       var socket = io();
       $('#form_chat').submit(function(){
         var dateString = new Date(Date.now());
         dateString = dateString.toString().split(" ");
         dateString = dateString[1] + " " + dateString[2] + "-" + dateString[3] + "-" + dateString[4];
         socket.emit('chat message', {'user' : $('#user').val(), 'value' : $('#m').val(), 'time' : dateString});
         $('#m').val('');
         return false;
       });
       socket.on('chat message', function(msg){
         console.log(msg);
         $('#messages').append($('<li>').text(msg.user + " says: ("+msg.time+")"+msg.value));
         $('#chatWindow').scrollTop($('#chatWindow')[0].scrollHeight);
       });
     });
