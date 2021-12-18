<template>
  <div id="userListView" class="container">
    <h3>Registrierte Piloten</h3>
    <div class="row">
      <div class="col-6">
        <FilterPanel view-component-name="Users" @show-filter="showFilter" />
      </div>
      <div class="col-6">
        <PaginationPanel view-component-name="Users" entry-name="Piloten" />
      </div>
    </div>
    <BaseError :error-message="errorMessage" />
    <div v-for="user in users" :key="user.id" class="card mb-3">
      <UserCard :user="user" @open-message-dialog="messageUser" />
    </div>
  </div>
  <ModalSendMail :modal-id="mailModalId" :user="selectedUser" />
  <ModalFilterUsers />
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue";
import ApiService from "@/services/ApiService";
import { setWindowName } from "../helper/utils";
import { Modal } from "bootstrap";
import useData from "../composables/useDataView";
import { useRoute } from "vue-router";
import BaseError from "../components/BaseError.vue";

const router = useRoute();
const { fetchData, data: users, errorMessage } = useData("Users");

const mailModalId = ref("userMailModal");
const selectedUser = ref(null);

setWindowName("Registrierte Piloten");

let filterModal;
let mailModal;
onMounted(() => {
  mailModal = new Modal(document.getElementById(mailModalId.value));
  filterModal = new Modal(document.getElementById("userFilterModal"));
});

const messageUser = (user) => {
  selectedUser.value = user;
  mailModal.show();
};

watchEffect(() => {
  fetchData(ApiService.getUsers, {
    params: { records: true },
    queries: router.query,
  });
});

const showFilter = () => {
  filterModal.show();
};
</script>
