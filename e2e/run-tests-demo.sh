#!/bin/bash

# Demo Script para Execução de Testes E2E - ElaiRoo
# Este script demonstra como executar os diferentes tipos de testes E2E

echo "🚀 ElaiRoo E2E Tests Demo Script"
echo "================================="
echo ""

# Função para exibir menu
show_menu() {
    echo "Escolha o tipo de teste a executar:"
    echo ""
    echo "1) 📱 WhatsApp Integration Tests"
    echo "2) 🔍 Web Search Interface Tests"
    echo "3) 🎨 UI Components Tests"
    echo "4) 🧠 Deep Research Tests"
    echo "5) ⚡ Todos os testes E2E"
    echo "6) 🔧 Verificar configuração"
    echo "7) ❌ Sair"
    echo ""
}

# Função para verificar configuração
check_config() {
    echo "🔧 Verificando configuração..."
    echo ""

    # Verificar se estamos no diretório correto
    if [ ! -f "package.json" ]; then
        echo "❌ Erro: Execute este script no diretório raiz do projeto ElaiRoo"
        return 1
    fi

    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "⚠️  node_modules não encontrado. Executando npm install..."
        npm install
    fi

    # Verificar se Deep Research está rodando (opcional)
    echo "🔍 Verificando Deep Research server..."
    if curl -s http://localhost:3002/health > /dev/null 2>&1; then
        echo "✅ Deep Research server está rodando em localhost:3002"
    else
        echo "⚠️  Deep Research server não está rodando (testes usarão mocks)"
    fi

    echo "✅ Configuração verificada!"
    echo ""
}

# Função para executar testes com logs coloridos
run_test() {
    local test_command="$1"
    local test_name="$2"

    echo "🧪 Executando: $test_name"
    echo "📝 Comando: $test_command"
    echo ""

    # Executar o teste
    if eval "$test_command"; then
        echo ""
        echo "✅ $test_name - SUCESSO"
    else
        echo ""
        echo "❌ $test_name - FALHOU"
        echo "💡 Dica: Verifique os logs acima para detalhes do erro"
    fi

    echo ""
    echo "Pressione Enter para continuar..."
    read
}

# Loop principal
while true; do
    clear
    show_menu
    read -p "Digite sua escolha [1-7]: " choice

    case $choice in
        1)
            run_test "npm run test:e2e:whatsapp" "WhatsApp Integration Tests"
            ;;
        2)
            run_test "npm run test:e2e:web-search" "Web Search Interface Tests"
            ;;
        3)
            run_test "npm run test:e2e:ui-components" "UI Components Tests"
            ;;
        4)
            run_test "npm run test:e2e:deep-research" "Deep Research Tests"
            ;;
        5)
            echo "🚀 Executando TODOS os testes E2E..."
            echo "⏱️  Isso pode demorar alguns minutos..."
            echo ""
            run_test "npm run test:e2e" "Todos os Testes E2E"
            ;;
        6)
            check_config
            echo "Pressione Enter para continuar..."
            read
            ;;
        7)
            echo "👋 Saindo..."
            exit 0
            ;;
        *)
            echo "❌ Opção inválida. Tente novamente."
            sleep 2
            ;;
    esac
done
