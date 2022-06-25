<template>
  <b-container fluid="xl">
    <b-row>
      <b-col>
        <b-button class="button" variant="primary" @click="createNewPartList()">
          {{ labelNewPartLists }}
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <label class="custom-favorite-label">
        <b-icon icon="heart-fill" aria-hidden="true" variant="danger" />
        <span style="margin-left: 3px">
          {{ labelFavorites }} ({{ favorites.length }})
        </span>
        <b-link @click="editFavorites()">
          <b-icon icon="pencil" variant="primary" />
        </b-link>
        <b-link @click="showFavorites()" v-if="!favoriteSelected">
          <b-icon icon="eye-slash" variant="secondary" aria-hidden="true" />
        </b-link>
        <b-link @click="hideFavorite()" v-else>
          <b-icon icon="eye" aria-hidden="true" />
        </b-link>
      </label>
    </b-row>
    <b-row class="mt-0">
      <label class="custom-favorite-label">
        <b-icon icon="check-circle-fill" aria-hidden="true" variant="success" />
        <span style="margin-left: 3px">
          {{ labelHaveIts }} ({{ haveIts.length }})
        </span>
        <b-link @click="editHaveIts()">
          <b-icon icon="pencil" variant="primary" />
        </b-link>
        <b-link @click="showHaveIts()" v-if="!haveItSelected">
          <b-icon icon="eye-slash" variant="secondary" aria-hidden="true" />
        </b-link>
        <b-link @click="hideHaveIt()" v-else>
          <b-icon icon="eye" aria-hidden="true" />
        </b-link>
      </label>
    </b-row>
    <!-- <b-row class="mt-0">
      <label class="custom-favorite-label">
        <font-awesome-icon
          :icon="['fab', 'telegram-plane']"
          style="height: 16px; width: 16px; color: #0088CC"
        />
        <span style="margin-left: 3px">
          {{ labelNotifications }} ({{
            $store.state.singleParts.notificationItemNumbers.length
          }}/{{ $store.state.singleParts.notificationDesignIds.length }})
        </span>
        <b-link @click="editNotifications()">
          <b-icon icon="pencil" variant="primary" />
        </b-link>
        <b-link @click="showNotifications()" v-if="!notificationSelected">
          <b-icon icon="eye-slash" variant="secondary" aria-hidden="true" />
        </b-link>
        <b-link @click="hideNotifications()" v-else>
          <b-icon icon="eye" aria-hidden="true" />
        </b-link>
      </label>
    </b-row> -->
    <b-row class="mt-0">
      <b-form-group>
        <b-form-radio
          v-for="partList in partLists"
          :key="partList.id"
          v-model="selectedPartListId"
          name="some-radios"
          :value="partList.id"
        >
          {{ partList.name }} ({{ partList.positions.length }})
          <b-link
            @click="showPartList(partList.id)"
            v-if="showPartListId != partList.id"
          >
            <b-icon icon="eye-slash" variant="secondary" aria-hidden="true" />
          </b-link>
          <b-link @click="hidePartList(partList.id)" v-else>
            <b-icon icon="eye" aria-hidden="true" />
          </b-link>
        </b-form-radio>
      </b-form-group>
    </b-row>
    <b-modal
      id="editList"
      ref="editList"
      :title="labelEditListHeader"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      centered
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      @ok="okEditList"
      @cancel="cancleEditList"
    >
      <p class="my-4">
        <b-form-textarea v-model="editListContent" rows="6" max-rows="6" />
      </p>
    </b-modal>
    <b-modal
      id="editListNotification"
      ref="editListNotification"
      :title="labelEditListHeader"
      :header-bg-variant="headerBgVariant"
      :header-text-variant="headerTextVariant"
      centered
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      @ok="okEditNotificationList"
      @cancel="cancleEditNotificationList"
    >
      <p class="my-4">
        {{ labelChatId }}
        <b-icon
          id="chatIdInfo"
          icon="info-circle-fill"
          aria-hidden="true"
          variant="primary"
        />
        <b-tooltip target="chatIdInfo" triggers="hover">
          {{ labelNotificationExplanationBeforeLink }}<a href="https://t.me/BrickHunterBot" target="_blank">t.me/BrickHunterBot</a>{{ labelNotificationExplanationAfterLink }}
        </b-tooltip>
        <b-form-input v-model="notificationChatId" :state="chatIdValid" />
      </p>
      <p class="my-4">
        {{ labelElement }}
        <b-form-textarea
          v-model="notificationItemNumbers"
          rows="4"
          max-rows="4"
        />
      </p>
      <p class="my-4">
        {{ labelDesignNumber }}
        <b-form-textarea
          v-model="notificationDesignIds"
          rows="4"
          max-rows="4"
        />
      </p>
    </b-modal>
  </b-container>
</template>

<style scoped>
.custom-favorite-label {
  margin-bottom: 0;
}
</style>

