export type AutomationSignal = {
  title: string;
  reason: string;
  severity: "low" | "medium" | "high";
};

export function buildAutomationSignals(input: {
  meetingsTomorrow: number;
  overdueInvoices: number;
  staleClients: number;
  missingContracts: number;
}): AutomationSignal[] {
  const signals: AutomationSignal[] = [];

  if (input.meetingsTomorrow > 0) {
    signals.push({
      title: "Preparar reuniones de mañana",
      reason: "Hay reuniones próximas y ATLAS debe generar checklist.",
      severity: "medium"
    });
  }

  if (input.overdueInvoices > 0) {
    signals.push({
      title: "Reclamar cobros vencidos",
      reason: "Hay facturas o hitos pendientes de cobro.",
      severity: "high"
    });
  }

  if (input.staleClients > 0) {
    signals.push({
      title: "Seguimiento comercial",
      reason: "Hay clientes/leads sin contacto reciente.",
      severity: "medium"
    });
  }

  if (input.missingContracts > 0) {
    signals.push({
      title: "Contratos pendientes",
      reason: "Un proyecto no debe estar en verde sin contrato/documentación base.",
      severity: "high"
    });
  }

  return signals;
}

