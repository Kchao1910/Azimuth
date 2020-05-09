// Reminder: api keys must be updated daily to ensure application works, api key is appended to the end of each api (may be other additional options).
let apiKey = "RGAPI-ef8ca48f-ed17-4655-b2c9-dcc7d7604471";

// 4 Main apis required to display all information required
// Summoner - gets summoner information such as name and id. Id is required input for League Api and Match Timeline Api.
const summonerApi = "lol/summoner/v4/summoners/by-name/";
// League - gets tier, rank, wins, losses, and league points.
const leagueApi = "lol/league/v4/entries/by-summoner/";
// Matchlist - gets timeline for all matches (up to last 100 matches). Timelines provide match ids required for the individual match api.
const matchApi = "lol/match/v4/matchlists/by-account/";
// Individual Match - gets match data such as champion, role, damage, objectives, minions, etc.
const individualMatchApi = "lol/match/v4/matches/";

// elements that need to be populated
const summonerNameValue = document.querySelector(".summoner-name");
const tierRankValue = document.querySelector(".tier-value");
const winLossValue = document.querySelector(".win-loss-value");
const leaguePointsValue = document.querySelector(".league-points-value");

// elements that are required for match statistics
const championValues = document.querySelectorAll(".champion-name");
const championArt = document.querySelectorAll(".champion-art");
const spellValues = document.querySelectorAll(".spell-value");
const itemValues = document.querySelectorAll(".item-value");
const kdaValues = document.querySelectorAll(".kda-value");
const csValues = document.querySelectorAll(".cs-value");
const goldValues = document.querySelectorAll(".gold-value");
const totalDamageDealtValues = document.querySelectorAll(".total-damage-dealt-value");
const totalDamageTakenValues = document.querySelectorAll(".total-damage-taken-value");
const totalDamageHealedValues = document.querySelectorAll(".total-damage-healed-value");
const totalDamageMitigatedValues = document.querySelectorAll(".total-damage-mitigated-value");
const objectiveDamageDealtValues = document.querySelectorAll(".objective-damage-dealt-value");
const baronValues = document.querySelectorAll(".baron-value");
const dragonValues = document.querySelectorAll(".dragon-value");
const heraldValues = document.querySelectorAll(".herald-value");
const towerValues = document.querySelectorAll(".tower-value");
const winValues = document.querySelectorAll(".win-status-value");

const killAverage = document.querySelector(".avg-kills-win");
const deathAverage = document.querySelector(".avg-deaths-win");
const assistAverage = document.querySelector(".avg-assits-win");
const minionAverage = document.querySelector(".avg-minions-win");
const goldAverage = document.querySelector(".avg-gold-win");
const dmgRatioAverage = document.querySelector(".avg-dmgRatio-win");
const objDmgAverage = document.querySelector(".avg-objDmg-win");
const towerAverage = document.querySelector(".avg-towers-win");

const killAverageLoss = document.querySelector(".avg-kills-loss");
const deathAverageLoss = document.querySelector(".avg-deaths-loss");
const assistAverageLoss = document.querySelector(".avg-assits-loss");
const minionAverageLoss = document.querySelector(".avg-minions-loss");
const goldAverageLoss = document.querySelector(".avg-gold-loss");
const dmgRatioAverageLoss = document.querySelector(".avg-dmgRatio-loss");
const objDmgAverageLoss = document.querySelector(".avg-objDmg-loss");
const towerAverageLoss = document.querySelector(".avg-towers-loss");

const kChart = [];
const dChart = [];
const aChart = [];
const kdaRatioChart = [];
const DPDChart = [];
const DPGChart = [];
let winsChart = 0;
let lossesChart = 0;


let averageKillsWin = 0;
let averageDeathsWin = 0;
let averageAssistsWin = 0;
let averageGoldWin = 0;
let averageMinionsWin = 0;
let averageDamageRatioWin = 0;
let averageObjDamageWin = 0;
let averageTowersWin = 0;
let averageWins = 0;

