$(function() {
  var handlers = {
    showContact: function(contacts){
      var table = $('#contacts').find('tbody').empty();
      var fields = ["name", "phone", "email"];
      $('#contactForm').hide();
      $('#search').hide();

      contacts.forEach(function(contact){
        var tr = $('<tr>').appendTo(table);
        fields.forEach(function(field){
          $('<td>').text(contact[field]).appendTo(tr);
        });
        $('<td>').html("&times;").css({color: 'red', cursor: 'pointer'}).addClass('delete').data('contactId', contact.id).appendTo(tr);
      });
      $('#results').show();
    },
    showSearch: function(){
      $('#contactForm').hide();
      $('#search').show();
    },
    loadContacts: function(){
      $.getJSON('/contacts', handlers.showContact);
      // $.ajax({
      //   method: 'GET',
      //   dataType: 'json',
      //   url: '/contacts',
      //   success: handlers.showContact
      // });
    },
    addContacts: function(){
      $('#results').hide();
      $('#search').hide();
      $('#contactForm').show();
    },
    newContact: function(event){
      event.preventDefault();
      var name = $('#name').val();
      var phone = $('#phone').val();
      var email = $('#email').val();

      if (name == '' || phone == '' || email == ''){
        alert("Please fill in all fields");
        return false;
      } else {
        $.post('/contacts', {name: name, phone: phone, email: email}, handlers.postContact, 'json');
      }
    },
    postContact: function(results){
      if (results.result){
        alert("Contact successfully added");
        $('#newContact')[0].reset();
      } else {
        alert("Contact is not added");
      }
    },
    searchContact: function(event){
      if (event.keyCode == 13 ){
        var search = $('#search').val();

        if (search == ''){
          return false;
        }
        $.getJSON('/search/'+search, function(contacts){
          if (contacts.length) {
            handlers.showContact(contacts);
          } else {
            alert("No contact with name " + search);
          }
        });
      }
    },
    deleteContact: function(){
      var row = $(this).parents('tr');
      var id = $(this).data('contactId');
      $.getJSON('/contacts/'+id+'/delete', function(result){
        if (result.result) {
          alert("Contact deleted");
          row.remove();
        } else {
          alert("Not deleted");
        }
      });
    }
  };

  $('#loadContacts').on('click', handlers.loadContacts);

  $('#addContact').on('click', handlers.addContacts);

  $('#newContact').on('submit', handlers.newContact);

  $('#loadSearch').on('click', handlers.showSearch);

  $('#search').on('keyup', handlers.searchContact);

  $('#contacts').on('click', '.delete', handlers.deleteContact);
 
});
