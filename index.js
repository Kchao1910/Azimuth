
const apiKey = "";


const summonerApi = "lol/summoner/v4/summoners/by-name/";
const leagueApi = "lol/league/v4/entries/by-summoner/";
const matchApi = "lol/match/v4/matchlists/by-account/";
const individualMatchApi = "lol/match/v4/matches/";

let matchStats = document.querySelectorAll(".match-stat"); // this is to display in match containers

let apiRegion = {
  region: ""
};

let summonerData = {
  name: "",
  id: "",
  accountId: "",
  tier: "",
  wins: 0,
  losses: 0,
  rank: "",
  leaguePoints: 0,
};

let summonerMatchData = {
  matchList: [],
  totalGames: 0,
};

let individualMatchData = {
  gameId: [],
  championId: [],
  champion: [],
  role: [],
  lane: [],
  id: [],
  deaths: [],
  kills: [],
  win: [],
  goldEarned: []
};

let matchTimeLine = {
  timeLine: {}
};

async function getApiAsync(api) 
{
  let response = await fetch(api);
  let data = await response.json()
  return data;
}

function getFullApi(apiBeginning, apiEnding) {
  return apiBeginning + apiEnding;
}

document.addEventListener('click', event => {
    event.preventDefault();

    if (event.target.matches("#search-button")) {
      let summonerNameValue = document.querySelector("#summoner-search-input").value;
      let regionValue = document.querySelector("#region-select").value;

      summonerNameValue = summonerNameValue.replace(' ', '%20'); // replace white space
      apiRegion.region = regionValue;

      const summonerApiBeginning = `https://${apiRegion.region}.api.riotgames.com/${summonerApi}`;
      const summonerApiEnding = `${summonerNameValue}?api_key=${apiKey}`;

      let fullSummonerApi = getFullApi(summonerApiBeginning, summonerApiEnding);

      getApiAsync(fullSummonerApi)
        .then(data => {
          summonerData.name = data["name"];
          summonerData.id = data["id"];
          summonerData.accountId = data["accountId"];

          getLeague(summonerData.id);
          getMatchList(summonerData.accountId);
          
        }).catch(error => {
          console.warn("Api fetch unsuccessful", error);
        }); 
    }
});

function getLeague(id) {
  const leagueApiBeginning = `https://${apiRegion.region}.api.riotgames.com/${leagueApi}`;
  const leagueApiEnding = `${id}?api_key=${apiKey}`;
  const fullLeagueApi = getFullApi(leagueApiBeginning, leagueApiEnding);

  getApiAsync(fullLeagueApi)
    .then(data => {
      summonerData.tier = data[0]["tier"];
      summonerData.wins = data[0]["wins"];
      summonerData.losses = data[0]["losses"];
      summonerData.rank = data[0]["rank"];
      summonerData.leaguePoints = data[0]["leaguePoints"];
    }).catch(error => {
      console.warn("Api fetch unsuccessful", error);
    }); 
}

function getMatchList(accountId) {
  const matchApiBeginning = `https://${apiRegion.region}.api.riotgames.com/${matchApi}`;
  const matchApiEnding = `${accountId}?beginIndex=0&endIndex=4&api_key=${apiKey}`;
  const fullMatchApi = getFullApi(matchApiBeginning, matchApiEnding);

  getApiAsync(fullMatchApi)
    .then(data => {
      summonerMatchData.matchList = data["matches"];
      populateMatchData(summonerMatchData);
    }).catch(error => {
      console.warn("Api fetch unsuccessful", error);
    }); 
}

function populateMatchData(summonerMatchData) {

  for (let match of summonerMatchData.matchList) {
    individualMatchData.gameId.push(match.gameId);
    individualMatchData.championId.push(match.champion);
    individualMatchData.role.push(match.role);
    individualMatchData.lane.push(match.lane);
  }

  for (let id of individualMatchData.gameId) {
    getIndiviualMatch(id);
  }
}

function getIndiviualMatch(gameId) {
  const individualMatchApiBeginning = `https://${apiRegion.region}.api.riotgames.com/${individualMatchApi}`;
  const individualMatchApiEnding = `${gameId}?api_key=${apiKey}`;
  const fullIndividualMatchApi = getFullApi(individualMatchApiBeginning, individualMatchApiEnding);

  getApiAsync(fullIndividualMatchApi)
    .then(data => {
      syncMatchData(data);
      getChampion();
      display();
    }).catch(error => {
      console.warn("Api fetch unsuccessful", error);
    }); 
}

