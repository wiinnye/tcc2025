// src/utils/traduzirParaLibras.js
import { librasMock } from "../../src/utils/librasMock.js";

export function traduzirParaLibras(texto) {
  // const palavras = texto.toLowerCase().split(" ");
  // const traducao = palavras.map(palavra => librasMock[palavra] || `❓(${palavra})`);
  // return traducao.join(" ");

  const chave = texto.toLowerCase().trim();
  if (librasMock[chave]) {
    return librasMock[chave].video;
  }
  return null;
}
