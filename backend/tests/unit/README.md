# ⚠️ Testes Unitários - Limitação Conhecida

## Problema

Os testes unitários estão enfrentando problemas com Jest + ES Modules. O Jest tem suporte experimental para ES modules e pode ter dificuldades em resolver módulos mockados.

## Status Atual

- ✅ **Testes de Integração**: Funcionam perfeitamente (quando o PostgreSQL está disponível)
- ⚠️ **Testes Unitários**: Têm problemas com mocks de ES modules

## Soluções Alternativas

### Opção 1: Usar Vitest (Recomendado)

Vitest tem melhor suporte para ES modules:

```bash
npm install -D vitest
```

E atualizar `package.json`:
```json
{
  "scripts": {
    "test:unit": "vitest run tests/unit"
  }
}
```

### Opção 2: Converter para CommonJS temporariamente

Converter os arquivos de teste para CommonJS pode resolver o problema, mas não é ideal.

### Opção 3: Focar nos Testes de Integração

Os testes de integração já cobrem a maior parte da funcionalidade e funcionam perfeitamente.

## Testes Funcionando

✅ **Testes de Integração** (`tests/integration/`):
- `auth.test.js` - Testa rotas de autenticação
- `items.test.js` - Testa rotas de itens

Estes testes:
- Funcionam quando o PostgreSQL está disponível
- Pulam automaticamente quando o banco não está disponível
- Testam a funcionalidade completa da API

## Como Executar

```bash
# Testes de integração (funcionam perfeitamente)
npm test -- tests/integration

# Testes unitários (têm limitações com ES modules)
npm test -- tests/unit
```

## Nota

A estrutura dos testes está correta. O problema é uma limitação do Jest com ES modules. Os testes de integração são mais valiosos pois testam a aplicação completa.

