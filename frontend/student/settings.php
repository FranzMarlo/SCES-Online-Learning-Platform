<?php
include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-head.php';
?>
<link rel="stylesheet" href="/assets/style/student-settings.css" />
<script src="/assets/script/settings.js"></script>
<title>Settings | SCES Online Learning Platform</title>
</head>

<body>
	<?php
	include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-popup.php';
	?>
	<div class="container">
		<?php
		include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-sidebar.php';
		?>
		<div class="content">
			<?php
			include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-header.php';
			?>
			<div class="title-box">
				<h1>Account Settings</h1>
			</div>
			<div class="settings-container">
				<div class="side-panel">
					<button class="panel-item" id="profileBtn">My Profile</button>
					<button class="panel-item" id="securityBtn">Security</button>
				</div>
				<div class="main-panel" id="profileTab">
					<div class="panel-title">
						<h1>My Profile</h1>
					</div>
					<div class="user-profile">
						<div class="profile-part">
							<div class="user-icon">
								<img src="/storage/student/images/<?php echo $image; ?>" alt="user icon"
									id="current-user-avatar">
								<img src="/assets/images/change-avatar.png" alt="user icon"
									id="change-avatar-icon">
							</div>
							<div class="profile-info">
								<h1><?php echo htmlspecialchars($studentFname . ' ' . $studentLname); ?></h1>
								<span><?php echo htmlspecialchars($gradeLevel . ' - ' . $section); ?></span>
								<span>Student ID: <?php echo htmlspecialchars($studentId); ?></span>
							</div>
						</div>
						<div class="profile-part">
							<div class="button-container">
								<button class="edit-btn" id="edit-profile-info">Edit<i
										class="fa-solid fa-pencil"></i></button>
							</div>
						</div>
					</div>
					<div class="current-user-info">
						<div class="current-user-info-header">
							<div class="current-user-header-title">
								<h2>Personal Information</h2>
							</div>
							<div class="info-button-container">
								<button class="edit-btn" id="edit-personal-info">Edit<i
										class="fa-solid fa-pencil"></i></button>
							</div>
						</div>
						<div class="info-content">
							<div class="info-part">
								<div class="info-data">
									<span>First Name</span>
									<p><?php echo htmlspecialchars($studentFname); ?></p>
								</div>
								<div class="info-data">
									<span>Last Name</span>
									<p><?php echo htmlspecialchars($studentLname); ?></p>
								</div>
								<div class="info-data">
									<span>Middle Name</span>
									<p><?php echo htmlspecialchars($studentMname); ?></p>
								</div>
							</div>
							<div class="info-part">
								<div class="info-data">
									<span>Suffix</span>
									<p><?php echo htmlspecialchars($studentSuffix); ?></p>
								</div>
								<div class="info-data">
									<span>Age</span>
									<p><?php echo ($age == 0) ? 'Not Set' : htmlspecialchars($age); ?></p>
								</div>
								<div class="info-data">
									<span>Gender</span>
									<p><?php echo htmlspecialchars($gender); ?></p>
								</div>
							</div>
						</div>
					</div>
					<div class="current-user-info">
						<div class="current-user-info-header">
							<div class="current-user-header-title">
								<h2>Background Information</h2>
							</div>
							<div class="info-button-container">
								<button class="edit-btn" id="edit-background-info">Edit<i
										class="fa-solid fa-pencil"></i></button>
							</div>
						</div>
						<div class="info-content">
							<div class="info-part">
								<div class="info-data">
									<span>City/State</span>
									<p><?php echo htmlspecialchars($city); ?></p>
								</div>
								<div class="info-data">
									<span>Barangay</span>
									<p><?php echo htmlspecialchars($barangay); ?></p>
								</div>
								<div class="info-data">
									<span>Street</span>
									<p><?php echo htmlspecialchars($street); ?></p>
								</div>
							</div>
							<div class="info-part">
								<div class="info-data">
									<span>Email Address</span>
									<p><?php echo htmlspecialchars($email); ?></p>
								</div>
								<div class="info-data">
									<span>Guardian Full Name</span>
									<p><?php echo htmlspecialchars($guardianName); ?></p>
								</div>
								<div class="info-data">
									<span>Guardian Contact Number</span>
									<p><?php echo htmlspecialchars($guardianContact); ?></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="main-panel" id="securityTab">
					<div class="panel-title">
						<h1>Security</h1>
					</div>
					<div class="current-user-info">
						<div class="current-user-info-header">
							<div class="current-user-header-title padded">
								<h2>Security Options</h2>
							</div>
						</div>
						<div class="info-content">
							<div class="security-panel">
								<div class="security-data" id="changePassword">
									<div class="security-part">
										<i class="fa-solid fa-lock"></i>
										<div class="data-text">
											<span>Change Password</span>
											<p><?php echo htmlspecialchars($passwordChange == NULL) ? 'Unchanged' : 'Last Changed ' . $passwordChange; ?>
											</p>
										</div>
									</div>
									<i class="fa-solid fa-chevron-right"></i>
								</div>
								<div class="security-data" id="verifyEmail">
									<div class="security-part">
										<i class="fa-solid fa-envelope-circle-check"></i>
										<div class="data-text">
											<span>Verify Email</span>
											<p><?php echo htmlspecialchars($emailVerification); ?></p>
										</div>
									</div>
									<i class="fa-solid fa-chevron-right"></i>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
	<?php
	include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-edit-modal.php';
	include $_SERVER['DOCUMENT_ROOT'] . '/frontend/student/partials/student-footer.php';
	?>