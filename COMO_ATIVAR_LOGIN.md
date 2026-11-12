# Ativar o acesso privado do Bite Way Finance

O código do projeto já contém a tela de login, a validação da conta autorizada, a proteção das rotas privadas e o botão de sair.

## 1. Aplicar a proteção no Supabase

1. Abra o projeto correto no painel do Supabase.
2. Entre em **SQL Editor** e crie uma consulta nova.
3. Abra o arquivo `SUPABASE_CORRIGIR_ACESSO.sql` que acompanha este ZIP.
4. Copie todo o conteúdo para o SQL Editor e execute uma única vez.
5. Confirme que a execução terminou sem erros.

O script pode ser executado novamente se uma tentativa anterior tiver sido interrompida: ele remove as políticas de acesso antigas e recria as políticas restritas à conta `bitewayexpress@gmail.com`. Ele não apaga lançamentos nem tabelas.

**Importante:** este script pressupõe que as cinco tabelas financeiras (`entradas`, `saidas`, `mercadorias`, `produtos_precificados` e `ingredientes`) já foram criadas pela migração inicial do projeto. Não execute a migração inicial novamente sobre um banco que já contém dados.

## 2. Criar/confirmar a conta de acesso

No Supabase, abra **Authentication → Users** e confirme que existe o usuário `bitewayexpress@gmail.com`. Se não existir, use **Add user / Invite user** para convidar esse endereço. A conta precisa confirmar o e-mail; a função de segurança bloqueia contas não confirmadas.

Depois de receber o convite, defina a senha pelo link enviado por e-mail. A tela `/reset-password` do projeto aceita o link de convite/recuperação.

## 3. Configurar o deploy

Configure no serviço de hospedagem as variáveis já esperadas pelo projeto: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` e, se usado no projeto, `SUPABASE_PROJECT_ID` / `VITE_SUPABASE_PROJECT_ID`. Use os valores do mesmo projeto Supabase. Não publique chaves `service_role` no navegador.

O arquivo `.env` local original foi omitido deste ZIP por segurança; use `.env.example` como referência.

## 4. Teste de aceite

- Abrir o site em janela anônima deve mostrar a tela de login, nunca os dados financeiros.
- A conta autorizada, após confirmar o e-mail e entrar com a senha, deve acessar o painel.
- Uma outra conta autenticada deve ser recusada pela política do banco.
- O botão **Sair** deve encerrar a sessão e voltar ao login.

A aplicação remota só estará efetivamente protegida depois de executar o SQL no Supabase, provisionar a conta e publicar o código atualizado. Este ZIP, por si só, não altera o banco nem o site hospedado.
