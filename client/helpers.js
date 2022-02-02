//For sorting all items arrays
export const sortSingle = (arr, name) => {
  return (
    arr.sort((a, b) => {
      if (a[name] < b[name]) return -1;
      if (a[name] > b[name]) return 1;
      return 0;
    })
  );
};

export const sortDouble = (arr, name, subName) => {
  return (
    arr.sort((a, b) => {
      if (a[name][subName] < b[name][subName]) return -1;
      if (a[name][subName] > b[name]) return 1;
      return 0;
    })
  );
};

//Months
export const months1 = [
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

//Months [0] and their respective last day [1]
export const months = [
  ["January", 31],
  ["February", 28],
  ["March", 31],
  ["April", 30],
  ["May", 31],
  ["June", 30],
  ["July", 31],
  ["August", 31],
  ["September", 30],
  ["October", 31],
  ["November", 30],
  ["December", 31]
]

//Yahoo finance api credential

