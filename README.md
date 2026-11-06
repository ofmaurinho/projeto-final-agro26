# Trilha de Estudos

Aplicativo em React Native para cadastrar matérias, registrar sessões de estudo e acompanhar o tempo dedicado a cada matéria. O público-alvo são estudantes que querem manter seus registros de estudo organizados em um só lugar.

## Tecnologias

As versões seguem o repositório de exemplo analisado:

- Expo SDK `~54.0.36`
- React Native `0.81.5` e React `19.1.0`
- Expo Router `~6.0.24`
- TypeScript `~5.9.2`
- Firebase JavaScript SDK `^12.18.0` (Authentication e Cloud Firestore)
- `react-native-toast-message` `^2.4.0`
- `@expo/vector-icons` `^15.0.3`

## Pré-requisitos e instalação

Instale uma versão compatível do Node.js/npm, depois, na raiz deste projeto:

```Command Prompt
npm install
Copy-Item .env.example .env
```

Preencha o `.env` local conforme a seção Firebase. Não compartilhe esse arquivo. As variáveis `EXPO_PUBLIC_*` fazem parte do bundle do cliente; não coloque nelas chaves privadas, senhas, chaves de conta de serviço ou outros segredos.

Inicie o projeto com:

```powershell
npm run start
```

O Expo exibe as opções disponíveis para abrir o app. Os comandos `npm run android`, `npm run ios` e `npm run web` também estão definidos; a execução efetiva depende de emulador, dispositivo e configuração disponíveis.

## Configuração do Firebase

1. Crie ou selecione um projeto Firebase e registre um aplicativo web para obter a configuração do SDK.
2. No Firebase Authentication, habilite o provedor **E-mail/senha** e crie uma conta de teste pelo console. O app não oferece cadastro de contas.
3. Crie o banco Cloud Firestore.
4. Copie os valores da configuração do aplicativo web para as variáveis correspondentes em `.env`. Use apenas os campos mostrados em `.env.example`.
5. Publique o conteúdo de `firestore.rules` nas regras do banco Firestore. As regras do cliente não substituem a publicação no console Firebase.
6. Reinicie o Expo depois de alterar as variáveis de ambiente.

O arquivo `.env` é ignorado pelo Git; `.env.example` contém apenas marcadores. As configurações web do Firebase identificam o projeto, mas não autorizam acesso por si só. A proteção dos dados depende das regras publicadas e da autenticação.

## Telas e navegação

- **Login:** entra com uma conta existente no Firebase Authentication.
- **Início:** mostra o total de sessões, o tempo total e o tempo estudado por matéria; contém links para perfil e logout.
- **Matérias:** cadastra, lista e exclui matérias sem sessões associadas. Cada cartão oferece um ícone discreto de lixeira; a exclusão pede confirmação em uma janela do app.
- **Sessões:** lista as sessões mais recentes primeiro e oferece pesquisa por título/descrição, filtro por matéria, edição e exclusão com confirmação.
- **Formulário de sessão:** rota compartilhada entre cadastro e edição; a data é exibida e informada como `DD/MM/AAAA`.
- **Perfil:** mostra o e-mail vindo do Firebase Authentication e permite salvar o nome de exibição.

As abas principais são Início, Matérias e Sessões. O formulário e o perfil são rotas fora das abas.

As confirmações de logout e exclusão usam uma janela modal do próprio app, com botões de cancelar e confirmar. Essa escolha substitui alertas nativos após a observação de que tocar em “Sair” não produzia resposta visível e que a exclusão de sessão também não aparentava executar no ambiente utilizado. A observação motivou a mudança de interface; ela não identifica, por si só, a causa de eventual falha do Firestore.

## Modelo de dados do Firestore

| Coleção/documento | Campos |
|---|---|
| `materias/{id}` | `nome: string`, `uid: string`, `createdAt: Timestamp` (o campo `cor: string` é opcional) |
| `sessoes_estudo/{id}` | `titulo: string`, `materiaId: string`, `data: Timestamp`, `duracaoMinutos: number` inteiro positivo, `descricao: string` opcional, `uid: string`, `createdAt: Timestamp`, `updatedAt: Timestamp` |
| `perfis/{uid}` | `uid: string`, `nomeExibicao: string`, `updatedAt: Timestamp` |

