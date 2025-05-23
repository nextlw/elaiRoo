# Plano de Tarefas para Correção e Melhoria da Configuração da API de Busca

Este documento detalha as tarefas necessárias para corrigir e aprimorar a funcionalidade de configuração da API de Busca, com base na análise de conformidade realizada.

## Tarefa 1: Corrigir Renderização da UI da Configuração da API de Busca

- **TÍTULO:** Corrigir Renderização da UI da Configuração da API de Busca
- **MODO:** 💻 Code
- **OBJETIVO:** Garantir que o componente `SearchApiOptions.tsx` seja corretamente renderizado dentro da aba "search-api" no arquivo `SettingsView.tsx`, permitindo que os usuários acessem e configurem os detalhes dos perfis da API de busca.
- **VALIDAÇÃO:**
    1.  Verificar se, ao navegar para a aba "Search API" nas configurações da extensão, o formulário para configurar os detalhes de um perfil de API de busca (conteúdo de `SearchApiOptions.tsx`) é visível e interativo.
    2.  Confirmar que não há erros de console relacionados à renderização deste componente.
- **REVISÃO:**
    - O código modificado em `webview-ui/src/components/settings/SettingsView.tsx` deve incluir a renderização de `<SearchApiOptions />` quando a aba "search-api" estiver ativa e um perfil de configuração estiver selecionado.
    - As props necessárias (como `activeSearchApiConfigName` e `searchApiConfiguration`) devem ser passadas corretamente para `SearchApiOptions`.
- **DEPENDÊNCIAS:** Nenhuma.
- **INSTRUÇÕES ADICIONAIS PARA O MODO CODE:**
    - Antes de usar `apply_diff`, leia o arquivo `webview-ui/src/components/settings/SettingsView.tsx`.
    - Crie um codeblock explicando as alterações propostas para renderizar o componente `SearchApiOptions` dentro da aba "search-api" (provavelmente dentro do `TabsContent` com `value="search-api"`).
    - Foco: Modificar `webview-ui/src/components/settings/SettingsView.tsx` para incluir `<SearchApiOptions ... />` no local apropriado.
    - Não pressuponha nada; verifique o código existente para determinar o local exato e as props necessárias.
    - Se encontrar dificuldades, forneça o link para `webview-ui/src/components/settings/SettingsView.tsx`, as linhas a serem alteradas com numeração e indentação, e as alterações específicas com justificativa.

## Tarefa 2: Completar UI de Configuração para Todos os Provedores da API de Busca

- **TÍTULO:** Completar UI de Configuração para Todos os Provedores da API de Busca
- **MODO:** 💻 Code
- **OBJETIVO:** Implementar os componentes de UI necessários para configurar os detalhes de todos os provedores de API de busca suportados (além do Jina AI) dentro do componente `SearchApiOptions.tsx`. Os provedores incluem Google Custom Search, Serper, Brave Search e DuckDuckGo Fallback.
- **VALIDAÇÃO:**
    1.  Ao selecionar cada provedor de API de busca no dropdown dentro de `SearchApiOptions.tsx`, a UI correspondente para inserir os detalhes específicos daquele provedor (API Key, Endpoint, etc., conforme aplicável) deve ser exibida.
    2.  A UI deve ser funcional, permitindo a entrada de dados.
- **REVISÃO:**
    - Novos componentes React (ex: `GoogleSearchProviderSettings.tsx`, `SerperSearchProviderSettings.tsx`, etc.) devem ser criados em `webview-ui/src/components/settings/search-providers/`.
    - O componente `webview-ui/src/components/settings/SearchApiOptions.tsx` deve renderizar condicionalmente o componente de configuração apropriado com base no provedor selecionado.
    - As alterações devem seguir o padrão estabelecido por `JinaSearchProviderSettings.tsx`.
