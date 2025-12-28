import { useEffect } from "react";

const Home = () => {
  // Remove scroll apenas desta página
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/burger-bg.jpg')",
      }}
    >
      {/* Overlay escuro com gradiente */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80"></div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        {/* Badge/Tag */}
        <div className="mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-amber-400">
            🍔 Desde 2024
          </span>
        </div>

        {/* Título Principal */}
        <h1 className="mb-4 text-center text-5xl leading-tight font-bold text-white md:text-7xl">
          Sabor que Conquista,
          <br />
          <span className="bg-linear-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Experiência que Encanta
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mb-12 max-w-2xl text-center text-lg text-gray-300 md:text-xl">
          Os melhores hambúrgueres artesanais da cidade. Ingredientes
          selecionados, preparo premium e entrega rápida direto na sua casa.
        </p>

        {/* Features/Destaques */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl">
              ⚡
            </div>
            <h3 className="mb-1 font-semibold text-white">Entrega Rápida</h3>
            <p className="text-sm text-gray-400">Em até 30 minutos</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl">
              🏆
            </div>
            <h3 className="mb-1 font-semibold text-white">Qualidade Premium</h3>
            <p className="text-sm text-gray-400">Ingredientes selecionados</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl">
              ❤️
            </div>
            <h3 className="mb-1 font-semibold text-white">Feito com Amor</h3>
            <p className="text-sm text-gray-400">Receitas artesanais</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
