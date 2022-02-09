//For sorting all items arrays
export const sortSingle = (arr, name) => {
  return arr.sort((a, b) => {
    if (a[name] < b[name]) return -1;
    if (a[name] > b[name]) return 1;
    return 0;
  });
};

export const sortDouble = (arr, name, subName) => {
  return arr.sort((a, b) => {
    if (a[name][subName] < b[name][subName]) return -1;
    if (a[name][subName] > b[name]) return 1;
    return 0;
  });
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

//Compare dates, will return true if date is within range
export const compareDates = (createdDate, currentDate) => {
  createdDate = new Date(createdDate);
  currentDate = new Date(currentDate);

  //for the range
  const startDate = new Date(
    `${createdDate.getMonth() + 1}/1/${createdDate.getFullYear()}`
  );
  let endDate = new Date(startDate);
  endDate = new Date(endDate.setMonth(endDate.getMonth() + 1));

  if (currentDate >= startDate && currentDate < endDate) {
    return true;
  } else {
    return false;
  }
};
