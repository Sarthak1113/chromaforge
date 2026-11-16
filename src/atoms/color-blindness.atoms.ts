import { atom } from "jotai";
import { ColorBlindnessType } from "@/types/color";

export const colorBlindnessModeAtom = atom<ColorBlindnessType>("normal");
