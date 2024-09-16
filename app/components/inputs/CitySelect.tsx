import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

export type CitySelectValue = {
  label: string;
  value: string;
  latlng: [string, string];
};

interface CitySelectProps {
  countryCode: string;
  value?: CitySelectValue;
  onChange: (value: CitySelectValue) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({
  countryCode,
  value,
  onChange
}) => {
  const [cities, setCities] = useState<CitySelectValue[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (countryCode) {
      setLoading(true);
      axios
        .get(
          `http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=1000&username=${process.env.NEXT_PUBLIC_GEONAMES_USERNAME}`
        )
        .then(response => {
          const cityData = response.data.geonames.map((city: any) => ({
            label: city.name,
            value: city.geonameId,
            latlng: [city.lat as string, city.lng as string]
          }));
          setCities(cityData);
        })
        .catch(error => {
          console.error("Error fetching cities:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [countryCode]);

  return (
    <div>
      <Select
        placeholder='Select a city'
        isClearable
        options={cities}
        value={value}
        onChange={value => onChange(value as CitySelectValue)}
        isLoading={loading}
        formatOptionLabel={(option: any) => (
          <div className='flex flex-row items-center gap-3'>
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg"
        }}
        theme={theme => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6"
          }
        })}
      />
    </div>
  );
};

export default CitySelect;