<script>
import { bus } from "@/utility/bus";
import apiBrickTwo from "@/utility/api/bricktwo.js";

export default {
  data: () => ({
    partLists: null,
    selectedPartListId: null,
    showPartListId: null,
    favorites: null,
    favoriteSelected: false,
    haveIts: null,
    haveItSelected: false,
    notifications: null,
    notificationSelected: false,
    headerBgVariant: "dark",
    headerTextVariant: "light",
    labelEditListHeader: "",
    editListContent: "",
    editMode: "",
    chatIdValid: false,
    notificationChatId: null,
    notificationDesignIds: [],
    notificationItemNumbers: [],
  }),
  methods: {
    createNewPartList() {
      /*var name = 'Einzelteilliste';
            var count = this.partLists.filter((list) => list.name == name)
                .length;
                
            if (count > 0) {
                name = name + ' ' + (count + 1);
            }*/

      var newPartList = {
        id: this.generateUUID(),
        name: this.labelSinglePartList,
        cart: true,
        date: new Date(0, 0, 0, 0, 0, 0, 0),
        source: "singleParts",
        positions: [],
        version: "1.0",
      };

      this.partLists.push(newPartList);
      this.$store.commit("partList/setPartList", newPartList);
      this.sortPartList();
    },
    generateUUID() {
      // Public Domain/MIT
      var d = new Date().getTime();
      if (
        typeof performance !== "undefined" &&
        typeof performance.now === "function"
      ) {
        d += performance.now(); //use high-precision timer if available
      }
      var newGuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );

      return newGuid;
    },
    sortPartList() {
      this.partLists.sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1;
        } else {
          return -1;
        }
      });
    },
    showPartList(id) {
      this.favoriteSelected = false;
      this.haveItSelected = false;
      this.notificationSelected = false;
      this.showPartListId = id;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    hidePartList(id) {
      this.showPartListId = null;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    showFavorites() {
      this.favoriteSelected = true;
      this.haveItSelected = false;
      this.notificationSelected = false;
      this.showPartListId = null;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    hideFavorite() {
      this.favoriteSelected = false;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    showHaveIts() {
      this.favoriteSelected = false;
      this.haveItSelected = true;
      this.notificationSelected = false;
      this.showPartListId = null;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    hideHaveIt() {
      this.haveItSelected = false;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    showNotifications() {
      this.favoriteSelected = false;
      this.haveItSelected = false;
      this.notificationSelected = true;
      this.showPartListId = null;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    hideNotifications() {
      this.notificationSelected = false;
      bus.$emit(
        "showPartList",
        this.showPartListId,
        this.favoriteSelected,
        this.haveItSelected,
        this.notificationSelected
      );
    },
    editFavorites() {
      this.editMode = "favorites";
      this.labelEditListHeader = this.labelFavorites;
      this.editListContent = this.prepareEditList(
        this.$store.state.singleParts.favorites
      );
      this.$refs["editList"].show();
    },
    editHaveIts() {
      this.editMode = "haveIts";
      this.labelEditListHeader = this.labelHaveIts;
      this.editListContent = this.prepareEditList(
        this.$store.state.singleParts.haveIts
      );
      this.$refs["editList"].show();
    },
    editNotifications() {
      this.editMode = "notifications";
      this.labelEditListHeader = this.labelNotifications;
      this.notificationDesignIds = this.prepareEditList(
        this.$store.state.singleParts.notificationDesignIds
      );
      this.notificationItemNumbers = this.prepareEditList(
        this.$store.state.singleParts.notificationItemNumbers
      );
      this.$refs["editListNotification"].show();
    },
    prepareEditList(content) {
      content = JSON.stringify(content);
      content = content.slice(1); // remove first char
      content = content.slice(0, -1); // remove last char
      return content;
    },
    okEditList() {
      let content = "[" + this.editListContent + "]";
      try {
        content = JSON.parse(content);
      } catch (err) {
        console.log(err);
        return;
      }

      if (this.editMode == "favorites") {
        this.$store.commit("singleParts/setFavorites", content);
        this.favorites = this.$store.state.singleParts.favorites;
      } else if (this.editMode == "haveIts") {
        this.$store.commit("singleParts/setHaveIts", content);
        this.haveIts = this.$store.state.singleParts.haveIts;
      }

      if (this.favoriteSelected) {
        this.showFavorites();
      } else if (this.haveItSelected) {
        this.showHaveIts();
      } else {
        bus.$emit(
          "showPartList",
          this.showPartListId,
          this.favoriteSelected,
          this.haveItSelected
        );
      }
    },
    cancleEditList() {},
    okEditNotificationList() {
      let notificationDesignIds = "[" + this.notificationDesignIds + "]";
      let notificationItemNumbers = "[" + this.notificationItemNumbers + "]";
      try {
        notificationDesignIds = JSON.parse(notificationDesignIds);
        notificationItemNumbers = JSON.parse(notificationItemNumbers);
      } catch (err) {
        console.log(err);
        return;
      }

      this.$store.commit(
        "singleParts/setNotificationChatId",
        this.notificationChatId
      );

      this.$store.commit(
        "singleParts/setNotificationDesignId",
        notificationDesignIds
      );
      this.$store.commit(
        "singleParts/setNotificationItemNumber",
        notificationItemNumbers
      );
      //this.favorites = this.$store.state.singleParts.favorites;

      if (this.notificationSelected) {
        this.showNotifications();
      } else {
        bus.$emit(
          "showPartList",
          this.showPartListId,
          this.favoriteSelected,
          this.haveItSelected,
          this.notificationSelected
        );
      }
    },
    cancleEditNotificationList() {
      this.notificationChatId = this.$store.state.singleParts.notificationChatId;

      this.notificationDesignIds = "";
      this.notificationItemNumbers = "";

      apiBrickTwo.getSubscriptions(this.notificationChatId).then((result) => {
        this.chatIdValid = false;

        if (result) this.chatIdValid = true;

        if (result.DesignId) {
          result.DesignId.forEach((d) => {
            if (this.notificationDesignIds) this.notificationDesignIds += ",";
            this.notificationDesignIds += d;
          });
          //this.$store.commit('singleParts/setNotificationDesignId', result.DesignId);
        }

        if (result.ItemNumber) {
          result.ItemNumber.forEach((i) => {
            if (this.notificationItemNumbers)
              this.notificationItemNumbers += ",";
            this.notificationItemNumbers += i;
          });
          //this.$store.commit('singleParts/setNotificationItemNumber', result.ItemNumber);
        }
      });
    },
  },
  beforeMount() {
    this.partLists = this.$store.getters["partList/getPartListsBySource"](
      "singleParts"
    );
    this.favorites = this.$store.state.singleParts.favorites;
    this.haveIts = this.$store.state.singleParts.haveIts;
    let filter = this.$store.state.singleParts.filter;
    this.notificationChatId = this.$store.state.singleParts.notificationChatId;

    this.showPartListId = filter.showPartListId;
    this.favoriteSelected = filter.showFavorites;
    this.haveItSelected = filter.showHaveIts;
    this.notificationSelected = filter.showNotifications;

    if (!this.partLists.find((f) => f.id == this.showPartListId))
      this.showPartListId = null;

    this.sortPartList();

    if (this.partLists.length) {
      this.selectedPartListId = this.partLists[0].id;
    }
  },
  created() {
    bus.$on("newSinglePartList", (data) => {
      this.partLists = this.$store.getters["partList/getPartListsBySource"](
        "singleParts"
      );
      this.selectedPartListId = this.partLists[0].id;
      this.sortPartList();
    });
  },
  beforeDestroy() {
    bus.$off();
  },
  watch: {
    selectedPartListId: function() {
      //this.$emit('partListActive', this.selectedPartListId);
      bus.$emit("selectedPartList", this.selectedPartListId);
    },
    notificationChatId: function(value) {
      //this.$store.commit('singleParts/setNotificationChatId', value);

      this.notificationDesignIds = "";
      this.notificationItemNumbers = "";

      apiBrickTwo.getSubscriptions(value).then((result) => {
        this.chatIdValid = false;

        if (result) this.chatIdValid = true;

        if (result.DesignId) {
          result.DesignId.forEach((d) => {
            if (this.notificationDesignIds) this.notificationDesignIds += ",";
            this.notificationDesignIds += d;
          });
          //this.$store.commit('singleParts/setNotificationDesignId', result.DesignId);
        }

        if (result.ItemNumber) {
          result.ItemNumber.forEach((i) => {
            if (this.notificationItemNumbers)
              this.notificationItemNumbers += ",";
            this.notificationItemNumbers += i;
          });
          //this.$store.commit('singleParts/setNotificationItemNumber', result.ItemNumber);
        }
      });
    },
  },
  computed: {
    labelNewPartLists() {
      return browser.i18n.getMessage("import_sp_newPartList");
    },
    labelSinglePartList() {
      return browser.i18n.getMessage("import_sp_singlePartList");
    },
    labelFavorites() {
      return browser.i18n.getMessage("import_sp_favorites");
    },
    labelHaveIts() {
      return browser.i18n.getMessage("import_sp_haveIt");
    },
    labelNotifications() {
      return browser.i18n.getMessage("import_sp_notification");
    },
    labelChatId() {
      return browser.i18n.getMessage("import_sp_notificationChatId");
    },
    labelElement() {
      return browser.i18n.getMessage("import_sp_element");
    },
    labelDesignNumber() {
      return browser.i18n.getMessage("import_sp_designNumber");
    },
    labelNotificationExplanationBeforeLink() {
      return browser.i18n.getMessage("import_sp_notificationExplanationBeforeLink");
    },
    labelNotificationExplanationAfterLink() {
      return browser.i18n.getMessage("import_sp_notificationExplanationAfterLink");
    },
  },
};
</script>
