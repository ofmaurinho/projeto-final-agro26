# Roteiro de apresentação — Trilha de Estudos

**Duração total: 15 minutos.** Substituam os campos entre colchetes pelos dados e experiências confirmados pela equipe. Os desafios não devem ser apresentados como fatos antes de serem confirmados pelos integrantes.

## 1. Abertura e problema — 1 minuto

- **Título sugerido do slide:** Trilha de Estudos: organize seu aprendizado.
- **Objetivo:** apresentar o grupo, o problema e a proposta do app.
- **Conteúdo técnico:**
  - Grupo: `Os Bacanas`; integrantes: `Fabricio Mauro, Luiz Alves e Pablo Dantas`.
  - Público-alvo: estudantes que anotam estudos em locais dispersos.
  - Objetivo: organizar matérias e sessões e acompanhar o tempo estudado.
- **Fala sugerida:** “Somos o grupo [NOME DO GRUPO], formado por [INTEGRANTES]. Criamos o Trilha de Estudos para estudantes que têm dificuldade em reunir seus registros e perceber quanto tempo dedicam às matérias. O aplicativo centraliza esses dados e mostra um resumo simples da rotina.”
- **Mostrar:** slide inicial com nome do app e uma frase sobre o problema.
- **Tempo:** 1 min.
- **Responsável:** `[INTEGRANTE 1]`.

## 2. Demonstração do app — 3 minutos

- **Título sugerido do slide:** Da matéria ao resumo do estudo.
- **Objetivo:** mostrar o fluxo principal sem ultrapassar o tempo.
- **Conteúdo técnico e sequência:**
  - 0:00–0:20: login com conta de demonstração.
  - 0:20–0:40: painel com totais.
  - 0:40–1:00: cadastrar matéria fictícia, se ainda não estiver preparada.
  - 1:00–1:35: criar sessão fictícia e mostrar sua matéria, data e duração.
  - 1:35–2:00: mostrar listagem, pesquisar um termo e filtrar por matéria.
  - 2:00–2:20: alterar uma sessão.
  - 2:20–2:35: excluir uma sessão e mostrar a janela de confirmação do app.
  - 2:35–2:45: voltar ao painel e destacar os totais.
  - 2:45–3:00: mostrar o perfil e fazer logout.
- **Preparação de dados:** deixar previamente cadastradas matérias fictícias, como Matemática e Biologia, ao menos cinco sessões com títulos, descrições, datas e durações variadas, e uma matéria sem sessões vinculadas para demonstrar sua exclusão. As datas são exibidas e informadas no formato `DD/MM/AAAA`. Não use dados pessoais.
- **Fala sugerida:** “Entramos com uma conta de demonstração. As matérias agrupam as sessões; cada sessão registra o que foi estudado, quando e por quanto tempo, no formato dia/mês/ano. Na lista, podemos procurar pelo texto e filtrar por matéria. A edição atualiza o mesmo registro, e a exclusão só acontece depois da confirmação na janela do app. No perfil, o e-mail vem da autenticação e o nome de exibição pode ser alterado. Ao final, confirmamos o logout também pela janela do app.”
- **Mostrar:** app aberto no dispositivo/emulador; mantenha uma sessão preparada para editar e outra para excluir. Se houver tempo, mostre a lixeira discreta da matéria sem sessões; não tente remover uma matéria associada.
- **Plano de reserva:** gravar antes um vídeo curto do fluxo completo, com dados fictícios, para o caso de a internet, o emulador ou o Firebase falhar. Não alegar que a demonstração ao vivo ocorreu se for usado o vídeo.
- **Tempo:** 3 min.
- **Responsável:** `[INTEGRANTE 2]`.

## 3. A ferramenta: Expo e React Native — 2 minutos

- **Título sugerido do slide:** React Native com Expo.
- **Objetivo:** explicar a escolha das ferramentas no contexto do projeto.
- **Conteúdo técnico:**
  - React Native permite construir interfaces móveis com componentes React e JavaScript/TypeScript.
  - Expo oferece ferramentas e configuração para desenvolver e executar aplicações React Native.
  - Expo Router organiza a navegação por arquivos e diretórios em `app/`.
  - O projeto usa Expo SDK 54 e possui comandos `start`, `android`, `ios` e `web`; mostre apenas os caminhos de execução que a equipe validar no ambiente.
  - Expo Go pode abrir projetos compatíveis durante o desenvolvimento; confirmem a compatibilidade da configuração usada antes de afirmar suporte no aparelho.
