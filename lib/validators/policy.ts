// lib/validators/policy.ts
export function parsePolicyPayload(body: any) {
  const {
    name,
    description,
    requiresDocument,
    maxConsecutiveDays,
    blackoutDates,
    autoApprovalThreshold,
    isActive,
  } = body ?? {};

  if (!name || typeof name !== 'string') {
    return { error: 'Le nom de la politique est requis.' };
  }

  const parsedBlackoutDates = Array.isArray(blackoutDates)
    ? blackoutDates
        .map((value) => {
          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? null : date;
        })
        .filter((value): value is Date => value !== null)
    : [];

  const parsedMaxConsecutive =
    maxConsecutiveDays !== undefined && maxConsecutiveDays !== null
      ? Number(maxConsecutiveDays)
      : undefined;

  const parsedAutoApproval =
    autoApprovalThreshold !== undefined && autoApprovalThreshold !== null
      ? Number(autoApprovalThreshold)
      : undefined;

  if (parsedMaxConsecutive !== undefined && parsedMaxConsecutive <= 0) {
    return {
      error: 'Le nombre maximum de jours consécutifs doit être positif.',
    };
  }

  if (parsedAutoApproval !== undefined && parsedAutoApproval < 0) {
    return {
      error: "Le seuil d'approbation automatique doit être positif.",
    };
  }

  return {
    name,
    description: description ?? null,
    requiresDocument: Boolean(requiresDocument),
    maxConsecutiveDays: parsedMaxConsecutive,
    blackoutDates: parsedBlackoutDates,
    autoApprovalThreshold: parsedAutoApproval,
    isActive: isActive === undefined ? true : Boolean(isActive),
  };
}
