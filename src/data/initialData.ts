import { Robot, Mission, Incident, Project, Deployment, MarketplaceItem, User, AuditLog } from '../types';

export const INITIAL_ROBOTS: Robot[] = [
  {
    id: 'bot-01',
    name: 'Titan-X1 Dog',
    modelCode: 'ROBO-QUAD-X1',
    type: 'Quadruped',
    status: 'In Mission',
    batteryPercent: 88,
    cpuPercent: 42,
    gpuPercent: 64,
    tempCelsius: 48,
    locationSector: 'Sector 4 - Oil Refinery B',
    coordinates: { lat: 19.076, lng: 72.8777 },
    activeMissionId: 'mis-101',
    cameraStreamUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?auto=format&fit=crop&w=1200&q=80',
    sensors: {
      lidarPoints: 120000,
      gasDetectionPpm: 12,
      thermalMaxC: 62,
      vibrationHz: 45,
      ultrasonicCm: 180,
    },
    telemetry: [
      { timestamp: '10:00', batteryPercent: 95, cpuPercent: 30, gpuPercent: 50, thermalC: 40, speedMps: 1.2, motorTorqueNm: 85, wifiSignalDbm: -62, lat: 19.0760, lng: 72.8777, sector: 'Sector 4' },
      { timestamp: '10:05', batteryPercent: 92, cpuPercent: 38, gpuPercent: 58, thermalC: 44, speedMps: 1.5, motorTorqueNm: 92, wifiSignalDbm: -65, lat: 19.0762, lng: 72.8780, sector: 'Sector 4' },
      { timestamp: '10:10', batteryPercent: 88, cpuPercent: 42, gpuPercent: 64, thermalC: 48, speedMps: 1.4, motorTorqueNm: 89, wifiSignalDbm: -60, lat: 19.0765, lng: 72.8784, sector: 'Sector 4' },
    ]
  },
  {
    id: 'bot-02',
    name: 'Vulcan-Humanoid Pro',
    modelCode: 'ROBO-BIPED-V9',
    type: 'Bipedal Humanoid',
    status: 'Active',
    batteryPercent: 94,
    cpuPercent: 28,
    gpuPercent: 35,
    tempCelsius: 39,
    locationSector: 'Assembly Bay 2 - Gigafactory',
    coordinates: { lat: 19.080, lng: 72.8800 },
    sensors: {
      lidarPoints: 240000,
      gasDetectionPpm: 0,
      thermalMaxC: 32,
      vibrationHz: 12,
      ultrasonicCm: 240,
    },
    telemetry: [
      { timestamp: '10:00', batteryPercent: 98, cpuPercent: 25, gpuPercent: 30, thermalC: 36, speedMps: 0.8, motorTorqueNm: 140, wifiSignalDbm: -55, lat: 19.0800, lng: 72.8800, sector: 'Assembly' },
      { timestamp: '10:10', batteryPercent: 94, cpuPercent: 28, gpuPercent: 35, thermalC: 39, speedMps: 0.9, motorTorqueNm: 148, wifiSignalDbm: -58, lat: 19.0802, lng: 72.8802, sector: 'Assembly' }
    ]
  },
  {
    id: 'bot-03',
    name: 'Aegis Arm 900',
    modelCode: 'ROBO-ARM-6DOF',
    type: 'Industrial Robotic Arm',
    status: 'In Mission',
    batteryPercent: 100, // Grid Powered
    cpuPercent: 55,
    gpuPercent: 78,
    tempCelsius: 52,
    locationSector: 'Precision Machining Line A',
    coordinates: { lat: 19.074, lng: 72.8750 },
    activeMissionId: 'mis-102',
    sensors: {
      lidarPoints: 45000,
      gasDetectionPpm: 4,
      thermalMaxC: 58,
      vibrationHz: 110,
      ultrasonicCm: 45,
    },
    telemetry: []
  },
  {
    id: 'bot-04',
    name: 'CyberRover-V4',
    modelCode: 'ROBO-ROVER-HVY',
    type: 'Autonomous Rover',
    status: 'Idle',
    batteryPercent: 72,
    cpuPercent: 15,
    gpuPercent: 12,
    tempCelsius: 35,
    locationSector: 'Mining Substation 9',
    coordinates: { lat: 19.082, lng: 72.8850 },
    sensors: {
      lidarPoints: 180000,
      gasDetectionPpm: 35,
      thermalMaxC: 41,
      vibrationHz: 28,
      ultrasonicCm: 310,
    },
    telemetry: []
  },
  {
    id: 'bot-05',
    name: 'SkyScout Drone',
    modelCode: 'ROBO-VTOL-AIR',
    type: 'Inspection Drone',
    status: 'Charging',
    batteryPercent: 45,
    cpuPercent: 8,
    gpuPercent: 5,
    tempCelsius: 31,
    locationSector: 'Roof Dock Alpha - Solar Array',
    coordinates: { lat: 19.070, lng: 72.8700 },
    sensors: {
      lidarPoints: 95000,
      gasDetectionPpm: 0,
      thermalMaxC: 28,
      vibrationHz: 5,
      ultrasonicCm: 500,
    },
    telemetry: []
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mis-101',
    title: 'Sector 4 High-Thermal Pipe Inspection',
    robotId: 'bot-01',
    robotName: 'Titan-X1 Dog',
    type: 'Inspection',
    status: 'In Progress',
    progressPercent: 68,
    priority: 'Critical',
    sectorArea: 'Sector 4 - Refinery Thermal Lines',
    startTime: '2026-07-27 09:30 AM',
    aiReport: {
      summary: 'AI Vision detected minor micro-fissure thermal anomaly on Valve-B4. Gas leak probability < 2%. Path cleared.',
      anomaliesFound: 1,
      safetyScore: 94,
      recommendations: [
        'Schedule preventative seal maintenance on Valve-B4 within 48 hours.',
        'Increase LiDAR scan frequency around Junction 12.',
        'Continue automated perimeter sweep every 6 hours.'
      ],
      anomaliesTimeline: [
        { time: '09:42 AM', event: 'Thermal hotspot detected at Valve-B4 (62.4°C)', severity: 'Warning' },
        { time: '09:55 AM', event: 'Optical confirmation: Seal discoloration noted', severity: 'Info' }
      ]
    }
  },
  {
    id: 'mis-102',
    title: 'Precision Aerospace Component Welding & Quality Scan',
    robotId: 'bot-03',
    robotName: 'Aegis Arm 900',
    type: 'Material Handling',
    status: 'In Progress',
    progressPercent: 82,
    priority: 'High',
    sectorArea: 'Machining Bay A',
    startTime: '2026-07-27 08:00 AM'
  },
  {
    id: 'mis-103',
    title: 'Substation Perimeter Night Surveillance Sweep',
    robotId: 'bot-04',
    robotName: 'CyberRover-V4',
    type: 'Surveillance',
    status: 'Completed',
    progressPercent: 100,
    priority: 'Medium',
    sectorArea: 'Substation 9 Outer Fence',
    startTime: '2026-07-27 02:00 AM',
    endTime: '2026-07-27 03:45 AM',
    aiReport: {
      summary: 'Perimeter clear. No unauthorized motion detected. Thermal gradient nominal across transformer banks.',
      anomaliesFound: 0,
      safetyScore: 100,
      recommendations: ['Routine battery charging complete.', 'Next scheduled patrol at 14:00.'],
      anomaliesTimeline: []
    }
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-8092',
    title: 'Thermal Hotspot Spike on Compressor Turbine B',
    severity: 'Critical',
    meetingPlatform: 'Google Meet',
    status: 'Investigating',
    createdTime: '10 mins ago',
    transcript: `[Engineer Vikram] Titan-X1 is reporting 89 degrees C on the primary bearing for Turbine B.
[Operator Anita] Checking vibration sensors. Vibration is up 18% over baseline.
[AI Incident Commander] Analyzing historical telemetry. Pattern matches lubrication line cavitation. Recommending emergency bypass valve engagement.
[Engineer Vikram] Let's initiate bypass valve 4 open and slow turbine RPM by 15%.`,
    facts: [
      'Turbine B bearing temp reached 89.2°C at 10:04 AM.',
      'Vibration frequency increased to 68Hz (Baseline: 45Hz).',
      'Titan-X1 confirmed thermal camera visual on line 4.'
    ],
    hypotheses: [
      'Lubrication oil line cavitation due to filter blockage (85% confidence).',
      'Primary bearing mechanical fatigue failure (15% confidence).'
    ],
    actionItems: [
      { id: 'act-1', text: 'Engage secondary oil cooling pump via Web Dashboard', assignee: 'Anita (Operator)', done: true },
      { id: 'act-2', text: 'Dispatch Titan-X1 to capture close-range thermal telemetry', assignee: 'Titan-X1', done: true },
      { id: 'act-3', text: 'Schedule maintenance crew for filter swap during shift change', assignee: 'Vikram (Engineer)', done: false }
    ],
    integrations: {
      jiraKey: 'ROBO-1049',
      slackChannel: '#incident-refinery-sec4',
      pagerDutyAlertId: 'PD-99210',
      grafanaDashboardUrl: 'https://grafana.internal/d/refinery-sec4'
    },
    executiveSummary: 'Automated AI response engaged secondary cooling for Turbine B after temp reached 89.2°C. Operations stabilized without facility shutdown.',
    technicalSummary: 'Titan-X1 quadruped telemetry & thermal array detected lubrication failure. Emergency bypass initiated via AI command engine. Jira ticket ROBO-1049 auto-created.',
    humanApproved: true
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-01',
    name: 'Project Apex Sorting',
    description: 'Autonomous ROS2 spatial pick and place pipeline with YOLOv11 pose estimation.',
    robotType: 'Industrial Robotic Arm',
    mission: 'Material Handling',
    repositoryUrl: 'https://github.com/roboassist/apex-sorting-ros2',
    environmentVars: [
      { key: 'ROS_DOMAIN_ID', value: '42' },
      { key: 'YOLO_MODEL_PRECISION', value: 'FP16' },
      { key: 'CAMERA_FPS', value: '60' }
    ],
    aiModels: ['YOLOv11-Industrial-Pose', 'OpenCV-Spatial-3D'],
    deploymentTarget: 'Kubernetes',
    status: 'Deployed',
    createdAt: '2026-07-20',
    updatedAt: '2026-07-26',
    docs: {
      readme: '# Project Apex Sorting\n\nHigh-speed autonomous ROS2 robotic arm pick-and-place pipeline.\n\n## Features\n- Realtime 6-DOF Trajectory Planning\n- Sub-millimeter visual servoing\n- Automatic obstacle re-routing',
      apiDocs: '### REST & ROS2 Topics\n- `/robot/arm/pose` (Publisher)\n- `/robot/arm/cmd_vel` (Subscriber)\n- `/api/v1/mission/execute` (POST)',
      architectureDescription: 'Client -> Web Engine -> ROS2 Bridge Node -> Motion Controller -> Aegis Arm Hardware'
    }
  },
  {
    id: 'proj-02',
    name: 'Sentinel Thermal Quadruped',
    description: 'Autonomous quadruped patrol software with thermal vision anomaly detection and SLAM.',
    robotType: 'Quadruped',
    mission: 'Inspection',
    repositoryUrl: 'https://github.com/roboassist/sentinel-quadruped-patrol',
    environmentVars: [
      { key: 'LIDAR_MIN_RANGE', value: '0.1' },
      { key: 'THERMAL_THRESHOLD_C', value: '60' }
    ],
    aiModels: ['ThermalAnomaly-Detect-v2', 'SLAM-Nav2-Grid'],
    deploymentTarget: 'Docker',
    status: 'Deployed',
    createdAt: '2026-07-22',
    updatedAt: '2026-07-27'
  }
];

