</div>
<div class="overlay"></div>
<script src="/vendor/node_modules/jquery/dist/jquery.min.js"></script>
<script src="/vendor/node_modules/sweetalert2/dist/sweetalert2.all.min.js"></script>
<script src="/assets/script/global.js"></script>
<script src="/assets/script/home.js"></script>
<?php
if ($accountStatus === 'True') {
    echo "
    <script>
            Swal.fire({
                icon: 'warning',
                title: 'Account Disabled',
                text: 'Your account has been disabled. If this is wrong, please contact your adviser.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#4CAF50',
                allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
            window.location.href = '/backend/student/student-logout.php';
          }
          });
    </script>";
}
?>
</body>

</html>