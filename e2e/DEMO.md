# 🚀 Demo Script - Testes E2E ElaiRoo

Este script interativo facilita a execução dos diferentes tipos de testes E2E do ElaiRoo.

## 🎯 Como Usar

### Execução Rápida

```bash
# No diretório raiz do projeto ElaiRoo
./e2e/run-tests-demo.sh
```

### Menu Interativo

O script apresenta um menu com as seguintes opções:

1. **📱 WhatsApp Integration Tests** - Testa integração completa com WhatsApp
2. **🔍 Web Search Interface Tests** - Testa funcionalidade de busca web
3. **🎨 UI Components Tests** - Testa componentes de interface
4. **🧠 Deep Research Tests** - Testa funcionalidade Deep Research
5. **⚡ Todos os testes E2E** - Executa todos os testes
6. **🔧 Verificar configuração** - Valida setup do ambiente
7. **❌ Sair** - Encerra o script

## 📋 Pré-requisitos

- Node.js 20.19.2+
- NPM ou PNPM instalado
- VS Code com extensão ElaiRoo carregada
- (Opcional) Deep Research server rodando em localhost:3002

## 🔧 Verificação Automática

O script verifica automaticamente:

- ✅ Presença do package.json
- ✅ Instalação das dependências
- ✅ Status do Deep Research server
- ✅ Configuração do ambiente

## 📊 Interpretando Resultados

### ✅ Sucesso

Todos os testes passaram - funcionalidade está operacional

### ❌ Falha

Verificar logs para identificar problemas:

- Configuração de APIs (Jina, Deep Research)
- Conexão com serviços externos
- Estado da extensão VS Code

### ⚠️ Parcial

Alguns testes passaram, outros falharam:

- Geralmente indica problemas de configuração
- Funcionalidade básica funciona, mas recursos avançados podem falhar

## 🛠️ Troubleshooting

### Erro: "Permission denied"

```bash
chmod +x e2e/run-tests-demo.sh
```

### Erro: "Deep Research server não responde"

- Os testes funcionam com mocks mesmo sem o server
- Para testar funcionalidade completa, inicie o server Deep Research

### Timeout nos testes

- Testes de interface são rápidos (< 30s)
- Testes de integração podem demorar mais (< 60s)
- Se persistir, verificar recursos do sistema

## 🎨 Personalização

Para adicionar novos testes ao script:

1. Adicione novo script no `package.json`
2. Adicione nova opção no menu do script
3. Implemente o case correspondente

Exemplo:

```bash
8)
    run_test "npm run test:e2e:novo-teste" "Novo Teste"
    ;;
```

---

**Facilita a execução e validação dos testes E2E do ElaiRoo! 🎉**