export const INITIAL_DEPLOYMENTS: Deployment[] = [
  {
    id: 'dep-101',
    projectId: 'proj-01',
    projectName: 'Project Apex Sorting',
    environment: 'Kubernetes (GCP Cluster)',
    status: 'Success',
    commitHash: 'a7b93c1',
    timestamp: '2026-07-27 09:15 AM',
    logs: [
      '[09:14:00] Initializing Docker container build...',
      '[09:14:12] Compiling ROS2 Humble packages with colcon build...',
      '[09:14:45] Container image pushed to gcr.io/roboassist/apex-sorting:v1.4',
      '[09:15:02] K8s deployment updated. 4/4 pods running cleanly.',
      '[09:15:05] Health check passed (200 OK).'
    ]
  },
  {
    id: 'dep-102',
    projectId: 'proj-02',
    projectName: 'Sentinel Thermal Quadruped',
    environment: 'Edge On-Robot Docker',
    status: 'Success',
    commitHash: 'f4e120d',
    timestamp: '2026-07-26 04:30 PM',
    logs: [
      '[16:29:10] Pulling latest edge release f4e120d...',
      '[16:29:40] Hot swapping Sentinel ROS2 daemon...',
      '[16:30:00] Telemetry stream online at 100Hz.'
    ]
  }
];