let averageKillsLoss = 0;
let averageDeathsLoss = 0;
let averageAssistsLoss = 0;
let averageGoldLoss = 0;
let averageMinionsLoss = 0;
let averageDamageRatioLoss = 0;
let averageObjDamageLoss = 0;
let averageTowersLoss = 0;
let averageLosses = 0;


// 14 champions display incorrectly due to spacing and apostrophes not included in the api
let alternativeChampionNames = {
  AurelionSol: "Aurelion Sol",
  DrMundo: "Dr. Mundo",
  JarvanIV: "Jarvan IV",
  Kaisa: "Kai'Sa",
  Khazix: "Kha'Zix",
  KogMaw: "Kog'Maw",
  LeeSin: "Lee Sin",
  MasterYi: "Master Yi",
  MissFortune: "Miss Fortune",
  MonkeyKing: "Monkey King",
  RekSai: "Rek'Sai",
  TahmKench: "Tahm'Kench",
  Velkoz: "Vel'Koz",
  XinZhao: "Xin Zhao",
};

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
  {id: "136", name: "AurelionSol"}, //needs to have a space
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
  {id: "36", name: "DrMundo"}, // Needs to have a period
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
  {id: "59", name: "JarvanIV"}, // Needs to have a space
  {id: "24", name: "Jax"}, 
  {id: "126", name: "Jayce"}, 
  {id: "202", name: "Jhin"}, 
  {id: "222", name: "Jinx"}, 
  {id: "145", name: "Kaisa"}, // Needs to have an apostrophe
  {id: "429", name: "Kalista"}, 
  {id: "43", name: "Karma"}, 
  {id: "30", name: "Karthus"}, 
  {id: "38", name: "Kassadin"}, 
  {id: "55", name: "Katarina"}, 
  {id: "10", name: "Kayle"}, 
  {id: "141", name: "Kayn"}, 
  {id: "85", name: "Kennen"}, 
  {id: "121", name: "Khazix"}, // Needs to have an apostrophe
  {id: "203", name: "Kindred"}, 
  {id: "240", name: "Kled"}, 
  {id: "96", name: "KogMaw"}, // Needs to have an apostrophe
  {id: "7", name: "Leblanc"}, 
  {id: "64", name: "LeeSin"}, // Needs to have a space
  {id: "89", name: "Leona"}, 
  {id: "127", name: "Lissandra"}, 
  {id: "236", name: "Lucian"}, 
  {id: "117", name: "Lulu"}, 
  {id: "99", name: "Lux"}, 
  {id: "54", name: "Malphite"}, 
  {id: "90", name: "Malzahar"}, 
  {id: "57", name: "Maokai"}, 
  {id: "11", name: "MasterYi"}, // Needs to have a space
  {id: "21", name: "MissFortune"}, // Needs to have a space
  {id: "62", name: "MonkeyKing"}, // Needs to have a space
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
  {id: "421", name: "RekSai"}, // Needs to have an apostrophe
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
  {id: "223", name: "TahmKench"}, // Needs to have a space
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
  {id: "161", name: "Velkoz"}, // Needs to have an apostrophe
  {id: "254", name: "Vi"}, 
  {id: "112", name: "Viktor"}, 
  {id: "8", name: "Vladimir"}, 
  {id: "106", name: "Volibear"}, 
  {id: "19", name: "Warwick"}, 
  {id: "498", name: "Xayah"}, 
  {id: "101", name: "Xerath"}, 
  {id: "5", name: "XinZhao"}, // Needs to have a space
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

const spellNames = ["SummonerBoost", "", "SummonerExhaust", "SummonerFlash", "", "SummonerHaste", "SummonerHeal", "", "", "", "SummonerSmite", "SummonerTeleport",
"SummonerMana", "SummonerDot", "", "", "", "", "", "", "SummonerBarrier", "", "", "", "", "", "", "", "", "SummonerPoroRecall", "SummonerPoroThrow", "SummonerSnowball",
"", "", "", "", "", "", "SummonerSnowURFSnowball_Mark"];

