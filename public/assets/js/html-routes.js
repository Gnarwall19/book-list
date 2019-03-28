$(function () {

  $('.delete-book').on('click', function (event) {
    var id = $(this).data('id');

    // Send DELETE request
    $.ajax('/books/' + id, {
      type: 'DELETE'
    }).then(
      function () {
        console.log('deleted id', id);
        // Reload the page for updated list
        location.reload();
      }
    );
  });





  //WORKING
  // Set finished books to completed
  $('.finished-book').on('click', function (event) {

    var id = $(this).data('id');
    var date = new Date().toLocaleDateString('en-US');

    $.ajax({
      type: 'PUT',
      url: '/books/' + id,
      data: {
        completed: true,
        completedAt: date
      }
    }).done(function (response) {
      console.log(response);
      location.reload();
    }).fail(function (response) {
      console.log("Oops not working");
    });
  });

  $('#add-book').on('submit', function (event) {
    // preventDefault for submit events
    event.preventDefault();


    var book = {
      title: $('#book').val().trim()
      // author
    };

    // Send POST request
    $.ajax('/books', {
      type: 'POST',
      dataType: 'json',
      data: book
    }).then(
      function () {
        console.log('new book added to list');
        // Reload page for updated list
        location.reload();
      }
    );
  });

  // Add new user
  $('#signup-submit').on('submit', function (event) {
    event.preventDefault();
    var user = {
      email: $('#signup-email').val().trim(),
      password: $('#signup-password').val().trim()
    }
    console.log(user);

    $.ajax('/users', {
      type: 'POST',
      dataType: 'json',
      data: user
    }).done(function (response) {
      console.log(response);
      location.reload();
    }).fail(function (response) {
      console.log("Oops not working");
    });

  });

  $('#login-submit').on('submit', function (event) {
    event.preventDefault();
    var user = {
      email: $('#email-input').val().trim(),
      password: $('#password-input').val().trim()
    }


    console.log(user);

    $.ajax('/users/login', {
      type: 'POST',
      dataType: 'json',
      data: user
    }).done(function (response) {
      console.log(response);
      location.reload();

    }).fail(function (response) {
      console.log("Oops not working");
    });
  });

  // Logout User
  $('#logout').on('click', function (event) {
    event.preventDefault();


    $.ajax('/users/me/token', {
      type: 'DELETE'

    }).then(function () {
      console.log('user logged out.');

      location.reload();
    });
  });

  // NEED A LOGOUT BUTTON

});