export const INITIAL_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 'mkt-01',
    title: 'YOLOv11 Industrial Anomaly Vision Engine',
    category: 'AI Models',
    author: 'RoboAssist Core Lab',
    downloads: 14200,
    rating: 4.9,
    priceUSD: 0,
    isFree: true,
    description: 'Pre-trained AI vision model optimized for detecting gas leaks, rust, pipe cracks, missing bolts, and electrical arcing.',
    tags: ['Computer Vision', 'YOLOv11', 'Inspection', 'TensorRT'],
    version: 'v2.4.0',
    verified: true,
    iconName: 'Eye'
  },
  {
    id: 'mkt-02',
    title: '3D LiDAR SLAM Nav2 Suite for Industrial Rovers',
    category: 'ROS Packages',
    author: 'Boston Nav Dynamics',
    downloads: 8900,
    rating: 4.8,
    priceUSD: 299,
    isFree: false,
    description: 'Real-time 3D spatial mapping and dynamic obstacle avoidance for complex indoor/outdoor facilities.',
    tags: ['ROS2', 'SLAM', '3D LiDAR', 'Navigation'],
    version: 'v3.1.2',
    verified: true,
    iconName: 'Compass'
  },
  {
    id: 'mkt-03',
    title: 'Emergency Hazardous Oil/Gas Spill Response Protocol',
    category: 'Mission Templates',
    author: 'SafetyRobotics Corp',
    downloads: 5300,
    rating: 5.0,
    priceUSD: 149,
    isFree: false,
    description: 'Automated 12-step autonomous quad/rover containment workflow with live incident commander reporting.',
    tags: ['Safety', 'Oil & Gas', 'Emergency', 'Workflow'],
    version: 'v1.0.0',
    verified: true,
    iconName: 'ShieldAlert'
  },
  {
    id: 'mkt-04',
    title: 'NVIDIA Isaac Sim Digital Twin Connector',
    category: 'Plugins',
    author: 'NVIDIA Omniverse Partner',
    downloads: 18500,
    rating: 4.9,
    priceUSD: 0,
    isFree: true,
    description: 'Real-time bi-directional synchronization between RoboAssist Dashboard and NVIDIA Isaac Sim environment.',
    tags: ['Digital Twin', 'Isaac Sim', 'Simulation', 'Omniverse'],
    version: 'v4.2.0',
    verified: true,
    iconName: 'Cpu'
  }
];

