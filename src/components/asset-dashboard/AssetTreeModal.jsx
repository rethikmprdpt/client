/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
// We don't import d3, jspdf, or html2canvas
// We will load them from a CDN to avoid import issues

// --- API IMPORTS (FIX: Using absolute paths from src) ---
import { getCustomerProvisioningDetails } from "../../api/customerApi.js";
import { getSplittersForFdh } from "../../api/fdhApi.js";
import { getPortsForSplitter } from "../../api/splitterApi.js";

import {
  Loader2,
  X,
  Download,
  HardDrive,
  Spline,
  Waypoints,
  Router as RouterIcon,
  User,
  AlertTriangle,
  Search,
} from "lucide-react";

// --- CDN Script Loader Hook ---
// This hook ensures that a script is loaded only once.
const useScript = (url) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let script = document.querySelector(`script[src="${url}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        setLoaded(true);
      };
    } else if (script.getAttribute("data-loaded") === "true") {
      // If script exists and we've marked it as loaded
      setLoaded(true);
    } else {
      // Script exists but might still be loading
      script.addEventListener("load", () => setLoaded(true));
    }

    // Mark as loaded when done
    if (loaded) {
      script.setAttribute("data-loaded", "true");
    }
  }, [url, loaded]);
  return loaded;
};

// --- 1. Helper: D3 Tree Rendering Logic ---
const useD3Tree = (data, svgRef, containerRef, type) => {
  useEffect(() => {
    // Only run if we have data, a ref, and D3 is loaded
    if (
      !data ||
      !svgRef.current ||
      !containerRef.current ||
      !window.d3 ||
      type !== "fdh"
    ) {
      return;
    }

    const d3 = window.d3;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // --- UPDATED: Compact but not too small Dimensions ---
    const margin = { top: 20, right: 20, bottom: 20, left: 60 };
    const nodeWidth = 160; // Balanced size
    const nodeHeight = 160; // Balanced size

    // --- Create Tree Layout ---
    const tree = d3.tree().nodeSize([nodeHeight, nodeWidth]);
    const root = d3.hierarchy(data);

    tree(root);

    // --- Calculate dynamic height & width ---
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    root.each((d) => {
      if (d.x < minX) minX = d.x;
      if (d.x > maxX) maxX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.y > maxY) maxY = d.y;
    });

    const dynamicHeight = maxX - minX + nodeHeight + margin.top + margin.bottom;
    const dynamicWidth = maxY - minY + nodeWidth + margin.left + margin.right;

    // --- UPDATED: Set up zoom and pan ---
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    svg.attr("width", containerWidth).attr("height", containerHeight);

    // Create main group for zoom/pan
    const g = svg.append("g");

    // Define zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4]) // Allow zoom from 10% to 400%
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Set initial transform to center the content
    const initialScale =
      Math.min(
        containerWidth / dynamicWidth,
        containerHeight / dynamicHeight,
        1 // Don't zoom in more than 100%
      ) * 0.9; // Add 10% padding

    const initialX =
      (containerWidth - dynamicWidth * initialScale) / 2 -
      minY * initialScale +
      margin.left;
    const initialY =
      (containerHeight - dynamicHeight * initialScale) / 2 -
      minX * initialScale +
      margin.top;

    svg.call(
      zoom.transform,
      d3.zoomIdentity.translate(initialX, initialY).scale(initialScale)
    );

    // --- Draw Links (Paths) ---
    g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      );

    // --- Draw Nodes ---
    const node = g
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 2)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // --- UPDATED: Balanced Node Box sizes ---
    node
      .append("rect")
      .attr("width", nodeWidth - 20)
      .attr("height", (d) =>
        d.data.type === "splitter" ? nodeHeight - 10 : 60
      )
      .attr("x", -(nodeWidth - 20) / 2)
      .attr("y", (d) =>
        d.data.type === "splitter" ? -(nodeHeight - 10) / 2 : -30
      )
      .attr("fill", "#fff")
      .attr("stroke", "#e2e8f0")
      .attr("rx", 6);

    // --- UPDATED: Compact Node Text ---
    node
      .append("text")
      .attr("dy", (d) => (d.data.type === "splitter" ? "-4.2em" : "-0.8em"))
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "600")
      .attr("fill", "#1e293b")
      .text((d) => d.data.name);

    node
      .append("text")
      .attr("dy", (d) => (d.data.type === "splitter" ? "-3.3em" : "0.4em"))
      .attr("text-anchor", "middle")
      .attr("font-size", "9px")
      .attr("fill", "#475569")
      .text((d) => d.data.subtitle);

    // --- Special Port Grid for Splitters ---
    const splitterNodes = node.filter((d) => d.data.type === "splitter");

    splitterNodes.each(function (d) {
      const splitterGroup = d3.select(this);
      const ports = d.data.ports || [];
      const maxPorts = d.data.max_ports || 0;

      // UPDATED: Balanced grid with better spacing
      const dotSize = 9;
      const dotPadding = 3;
      const dotsPerSide = 8;
      const gridWidth = (dotSize + dotPadding) * dotsPerSide - dotPadding;
      const startX = -gridWidth / 2;
      const startY = -18; // Adjusted to prevent overlap

      // UPDATED: Simplified port counts text - just "x/y free"
      const freePorts = ports.filter((p) => p.port_status === "free").length;
      splitterGroup
        .append("text")
        .attr("dy", "5em") // Moved down to avoid overlap
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .attr("fill", freePorts > 0 ? "#16a34a" : "#dc2626")
        .text(`${freePorts}/${maxPorts} free`);

      // Create dots
      splitterGroup
        .append("g")
        .attr("transform", `translate(${startX}, ${startY})`)
        .selectAll("rect")
        .data(ports)
        .join("rect")
        .attr("x", (p, i) => (i % dotsPerSide) * (dotSize + dotPadding))
        .attr(
          "y",
          (p, i) => Math.floor(i / dotsPerSide) * (dotSize + dotPadding)
        )
        .attr("width", dotSize)
        .attr("height", dotSize)
        .attr("rx", 2)
        .attr("fill", (p) =>
          p.port_status === "occupied" ? "#ef4444" : "#22c55e"
        )
        .append("title") // Tooltip
        .text(
          (p) =>
            `Port ID: ${p.port_id}\nStatus: ${p.port_status}\nCustomer ID: ${
              p.customer_id || "N/A"
            }`
        );
    });
  }, [data, svgRef, containerRef, type]); // Rerun when data changes
};

// --- 2. The Main Modal Component ---
const AssetTreeModal = ({ type, id = null, onClose }) => {
  // id is now optional

  // --- NEW: Internal state to manage the ID ---
  const [internalId, setInternalId] = useState(id); // Use prop 'id' if provided, otherwise null
  const [idInput, setIdInput] = useState(""); // For the input field

  const [isLoading, setIsLoading] = useState(false); // Will be set to true by the form
  const [error, setError] = useState("");
  const [treeData, setTreeData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const svgRef = useRef(null);
  const htmlRef = useRef(null);
  const containerRef = useRef(null); // NEW: Container ref for dimensions

  const d3Loaded = useScript("https://d3js.org/d3.v7.min.js");
  const jspdfLoaded = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  );
  const html2canvasLoaded = useScript(
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
  );
  const scriptsLoaded = d3Loaded && jspdfLoaded && html2canvasLoaded;

  // --- Data Fetching Effect (NOW DEPENDS ON internalId) ---
  useEffect(() => {
    // Only fetch if we have an internalId
    if (!type || !internalId) {
      setIsLoading(false); // Make sure we're not stuck loading
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      setTreeData(null); // Clear old data
      try {
        if (type === "customer") {
          // --- Customer Tree Data Fetch ---
          const response = await getCustomerProvisioningDetails(internalId);
          const data = response.data;
          setTreeData(data);
        } else if (type === "fdh") {
          // --- FDH Tree Data Fetch (Multi-step) ---
          const fdhResponse = await getSplittersForFdh(internalId, false);
          const fdhData = fdhResponse.data;

          if (!fdhData || fdhData.length === 0) {
            throw new Error(`No splitters found for FDH ID: ${internalId}.`);
          }

          const fdhRoot = {
            name: `FDH ${fdhData[0].fdh_id}`,
            subtitle: `${fdhData[0].fdh.model}`,
            type: "fdh",
            children: [],
          };

          const splitterPromises = fdhData.map(async (splitter) => {
            const portsResponse = await getPortsForSplitter(
              splitter.splitter_id
            );
            return {
              name: `Splitter ${splitter.splitter_id}`,
              subtitle: `${splitter.model}`,
              type: "splitter",
              max_ports: splitter.max_ports,
              ports: portsResponse.data || [],
              children: [],
            };
          });

          fdhRoot.children = await Promise.all(splitterPromises);
          setTreeData(fdhRoot);
        }
      } catch (err) {
        console.error("Failed to fetch tree data:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to load data. Please check the ID."
        );
        setInternalId(null); // Reset ID so user can try again
        setIdInput("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, internalId]); // Now runs when internalId changes

  // --- D3 Hook (UPDATED: Added containerRef) ---
  useD3Tree(treeData, svgRef, containerRef, type);

  // --- PDF Export Handler ---
  const handleExport = async () => {
    if (!scriptsLoaded || !treeData) return;
    setIsExporting(true);

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: type === "fdh" ? "landscape" : "portrait",
      unit: "px",
      format: "a4",
    });

    const title =
      type === "customer"
        ? `Customer Provisioning Chain - ID ${internalId}`
        : `FDH Inventory Overview - ID ${internalId}`;

    doc.text(title, 20, 20);

    try {
      if (type === "customer" && htmlRef.current) {
        // --- HTML-to-PDF ---
        const canvas = await window.html2canvas(htmlRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - 40;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(imgData, "PNG", 20, 40, pdfWidth, pdfHeight);
      } else if (type === "fdh" && svgRef.current) {
        // --- SVG-to-PDF ---
        const svgElement = svgRef.current;
        const svgData = new XMLSerializer().serializeToString(svgElement);

        // Convert SVG to data URL
        const canvas = document.createElement("canvas");
        canvas.width = svgElement.getAttribute("width");
        canvas.height = svgElement.getAttribute("height");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff"; // Set white background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const img = new Image();
        img.src =
          "data:image/svg+xml;base64," +
          btoa(unescape(encodeURIComponent(svgData)));

        // FIX: Wrap image loading in a promise
        await new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              ctx.drawImage(img, 0, 0);
              const imgData = canvas.toDataURL("image/png");
              const imgProps = doc.getImageProperties(imgData);
              const pdfWidth = doc.internal.pageSize.getWidth() - 40;
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              doc.addImage(imgData, "PNG", 20, 40, pdfWidth, pdfHeight);
              resolve();
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = (e) => {
            reject(e);
          };
        });
      }
      doc.save(`${type}_tree_${internalId}.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      alert("Failed to export PDF. See console for details.");
    } finally {
      setIsExporting(false);
    }
  };

  // --- Render Helper: Customer Tree (HTML) ---
  const renderCustomerTree = () => {
    if (!treeData) return null;
    const { port, ont_asset, router_asset } = treeData;
    const fdh = port?.splitter?.fdh;
    const splitter = port?.splitter;

    const steps = [
      {
        icon: <HardDrive className="h-6 w-6 text-white" />,
        title: "FDH",
        name: fdh ? `${fdh.model} (ID: ${fdh.fdh_id})` : "N/A",
        subtitle: fdh ? `Pincode: ${fdh.pincode}` : "Not provisioned",
      },
      {
        icon: <Spline className="h-6 w-6 text-white" />,
        title: "Splitter",
        name: splitter
          ? `${splitter.model} (ID: ${splitter.splitter_id})`
          : "N/A",
        subtitle: port ? `Port ID: ${port.port_id}` : "Not provisioned",
      },
      {
        icon: <Waypoints className="h-6 w-6 text-white" />,
        title: "ONT",
        name: ont_asset ? `${ont_asset.serial_number}` : "N/A",
        subtitle: ont_asset ? `Model: ${ont_asset.model}` : "Not provisioned",
      },
      {
        icon: <RouterIcon className="h-6 w-6 text-white" />,
        title: "Router",
        name: router_asset ? `${router_asset.serial_number}` : "N/A",
        subtitle: router_asset
          ? `Model: ${router_asset.model}`
          : "Not provisioned",
      },
    ];

    return (
      <div className="p-6" ref={htmlRef}>
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Provisioning Chain for Customer {internalId}
        </h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex items-center">
                <span className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                  {step.icon}
                </span>
                <div className="ml-4">
                  <h4 className="text-sm font-semibold text-gray-800">
                    {step.title}
                  </h4>
                  <p className="text-base font-medium text-gray-900">
                    {step.name}
                  </p>
                  <p className="text-sm text-gray-500">{step.subtitle}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="ml-6 pl-px h-8 border-l border-dashed border-gray-300" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // --- UPDATED: Render Helper: FDH Tree (SVG) with containerRef ---
  const renderFdhTree = () => (
    <div className="p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Inventory Overview for FDH {internalId}
      </h3>
      <div className="flex space-x-4 mb-4 text-sm">
        <span className="flex items-center">
          <span className="h-3 w-3 rounded-sm bg-green-500 mr-1.5"></span> Free
          Port
        </span>
        <span className="flex items-center">
          <span className="h-3 w-3 rounded-sm bg-red-500 mr-1.5"></span>{" "}
          Occupied Port
        </span>
      </div>
      <div className="text-xs text-gray-500 mb-2">
        💡 Use mouse wheel to zoom, click and drag to pan
      </div>
      <div
        ref={containerRef}
        className="flex-1 border border-gray-200 rounded-lg overflow-hidden"
      >
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );

  // --- NEW: Submit handler for the ID input form ---
  const handleIdSubmit = (e) => {
    e.preventDefault();
    if (idInput) {
      setInternalId(parseInt(idInput, 10));
    }
  };

  // --- NEW: Render Helper: ID Input Form ---
  const renderIdInputForm = () => (
    <div className="p-8 flex flex-col items-center justify-center h-96">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        View {type === "customer" ? "Customer" : "FDH"} Tree
      </h3>
      <form onSubmit={handleIdSubmit} className="w-full max-w-sm">
        <label
          htmlFor="treeIdInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Please enter the {type === "customer" ? "Customer ID" : "FDH ID"} to
          view.
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            id="treeIdInput"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
            placeholder={
              type === "customer" ? "Enter Customer ID..." : "Enter FDH ID..."
            }
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>
      {error && ( // Show error here if ID was bad
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );

  // --- Main Render (MODIFIED) ---
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[66vw] h-[66vh] m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {type === "customer" ? "Customer Tree View" : "FDH Tree View"}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              disabled={
                !scriptsLoaded || isLoading || isExporting || !internalId
              } // Disabled if no ID/data
              className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              {isExporting ? "Exporting..." : "Export as PDF"}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* --- NEW CONDITIONAL RENDER --- */}
          {!internalId ? (
            renderIdInputForm() // Show form if no ID
          ) : isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="ml-3 text-gray-600">
                Loading Tree Data for ID: {internalId}...
              </p>
            </div>
          ) : error ? ( // Error when fetching data
            <div className="flex flex-col justify-center items-center h-96 p-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
              {/* --- THIS IS THE FIX --- */}
              <p className="mt-3 text-lg font-medium text-red-600">
                Failed to load data
              </p>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => {
                  setInternalId(null);
                  setError("");
                  setIdInput("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700"
              >
                Try a different ID
              </button>
            </div>
          ) : (
            // Success: render the correct tree
            treeData &&
            (type === "customer" ? renderCustomerTree() : renderFdhTree())
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetTreeModal;