function checkNameFormat(championName) {
  for (let [key, value] of Object.entries(alternativeChampionNames)) {
    if (`${key}` === championName) {
      championName = `${value}`;
      break;
    }
  }

  return championName;
}

let basicApiData = {
  name: "",
  region: "",
  urlName: ""
};

function summonerBasicData(accountId, id, name) {
  this.accountId = accountId;
  this.id = id;
  this.name = name;
}

function summonerLeagueData(leaguePoints, losses, rank, tier, summonerName, wins) {
  this.leaguePoints = leaguePoints;
  this.losses = losses;
  this.rank = rank;
  this.tier = tier;
  this.summonerName = summonerName;
  this.wins = wins;
}

function summonerMatchList(matchList) {
  this.matchList = matchList;
}

function summonerIndividualMatchData(championId, spells, items, kills, deaths, assists, gold, totalMinions, neutralMinions, 
totalDamageDealt, totalDamageTaken, damageHealed, damageMitigated, damageToObjectives) {
  this.championId = championId;
  this.spells = spells;
  this.items = items;
  //this.kills = kills;
  //this.deaths = deaths;
  //this.assists = assists;
  this.kda = `${kills}/${deaths}/${assists}`;
  this.gold = gold;
  this.totalMinions = totalMinions;
  this.neutralMinions = neutralMinions;
  this.totalDamageDealt = totalDamageDealt;
  this.totalDamageTaken = totalDamageTaken;
  this.damageHealed = damageHealed;
  this.damageMitigated = damageMitigated;
  this.damageToObjectives = damageToObjectives;
}

function summonerTeamData(teamId, barons, dragons, heralds, objectives, winLoss) {
  this.teamId = teamId;
  this.barons = barons;
  this.dragons = dragons;
  this.heralds = heralds;
  this.objectives = objectives;
  this.winLoss = winLoss;
}

function getMatchIds(matchListStats) {
  let matchIdList = [];

  for (let match in matchListStats) {
    matchIdList.push(matchListStats[match].gameId);
  }

  return matchIdList;
}

// Part 1: Get input values: summonerName and summonerRegion
function getUserInput() {
  const summonerName = document.querySelector(".summoner-name-input").value.toLowerCase();
  const summonerRegion = document.querySelector(".summoner-region-select").value;
  
  return validateUserInput(summonerName, summonerRegion);
}

// Part 1.1: Validate Input
function validateUserInput(summonerName, summonerRegion) {
  // Step 1: make sure form is completely filled
  // Step 2: make sure that string is trimmed
  let inputIsFilled = false;
  let regionIsSelected = false;

  if (summonerName !== "") {
    inputIsFilled = true;
  }

  if (summonerRegion !== "region") {
    regionIsSelected = true;
  }

  if ((inputIsFilled === false) && (regionIsSelected === false)) {
    return "Summoner name is blank and region has not been selected.";
  }

  if ((inputIsFilled === true) && (regionIsSelected === false)) {
    return "Region is not specified.";
  }

  if ((inputIsFilled === false) && (regionIsSelected === true)) {
    return "Summoner name is blank.";
  }

  if ((inputIsFilled === true) && (regionIsSelected === true)) {
    // URLify spaces
    summonerName = summonerName.trim(); // trim spaces before and after string
    basicApiData.name = summonerName;
    //summonerName = summonerName.replace(" ", "%20"); // URLify white space, may not be required
    basicApiData.urlName = summonerName;
    basicApiData.region = summonerRegion;
    
    return true;
  }
}

async function asyncApiFetch(apiUrl) {
  let response = await fetch(apiUrl);
  let data = await response.json();
  return data;
}

function formApiRoute(summonerRegion, api) {
 return `https://${summonerRegion}.api.riotgames.com/${api}`;
}

function formApiUrl(apiRoute, apiEnding) {
  return apiRoute + apiEnding;
}

