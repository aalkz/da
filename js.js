var Instagram = {};
Instagram.Template = {};

// HTML markup goes here, please!
Instagram.Template.Views = {

  "photo": "<div class='photo'>" +
            "<a href='{url}' target='_blank'><img class='main' src='{photo_url}' width='250' height='250' /></a>" +
            "<img class='avatar_url' width='40' height='40' src='{avatar}' />" +
            "<span class='heart'><strong>{like_count}</strong></span>" +
          "</div>"
};


Instagram.config = {
  clientID: "3b9f646909d84583bda2ac8131aafdcd",
  apiHost: "https://api.instagram.com",
  userCount: "5"
 };

 Instagram.userId = "";
 Instagram.followersNextCursor = "";
 Instagram.followingNextCursor = "";
 Instagram.finishedLoadingFollowers = false;
 Instagram.finishedLoadingFollowing = false;

 Instagram.followersList = [];
 Instagram.followingList = [];
 Instagram.differenceList = [];

 Instagram.Template.generate = function(template, photo){

  // Define variable for regular expression.
  var re;

  // Loop through the passed photo object.
  for(var attribute in photo){

    // Generate a regular expression.
    re = new RegExp("{"+attribute+"}","g");

    // Apply the regular expression instance with 'replace'.
    template = template.replace(re, photo[attribute]);
  }

  return template;
};



(function(){


	function toScreen(photos){

		var html = "";

	  // Using jQuery's generic iterator function:
	  // jQuery.each http://api.jquery.com/jQuery.each/

		$.each(photos.data, function(index, photo){
			//html += toTemplate(photo);
			photo = "<div class='photo'>" +
			    "<a href='"+ photo.link +"' target='_blank'>"+
			      "<img class='main' src='" + photo.images.low_resolution.url + "' width='250' height='250' />" +
			    "</a>" +
			    "<img class='avatar' width='40' height='40' src='"+photo.user.profile_picture+"' />" +
			    "<span class='heart'><strong>"+photo.likes.count+"</strong></span>" +
			  "</div>";
			  html += photo;
		});
		$("div#photos-wrap").prepend(html);

	  // Bind an event handler to the `click` event on the form's button
	  
	}

	function search(tag){
	  $.getJSON(generateUrl(tag), toScreen);
	}

	function toTemplate(photo){
		photo = {
			like_count: photo.likes.count,
			avatar_url: photo.user.profile_picture,
			photo_url: photo.images.low_resolution.url,
			url: photo.link
		};

	  return Instagram.Template.generate('photo', Instagram.Template.Views['photo']);
	}

	function generateUrl(tag){
     var config = Instagram.config;
     return config.apiHost + "/v1/tags/" + tag + "/media/recent?callback=?&amp;client_id=" + config.clientID;
 	}

   function generateUserSearchUrl(userTerm){
   	var config = Instagram.config;
    var url;
    url = config.apiHost + "/v1/users/search?q=" + userTerm + "&amp;count=" + config.userCount + "&amp;callback=?&amp;client_id=" + config.clientID;
    console.log(userTerm);
   	console.log(url);

    return url;
   }

   function generateFollowersUrl(userId, followersNextCursor){
   	var config = Instagram.config;
    var url;
    url = config.apiHost + "/v1/users/" + userId + "/followed-by?callback=?&amp;client_id=" + config.clientID + "&amp;cursor=" + followersNextCursor;
    console.log(userId);
   	console.log(url);

    return url;
   }

   function generateFollowingUrl(userId, followingNextCursor){
    var config = Instagram.config;
    var url;
    url = config.apiHost + "/v1/users/" + userId + "/follows?callback=?&amp;client_id=" + config.clientID + "&amp;cursor=" + followingNextCursor;
    console.log(url);

    return url;
   }

   function getUserId(userTerm){
   		$.getJSON(generateUserSearchUrl(userTerm), showUsers);
   }

   function getFollowers(userId){
   	console.log("en getfollowers:" + userId);
   	$.getJSON(generateFollowersUrl(userId, Instagram.followersNextCursor), showFollowers);
   }

   function getFollowing(userId){
    //console.log("en getfollowers:" + userId);
    $.getJSON(generateFollowingUrl(userId, Instagram.followingNextCursor), showFollowing);
   }

  function showUsers(users, callback){
   	console.log("user 0 id:" + users.data[0].id);
    var html = "";
   	var userId = users.data[0].id;


	  Instagram.userId = userId;
	  console.log("Instagram.userId: " + Instagram.userId);

    /*if (typeof(callback) == 'function') {
        console.log("Instagram.userId en getUserInfo: " + Instagram.userId);
        callback(userId);
     }*/

   }

  function showFollowers(followers){
    console.log("user 0 id:" + followers.data[0].username);
   	var html = "";
   	i = 0;
    //Instagram.followersList.followers.push(followers);
   	$.each(followers.data, function(index, user){
			userHtml = "<li>" +
          "<a href='http://instagram.com/" + user.username + "' target='_blank' alt='" + user.id + "'>" + user.username + "</a>" +
          //"first_name: " + user.first_name + "<br>" +
          //"last_name: " + user.last_name + "<br>" +
          //"profile_picture: " + "<img class='avatar' width='40' height='40' src='"+ user.profile_picture +"' />" +
          //"(" + user.id + ")" +
        "</li>";
        html += userHtml;
			  i++;

        Instagram.followersList.push(user);
		});
    html +=  "";
   	console.log(i);
   	Instagram.followersNextCursor = followers.pagination.next_cursor;
   	if(Instagram.followersNextCursor == undefined) {
   		Instagram.followersNextCursor = "";
   		Instagram.finishedLoadingFollowers = true;
   		$("#load-more-followers").hide();
   	}
    console.log(Instagram.followersList);
    console.log(Instagram.finishedLoadingFollowers);

	 $("#follower-list").append(html);

   if(!Instagram.finishedLoadingFollowers) {
      console.log("recursive ers");
      Instagram.getFollowers(Instagram.userId);
    }
  }

  function showFollowing(following){
    var html = "";
    i = 0;

    $.each(following.data, function(index, user){
      userHtml = "<li>" +
          "<a href='http://instagram.com/" + user.username + "' target='_blank' alt='" + user.id + "'>" + user.username + "</a>" +
        "</li>";
        html += userHtml;
        i++;

        Instagram.followingList.push(user);

    });
    html +=  "";
    console.log(i);
    Instagram.followingNextCursor = following.pagination.next_cursor;
    if(Instagram.followingNextCursor == undefined) {
      Instagram.followingNextCursor = "";
      Instagram.finishedLoadingFollowing = true;
      $("#load-more-following").hide();
    }
    console.log(Instagram.followingList);
    console.log(Instagram.finishedLoadingFollowing);

   $("#following-list").append(html);

   if(!Instagram.finishedLoadingFollowing) {
      console.log("recursive ing");
      Instagram.getFollowing(Instagram.userId);
    }
  }

  function getDifference (followers, following) {
    var in_followers = false;
    $.each(following, function(index, followed) {
      in_followers = false;
      $.each(followers, function(index, follower) {
        if(follower.id == followed.id) {
          in_followers = true;
        }
      });
      if(!in_followers) {
        Instagram.differenceList.push(followed);
      }
    });

    console.log(Instagram.differenceList);

    var html = "";

    $.each(Instagram.differenceList, function(index, user){
      userHtml = "<li>" +
          "<a href='http://instagram.com/" + user.username + "' target='_blank' alt='" + user.id + "'>" + user.username + "</a>" +
        "</li>";
        html += userHtml;
    });
    html +=  "";
   $("#difference-list").append(html);
  }

   
  function getUserInfo(userTerm) {
    $.getJSON(generateUserSearchUrl(userTerm), function(users){
      var userId = users.data[0].id;
      Instagram.userId = userId;
      console.log("userId: " + userId);
      getFollowers(userId);
      getFollowing(userId);
    });
  }

  function cleanUp(){
    Instagram.userId = "";
    Instagram.followersNextCursor = "";
    Instagram.followingNextCursor = "";
    Instagram.finishedLoadingFollowers = false;
    Instagram.finishedLoadingFollowing = false;
    $("#follower-list").empty();
    $("#following-list").empty();
    $("#difference-list").empty();
    Instagram.followersList = [];
    Instagram.followingList = [];
    Instagram.differenceList = [];
  }

	Instagram.search = search;
	Instagram.getUserId = getUserId;
  Instagram.getFollowers = getFollowers;
  Instagram.getFollowing = getFollowing;
  Instagram.getDifference  = getDifference;
  Instagram.getUserInfo  = getUserInfo;
	Instagram.cleanUp  = cleanUp;

  

}());

