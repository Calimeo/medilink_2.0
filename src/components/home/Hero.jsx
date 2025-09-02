// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import heroimg from "/heroimg.png";
import tick from "/tick.png";
import hero from "/new_hero.png";

function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main className="w-full min-h-screen bg-light_theme flex items-center py-8 lg:py-0 lg:h-[92vh]">
      <section className="h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 content-center justify-items-center px-4 md:px-6 lg:px-8 gap-8 lg:gap-y-6">
        {/* text container */}
        <section className="flex flex-col items-center text-center lg:text-left lg:items-start justify-center gap-y-8 lg:gap-y-12 order-2 lg:order-1">
          <div className="space-y-5 flex items-center flex-col lg:block">
            {/* heading */}
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-black/90 tracking-tight leading-tight">
              Prenez soin de votre
              <span className="text-dark_theme block lg:inline-block lg:ml-4">santé au quotidien</span>
            </h1>

            {/* para */}
            <p className="text-text_grey text-lg md:text-xl md:max-w-md leading-relaxed">
              MediLink rassemble tous les médecins et produits de santé essentiels 
              sur une seule plateforme intuitive.
            </p>
          </div>

          {/* ctas */}
          <div className="flex flex-col gap-5 w-full">
            <NavLink
              to={"/doctor/search"}
              className="rounded-full flex items-center justify-center px-6 py-4 text-lg shadow-lg hover:shadow-xl bg-dark_theme hover:bg-main_theme text-white transition-all duration-300 gap-3 group"
            >
              <img
                src="https://images.apollo247.in/images/ic-doctor.svg"
                alt="icon"
                className="size-6"
              />
              <span>Prendre rendez-vous</span>
            </NavLink>
            <NavLink
              to={"/pharmacy"}
              className="rounded-full flex items-center justify-center px-6 py-4 text-lg shadow-lg hover:shadow-xl bg-white hover:bg-gray-50 text-dark_theme border border-dark_theme/20 transition-all duration-300 gap-3 group"
            >
              <img
                src="https://www.svgrepo.com/download/88732/medicines.svg"
                alt="icon"
                className="size-6"
              />
              <span className="text-center">Acheter des médicaments</span>
            </NavLink>
          </div>

          {/* Mobile benefits section */}
          {isMobile && (
            <div className="mt-6 grid grid-cols-2 gap-4 w-full">
              <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="bg-dark_theme/10 rounded-full p-2 flex-shrink-0">
                  <img src={tick} alt="tick" className="w-5 h-5" />
                </div>
                <p className="font-semibold text-dark_theme text-sm">2000+ réussites</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
                <div className="bg-dark_theme/10 rounded-full p-2 flex-shrink-0">
                  <img src={tick} alt="tick" className="w-5 h-5" />
                </div>
                <p className="font-semibold text-dark_theme text-sm">500+ médecins</p>
              </div>
            </div>
          )}
        </section>

        {/* image section */}
        <section className="relative w-full max-w-md lg:max-w-none order-1 lg:order-2">
          {/* image container */}
          <div className="w-full h-full flex justify-center">
            <img
              src={heroimg}
              alt="MediLink - Plateforme de santé"
              className="object-contain object-center w-4/5 md:w-3/5 lg:w-full"
            />
          </div>

          {/* Floating cards - visible on desktop */}
          {!isMobile && (
            <>
              {/* Medical achievements card */}
              <div className="hidden lg:flex absolute top-[5%] left-[-8%] bg-white/95 backdrop-filter backdrop-blur-md shadow-xl border border-dark_theme/10 rounded-2xl px-5 py-4 items-center gap-4 text-dark_theme max-w-[280px]">
                <div className="bg-dark_theme/10 rounded-full p-2 flex-shrink-0">
                  <img src={tick} alt="tick" className="w-6 h-6" />
                </div>
                <p className="font-semibold text-[15px] leading-tight">Plus de 2000 réussites médicales</p>
              </div>
              
              {/* Experienced doctors card */}
              <div className="hidden lg:flex absolute top-[45%] right-[-15%] bg-white/95 backdrop-filter backdrop-blur-md shadow-xl border border-dark_theme/10 rounded-2xl px-5 py-4 items-center gap-4 text-dark_theme max-w-[260px]">
                <div className="bg-dark_theme/10 rounded-full p-2 flex-shrink-0">
                  <img src={tick} alt="tick" className="w-6 h-6" />
                </div>
                <p className="font-semibold text-[15px] leading-tight">Plus de 500 médecins expérimentés</p>
              </div>

              {/* Doctor card */}
              <div className="hidden lg:flex absolute bottom-[-10%] left-[-12%] bg-white/95 backdrop-filter backdrop-blur-md shadow-xl border border-dark_theme/10 rounded-2xl px-5 py-4 flex-col gap-3 text-dark_theme max-w-[240px]">
                <div className="flex items-center gap-3">
                  <img
                    src={hero}
                    alt="Dr. Pierre Ghetro"
                    className="w-12 h-12 object-cover bg-dark_theme/10 rounded-full border-2 border-dark_theme/20 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[16px] truncate">Dr. Pierre Ghetro</h2>
                    <p className="font-normal text-text_grey/90 text-sm">Cardiologue</p>
                  </div>
                </div>
                <button className="font-semibold text-sm bg-dark_theme text-white px-4 py-2 rounded-full mt-1 w-full hover:bg-main_theme transition-colors">
                  Prendre RDV
                </button>
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default Hero;