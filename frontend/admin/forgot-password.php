<?php
include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/head.php';
?>
<title>Forgot Password | SCES Online Learning Platform</title>
</head>

<body>
    <div class="max-content">
        <div class="flex-container">
            <div class="column left">
                <div class="opening">
                    <h1>Hi There, Admin!</h1>
                    <h1>Let's Recover Your Account</h1>
                </div>
                <div class="wrapper">
                    <img src="/assets/images/login-admin.png" alt="sign up icon" class="img-500px" />
                </div>
            </div>
            <div class="column right">
                <div class="form-wrapper">
                    <form id="adminForgotPass">
                        <img src="/assets/images/logo.png" alt="sces logo" class="logo-img" />
                        <h1>Recover Account</h1>
                        <div class="input-icons-recover">
                            <span>Please enter your registered email. After verification, a password reset link will be
                                sent to your account.</span>
                        </div>
                        <div class="input-icons">
                            <label for="email">
                                <i class="fa-solid fa-envelope icon"></i>
                            </label>
                            <input type="email" name="email" id="email" placeholder="Enter Email" />
                        </div>
                        <button type="submit" id="adminForgotPassBtn">Send Link</button>
                    </form>
                </div>
                <br>
                <div class="separator">Or</div>
                <br>
                <a href="login.php" class="button-container">
                    <div class="btn-wrapper">
                        <h1>Return To Login</h1>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <?php
    include $_SERVER['DOCUMENT_ROOT'] . '/frontend/admin/partials/footer.php';
    ?>