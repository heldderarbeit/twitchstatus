/* waiting cursor logic */

function setWaitCursor() {
  $("body").addClass("wait-cursor");
  disableInteraction();
};

function removeWaitCursor() {
  $("body").removeClass("wait-cursor");
  enableInteraction();
};

/* content line logic */
function removeContentLine() {
  // no content no show, remove that border line
  if ($(".content").css("border-top-width") === "1px") {
    $(".content").css("border-top-width", "0px");
  }
};

function addContentLine() {
  if ($(".content").css("border-top-width") === "0px") {
    // no border line at the top of the content, add it now
    $(".content").css("border-top-width", "1px");
  }
};

/* css style for buttons and button logic */

// set cursor to pointer as default for buttons
$(".app-buttonpane > button").addClass("pointer-cursor");

// changes background color and pointer of selected button
$(".app-buttonpane > button").click(function() {

  setWaitCursor();
  // empties log
  removeLoadingInfo();

  $(".app-buttonpane > button").removeClass("button-selected");
  $(this).addClass("button-selected");

  // empties input from last search
  $("input[name=search-field]").val("");
});

// changes style when focusing with tab
$(".app-buttonpane > button").keydown(function(e) {
  if (e.keyCode == 9) {
    $(".app-buttonpane > button").removeClass("button-selected");
    if (($(this).attr("id")) === "off-btn") {
      // one of the buttons has always the style of a selected button 
      $("#all-btn").addClass("button-selected");
    }
  }
});

$("#on-btn").click(function() {
  showChannels(function() {
    return getOnlineChannels();
  });
});

$("#off-btn").click(function() {
  showChannels(function() {
    return getOfflineChannels();
  });
});

$("#all-btn").click(function() {
  setStartLoadingInfo();
  getAllChannels(limitchannels, function() {
    return showChannels(function() {
      return channels;
    });
  });
});

/* search input style and logic */

// changes color of loupe in the search field when focus
$("input[type=text]").focusin(function() {
  $(".icon-search").css("color", "#1d2c45");
});

$("input[type=text]").focusout(function() {
  $(".icon-search").css("color", "#878787");
});

/* allows searching for usernames just by starting to type by setting focus*/
window.onkeydown = function(event) {
  // do not focus if someone is navigating with tab, space, enter
  if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 32 && !$("input[name=search-field]").hasClass("no-interaction")) {
    $("input[name=search-field]").focus();
    removeLoadingInfo();
  }
};

window.onkeyup = function(event) {
  if (event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 32 && !$("input[name=search-field]").hasClass("no-interaction")) {
    
    var searchvalue = $("input[name=search-field]").val().toLowerCase();

    // execute search on all channels
    $(".app-buttonpane > button").removeClass("button-selected");
    $("#all-btn").addClass("button-selected");

    if (searchvalue.length > 0) {
      var filteredStreamers = channels.filter(searchString(searchvalue));
    } else {
      var filteredStreamers = channels;
    }

    showChannels(function() {
      return filteredStreamers;
    });
  }
};

/* logging */

function removeLoadingInfo() {
  $(".check-mark").removeClass("fa-check-circle-o");
  $(".loading-info").text("");
  $(".loading-info").removeClass("move-left");
};

function noUserSpecified() {
  $(".loading-info").text("no username specified").addClass("warning-info");
};

function setStartLoadingInfo() {
  $(".loading-info").text("Loading followed users ...");
};

function setLoadingInfoComplete() {
  if (getNumberDivs() > 0) {
    $(".loading-info").text(getNumberDivs() + " channels loaded.").addClass("move-left");
    $(".check-mark").addClass(" fa-check-circle-o");
  }
};

function setOnlineInfo() {
  var nDivs = getNumberDivs();
  if (nDivs === 1) {
    $(".loading-info").text(nDivs + " channel is online.");
  } else if (nDivs > 1 || nDivs === 0) {
    $(".loading-info").text(nDivs + " channels are online.");
  }
};

function setOfflineInfo() {
  var nDivs = getNumberDivs();
  if (nDivs === 1) {
    $(".loading-info").text(nDivs + " channel is offline.");
  } else if (nDivs > 1 || nDivs === 0 ) {
    $(".loading-info").text(nDivs + " channels are offline.");
  }
};

function setSearchInfo() {
  var nDivs = getNumberDivs();
  if (nDivs === 1) {
    $(".loading-info").text(nDivs + " channel found.");
  } else if (nDivs > 1 || nDivs === 0) {
    $(".loading-info").text(nDivs + " channels found.");
  }
};

function showUserNotFoundInfo() {
  $(".loading-info").text("user " + useraccount + " does not exist").addClass("warning-info");
};

function showNoFollowingChannelsInfo() {
  $(".loading-info").text("user " + useraccount + " is not following any channels").addClass("warning-info");
};

/* helper functions */

