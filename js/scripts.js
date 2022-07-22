const localStorageMissionsName = "missionsData";
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
    let missionsInLocalStorage = {};
    missionsInLocalStorage[missionId] = checked;
    localStorage.setItem(
      localStorageMissionsName,
      JSON.stringify(missionsInLocalStorage)
    );
  }
}

function loadMissions() {
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
