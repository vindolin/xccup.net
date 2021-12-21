<template>
  <div class="container mt-3">
    <!-- Editor -->
    <div class="row">
      <!-- Profile Picture -->
      <div class="col-lg-3">
        <div class="d-flex flex-column align-items-center text-center p-3">
          <img class="rounded-circle" :src="avatarUrl" />
          <div class="row">
            <i
              class="col bi bi-pencil text-primary clickable"
              @click.prevent="onEditAvatar"
            ></i>
          </div>
          <!-- TODO: Maybe use these elements to show some addtional data above the profil -->
          <!-- <span class="font-weight-bold">A nice fact</span>
          <span class="text-secondary">or two about the user</span> -->
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="col-lg-9">
        <nav>
          <div id="nav-tab" class="nav nav-tabs" role="tablist">
            <button
              id="nav-profile-tab"
              class="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#nav-profile"
              type="button"
              role="tab"
              aria-controls="nav-profile"
              aria-selected="true"
            >
              Profil
            </button>

            <button
              id="nav-hangar-tab"
              ref="navHangarTab"
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#nav-hangar"
              type="button"
              role="tab"
              aria-controls="nav-hangar"
              aria-selected="false"
            >
              <router-link :to="{ name: 'ProfileHangar' }">
                Hangar
              </router-link>
            </button>

            <router-link :to="{ name: 'ProfilePassword' }">
              <button
                id="nav-change-pw-tab"
                ref="navPasswordTab"
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#nav-change-pw"
                type="button"
                role="tab"
                aria-controls="nav-change-pw"
                aria-selected="false"
              >
                Passwort ändern
              </button>
            </router-link>
            <button
              id="nav-my-flights-tab"
              class="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#nav-my-flights"
              type="button"
              role="tab"
              aria-controls="nav-my-flights"
              aria-selected="false"
            >
              Meine Flüge
            </button>
          </div>
        </nav>
        <!-- Tab content -->
        <div id="nav-tabContent" class="tab-content">
          <div
            id="nav-profile"
            class="tab-pane fade show active"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <UserProfileDetails />
          </div>
          <div
            id="nav-hangar"
            class="tab-pane fade"
            role="tabpanel"
            aria-labelledby="nav-hangar-tab"
          >
            <div id="glider-select" class="col-md-12 mb-4">
              <UserProfileGliderlist />
            </div>
          </div>
          <div
            id="nav-change-pw"
            class="tab-pane fade"
            role="tabpanel"
            aria-labelledby="nav-change-pw"
          >
            <UserProfileChangePassword />
          </div>
          <div
            id="nav-my-flights"
            class="tab-pane fade"
            role="tabpanel"
            aria-labelledby="nav-my-flights-tab"
          >
            <UserProfileMyFlights />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalUserAvatar :avatar-url="avatarUrl" @avatar-changed="updateAvatar" />
</template>
<script setup>
import { setWindowName } from "../helper/utils";
import useUserProfile from "@/composables/useUserProfile";
import { onMounted, ref, computed } from "vue";
import { Tab } from "bootstrap";
import { getUserAvatar } from "../helper/profilePictureHelper";
import ModalUserAvatar from "../components/ModalUserAvatar.vue";
import { Modal } from "bootstrap";
import UserProfileChangePassword from "../components/UserProfileChangePassword.vue";
import UserProfileMyFlights from "../components/UserProfileMyFlights.vue";

setWindowName("Profil");

// TODO: Remember the opened tab when navigating back to profile

const props = defineProps({
  tab: {
    type: [String, null],
    default: null,
  },
});

// TODO: Warn user if there are unsaved changes --> Use "beforeRouteLeave lifecycle hook"
const { fetchProfile, userData } = useUserProfile();

fetchProfile();

const editAvatarModal = ref(null);
const navHangarTab = ref(null);
const navPasswordTab = ref(null);
onMounted(() => {
  editAvatarModal.value = new Modal(document.getElementById("userAvatarModal"));
  // Navigate to hangar tab via props
  let hangarTab = new Tab(navHangarTab.value);
  let passwordTab = new Tab(navPasswordTab.value);
  // let passwordTab = new Tab(document.querySelector("#nav-hangar"));
  console.log(props);
  if (props.tab === "hangar") hangarTab.show();
  if (props.tab === "password") passwordTab.show();

  // if (route.params.tab == "change-password") passwordTab.show();
  // if (route.params.tab == "my-flights") myFlightsTab.show();
});

const avatarUrl = computed(() => getUserAvatar(userData.value, true));

const onEditAvatar = () => {
  editAvatarModal.value.show();
};

const updateAvatar = () => {
  editAvatarModal.value.hide();
  fetchProfile();
};
</script>

<style scoped>
img {
  width: 150px;
}
</style>
