import { SERVER_CONFIGS } from './serverConfigDictPart1';
import { SERVER_CONFIGS_PART_2 } from './serverConfigDictPart2';
import { SERVER_CONFIGS_PART_3 } from './serverConfigDictPart3';
import { SERVER_CONFIGS_PART_4 } from './serverConfigDictPart4';

export const ALL_SERVER_CONFIGS = {
  ...SERVER_CONFIGS,
  ...SERVER_CONFIGS_PART_2,
  ...SERVER_CONFIGS_PART_3,
  ...SERVER_CONFIGS_PART_4,
};

export function getServerConfigStr(server: string, profile: string): string {
  const normServer = server.toLowerCase();
  const normProfile = profile.toLowerCase();
  
  const serverData = ALL_SERVER_CONFIGS[normServer];
  if (!serverData) return "Select a valid server and profile.";
  
  return serverData[normProfile] || "Select a valid server and profile.";
}
