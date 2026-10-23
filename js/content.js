
const CONTENT = {

  github: 'DutraBrun0',

  maxRepos: 6,

  stats: [
    {
      group: { pt: 'Linguagens', en: 'Languages' },
      items: [
        { name: 'Python', lv: 4 },
        { name: 'SQL', lv: 3 },
        { name: 'JavaScript', lv: 2 },
        { name: 'HTML', lv: 4 },
        { name: 'CSS', lv: 3 }
      ]
    },
    {
      group: { pt: 'Back-end e dados', en: 'Back-end and data' },
      items: [
        { name: 'Flask', lv: 3 },
        { name: 'MySQL', lv: 3 },
        { name: { pt: 'Orientação a objetos', en: 'Object-oriented design' }, lv: 3 },
        { name: { pt: 'Modelagem de dados', en: 'Data modelling' }, lv: 3 },
        { name: { pt: 'APIs REST', en: 'REST APIs' }, lv: 2 }
      ]
    },
    {
      group: { pt: 'Ferramentas e práticas', en: 'Tools and practice' },
      items: [
        { name: 'Git', lv: 3 },
        { name: 'GitHub', lv: 3 },
        { name: { pt: 'Testes automatizados', en: 'Automated testing' }, lv: 2 },
        { name: { pt: 'Linha de comando', en: 'Command line' }, lv: 3 },
        { name: { pt: 'Inglês técnico', en: 'Technical English' }, lv: 3 }
      ]
    }
  ],

  featured: [
    {
      name: 'ProdManager',
      repo: 'ProdManager',
      demo: '',
      rare: true,
      desc: {
        pt: 'Sistema web para gerenciar produtos, estoque, clientes e pedidos. Tem autenticação, controle de acesso por perfil, regras de negócio no back-end, migrações de banco e testes automatizados.',
        en: 'Web system to manage products, stock, customers and orders. Includes authentication, role-based access control, business rules in the back-end, database migrations and automated tests.'
      },
      loot: ['Python', 'Flask', 'MySQL', 'HTML', 'CSS', 'JavaScript']
    },
    {
      name: 'FPSASCII',
      repo: 'FPSASCII',
      demo: '',
      rare: false,
      desc: {
        pt: 'Jogo de tiro em primeira pessoa renderizado inteiramente em caracteres ASCII no terminal. Foi onde eu estudei laços de repetição, matemática de projeção e desempenho, sem nenhuma biblioteca gráfica.',
        en: 'A first-person shooter rendered entirely with ASCII characters in the terminal. This is where I studied game loops, projection maths and performance, with no graphics library at all.'
      },
      loot: ['Python', 'ASCII', 'Terminal']
    }
  ]
};
