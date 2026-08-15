import Win95Window from "./Win95Window";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      {/* Ventana de bienvenida */}
      <Win95Window
        title="Bienvenido.exe"
        icon="🖥️"
        className="w-full max-w-2xl mt-4 mb-6"
      >
        <h1 className="text-2xl font-bold text-black mb-2 text-center">
          Bienvenido a mi Playroom
        </h1>
        <p className="text-gray-800 text-center text-sm">
          Explorá mis proyectos y divertite con mis creaciones. Abrí la
          carpeta "Proyectos" y hacé doble clic en cualquier ícono para
          descubrir más.
        </p>
      </Win95Window>
    </div>
  );
}
