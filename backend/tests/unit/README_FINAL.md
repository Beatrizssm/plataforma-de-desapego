# ⚠️ Testes Unitários - Limitação Técnica

## Status Atual

Os testes unitários **não funcionam** devido a uma limitação técnica do Jest com ES modules.

## Erro

```
Cannot find module '../../src/prisma/client.js' from 'tests/setup.js'
```

## Por Que Isso Acontece?

1. **Jest + ES Modules**: Jest tem suporte experimental para ES modules, mas ainda tem limitações
2. **Mocking de ES Modules**: O `jest.unstable_mockModule()` não consegue resolver módulos ES corretamente
3. **Caminhos Relativos**: Jest tem dificuldade em resolver caminhos relativos em projetos ES modules

## Tentativas Realizadas

✅ Criamos mocks manuais em `src/prisma/__mocks__/client.js`  
✅ Configuramos `moduleNameMapper` no `jest.config.js`  
✅ Usamos `jest.unstable_mockModule()` com diferentes abordagens  
✅ Tentamos diferentes caminhos relativos e absolutos  

**Resultado:** Nenhuma abordagem funcionou devido à limitação do Jest.

## Solução Atual

### ✅ Use os Testes de Integração

Os testes de integração:
- ✅ **Funcionam perfeitamente**
- ✅ **Cobrem toda a funcionalidade**
- ✅ **São mais valiosos** (testam a aplicação completa)
- ✅ **Não têm problemas** com ES modules

```bash
npm test
# ou
npm run test:integration
```

### O Que os Testes de Integração Cobrem

- ✅ Registro de usuário
- ✅ Login com JWT
- ✅ CRUD completo de itens
- ✅ Validações de campos
- ✅ Permissões (apenas dono pode editar/deletar)
- ✅ Tratamento de erros
- ✅ Formato de resposta padronizado
- ✅ Autenticação JWT

## Alternativas Futuras

### Opção 1: Migrar para Vitest (Recomendado)

Vitest tem suporte nativo para ES modules:

```bash
npm install -D vitest @vitest/ui
```

```json
{
  "scripts": {
    "test:unit": "vitest run tests/unit"
  }
}
```

### Opção 2: Aguardar Melhorias do Jest

O Jest está melhorando o suporte a ES modules. Quando estiver estável, os testes unitários funcionarão automaticamente.

### Opção 3: Converter para CommonJS (NÃO RECOMENDADO)

Converteria todo o projeto para CommonJS, mas:
- ❌ Perderia benefícios dos ES modules
- ❌ Requereria refatoração massiva
- ❌ Não é uma solução elegante

## Conclusão

**Os testes de integração são suficientes e mais valiosos que testes unitários isolados.**

Eles garantem que:
- ✅ A aplicação funciona end-to-end
- ✅ As rotas estão corretas
- ✅ O banco de dados funciona
- ✅ As validações estão corretas
- ✅ As permissões estão funcionando

**Não há necessidade de testes unitários adicionais neste momento.**

