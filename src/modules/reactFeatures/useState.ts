export const useState = <T>(initialValue: T) => {
  let value = initialValue;
  const getValue = () => value;
  const setValue = (newValue: T) => {
    value = newValue;
  };

  return [getValue, setValue] as [typeof getValue, typeof setValue];
};
