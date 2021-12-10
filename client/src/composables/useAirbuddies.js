import { readonly, ref, computed } from "vue";
import ApiService from "@/services/ApiService";

const airbuddiesFlightData = ref([]);
const checkedAirbuddyFlightIds = ref([]);

export default () => {
  // Getters

  const activeAirbuddyFlights = computed(() => {
    let tmp = [];
    airbuddiesFlightData.value.forEach((element) => {
      tmp.push({
        buddyName: element.user.firstName,
        buddyFlightId: element.id,
        isActive: checkedAirbuddyFlightIds.value.includes(element.id),
        fixes: element.fixes,
      });
    });
    return tmp;
  });

  // Mutations
  const updateCheckedAirbuddies = (data) => {
    checkedAirbuddyFlightIds.value = data;
  };

  // Actions
  const fetchAll = async (airbuddies) => {
    if (airbuddiesFlightData.value.length > 0) return;
    airbuddies.forEach(async (buddy) => {
      airbuddiesFlightData.value.push(
        (await ApiService.getFlight(buddy.externalId)).data
      );
    });
  };

  const resetAirbuddyData = () => {
    airbuddiesFlightData.value = [];
    checkedAirbuddyFlightIds.value = [];
  };

  return {
    fetchAll,
    updateCheckedAirbuddies,
    resetAirbuddyData,
    airbuddiesFlightData: readonly(airbuddiesFlightData),
    checkedAirbuddyFlightIds: readonly(checkedAirbuddyFlightIds),
    activeAirbuddyFlights,
  };
};