function getLeagueData(id) {
  let apiRoute = formApiRoute(basicApiData.region, leagueApi);
  let apiEnding = `${id}?api_key=${apiKey}`;
  let apiUrl = formApiUrl(apiRoute, apiEnding);

  asyncApiFetch(apiUrl)
  .then(data => {
    let leaguePoints = data[0]["leaguePoints"];
    let losses = data[0]["losses"];
    let rank = data[0]["rank"];
    let tier = data[0]["tier"];
    let summonerName = data[0]["summonerName"];
    let wins = data[0]["wins"];
    const leagueStats = new summonerLeagueData(leaguePoints, losses, rank, tier, summonerName, wins);
    displayBasicSummonerData(leagueStats);
    winLossChartIt(losses, wins);
    //displayWinLossChart(wins, losses);

  }).catch(error => {
    console.warn(error);
  });
}

function getMatchList(accountId) {
  let apiRoute = formApiRoute(basicApiData.region, matchApi);
  let apiEnding = `${accountId}?beginIndex=0&endIndex=10&api_key=${apiKey}`;
  let apiUrl = formApiUrl(apiRoute, apiEnding);

  asyncApiFetch(apiUrl)
  .then(data => {
    let matchList = data["matches"];
    const matchListStats = new summonerMatchList(matchList);
    const matchIdStats = getMatchIds(matchListStats.matchList);
    let gameIndex = 0;

    for (let match of matchIdStats) {
      getIndividualMatch(gameIndex, match);
      gameIndex += 1;
    }

  }).catch(error => {
    console.warn(error);
  });
}

// Get id that acts as dependency for stats related to summoner
function getParticipantId(gameIndex, timeline) {
  for (let participant of timeline.participantIdentities) {
    if (participant.player.summonerName.toLowerCase() === basicApiData.name.toLowerCase()) {
      getParticipantStats(gameIndex, timeline, (participant.participantId - 1));
      return;
    }
  }
}

