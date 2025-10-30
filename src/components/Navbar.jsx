import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ContactModal from "./ContactModal";
import SocialModal from "./SocialModal";

export default function Navbar() {
  const [showContact, setShowContact] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [clickPos, setClickPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const location = useLocation();

  const handleOpen = (e, type) => {
    const rect = e.target.getBoundingClientRect();
    setClickPos({
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY,
    });
    if (type === "contact") setShowContact(true);
    else if (type === "social") setShowSocial(true);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 bg-black text-white">
        <h1 className="text-lg font-bold tracking-wide">
          <Link to="/" className="hover:text-blue-400">
            Tavio's Playroom
          </Link>
        </h1>

        <ul className="flex gap-6 text-sm items-center">
			<li>
				<Link
					to="/fotos"
					className={`hover:text-blue-400 ${
					location.pathname === "/fotos" ? "text-blue-400 underline" : ""
					}`}
				>
				Fotos
				</Link>
			</li>
            <li>
            <Link
              to="/taviocoin"
              className={`hover:text-blue-400 ${
                location.pathname === "/taviocoin" ? "text-blue-400 underline" : ""
              }`}
            >
              TavioCoin
            </Link>
          </li>

          <li>
            <button className="hover:text-blue-400" onClick={(e) => handleOpen(e, "social")}>
              Redes
            </button>
          </li>
        </ul>
      </nav>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} clickPos={clickPos} />
      <SocialModal open={showSocial} onClose={() => setShowSocial(false)} clickPos={clickPos} />
    </>
  );
}
