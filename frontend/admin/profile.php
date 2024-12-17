<?php
include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/admin-head.php';
include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/helper.php';
$page = '';
?>
<link rel="stylesheet" href="/assets/style/admin-profile.css" />
<title>My Profile | SCES Online Learning Platform</title>
</head>

<body>
    <?php
    include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/admin-popup.php';
    ?>
    <div class="container">
        <?php
        include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/admin-sidebar.php';
        ?>
        <div class="content">
            <?php
            include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/admin-header.php';
            ?>
            <div class="profile-panel">
                <div class="title-box">
                    <img src="/assets/images/<?php echo htmlspecialchars(getProfileImage($gender)); ?>"
                        alt="student-icon.png">
                    <h1>My Profile</h1>
                </div>
                <div class="profile-container">
                    <div class="profile-bg female">
                        <div class="id-box male">
                            <div class="id-image">
                                <img src="/storage/admin/images/<?php echo $image; ?>" alt="user icon">
                                <span><?php echo htmlspecialchars($teacherId); ?></span>
                            </div>
                            <div class="id-section">
                                <div class="id-logo">
                                    <div class="logo">
                                        <img src="/assets/images/logo.png" alt="SCES Logo" />
                                        <span class="blue">SCES</span>
                                    </div>
                                    <div class="motto blue-bg">
                                        <p>Serving with Compassion and Excellence towards Success</p>
                                    </div>
                                </div>
                                <hr class="dashed-line">
                                <div class="id-info">
                                    <div class="id-row">
                                        <div class="id-col-full">
                                            <p>NAME</p>
                                            <span><?php echo htmlspecialchars(getPronoun($gender) . ' ' .  strtoupper($teacherFname) .' '. strtoupper($teacherLname)); ?></span>
                                        </div>
                                    </div>
                                    <div class="id-row">
                                        <div class="id-col">
                                            <p>SCES</p>
                                            <span><?php echo htmlspecialchars(strtoupper($role)); ?></span>
                                        </div>
                                        <div class="id-col">
                                            <p>SCHOOL YEAR</p>
                                            <span><?php echo htmlspecialchars(getCurrentSchoolYear()); ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="side-controller">
                        <div class="tab-item" id="profileTab">My Profile</div>
                        <div class="tab-item" id="analyticsTab">Analytics</div>
                    </div>
                    <div class="profile-tab" id="profileContainer">
                        <div class="info-panel">
                            <div class="title-box">
                                <img src="/assets/images/personal-info.png" alt="personal-info.png">
                                <h1>Personal Information</h1>
                            </div>
                            <div class="info-row">
                                <div class="info-col">
                                    <p>Last Name</p>
                                    <span><?php echo htmlspecialchars($teacherLname); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>First Name</p>
                                    <span><?php echo htmlspecialchars($teacherFname); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Middle Name</p>
                                    <span><?php echo htmlspecialchars($teacherMname); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Suffix</p>
                                    <span><?php echo htmlspecialchars($teacherSuffix); ?></span>
                                </div>
                            </div>
                            <div class="info-row">
                                <div class="info-col">
                                    <p>Gender</p>
                                    <span><?php echo htmlspecialchars($gender); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Age</p>
                                    <span><?php echo htmlspecialchars($age); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="info-panel">
                            <div class="title-box">
                                <img src="/assets/images/school-info.png" alt="school-info.png">
                                <h1>School Information</h1>
                            </div>
                            <div class="info-row">
                                <div class="info-col">
                                    <p>Teacher ID</p>
                                    <span><?php echo htmlspecialchars($teacherId); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Role</p>
                                    <span><?php echo htmlspecialchars($role); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Email</p>
                                    <span><?php echo htmlspecialchars($email); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Contact Number</p>
                                    <span><?php echo htmlspecialchars($contactNumber); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="info-panel">
                            <div class="title-box">
                                <img src="/assets/images/background-info.png" alt="background-info.png">
                                <h1>Background Information</h1>
                            </div>
                            <div class="info-row">
                                <div class="info-col">
                                    <p>City/State</p>
                                    <span><?php echo htmlspecialchars($city); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Barangay</p>
                                    <span><?php echo htmlspecialchars($barangay); ?></span>
                                </div>
                                <div class="info-col">
                                    <p>Street</p>
                                    <span><?php echo htmlspecialchars($street); ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-tab" id="analyticsContainer">
                        <div class="title-box">
                            <img src="/assets/images/profile-analytics.png" alt="profile-analytics.png">
                            <h1>Analytics</h1>
                        </div>
                        <div class="stats-panel">
                            <div class="panel-box">
                                <?php $totalTeacherLesson = $db->getTotalTeacherLesson($teacherId); ?>
                                <img src="/assets/images/quiz-lesson.png" alt="quiz-lesson.png">
                                <div class="panel-col">
                                    <p>Uploaded Lessons</p>
                                    <span><?php echo htmlspecialchars($totalTeacherLesson); ?></span>
                                </div>
                            </div>
                            <div class="panel-box">
                                <?php $totalTeacherStudent = $db->getTotalTeacherStudent($teacherId); ?>
                                <img src="/assets/images/quiz-grade-section.png" alt="quiz-grade-section.png">
                                <div class="panel-col">
                                    <p>Handled Students</p>
                                    <span><?php echo htmlspecialchars($totalTeacherStudent); ?></span>
                                </div>
                            </div>
                            <div class="panel-box">
                                <?php $totalQuizzes = $db->teacherGetQuizzesCount($teacherId); ?>
                                <img src="/assets/images/quiz-passed.png" alt="quiz-passed.png">
                                <div class="panel-col">
                                    <p>Completed Quizzes</p>
                                    <span><?php echo htmlspecialchars($totalQuizzes); ?></span>
                                </div>
                            </div>
                            <div class="panel-box">
                                <?php $totalPending = $db->teacherGetPendingQuizzesCount($teacherId); ?>
                                <img src="/assets/images/quiz-pending.png" alt="quiz-pending.png">
                                <div class="panel-col">
                                    <p>Pending Quizzes</p>
                                    <span><?php echo htmlspecialchars($totalPending); ?></span>
                                </div>
                            </div>
                        </div>
                        <div class="graph-container">
                            <div class="graph">
                                <canvas id="pieChart"></canvas>
                            </div>
                            <div class="graph">
                                <canvas id="barChart"></canvas>
                            </div>
                        </div>
                        <div class="graph-container">
                            <div class="full-graph">
                                <canvas id="lineChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <?php
            include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/admin-footer.php';
            ?>
            <script src="/assets/script/admin-profile.js"></script>