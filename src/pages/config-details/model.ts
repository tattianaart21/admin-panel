import { useConfig, useConfigVersion, useConfigVersions } from "@/entities/config";

type Props = {
  configId: string;
  version: number | null;
};

export function useConfigDetailsData({ configId, version }: Props) {
  const config = useConfig(configId);
  const versions = useConfigVersions(configId);
  const configVersion = useConfigVersion(
    configId,
    version ?? config.data?.active_version?.version,
  );

  return {
    config: {
      api: config,
    },
    versions: {
      api: versions,
      total: versions.data?.pagination.total ?? 0,
    },
    configVersion: {
      api: configVersion,
      params: configVersion.data?.params ?? [],
    },
  };
}
