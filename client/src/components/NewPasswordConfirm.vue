<template>
  <div v-if="!errorMessage" class="mb-4">
    <!-- TODO: Change this text as it sounds a little stiff -->
    Das Rücksetzen Deines Passwortes wurde bestätigt. Wird senden Dir in kürze
    ein neues Passwort zu 📯
  </div>
  <BaseError
    v-else
    id="loginErrorMessage"
    :error-message="errorMessage"
    class="mb-4"
  />
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import ApiService from "../services/ApiService";

const router = useRoute();
const { userId, token } = router.query;

const errorMessage = ref("");

if (!userId || !token) {
  errorMessage.value = "Dein Link scheint unvollständig zu sein 🤨";
} else {
  try {
    const res = await ApiService.confirmNewPassword(userId, token);
    if (res.status != 200) throw res.statusText;
  } catch (error) {
    errorMessage.value = `Dein Bestätigungslink ist ungültig 🤨`;
  }
}
</script>
