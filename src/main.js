import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import {
  wrapDocument,
  signDocument,
  SUPPORTED_SIGNING_ALGORITHM,
} from "@govtechsg/open-attestation";
import { deployAndWait, connect, issue } from "@govtechsg/document-store";
import { ethers } from "ethers";
import "../styles/site.scss";

Vue.config.productionTip = false;
Vue.prototype.$openAttestation = {
  wrapDocument,
  signDocument,
  deployAndWait,
  connect,
  issue,
  SUPPORTED_SIGNING_ALGORITHM,
};
Vue.prototype.$wrapDocument = wrapDocument;
Vue.prototype.$ethers = ethers;

Vue.use(Buefy);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
