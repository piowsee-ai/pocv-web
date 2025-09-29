import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export function Footer() {
    return (
        <footer className="w-full border-t border-neutral-200 py-6 text-sm">
            <div className="container mx-auto flex max-w-7xl flex-col gap-10 px-6 md:flex-row md:justify-between">
                <div className="w-full max-w-xs space-y-4 ml-4">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-neutral-800">
                        <Image
                            src="/logo-192.png"
                            alt="Logo"
                            width={24}
                            height={24}
                        />
                        <span className='relative top-[-1px]'>pocv</span>
                    </Link>
                    <p className="text-neutral-500">
                        <span className="font-semibold text-foreground">pocv</span> dari piowsee.ai membantu kamu membuat CV modern yang rapi, cepat, dan ramah ATS untuk mendukung kariermu.

                    </p>
                    <p className="text-xs font-inter font-light text-neutral-400 tracking-tight">Copyright © 2025 - All rights reserved</p>
                    <div className="flex items-center gap-2 text-xs text-green-600">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>All systems operational</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-16 sm:grid-cols-2">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-neutral-800">LINKS</h3>
                        <ul className="space-y-2 text-neutral-500">
                            {/* <li><Link href="#" className="hover:text-neutral-800">Blog</Link></li> */}
                            <li><Link href="#" className="hover:text-neutral-800">Bantuan</Link></li>
                            <li><Link href="#" className="hover:text-neutral-800">Demo</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4 mr-4">
                        <h3 className="font-semibold text-neutral-800">LEGAL</h3>
                        <ul className="space-y-2 text-neutral-500">
                            <li><Link href="/terms" className="hover:text-neutral-800">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-neutral-800">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-4 mr-4 text-right">
                    <h3 className="font-semibold text-neutral-800">FOLLOW US</h3>
                    <div className="flex gap-4 text-neutral-500">
                        <Link href="https://instagram.com/piowsee.ai" target="_blank">
                            <FaInstagram className="h-5 w-5 hover:text-neutral-800 transition-colors" />
                        </Link>
                        <Link href="https://twitter.com/piowsee_ai" target="_blank">
                            <FaTwitter className="h-5 w-5 hover:text-neutral-800 transition-colors" />
                        </Link>
                        <Link href="https://linkedin.com/company/piowsee-ai" target="_blank">
                            <FaLinkedinIn className="h-5 w-5 hover:text-neutral-800 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* <div className="container mx-auto mt-12 max-w-7xl border-t border-neutral-200 px-6 pt-8">
                <h3 className="mb-6 text-center font-semibold text-neutral-800">Featured On</h3>
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    <Image src="/placeholder-logo.svg" alt="Featured company 1" width={100} height={32} className="opacity-60 grayscale" />
                    <Image src="/placeholder-logo.svg" alt="Featured company 2" width={100} height={32} className="opacity-60 grayscale" />
                    <Image src="/placeholder-logo.svg" alt="Featured company 3" width={100} height={32} className="opacity-60 grayscale" />
                </div>
                <p className="mt-6 text-center text-xs text-neutral-500">
                    Review us on <Link href="#" className="font-medium text-neutral-700 underline">Trustpilot</Link>
                </p>
            </div> */}
        </footer>
    );
}