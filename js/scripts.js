const localStorageMissionsName = "missionsData";
let estimatedVisitorsUsingTheTool = 0;
let estimatedVisitors = 0;

// using sendgrid to send me a personal email for visitor stats,
// no personal info is saved, check sendNumOfVisitorStats() to see what data is sent
const SENDGRID_CRD = process?.env?.SENDGRID_KK || null;
const SENDGRID_URL = "https://api.sendgrid.com/v3/";
const SNDR_EMAIL = process?.env?.SNDR_EMAIL || null;
const TARG_EMAIL = process?.env?.TARG_EMAIL || null;

/* 
sends me a personal email with sendgrid 
with the num of approx visitors of the site 
and people that have clicked on at least one mission 
*/
function sendNumOfVisitorStats(
  moonMeisterVisitors = null,
  moonMeisterUsers = null
) {
  if (
    SENDGRID_CRD &&
    SNDR_EMAIL &&
    TARG_EMAIL &&
    moonMeisterVisitors &&
    moonMeisterUsers
  ) {
    let dataStats = {
      to: TARG_EMAIL,
      from: SNDR_EMAIL,
      templateId: "d-3a0e4335e83544a1b55ea38f66a27f29",
      dynamicTemplateData: {
        moonMeisterVisitors,
        moonMeisterUsers,
      },
    };
    var headersForSendgrid = new Headers({
      Authorization: `Bearer ${SENDGRID_CRD}`,
    });

    fetch(SENDGRID_URL, {
      method: "POST",
      headers: headersForSendgrid,
      body: JSON.stringify(dataStats),
    }).then((res) => {
      console.log("Request complete! response:", res);
    });
  }
}

/* 
click listener when users tap any checkbox
adds mission to localstorage
if the user has no localstorage info I estimate that
its a new user using the tool for the first time with the count api
*/
function strikeSideMission(sideMissionData) {
  const missionId = sideMissionData?.getAttribute("for");
  const checked = sideMissionData?.checked || false;
  const elementToStrike = document.getElementById(missionId);

  if (checked) {
    elementToStrike?.classList.add("line-through");
  } else {
    elementToStrike?.classList.remove("line-through");
  }
  let missionsInLocalStorage = localStorage?.getItem(localStorageMissionsName);
  if (missionsInLocalStorage) {
    missionsInLocalStorage = JSON.parse(missionsInLocalStorage);
    missionsInLocalStorage[missionId] = checked;
    localStorage.setItem(
      localStorageMissionsName,
      JSON.stringify(missionsInLocalStorage)
    );
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://api.countapi.xyz/hit/moonmissionmeister.netlify.app/personUsingMoonMeisterTrackerCounter"
    );
    xhr.responseType = "json";
    xhr.onload = function () {
      console.log(
        `Estimated number of visitors using the tool: ${this.response.value}`
      );
      estimatedVisitorsUsingTheTool = this?.response?.value;
      sendNumOfVisitorStats(estimatedVisitorsUsingTheTool, estimatedVisitors);
    };
    xhr.send();
    let missionsInLocalStorage = {};
    missionsInLocalStorage[missionId] = checked;
    localStorage.setItem(
      localStorageMissionsName,
      JSON.stringify(missionsInLocalStorage)
    );
  }
}

/* 
Checks missions data saved on local storage 
to mark them as completed or not when users 
open the page again
*/
function loadMissions() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.countapi.xyz/hit/moonmissionmeister.netlify.app/personVisitingMoonMeisterTrackerCounter"
  );
  xhr.responseType = "json";
  xhr.onload = function () {
    console.log(`Estimated number of visitors ${this.response.value}`);
    estimatedVisitors = this.response.value;
  };
  xhr.send();
  let missionsInLocalStorage = localStorage?.getItem(localStorageMissionsName);
  if (missionsInLocalStorage) {
    missionsInLocalStorage = JSON.parse(missionsInLocalStorage);
    Object.keys(missionsInLocalStorage).forEach(function (mission) {
      if (missionsInLocalStorage[mission]) {
        const elementToStrike = document.getElementById(mission);
        const checkboxToEnable = document.getElementById(
          "" + mission + "Checkbox"
        );
        checkboxToEnable.checked = true;
        elementToStrike?.classList.add("line-through");
      }
    });
  }
}