/*

{
  "version": "1.0",
  "type": "photo",
  "title": "Cope",
  "url": "http://fc04.deviantart.net/fs50/f/2009/336/4/7/Cope_by_pachunka.jpg",
  "author_name": "pachunka",
  "author_url": "http://pachunka.deviantart.com",
  "provider_name": "deviantART",
  "provider_url": "http://www.deviantart.com",
  "thumbnail_url": "http://th03.deviantart.net/fs50/300W/f/2009/336/4/7/Cope_by_pachunka.jpg",
  "thumbnail_width": 300,
  "thumbnail_height": 450,
  "width": 448,
  "height": 672
}

*/

/*
var client = new ZeroClipboard( document.getElementById("copy-button"), {
  moviePath: "/path/to/ZeroClipboard.swf"
} );

client.on( "load", function(client) {
  // alert( "movie is loaded" );

  client.on( "complete", function(client, args) {
    // `this` is the element that was clicked
    this.style.display = "none";
    alert("Copied text to clipboard: " + args.text );
  } );
} );*/

$(function(){

   $('#search-button').click(function(event){
   		event.preventDefault();
	    // Extract the value of the search input text field.
		  var term = $('.search-tag').val();

      console.log(term);
      console.log(encodeURIComponent(term));

      var oembed_url = 'http://backend.deviantart.com/oembed?url=' + encodeURIComponent(term) + '&format=jsonp&callback=?';
      $.getJSON(oembed_url, function(data) {

        title_with_author = data.title + " by " + data.author_name;

        original_url = $(".search-tag").text();

        title_with_author_html = data.title + " by " + "<a href='"+ term +"' target='_blank'>" + data.author_name + "</a>";

        $('.da-img-url-link').text(data.url);
        $('.copy-img-url-container').text(data.url);
        $('.da-title-link').text(title_with_author);
        $('.copy-title-container').text(title_with_author);
        $('.copy-title-html-container').text(title_with_author_html);

      });

	    return false;

	  });


  $('.load-art').click(function (event) {
      event.preventDefault();



      return false;
  });



  // clipboard
  var clipboard = new Clipboard('.da-copy');

  clipboard.on('success', function(e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });



});

/*

 "username": "jack",
        "first_name": "Jack",
        "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_66_75sq.jpg",
        "id": "66",
        "last_name": "Dorsey"
 */