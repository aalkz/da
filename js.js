
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