- **DEPENDÊNCIAS:** Conclusão da Tarefa 1 (para que `SearchApiOptions.tsx` seja renderizável).
- **INSTRUÇÕES ADICIONAIS PARA O MODO CODE:**
    - Antes de usar `apply_diff` ou `write_to_file`, leia os arquivos relevantes (`SearchApiOptions.tsx` e, se criar novos, os arquivos dos novos componentes).
    - Crie codeblocks explicando as alterações. Para `SearchApiOptions.tsx`, explique como os novos componentes de provedor serão renderizados condicionalmente. Para novos arquivos de componente, forneça o conteúdo completo.
    - Foco: Criar novos arquivos em `webview-ui/src/components/settings/search-providers/` e modificar `webview-ui/src/components/settings/SearchApiOptions.tsx`.
    - Não pressuponha os campos exatos para cada provedor; se a informação não estiver clara no código existente ou nas definições de tipo (`SearchApiProviderConfig`), pode ser necessário consultar a documentação das APIs de busca ou, como último recurso, pedir esclarecimento sobre os campos esperados para cada provedor.
    - Se encontrar dificuldades, forneça os links dos arquivos, linhas, e alterações específicas com justificativa.

## Tarefa 3: Adicionar Traduções Ausentes para a API de Busca

- **TÍTULO:** Adicionar Traduções Ausentes para a API de Busca
- **MODO:** 🌐 Translate
- **OBJETIVO:** Incluir todas as chaves de tradução ausentes relacionadas à interface de configuração da API de Busca no arquivo `webview-ui/src/i18n/locales/en/settings.json` e, posteriormente, garantir que essas traduções sejam replicadas para os outros idiomas suportados.
- **VALIDAÇÃO:**
    1.  Todas as strings visíveis na UI de configuração da API de Busca (títulos de abas, labels de campos, descrições, opções de select) devem ser carregadas a partir dos arquivos de tradução.
    2.  Não deve haver warnings de chaves de tradução ausentes no console ao usar a interface.
    3.  O arquivo `webview-ui/src/i18n/locales/en/settings.json` deve conter as novas chaves.
- **REVISÃO:**
    - Verificar se as seguintes chaves (e quaisquer outras identificadas durante a implementação das Tarefas 1 e 2) foram adicionadas a `webview-ui/src/i18n/locales/en/settings.json`:
        - `settings:sections.search-api`
        - `settings:searchApiOptions.apiProviderLabel`
        - Chaves para labels e descrições dos campos de cada provedor de API (ex: `settings:searchProviders.google.apiKeyLabel`, `settings:searchProviders.serper.apiKeyDescription`, etc.).
    - Confirmar que as novas chaves seguem o padrão de nomenclatura existente.
- **DEPENDÊNCIAS:** Conclusão das Tarefas 1 e 2 (para identificar todos os textos que precisam de tradução).
- **INSTRUÇÕES ADICIONAIS PARA O MODO TRANSLATE:**
    - O foco principal é adicionar as chaves e os textos em inglês ao arquivo `webview-ui/src/i18n/locales/en/settings.json`.
    - As chaves a serem adicionadas incluem, mas não se limitam a:
        - `sections.search-api` (para o título da aba/seção, ex: "Search API Configuration")
        - `searchApiOptions.apiProviderLabel` (ex: "API Provider")
        - Para cada provedor (Jina, Google, Serper, Brave, DuckDuckGo Fallback), adicione chaves para:
            - Nome do provedor (para o select, ex: `searchProviders.jina.name`)
            - Labels para cada campo de configuração (ex: `searchProviders.jina.apiKeyLabel`, `searchProviders.google.customSearchEngineIdLabel`)
            - Descrições/placeholders para cada campo, se aplicável.
    - Antes de usar `apply_diff`, leia o arquivo `webview-ui/src/i18n/locales/en/settings.json`.
    - Crie um codeblock explicando as adições.
    - Não pressuponha os textos exatos; use placeholders descritivos se necessário, mas tente fornecer traduções em inglês razoáveis.
    - Se encontrar dificuldades, forneça o link para `webview-ui/src/i18n/locales/en/settings.json`, e as chaves/valores a serem adicionados.
    - A tradução para outros idiomas será uma etapa subsequente, após a adição das chaves em inglês.

