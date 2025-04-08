import { useEffect } from "react";

export default function VLibrasPlugin() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");

        // Exibe automaticamente o avatar
        setTimeout(() => {
          const botao = document.querySelector(".vw-access-button");
          if (botao) botao.click();
        }, 1000);
      }
    };

    script.onerror = () => {
      console.error("Erro ao carregar o script VLibras.");
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
