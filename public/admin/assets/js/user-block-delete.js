
$(document).ready(function () {
        

    // Handle block/unblock button click
    $(document).on('click', '.block-btn, .unblock-btn', function (e) {
        e.preventDefault();
        var userId = $(this).data('id');
        var isBlocked = $(this).hasClass('block-btn');
        console.log(userId);

        $.ajax({
            url: '/api/admin/users/' +
                 userId +
                 (isBlocked ? '/block' : '/unblock'),
            type: 'PUT',
            success: function (response) {
                if (response.success) {
                    if (isBlocked) {
                        $(e.target).removeClass('block-btn').addClass('unblock-btn').text('Unblock');
                    } else {
                        $(e.target).removeClass('unblock-btn').addClass('block-btn').text('Block');
                    }
                  $("#usersTable").load(location.href + " #usersTable");

                }
            },
            error: function (error) {
                console.error(error);
            }
        });
    });
        
        
    // Handle delete button click
    $(document).on('click', '.delete-button', function (e) {
        e.preventDefault();
        var userId = $(this).data('id');
            $.ajax({
                url: '/api/admin/users/' +
                      userId +
                     '/delete',
                type: 'DELETE',
                success: function (response) {
                    if (response.success) {
                        // Remove the deleted user element from the UI
                        $(e.target).closest('.user-item').remove();
                        $("#usersTable").load(location.href + " #usersTable");
        
                    }
                },
                error: function (error) {
                    console.error(error);
                }
            });
        
    });

});
