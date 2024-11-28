import React from "react";
import Select from "react-select";

export type MilesSelectValue = {
  label: string;
  value: number;
};

interface MilesSelectProps {
  value?: MilesSelectValue;
  onChange: (value: MilesSelectValue) => void;
}

const MilesSelect: React.FC<MilesSelectProps> = ({ value, onChange }) => {
  const milesOptions: MilesSelectValue[] = [
    { label: "Within 5 miles", value: 5 },
    { label: "Within 10 miles", value: 10 },
    { label: "Within 15 miles", value: 15 },
    { label: "Within 25 miles", value: 25 },
    { label: "Within 50 miles", value: 50 },
    { label: "Within 100 miles", value: 100 },
  ];

  return (
    <div>
      <Select
        placeholder="Select distance"
        isClearable
        options={milesOptions}
        value={value}
        onChange={(value) => onChange(value as MilesSelectValue)}
        formatOptionLabel={(option: MilesSelectValue) => (
          <div className="flex flex-row items-center gap-3">
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
};

export default MilesSelect;