function syncMatchData(timeline) {
  for (let participant of timeline.participantIdentities) {
    if (participant.player.summonerName === summonerData.name) {
      individualMatchData.id.push(participant.participantId);
      syncChampionData(timeline, participant.participantId);
      return;
    }
  }
}

function syncChampionData(timeline, participantId) {
  individualMatchData.deaths.push(timeline.participants[participantId - 1].stats.deaths);
  individualMatchData.kills.push(timeline.participants[participantId - 1].stats.kills);
  individualMatchData.goldEarned.push(timeline.participants[participantId - 1].stats.goldEarned);
  individualMatchData.win.push(timeline.participants[participantId - 1].stats.win);
}

function getChampion() {
  for (let id of individualMatchData.championId) {
    for (let champion of champions) {
      if (champion.id === `${id}`) {
        individualMatchData.champion.push(champion.name);
        break;
      }
    }
  }

  return;
}

function display() {
  const summonerName = document.querySelector(".summoner-name");
  const tier = document.querySelector(".tier");
  const wl = document.querySelector(".wl");
  const lp = document.querySelector(".lp");

  summonerName.textContent = `${summonerData.name}`;
  tier.textContent = `${summonerData.tier} ${summonerData.rank}`;
  wl.textContent = `${summonerData.wins}/${summonerData.losses}`;
  lp.textContent = `${summonerData.leaguePoints}`;

  let i = 0;

  individualMatchData.gameId.forEach( (game, index) => {
    matchStats[i].textContent = individualMatchData.champion[index];
    matchStats[i + 1].textContent = summonerMatchData.matchList[index].role;
    matchStats[i + 2].textContent = summonerMatchData.matchList[index].lane;
    matchStats[i + 3].textContent = individualMatchData.kills[index];
    matchStats[i + 4].textContent = individualMatchData.deaths[index];
    matchStats[i + 5].textContent = individualMatchData.goldEarned[index];

    i += 6;
  });
}

