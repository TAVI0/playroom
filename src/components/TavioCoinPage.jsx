import { useState } from "react";
import { ethers } from "ethers";
import TavioCoinABI from "../abi/TavioCoinABI.json";

const CONTRACT_ADDRESS = "0x9f05aB363f0978b621f97a8141e7Fee6CF6a1c3C";
const TOKEN_SYMBOL = "TAV";
const TOKEN_DECIMALS = 18;
const TOKEN_IMAGE = "public/images/coin.png"; // reemplazar luego por el gif del token girando 

export default function TavioCoinPage() {
	const [account, setAccount] = useState(null);
	const [status, setStatus] = useState("");
	const [isClaiming, setIsClaiming] = useState(false);

	// Conectar wallet
	async function connectWallet() {
		if (!window.ethereum) return alert("Instalá MetaMask para continuar.");
		const provider = new ethers.BrowserProvider(window.ethereum);
		const accounts = await provider.send("eth_requestAccounts", []);
		setAccount(accounts[0]);
	}

	// Claim tokens
	async function claimTokens() {
		try {
			setIsClaiming(true);
			setStatus("🚀 Ejecutando transacción...");
			const provider = new ethers.BrowserProvider(window.ethereum);
			const signer = await provider.getSigner();
			const contract = new ethers.Contract(CONTRACT_ADDRESS, TavioCoinABI, signer);

			const tx = await contract.claim();
			await tx.wait();
			setStatus("✅ Claim realizado con éxito!");
		} catch (err) {
			console.error(err);
			setStatus("❌ Error al ejecutar claim");
		} finally {
			setIsClaiming(false);
		}
	}

	// Agregar token a MetaMask (click en el gif)
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

	return (
		<div className="min-h-screen w-full bg-gradient-to-r from-black via-[#0b0c10] to-green-900 flex flex-col justify-center items-center text-white relative overflow-hidden px-6 py-16">
			<div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
				{/* Sección izquierda: texto promocional */}
				<div className="text-left space-y-6">
					<h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">
						TAVIOCOIN
					</h1>
					<h2 className="text-2xl text-green-300 font-medium">
						Reclama gratis el token del momento
					</h2>

					<p className="text-gray-300 leading-relaxed max-w-md">
						El token del que esta hablando todo el mundo. El que resuena por las calles y que esta en boca de la gente.
						No te quedes afuera y sé parte de esta revolución tokenizante.
					</p>

					<p className="text-xs text-gray-500 mt-6 max-w-sm">
						⚠️ No se garantinza ninguna revolucion tokenizante. 
					</p>
				</div>

				{/* Sección derecha: token + botón */}
				<div className="flex flex-col items-center justify-center text-center space-y-6">
					<img
						src={TOKEN_IMAGE}
						alt="TavioCoin"
						className="w-56 h-56 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300 shadow-[0_0_25px_5px_rgba(16,185,129,0.4)]"
						onClick={addTokenToMetaMask}
					/>

					{/* Botón principal */}
					<button
						onClick={account ? claimTokens : connectWallet}
						disabled={isClaiming}
						className={`px-8 py-3 rounded-2xl font-semibold transition text-lg ${
							isClaiming
								? "bg-gray-700 opacity-60 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-800/40"
						}`}
					>
						{isClaiming
							? "⏳ Reclamando..."
							: account
							? "💰 Claim TavioCoin"
							: "🔗 Conectar Wallet"}
					</button>

					{/* Dirección */}
					{account && (
						<p className="text-gray-400 text-sm">
							Wallet: <span className="text-green-300">{account.slice(0, 6)}...{account.slice(-4)}</span>
						</p>
					)}

					{/* Estado */}
					{status && (
						<p
							className={`text-sm ${
								status.includes("✅")
									? "text-green-400"
									: status.includes("❌")
									? "text-red-400"
									: "text-gray-300"
							}`}
						>
							{status}
						</p>
					)}
				</div>
			</div>
			{/* Componente TokenInfo 
    	<TokenInfo />
			*/}

		</div>
	);
}
