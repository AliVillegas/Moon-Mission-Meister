const localStorageMissionsName = "missionsData";
let estimatedVisitorsUsingTheTool = 0;

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
      "https://api.countapi.xyz/hit/localhost/personUsingMoonMeisterTracker"
    );
    xhr.responseType = "json";
    xhr.onload = function () {
      console.log(`This button has been clicked ${this.response.value} times!`);
      estimatedVisitorsUsingTheTool = this?.response?.value;
      document.getElementById(
        "estimatedVisitorsUsingTheTool"
      ).innerHTML = `Estimated number of visitors using the tool: ${this.response.value}`;
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

function loadMissions() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "https://api.countapi.xyz/hit/localhost/personVisitingMoonMeisterTracker"
  );
  xhr.responseType = "json";
  xhr.onload = function () {
    console.log(`Estimated number of visitors ${this.response.value}`);
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
