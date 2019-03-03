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
      type: 'put',
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
});