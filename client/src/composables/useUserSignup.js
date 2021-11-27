import { reactive } from "@vue/reactivity";

// This is a simple state with no actions/getters as it's only used by one component. (Signup)

const state = reactive({
  firstName: "",
  lastName: "",
  birthday: "",
  gender: "",
  password: "",
  passwordConfirm: "",
  clubId: "",
  email: "",
  address: { country: "GER" },
  emailNewsletter: true,
  tshirtSize: "",

  // Set this options as defaults
  // Todo: Maybe do this in backend?

  emailInformIfComment: true,
  emailTeamSearch: false,
});

export default () => {
  // Getters

  // Mutations

  // Actions

  return { userData: state };
};
