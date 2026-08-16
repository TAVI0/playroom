import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ethers } from "ethers";
import { useDraggableWindow } from "../hooks/useDraggableWindow";
import { useHoverHint } from "../hooks/useHoverHint";
import { CONTRACT_ADDRESS, TOKEN_SYMBOL, TOKEN_DECIMALS, TOKEN_IMAGE } from "../config/tavioCoin";
import TavioCoinABI from "../abi/tavioCoinABI.json";
import { Z_INDEX } from "../config/windows";

export default function ProjectModal({ project, open, onClose, clickPos }) {
	const hoverHint = useHoverHint("Probá mover las ventanas");
	const [account, setAccount] = useState(null);
	const [claimStatus, setClaimStatus] = useState("");
	const [isClaiming, setIsClaiming] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);

	const images = project?.images?.length ? project.images : project?.image ? [project.image] : [];

	// La ventana siempre termina centrada en el escritorio (web);
	// clickPos solo se usa como punto de partida de la animación.
	const centeredPos = {
		x: Math.max(window.innerWidth / 2 - 260, 16),
		y: Math.max(window.innerHeight / 2 - 200, 16),
	};
	const { modalRef, pos, handleMouseDown, openFrom } = useDraggableWindow(
		open,
		centeredPos,
		clickPos,
	);

	// Al cambiar de proyecto, siempre arranca en la primera imagen
	useEffect(() => {
		setImageIndex(0);
	}, [project?.name]);

	const prevImage = () => setImageIndex((i) => (i - 1 + images.length) % images.length);
	const nextImage = () => setImageIndex((i) => (i + 1) % images.length);

	// Wallet: conectar MetaMask
	async function connectWallet() {
		if (!window.ethereum) return alert("Instalá MetaMask para continuar.");
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await provider.send("eth_requestAccounts", []);
		setAccount(accounts[0]);
	}

	// Wallet: reclamar tokens
	async function claimTokens() {
		try {
			setIsClaiming(true);
			setClaimStatus("🚀 Ejecutando transacción...");
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(CONTRACT_ADDRESS, TavioCoinABI, signer);

			const tx = await contract.claim();
			await tx.wait();
			setClaimStatus("✅ Claim realizado con éxito!");
		} catch (err) {
			console.error(err);
			setClaimStatus("❌ Error al ejecutar claim");
		} finally {
			setIsClaiming(false);
		}
	}

	// Wallet: agregar el token a MetaMask (click en la imagen del token)
	async function addTokenToMetaMask() {
		try {
			if (!window.ethereum) return alert("Necesitás tener MetaMask instalada.");

			const wasAdded = await window.ethereum.request({
				method: "wallet_watchAsset",
				params: {
					type: "ERC20",
					options: {
						address: CONTRACT_ADDRESS,
						symbol: TOKEN_SYMBOL,
						decimals: TOKEN_DECIMALS,
						image: TOKEN_IMAGE,
					},
				},
			});

			alert(wasAdded ? "🦊 TavioCoin agregado a tu MetaMask" : "❌ Acción cancelada");
		} catch (error) {
			console.error(error);
			alert("Ocurrió un error al intentar agregar el token.");
		}
	}

	if (!project) return null;

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					ref={modalRef}
					initial={{
						opacity: 0,
						scale: 0.4,
						x: openFrom.x,
						y: openFrom.y,
					}}
					animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{
						default: { type: "spring", stiffness: 200, damping: 22 },
						x: { type: "tween", duration: 0 },
						y: { type: "tween", duration: 0 },
					}}
					className="win95-window fixed w-[92vw] max-w-lg p-[3px] font-win95 select-none"
					style={{ top: 0, left: 0, zIndex: Z_INDEX.modal }}
				>
					{/* Barra de título */}
					<div className="win95-titlebar cursor-move" onMouseDown={handleMouseDown} {...hoverHint}>
						<span className="flex items-center gap-1 truncate">
							<span aria-hidden>{project.icon}</span> {project.name}.exe
						</span>
						<div className="flex items-center gap-[2px]">
							<button onClick={onClose} className="win95-title-btn">
								_
							</button>
							<button className="win95-title-btn" tabIndex={-1}>
								□
							</button>
							<button onClick={onClose} className="win95-title-btn">
								×
							</button>
						</div>
					</div>

					{/* Contenido */}
					<div className="bg-win95-face p-3 max-h-[85vh] overflow-y-auto">
						{/* Galería */}
						<div className="win95-inset bg-black w-full h-64 sm:h-72 overflow-hidden mb-1 relative">
							<img
								key={images[imageIndex]}
								src={images[imageIndex]}
								alt={`${project.name} captura ${imageIndex + 1}`}
								className="w-full h-full object-cover"
							/>

							{images.length > 1 && (
								<>
									<button
										onClick={prevImage}
										className="win95-btn absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-sm"
									>
										‹
									</button>
									<button
										onClick={nextImage}
										className="win95-btn absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-sm"
									>
										›
									</button>
								</>
							)}
						</div>

						{images.length > 1 && (
							<div className="flex justify-center gap-1.5 mb-3">
								{images.map((_, i) => (
									<button
										key={i}
										onClick={() => setImageIndex(i)}
										aria-label={`Ver imagen ${i + 1}`}
										className={`w-2.5 h-2.5 border border-black ${
											i === imageIndex ? "bg-win95-navy" : "bg-win95-face"
										}`}
									/>
								))}
							</div>
						)}

						<div className="win95-inset bg-white text-black p-3">
							<p className="font-bold mb-2">{project.name}</p>
							<p className="text-sm text-gray-800 mb-3">{project.description}</p>

							{project.tech && (
								<>
									<p className="text-xs font-bold text-gray-600 mb-1">Tecnologías utilizadas</p>
									<ul className="text-xs text-gray-700 space-y-0.5 mb-1">
										{project.tech.map((t) => (
											<li key={t}>• {t}</li>
										))}
									</ul>
								</>
							)}
						</div>

						{project.isWeb3 && (
							<div className="win95-inset bg-white text-black p-3 mt-1 text-center">
								<button
									onClick={account ? claimTokens : connectWallet}
									disabled={isClaiming}
									className="win95-btn px-4 py-1 text-sm font-win95 w-full"
								>
									{isClaiming
										? "⏳ Reclamando..."
										: account
											? "💰 Claim TavioCoin"
											: "🔗 Conectar Wallet"}
								</button>

								{account && (
									<p className="text-xs text-gray-600 mt-2">
										Wallet: {account.slice(0, 6)}...{account.slice(-4)} ·{" "}
										<button onClick={addTokenToMetaMask} className="text-win95-navy underline">
											agregar a MetaMask
										</button>
									</p>
								)}

								{claimStatus && (
									<p
										className={`text-xs mt-2 ${
											claimStatus.includes("✅")
												? "text-green-700"
												: claimStatus.includes("❌")
													? "text-red-700"
													: "text-gray-600"
										}`}
									>
										{claimStatus}
									</p>
								)}
							</div>
						)}

						{project.href && (
							<div className="flex justify-end mt-3">
								<a
									href={project.href}
									target="_blank"
									rel="noreferrer"
									className="win95-btn px-4 py-1 text-sm font-win95"
								>
									Ir a la app
								</a>
							</div>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
