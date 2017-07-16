$('#accountEdit').click(function (e) {
    e.preventDefault(); // Stop browser from loading the URL.
    $.ajax({
        url: $(this).attr('href'),
    }).done(function (markup) {
        $('#accountCard').html(markup);
    });
});



function updateAccount(){

      var username = $('#user_username').val();
      var email = $('#user_email').val();
      var website = $('#user_website').val();
      var location = $('#user_location').val();

      var info = {'username':username, 'email':email, 'website':website, 'location':location};

    $.ajax({
        url: '/users/update',
        type: 'POST',
        dataType: 'JSON',
        data:{'username':username, 'email':email, 'website':website, 'location':location},
        success:function(xhr){
            console.log(xhr);
            console.log(this.data);
            if(xhr.error){
              $('#accountError').html(xhr.error);
              alert("Error "+xhr.error);
            }
            else{
              alert("Success");
              $('#accountCard').html(xhr);
              $('#headerusername').html(username);
            }
        },
        error: function(err){
            console.log(err.responseText);
            //alert("REAL ERROR" + err.responseText);
            $('#accountCard').html(err.responseText);
        }
    });

}
