import { useState } from "react";

export default function TavioCoinPage() {
	const tokenAddress = "0x459B142Af22c7A861945857ebC469aA2F7B66053";
	const explorerBase = "https://amoy.polygonscan.com/token";

	const [claiming, setClaiming] = useState(false);
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState(null);
	const [balanceMock, setBalanceMock] = useState(1234.5);

	const mockClaim = async () => {
		setClaiming(true);
		setMessage("");
		setStatus(null);

		await new Promise((r) => setTimeout(r, 1500));

		setBalanceMock((b) => b + 100);
		setClaiming(false);
		setStatus("success");
		setMessage("¡Reclamaste 100 TAVIO (mock)!");
		setTimeout(() => setMessage(""), 3000);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 bg-gradient-to-b from-[#0f0f12] to-[#1b1c22] text-gray-100">
			<div className="bg-[#202229] rounded-2xl shadow-xl p-10 max-w-2xl text-center border border-[#2e3038]">
				<h2 className="text-3xl font-bold mb-3 text-white">TavioCoin Launchpad (falso)</h2>
				<p className="text-gray-400 mb-6">
					Token en Polygon —{" "}
					<a
						href={`${explorerBase}/${tokenAddress}#code`}
						className="underline text-blue-400 hover:text-blue-300"
						target="_blank"
						rel="noreferrer"
					>
						{tokenAddress}
					</a>
				</p>

				<div className="flex flex-col items-center gap-6">
					<div className="bg-[#2b2d34] px-6 py-4 rounded-lg text-center w-full border border-[#34363f]">
						<div className="text-sm text-gray-500">Balance (mock)</div>
						<div className="text-2xl font-semibold text-white">
							{balanceMock.toLocaleString()} TAVIO
						</div>
					</div>

					<button
						onClick={mockClaim}
						disabled={claiming}
						className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${
							claiming
								? "bg-gray-600 text-gray-300 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-500 text-white"
						}`}
					>
						{claiming ? "Reclamando..." : "Claim Tokens"}
					</button>

					{message && (
						<div
							className={`px-4 py-2 rounded-lg text-sm ${
								status === "success"
									? "bg-green-800/40 text-green-300 border border-green-700/50"
									: "bg-red-800/40 text-red-300 border border-red-700/50"
							}`}
						>
							{message}
						</div>
					)}
				</div>

				<p className="text-xs text-gray-500 mt-6">
					* Este launchpad es simulado — no realiza transacciones reales.  
					Para una integración real se debe conectar una wallet y usar el contrato ERC-20 correspondiente.
				</p>
			</div>
		</div>
	);
}
