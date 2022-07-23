<script>
import Mission from "@/components/Mission.vue";
import { missions } from "./missions";
import * as sgMail from "@sendgrid/mail"

const localStorageMissionsName = "missionsData";
const localStorageUserInteractedWithSite = "interactedWithSite";

const countApiNumOfVisitorsKeyUrl =
  "https://api.countapi.xyz/hit/moonmissionmeister.netlify.app/visitorsMoonMeisterTrackerCounter";
const countApiNumOfActiveVisitorsKeyUrl =
  "https://api.countapi.xyz/hit/moonmissionmeister.netlify.app/usersMoonMeisterTrackerCounter";

const SENDGRID_CRD = import.meta.env.VITE_SENDGRID_CRD;
const SENDGRID_URL = import.meta.env.VITE_SENDGRID_URL;
const SNDR_EMAIL = import.meta.env.VITE_SNDR_EMAIL;
const TARG_EMAIL = import.meta.env.VITE_TARG_EMAIL;


export default {
  data() {
    return {};
  },
  emits: ["updateMissionData"],
  components: {
    Mission,
  },
  setup(_, { emit }) {
    let missionsData = {};
    let moonMeisterVisitors = null;
    let moonMeisterUsers = null;

    /*
         sends me a personal email with sendgrid
         with the num of approx visitors of the site
         and people that have clicked on at least one mission
       */
    function sendNumOfVisitorStats() {
      console.log(SENDGRID_URL, SENDGRID_CRD,
        SNDR_EMAIL,
        TARG_EMAIL,
        moonMeisterVisitors,
        moonMeisterUsers)
      if (
        SENDGRID_URL &&
        SENDGRID_CRD &&
        SNDR_EMAIL &&
        TARG_EMAIL &&
        moonMeisterVisitors &&
        moonMeisterUsers
      ) {
        console.log("Ready to send mail")
        sgMail.setApiKey(SENDGRID_CRD)
        let dataStats = {
          to: TARG_EMAIL,
          from: SNDR_EMAIL,
          templateId: "d-3a0e4335e83544a1b55ea38f66a27f29",
          dynamicTemplateData: {
            moonMeisterVisitors,
            moonMeisterUsers,
          },
        };
        sgMail
          .send(dataStats)
          .then((response) => {
            console.log("Sent number of visitors stats to email:", response);
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }
    // count api call for estimate users that visited this tracker tool
    function saveNumOfVisitors() {
      fetch(countApiNumOfVisitorsKeyUrl)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(
            `Estimated number of times this page has been opened: ${data?.value}`
          );
          moonMeisterVisitors = data?.value;
        });
    }

    // count api call for estimate users that tracked at least 1 mission
    function saveNumOfUsersThatInteractedWithSite() {
      fetch(countApiNumOfActiveVisitorsKeyUrl)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(
            `Estimated number of times people have used this tracker tool: ${data?.value}`
          );
          moonMeisterUsers = data?.value;
          sendNumOfVisitorStats(); // sending me a mail with the page stats
        });
    }


    // updates local storage mission data
    function saveMissionDataToLocalStorage() {
      if (missionsData) {
        localStorage.setItem(
          localStorageMissionsName,
          JSON.stringify(missionsData)
        );
      }
    }

    // if theres no data in local storage I add all missions as unfinished
    function firstTimeMissionDataSetup() {
      console.log("Saving Missions Data in local storage");
      saveNumOfVisitors();
      let missionsInLocalStorage = localStorage?.getItem(
        localStorageMissionsName
      );
      if (!missionsInLocalStorage) {
        missionsData = missions;
        saveMissionDataToLocalStorage();
      }
    }

    //loads Missions data from localstorage
    function loadMissions() {
      console.log("Loading Saved Missions Data");
      saveNumOfVisitors();
      let missionsInLocalStorage = localStorage?.getItem(
        localStorageMissionsName
      );
      if (missionsInLocalStorage) {
        missionsData = JSON.parse(missionsInLocalStorage);
      }
    }

    firstTimeMissionDataSetup();
    loadMissions();

    // updates if a mission is finished or not and updates localstorage
    function updateMissionData(missionName, missionId) {
      missionsData[missionId] = {
        name: missionName,
        finished: !missionsData[missionId].finished,
      };
      saveMissionDataToLocalStorage();
      let interactedWithSite = localStorage?.getItem(
        localStorageUserInteractedWithSite
      );
      // small counter to check how many people have used the tool
      if (!interactedWithSite) {
        localStorage.setItem(
          localStorageUserInteractedWithSite,
          JSON.stringify(true)
        );
        saveNumOfUsersThatInteractedWithSite();

      }
    }

    return {
      missionsData,
      saveMissionDataToLocalStorage,
      updateMissionData,
      saveNumOfUsersThatInteractedWithSite,
    };
  },
};
</script>

