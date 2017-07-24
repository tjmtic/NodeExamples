$('#sendFirebase').click(function (e) {
    e.preventDefault(); // Stop browser from loading the URL.
    $.ajax({
        url: $(this).attr('href'),
    }).done(function (markup) {
        $('#status').html(markup);
    });
});



function sendFirebase(){

      var title = $('#title_firebase').val();
      var content = $('#content_firebase').val();
      var device = $('#device_id_firebase').val();

      //var info = {'username':username, 'email':email, 'website':website, 'location':location};

    $.ajax({
        url: '/firebase/send',
        type: 'POST',
        dataType: 'JSON',
        data:{'title':title, 'content':content, 'device_id':device_id},
        success:function(xhr){
            console.log(xhr);
            console.log(this.data);
            if(xhr.error){
            //  $('#accountError').html(xhr.error);
              alert("Error "+xhr.error);
            }
            else{
              alert("Success");
            //  $('#accountCard').html(xhr);
            //  $('#headerusername').html(username);
            }
        },
        error: function(err){
            console.log(err.responseText);
            alert("REAL ERROR" + err.responseText);
          //  $('#accountCard').html(err.responseText);
        }
    });

}
