"use client";

export default function PrivacyMulti({ lang }: { lang: "en" | "id" }) {
    return (
        <div>
            {lang === "en" ? (
                <div className="prose prose-neutral dark:prose-invert">
                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect personal information you provide when creating a
                        CV, such as your name, email address, work experience,
                        education, and/or uploaded files.
                    </p>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        Your data is used to generate your CV, enable sharing via links, and
                        improve our services. We may also send important service updates.
                    </p>

                    <h2>3. Cookies</h2>
                    <p>
                        We use cookies to improve your experience. You may disable them in
                        your browser settings.
                    </p>

                    <h2>4. Data Sharing</h2>
                    <p>
                        We do not sell your data. Limited sharing occurs only with service
                        providers (hosting, analytics) or when legally required.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You can request access, updates, or deletion of your data at{" "}
                        <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                    </p>
                </div>
            ) : (
                <div className="prose prose-neutral dark:prose-invert">
                    <h2>1. Informasi yang Kami Kumpulkan</h2>
                    <p>
                        Kami mengumpulkan data pribadi yang Anda berikan saat membuat
                        CV, seperti nama, alamat email, pengalaman kerja,
                        pendidikan, dan/atau file yang diunggah.
                    </p>

                    <h2>2. Cara Kami Menggunakan Informasi Anda</h2>
                    <p>
                        Data Anda digunakan untuk membuat CV, memungkinkan Anda membagikannya
                        melalui tautan, serta meningkatkan layanan kami. Kami juga dapat
                        mengirim pembaruan penting.
                    </p>

                    <h2>3. Cookies</h2>
                    <p>
                        Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Anda
                        dapat menonaktifkannya di pengaturan browser.
                    </p>

                    <h2>4. Berbagi Data</h2>
                    <p>
                        Kami tidak menjual data Anda. Berbagi data hanya dilakukan dengan
                        penyedia layanan (hosting, analitik) atau jika diwajibkan oleh hukum.
                    </p>

                    <h2>5. Hak Anda</h2>
                    <p>
                        Anda dapat meminta akses, pembaruan, atau penghapusan data dengan
                        menghubungi kami di{" "}
                        <a href="mailto:support@piowsee.com">support@piowsee.com</a>.
                    </p>
                </div>
            )}
        </div>
    );
}