export const INITIAL_REGISTERED_USERS: User[] = [
  {
    id: 'usr-901',
    name: 'Dr. Rajesh Subramanian',
    email: 'riteshwork952004@gmail.com',
    password: 'password123',
    role: 'Super Admin',
    organization: 'Reliance Industry 4.0 Robotics Hub',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    aiCreditsRemaining: 25000,
    createdAt: '2025-11-10',
    status: 'Active',
  },
  {
    id: 'usr-902',
    name: 'Anita Sharma',
    email: 'anita@reliance-robotics.in',
    password: 'password123',
    role: 'Operator',
    organization: 'Reliance Industry 4.0 Robotics Hub',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    aiCreditsRemaining: 12000,
    createdAt: '2026-01-15',
    status: 'Active',
  },
  {
    id: 'usr-903',
    name: 'Vikram Mehta',
    email: 'vikram@robotics-lab.io',
    password: 'password123',
    role: 'Engineer',
    organization: 'Boston Nav Dynamics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    aiCreditsRemaining: 18500,
    createdAt: '2026-03-22',
    status: 'Active',
  },
  {
    id: 'usr-904',
    name: 'Priya Verma',
    email: 'priya@ai-robotics.org',
    password: 'password123',
    role: 'Developer',
    organization: 'NVIDIA Omniverse Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    aiCreditsRemaining: 20000,
    createdAt: '2026-05-04',
    status: 'Active',
  },
];

export const CURRENT_USER: User = INITIAL_REGISTERED_USERS[0];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-27 10:12:04',
    userName: 'Dr. Rajesh Subramanian',
    userRole: 'Super Admin',
    action: 'Triggered Emergency Thermal Sweep Mission on Titan-X1',
    category: 'MISSION',
    ipAddress: '103.22.45.18'
  },
  {
    id: 'log-102',
    timestamp: '2026-07-27 09:15:30',
    userName: 'Anita Sharma',
    userRole: 'Operator',
    action: 'Approved AI Incident Action Item #1 for Compressor B',
    category: 'SECURITY',
    ipAddress: '103.22.45.22'
  },
  {
    id: 'log-103',
    timestamp: '2026-07-26 18:40:11',
    userName: 'Dr. Rajesh Subramanian',
    userRole: 'Super Admin',
    action: 'Deployed Project Apex Sorting to K8s Cluster',
    category: 'DEPLOYMENT',
    ipAddress: '103.22.45.18'
  }
];
