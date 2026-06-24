const FAMILY_COLORS: Record<string, string> = {
  GigaHF: "#7B61FF",
  GigaChat: "#2980FF",
  Qwen: "#FF6B35",
};

export function getModelAbbreviation(modelName: string): string {
  const gigaHf = modelName.match(/GigaHF-([A-Za-z0-9]+)/i);
  if (gigaHf) return gigaHf[1].slice(0, 3).toUpperCase();

  const gigaChat = modelName.match(/GigaChat-?(\d)?/i);
  if (gigaChat) return `GC${gigaChat[1] ?? ""}`.slice(0, 3);

  if (/qwen/i.test(modelName)) return "QW";

  const token = modelName.split(/[-_.]/).find((p) => /^[A-Za-z0-9]{2,}$/.test(p));
  return (token ?? "AI").slice(0, 3).toUpperCase();
}

export function getModelFamilyColor(modelName: string): string {
  if (modelName.startsWith("GigaHF")) return FAMILY_COLORS.GigaHF;
  if (modelName.startsWith("GigaChat")) return FAMILY_COLORS.GigaChat;
  if (/qwen/i.test(modelName)) return FAMILY_COLORS.Qwen;

  let hash = 0;
  for (let i = 0; i < modelName.length; i += 1) {
    hash = modelName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 45% 48%)`;
}
