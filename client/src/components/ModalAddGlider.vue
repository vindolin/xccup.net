<!-- TODO: It may be possible to replace this modal with BaseModal and slots -->
<template>
  <div
    id="addGliderModal"
    ref="_modal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="addAircraftModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="addAircraftModalLabel" class="modal-title">
            Fluggerät hinzufügen
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <BaseSelect
            id="brand-select"
            v-model="newGlider.brand"
            :options="brands"
            label="Hersteller"
          />
          <div class="mb-3"></div>
          <BaseInput
            id="glider-name"
            v-model="newGlider.model"
            label="Fluggerät"
          />

          <select
            id="ranking-class-select"
            v-model="newGlider.gliderClass"
            class="form-select"
          >
            <option disabled value selected>Geräteklasse</option>
            <option
              v-for="(gliderClass, classKey) in gliderClasses"
              :key="classKey"
              :value="classKey"
            >
              {{ gliderClass.description }}
            </option>
          </select>
        </div>
        <div class="modal-footer">
          <BaseError id="loginErrorMessage" :error-message="errorMessage" />

          <button
            type="button"
            class="btn btn-primary"
            :disabled="!saveButtonIsEnabled"
            data-cy="save-new-glider-button"
            @click="onAddGlider"
          >
            Speichern
            <BaseSpinner v-if="showSpinner" />
          </button>
          <button
            type="button"
            class="btn btn-outline-danger"
            data-bs-dismiss="modal"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ApiService from "@/services/ApiService.js";
import { ref, computed, reactive, onMounted } from "vue";
import { Modal } from "bootstrap";

const emit = defineEmits(["add-glider"]);

defineProps({
  showSpinner: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: [String, null],
    default: null,
  },
});

const _modal = ref(null);
const modal = ref(null);
onMounted(() => {
  modal.value = new Modal(_modal.value);
});

const show = () => modal.value.show();
const hide = () => modal.value.hide();

defineExpose({ show, hide });

const newGlider = reactive({
  brand: "",
  model: "",
  gliderClass: "",
});

// Fetch data

const brands = ref(null);
const gliderClasses = ref(null);

try {
  [brands.value, gliderClasses.value] = (
    await Promise.all([ApiService.getBrands(), ApiService.getGliderClasses()])
  ).map(({ data }) => data);
} catch (error) {
  console.log(error);
}

const saveButtonIsEnabled = computed(() => {
  return (
    (newGlider.model.length > 2) &
    (newGlider.brand != "") &
    (newGlider.gliderClass != "")
  );
});

const onAddGlider = () => {
  emit("add-glider", newGlider);
};
</script>
