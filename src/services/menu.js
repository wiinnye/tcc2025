export const menusPorTipo = {
  interprete: [
    { label: "Início", rota: "/tradutor" },
    { label: "Adicionar Novo Vídeo", rota: "/uploadvideo" },
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
    { label: "Adicionar Novo Vídeo", rota: "/uploadvideo" },
    { label: "Videos Pendentes", rota: "/administrador" },
    { label: "Criar Novo Administrador", rota: "/cadastroAdministrador" },
    {label: "FeedBack", rota:"/feedback"},
    { label: "Alterar Senha", rota:"/recuperarSenha" },
  ]
};
