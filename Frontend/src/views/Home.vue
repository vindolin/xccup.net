<template>
  <Infobox />
  <DailyRanking :maxRows="5" />
  <OverallResults />
  <Sponsors />
</template>

<script>
import { defineComponent } from "vue";
import DailyRanking from "@/components/rankings/DailyRanking.vue";
import Infobox from "@/components/Infobox.vue";
import OverallResults from "@/components/OverallResults.vue";
import Sponsors from "@/components/Sponsors.vue";

export default defineComponent({
  name: "Home",
  components: {
    DailyRanking,
    Infobox,
    OverallResults,
    Sponsors,
  },
});
</script>
