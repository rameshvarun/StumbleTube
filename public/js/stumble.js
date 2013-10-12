$(window).ready(function() {
  $(".vidwrapper").height($(window).height()/2);

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
});

    function first() {
      $(".vidwrapper").queue(function() {
      $(".vidwrapper").css("opacity", 0).dequeue();
      })
      $(this).parent().css("opacity", 1)
      $(".vidwrapper").css("width", 0);
      $(".vidwrapper").css("height", 0);
      $(this).parent().css("height", $(window).height());
      $(this).parent().css("width", $(window).width());  
      $(this).one("click", second);
    }
    function second() {
      $(".vidwrapper").css("opacity", 1);
      $(".vidwrapper").css("height", $(window).height()/2);
      $(".vidwrapper").css("width", $(window).width()/2);
      $(this).one("click", first);
    }
    $(".full1").one("click", first);
    $(".full2").one("click", first);
    $(".full3").one("click", first);
    $(".full4").one("click", first);

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