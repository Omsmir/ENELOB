// import { ObjectType } from "@/types";

import { ObjectType, tone } from "@/types";
import {
  Calendar,
  Home,
  LayoutDashboard,
  MessageCircle,
  Search,
} from "lucide-react";
export const SideBarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: false,
    sideItemTitle: "dashboard",
    sideItemState: true,
  },
  {
    title: "messages",
    url: "/dashboard/messages",
    icon: MessageCircle,
    group: false,
  },
  {
    title: "discover friends",
    url: "/dashboard/discover",
    icon: Search,
    group: false,
  },
];

export const genders = [
  "Male",
  "Female",
  "Non-Binary",
  "Genderfluid",
  "Genderqueer",
  "Agender",
  "Bigender",
  "Two-Spirit",
  "Demiboy",
  "Demigirl",
  "Androgynous",
  "Neutrois",
  "Transgender Male",
  "Transgender Female",
  "Intersex",
  "Pangender",
  "Third Gender",
  "Maverique",
  "Polygender",
  "Omnigender",
  "Xenogender",
];
const existingNotfications = ["system", "message"];
export const notificationSounds = (
  tone:tone
): string | null => {
  const checkValue = existingNotfications.indexOf(tone);

  if (checkValue === -1) {
    throw new Error(`No notifications assigned with name:${tone}`);
  }
  const systemSounds = {
    system: {
      title: "public",
      tone: "/assets/audio/airport-call-157168.mp3",
    },
    message: {
      title: "AdminOnly",
      tone: "/assets/audio/appointment.mp3",
    },
  };
  return systemSounds[tone as keyof typeof systemSounds].tone;
};
