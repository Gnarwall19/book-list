$(function () {

  //console.log($('#listed-book').attr('data'));

  $('.delete-book').on('click', function (event) {
    var id = $(this).data('id');

    // Send DELETE request
    $.ajax('/books/' + id, {
      type: 'DELETE'
    }).then(
      function () {
        console.log('deleted id ', id);
        // Reload the page for updated list
        location.reload();
      }
    );
  });



  // NOT WORKING
  // Set finished books to completed
  $('.finished-book').on('click', function (event) {
    var id = $(this).data('id');

    // Send PUT request
    $.ajax('/books/' + id, {
      type: 'PATCH',
      data: bookData
    }).then(
      function () {
        console.log('updated id ', id, this.completed); //completed = undefined
        // Reload the page for updated list
        location.reload();
      }
    );
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