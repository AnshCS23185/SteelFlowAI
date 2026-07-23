export const defaultProjects = [
  {
    id: '1',
    name: 'Apex Commercial Tower',
    clientName: 'David Chen',
    clientEmail: 'dchen@apexbuilders.com',
    supervisorName: 'Production Supervisor',
    supervisorEmail: 'supervisor@gmail.com',
    progress: 72,
    status: 'Active',
    deadline: '2026-10-15',
    description: 'Structural steel fabrication and detailing for a 45-story commercial office tower in downtown metro.',
    tonnage: 4200, // tons of steel
    membersCount: 1840,
    location: 'Zone A - Fabrication Bay 3 & 4',
    budget: '$8.4M',
    phases: [
      { id: 'p1', name: 'Detailing & Shop Drawings', progress: 100, status: 'Completed' },
      { id: 'p2', name: 'Raw Material Procurement', progress: 95, status: 'Active' },
      { id: 'p3', name: 'Cutting & Drilling', progress: 85, status: 'Active' },
      { id: 'p4', name: 'Assembly & Welding', progress: 70, status: 'Active' },
      { id: 'p5', name: 'QA Inspection & NDT', progress: 65, status: 'Active' },
      { id: 'p6', name: 'Blasting & Painting', progress: 50, status: 'Active' },
      { id: 'p7', name: 'Dispatch & Assembly on Site', progress: 35, status: 'Active' }
    ]
  },
  {
    id: '2',
    name: 'Hudson Valley Bridge Structure',
    clientName: 'Sarah Jenkins',
    clientEmail: 'sjenkins@hudsoninfra.org',
    supervisorName: 'Production Supervisor',
    supervisorEmail: 'supervisor@gmail.com',
    progress: 45,
    status: 'Active',
    deadline: '2026-12-01',
    description: 'Heavy plate girders and support structures for the Hudson Valley bypass bridge renovation.',
    tonnage: 6800,
    membersCount: 820,
    location: 'Zone B - Heavy Plate Shop',
    budget: '$14.2M',
    phases: [
      { id: 'p1', name: 'Detailing & Shop Drawings', progress: 100, status: 'Completed' },
      { id: 'p2', name: 'Raw Material Procurement', progress: 80, status: 'Active' },
      { id: 'p3', name: 'Cutting & Drilling', progress: 60, status: 'Active' },
      { id: 'p4', name: 'Assembly & Welding', progress: 40, status: 'Active' },
      { id: 'p5', name: 'QA Inspection & NDT', progress: 30, status: 'Active' },
      { id: 'p6', name: 'Blasting & Painting', progress: 15, status: 'Active' },
      { id: 'p7', name: 'Dispatch & Assembly on Site', progress: 5, status: 'Active' }
    ]
  },
  {
    id: '3',
    name: 'East Wing Airport Hangar',
    clientName: 'Robert Miller',
    clientEmail: 'rmiller@portauthority.gov',
    supervisorName: 'Production Supervisor',
    supervisorEmail: 'supervisor@gmail.com',
    progress: 90,
    status: 'Active',
    deadline: '2026-08-20',
    description: 'Wide-span truss fabrication and lightweight roof framing members for the airport expansion.',
    tonnage: 2100,
    membersCount: 1450,
    location: 'Zone C - Truss & Light Frame Line',
    budget: '$5.1M',
    phases: [
      { id: 'p1', name: 'Detailing & Shop Drawings', progress: 100, status: 'Completed' },
      { id: 'p2', name: 'Raw Material Procurement', progress: 100, status: 'Completed' },
      { id: 'p3', name: 'Cutting & Drilling', progress: 95, status: 'Active' },
      { id: 'p4', name: 'Assembly & Welding', progress: 92, status: 'Active' },
      { id: 'p5', name: 'QA Inspection & NDT', progress: 90, status: 'Active' },
      { id: 'p6', name: 'Blasting & Painting', progress: 88, status: 'Active' },
      { id: 'p7', name: 'Dispatch & Assembly on Site', progress: 75, status: 'Active' }
    ]
  },
  {
    id: '4',
    name: 'Quantum Tech Industrial Complex',
    clientName: 'Lisa Wong',
    clientEmail: 'lisa.wong@quantumtech.com',
    supervisorName: 'Production Supervisor',
    supervisorEmail: 'supervisor@gmail.com',
    progress: 15,
    status: 'Planning',
    deadline: '2027-02-10',
    description: 'Precision support framing, high-grade steel modules and cleanroom load structures.',
    tonnage: 3400,
    membersCount: 2200,
    location: 'Zone A - Precision Fabrication Lab',
    budget: '$9.8M',
    phases: [
      { id: 'p1', name: 'Detailing & Shop Drawings', progress: 40, status: 'Active' },
      { id: 'p2', name: 'Raw Material Procurement', progress: 10, status: 'Active' },
      { id: 'p3', name: 'Cutting & Drilling', progress: 0, status: 'Planning' },
      { id: 'p4', name: 'Assembly & Welding', progress: 0, status: 'Planning' },
      { id: 'p5', name: 'QA Inspection & NDT', progress: 0, status: 'Planning' },
      { id: 'p6', name: 'Blasting & Painting', progress: 0, status: 'Planning' },
      { id: 'p7', name: 'Dispatch & Assembly on Site', progress: 0, status: 'Planning' }
    ]
  }
];