`sessoes_estudo.materiaId` guarda o ID do documento em `materias`; a interface usa esse vínculo para mostrar o nome da matéria. O `uid` vem do usuário autenticado. O e-mail não é duplicado no Firestore.

## Regras de segurança

O arquivo versionado `firestore.rules` exige autenticação, limita leitura e escrita ao UID proprietário, valida campos e tipos e confirma que a matéria vinculada à sessão pertence ao mesmo usuário. A interface consulta as sessões do proprietário e bloqueia a exclusão de uma matéria associada; a regra de exclusão também restringe a operação ao dono do documento. O documento de perfil só pode ser lido/escrito pelo titular e usa o UID como ID. As regras atualizadas precisam ser publicadas no Firebase para que a exclusão funcione. A verificação de matéria associada é feita pela interface, portanto teste esse fluxo no projeto Firebase configurado.

## Diferenciais implementados

1. Perfil do usuário, com e-mail autenticado e nome de exibição editável.
2. Dados separados por usuário mediante `uid`, consultas filtradas e regras do Firestore.
3. Busca textual e filtro por matéria na listagem de sessões.
4. Painel com total de sessões, duração total e duração por matéria.

## Organização e padrões do projeto-base

- `firebase.ts`: inicialização Firebase, com valores lidos do ambiente local.
- `app/`: rotas Expo Router, grupos de autenticação e abas.
- `components/ui/action-button.tsx`: botão reutilizado com variações visuais.
- `hooks/use-sessoes.ts`: consulta ao Firestore no padrão do hook `use-alunos.ts`.
- `hooks/use-materias.ts`: consulta de matérias do usuário.
- `hooks/use-focus-refresh.ts`: atualiza as consultas ao receber foco, conforme o hook de mesmo nome no exemplo.
- `constants/theme.ts`: paleta visual usada pelas telas.

O app reaproveita a abordagem do exemplo de Firebase, login, formulários por ID, listagem `FlatList`, Toast, abas, consulta em hooks e atualização ao voltar à tela. A paleta mantém o azul-petróleo, verde e âmbar sugeridos no enunciado.

## Roteiro de teste manual

Com `.env`, projeto Firebase, regras publicadas e conta de teste configurados:

1. Execute `npm run start` e abra o aplicativo.
2. Entre com uma conta válida; tente uma senha inválida e confira a mensagem amigável.
3. Cadastre matérias fictícias, por exemplo, Matemática e Biologia.
4. Confira a tela de sessões vazia; cadastre pelo menos cinco sessões fictícias, com datas e durações diferentes.
5. Pesquise um trecho de título e descrição; aplique e limpe o filtro de matéria.
6. Altere uma sessão e confira no Firestore que o documento foi atualizado, sem duplicação.
7. Abra a exclusão de uma sessão, cancele e confirme que nada foi removido; repita, confirme e confira que ela desapareceu da lista. Se a operação falhar com permissão negada, publique `firestore.rules` no Firebase e tente novamente.
8. Na aba Matérias, confira o ícone discreto de lixeira; tente excluir uma matéria vinculada (o app deve bloquear) e depois remova uma matéria sem sessões, confirmando na janela do app.
9. Confira no painel os totais e o tempo por matéria.
10. Edite o nome de exibição no perfil e confira o e-mail vindo da autenticação.
11. Toque em Sair, cancele a primeira janela, depois confirme e confira o retorno ao login.
12. Confira que as datas aparecem como `DD/MM/AAAA`, os tipos dos campos no Firestore e, com contas distintas, a separação de dados. Não use credenciais reais em demonstrações.

## Validação, limitações e dependências externas

Os comandos de verificação disponíveis são:

```powershell
npm run lint
npm run typecheck
```

**Resultado registrado durante a implementação:** a análise de diagnósticos do VS Code não apontou erros. Os comandos `npm run lint` e `npm run typecheck` foram executados após as alterações de interface. Os fluxos de Authentication e Firestore dependem de um projeto Firebase, das regras atualizadas publicadas e de uma conta de teste; valide manualmente as operações de exclusão no roteiro acima. A apresentação deve usar apenas dados fictícios e não expor configurações sensíveis.
