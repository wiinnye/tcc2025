export const menusPorTipo = {
  interprete: [
    { label: "Início", rota: "/tradutor" },
    { label: "Adicionar Novo Vídeo", rota: "/uploadvideo" },
    { label: "Alterar Senha" },
    { label: "FeedBacks", rota:"/feedback"},
  ],
  aluno: [
    { label: "Início", rota: "/tradutor" },
    { label: "Alterar Senha" },
    {label: "FeedBacks", rota:"/feedback"},
  ],
  adm: [
    { label: "Início", rota: "/tradutor" },
    { label: "Adicionar Novo Vídeo", rota: "/uploadvideo" },
    { label: "Videos Pendentes", rota: "/administrador" },
    { label: "Criar Novo Administrador", rota: "/cadastroAdministrador" },
    {label: "FeedBacks", rota:"/feedback"},
  ]
};