export const defaultProduction = {
  '1': [
    { id: 'pr1', memberMark: '26B-G1', type: 'Girder', status: 'QA Passed', progress: 100, station: 'NDT Testing' },
    { id: 'pr2', memberMark: '26B-G2', type: 'Girder', status: 'Welding', progress: 85, station: 'Welding Bay B' },
    { id: 'pr3', memberMark: '27B-C1', type: 'Column', status: 'Assembling', progress: 50, station: 'Fit-up Table 2' },
    { id: 'pr4', memberMark: '27B-C2', type: 'Column', status: 'Cutting', progress: 20, station: 'CNC Plasma CNC1' },
    { id: 'pr5', memberMark: '26B-B1', type: 'Bracing', status: 'Awaiting Detail', progress: 0, station: 'Material Yard' }
  ],
  '2': [
    { id: 'pr6', memberMark: 'HV-PG1-A', type: 'Plate Girder', status: 'Welding', progress: 75, station: 'Sub-Arc Auto Welder' },
    { id: 'pr7', memberMark: 'HV-PG1-B', type: 'Plate Girder', status: 'Assembling', progress: 40, station: 'Plate Assembly Jig 1' },
    { id: 'pr8', memberMark: 'HV-ST-12', type: 'Stiffener Pack', status: 'Cutting', progress: 90, station: 'CNC Plasma CNC2' }
  ],
  '3': [
    { id: 'pr9', memberMark: 'TR-A1', type: 'Truss Assembly', status: 'QA Passed', progress: 100, station: 'Final Assembly' },
    { id: 'pr10', memberMark: 'TR-A2', type: 'Truss Assembly', status: 'QA Passed', progress: 100, station: 'Final Assembly' },
    { id: 'pr11', memberMark: 'TR-B1', type: 'Truss Assembly', status: 'Painting', progress: 95, station: 'Paint Booth A' }
  ],
  '4': [
    { id: 'pr12', memberMark: 'QT-F1', type: 'Frame', status: 'Awaiting Detail', progress: 5, station: 'CNC Plasma CNC1' }
  ]
};

export const defaultTransportation = {
  '1': [
    { id: 't1', loadId: 'L-1092', trailerType: 'Flatbed Heavy', components: '26B-G1, 26B-G3', weight: '24.5 Tons', status: 'Delivered', dispatchDate: '2026-07-02', eta: 'Delivered' },
    { id: 't2', loadId: 'L-1104', trailerType: 'Flatbed Standard', components: '26B-S1, Stiffeners', weight: '18.2 Tons', status: 'In Transit', dispatchDate: '2026-07-08', eta: '2026-07-10 14:00' },
    { id: 't3', loadId: 'L-1115', trailerType: 'Extendable Deck', components: '26B-G2 (Heavy Girder)', weight: '31.0 Tons', status: 'Scheduled', dispatchDate: '2026-07-14', eta: '2026-07-15' }
  ],
  '2': [
    { id: 't4', loadId: 'L-2041', trailerType: 'Multi-axle Transporter', components: 'HV-PG1-A', weight: '42.8 Tons', status: 'Scheduled', dispatchDate: '2026-08-01', eta: '2026-08-02' }
  ],
  '3': [
    { id: 't5', loadId: 'L-3011', trailerType: 'Flatbed Standard', components: 'TR-A1, TR-A2', weight: '15.6 Tons', status: 'Delivered', dispatchDate: '2026-06-28', eta: 'Delivered' },
    { id: 't6', loadId: 'L-3012', trailerType: 'Flatbed Standard', components: 'TR-B1, Bracings', weight: '16.1 Tons', status: 'Delivered', dispatchDate: '2026-07-05', eta: 'Delivered' }
  ],
  '4': []
};

