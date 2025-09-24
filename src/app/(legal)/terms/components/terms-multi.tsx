"use client";

export default function PrivacyMulti({ lang }: { lang: "en" | "id" }) {
    return (
        <div>
            {lang === "en" ? (
                <div className="prose prose-neutral dark:prose-invert">
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to <strong>pocv</strong>, a product operated by <strong>piowsee.ai</strong>. ! These Terms of Service
                        (“Terms”) govern your use of our website and services. By using our
                        service, you agree to follow these Terms.
                    </p>

                    <h2>2. Your Account</h2>
                    <p>
                        You are responsible for maintaining the confidentiality of your
                        account and password. You are also responsible for any activity
                        under your account.
                    </p>

                    <h2>3. User Content</h2>
                    <p>
                        You own the content you upload (such as resumes, personal details,
                        etc.). By uploading, you give us permission to store and
                        process it so we can provide the service. You must not upload
                        unlawful, offensive, or misleading information.
                    </p>

                    <h2>4. Service Usage</h2>
                    <p>
                        You agree not to misuse our service, including attempting
                        unauthorized access, disrupting operations, or using the platform
                        for fraudulent activities.
                    </p>

                    <h2>5. Termination</h2>
                    <p>
                        We may suspend or terminate your account if you violate these Terms
                        or misuse the service.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        We are not responsible for job outcomes, hiring decisions, or any
                        indirect damages resulting from using the service. Our liability is
                        limited to the maximum extent allowed by law.
                    </p>

                    <h2>7. Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. Changes will be posted
                        here, and significant updates may be sent via email.
                    </p>

                    <h2>8. Contact Us</h2>
                    <p>
                        For questions about these Terms, contact us at{" "}
                        <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                    </p>
                </div>
            ) : (
                <div className="prose prose-neutral dark:prose-invert">
                    <h2>1. Pendahuluan</h2>
                    <p>
                        Selamat datang di layanan pembuat CV online kami!
                        Syarat dan Ketentuan ini (“Syarat”) mengatur penggunaan situs web
                        dan layanan kami. Dengan menggunakan layanan ini, Anda setuju untuk
                        mematuhi Syarat ini.
                    </p>

                    <h2>2. Akun Anda</h2>
                    <p>
                        Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi Anda.
                        Anda juga bertanggung jawab atas semua aktivitas yang terjadi di
                        bawah akun Anda.
                    </p>

                    <h2>3. Konten Pengguna</h2>
                    <p>
                        Anda tetap memiliki hak atas konten yang Anda unggah (seperti CV,
                        data pribadi, dan portofolio). Dengan mengunggah, Anda memberi izin
                        kepada kami untuk menyimpan dan memprosesnya guna menyediakan
                        layanan. Anda dilarang mengunggah informasi yang melanggar hukum,
                        menyinggung, atau menyesatkan.
                    </p>

                    <h2>4. Penggunaan Layanan</h2>
                    <p>
                        Anda setuju untuk tidak menyalahgunakan layanan kami, termasuk
                        mencoba mengakses tanpa izin, mengganggu operasi sistem, atau
                        menggunakan platform untuk aktivitas penipuan.
                    </p>

                    <h2>5. Penghentian</h2>
                    <p>
                        Kami dapat menangguhkan atau menghentikan akun Anda jika Anda
                        melanggar Syarat ini atau menyalahgunakan layanan.
                    </p>

                    <h2>6. Batasan Tanggung Jawab</h2>
                    <p>
                        Kami tidak bertanggung jawab atas hasil lamaran kerja, keputusan
                        perekrutan, atau kerugian tidak langsung yang timbul akibat
                        penggunaan layanan. Tanggung jawab kami dibatasi sejauh yang
                        diizinkan oleh hukum.
                    </p>

                    <h2>7. Perubahan Syarat</h2>
                    <p>
                        Kami dapat memperbarui Syarat ini dari waktu ke waktu. Perubahan
                        akan dipublikasikan di halaman ini, dan pembaruan penting dapat
                        dikirim melalui email.
                    </p>

                    <h2>8. Hubungi Kami</h2>
                    <p>
                        Jika Anda memiliki pertanyaan tentang Syarat ini, hubungi kami di{" "}
                        <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                    </p>
                </div>
            )}
        </div >
    );
}