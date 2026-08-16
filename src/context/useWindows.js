import { useContext } from "react";
import { WindowsContext } from "./windowsContextObject";

export function useWindows() {
	const ctx = useContext(WindowsContext);
	if (!ctx) throw new Error("useWindows debe usarse dentro de <WindowsProvider>");
	return ctx;
}
