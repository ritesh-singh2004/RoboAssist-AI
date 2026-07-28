export type RobotType =
  | 'Quadruped'
  | 'Bipedal Humanoid'
  | 'Industrial Robotic Arm'
  | 'Autonomous Rover'
  | 'Heavy Payload Exoskeleton'
  | 'Inspection Drone';

export type MissionType =
  | 'Inspection'
  | 'Surveillance'
  | 'Emergency Response'
  | 'Material Handling';

export type MissionStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';

export interface TelemetryData {
  timestamp: string;
  batteryPercent: number;
  cpuPercent: number;
  gpuPercent: number;
  thermalC: number;
  speedMps: number;
  motorTorqueNm: number;
  wifiSignalDbm: number;
  lat: number;
  lng: number;
  sector: string;
}

export interface Robot {
  id: string;
  name: string;
  modelCode: string;
  type: RobotType;
  status: 'Active' | 'Idle' | 'Charging' | 'In Mission' | 'Maintenance' | 'Offline';
  batteryPercent: number;
  cpuPercent: number;
  gpuPercent: number;
  tempCelsius: number;
  locationSector: string;
  coordinates: { lat: number; lng: number };
  activeMissionId?: string;
  cameraStreamUrl?: string;
  sensors: {
    lidarPoints: number;
    gasDetectionPpm: number;
    thermalMaxC: number;
    vibrationHz: number;
    ultrasonicCm: number;
  };
  telemetry: TelemetryData[];
}

export interface Mission {
  id: string;
  title: string;
  robotId: string;
  robotName: string;
  type: MissionType;
  status: MissionStatus;
  progressPercent: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  sectorArea: string;
  startTime: string;
  endTime?: string;
  aiReport?: {
    summary: string;
    anomaliesFound: number;
    safetyScore: number;
    recommendations: string[];
    anomaliesTimeline: { time: string; event: string; severity: string }[];
  };
}

export interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  meetingPlatform: 'Google Meet' | 'Zoom' | 'MS Teams' | 'Slack Huddles';
  status: 'Active' | 'Investigating' | 'Mitigated' | 'Resolved';
  createdTime: string;
  transcript: string;
  facts: string[];
  hypotheses: string[];
  actionItems: { id: string; text: string; assignee: string; done: boolean }[];
  integrations: {
    jiraKey?: string;
    slackChannel?: string;
    pagerDutyAlertId?: string;
    grafanaDashboardUrl?: string;
  };
  executiveSummary: string;
  technicalSummary: string;
  humanApproved: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  robotType: RobotType;
  mission: MissionType;
  repositoryUrl: string;
  environmentVars: { key: string; value: string }[];
  aiModels: string[];
  deploymentTarget: 'AWS' | 'Azure' | 'Google Cloud' | 'Docker' | 'Kubernetes' | 'Vercel' | 'Railway';
  status: 'Draft' | 'Building' | 'Deployed' | 'Failed';
  createdAt: string;
  updatedAt: string;
  docs?: {
    readme?: string;
    apiDocs?: string;
    architectureDescription?: string;
  };
}

export interface Deployment {
  id: string;
  projectId: string;
  projectName: string;
  environment: string;
  status: 'Queued' | 'Building' | 'Deploying' | 'Success' | 'Failed';
  commitHash: string;
  timestamp: string;
  logs: string[];
}

export interface MarketplaceItem {
  id: string;
  title: string;
  category: 'Robots' | 'AI Models' | 'Mission Templates' | 'Plugins' | 'ROS Packages' | 'Extensions';
  author: string;
  downloads: number;
  rating: number;
  priceUSD: number;
  isFree: boolean;
  description: string;
  tags: string[];
  version: string;
  verified: boolean;
  iconName: string;
}

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Organization'
  | 'Developer'
  | 'Operator'
  | 'Engineer'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  organization: string;
  avatarUrl: string;
  aiCreditsRemaining: number;
  createdAt: string;
  status?: 'Active' | 'Suspended';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  category: 'SECURITY' | 'MISSION' | 'DEPLOYMENT' | 'USER_MGMT' | 'FLEET';
  ipAddress: string;
}
