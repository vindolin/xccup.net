<template>
  <div class="container">
    <div v-if="sponsors">
      <!-- TODO: Shall the year be named? -->
      <h3>Sponsoren des Jahres {{ new Date().getFullYear() }}</h3>
      <div v-if="sponsors?.length > 0" class="row gy-5 gx-5">
        <div
          v-for="sponsor in sponsors"
          :key="sponsor.id"
          class="col-xl-6 col-md-12"
        >
          <SponsorCard :sponsor="sponsor" />
        </div>
      </div>
      <div v-else>Leider haben wir keine Sponsoren für dieses Jahr.</div>
    </div>
    <GenericError v-else />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ApiService from "@/services/ApiService";
import { shuffle } from "lodash";
import { setWindowName } from "../helper/utils";

const sponsors = ref([]);

setWindowName("Sponsoren");

try {
  const res = await ApiService.getSponsors();
  if (res.status != 200) throw res.status.text;

  //Shuffle all entries but sort goldsponsors to the front
  const shuffledData = shuffle(res.data).sort((a, b) => {
    if (a.isGoldSponsor && !b.isGoldSponsor) return -1;
    if (!a.isGoldSponsor && b.isGoldSponsor) return 1;
    return 0;
  });

  sponsors.value = shuffledData;
} catch (error) {
  console.error(error);
}
</script>
