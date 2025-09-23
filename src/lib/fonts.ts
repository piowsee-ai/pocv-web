import localFont from 'next/font/local';
import { Geist, Poppins, Inter } from "next/font/google";

export const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ["latin"],
});

export const poppins = Poppins({
    subsets: ["latin"],
    variable: '--font-inter',
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const inter = Inter({
    subsets: ["latin"],
    variable: '--font-poppins',
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const sfpro = localFont({
    src: [
        { path: '../fonts/sf-pro/SF-Pro-Display-Black.otf', weight: '900', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-BlackItalic.otf', weight: '900', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Bold.otf', weight: '700', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-BoldItalic.otf', weight: '700', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Heavy.otf', weight: '800', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-HeavyItalic.otf', weight: '800', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Light.otf', weight: '300', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-LightItalic.otf', weight: '300', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Medium.otf', weight: '500', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-MediumItalic.otf', weight: '500', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Regular.otf', weight: '400', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-RegularItalic.otf', weight: '400', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Semibold.otf', weight: '600', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-SemiboldItalic.otf', weight: '600', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Thin.otf', weight: '100', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-ThinItalic.otf', weight: '100', style: 'italic' },
        { path: '../fonts/sf-pro/SF-Pro-Display-Ultralight.otf', weight: '200', style: 'normal' },
        { path: '../fonts/sf-pro/SF-Pro-Display-UltralightItalic.otf', weight: '200', style: 'italic' },
    ],
    display: 'swap',
    variable: '--font-sf-pro',
    fallback: ['sans-serif'],
});