let champions = [
  {id: "266", name: "Aatrox"}, 
  {id: "103", name: "Ahri"}, 
  {id: "84", name: "Akali"}, 
  {id: "12", name: "Alistar"}, 
  {id: "32", name: "Amumu"}, 
  {id: "34", name: "Anivia"}, 
  {id: "1", name: "Annie"}, 
  {id: "523", name: "Aphelios"}, 
  {id: "22", name: "Ashe"}, 
  {id: "136", name: "AurelionSol"}, 
  {id: "268", name: "Azir"}, 
  {id: "432", name: "Bard"}, 
  {id: "53", name: "Blitzcrank"}, 
  {id: "63", name: "Brand"}, 
  {id: "201", name: "Braum"}, 
  {id: "51", name: "Caitlyn"}, 
  {id: "164", name: "Camille"}, 
  {id: "69", name: "Cassiopeia"}, 
  {id: "31", name: "Chogath"}, 
  {id: "42", name: "Corki"}, 
  {id: "122", name: "Darius"}, 
  {id: "131", name: "Diana"}, 
  {id: "119", name: "Draven"}, 
  {id: "36", name: "DrMundo"}, 
  {id: "245", name: "Ekko"}, 
  {id: "60", name: "Elise"}, 
  {id: "28", name: "Evelynn"}, 
  {id: "81", name: "Ezreal"}, 
  {id: "9", name: "Fiddlesticks"}, 
  {id: "114", name: "Fiora"}, 
  {id: "105", name: "Fizz"}, 
  {id: "3", name: "Galio"}, 
  {id: "41", name: "Gangplank"}, 
  {id: "86", name: "Garen"}, 
  {id: "150", name: "Gnar"}, 
  {id: "79", name: "Gragas"}, 
  {id: "104", name: "Graves"}, 
  {id: "120", name: "Hecarim"}, 
  {id: "74", name: "Heimerdinger"}, 
  {id: "420", name: "Illaoi"}, 
  {id: "39", name: "Irelia"}, 
  {id: "427", name: "Ivern"}, 
  {id: "40", name: "Janna"}, 
  {id: "59", name: "JarvanIV"}, 
  {id: "24", name: "Jax"}, 
  {id: "126", name: "Jayce"}, 
  {id: "202", name: "Jhin"}, 
  {id: "222", name: "Jinx"}, 
  {id: "145", name: "Kaisa"}, 
  {id: "429", name: "Kalista"}, 
  {id: "43", name: "Karma"}, 
  {id: "30", name: "Karthus"}, 
  {id: "38", name: "Kassadin"}, 
  {id: "55", name: "Katarina"}, 
  {id: "10", name: "Kayle"}, 
  {id: "141", name: "Kayn"}, 
  {id: "85", name: "Kennen"}, 
  {id: "121", name: "Khazix"}, 
  {id: "203", name: "Kindred"}, 
  {id: "240", name: "Kled"}, 
  {id: "96", name: "KogMaw"}, 
  {id: "7", name: "Leblanc"}, 
  {id: "64", name: "LeeSin"}, 
  {id: "89", name: "Leona"}, 
  {id: "127", name: "Lissandra"}, 
  {id: "236", name: "Lucian"}, 
  {id: "117", name: "Lulu"}, 
  {id: "99", name: "Lux"}, 
  {id: "54", name: "Malphite"}, 
  {id: "90", name: "Malzahar"}, 
  {id: "57", name: "Maokai"}, 
  {id: "11", name: "MasterYi"}, 
  {id: "21", name: "MissFortune"}, 
  {id: "62", name: "MonkeyKing"}, 
  {id: "82", name: "Mordekaiser"}, 
  {id: "25", name: "Morgana"}, 
  {id: "267", name: "Nami"}, 
  {id: "75", name: "Nasus"}, 
  {id: "111", name: "Nautilus"}, 
  {id: "518", name: "Neeko"}, 
  {id: "76", name: "Nidalee"}, 
  {id: "56", name: "Nocturne"}, 
  {id: "20", name: "Nunu"}, 
  {id: "2", name: "Olaf"}, 
  {id: "61", name: "Orianna"}, 
  {id: "516", name: "Ornn"}, 
  {id: "80", name: "Pantheon"}, 
  {id: "78", name: "Poppy"}, 
  {id: "555", name: "Pyke"}, 
  {id: "246", name: "Qiyana"}, 
  {id: "133", name: "Quinn"}, 
  {id: "497", name: "Rakan"}, 
  {id: "33", name: "Rammus"}, 
  {id: "421", name: "RekSai"}, 
  {id: "58", name: "Renekton"}, 
  {id: "107", name: "Rengar"}, 
  {id: "92", name: "Riven"}, 
  {id: "68", name: "Rumble"}, 
  {id: "13", name: "Ryze"}, 
  {id: "113", name: "Sejuani"}, 
  {id: "235", name: "Senna"}, 
  {id: "875", name: "Sett"}, 
  {id: "35", name: "Shaco"}, 
  {id: "98", name: "Shen"}, 
  {id: "102", name: "Shyvana"}, 
  {id: "27", name: "Singed"}, 
  {id: "14", name: "Sion"}, 
  {id: "15", name: "Sivir"}, 
  {id: "72", name: "Skarner"}, 
  {id: "37", name: "Sona"}, 
  {id: "16", name: "Soraka"}, 
  {id: "50", name: "Swain"}, 
  {id: "517", name: "Sylas"}, 
  {id: "134", name: "Syndra"}, 
  {id: "223", name: "TahmKench"}, 
  {id: "163", name: "Taliyah"}, 
  {id: "91", name: "Talon"}, 
  {id: "44", name: "Taric"}, 
  {id: "17", name: "Teemo"}, 
  {id: "412", name: "Thresh"}, 
  {id: "18", name: "Tristana"}, 
  {id: "48", name: "Trundle"}, 
  {id: "23", name: "Tryndamere"}, 
  {id: "4", name: "TwistedFate"}, 
  {id: "29", name: "Twitch"}, 
  {id: "77", name: "Udyr"}, 
  {id: "6", name: "Urgot"}, 
  {id: "110", name: "Varus"}, 
  {id: "67", name: "Vayne"}, 
  {id: "45", name: "Veigar"}, 
  {id: "161", name: "Velkoz"}, 
  {id: "254", name: "Vi"}, 
  {id: "112", name: "Viktor"}, 
  {id: "8", name: "Vladimir"}, 
  {id: "106", name: "Volibear"}, 
  {id: "19", name: "Warwick"}, 
  {id: "498", name: "Xayah"}, 
  {id: "101", name: "Xerath"}, 
  {id: "5", name: "XinZhao"}, 
  {id: "157", name: "Yasuo"}, 
  {id: "83", name: "Yorick"}, 
  {id: "350", name: "Yuumi"}, 
  {id: "154", name: "Zac"}, 
  {id: "238", name: "Zed"}, 
  {id: "115", name: "Ziggs"}, 
  {id: "26", name: "Zilean"}, 
  {id: "142", name: "Zoe"}, 
  {id: "143", name: "Zyra"}
];
