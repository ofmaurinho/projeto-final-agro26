# Proposta — Trilha de Estudos

## Ideia, problema e público

**Trilha de Estudos** é um aplicativo móvel para organizar matérias e registrar sessões de estudo, mostrando quanto tempo foi dedicado a cada matéria. Ele atende estudantes que hoje anotam seus estudos em lugares dispersos e querem consultar essa atividade em um único lugar.

## Funcionalidades principais

- Login e logout com e-mail e senha pelo Firebase Authentication.
- Cadastro e consulta de matérias.
- Cadastro, listagem, edição e exclusão de sessões de estudo.
- Associação de cada sessão a uma matéria existente.
- Pesquisa por título ou descrição e filtro por matéria.
- Painel com total de sessões e tempo estudado.
- Perfil com o e-mail autenticado e edição do nome de exibição.
- Isolamento dos registros por usuário autenticado.

O escopo não inclui cadastro de contas, calendário, notificações ou serviços além do Firebase.

## Dados planejados

As coleções do Firestore serão:

- **`materias`**: `nome: string` (obrigatório), `cor: string` (opcional), `uid: string` e `createdAt: Timestamp`.
- **`sessoes_estudo`**: `titulo: string`, `materiaId: string`, `data: Timestamp`, `duracaoMinutos: number` (inteiro positivo), `descricao: string` (opcional), `uid: string`, `createdAt: Timestamp` e `updatedAt: Timestamp`. `materiaId` referencia o documento correspondente em `materias`.
- **`perfis/{uid}`**: `uid: string`, `nomeExibicao: string` e `updatedAt: Timestamp`. O e-mail será lido do Firebase Authentication, sem duplicá-lo no Firestore.

O UID será obtido da sessão autenticada, nunca informado pelo usuário. Consultas e regras do Firestore limitarão os dados ao proprietário; o perfil usará o UID também como ID do documento. Matérias poderão ser excluídas com confirmação quando não houver sessões vinculadas.

## Telas e navegação

O login ficará fora da área autenticada. Após entrar, abas darão acesso a **Início** (painel), **Matérias** e **Sessões**. Um formulário em rota empilhada será reutilizado para cadastrar e editar sessões; a tela **Perfil** será acessível pela área principal. A exclusão de sessões pedirá confirmação. O logout encerrará a sessão e retornará ao login.

## Diferenciais e identidade visual

Os diferenciais escolhidos são perfil do usuário, dados separados por UID, busca e filtros de sessões e painel com resumo do tempo e da quantidade de sessões. A relação por `materiaId` mantém a organização dos registros vinculada ao cadastro real de matérias.

A proposta adota a paleta sugerida no enunciado: azul-petróleo para navegação e ações principais, verde para indicadores positivos, âmbar para destaques, fundo claro para leitura e vermelho reservado a ações destrutivas. O uso consistente dessas cores deve manter a interface legível e simples de apresentar.

## Equipe

- Integrantes: `Fabricio Mauro, Luiz Alves e Pablo Dantas`.
- Divisão de responsabilidades: `[PREENCHER — definir com a equipe após aprovação]`.

## Diagnóstico do repositório de exemplo

O exemplo inspecionado está em `repositorio exemplo/projetobase-ads-agro`. O aplicativo que vier a ser implementado ficará diretamente na raiz de `atividade unisenai`; o repositório de exemplo será apenas referência e não será alterado.

- **Versões encontradas:** Expo SDK `~54.0.36`, React Native `0.81.5`, React `19.1.0`, TypeScript `~5.9.2` e Firebase `^12.18.0`.
- **Estrutura e rotas:** `app/(auth)/index.tsx` para login; `app/(tabs)/` com layout de abas e rotas de início, cadastro e listagem; `components/` para formulários e cartões de listagem; `hooks/` para consulta de dados e atualização ao receber foco; `firebase.ts` para inicialização; `constants/` para tema.
- **Padrões a adaptar:** `firebase.ts` (inicialização de Auth e Firestore, sem copiar configuração do projeto de exemplo), `components/frm-login.tsx`, `components/frm-cad-aluno.tsx`, `components/lst-aluno.tsx`, `hooks/use-alunos.ts`, `hooks/use-focus-refresh.ts`, `app/(tabs)/_layout.tsx` e `app/(tabs)/index.tsx`. O formulário existente demonstra cadastro/edição pelo ID, e a listagem usa `FlatList`.
- **Dependências disponíveis:** `react-native-toast-message` para Toast; `@expo/vector-icons` e `expo-symbols` para ícones; Expo Router `~6.0.24` e React Navigation bottom tabs `^7.4.0` para navegação. Não há necessidade identificada de adicionar dependências nesta proposta.
- **Comandos existentes:** `npm install` para instalar; `npm run start` ou `npx expo start` para executar; `npm run lint` para lint. O projeto também oferece scripts `android`, `ios` e `web`.
- **Estado observado:** o exemplo tem um repositório Git limpo na branch `main`; a pasta `atividade unisenai` não é, atualmente, um repositório Git. O README do exemplo ainda é o padrão do Expo e não documenta o domínio do aplicativo. A configuração Firebase do exemplo é específica daquele projeto e não será reaproveitada como configuração do novo app.

Esta proposta é a etapa inicial. A implementação do aplicativo e os demais documentos devem aguardar a aprovação do professor.
