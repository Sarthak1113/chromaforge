import { atom } from "jotai";

export const isExportModalOpenAtom = atom<boolean>(false);
export const isShadesModalOpenAtom = atom<boolean>(false);
export const shadesTargetColorIdAtom = atom<string | null>(null);
export const isAdjusterModalOpenAtom = atom<boolean>(false);
export const adjusterTargetColorIdAtom = atom<string | null>(null);
export const isShortcutsModalOpenAtom = atom<boolean>(false);
export const isVisualizerModalOpenAtom = atom<boolean>(false);
export const isThemeSettingsSheetOpenAtom = atom<boolean>(false);
