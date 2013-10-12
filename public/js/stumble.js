$(window).ready(function() {


    $(".full1").hover(
    function() {
      player1.setVolume(100);
    }, function() {
      player1.setVolume(0);
    });
  $(".full2").hover(
    function() {
      player2.setVolume(100);
    }, function() {
      player2.setVolume(0);
    });
    $(".full3").hover(
    function() {
      player3.setVolume(100);
    }, function() {
      player3.setVolume(0);
    });
      $(".full4").hover(
    function() {
      player4.setVolume(100);
    }, function() {
      player4.setVolume(0);
    });

	$("#refresh").click(function() {
		socket.emit("getvideos", {});
	});

  function qrshow() {
    $("#qr").removeClass("hidden");
    $(this).one("click", qrhide);
  };

  function qrhide() {
    $("#qr").addClass("hidden");
    $(this).one("click", qrshow);
  }
    $(".remote").one("click", qrshow);
	
      $(".norm").click(function() {
        $("iframe").css("-webkit-filter", "");
      });
      $(".sepia").click(function() {
        $("iframe").css("-webkit-filter", "sepia(100%)");
      });
      $(".grayscale").click(function() {
        $("iframe").css("-webkit-filter", "grayscale(100%)");
      });

});
    var vidId;
    var vidCode;
    function first() {
      $(".like").removeClass("activated");
      $(".like").addClass("unactive");
      $(".dislike").removeClass("activated");
      $(".dislike").addClass("unactive");
      $(".vidwrapper").addClass("unfeatured");
      $(this).parent().removeClass("unfeatured");
      $("#refresh").addClass("refresh-full"); 
      $("#refresh").removeClass("grad"); 
      $("#menu").addClass("hidden");
      $("#bot-menu").removeClass("hidden");
      $(this).parent().addClass("featured"); 
      if($(this).hasClass("full1")) {
        $(".full1").css("opacity", 0.01)
        vidId = player1.getVideoUrl();
        vidCode = vidId.replace("https://www.youtube.com/watch?feature=player_embedded&v=", "");
      };
      if($(this).hasClass("full2")) {
        $(".full2").css("opacity", 0.01)
        vidId = player2.getVideoUrl();
        vidCode = vidId.replace("https://www.youtube.com/watch?feature=player_embedded&v=", "");
      };
      if($(this).hasClass("full3")) {
        $(".full3").css("opacity", 0.01)
        vidId = player3.getVideoUrl();
        vidCode = vidId.replace("https://www.youtube.com/watch?feature=player_embedded&v=", "");
      };
      if($(this).hasClass("full4")) {
        $(".full4").css("opacity", 0.01)
        vidId = player4.getVideoUrl();
        vidCode = vidId.replace("https://www.youtube.com/watch?feature=player_embedded&v=", "");
      };

      $(this).one("click", second);
    }
    function second() {
      $(".vidwrapper").removeClass("unfeatured");
      $(".vidwrapper").removeClass("featured");
      $("#refresh").addClass("grad"); 
      $("#refresh").removeClass("refresh-full"); 
      $("#menu").removeClass("hidden");
      $("#bot-menu").addClass("hidden");
      $(this).one("click", first);
    }
    $(".full1").one("click", first);
    $(".full2").one("click", first);
    $(".full3").one("click", first);
    $(".full4").one("click", first);


    $(".like").click(function() {
      $(".like").addClass("activated");
      $(".like").removeClass("unactive");
      socket.emit("likevideo", { videoid : vidCode });
    });
    $(".dislike").click(function() {
      $(".dislike").addClass("activated");
      $(".dislike").removeClass("unactive");
      socket.emit("dislikevideo", { videoid : vidCode });
    });



var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player1;
      var player2;
      var player3;
      var player4;
     

      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
        player1.setVolume(0);
        player2.setVolume(0);
        player3.setVolume(0);
        player4.setVolume(0);
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          // setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player1.stopVideo();
      }