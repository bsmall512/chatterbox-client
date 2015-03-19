// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){
  
  },

  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
   $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {  
        //pass the object of objects to refresh function
        
        app.refresh(data);
      },
      error: function () {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },

  clearMessages: function(){
    $('#chats').html('');
  },

  addMessage: function(message, userName){
    $('#chats').append('<div class="chat"><p>' + userName + '</p><p>' + message + '</p></div>');
  },


  refresh: function(myData){
    var data = myData;
    var length = data.results.length;
     
    for (var i = 0; i < length; i++){
      app.addMessage(data.results[i].text, data.results[i].username);
    }

  }
};

$( document ).ready(function() {
  $('#refresh').on('click', app.fetch)
  $('#submit').on('click', function(){
    //debugger;
    var msg = $("input[name='msg']").val();
    var userName = $("input[name='userName']").val();
    app.addMessage(msg, userName);  
  })
});