<template>
  <main>
    <div class="headerText text text-center mx-auto p-3">
      Small tool made with vue by Ali Villegas 2022
      <a class="link text-blue-600" href="https://github.com/AliVillegas/Moon-Mission-Meister"
        target="_blank">github:</a>
      <br />
      * no personal data is collected and the site is 100% open source <br />
      <br />
      <div class="text-center mx-auto my-2">
        This page was inspired by the steam guide from LUST
        <a class="link text-blue-600"
          href="https://steamcommunity.com/sharedfiles/filedetails/?id=2032946684&insideModal=0"
          target="_blank">STEAM:</a>
      </div>
      <br />* if you like my work consider any small contribution at
      <a class="link text-blue-600" href="https://paypal.me/AliBryan" target="_blank">paypal</a>
      :D
    </div>

    <div class="subSectionDesc my-12">
      <span class="text-xl md:text-4xl block mx-auto text-center mb-3">Moon-Mission-Meister achievement tracker for
        Borderlands the pre
        sequel</span>
      <span class="block mx-auto text-center my-3">
        just click on the checkbox to mark the side mission as completed. Data
        is saved only locally even if you close the tab.
      </span>
      <div class="table mx-auto bb_table w-11/12 md:w-8/12 border-0">
        <div class="bb_table_tr">
          <div class="bb_table_th">#</div>
          <div class="bb_table_th">Main Missions</div>
          <div class="bb_table_th">Side-Missions</div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">1</div>
          <div class="bb_table_td">Welcome to Helios</div>
          <div class="bb_table_td"></div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">2</div>
          <div class="bb_table_td">Lost Legion Invasion</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="0"
              :mission-name="missionsData[0].name" :enabled="missionsData[0].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="1"
              :mission-name="missionsData[1].name" :enabled="missionsData[1].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="2"
              :mission-name="missionsData[2].name" :enabled="missionsData[2].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="3"
              :mission-name="missionsData[3].name" :enabled="missionsData[3].finished"></Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">3</div>
          <div class="bb_table_td">Marooned</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="4"
              :mission-name="missionsData[4].name" :enabled="missionsData[4].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="5"
              :mission-name="missionsData[5].name" :enabled="missionsData[5].finished"></Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">4</div>
          <div class="bb_table_td">Systems Jammed</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="6"
              :mission-name="missionsData[6].name" :enabled="missionsData[6].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="7"
              :mission-name="missionsData[7].name" :enabled="missionsData[7].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="8"
              :mission-name="missionsData[8].name" :enabled="missionsData[8].finished"></Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="9"
              :mission-name="missionsData[9].name" :enabled="missionsData[9].finished"></Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">5</div>
          <div class="bb_table_td">A New Direction</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="10"
              :mission-name="missionsData[10].name" :enabled="missionsData[10].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="11"
              :mission-name="missionsData[11].name" :enabled="missionsData[11].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="12"
              :mission-name="missionsData[12].name" :enabled="missionsData[12].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="13"
              :mission-name="missionsData[13].name" :enabled="missionsData[13].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="14"
              :mission-name="missionsData[14].name" :enabled="missionsData[14].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="15"
              :mission-name="missionsData[15].name" :enabled="missionsData[15].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="16"
              :mission-name="missionsData[16].name" :enabled="missionsData[16].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="17"
              :mission-name="missionsData[17].name" :enabled="missionsData[17].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="18"
              :mission-name="missionsData[18].name" :enabled="missionsData[18].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">6</div>
          <div class="bb_table_td">
            Intelligences of the Artificial Persuasion
          </div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="19"
              :mission-name="missionsData[19].name" :enabled="missionsData[19].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="20"
              :mission-name="missionsData[20].name" :enabled="missionsData[20].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="21"
              :mission-name="missionsData[21].name" :enabled="missionsData[21].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="22"
              :mission-name="missionsData[22].name" :enabled="missionsData[22].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="23"
              :mission-name="missionsData[23].name" :enabled="missionsData[23].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="24"
              :mission-name="missionsData[24].name" :enabled="missionsData[24].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="25"
              :mission-name="missionsData[25].name" :enabled="missionsData[25].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="26"
              :mission-name="missionsData[26].name" :enabled="missionsData[26].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">7</div>
          <div class="bb_table_td">Let's Build a Robot Army</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="27"
              :mission-name="missionsData[27].name" :enabled="missionsData[27].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="28"
              :mission-name="missionsData[28].name" :enabled="missionsData[28].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="29"
              :mission-name="missionsData[29].name" :enabled="missionsData[29].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">8</div>
          <div class="bb_table_td">Home Sweet Home</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="30"
              :mission-name="missionsData[30].name" :enabled="missionsData[30].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="31"
              :mission-name="missionsData[31].name" :enabled="missionsData[31].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="32"
              :mission-name="missionsData[32].name" :enabled="missionsData[32].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="33"
              :mission-name="missionsData[33].name" :enabled="missionsData[33].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="34"
              :mission-name="missionsData[34].name" :enabled="missionsData[34].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="35"
              :mission-name="missionsData[35].name" :enabled="missionsData[35].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="36"
              :mission-name="missionsData[36].name" :enabled="missionsData[36].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">9</div>
          <div class="bb_table_td">Science and Violence</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="37"
              :mission-name="missionsData[37].name" :enabled="missionsData[37].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="38"
              :mission-name="missionsData[38].name" :enabled="missionsData[38].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="39"
              :mission-name="missionsData[39].name" :enabled="missionsData[39].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="40"
              :mission-name="missionsData[40].name" :enabled="missionsData[40].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="41"
              :mission-name="missionsData[41].name" :enabled="missionsData[41].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">10</div>
          <div class="bb_table_td">Watch Your Step</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="42"
              :mission-name="missionsData[42].name" :enabled="missionsData[42].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="43"
              :mission-name="missionsData[43].name" :enabled="missionsData[43].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="44"
              :mission-name="missionsData[44].name" :enabled="missionsData[44].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="45"
              :mission-name="missionsData[45].name" :enabled="missionsData[45].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="46"
              :mission-name="missionsData[46].name" :enabled="missionsData[46].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="47"
              :mission-name="missionsData[47].name" :enabled="missionsData[47].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="48"
              :mission-name="missionsData[48].name" :enabled="missionsData[48].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="49"
              :mission-name="missionsData[49].name" :enabled="missionsData[49].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="50"
              :mission-name="missionsData[50].name" :enabled="missionsData[50].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="51"
              :mission-name="missionsData[51].name" :enabled="missionsData[51].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">11</div>
          <div class="bb_table_td">Eye to Eye</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="52"
              :mission-name="missionsData[52].name" :enabled="missionsData[52].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="53"
              :mission-name="missionsData[53].name" :enabled="missionsData[53].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="54"
              :mission-name="missionsData[54].name" :enabled="missionsData[54].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="55"
              :mission-name="missionsData[55].name" :enabled="missionsData[55].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="56"
              :mission-name="missionsData[56].name" :enabled="missionsData[56].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="57"
              :mission-name="missionsData[57].name" :enabled="missionsData[57].finished">
            </Mission>
          </div>
        </div>
        <div class="bb_table_tr">
          <div class="bb_table_td">12</div>
          <div class="bb_table_td">The Beginning of the End</div>
          <div class="bb_table_td">
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="58"
              :mission-name="missionsData[58].name" :enabled="missionsData[58].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="59"
              :mission-name="missionsData[59].name" :enabled="missionsData[59].finished">
            </Mission>
            <Mission @updateMission="(name, id) => updateMissionData(name, id)" :mission-id="60"
              :mission-name="missionsData[60].name" :enabled="missionsData[60].finished">
            </Mission>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
