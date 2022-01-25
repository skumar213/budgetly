//For sorting all items arrays
export const sortSingle = (arr, name) => {
  return (
    arr.sort((a, b) => {
      if (a[name] < b[name]) return -1;
      if (a[name] > b[name]) return 1;
      return 0;
    }) || []
  );
};

export const sortDouble = (arr, name, subName) => {
  return (
    arr.sort((a, b) => {
      if (a[name][subName] < b[name][subName]) return -1;
      if (a[name][subName] > b[name]) return 1;
      return 0;
    }) || []
  );
};

//Months
export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
