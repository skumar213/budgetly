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

//Colors for pie chart (the number matches the amount of categories)
export const colors = [
  "#4e73df",
  "#1cc88a",
  "#36b9cc",
  "#F6C23E",
  "#e7493b",
  "#b336cc",
];

export const findUnique = (value, index, self) => self.indexOf(value) === index;

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

//Filters items so it only shows the current month
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
  return arr.reduce((accu, item) => accu + parseFloat(item.amount), 0);
};

//Functions to create new charts
//Pie Chart
export const pieChart = (graph, labels, data) => {
  return new Chart(graph, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          label: "",
          data,
          backgroundColor: colors,
          borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: { display: false, labels: { fontStyle: "normal" } },
      tooltips: {
        mode: "label",
        label: "mylabel",
        callbacks: {
          label: function (tooltipItem, data) {
            return (
              data.labels[tooltipItem.index] +
              ": $" +
              parseFloat(data.datasets[0].data[tooltipItem.index]).toFixed(2)
            );
          },
        },
      },
    },
    title: { fontStyle: "normal" },
  });
};

//Bar Graph
export const barChart = (graph, labels, budgeted, actual) => {
  return new Chart(graph, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Budgeted",
          backgroundColor: "#36b9cc",
          data: budgeted,
        },
        {
          label: "Acutal",
          backgroundColor: "#F6C23E",
          data: actual,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: { display: false, labels: { fontStyle: "normal" } },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        ],
      },
      tooltips: {
        mode: "label",
        label: "mylabel",
        callbacks: {
          label: function (tooltipItem, data) {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ": $" +
              parseFloat(tooltipItem.value).toFixed(2)
            );
          },
        },
      },
    },
    title: { fontStyle: "normal" },
  });
};

//Horizontal Bar Graph
export const horizontalBarChart = (graph, labels, budgeted, actual) => {
  return new Chart(graph, {
    type: "horizontalBar",
    data: {
      labels: ["Original Value", "Current Value"],
      datasets: [
        {
          label: "",
          backgroundColor: ["#4e73df", "#1cc88a"],
          borderColor: "#ffffff",
          data: [50, 30],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: { display: false, labels: { fontStyle: "normal" } },
      scales: {
        xAxes: [
          {
            ticks: {
              fontStyle: "normal",
              beginAtZero: true,
              callback: function (value) {
                return "$" + value;
              },
            },
          },
        ],
        yAxes: [{ ticks: { fontStyle: "normal", beginAtZero: true } }],
      },
      tooltips: {
        mode: "label",
        label: "mylabel",
        callbacks: {
          label: function (tooltipItem, data) {
            return (
              data.datasets[tooltipItem.datasetIndex].label +
              ": $" +
              parseFloat(tooltipItem.value).toFixed(2)
            );
          },
        },
      },
    },
    title: { fontStyle: "normal" },
  });
};