- **Fala sugerida:** “React Native nos permite montar telas móveis usando componentes declarativos. O Expo simplifica a configuração e o ciclo de execução. Usamos Expo Router para associar arquivos a rotas e organizar as áreas de autenticação e abas. A escolha segue as tecnologias do projeto-base e do conteúdo trabalhado em aula.”
- **Mostrar:** `package.json`, estrutura de `app/` e, se previamente validado, o terminal com `npm run start`.
- **Tempo:** 2 min.
- **Responsável:** `[INTEGRANTE 3]`.

## 4. Firebase: Authentication e Firestore — 2 minutos

- **Título sugerido do slide:** Autenticação e dados por usuário.
- **Objetivo:** explicar como o app identifica o usuário e protege os registros.
- **Conteúdo técnico:**
  - Authentication usa e-mail e senha; não há cadastro de contas dentro do app.
  - `materias` guarda as matérias; `sessoes_estudo` aponta para uma matéria por `materiaId`; `perfis/{uid}` guarda o nome de exibição.
  - O UID autenticado é gravado em cada registro e filtra as consultas.
  - `firestore.rules` exige autenticação, confere o proprietário e valida a referência da matéria e os tipos principais.
  - O e-mail é obtido de Authentication e não é duplicado no perfil do Firestore.
- **Fala sugerida:** “Authentication informa qual conta está ativa. O Firestore guarda matérias e sessões; a sessão referencia a matéria por ID, em vez de depender de um nome digitado livremente. O UID é aplicado pelo app e também validado pelas regras do banco. Assim, esconder uma tela não é nossa proteção: o controle efetivo está nas regras publicadas no Firebase.”
- **Mostrar:** estrutura de campos de dados fictícios e `firestore.rules`; no console, exibir Authentication e coleções sem revelar e-mail pessoal, chaves ou segredos.
- **Tempo:** 2 min.
- **Responsável:** `[INTEGRANTE 4]`.

## 5. Arquitetura do projeto — 2 minutos

- **Título sugerido do slide:** Do formulário ao Firestore.
- **Objetivo:** apresentar a organização real e o caminho de um dado.
- **Conteúdo técnico:**
  - `app/(auth)/index.tsx`: login; `app/(tabs)/`: painel, matérias e sessões.
  - `app/sessao-form.tsx` e `app/perfil.tsx`: formulário compartilhado entre cadastro/edição de sessão e edição do perfil.
  - `components/ui/action-button.tsx`: botão reutilizável; `components/ui/confirmation-modal.tsx`: confirmações de logout e exclusão dentro do app.
  - `hooks/use-sessoes.ts` e `hooks/use-materias.ts`: consultas ao Firestore; `hooks/use-focus-refresh.ts`: recarregamento ao retornar à tela.
  - `firebase.ts`: inicialização; `constants/theme.ts`: cores; `firestore.rules`: segurança no banco.
  - Caminho: tela/formulário → hook ou operação Firestore → documento do usuário → atualização da listagem ao receber foco.
- **Fala sugerida:** “A navegação vem da estrutura de arquivos do Expo Router. As telas chamam as operações do Firestore; os hooks concentram a consulta e expõem dados e carregamento. Quando voltamos à listagem, o hook de foco recarrega os registros, seguindo o padrão do exemplo `use-alunos.ts`.”
- **Mostrar:** árvore das pastas `app/`, `hooks/`, `components/` e `firebase.ts`; percorrer brevemente o fluxo de salvar e atualizar.
- **Tempo:** 2 min.
- **Responsável:** `[INTEGRANTE 1]`.

## 6. Desafios com o framework — 2 minutos

- **Título sugerido do slide:** O que aprendemos usando Expo e React Native.
- **Objetivo:** relatar um desafio real de framework e explicar como foi resolvido.
- **Conteúdo técnico:**
  - **Observação relatada durante o uso:** ao tocar em “Sair”, não acontecia nada; a exclusão de sessão também não aparentava executar.
  - As confirmações usavam `Alert.alert`, cuja janela nativa não respondeu como esperado no ambiente utilizado. A observação foi sobre o comportamento percebido; não se confirmou que a causa fosse exclusivamente o React Native ou o Expo.
  - **Solução adotada:** substituir os alertas nativos por uma janela de confirmação criada com o componente `Modal`, com ações explícitas de cancelar/confirmar e indicador de carregamento.
  - Apresentar como resultado verificado em código e lint/TypeScript; demonstrar no dispositivo real somente depois de repetir os fluxos nele.