// reads the current page url, perform some regular expression on the URL, then saves the url parameters in an associative array, which we can easily access (credit: http://papermashup.com/read-url-get-variables-withjavascript/)

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
};

// counts the number of displayed channels
function getNumberDivs() {
  return $(".streamer-entry").length;
};

// checks whether a text was truncated and ellipses were used 
function isEllipsisActive($jQueryObject) {
  return ($jQueryObject.width() < $jQueryObject[0].scrollWidth);
};

// returns a streamer object with the given display name
function getUserByTwitchId(uid) {
  return function(user) {
    return user.name == uid;
  }
};

function clearContentDiv() {
  // clears all visible channel info
  $(".content").html("");
  removeContentLine();
};

function isOnline(user) {
  return user.streams === true;
};

function isOffline(user) {
  return user.streams != true;
};

function filterStreamers(functionarg) {
  return channels.filter(functionarg);
};

// matches a string against a users name and status
function searchString(string) {
  return function(user) {
    return user.name.toLowerCase().indexOf(string) > -1 || user.status.toLowerCase().indexOf(string) > -1;
  }
};

function getOnlineChannels() {
  return filterStreamers(isOnline);
};

function getOfflineChannels() {
  return filterStreamers(isOffline);
};

function disableInteraction() {
  $("input[name=search-field]").addClass("no-interaction");
  $(".app-buttonpane > button").addClass("no-interaction");
};

function enableInteraction() {
  $("input[name=search-field]").removeClass("no-interaction");
  $(".app-buttonpane > button").removeClass("no-interaction");
};

function addOnlineStatusInfo(channels) {
  for (var user of channels) {
    $("#entryid" + user.userappid + " .status-icon").addClass("online-icon fa-thumbs-o-up");
    $("#entryid" + user.userappid).append("<span class='channel-viewers'><i class='fa fa-eye'></i>" + " " + user.viewers + "</span>");
    $("#entryid" + user.userappid + " .status-icon").attr("title", "playing '" + user.game + "'").addClass("information-cursor");
  }
};

function addOfflineStatusInfo() {
  $(".status-icon").not(".online-icon").addClass("offline-icon fa-thumbs-o-down");
};

function setNextUpdate(millis) {
  update = window.setTimeout(function() {
    console.log("updating info ...");
    setWaitCursor();

    if ($("#all-btn").hasClass("button-selected")) {
      getAllChannels(limitchannels, function() {
        return showChannels(function() {
          return channels;
        });
      });
    } else if ($("#on-btn").hasClass("button-selected")) {
      getAllChannels(limitchannels, function() {
        return showChannels(function() {
          return getOnlineChannels();
        });
      });
    } else if ($("#off-btn").hasClass("button-selected")) {
      getAllChannels(limitchannels, function() {
        return showChannels(function() {
          return getOfflineChannels();
        });
      });
    }
    setNextUpdate(millis);
  }, millis);
};

function deactivateUpdates() {
  window.clearTimeout(update);
};

/* app variables */

var useraccount;
var followingurl;

// generates ids for every fetched channel
var userentryid = 1;

// holds all fetched channels
var channels = [];

// total number of channels a user is following
var channelsToFetch;

var twitchbaseurl = "https://api.twitch.tv/kraken";
var jsonpString = "callback=?";
var defaultprofileimageurl = "http://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_600x600.png";
var streamurl = "https://api.twitch.tv/kraken/streams?channel=";

// limit of channels to get
var limitchannels = 150;

// holds the updating function
var update;

// automatic updates every 4 minutes
var updatemillis = 240000;

// streamer object
function streamer(name, status, iconurl, profileurl, userappid) {
  this.name = name;
  this.status = status;
  this.iconurl = iconurl;
  this.profileurl = profileurl;
  this.userappid = userappid;
  this.streams = undefined;
  this.viewers = undefined;
  this.game = undefined;
};

/* bootstrap */

$(document).ready(function() {
  useraccount = getUrlVars()["twitchuser"];

  // parameter given
  if (useraccount) {

    // twitch accounts are no longer than 25 characters
    useraccount = useraccount.substring(0, 25);

    // removes white spaces from display names (for accounts like Riot Games)
    useraccount = useraccount.replace(/%20/g, "");

    followingurl = twitchbaseurl + "/users/" + useraccount + "/follows/channels";
    setWaitCursor();
    setStartLoadingInfo();
    setNextUpdate(updatemillis);
    getAllChannels(limitchannels, function() {
      return showChannels(function() {
        return channels;
      });
    });
  } else {
    noUserSpecified();
    disableInteraction();
  }
});

