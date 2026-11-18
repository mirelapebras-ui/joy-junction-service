# Revisão acadêmica — SAE / Camélia Estética

Base: documento de análise enviado por Mirela e orientações do professor em 17/11/2026.

## Correções necessárias
- Organizar a entrega em capa, descrição, requisitos, casos de uso, classes de projeto e repositório.
- Usar Cliente, Secretária e Profissional, e não Paciente ou Médico.
- Consumir saldo do pacote no agendamento; registrar o atendimento não consome novamente. Cancelar devolve a sessão.
- Documentar a exceção de cancelamento da recepção, inclusive para horários passados.
- Não atribuir agendamento ou remarcação à tela da recepção: estão previstos no briefing, mas não disponíveis nessa tela.
- Criar o pacote antes de registrar a entrada; pagamento inicial é opcional, não um include obrigatório.
- Registrar atendimento a partir de uma sessão agendada; ao concluir, o sistema altera o estado para realizada.
- Separar exportação financeira CSV de relatório mensal de atendimentos, que é exibido na tela.
- Substituir o diagrama de análise por projeto com tipos, visibilidade, operações e multiplicidades; esclarecer que entidades são interfaces e operações estão em funções, não em classes executáveis.
- Marcar disponibilidade 24h, consulta em 2s, 50 usuários, segurança efetiva e LGPD como metas não comprovadas pelo protótipo local.

## Evidências conferidas
- Código de todas as regras em src/lib/db.ts e telas de cliente, secretária e profissional.
- 14 testes aprovados em 17/11/2026: 13 de negócio e 1 de contato.
- Repositório público acessível: https://github.com/mirelapebras-ui/estetica-git.
- Nenhuma mudança funcional no site nesta revisão; a documentação descreve a implementação existente.

## Entrega e limitações
- Nome confirmado da integrante para a capa: Mirela Petacci Bras.
- Vídeo MP4 de até 1 minuto ainda deve ser gravado pela estudante.
- Conferir os commits e enviar a documentação revisada ao repositório da estudante; o repositório daqui é separado.
- Trabalho individual ou dupla; em dupla, ambos precisam de commits reais.
- Prazo informado: 18/11/2026 às 21h00. Enviar pelo BB.
- Revisão assistida não substitui domínio e autoria da estudante; seguir as regras da disciplina sobre uso de ferramentas.