import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x9f05aB363f0978b621f97a8141e7Fee6CF6a1c3C";
const API_KEY = import.meta.env.VITE_API_ETHERSCAN;

export default function TokenInfo() {
	const [tokenData, setTokenData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchTokenData() {
			try {
				// Nuevo endpoint V2
				const url = `https://api-amoy.polygonscan.com/api/v2/token/${CONTRACT_ADDRESS}?apikey=${API_KEY}`;
				const response = await fetch(url);
				const data = await response.json();

				if (data.status === "1" || data.ok === true) {
					setTokenData(data.result || data.data);
				} else {
					console.error("Respuesta inválida:", data);
					setError("No se pudo obtener la información del token.");
				}
			} catch (err) {
				console.error(err);
				setError("Error al conectarse con Polygonscan.");
			}
		}
		fetchTokenData();
	}, []);

	if (error)
		return <p className="text-red-400 text-sm text-center mt-6">{error}</p>;
	if (!tokenData)
		return <p className="text-gray-400 text-sm text-center mt-6">Cargando datos...</p>;

	return (
		<div className="w-full mt-10 p-6 bg-[#101215] rounded-xl border border-gray-700 text-gray-300 max-w-2xl mx-auto text-center">
			<h2 className="text-xl font-semibold text-white mb-4">📊 Detalles del Token</h2>
			<p><span className="text-gray-400">Nombre:</span> {tokenData.name}</p>
			<p><span className="text-gray-400">Símbolo:</span> {tokenData.symbol}</p>
			<p><span className="text-gray-400">Total Supply:</span> {Number(tokenData.totalSupply).toLocaleString()}</p>
			<p><span className="text-gray-400">Decimales:</span> {tokenData.decimals}</p>
			<a
				href={`https://amoy.polygonscan.com/token/${CONTRACT_ADDRESS}`}
				target="_blank"
				rel="noopener noreferrer"
				className="text-purple-400 hover:underline mt-4 inline-block"
			>
				Ver en Polygonscan
			</a>
		</div>
	);
}
