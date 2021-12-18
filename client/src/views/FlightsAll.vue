<template>
  <div class="container-lg mb-3">
    <h3>Streckenmeldungen {{ route.params.year }}</h3>
    <!-- TODO: Add filter spinner when loading -->

    <div class="row">
      <div class="col-6">
        <FilterPanel
          :view-component-name="componentName"
          @show-filter="showFilter"
        />
      </div>
      <div class="col-6">
        <PaginationPanel
          :view-component-name="componentName"
          entry-name="Flüge"
        />
      </div>
    </div>
    <BaseError :error-message="errorMessage" />
    <ResultsTableOverall :view-component-name="componentName" />
    <ModalFilterFlights :view-component-name="componentName" />
  </div>
</template>

<script setup>
import ApiService from "@/services/ApiService";
import { onMounted, watchEffect } from "vue";
import { setWindowName } from "../helper/utils";
import { Modal } from "bootstrap";
import useData from "@/composables/useDataView";
import { useRoute } from "vue-router";

setWindowName("Streckenmeldungen");

const route = useRoute();

const componentName = route.params.year ? "FlightsAllYear" : "FlightsAll";

console.log("CN: ", componentName);

const { fetchData, errorMessage } = useData(componentName);

watchEffect(() => {
  fetchData(ApiService.getFlights, {
    params: route.params,
    queries: route.query,
  });
});

let filterModal;
onMounted(() => {
  filterModal = new Modal(document.getElementById("flightFilterModal"));
});

const showFilter = () => {
  filterModal.show();
};
</script>
