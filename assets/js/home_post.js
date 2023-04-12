{
    // method to sumit the form new post using ajax
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/post/createpost',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost)
                    deletePost($(' .delete-post-button',newPost))

                    
                }, error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
               
                <small>
                  <a class="delete-post-button" href="/post/destroy/${post._id}">Delete</a>
                </small>
              
                ${post.content }
                <small>
                 ${ post.user.username}
                </small>
                <div class="comment-box">
                  <form action="/post/comment" id="new-post-form" method="POST">
                    <input type="text" name="content" placeholder="Type Here to add comment...">
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                  </form>
    
                  <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">
                      
                    </ul>
                  </div>
      
                </div>
                </li>`)
                
    }



    // method to delete the post from DOM
    let deletePost =function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url: $(deleteLink).prop('href'),
                success:function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                },error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }
    createPost();
}