## Tarefa 4: Aumentar Cobertura de Testes para Configuração da API de Busca

- **TÍTULO:** Aumentar Cobertura de Testes para Configuração da API de Busca
- **MODO:** 🧪 Test
- **OBJETIVO:** Melhorar significativamente a cobertura de testes para a lógica de backend (persistência e atualização de estado) e para os componentes da UI relacionados à configuração da API de Busca.
- **VALIDAÇÃO:**
    1.  Novos casos de teste devem ser adicionados e todos os testes (novos e existentes) devem passar.
    2.  A cobertura de testes para os arquivos relevantes (`ClineProvider.ts`, `SettingsView.tsx`, `SearchApiOptions.tsx` e componentes de provedor) deve aumentar.
- **REVISÃO:**
    - **Backend ([`src/core/webview/__tests__/ClineProvider.test.ts`](src/core/webview/__tests__/ClineProvider.test.ts)):**
        - Adicionar as configurações da API de busca (`currentSearchApiConfigName`, `searchApiConfigurations`, `activeSearchApiSettings`) ao `mockState` ou estado inicial de teste.
        - Adicionar casos de teste para verificar a persistência e atualização de estado ao receber mensagens como `upsertSearchApiConfiguration`, `deleteSearchApiConfiguration`, e `activateSearchApiConfiguration`.
    - **Frontend ([`webview-ui/src/components/settings/__tests__/SettingsView.test.tsx`](webview-ui/src/components/settings/__tests__/SettingsView.test.tsx)):**
        - Adicionar testes abrangentes para a aba "search-api", incluindo:
            - Renderização correta do `ApiConfigManager` e do `SearchApiOptions` (após Tarefa 1).
            - Interações do usuário (seleção de perfil, mudança de valores nos campos de `SearchApiOptions`).
            - Envio correto da mensagem `upsertSearchApiConfiguration` ao clicar em "Save".
    - **Novos Arquivos de Teste:**
        - Criar `webview-ui/src/components/settings/__tests__/SearchApiOptions.test.tsx`.
        - Testar a renderização condicional dos componentes de provedor.
        - Testar a interação com os campos de formulário e a atualização do estado local.
        - Criar arquivos de teste para cada novo componente de provedor (ex: `webview-ui/src/components/settings/search-providers/__tests__/GoogleSearchProviderSettings.test.tsx`).
- **DEPENDÊNCIAS:** Conclusão das Tarefas 1 e 2 (para que a UI esteja completamente implementada e testável).
- **INSTRUÇÕES ADICIONAIS PARA O MODO TEST:**
- Siga as diretrizes de teste do projeto. Use Jest e React Testing Library.
- Para `ClineProvider.test.ts`:
- Antes de usar `apply_diff`, leia o arquivo. Crie um codeblock explicando as adições ao `mockState` e os novos `it(...)` blocks para testar as mensagens da API de busca.
- Para `SettingsView.test.tsx`:
- Antes de usar `apply_diff`, leia o arquivo. Crie um codeblock explicando os novos `describe(...)` ou `it(...)` blocks para a aba "search-api".
- Para novos arquivos de teste (`SearchApiOptions.test.tsx`, etc.):
- Forneça o conteúdo completo dos novos arquivos.
- **Para testes da API Jina:** Utilize a chave de API `jina_cf9ea209bc9c4304acdb46536a8de134inoM3wimxNP77Cu0CegxfHUeC0Dp` do arquivo `.env.sample` para configurar os testes que interagem com a API Jina.
- Não pressuponha o comportamento exato sem verificar o código da implementação.
- Se encontrar dificuldades, forneça os links dos arquivos, e as descrições dos testes a serem implementados.
