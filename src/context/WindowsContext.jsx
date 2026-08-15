import { createContext, useContext, useState } from "react";

const WindowsContext = createContext(null);

export function WindowsProvider({ children }) {
	const [showWelcome, setShowWelcome] = useState(true);
	const [showAboutMe, setShowAboutMe] = useState(true);
	const [showSocial, setShowSocial] = useState(true);
	const [showProjects, setShowProjects] = useState(true);
	const [showCV, setShowCV] = useState(true);
	const [clippyMessage, setClippyMessage] = useState(null);
	const [clippyMood, setClippyMood] = useState("idle"); // "idle" | "talk" | "shovel"

	const triggerCVDownload = () => {
		setClippyMood("shovel");
		setClippyMessage("¡Descargando tu CV!");
		setTimeout(() => {
			setClippyMood("idle");
			setClippyMessage(null);
		}, 2500);
	};

	const value = {
		showWelcome,
		openWelcome: () => setShowWelcome(true),
		closeWelcome: () => setShowWelcome(false),
		toggleWelcome: () => setShowWelcome((v) => !v),

		showAboutMe,
		openAboutMe: () => setShowAboutMe(true),
		closeAboutMe: () => setShowAboutMe(false),
		toggleAboutMe: () => setShowAboutMe((v) => !v),

		showSocial,
		openSocial: () => setShowSocial(true),
		closeSocial: () => setShowSocial(false),
		toggleSocial: () => setShowSocial((v) => !v),

		showProjects,
		openProjects: () => setShowProjects(true),
		closeProjects: () => setShowProjects(false),
		toggleProjects: () => setShowProjects((v) => !v),

		showCV,
		openCV: () => setShowCV(true),
		closeCV: () => setShowCV(false),
		toggleCV: () => setShowCV((v) => !v),

		clippyMessage,
		setClippyMessage,
		clippyMood,
		setClippyMood,
		triggerCVDownload,
	};

	return (
		<WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>
	);
}

export function useWindows() {
	const ctx = useContext(WindowsContext);
	if (!ctx) throw new Error("useWindows debe usarse dentro de <WindowsProvider>");
	return ctx;
}
