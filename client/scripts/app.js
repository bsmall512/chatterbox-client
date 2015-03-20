// YOUR CODE HERE:

var app;
$(function(){
  app = {
    server: 'https://api.parse.com/1/classes/chatterbox',
    username: 'anonymous',
    roomname: 'lobby',
    lastMessageId: 0,
    friends: {},

    init: function(){
      app.username = window.location.search.substr(10);

      // jQuery selectors
      app.$main = $('#main');
      app.$message = $('#message');
      app.$chats = $('#chats');
      app.$roomSelect = $('#roomSelect');
      app.$send = $('#send');

      // listeners
      app.$main.on('click', '.username', app.addFriend);
      app.$send.on('submit', app.handleSubmit);
      app.$roomSelect.on('change', app.saveRoom);

      // fetch previous messages
      app.startSpinner();
      app.fetch(false);

      // look for new messages every 3 seconds
      setInterval(app.fetch, 3000);
    },

    send: function(message){
      app.startSpinner();
      app.$message.val('');

      $.ajax({
        url: app.server,
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          app.fetch();
        },
        error: function (data) {
          console.error('chatterbox: Failed to send message');
        }
      });
    },

    fetch: function(animate){
     $.ajax({
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        data: { order: '-createdAt'},
        success: function (data) {  
          console.log('chatterbox: Messages fetched');
          
          if(!data.results || !data.results.length) { return; }

          // get the last message
          var mostRecentMessage = data.results[data.results.length-1];
          var displayedRoom = $('.chat span').first().data('roomname');
          app.stopSpinner();

          if (mostRecentMessage.objectId !== app.lastMessageId || app.roomname !== displayedRoom) {
            app.populateRooms(data.results);
            app.populateMessages(data.results, animate);
            app.lastMessageId = mostRecentMessage.objectId;
          }
        },
        error: function(data) {
          console.error('chatterbox: Failed to receive message');
        }
      });
    },

    clearMessages: function(){
      app.$chats.html('');
    },

    populateMessages: function(results, animate){
      app.clearMessages();
      app.stopSpinner();
      if (Array.isArray(results)){
        results.forEach(app.addMessage);
      }

      var scrollTop = app.$chats.prop('scrollHeight');
      if (animate) {
        app.$chats.animate({
          scrollTop: scrollTop
        });
      }
      else {
        app.$chats.scrollTop(scrollTop);
      }
    },

    populateRooms: function(results){
      app.$roomSelect.html('<option value="__newRoom">New room...</option><option value="" selected>Lobby</option</select>');

      if (results) {
        var rooms = {};
        results.forEach(function(data) {
          var roomname = data.roomname;
          if (roomname && !rooms[roomname]) {
            app.addRoom(roomname);
            rooms[roomname] = true;
          }
        });
      }

      app.$roomSelect.val(app.roomname);
    },

    addRoom: function(roomname) {
      var $option = $('<option/>').val(roomname).text(roomname);
      app.$roomSelect.append($option);
    },

    addMessage: function(data){
      if (!data.roomname){
        data.roomname = 'lobby';
      }

      if (data.roomname === app.roomname) {
        var $chat = $('div class="chat"/>');
        var $username = $('<span class="username"/>');
        $username.text(data.username+': ').attr('data-username', data.username).attr('data-roomname', data.roomname).appendTo($chat);

        if (app.friends[data.username] === true){
          $username.addClass('friend');
        }

        var $message = $('<br><span/>');
        $message.text(data.text).appendTo($chat);

        app.$chats.append($chat);
      }
    },
    addFriend: function(e){
      var username = $(e.currentTarget).attr('data-username');

      if (username !== undefined){
        console.log('chatterbox: Adding %s as a friend', username);

        app.friends[username] = true;

        var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
        var $usernames = $(selector).addClass('friend');
      }
    },


    saveRoom: function(e){

      var selectIndex = app.$roomSelect.prop('selectedIndex');
      
      if (selectIndex === 0){
        var roomname = prompt('Enter room name');
        if (roomname){
          app.roomname = roomname;
          app.addRoom(roomname);
          app.$roomSelect.val(roomname);
          app.fetch();
        }
      }
      else{
        app.startSpinner();
        app.roomname = app.$roomSelect.val();
        app.fetch();
      }
    
    },
    
    handleSubmit: function(e){
      
 
      var message = {
        username: app.username,
        text: app.$message.val(),
        roomname: app.roomname || 'lobby'
      };
      app.send(message);
      e.preventDefault();
    },
  
    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    startSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }
  };  
}());


