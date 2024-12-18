<div class="sidebar">
    <div class="head">
        <div class="school-img">
            <img src="/SCES/assets/images/logo.png" alt="SCES Logo" />
        </div>
        <div class="school-details">
            <p class="title">SCES</p>
        </div>
    </div>
    <div class="nav">
        <div class="menu">
            <ul>
                <li class="<?= $current_page == 'dashboard' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/dashboard">
                        <i class="fa-solid fa-house icon"></i>
                        <span class="text">Home</span>
                    </a>
                </li>
                <li class="<?= $current_page == 'profile' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/profile">
                        <i class="fa-solid fa-user icon"></i>
                        <span class="text">My Profile</span>
                    </a>
                </li>
                <li class="<?= $current_page == 'subject' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/subject">
                        <i class="fa-solid fa-briefcase icon"></i>
                        <span class="text">Subjects</span>
                    </a>
                </li>
                <li class="<?= $current_page == 'quizzes' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/quizzes">
                        <i class="fa-solid fa-pen-to-square icon"></i>
                        <span class="text">Quizzes</span>
                    </a>
                </li>
                <li class="<?= $current_page == 'settings' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/settings">
                        <i class="fa-solid fa-gear icon"></i>
                        <span class="text">Settings</span>
                    </a>
                </li>
                <li class="<?= $current_page == 'help' ? 'active' : '' ?>">
                    <a href="/SCES/frontend/student/help">
                        <i class="fa-solid fa-circle-info icon"></i>
                        <span class="text">Help</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="menu">
        <ul>
            <li>
                <a href="javascript:void(0)" onclick="logoutFunc()">
                    <i class="fa-solid fa-right-from-bracket icon"></i>
                    <span class="text">Logout</span>
                </a>
            </li>
        </ul>
    </div>
</div>