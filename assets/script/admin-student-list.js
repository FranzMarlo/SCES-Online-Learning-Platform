document.addEventListener("DOMContentLoaded", function () {
  const addStudentBtn = document.getElementById("addStudentBtn");
  const addStudentModal = document.getElementById("addStudentModal");
  const addStudentForm = document.getElementById("addStudentForm");
  const closeAddStudentModal = document.getElementById("closeAddStudentModal");

  addStudentBtn.addEventListener("click", function () {
    addStudentModal.style.display = "flex";
    document.body.style.overflow = "hidden";
  });

  closeAddStudentModal.addEventListener("click", function () {
    addStudentForm.reset();
    addStudentModal.style.display = "none";
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", function (event) {
    if (event.target == addStudentModal) {
      addStudentForm.reset();
      addStudentModal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  const performanceImg = document.getElementById(
    "studentPredictedPerformanceIcon"
  );
  const studentPerformance = document.getElementById(
    "studentPredictedPerformance"
  );
  const studentSuccess = document.getElementById("studentPredictedSuccess");
  const remarksImg = document.getElementById("studentPredictedRemarksIcon");
  const studentRemarks = document.getElementById("studentPredictedRemarks");
  const studentGWA = document.getElementById("studentPredictedGWA");

  initializeStudentsTable();

  function initializeStudentsTable() {
    if ($.fn.dataTable.isDataTable("#studentsTable")) {
    } else {
      var studentsTable = $("#studentsTable").DataTable({
        responsive: {
          details: {
            type: "inline",
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.hidden
                  ? '<tr data-dt-row="' +
                      col.rowIdx +
                      '" data-dt-column="' +
                      col.columnIdx +
                      '">' +
                      "<td><strong>" +
                      col.title +
                      ":" +
                      "</strong></td> " +
                      "<td>" +
                      col.data +
                      "</td>" +
                      "</tr>"
                  : "";
              }).join("");
              return data ? $("<table/>").append(data) : false;
            },
          },
        },
        ajax: {
          url: "/backend/fetch-class.php",
          type: "POST",
          data: function (d) {
            d.submitType = "fetchAllStudentsDataTable";
            return d;
          },
          dataSrc: "",
        },
        columns: [
          {
            data: "profile_image",
            render: function (data, type, row) {
              return `<div class="center-image">
                        <img src="/storage/student/images/${data}" alt="Profile Image" onerror="this.onerror=null; this.src='/storage/student/images/default.jpg';">
                      </div>`;
            },
            orderable: false,
            searchable: false,
            className: "text-center",
          },
          { data: "lrn", className: "text-center" },
          { data: "student_lname", className: "text-center" },
          { data: "student_fname", className: "text-center" },
          { data: "student_mname", className: "text-center" },
          { data: "age", className: "text-center" },
          { data: "gender", className: "text-center" },
          {
            data: null,
            render: function (data, type, row) {
              return `<div class="center-image">
              <button class="more-btn" data-student-id="${row.student_id}"><i class="fa-solid fa-chevron-right"></i></button>
              </div>`;
            },
            orderable: false,
            searchable: false,
            className: "text-center",
          },
        ],
        language: {
          emptyTable: "No data available in table",
        },
        initComplete: function () {
          studentsTable.draw();
        },
      });
    }
  }

  document
    .getElementById("studentsTable")
    .addEventListener("click", function (event) {
      if (event.target.closest(".more-btn")) {
        const btn = event.target.closest(".more-btn");
        const studentId = btn.getAttribute("data-student-id");
        if (studentId == "null") {
          showAlert("error", "Student is not registered in the platform");
          return;
        } else {
          fetch("/backend/fetch-class.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `submitType=fetchStudentDetails&student_id=${studentId}`,
          })
            .then((response) => response.json())
            .then((student) => {
              if (!student || Object.keys(student).length === 0) {
                showAlert("error", "Server Error", "Student Data Not Found");
                return;
              }

              Object.keys(student).forEach((key) => {
                if (student[key] === null || student[key] === "") {
                  student[key] = "Not Set";
                }
              });
              const modal = document.getElementById("studentModal");
              const modalHeader = document.getElementById("studentHeader");
              const genderClass =
                student.gender === "Female" ? "female" : "male";
              const tabItemClass =
                student.gender === "Female" ? "pink" : "blue";
              const coloredRow = document.querySelectorAll(".colored-row");

              modalHeader.classList.remove("female", "male");
              coloredRow.forEach((row) => {
                row.classList.remove("female", "male");
              });

              const tabItems = modal.querySelectorAll(".tab-item");
              tabItems.forEach((tab) => {
                tab.classList.remove("pink", "blue");
              });

              modalHeader.classList.add(genderClass);
              coloredRow.forEach((row) => {
                row.classList.add(genderClass);
              });
              tabItems.forEach((tab) => {
                tab.classList.add(tabItemClass);
              });

              const toggleAccountStatus = document.getElementById(
                "toggleAccountStatus"
              );
              if (student.disabled == "False") {
                toggleAccountStatus.classList.remove("enable-btn");
                toggleAccountStatus.classList.add("disable-btn");
                toggleAccountStatus.innerHTML = `<i class="fa-solid fa-user-gear"></i><span>Disable Account</span>`;
              } else {
                toggleAccountStatus.classList.remove("disable-btn");
                toggleAccountStatus.classList.add("enable-btn");
                toggleAccountStatus.innerHTML = `<i class="fa-solid fa-user-gear"></i><span>Enable Account</span>`;
              }
              toggleAccountStatus.setAttribute(
                "data-account-status",
                student.disabled
              );

              const imageElement = document.getElementById("profileImage");
              imageElement.src = `/storage/student/images/${student.profile_image}`;
              imageElement.onerror = function () {
                this.src = "/storage/student/images/default-profile.png";
              };
              document.getElementById("studId").textContent =
                student.student_id;
              document
                .getElementById("recordsTab")
                .setAttribute("data-student-id", student.student_id);
              document
                .getElementById("recordsTab")
                .setAttribute("data-section-id", student.section_id);
              document
                .getElementById("analyticsTab")
                .setAttribute("data-lrn", student.lrn);
              document.getElementById("fullName").textContent =
                student.student_fname + " " + student.student_lname;
              document.getElementById("gradeSection").textContent =
                student.grade_level + " - " + student.section;
              document.getElementById("lastName").textContent =
                student.student_lname;
              document.getElementById("firstName").textContent =
                student.student_fname;
              document.getElementById("middleName").textContent =
                student.student_mname;
              document.getElementById("lastName").textContent =
                student.student_lname;
              document.getElementById("suffix").textContent =
                student.student_suffix;
              document.getElementById("gender").textContent = student.gender;
              document.getElementById("age").textContent = student.age;
              document.getElementById("lrn").textContent = student.lrn;
              document.getElementById("studentId").textContent =
                student.student_id;
              document.getElementById("gradeLevel").textContent =
                student.grade_level;
              document.getElementById("section").textContent = student.section;
              document.getElementById("email").textContent = student.email;
              document.getElementById("city").textContent = student.city;
              document.getElementById("barangay").textContent =
                student.barangay;
              document.getElementById("street").textContent = student.street;
              document.getElementById("guardian").textContent =
                student.guardian_name;
              document.getElementById("contact").textContent =
                student.guardian_contact;

              document.body.style.overflow = "hidden";
              modal.style.display = "flex";
              populatePanelData(student.student_id, student.section_id);
              getStudentGWA(student.student_id);
            })
            .catch((error) => {
              showAlert("error", "Server Error", error);
            });
        }
      }
    });

  document
    .getElementById("toggleAccountStatus")
    .addEventListener("click", function () {
      var status = this.getAttribute("data-account-status");
      var studentId = document
        .getElementById("recordsTab")
        .getAttribute("data-student-id");
      if (status == "False") {
        Swal.fire({
          icon: "question",
          title: "Disable Student Account?",
          text: "Disabling the student account would make them unable to login to their account.",
          showCancelButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#4CAF50",
          cancelButtonColor: "#f44336",
          allowOutsideClick: false,
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            disableStudentAccount(studentId);
          }
        });
      } else {
        Swal.fire({
          icon: "question",
          title: "Enable Student Account?",
          text: "Enabling the student account would make them able to login to their account again.",
          showCancelButton: true,
          confirmButtonText: "Yes",
          confirmButtonColor: "#4CAF50",
          cancelButtonColor: "#f44336",
          allowOutsideClick: false,
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            enableStudentAccount(studentId);
          }
        });
      }
    });

  document
    .getElementById("closeStudentModal")
    .addEventListener("click", function () {
      document.getElementById("studentModal").style.display = "none";
      document.body.style.overflow = "auto";
      showTabContent("profileContainer");
      setActiveTab("profileTab");
      $("#subjectFilterDropdown").val("All");
      $("#quarterFilterDropdown").val("All");
    });

  document.getElementById("profileTab").addEventListener("click", function () {
    showTabContent("profileContainer");
    setActiveTab("profileTab");
  });

  document.getElementById("recordsTab").addEventListener("click", function () {
    var studentId = document
      .getElementById("recordsTab")
      .getAttribute("data-student-id");
    showTabContent("recordsContainer");
    setActiveTab("recordsTab");
    initializeQuizScoresTable(studentId);
    initializeGradesTable(studentId);
  });

  document
    .getElementById("analyticsTab")
    .addEventListener("click", function () {
      var studentId = document
        .getElementById("recordsTab")
        .getAttribute("data-student-id");
      var sectionId = document
        .getElementById("recordsTab")
        .getAttribute("data-section-id");
      var lrn = document
        .getElementById("analyticsTab")
        .getAttribute("data-lrn");

      populatePanelData(studentId, sectionId);
      getStudentGWA(studentId);
      initializeStudentBarChart(lrn);
      initializeStudentFullBarChart(studentId, sectionId);
      showTabContent("analyticsContainer");
      setActiveTab("analyticsTab");
    });

  showTabContent("profileContainer");
  setActiveTab("profileTab");

  function showTabContent(tabId) {
    const tabs = document.querySelectorAll(".tab-container");
    tabs.forEach((tab) => {
      tab.style.display = "none";
    });

    document.getElementById(tabId).style.display = "flex";
  }

  function setActiveTab(tabId) {
    const tabs = document.querySelectorAll(".tab-item");
    tabs.forEach((tab) => {
      tab.classList.remove("active"); // Remove 'active' from all tabs
    });
    document.getElementById(tabId).classList.add("active"); // Add 'active' to the selected tab
  }

  function initializeQuizScoresTable(studentId) {
    if ($.fn.dataTable.isDataTable("#quizScoresTable")) {
      var quizScoresTable = $("#quizScoresTable").DataTable();
      quizScoresTable.settings()[0].ajax.data = function (d) {
        d.submitType = "facultyGetQuizRecords";
        d.student_id = studentId;
        return d;
      };

      quizScoresTable.ajax.reload();
    } else {
      var quizScoresTable = $("#quizScoresTable").DataTable({
        responsive: {
          details: {
            type: "inline",
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.hidden
                  ? '<tr data-dt-row="' +
                      col.rowIdx +
                      '" data-dt-column="' +
                      col.columnIdx +
                      '">' +
                      "<td>" +
                      col.title +
                      ":" +
                      "</td> " +
                      "<td>" +
                      col.data +
                      "</td>" +
                      "</tr>"
                  : "";
              }).join("");

              return data ? $("<table/>").append(data) : false;
            },
          },
        },
        ajax: {
          url: "/backend/fetch-class.php",
          type: "POST",
          data: function (d) {
            d.submitType = "facultyGetQuizRecords";
            d.student_id = studentId; // Pass the student ID here
            return d;
          },
          dataSrc: "",
        },
        columns: [
          { data: "quiz_number", className: "text-center" },
          { data: "subject", className: "text-center" },
          { data: "title", className: "text-center" },
          { data: "score", className: "text-center" },
          { data: "item_number", className: "text-center" },
          {
            data: "remarks",
            render: function (data) {
              var className =
                data === "Passed"
                  ? "passed"
                  : data === "Failed"
                  ? "failed"
                  : "";
              return `<span class="${className}">${data}</span>`;
            },
          },
          { data: "time", className: "text-center" },
          {
            data: null,
            render: function (data, type, row) {
              return `<div class="center-image">
              <button class="more-btn" data-student-id="${row.student_id}" data-quiz-id="${row.quiz_id}" data-quiz-taker="${row.full_name}" data-quiz-subject="${row.subject}"><i class="fa-solid fa-chevron-right"></i></button>
              </div>`;
            },
            orderable: false,
            searchable: false,
            className: "text-center",
          },
        ],
        language: {
          emptyTable: "No data available in table",
        },
        initComplete: function () {
          quizScoresTable.draw();
        },
      });
    }
  }

  document
    .getElementById("quizScoresTable")
    .addEventListener("click", function (event) {
      if (event.target.closest(".more-btn")) {
        const btn = event.target.closest(".more-btn");
        const studentId = btn.getAttribute("data-student-id");
        const quizId = btn.getAttribute("data-quiz-id");
        const quizTaker = btn.getAttribute("data-quiz-taker");
        const quizSubject = btn.getAttribute("data-quiz-subject");

        fetch("/backend/fetch-class.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `submitType=fetchStudentQuizHistory&student_id=${studentId}&quiz_id=${quizId}`,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              showAlert("error", "Student has not answered the quiz yet");
              return;
            }
            const quizTakerSpan = document.getElementById("quizTaker");
            const quizSubjectSpan = document.getElementById("quizSubject");
            quizTakerSpan.textContent = quizTaker;
            quizSubjectSpan.textContent = `${quizSubject} - Quiz ${data.quiz_number}`;

            const viewQuizModal = document.getElementById("viewQuizModal");

            viewQuizModal.querySelector(
              ".modal-header-text h1"
            ).innerText = `Quiz ${data.quiz_number} - ${data.title}`;

            viewQuizModal.querySelector(
              ".modal-icon-container img"
            ).src = `/assets/images/${data.icon}`;

            const modalHeaderBg =
              viewQuizModal.querySelector(".modal-header-bg");
            modalHeaderBg.className = `modal-header-bg ${data.subject_code.toLowerCase()}`;

            const questionsContainer = viewQuizModal.querySelector(
              "#viewQuestionsContainer"
            );
            questionsContainer.innerHTML = "";

            data.questions.forEach((question, index) => {
              const quizItem = document.createElement("div");
              quizItem.classList.add("quiz-item");

              const questionBox = document.createElement("div");
              questionBox.classList.add("question-box");
              questionBox.setAttribute(
                "data-question-id",
                question.question_id
              );
              questionBox.innerHTML = `<span><strong>${index + 1}.</strong> ${
                question.question
              }</span>`;
              quizItem.appendChild(questionBox);

              question.choices.forEach((choice, i) => {
                const choiceLetter = String.fromCharCode(65 + i);
                const choiceElement = document.createElement("div");
                choiceElement.classList.add("quiz-ans-fixed");

                if (choice.is_correct === 1) {
                  choiceElement.classList.add("correct");
                } else {
                  choiceElement.classList.add("wrong");
                }

                if (choice.isSelected) {
                  choiceElement.classList.add(data.subject_code.toLowerCase());
                }

                choiceElement.innerHTML = `
                <strong>${choiceLetter}.</strong>&nbsp;${choice.choice}
              `;

                quizItem.appendChild(choiceElement);
              });

              questionsContainer.appendChild(quizItem);
            });

            const closeButton = document.getElementById("close-quiz");
            const closeViewQuizModal =
              document.getElementById("closeViewQuizModal");

            closeButton.onclick = () => {
              viewQuizModal.scrollTop = 0;
              viewQuizModal.style.display = "none";
              document.getElementById("studentModal").style.display = "flex";
            };

            closeViewQuizModal.onclick = () => {
              viewQuizModal.scrollTop = 0;
              viewQuizModal.style.display = "none";
              document.getElementById("studentModal").style.display = "flex";
            };

            document.getElementById("studentModal").style.display = "none";
            viewQuizModal.style.display = "block";
          })
          .catch((error) => {
            showAlert("error", "Server Error", "Error fetching student data");
          });
      }
    });

  function initializeGradesTable(studentId) {
    if ($.fn.dataTable.isDataTable("#gradesTable")) {
      var gradesTable = $("#gradesTable").DataTable();
      gradesTable.settings()[0].ajax.data = function (d) {
        d.submitType = "facultyGetGrades";
        d.student_id = studentId;
        return d;
      };

      gradesTable.ajax.reload();
    } else {
      var gradesTable = $("#gradesTable").DataTable({
        responsive: {
          details: {
            type: "inline",
            display: $.fn.dataTable.Responsive.display.childRowImmediate,
            renderer: function (api, rowIdx, columns) {
              var data = $.map(columns, function (col, i) {
                return col.hidden
                  ? '<tr data-dt-row="' +
                      col.rowIdx +
                      '" data-dt-column="' +
                      col.columnIdx +
                      '">' +
                      "<td>" +
                      col.title +
                      ":" +
                      "</td> " +
                      "<td>" +
                      col.data +
                      "</td>" +
                      "</tr>"
                  : "";
              }).join("");

              return data ? $("<table/>").append(data) : false;
            },
          },
        },
        ajax: {
          url: "/backend/fetch-class.php",
          type: "POST",
          data: function (d) {
            d.submitType = "facultyGetGrades";
            d.student_id = studentId;
            return d;
          },
          dataSrc: "",
        },
        columns: [
          { data: "subject", className: "text-center" },
          { data: "grade", className: "text-center" },
          {
            data: "remarks",
            className: "text-center",
          },
          { data: "quarter", className: "text-center" },
        ],
        language: {
          emptyTable: "No data available in table",
        },
        initComplete: function () {
          gradesTable.draw();
        },
      });
    }
  }

  function populatePanelData(studentId, section_id) {
    const data = new FormData();
    data.append("submitType", "masterlistPanelData");
    data.append("student_id", studentId);
    data.append("section_id", section_id);

    fetch("/backend/fetch-class.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("totalCompletion").textContent =
          data.totalCompleted || 0;
        document.getElementById("totalQuizzes").textContent =
          data.totalPending || 0;
        document.getElementById("averageScore").textContent =
          data.averageScore || "N/A";
        document.getElementById("generalAverage").textContent =
          data.generalAverage || "N/A";
      })
      .catch((error) => {
        console.error("Error fetching panel data:", error);
      });
  }

  function getStudentGWA(studentId) {
    const data = new FormData();
    data.append("submitType", "facultyGetGWA");
    data.append("student_id", studentId);

    fetch("/backend/fetch-class.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((studentData) => {
        // Check if studentData contains N/A values
        const hasNoData = studentData.some(
          (record) =>
            record.gwa === "N/A" &&
            record.grade_section === "N/A" &&
            record.remarks === "N/A"
        );

        if (hasNoData) {
          studentPerformance.innerText = "No Data";
          studentSuccess.innerText = "No Data";
          studentRemarks.innerText = "No Data";
          studentGWA.innerText = "No Data";

          remarksImg.src = "/assets/images/not-found.png";
          performanceImg.src = "/assets/images/not-found.png";
          return;
        }

        const predictiveData = {
          gwa_records: studentData, // Send the entire studentData array
        };

        // Send the predictive data to Python API
        fetch("https://predictive-model-sces-1.onrender.com/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(predictiveData),
        })
          .then((response) => response.json())
          .then((predictionData) => {
            const remarks = predictionData.predicted_remarks;
            const performance = predictionData.predicted_performance;

            studentPerformance.innerText = predictionData.predicted_performance;
            studentSuccess.innerText =
              predictionData.predicted_academic_success_rate;
            studentRemarks.innerText = predictionData.predicted_remarks;
            studentGWA.innerText = predictionData.predicted_next_gwa;

            remarksImg.src = getRemarksIcon(remarks);
            performanceImg.src = getPerformanceIcon(performance);
          })
          .catch((error) => {
            console.error("Error fetching predictions:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }

  function initializeStudentBarChart(lrn) {
    var ctxBar = document.getElementById("studentBarChart").getContext("2d");

    // Destroy existing chart instance if it exists
    if (Chart.getChart("studentBarChart")) {
      Chart.getChart("studentBarChart").destroy();
    }

    // Fetch GWA records for the bar chart
    $.ajax({
      url: "/backend/fetch-class.php",
      type: "POST",
      dataType: "json",
      data: {
        submitType: "studentBarChartGWA",
        lrn: lrn,
      },
      success: function (data) {
        var barChart = new Chart(ctxBar, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "GWA",
                data: data.barData,
                backgroundColor: "#59ADF6",
                borderColor: "#ccc",
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
                text: "GWA by Grade Level",
                font: { size: 18 },
                padding: { top: 10, bottom: 10 },
              },
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true, max: 100 },
            },
          },
        });

        const interpretationElement = document.getElementById("interpretation");

        const gwaRecords = data.labels.map((label, index) => ({
          grade_level: label,
          gwa: data.barData[index],
        }));

        fetch("https://predictive-model-sces-1.onrender.com/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gwa_records: gwaRecords }),
        })
          .then((response) => response.json())
          .then((interpretationData) => {
            if (interpretationData.error) {
              interpretationElement.innerHTML = `<p style="color: red;">${interpretationData.error}</p>`;
              return;
            }

            const hasWarning = interpretationData.warning === 0;

            const legendHtml = `
              <legend style="color: ${hasWarning ? "red" : "green"};">
                ${
                  hasWarning
                    ? `<img src="/assets/images/at-risk.png" alt="Warning"> Action Required`
                    : `<img src="/assets/images/quiz-passed.png" alt="Check"> No Warnings Found`
                }
              </legend>
            `;
            const overallMessage = interpretationData.overall_message
              ? `<p><strong>${interpretationData.overall_message}</strong></p>`
              : "";
            let insightsHtml = "";
            if (
              interpretationData.insights &&
              interpretationData.insights.length > 0
            ) {
              const insightsList = interpretationData.insights
                .map((insight) => {
                  let iconHtml = "";
                  if (insight.includes("Improvement in GWA")) {
                    iconHtml = `<i class="fas fa-arrow-up" style="color: green;"></i>`;
                  } else if (insight.includes("Decline in GWA")) {
                    iconHtml = `<i class="fas fa-arrow-down" style="color: red;"></i>`;
                  } else if (insight.includes("No changes in GWA")) {
                    iconHtml = `<i class="fas fa-minus" style="color: goldenrod;"></i>`;
                  }
                  return `<li>${insight} ${iconHtml}</li>`;
                })
                .join("");

              insightsHtml = `
                <p><strong>Student's GWA across grade level:</strong></p>
                <ul>${insightsList}</ul>
              `;
            } else {
              insightsHtml = `<p>No insights available for this student.</p>`;
            }
            const recommendation = interpretationData.recommendation
              ? `<p><strong>Recommendation: </strong>${interpretationData.recommendation}</p>`
              : "";

            // Combine everything into a single HTML block
            interpretationElement.innerHTML = `
              ${legendHtml}
              ${overallMessage}
              ${insightsHtml}
              ${recommendation}
            `;
          })
          .catch(() => {
            interpretationElement.innerHTML = `<p style="color: red;">Failed to fetch interpretation data.</p>`;
          });
      },
      error: function () {
        document.getElementById(
          "interpretation"
        ).innerHTML = `<p style="color: red;">Failed to fetch GWA data.</p>`;
      },
    });
  }

  $("#subjectFilterDropdown, #quarterFilterDropdown").on("change", function () {
    var studentId = document
      .getElementById("recordsTab")
      .getAttribute("data-student-id");
    initializeStudentFullBarChart(studentId);
  });

  function initializeStudentFullBarChart(studentId) {
    const subjectFilter = $("#subjectFilterDropdown").val();
    const quarterFilter = $("#quarterFilterDropdown").val();

    const ctxBar = document
      .getElementById("studentFullBarChart")
      .getContext("2d");

    if (Chart.getChart("studentFullBarChart")) {
      Chart.getChart("studentFullBarChart").destroy();
    }

    $.ajax({
      url: "/backend/fetch-class.php",
      type: "POST",
      dataType: "json",
      data: {
        submitType: "studentFullBarChart",
        student_id: studentId,
        subject: subjectFilter,
        quarter: quarterFilter,
      },
      success: function (data) {
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

        const backgroundColors = data.subjectCodes.map((code) => {
          const normalizedCode = code.toLowerCase();
          return colorMapping[normalizedCode] || "#cccccc";
        });

        new Chart(ctxBar, {
          type: "bar",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Grade",
                data: data.barData,
                backgroundColor: backgroundColors,
                borderColor: "#ccc",
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
                text: "Grade Per Subject",
                font: { size: 18 },
                padding: { top: 10, bottom: 10 },
              },
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true, max: 100 },
            },
          },
        });

        const subjectTitles =
          subjectFilter === "All"
            ? data.labels.map(getSubjectTitle)
            : data.labels;

        $.ajax({
          url: "https://predictive-model-sces-1.onrender.com/interpret-grades",
          type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            subject_filter: subjectFilter,
            quarter_filter: quarterFilter,
            labels: subjectTitles,
            bar_data: data.barData,
          }),
          success: function (interpretationResponse) {
            const interpretationSpan = document.getElementById(
              "subjectInterpretation"
            );
            interpretationSpan.innerHTML = ""; // Clear previous content

            const hasWarning = interpretationResponse.warning === 0;

            const legendHtml = `
              <legend style="color: ${hasWarning ? "red" : "green"};">
                ${
                  hasWarning
                    ? `<img src="/assets/images/at-risk.png" alt="Warning"> Action Required`
                    : `<img src="/assets/images/quiz-passed.png" alt="Check"> No Warnings Found`
                }
              </legend>
            `;

            const interpretation = interpretationResponse.interpretation
              ? `<p><strong>${interpretationResponse.interpretation}</strong></p>`
              : "";

            let insightsHtml = "";
            if (
              interpretationResponse.trends &&
              interpretationResponse.trends.length > 0
            ) {
              const trendsList = interpretationResponse.trends
                .map((trend) => {
                  let iconHtml = "";
                  if (trend.includes("Improvement")) {
                    iconHtml = `<i class="fas fa-arrow-up" style="color: green;"></i>`;
                  } else if (trend.includes("Decline")) {
                    iconHtml = `<i class="fas fa-arrow-down" style="color: red;"></i>`;
                  } else if (trend.includes("No changes")) {
                    iconHtml = `<i class="fas fa-minus" style="color: goldenrod;"></i>`;
                  }
                  return `<li>${trend} ${iconHtml}</li>`;
                })
                .join("");

              insightsHtml = `
                <p><strong>${interpretationResponse.initial}</strong></p>
                <ul>${trendsList}</ul>
              `;
            } else {
              if (
                interpretationResponse.strength &&
                interpretationResponse.weakness
              ) {
                let iconHtml = "";
                insightsHtml = `
              <p><strong>Excels In: </strong>${interpretationResponse.strength} <i class="fas fa-arrow-up" style="color: green;"></i></p>
              <p><strong>Difficulties In: </strong>${interpretationResponse.weakness} <i class="fas fa-arrow-down" style="color: red;"></i></p>
              `;
              } else {
                insightsHtml = "";
              }
            }

            const recommendation = interpretationResponse.recommendation
              ? `<p><strong>Recommendation: </strong>${interpretationResponse.recommendation}</p>`
              : "";

            // Combine everything into a single HTML block
            interpretationSpan.innerHTML = `
              ${legendHtml}
              ${interpretation}
              ${insightsHtml}
              ${recommendation}
            `;
          },
          error: function (xhr, status, error) {
            const interpretationSpan = document.getElementById(
              "subjectInterpretation"
            );
            interpretationSpan.innerHTML = `<p style="color: red;">Failed to fetch interpretation data.</p>`;
          },
        });
      },
      error: function (xhr, status, error) {
        const interpretationSpan = document.getElementById(
          "subjectInterpretation"
        );
        interpretationSpan.innerHTML = `<p style="color: red;">Error fetching data for student full bar chart</p>`;
      },
    });
  }

  function getSubjectTitle(subject) {
    switch (subject) {
      case "AP":
        return "Araling Panlipunan";
      case "ENG":
        return "English";
      case "ESP":
        return "ESP";
      case "FIL":
        return "Filipino";
      case "MAPEH":
        return "MAPEH";
      case "MATH":
        return "Mathematics";
      case "MT":
        return "Mother Tongue";
      case "EPP":
        return "EPP";
      case "SCI":
        return "Science";
      default:
        return "Unknown Subject";
    }
  }

  function showAlert(icon, title, message) {
    Swal.fire({
      icon: icon,
      title: title,
      text: message,
      confirmButtonColor: "#4CAF50",
    });
  }

  function getRemarksIcon(remarks) {
    if (remarks === "Outstanding") {
      return "/assets/images/outstanding.png";
    } else if (remarks === "Very Satisfactory") {
      return "/assets/images/very-good.png";
    } else if (remarks === "Satisfactory") {
      return "/assets/images/good.png";
    } else if (remarks === "Fairly Satisfactory") {
      return "/assets/images/fair.png";
    } else {
      return "/assets/images/at-risk.png";
    }
  }

  function getPerformanceIcon(performance) {
    if (performance == "Passed") {
      return "/assets/images/passed.png";
    } else {
      return "/assets/images/at-risk.png";
    }
  }

  function disableStudentAccount(studentId) {
    const data = new FormData();
    data.append("submitType", "disableStudentAccount");
    data.append("student_id", studentId);

    fetch("/backend/global.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.text()) // Get the response as plain text
      .then((statusCode) => {
        if (statusCode === "200") {
          Swal.fire({
            icon: "info",
            title: "Student Account Disabled",
            text: "The Student will now be unable to login to their account.",
            confirmButtonColor: "#4CAF50",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          showAlert("error", "System Error", "Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching panel data:", error);
      });
  }

  function enableStudentAccount(studentId) {
    const data = new FormData();
    data.append("submitType", "enableStudentAccount");
    data.append("student_id", studentId);

    fetch("/backend/global.php", {
      method: "POST",
      body: data,
    })
      .then((response) => response.text()) // Get the response as plain text
      .then((statusCode) => {
        if (statusCode === "200") {
          Swal.fire({
            icon: "success",
            title: "Student Account Enabled",
            text: "The Student will now be able to login to their account.",
            confirmButtonColor: "#4CAF50",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          showAlert("error", "System Error", "Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching panel data:", error);
      });
  }
});