// This is where we get all the stats from
function getParticipantStats(gameIndex, timeline, participantId) {
  const participant = timeline.participants[participantId];
  const stats = participant.stats;
  let championId = participant.championId;
  let teamId = ((participant.teamId / 100) - 1);
  let spells = [participant.spell1Id, participant.spell2Id];
  let items = [stats.item0, stats.item1, stats.item2, stats.item3, stats.item4, stats.item5]; // does not include trinkets (wards/ traps)
  let kills = stats.kills;
  kChart.push(kills);
  let deaths = stats.deaths;
  dChart.push(deaths);
  let assists = stats.assists; 
  aChart.push(assists);
  let kdaRatio = (kills + assists) * 1.0 / deaths;
  kdaRatioChart.push(kdaRatio);
  let totalMinions = stats.totalMinionsKilled;
  let neutralMinions = stats.neutralMinionsKilled;
  let gold = stats.goldEarned;
  let totalDamageDealt = stats.totalDamageDealt;
  let totalDamageTaken = stats.totalDamageTaken;
  let DPD = totalDamageTaken / 1000 / deaths;
  DPDChart.push(DPD);
  let DPG = totalDamageTaken / gold;
  DPGChart.push(DPG);
  let totalDamageHealed = stats.totalHeal;
  let totalDamageMitigated = stats.damageSelfMitigated;
  let objectiveDamageDealt = stats.damageDealtToObjectives;

  let teams = timeline.teams[teamId];
  let barons = teams.baronKills;
  let dragons = teams.dragonKills;
  let heralds = teams.riftHeraldKills;
  let towers = teams.towerKills;
  let win = teams.win;

  // push into average arrays
  if (win === "Win") {
    averageKillsWin += kills;
    averageDeathsWin += deaths;
    averageAssistsWin += assists;
    averageMinionsWin += totalMinions;
    averageGoldWin += gold;
    averageDamageRatioWin += totalDamageDealt/totalDamageTaken;
    averageObjDamageWin += objectiveDamageDealt;
    averageTowersWin += towers;
    averageWins += 1;
  } else {
    averageKillsLoss += kills;
    averageDeathsLoss += deaths;
    averageAssistsLoss += assists;
    averageMinionsLoss += totalMinions;
    averageGoldLoss += gold;
    averageDamageRatioLoss += totalDamageDealt/totalDamageTaken;
    averageObjDamageLoss += objectiveDamageDealt;
    averageTowersLoss += towers;
    averageLosses += 1;
  }

  let summonerMatchStats = new summonerIndividualMatchData(championId, spells, items, kills, deaths, assists, gold, totalMinions, neutralMinions,
  totalDamageDealt, totalDamageTaken, totalDamageHealed, totalDamageMitigated, objectiveDamageDealt);

  let summonerTeamStats = new summonerTeamData(teamId, barons, dragons, heralds, towers, win);
  
  displayMatchData(gameIndex, summonerMatchStats, summonerTeamStats); 
  chartIt();

  if ((averageWins + averageLosses) === 10) {
    displayAverages(averageKillsWin, killAverage, averageWins);
    displayAverages(averageDeathsWin, deathAverage, averageWins);
    displayAverages(averageAssistsWin, assistAverage, averageWins);
    displayAverages(averageGoldWin, goldAverage, averageWins);
    displayAverages(averageMinionsWin, minionAverage, averageWins);
    displayAverages(averageDamageRatioWin, dmgRatioAverage, averageWins);
    displayAverages(averageObjDamageWin, objDmgAverage, averageWins);
    displayAverages(averageTowersWin, towerAverage, averageWins);

      // Loss averages
    displayAverages(averageKillsLoss, killAverageLoss, averageLosses);
    displayAverages(averageDeathsLoss, deathAverageLoss, averageLosses);
    displayAverages(averageAssistsLoss, assistAverageLoss, averageLosses);
    displayAverages(averageGoldLoss, goldAverageLoss, averageLosses);
    displayAverages(averageMinionsLoss, minionAverageLoss, averageLosses);
    displayAverages(averageDamageRatioLoss, dmgRatioAverageLoss, averageLosses);
    displayAverages(averageObjDamageLoss, objDmgAverageLoss, averageLosses);
    displayAverages(averageTowersLoss, towerAverageLoss, averageLosses); 
  }

  return;
}

// Container for getting individual match statistics
function getIndividualMatch(gameIndex, match) {
  let apiRoute = formApiRoute(basicApiData.region, individualMatchApi);
  let apiEnding = `${match}?api_key=${apiKey}`;
  let apiUrl = formApiUrl(apiRoute, apiEnding);

  asyncApiFetch(apiUrl)
    .then(data => {
      getParticipantId(gameIndex, data);
    }).catch(error => {
      console.warn("Api fetch unsuccessful", error);
    }); 
}

// Displays the infomation required to form the basic summary
function displayBasicSummonerData(summonerProfileData) {
  summonerNameValue.textContent = summonerProfileData.summonerName;
  tierRankValue.textContent = `${summonerProfileData.tier} ${summonerProfileData.rank} (Ranked Solo)`;
  winLossValue.textContent = `${summonerProfileData.wins}/${summonerProfileData.losses}`;
  leaguePointsValue.textContent = summonerProfileData.leaguePoints;
}

// check if spell or item exists
function checkSpellItem(type, value) {
  if (type === "spell") {
    if (value !== 0 || value !== "") {
      return `http://ddragon.leagueoflegends.com/cdn/10.6.1/img/spell/${value}.png`;
    }
  }

  if (type === "item") {
    if (value !== 0) {
      return `http://ddragon.leagueoflegends.com/cdn/10.6.1/img/item/${value}.png`;
    }
  }

  return "";
}

