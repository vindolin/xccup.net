<template>
  <div>
    <UploadForm />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import UploadForm from "@/components/UploadForm.vue";
export default defineComponent({
  name: "UploadFlight",
  components: {
    UploadForm,
  },
  data() {
    return {
      foo: null,
    };
  },
});
</script>
