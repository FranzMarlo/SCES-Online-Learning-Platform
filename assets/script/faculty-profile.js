document.addEventListener("DOMContentLoaded", function () {
  const profileTab = document.getElementById("profileTab");
  const analyticsTab = document.getElementById("analyticsTab");

  const profileContainer = document.getElementById("profileContainer");
  const analyticsContainer = document.getElementById("analyticsContainer");

  function showContainer(tabIndex) {
    profileContainer.style.display = "none";
    analyticsContainer.style.display = "none";

    switch (tabIndex) {
      case 1:
        profileContainer.style.display = "flex";
        profileTab.classList.add("active");
        analyticsTab.classList.remove("active");
        break;
      case 2:
        analyticsContainer.style.display = "flex";
        profileTab.classList.remove("active");
        analyticsTab.classList.add("active");
        break;
      default:
        profileContainer.style.display = "flex";
        tabIndex = 1;
        profileTab.classList.add("active");
        analyticsTab.classList.remove("active");
        break;
    }

    const url = new URL(window.location);
    url.searchParams.set("active", tabIndex);
    window.history.pushState({}, "", url);
  }

  profileTab.addEventListener("click", function () {
    showContainer(1);
  });

  analyticsTab.addEventListener("click", function () {
    showContainer(2);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = parseInt(urlParams.get("active")) || 1;

  showContainer(activeTab);

  $.ajax({
    url: "/backend/fetch-class.php",
    type: "POST",
    dataType: "json",
    data: {
      submitType: "facultyFetchLineChartData",
    },
    success: function (data) {
      if (data && data.labels && data.lineData) {
        var ctxLine = document.getElementById("lineChart").getContext("2d");
        var lineChart = new Chart(ctxLine, {
          type: "line",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Lessons Upload",
                data: data.lineData,
                backgroundColor: "#ade0fb",
                borderColor: "#59ADF6",
                borderWidth: 3,
                tension: 0.4, 
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Lessons Upload Per Month",
                font: {
                  size: 18,
                },
                padding: {
                  top: 10,
                  bottom: 10,
                },
              },
              legend: {
                display: true,
                position: "bottom",
                padding: 20,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.log("No data received or data is in an unexpected format.");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error in AJAX request:", status, error);
    },
  });

  $.ajax({
    url: "/backend/fetch-class.php",
    type: "POST",
    dataType: "json",
    data: {
      submitType: "facultyFetchBarChart",
    },
    success: function (data) {
      if (data && data.labels && data.barData && data.subjectCodes) {
        const colorMapping = {
          fil: "#ff8080",
          eng: "#ffb480",
          math: "#e1e149",
          sci: "#42d6a4",
          esp: "#08cad1",
          mt: "#59adf6",
          ap: "#f0bad1",
          mapeh: "#a3adff",
          epp: "#d9ae9d",
        };

        const backgroundColors = data.subjectCodes.map(
          (code) => colorMapping[code] || "#cccccc"
        );

        // Get the canvas context
        var ctxBar = document.getElementById("barChart").getContext("2d");

        var barChart = new Chart(ctxBar, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Total Lessons",
                data: data.barData,
                backgroundColor: backgroundColors,
                borderColor: "#fff",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Total Lesson Per Subject",
                font: {
                  size: 18,
                },
                padding: {
                  top: 10,
                  bottom: 10,
                },
              },
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } else {
        console.log("No data received or data is in an unexpected format.");
      }
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data for bar chart:", status, error);
    },
  });

  $.ajax({
    url: "/backend/fetch-class.php",
    type: "POST",
    data: {
      submitType: "facultyQuizCompletion",
    },
    dataType: "json",
    success: function (response) {
      var totalCompleted = response.completed;
      var totalInactive = response.inactive;
      var totalActive = response.active;

      initializeQuizPieChart(totalCompleted, totalInactive, totalActive);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching data: " + error);
    },
  });
  function initializeQuizPieChart(
    totalCompleted,
    totalInactive,
    totalActive
  ) {
    var ctxPie = document.getElementById("pieChart").getContext("2d");

    // Destroy existing chart if it exists
    if (ctxPie.chart) {
      ctxPie.chart.destroy();
    }

    // Handle case where there's no data
    if (totalCompleted == 0 && totalInactive == 0 && totalActive == 0) {
      showAlert("info", "No Data Available For Subject");
    }

    const pieChart = new Chart(ctxPie, {
      type: "pie", // Changed from 'doughnut' to 'pie'
      data: {
        labels: ["Completed", "Inactive", "Active"],
        datasets: [
          {
            data: [totalCompleted, totalInactive, totalActive],
            backgroundColor: ["#ade0fb", "#266ca8", "#0f2473"],
            borderWidth: 2,
            borderColor: "#ccc",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Quizzes By Status",
            font: {
              size: 17,
              weight: "bold",
            },
            padding: {
              top: 5,
              bottom: 10,
            },
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return "Quizzes: " + tooltipItem.raw;
              },
            },
          },
        },
      },
    });

    ctxPie.chart = pieChart; // Save chart instance to the context
  }
});

function showAlert(icon, title, message) {
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
    confirmButtonColor: "#4CAF50",
  });
}