export const defaultDocuments = {
  '1': [
    { id: 'd1', name: 'Apex-T-IFC-Drawings-Rev3.pdf', type: 'Design Drawing', size: '24.2 MB', uploadedBy: 'David Chen (Client)', date: '2026-06-15' },
    { id: 'd2', name: 'Weld_NDT_Inspection_Report_Lot1.pdf', type: 'QA Certificate', size: '3.8 MB', uploadedBy: 'Marcus Vance (Supervisor)', date: '2026-07-04' },
    { id: 'd3', name: 'Steel_Mill_Certificate_A572.pdf', type: 'Material Spec', size: '8.4 MB', uploadedBy: 'Alex Sterling (Admin)', date: '2026-06-20' }
  ],
  '2': [
    { id: 'd4', name: 'Hudson-Valley-Bridge-Shop-Drawings.dwg', type: 'Shop Drawing', size: '42.1 MB', uploadedBy: 'Marcus Vance (Supervisor)', date: '2026-06-29' },
    { id: 'd5', name: 'Welder_Certificates_MarcusV.pdf', type: 'Compliance', size: '1.2 MB', uploadedBy: 'Marcus Vance (Supervisor)', date: '2026-07-01' }
  ],
  '3': [
    { id: 'd6', name: 'Airport_Hangar_Erection_Plan.pdf', type: 'Execution Plan', size: '12.5 MB', uploadedBy: 'John Kovacs (Supervisor)', date: '2026-06-10' }
  ],
  '4': [
    { id: 'd7', name: 'Cleanroom_Frame_Calculations.pdf', type: 'Calculations', size: '6.4 MB', uploadedBy: 'Lisa Wong (Client)', date: '2026-07-08' }
  ]
};

export const defaultDailyProgress = {
  '1': [
    { id: 'dp1', date: '2026-07-09', shift: 'Day Shift', description: 'Welding completed on Girder 26B-G1. Initiated fit-up assembly of Column 27B-C1.', supervisor: 'Marcus Vance', hoursWorked: 10 },
    { id: 'dp2', date: '2026-07-08', shift: 'Night Shift', description: 'CNC Drilling processed on W-Beams. Completed blasting phase for load lot L-1092.', supervisor: 'Marcus Vance', hoursWorked: 8 }
  ],
  '2': [
    { id: 'dp3', date: '2026-07-08', shift: 'Day Shift', description: 'Alignment adjustments for Plate Girder HV-PG1-A. Delayed by 2 hours due to crane availability.', supervisor: 'Marcus Vance', hoursWorked: 8 }
  ],
  '3': [
    { id: 'dp4', date: '2026-07-09', shift: 'Day Shift', description: 'Final structural paint coat applied to Truss TR-B1. Approved by local inspector.', supervisor: 'John Kovacs', hoursWorked: 10 }
  ],
  '4': []
};

export const defaultIssues = {
  '1': [
    { id: 'is1', title: 'Grade 50 Plate Thickness Defect', severity: 'High', status: 'Open', description: 'Ultrasonic testing revealed internal laminations in W-beam connection plate. Awaiting engineer response.', reportedBy: 'Marcus Vance', date: '2026-07-07', response: '' },
    { id: 'is2', title: 'Detailing Discrepancy on Bolt Hole Spacing', severity: 'Medium', status: 'Resolved', description: 'Bolt hole center-to-center dimension on mark 26B-G1 was offset by 3mm. Resolved by re-drilling under engineer permission.', reportedBy: 'Marcus Vance', date: '2026-07-03', response: 'Approved drill-out remedy. - David Chen (Client)' }
  ],
  '2': [
    { id: 'is3', title: 'Weld Flaw on Flange Segment 3', severity: 'Critical', status: 'Open', description: 'NDT Radiographic testing showed porosity exceeding class 1 tolerance. Repair and re-weld required.', reportedBy: 'Marcus Vance', date: '2026-07-08', response: '' }
  ],
  '3': [],
  '4': []
};

export const defaultPhotos = {
  '1': [
    { id: 'ph1', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80', caption: 'Welding reinforcement on 26B-G1 girder', uploadedBy: 'Marcus Vance', date: '2026-07-08' },
    { id: 'ph2', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', caption: 'QA inspection of flange dimensions', uploadedBy: 'Marcus Vance', date: '2026-07-05' }
  ],
  '2': [
    { id: 'ph3', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80', caption: 'Hudson plate girders assembly area', uploadedBy: 'Marcus Vance', date: '2026-07-07' }
  ],
  '3': [
    { id: 'ph4', url: 'https://images.unsplash.com/photo-1513828742140-ccaa34f3ccd2?auto=format&fit=crop&w=600&q=80', caption: 'Main roof truss structure finished coating', uploadedBy: 'John Kovacs', date: '2026-07-06' }
  ],
  '4': []
};

export const mockAiMessages = [
  {
    role: 'assistant',
    content: "Good day! I am your SteelFlow AI assistant. I have compiled the fabrication logs, weld status, and material specs for this project. How can I help you optimize your steel detailing or shop throughput today?"
  }
];
