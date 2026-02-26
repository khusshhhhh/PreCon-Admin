import { Stage } from '@prisma/client';

export const defaultTaskTemplates = [
  { stage: Stage.PLANNING_APPROVAL, title: 'Contour Survey', provider: 'Surveyor', isOptional: false, expectedDays: 14 },
  { stage: Stage.PLANNING_APPROVAL, title: 'Concept Drawings', provider: 'Architect', isOptional: true, expectedDays: 15 },
  { stage: Stage.PLANNING_APPROVAL, title: 'Planning Drawings', provider: 'Architect', isOptional: false, expectedDays: 20 },
  { stage: Stage.PLANNING_APPROVAL, title: 'Site & Drainage Plan', provider: 'Engineer', isOptional: false, expectedDays: 7 },
  { stage: Stage.PLANNING_APPROVAL, title: 'PlanSA Submission', provider: 'PreCon Admin', isOptional: false, expectedDays: 5 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Working Drawings', provider: 'Architect', isOptional: false, expectedDays: 20 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Bore Logs', provider: 'Surveyor', isOptional: false, expectedDays: 20 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Energy Report', provider: 'Architect', isOptional: false, expectedDays: 20 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Footing Report', provider: 'Engineer', isOptional: false, expectedDays: 20 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Timber Take-offs', provider: 'Timber Company', isOptional: false, expectedDays: 20 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Structural Steel (if required)', provider: 'Engineer', isOptional: true, expectedDays: 7 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'CITB Levy Receipt', provider: 'CITB', isOptional: false, expectedDays: 5 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Private Certifier Review / BRC', provider: 'Private Certifier', isOptional: false, expectedDays: 5 },
  { stage: Stage.DEVELOPMENT_APPROVAL, title: 'Development Approval', provider: 'Council', isOptional: false, expectedDays: 5 }
];
