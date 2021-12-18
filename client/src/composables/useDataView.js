import { ref, readonly, computed } from "vue";
import { useRouter } from "vue-router";
import { checkIfAnyValueOfObjectIsDefined } from "../helper/utils";

const DEFAULT_LIMIT = 50;
const LIMIT_OPTIONS = [10, 25, 50, 100];

const instances = {};

/**
 * The viewComponentName must match with name defined for this view in routes.js
 */
export default (viewComponentName) => {
  if (!viewComponentName) createInstance(viewComponentName);

  if (!instances[viewComponentName])
    instances[viewComponentName] = createInstance(viewComponentName);

  return instances[viewComponentName];
};

function createInstance(viewComponentName) {
  const data = ref([]);
  const sortOptionsCache = ref(null);
  const filterOptionsCache = ref(null);
  const paramsCache = ref(null);
  const limitCache = ref(DEFAULT_LIMIT);
  const numberOfTotalEntries = ref(0);
  const isLoading = ref(false);
  const currentRange = ref({ start: 0, end: 0 });
  const errorMessage = ref("");
  const router = useRouter();

  // Getters
  const filterActive = computed(() =>
    checkIfAnyValueOfObjectIsDefined(filterOptionsCache.value)
  );

  // Mutations
  const clearFilter = () => {
    filterOptionsCache.value = null;
    router.push({
      name: viewComponentName,
      query: {
        ...filterOptionsCache.value,
      },
    });
  };

  const sortDataBy = async (sortOptions) => {
    sortOptionsCache.value = sortOptions;
  };

  const paginatBy = async (limit, offset) => {
    router.push({
      name: viewComponentName,
      query: {
        ...filterOptionsCache.value,
        limit,
        offset,
      },
    });
  };

  const filterDataBy = (filterOptions) => {
    //Check if any filter value was set
    if (!Object.values(filterOptions).find((v) => !!v)) return;

    filterOptionsCache.value = filterOptions;

    router.push({
      name: viewComponentName,
      query: {
        ...filterOptionsCache.value,
      },
    });
  };

  // Actions
  const fetchData = async (
    apiEndpoint,
    { params, queries, apiExtension } = {}
  ) => {
    if (params) paramsCache.value = params;

    if (queries.limit) limitCache.value = parseInt(queries.limit);
    const offset =
      queries.offset && queries.offset > 0 ? parseInt(queries.offset) : 0;

    // Delete pagination parameters from "normal" query parameters
    if (queries.limit) delete queries.limit;
    if (queries.offset) delete queries.offset;

    if (queries) filterOptionsCache.value = queries;

    try {
      isLoading.value = true;
      const res = await apiEndpoint(
        {
          ...paramsCache.value,
          ...filterOptionsCache.value,
          sortCol: sortOptionsCache.value?.sortCol,
          sortOrder: sortOptionsCache.value?.sortOrder,
          limit: limitCache.value,
          offset,
        },
        apiExtension
      );
      if (res.status != 200) throw res.status.text;

      //Check if data supports pagination (data split in rows and count)
      if (res.data.rows) {
        data.value = res.data.rows;
        numberOfTotalEntries.value = res.data.count;
        calcRanges(offset);
        return;
      }

      data.value = res.data;
      errorMessage.value = "";
    } catch (error) {
      console.error(error);
      errorMessage.value =
        "Beim laden der Daten ist ein Fehler aufgetreten. Bitte lade die Seite erneut.";
    } finally {
      isLoading.value = false;
    }
  };

  const calcRanges = (offset) => {
    currentRange.value.start = offset + 1;
    currentRange.value.end =
      currentRange.value.start + limitCache.value - 1 >=
      numberOfTotalEntries.value
        ? numberOfTotalEntries.value
        : currentRange.value.start + limitCache.value - 1;
  };

  return {
    fetchData,
    filterDataBy,
    sortDataBy,
    paginatBy,
    data: readonly(data),
    errorMessage,
    currentRange: readonly(currentRange),
    numberOfTotalEntries: readonly(numberOfTotalEntries),
    isLoading: readonly(isLoading),
    filterActive: readonly(filterActive),
    clearFilter,
    DEFAULT_LIMIT,
    LIMIT_OPTIONS,
    limitCache,
  };
}
