var exampleusers = ["xxN1", "retrostreamerstatus", "sfFirestorm33", "RetroGamingLiveTV", "SpeedGaming", "Rabble16", "2woGood", "Pumpkinberry", "KHANanaphone", "JamEviler"];

// shuffles the array
exampleusers.sort(function() {
  return 0.5 - Math.random()
});

var tooltipstring = "Hint: some user names you can try are \u000A" + exampleusers[0] + ", " + exampleusers[1] + " and " + exampleusers[2] + ".";

$("input[id=username]").attr("title", tooltipstring);

$(".send-username-button").click(function() {

  if ($("input[id=username]").val().trim().length > 0) {
    // user has submitted a name
    $(".warning-icon").removeClass("fa-exclamation-triangle warning-icon").addClass("fa-twitch fa-lg twitch-icon-small ");
    $("input[id=username]").css("border-color", "black");
    $("input[id=username]").css("box-shadow", "none");

    document.forms[0].submit();

  } else {

    $(".twitch-icon-small").removeClass("fa-twitch fa-lg twitch-icon-small ").addClass("fa-exclamation-triangle warning-icon");

    $("input[id=username]").focus();
    $("input[id=username]").css("border-color", "#ff8484");
    $("input[id=username]").css("box-shadow", "0px 0px 12.5px 0.5px #ff8484");
  }
});

$(document).ready(function() {
  
  $(".twitch-icon").addClass("fa fa-twitch fa-2x");
  $(".bubble-icon").addClass("fa fa-comment-o fa-2x");
  $(".info-icon").addClass("fa fa-question");
    $(".twitch-icon-small").addClass("fa fa-twitch fa-lg");
  
  $("input[id=username]").focus();
});
