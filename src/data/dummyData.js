// US 1.1 - Available service plans
export const DUMMY_PLANS = [
  { id: "p1", name: "Fiber 300", speed: "300/300 Mbps", type: "Wired" },
  { id: "p2", name: "Fiber 1 GIG", speed: "1000/1000 Mbps", type: "Wired" },
  { id: "p3", name: "Fiber 2 GIG", speed: "2000/2000 Mbps", type: "Wired" },
  { id: "p4", name: "Wireless 100", speed: "100/20 Mbps", type: "Wireless" },
];

export const DUMMY_FDHS = [
  { id: "fdh-101", name: "FDH-101 (Oakwood Main)", neighborhoodId: "n1" },
  { id: "fdh-102", name: "FDH-102 (Oakwood West)", neighborhoodId: "n1" },
  { id: "fdh-201", name: "FDH-201 (Willow Creek A)", neighborhoodId: "n2" },
];

// US 1.2 - Network hierarchy
export const DUMMY_NEIGHBORHOODS = [
  { id: "n1", name: "Oakwood Estates" },
  { id: "n2", name: "Willow Creek" },
  { id: "n3", name: "Maple Grove" },
];

export const DUMMY_SPLITTERS = [
  { id: "spl-101-a", serial: "SPL-101-A", fdhId: "fdh-101", totalPorts: 32 },
  { id: "spl-101-b", serial: "SPL-101-B", fdhId: "fdh-101", totalPorts: 16 },
  { id: "spl-102-a", serial: "SPL-102-A", fdhId: "fdh-102", totalPorts: 32 },
  { id: "spl-201-a", serial: "SPL-201-A", fdhId: "fdh-201", totalPorts: 32 },
  { id: "spl-201-b", serial: "SPL-201-B", fdhId: "fdh-201", totalPorts: 32 },
];
// US 1.3 & 2.1 - Master hardware inventory
export const DUMMY_INVENTORY = [
  // ONTs
  { id: "ont-sn-111a", type: "ONT", model: "Calix 803G", status: "available" },
  { id: "ont-sn-112b", type: "ONT", model: "Calix 803G", status: "available" },
  { id: "ont-sn-113c", type: "ONT", model: "Adtran 411", status: "assigned" },
  { id: "ont-sn-114d", type: "ONT", model: "Calix 803G", status: "available" },
  { id: "ont-sn-115e", type: "ONT", model: "Adtran 411", status: "defective" },
  { id: "ont-sn-116f", type: "ONT", model: "Calix 803G", status: "available" },

  // Routers
  {
    id: "rtr-sn-aaa1",
    type: "Router",
    model: "WiFi-6-Blaze",
    status: "available",
  },
  {
    id: "rtr-sn-img-111",
    type: "Router",
    model: "GigaCenter 844E",
    status: "available",
  },
  {
    id: "rtr-sn-bbb2",
    type: "Router",
    model: "WiFi-6-Blaze",
    status: "available",
  },
  {
    id: "rtr-sn-ccc3",
    type: "Router",
    model: "GigaCenter 844E",
    status: "assigned",
  },
  {
    id: "rtr-sn-ddd4",
    type: "Router",
    model: "WiFi-6-Blaze",
    status: "available",
  },
];

// US 1.4 - Record of which splitter ports are already in use
export const DUMMY_ASSIGNED_PORTS = [
  { splitterId: "spl-101-a", port: 1, customerId: "c-1001" },
  { splitterId: "spl-101-a", port: 2, customerId: "c-1002" },
  { splitterId: "spl-101-a", port: 4, customerId: "c-1003" },
  { splitterId: "spl-201-a", port: 1, customerId: "c-1004" },
];

export function getFdhForNeighborhood(neighborhoodId) {
  return DUMMY_FDHS.filter((fdh) => fdh.neighborhoodId === neighborhoodId);
}

export function getPortsForSplitter(splitterId) {
  const splitter = DUMMY_SPLITTERS.find((s) => s.id === splitterId);
  if (!splitter) {
    return []; // No splitter selected or found
  }

  // Get all ports that are already assigned for this splitter
  const usedPorts = DUMMY_ASSIGNED_PORTS.filter(
    (p) => p.splitterId === splitterId
  ).map((p) => p.port);

  const availablePorts = [];
  for (let i = 1; i <= splitter.totalPorts; i++) {
    if (!usedPorts.includes(i)) {
      availablePorts.push({ port: i });
    }
  }
  return availablePorts;
}

export function getSplittersForFdh(fdhId) {
  return DUMMY_SPLITTERS.filter((splitter) => splitter.fdhId === fdhId);
}
