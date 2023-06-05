export type QuestionBoardEntityType = 'interimreport' | 'exploitationplan';

export function isInterimReport(entityType: QuestionBoardEntityType): boolean {
  return entityType === 'interimreport';
}

export function isExploitationPlan(entityType: QuestionBoardEntityType): boolean {
  return entityType === 'exploitationplan';
}
