export const menusPorTipo = {
  interprete: [
    { label: "Início", rota: "/tradutor" },
    { label: "Adicionar Vídeo", rota: "/uploadvideo" },
    { label: "Alterar Senha", rota:"/recuperarSenha" },
    { label: "FeedBack", rota:"/feedback"},
  ],
  aluno: [
    { label: "Início", rota: "/tradutor" },
    { label: "Alterar Senha", rota:"/recuperarSenha" },
    {label: "FeedBack", rota:"/feedback"},
  ],
  adm: [
    { label: "Início", rota: "/tradutor" },
    { label: "Adicionar Vídeo", rota: "/uploadvideo" },
    { label: "Revisão de Vídeos", rota: "/administrador" },
    { label: "Gerenciar Administradores", rota: "/cadastroAdministrador" },
    {label: "FeedBack", rota:"/feedback"},
    { label: "Alterar Senha", rota:"/recuperarSenha" },
  ]
};
