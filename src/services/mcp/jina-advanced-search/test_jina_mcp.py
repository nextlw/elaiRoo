#!/usr/bin/env python3
"""
Script de teste para validar o funcionamento do servidor Jina Advanced Search MCP.
Testa com a API key real carregada do arquivo .env.
"""

import asyncio
import json
import os
import sys
from pathlib import Path

# Adicionar diretório atual ao path
sys.path.insert(0, str(Path(__file__).parent))

from main import advanced_web_search, get_server_info

async def load_jina_api_key():
    """Carrega a JINA_API_KEY do arquivo .env"""
    env_path = Path(__file__).parent.parent.parent.parent / ".env"

    if not env_path.exists():
        print(f"❌ Arquivo .env não encontrado em: {env_path}")
        return None

    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('JINA_API_KEY='):
                api_key = line.split('=', 1)[1].strip('"\'')
                print(f"✅ API Key carregada do .env: {api_key[:8]}...{api_key[-4:]}")
                return api_key

    print("❌ JINA_API_KEY não encontrada no arquivo .env")
    return None

async def test_server_info():
    """Testa a função get_server_info"""
    print("\n🔍 Testando get_server_info...")
    try:
        result = await get_server_info()
        print("✅ get_server_info funcionou!")
        print(f"📊 Resultado: {json.dumps(result, indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Erro em get_server_info: {str(e)}")
        return False

async def test_advanced_web_search(api_key):
    """Testa a função advanced_web_search com API key real"""
    print(f"\n🔍 Testando advanced_web_search com API key...")

    # Configurar variável de ambiente
    os.environ['JINA_API_KEY'] = api_key

    try:
        # Criar argumentos de teste
        arguments = {
            "query": "Python programming tutorial",
            "max_results": 3,
            "api_key": api_key,
            "use_reranking": False  # Simplificar para o teste
        }

        print(f"🚀 Executando busca: '{arguments['query']}'")
        result = await advanced_web_search(arguments)

        if "error" in result:
            print(f"❌ Erro na busca: {result['error']}")
            return False
        else:
            print("✅ advanced_web_search funcionou!")
            print(f"📊 Encontrados: {result.get('total_results', 0)} resultados")

            # Mostrar alguns resultados
            docs = result.get('documents', [])
            for i, doc in enumerate(docs[:2]):  # Mostrar apenas 2 primeiros
                print(f"  📄 {i+1}. {doc.get('title', 'N/A')[:60]}...")
                print(f"      🔗 {doc.get('url', 'N/A')}")

            return True

    except Exception as e:
        print(f"❌ Erro em advanced_web_search: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Função principal de teste"""
    print("🧪 INICIANDO TESTES DO JINA ADVANCED SEARCH MCP")
    print("=" * 50)

    # Carregar API key
    api_key = await load_jina_api_key()
    if not api_key:
        print("❌ Não é possível continuar sem API key")
        sys.exit(1)

    # Teste 1: Server info
    success_info = await test_server_info()

    # Teste 2: Advanced web search
    success_search = await test_advanced_web_search(api_key)

    # Resultados finais
    print("\n" + "=" * 50)
    print("📋 RESUMO DOS TESTES:")
    print(f"  • get_server_info: {'✅ PASSOU' if success_info else '❌ FALHOU'}")
    print(f"  • advanced_web_search: {'✅ PASSOU' if success_search else '❌ FALHOU'}")

    if success_info and success_search:
        print("\n🎉 TODOS OS TESTES PASSARAM! O servidor Jina MCP está funcionando corretamente.")
        return 0
    else:
        print("\n💥 ALGUNS TESTES FALHARAM. Verifique os erros acima.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
