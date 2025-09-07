import { DomainException } from './DomainException.js';

/**
 * Exceção lançada quando uma regra de negócio é violada
 */
export class TaskBusinessRuleException extends DomainException {
  public readonly rule: string;

  constructor(rule: string, message: string) {
    super(message, 'BUSINESS_RULE_VIOLATION');
    this.rule = rule;
  }

  /**
   * Factory method para regra de data de conclusão
   */
  public static completionDateRule(message: string): TaskBusinessRuleException {
    return new TaskBusinessRuleException('COMPLETION_DATE_RULE', message);
  }

  /**
   * Factory method para regra de data de criação
   */
  public static creationDateRule(message: string): TaskBusinessRuleException {
    return new TaskBusinessRuleException('CREATION_DATE_RULE', message);
  }

  /**
   * Factory method para regra de data de atualização
   */
  public static updateDateRule(message: string): TaskBusinessRuleException {
    return new TaskBusinessRuleException('UPDATE_DATE_RULE', message);
  }

  /**
   * Factory method para regra de data de vencimento
   */
  public static dueDateRule(message: string): TaskBusinessRuleException {
    return new TaskBusinessRuleException('DUE_DATE_RULE', message);
  }

  /**
   * Factory method para regra customizada
   */
  public static custom(rule: string, message: string): TaskBusinessRuleException {
    return new TaskBusinessRuleException(rule, message);
  }

  /**
   * Retorna representação JSON com regra violada
   */
  public override toJSON() {
    return {
      ...super.toJSON(),
      rule: this.rule
    };
  }
}
