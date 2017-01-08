const requestWithCache = require("./requestWithCache").requestWithCache;
const cheerio = require("cheerio");

function getSlam40Songs() {
//  <div class="listing">
//   <div class="nmbr">2</div>
//   <div class="thumb"><img src="https://i.scdn.co/image/e6ae5b37ac76678a7474678577de64e64dbe2147"
//                           alt="The Weeknd"></div>
//   <div class="info">
//       <div class="title">Starboy</div>
//       <div class="excerpt">The Weeknd</div>
//   </div>
//   <a class="spotify-play" href="7lQqaqZu0vjxzpdATOIsDt"><span class="icon fa"><img src="http://www.slam.nl/wp-content/themes/slam-gsys/images/playicon-yellow.png" alt="play"></span></a>
// </div>

  const interval = 64800000; // 18 hours

  return requestWithCache("http://www.slam.nl/slam40/", interval)
    .then(body => cheerio.load(body))
    .then($ => {
      const songs = [];

      $(".listing").each(function() {

        const nr = $(this).find('.nmbr').text();
        const artist = $(this).find('.excerpt').text();
        const title = $(this).find('.title').text();

        if( !songs.find(s => s.nr === nr && s.title === title ) ) {

          songs.push({
            nr,
            artist,
            title
          });

        }
      });

      return songs;
    })
}

module.exports = getSlam40Songs;
