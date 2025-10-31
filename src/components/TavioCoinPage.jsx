import { useState } from "react";
import { ethers } from "ethers";
import contractAbi from "../abi/TavioCoinABI.json";

const CONTRACT_ADDRESS = "0x9f05aB363f0978b621f97a8141e7Fee6CF6a1c3C";
const TOKEN_SYMBOL = "TAV";
const TOKEN_DECIMALS = 18;
const TOKEN_IMAGE = "https://i.ibb.co/F4FyDnN/tavio.png";

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
			const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);

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

	// Agregar token a MetaMask
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

			alert(wasAdded ? "✅ TavioCoin agregado a tu MetaMask" : "❌ Acción cancelada");
		} catch (error) {
			console.error(error);
			alert("Ocurrió un error al intentar agregar el token.");
		}
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0c10] to-[#16181d] text-white px-6 py-16">
			{/* Card principal */}
			<div className="max-w-md w-full bg-[#1c1e24] p-8 rounded-3xl shadow-lg text-center border border-gray-700">
				<img
					src={TOKEN_IMAGE}
					alt="TavioCoin Logo"
					className="mx-auto w-24 h-24 rounded-full border border-gray-600 shadow-md mb-6"
				/>
				<h1 className="text-3xl font-bold mb-2 text-white">TavioCoin Launchpad</h1>
				<p className="text-gray-400 mb-6">
					Reclamá tus TavioCoins en la red <span className="text-purple-400">Polygon Amoy</span>
				</p>

				{/* Botones */}
				<div className="flex flex-col gap-3">
					<button
						onClick={connectWallet}
						className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
					>
						{account ? `Conectado: ${account.slice(0, 6)}...` : "🔗 Conectar Wallet"}
					</button>

					<button
						onClick={claimTokens}
						disabled={!account || isClaiming}
						className={`w-full py-3 rounded-xl font-semibold transition ${
							!account
								? "bg-gray-600 opacity-60 cursor-not-allowed"
								: "bg-green-600 hover:bg-green-700"
						}`}
					>
						{isClaiming ? "⏳ Reclamando..." : "💰 Claim TavioCoin"}
					</button>

					<button
						onClick={addTokenToMetaMask}
						disabled={!account}
						className={`w-full py-3 rounded-xl font-semibold transition ${
							!account
								? "bg-gray-600 opacity-60 cursor-not-allowed"
								: "bg-yellow-500 hover:bg-yellow-600 text-black"
						}`}
					>
						🦊 Agregar TavioCoin a MetaMask
					</button>
				</div>

				{/* Estado */}
				{status && (
					<p
						className={`mt-6 text-sm ${
							status.includes("✅") ? "text-green-400" : status.includes("❌") ? "text-red-400" : "text-gray-300"
						}`}
					>
						{status}
					</p>
				)}
			</div>
			
		</div>
	);
}
