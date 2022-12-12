import { Ability, AbilityBuilder } from "@casl/ability";

function subjectName(item) {
  if (!item || typeof item === "string") {
    return item;
  }
  return item.__type;
}

const ability = new Ability([], { subjectName });

const currentAuth = {
  documentNumber: "1047450855",
  email: "japersa92@gmail.com",
  firstName: "Alvaro",
  idRole: 1,
  idUser: 1,
  isActive: true,
  lastName: "Perez",
  phone: "3046842326",
  remember_token: null,
  secondLastName: "Salcedo",
  secondName: "Javier",
  userName: "japersa92",
  role: {
    description: "Administrador",
    isActive: true,
    name: "Administrador",
  },
};
ability.update(defineRulesFor(currentAuth));

function defineRulesFor(auth) {
  // const { can, rules } = new AbilityBuilder.extract();
  //   const { can, rules } = new AbilityBuilder();
  const { can, cannot, rules } = new AbilityBuilder();
  switch (auth.role.name) {
    case "Administrador":
      can("create-user", "User");
      can("edit-user", "User");
      can("read-user", "User");
      can("disabled-user", "User");
      can("enabled-user", "User");
      can("create-country", "Country");
      can("edit-country", "Country");
      can("read-country", "Country");
      can("disabled-country", "Country");
      can("enabled-country", "Country");
      can("create-department", "Department");
      can("edit-department", "Department");
      can("read-department", "Department");
      can("disabled-department", "Department");
      can("enabled-department", "Department");
      can("create-city", "City");
      can("edit-city", "City");
      can("read-city", "City");
      can("disabled-city", "City");
      can("enabled-city", "City");
      can("create-area", "Area");
      can("edit-area", "Area");
      can("read-area", "Area");
      can("disabled-area", "Area");
      can("enabled-area", "Area");
      can("create-zone", "Zone");
      can("edit-zone", "Zone");
      can("read-zone", "Zone");
      can("disabled-zone", "Zone");
      can("enabled-zone", "Zone");
      can("create-neighborhood", "Neighborhood");
      can("edit-neighborhood", "Neighborhood");
      can("read-neighborhood", "Neighborhood");
      can("disabled-neighborhood", "Neighborhood");
      can("enabled-neighborhood", "Neighborhood");
      can("create-company", "Company");
      can("edit-company", "Company");
      can("read-company", "Company");
      can("disabled-company", "Company");
      can("enabled-company", "Company");
      can("create-role", "Role");
      can("edit-role", "Role");
      can("read-role", "Role");
      can("disabled-role", "Role");
      can("enabled-role", "Role");
      can("create-permission", "Permission");
      can("edit-permission", "Permission");
      can("read-permission", "Permission");
      can("disabled-permission", "Permission");
      can("enabled-permission", "Permission");
      can("create-address", "Address");
      can("edit-address", "Address");
      can("read-address", "Address");
      can("disabled-address", "Address");
      can("enabled-address", "Address");
      can("generate-addresses", "Address");
      can("upload-address", "Address");
      can("download-address", "Address");
      can("assign-addresses", "Address");
      can("see-routes", "Route");
      can("create-observation", "Observation");
      can("edit-observation", "Observation");
      can("read-observation", "Observation");
      can("disabled-observation", "Observation");
      can("enabled-observation", "Observation");
      break;
    case "Mensajero":
      cannot("read", "Address");
      break;
    default:
  }
  return rules;
}

export default ability;