- **Fala sugerida:** “Durante o uso, percebemos que tocar em ‘Sair’ não mostrava uma resposta e a exclusão de sessão também não parecia acontecer. Como a confirmação dependia de um alerta nativo, trocamos esse fluxo por uma janela dentro do aplicativo, com botões próprios. Isso deixa a confirmação consistente com a interface. Ainda é importante testar no aparelho e na configuração usados na apresentação.”
- **Mostrar:** abrir a janela customizada de logout e, se possível, a de exclusão de sessão; mostrar o componente `components/ui/confirmation-modal.tsx`. Não afirmar teste em dispositivo se ele ainda não foi realizado.
- **Tempo:** 2 min.
- **Responsável:** `[INTEGRANTE 2]`.

## 7. Desafios com a tecnologia — 2 minutos

- **Título sugerido do slide:** Modelagem e segurança com Firebase.
- **Objetivo:** contar um desafio real de Firebase, Firestore ou TypeScript.
- **Conteúdo técnico:**
  - **Observação relatada durante o uso:** a ação de excluir sessão não removia o registro como esperado.
  - A tela já chamava `deleteDoc`; o usuário não viu a exclusão acontecer. Isso não prova, sozinho, se o bloqueio era a janela de confirmação, permissão do Firestore ou regras ainda não publicadas.
  - **Solução no app:** mover a execução para a confirmação customizada, mostrar carregamento, atualizar a lista depois do sucesso e exibir uma mensagem específica quando o Firestore retornar `permission-denied`.
  - **Exclusão de matérias:** foi adicionada com ícone discreto e confirmação; o app consulta as sessões do usuário e impede excluir uma matéria vinculada. A regra versionada autoriza a exclusão somente ao proprietário.
  - **Dependência para confirmar:** publicar a versão atual de `firestore.rules` no console do Firebase e testar com uma conta autenticada. O teste TypeScript/lint não comprova uma exclusão real no Firestore.
  - Descrever `materiaId` como vínculo usado pela interface e pelas regras de criação de sessão; não afirmar que a proteção contra exclusão vinculada foi testada no console sem fazê-lo.
- **Fala sugerida:** “Também observamos que a exclusão não acontecia como esperado. O app já chamava a operação de apagar, então tornamos explícita a confirmação e o retorno: agora a lista atualiza no sucesso e o usuário recebe orientação se houver falta de permissão. Para matérias, a interface bloqueia a exclusão quando encontra sessões associadas e só libera documentos do próprio usuário. Como as regras precisam estar publicadas no Firebase, a validação real depende de testar no projeto configurado.”
- **Mostrar:** regra de `delete` de `materias` e `sessoes_estudo`, tela com a confirmação e, se publicado/testado, o resultado no console Firestore. Nunca mostrar credenciais.
- **Tempo:** 2 min.
- **Responsável:** `[INTEGRANTE 3]`.

## 8. Aprendizados e próximos passos — 1 minuto

- **Título sugerido do slide:** O que levamos e o que pode evoluir.
- **Objetivo:** fechar a apresentação com aprendizados e melhorias futuras realistas.
- **Conteúdo técnico:**
  - Aprendizados confirmados pela equipe sobre componentes, navegação, tipagem, Firestore e regras.
  - O que fariam diferente: `[PREENCHER APÓS A RETROSPECTIVA]`.
  - Próximos passos possíveis, ainda não implementados: melhorar validações e testes automatizados, avaliar acessibilidade e preparar indicadores adicionais.
- **Fala sugerida:** “Neste projeto praticamos [APRENDIZADOS REAIS]. Se começássemos novamente, [DECISÃO DA EQUIPE]. Como próximos passos, poderíamos [MELHORIAS FUTURAS], mantendo a solução simples e segura.”
- **Mostrar:** slide final com aprendizados e próximos passos; agradecer e abrir para perguntas.
- **Tempo:** 1 min.
- **Responsável:** `[INTEGRANTE 4]`.

## Checklist final

- [ ] Slides preparados e exportados em PDF.
- [ ] Aplicativo testado e aberto antes da apresentação.
- [ ] Pelo menos cinco registros fictícios disponíveis.
- [ ] Console do Firebase acessível, se for demonstrado.
- [ ] Vídeo de reserva pronto.
- [ ] Fala dividida e ensaiada por todos os integrantes.
- [ ] Tempo total conferido: 15 minutos.
- [ ] Nenhuma chave, senha ou dado pessoal aparece nos slides ou na demonstração.

Este roteiro prepara o conteúdo e a divisão da fala; não substitui os slides em PDF exigidos pela atividade.
