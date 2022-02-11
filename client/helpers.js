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

//Random color generator
export const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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

//Filter items so it only shows the current month
export const dateFilter = (
  arr,
  selectedMonth,
  selectedYear,
  currentDate,
  name
) => {
  return arr.filter(item => {
    const createdDate = item[name] ? item[name].split("T")[0] : [];
    const tmpCreatedDate = new Date(`${createdDate}`.replace(/-/g, "/"));

    if (selectedYear && selectedMonth) {
      const tmpCurrentDate = new Date(`${selectedMonth}/1/${selectedYear}`);

      return compareDates(tmpCreatedDate, tmpCurrentDate);
    } else {
      return compareDates(tmpCreatedDate, currentDate.full);
    }
  });
};

//Get the total of all the amount properties in an object
export const getTotal = arr => {
  return arr.reduce((accu, bud) => accu + parseFloat(bud.amount), 0);
};

//Function to create a new chart
//graph is a string, labels and data are arrays
export const pieChart = (graph, items) => {
  const labels = items.map(item => item[0]);
  const data = items.map(item => item[1]);
  const backgroundColor = items.map(item => item[2]);

  return new Chart(graph, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor,
          borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: { display: false, labels: { fontStyle: "normal" } },
    },
    title: { fontStyle: "normal" },
  });
};