// Displaying individual match's statistics
function displayMatchData(gameIndex, summonerMatchStats, summonerTeamStats) {
  let championName = summonerMatchStats.championId;
  let unformattedChampionName = getChampion(championName);
  championName = checkNameFormat(unformattedChampionName);
  championValues[gameIndex].textContent = championName;
  championArt[gameIndex].src = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${unformattedChampionName}_0.jpg`;

  // display spell images
  spellValues[(2 * gameIndex)].src = checkSpellItem("spell", spellNames[summonerMatchStats.spells[0] - 1]);
  spellValues[(2 * gameIndex) + 1].src = checkSpellItem("spell", spellNames[summonerMatchStats.spells[1] - 1]);

  // display item images
  itemValues[(6 * gameIndex)].src = checkSpellItem("item", summonerMatchStats.items[0]);
  itemValues[(6 * gameIndex) + 1].src = checkSpellItem("item", summonerMatchStats.items[1]);
  itemValues[(6 * gameIndex) + 2].src = checkSpellItem("item", summonerMatchStats.items[2]);
  itemValues[(6 * gameIndex) + 3].src = checkSpellItem("item", summonerMatchStats.items[3]);
  itemValues[(6 * gameIndex) + 4].src = checkSpellItem("item", summonerMatchStats.items[4]);
  itemValues[(6 * gameIndex) + 5].src = checkSpellItem("item", summonerMatchStats.items[5]);

  // display individual stats
  kdaValues[gameIndex].textContent = `${summonerMatchStats.kda}`;
  console.log(summonerMatchStats.kda)
  csValues[gameIndex].textContent = `${summonerMatchStats.totalMinions} (${summonerMatchStats.neutralMinions})`;
  goldValues[gameIndex].textContent = summonerMatchStats.gold;
  totalDamageDealtValues[gameIndex].textContent = summonerMatchStats.totalDamageDealt;
  totalDamageTakenValues[gameIndex].textContent = summonerMatchStats.totalDamageTaken;
  totalDamageHealedValues[gameIndex].textContent = summonerMatchStats.damageHealed;
  totalDamageMitigatedValues[gameIndex].textContent = summonerMatchStats.damageMitigated;
  objectiveDamageDealtValues[gameIndex].textContent = summonerMatchStats.damageToObjectives;

  // display team stats
  baronValues[gameIndex].textContent = summonerTeamStats.barons;
  dragonValues[gameIndex].textContent = summonerTeamStats.dragons;
  heraldValues[gameIndex].textContent = summonerTeamStats.heralds;
  towerValues[gameIndex].textContent = summonerTeamStats.objectives;
  winValues[gameIndex].textContent = (summonerTeamStats.winLoss !== "Fail" ? "Win" : "Loss");
}

function displayAverages(sum, container, games) {
  let statAverage = calculateAverage(sum, games);
  
  container.textContent = statAverage.toFixed(2);
}

function calculateAverage(sum, games) {
  return (sum / games);
}

function getChampion(championId) {
  for (let champion of champions) {
    if (champion.id === `${championId}`) {
      return champion.name;
    }
  }

  return;
}

function winLossChartIt(losses, wins) {
    
  console.log(losses);
  console.log(wins);
  var ctx = document.getElementById('winLossChart').getContext('2d');
  var myPieChart = new Chart(ctx, {
  type: 'pie',
  data: {
       labels: ['WINS','LOSSES'],
      datasets:[{
          data : [wins, losses],
          backgroundColor : ['rgba(54, 162, 235, 0.6)', 'rgba(230, 41, 49, 0.6)'],
          borderWidth:0
      }],
  }
});
 
}

function chartIt() {
 var ctx = document.getElementById('kdachart').getContext('2d');
 var myChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: ['1', '2', '3', '4', '5', '6','7', '8', '9', '10'],
      datasets: [{
          label: 'KILLS',
          data: kChart,
          fill:false,
          borderColor:   'rgba(100, 180, 235, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(100, 180, 235, 1)',
          pointRadius:3,
          hidden:true
          
      },
          {
          label: 'DEATHS',
          data: dChart,
          fill:false,
          borderColor: 'rgba(54, 150, 235, 1)',
          borderWidth: 2,
          borderJoinStyle: 'miter',
          pointBackgroundColor:'rgba(54, 162, 235, 1)',
          pointRadius:3,
          hidden:true
      },
          {
          label: 'ASSISTS',
          data: aChart,
          fill:false,
          borderColor:'rgba(10, 80, 150, 1)',
          borderWidth: 2,
          borderJoinStyle: 'miter',
          pointBackgroundColor:'rgba(10, 80, 150, 1)',
          pointRadius:3,
          hidden:true
      },
      {
          label: 'KDA RATIO',
          data: kdaRatioChart,
          fill:false,
          borderColor:'rgba(230, 41, 49, 1)',
          borderWidth: 6,
          borderJoinStyle: 'miter',
          pointBackgroundColor:'rgba(230, 41, 49, 1)',
          pointRadius:6,
      },
      {
          label: 'DPD',
          data: DPDChart,
          fill:false,
          borderColor:'rgba(122, 41, 49, 1)',
          borderWidth: 6,
          borderJoinStyle: 'miter',
          pointBackgroundColor:'rgba(230, 41, 49, 1)',
          pointRadius:6,
          hidden:true
      },
          {
          label: 'DPG',
          data: DPGChart,
          fill:false,
          borderColor:'rgba(90, 229, 49, 1)',
          borderWidth: 6,
          borderJoinStyle: 'miter',
          pointBackgroundColor:'rgba(230, 41, 49, 1)',
          pointRadius:6,
          hidden:true
      }]
      
  },
      options: {
      legend: {
          labels: {
              // This more specific font property overrides the global property
              fontColor: 'white',
              fontSize: 20
              
          }
      },
      scales: {
          yAxes: [{
              ticks: {
                  fontSize:20
                  
              },
              scaleLabel: {
                  display:true,
                  labelString:"STATISTICS",
                  fontSize:20,
                  fontColor:'white',
                  
              },
              
             gridLines: {
                 display:true,
                 color: 'rgba(241, 241, 241, 0.2)'
             }
              
          }],
          xAxes: [{
              ticks: {
                  fontSize:20
                  
              },
              scaleLabel: {
                  display:true,
                  labelString:"RECENT MATCHES",
                  fontSize:20,
                  fontColor:'white'
                  
              },
              
             gridLines: {
                 display:true,
                 color: 'rgba(241, 241, 241, 0.2)',
             }
          }]
      }
  }
});
  
}

// Event delegation
document.addEventListener("click", event => {
  if (event.target.matches(".summoner-search-button")) {
    let message = getUserInput();

    if (message !== true) {
      alert(message);
    } else {
      // first get summoner api
      let apiRoute = formApiRoute(basicApiData.region, summonerApi);
      let apiEnding = `${basicApiData.urlName}?api_key=${apiKey}`;
      let apiUrl = formApiUrl(apiRoute, apiEnding);

      asyncApiFetch(apiUrl)
        .then(data => {
          let accountId = data["accountId"];
          let id = data["id"];
          let name = data["name"];
          const basicStats = new summonerBasicData(accountId, id, name);

          averageKillsWin = 0;
          averageDeathsWin = 0;
          averageAssistsWin = 0;
          averageGoldWin = 0;
          averageMinionsWin = 0;
          averageDamageRatioWin = 0;
          averageObjDamageWin = 0;
          averageTowersWin = 0;
          averageWins = 0;

          averageKillsLoss = 0;
          averageDeathsLoss = 0;
          averageAssistsLoss = 0;
          averageGoldLoss = 0;
          averageMinionsLoss = 0;
          averageDamageRatioLoss = 0;
          averageObjDamageLoss = 0;
          averageTowersLoss = 0;
          averageLosses = 0;

          getLeagueData(basicStats.id);
          getMatchList(basicStats.accountId);
          console.log(kChart)
          console.log(aChart);
          console.log(dChart);
          
          
        }).catch(error => {
          console.warn(error);
        });
    }
  }
});