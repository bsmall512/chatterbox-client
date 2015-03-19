// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){
    setInterval(app.fetch, 3000);
    $('#submit').on('click', app.submit);
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
      data: 'order=-createdAt',
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
  
  },
  //   AUTO GENERATED
  //   createdAt
  //   objectID
  //   roomname

  //   look at bookstrap for the format you are supposed to submit
  //   messages in! Brian! 
  submit: function(e){
    e.preventDefault();
    // build the message 
    var message = {};
    message.text = $("input[name='msg']").val();
    //message.username = newSearch.username;
    // lookup: how do I get parameters out of a search url query
    app.send(message);
    app.addMessage(message.text, message.username)
  }
};

$( document ).ready(function() {
  app.init();
});



