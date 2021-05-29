<template>
  <main id="app">
    <section class="section">
      <div class="container">
        <b-button @click="connectWallet">Connect wallet</b-button>
        <p>Your wallet: {{ account }}</p>
        <br /><br />

        <p>
          Default Document Store {{ documentStoreName }}
          {{ defaultDocumentStoreAddress }}
        </p>
        <br /><br />

        <b-input v-model="deployDocumentStoreName"></b-input>
        <b-button @click="deployDocumentStore">Deploy Document Store</b-button>
        <br /><br />

        <div>
          <span>Raw Document</span>
          <b-button @click="wrapDocument">Wrap document</b-button>
        </div>
        <pre>{{ JSON.stringify(document, undefined, 2) }}</pre>
        <div>
          <span>Wrapped Document</span>
          <!-- <b-button @click="signDocument">Sign document</b-button> -->
          <b-button @click="issueDocument">Issue document</b-button>
        </div>
        <pre>{{ JSON.stringify(wrappedDocument, undefined, 2) }}</pre>
        <!-- <div>
          <span>Signed Document</span>
        </div>
        <pre>{{ JSON.stringify(signedDocument, undefined, 2) }}</pre> -->
        <p v-if="issueReceipt != null">{{ issueReceipt.transactionHash }}</p>
      </div>
    </section>
    <b-loading v-model="isLoading"></b-loading>
  </main>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isLoading: false,

      account: null,
      provider: null,
      defaultDocumentStoreAddress: "0xC6d7154Ef278027870AE5b4e4039cBc249162d0f",
      documentStoreName: "",
      deployDocumentStoreName: "",
      documentStore: null,
      wrappedDocument: null,
      signedDocument: null,
      issueDocumentTxId: "null",
      issueTx: null,
      issueReceipt: null,

      document: {
        issuers: [
          {
            // name: "University of Blockchain",
            identityProof: {
              type: "DNS-TXT",
              location: "grand-plum-pheasant.sandbox.openattestation.com",
            },
          },
        ],
      },
    };
  },
  async mounted() {
    this.provider = new this.$ethers.providers.Web3Provider(window.ethereum);

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) return;

    this.account = accounts[0];
    await this.getDefaultDocumentStore();

    this.$set(
      this.document.issuers[0],
      "documentStore",
      this.documentStore.address
    );
    this.$set(this.document.issuers[0], "name", this.documentStoreName);
  },
  methods: {
    async connectWallet() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      this.account = accounts[0];

      this.getDefaultDocumentStore();
    },

    async getDefaultDocumentStore() {
      this.isLoading = true;
      this.documentStore = await this.$openAttestation.connect(
        this.defaultDocumentStoreAddress,
        this.provider.getSigner()
      );
      this.documentStoreName = await this.documentStore.name();
      this.isLoading = false;
    },

    async deployDocumentStore() {
      this.documentStore = await this.$openAttestation.deployAndWait(
        this.deployDocumentStoreName,
        this.provider.getSigner()
      );
      console.log(this.documentStore);
    },

    wrapDocument() {
      this.wrappedDocument = this.$openAttestation.wrapDocument(this.document);
    },

    // async signDocument() {
    //   this.signedDocument = await this.$openAttestation.signDocument(
    //     this.wrappedDocument,
    //     this.$openAttestation.SUPPORTED_SIGNING_ALGORITHM
    //       .Secp256k1VerificationKey2018,
    //     this.provider.getSigner()
    //   );
    // },

    async issueDocument() {
      this.isLoading = true;
      const prependedMerkleRoot = `0x${this.wrappedDocument.signature.merkleRoot}`;
      const tx = await this.documentStore.issue(prependedMerkleRoot);
      this.isLoading = false;
      this.issueTx = tx;
      this.issueReceipt = await tx.wait();
      console.log(this.issueReceipt);

      const isIssued = await this.documentStore.isIssued(prependedMerkleRoot);
      console.log(isIssued);
    },
  },
};
</script>

<style></style>
