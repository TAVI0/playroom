import { useState } from "react";
import { CLIPPY_MOOD } from "../data/clippyMoods";
import { WindowsContext } from "./windowsContextObject";

export function WindowsProvider({ children }) {
	const [showWelcome, setShowWelcome] = useState(true);
	const [showAboutMe, setShowAboutMe] = useState(true);
	const [showSocial, setShowSocial] = useState(true);
	const [showSkills, setShowSkills] = useState(true);
	const [showProjects, setShowProjects] = useState(true);
	const [showCV, setShowCV] = useState(true);
	const [clippyMessage, setClippyMessage] = useState(null);
	const [clippyMood, setClippyMood] = useState(CLIPPY_MOOD.IDLE); // ver valores posibles en CLIPPY_MOOD

	const triggerCVDownload = () => {
		setClippyMood(CLIPPY_MOOD.SHOVEL);
		setClippyMessage("¡Descargando tu CV!");
		setTimeout(() => {
			setClippyMood(CLIPPY_MOOD.IDLE);
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

		showSkills,
		openSkills: () => setShowSkills(true),
		closeSkills: () => setShowSkills(false),
		toggleSkills: () => setShowSkills((v) => !v),

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

	return <WindowsContext.Provider value={value}>{children}</WindowsContext.Provider>;
}
