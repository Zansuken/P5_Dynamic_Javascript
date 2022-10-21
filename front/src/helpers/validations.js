import { formNode, geoApiURL } from "../constants.js";

// -- Form validations -- //

// Check if given string includes numbers
export const hasNumber = (string) => /\d/.test(string);

export const checkStreet = async (address, value) => {
  const response = await isAddressValid(address, value);
  return response;
};

// Check if given address exists and send its status (with an API => https://www.geoapify.com/)
export const isAddressValid = async (address, city) => {
  // Build the request url with the given address input
  const url = geoApiURL(address);

  // Return all corresponding data
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.features.length === 0) {
      return "unknownAddress";
    } else {
      const foundCity =
        data.features[0].properties.city || data.features[0].properties.state;
      const foundNumber = data.features[0].properties.housenumber;
      const foundStreet = data.features[0].properties.street;

      // Check if given city and found city is equivalent
      if (foundCity?.toLowerCase() !== city.toLowerCase()) {
        return "cityAndStreetNoMatch";
      } else {
        const addressNode = formNode().elements["address"];

        addressNode.value = `${foundNumber} ${foundStreet}`;
        return "";
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const isValidCity = async (city) => {
  // Build the request url with the given city input
  const url = geoApiURL(city);

  // Return all corresponding data
  try {
    const response = await fetch(url);
    const data = await response.json();
    const foundCities = data.features.map((element) => element.properties.city);
    if (!foundCities.includes(city)) {
      return "unknownCity";
    } else {
      return "";
    }
  } catch (error) {
    console.error(error.message);
  }
};

// Check if given string is an email
export const isValidEmail = (string) =>
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(string);
