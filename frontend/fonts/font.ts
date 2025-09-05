import {
  IBM_Plex_Sans,
  Inter,
  Lato,
  Nunito_Sans,
  Poppins,
} from "next/font/google";
export const inter = Inter({
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
});

export const lato = Lato({
  weight: ["300", "400", "700"],
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "900"],
  subsets: ["latin"],
  display: "fallback",
  preload: true,
});

export const IBM = IBM_Plex_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "fallback",
  preload: true,
});

export const Nunito = Nunito_Sans({
  weight: ["200", "400", "500", "600", "700", "900"],
  subsets: ["latin"],
  display: "fallback",
  preload: true,
});
