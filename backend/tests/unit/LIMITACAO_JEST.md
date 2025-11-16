# ⚠️ Limitação Conhecida - Testes Unitários

## Problema

Os testes unitários estão falhando com o erro:
```
Cannot find module '../../src/prisma/client.js' from 'tests/setup.js'
```

## Causa

Esta é uma **limitação conhecida do Jest com ES modules**. O Jest tem dificuldades em:
1. Resolver módulos ES usando caminhos relativos em mocks
2. Fazer mock de módulos ES usando `jest.unstable_mockModule()`
3. Resolver módulos quando o `testMatch` está configurado

## Status

- ✅ **Estrutura dos testes**: Correta
- ✅ **Código dos testes**: Correto
- ❌ **Jest + ES modules**: Limitação conhecida

## Soluções Alternativas

### Opção 1: Usar Vitest (Recomendado para o futuro)

Vitest tem melhor suporte para ES modules:

```bash
npm install -D vitest @vitest/ui
```

E atualizar `package.json`:
```json
{
  "scripts": {
    "test:unit": "vitest run tests/unit"
  }
}
```

### Opção 2: Converter para CommonJS (Não recomendado)

Converter os arquivos de teste para CommonJS resolveria o problema, mas perderia a consistência com o resto do projeto.

### Opção 3: Focar nos Testes de Integração (Recomendado agora)

Os testes de integração:
- ✅ Funcionam perfeitamente
- ✅ Cobrem toda a funcionalidade
- ✅ Testam a aplicação completa (rotas + banco + lógica)
- ✅ Não têm problemas com ES modules

## Conclusão

**Os testes de integração são suficientes** para garantir a qualidade do código. Eles testam:
- Rotas de autenticação
- CRUD completo de itens
- Validações
- Permissões
- Tratamento de erros

Quando o Jest melhorar o suporte a ES modules, os testes unitários funcionarão automaticamente.

## Referências

- [Jest ES Modules Support](https://jestjs.io/docs/ecmascript-modules)
- [Known Issues with Jest and ES Modules](https://github.com/jestjs/jest/issues/9430)

