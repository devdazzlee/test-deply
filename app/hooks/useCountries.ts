import countries from "world-countries";

const formattedCountries = countries.map(country => ({
  value: country.cca2,
  label: country.name.common,
  flag: country.flag,
  latlng: country.latlng,
  region: country.region
}));
const formattedCities = countries.map(country => ({
  label: country.capital[0],
  value: country.cca2,
  flag: country.flag,
  latlng: country.latlng,
  region: country.name.common
}));
const combinedData = [...formattedCountries, ...formattedCities];

const useCountries = () => {
  const getAll = () => combinedData;

  const getByValue = (value: string) => {
    return formattedCountries.find(item => item.value === value);
  };

  return {
    getAll,
    getByValue
  };
};

export default useCountries;