// main function
function getAllChannels(limit, callback) {
  channels = [];
  userentryid = 1;

  $.ajax({
    url: followingurl + "?" + "limit=" + limit + "&" + jsonpString,
    dataType: "jsonp",
    jsonp: "jsonp",
    success: function(data) {
      if (data.error === "Not Found") {
        showUserNotFoundInfo();
        removeWaitCursor();
        disableInteraction();
        deactivateUpdates();
      } else if (data._total === 0) {
        showNoFollowingChannelsInfo();
        removeWaitCursor();
        disableInteraction();
        deactivateUpdates();
      } else {
        //set number of total channels user is following
        channelsToFetch = data._total;

        var followedChannels = data.follows;

        // iterate through each channel 
        $(followedChannels).each(function(index, value) {
          var channel = value.channel;

          // get streamer info
          var streamername = channel.display_name;
          var streamerstatus = channel.status;
          if (channel.status) {
            var streamerstatus = channel.status;
          } else {
            // user has no status set
            var streamerstatus = "";
          }

          var streamericon = channel.logo;
          /* if streamer has no icon set, use default twitch icon instead */
          if (streamericon === null) {
            streamericon = defaultprofileimageurl;
          }

          var profileurl = channel.url;
          channels.push(new streamer(streamername, streamerstatus, streamericon, profileurl, userentryid));
          userentryid++;
        }); // for each end
        removeWaitCursor();

        if (callback) {
          getStatus(callback);
        }
      }
    }
  });
};

// adds status to fetched channel info
function getStatus(callback) {
  setWaitCursor();
  for (var user of channels) {
    streamurl += user.name + ",";
  }

  streamurl = streamurl.slice(0, -1);
  streamurl += "&" + jsonpString;

  $.getJSON(streamurl, function(response) {
    var streamarray = response.streams;

    $.each(streamarray, function(index, channel) {
      // these users are streaming now
      var uid = channel.channel.display_name;

      // get users from our array and update info about their status
      var user = channels.filter(getUserByTwitchId(uid))[0];

      user.streams = true;
      user.viewers = channel.viewers;
      user.game = channel.game;
    });
    removeWaitCursor();
    callback();

    // resetting
    streamurl = "https://api.twitch.tv/kraken/streams?channel=";
  });
};

// visualizing the fetched channel info
function showChannels(callback) {

  var channels = callback();
  setWaitCursor();
  clearContentDiv();

  for (var user of channels) {
    // adds a new div for every streamer in the application window
    $(".content").append("<div class='streamer-entry' id='entryid" + user.userappid + "'></div>");

    addContentLine();

    $("#entryid" + user.userappid).append("<img class='streamericon' width='64px' height='64px' src = '" + user.iconurl + "'/><a class='streamername vertical-align' target='_blank' href='" + user.profileurl + "'>" + user.name + "</a><p class='streamerstatus vertical-align'>" + user.status + "</p>");

    var statusobj = "#entryid" + user.userappid + " .streamerstatus";

    // adds a tooltip and black ellipsis if status is too long
    if (isEllipsisActive($(statusobj))) {
      var clippedStatus = $(statusobj).text();
      var maxWidth;

      if ($(".streamerstatus").css("width") === "210px") {
        // desktop version
        maxWidth = 210;
      } else {
        // mobile version
        maxWidth = 145;
      }

      // status is still too long
      while (($(statusobj)[0].scrollWidth > maxWidth)) {

        // removes the three dots and an additional character
        clippedStatus = clippedStatus.substring(0, clippedStatus.length - 4);
        clippedStatus += "...";

        // puts the truncated status in the div, so we can read its width once again 
        $(statusobj).html(clippedStatus);
        statusobj = "#entryid" + user.userappid + " .streamerstatus";
      }

      // puts the ellipsis in a span, so we can style it
      clippedStatus = clippedStatus.substring(0, clippedStatus.length - 3);
      $(statusobj).html(clippedStatus + "<span class='black-ellipsis'> &#8230</span>");

      // adds the tooltip with the original status
      $(statusobj).attr("title", user.status).addClass("information-cursor");
    }
  } // for loop end

  $(".streamer-entry").append("<i class='fa fa-lg status-icon'></i>");

  if ($("#off-btn").hasClass("button-selected")) {
    addOfflineStatusInfo();
    setOfflineInfo();
  } else if ($("#on-btn").hasClass("button-selected")) {
    addOnlineStatusInfo(channels);
    setOnlineInfo();
  } else if ($("input[name=search-field]").is(":focus")) {
    addOnlineStatusInfo(channels.filter(isOnline));
    addOfflineStatusInfo();
    setSearchInfo();
  } else if ($("#all-btn").hasClass("button-selected")) {
    addOnlineStatusInfo(channels.filter(isOnline));
    addOfflineStatusInfo();
    setLoadingInfoComplete();
  }
	
  removeWaitCursor();
};

/* change status length on browser window resizing */
$(window).resize(function() {
    if($(window).width() < 530) {
	$(".streamerstatus").css("text-overflow", "ellipsis");
	$(".streamerstatus").css("overflow", "hidden");
    } else {
	$(".streamerstatus").css("overflow", "visible");
    }
});
