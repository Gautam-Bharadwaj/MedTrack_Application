/**
 * Electronic Health Records (EHR) & FHIR Export Service
 * Manages patient lab test results, clinical records, diagnostic imaging attachments, and FHIR standard JSON export.
 */

const STORAGE_KEY = "medtrack_ehr_records_v1";

const INITIAL_LAB_RESULTS = [
  {
    id: "lab-501",
    testName: "Comprehensive Metabolic Panel (CMP)",
    category: "Blood Chemistry",
    date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10),
    labName: "Quest Diagnostics Lab",
    orderingDoctor: "Dr. Sarah Jenkins",
    status: "Final",
    results: [
      { parameter: "Glucose (Fasting)", value: 94, unit: "mg/dL", referenceRange: "70 - 99", status: "NORMAL" },
      { parameter: "BUN (Blood Urea Nitrogen)", value: 16, unit: "mg/dL", referenceRange: "7 - 20", status: "NORMAL" },
      { parameter: "Creatinine", value: 0.9, unit: "mg/dL", referenceRange: "0.6 - 1.3", status: "NORMAL" },
      { parameter: "Sodium", value: 140, unit: "mmol/L", referenceRange: "135 - 145", status: "NORMAL" },
      { parameter: "Potassium", value: 4.2, unit: "mmol/L", referenceRange: "3.5 - 5.0", status: "NORMAL" }
    ],
    doctorNotes: "All metabolic parameters are within normal physiological thresholds."
  },
  {
    id: "lab-502",
    testName: "Lipid Panel (Cholesterol Profile)",
    category: "Cardiovascular",
    date: new Date(Date.now() - 12 * 86400000).toISOString().slice(0, 10),
    labName: "MedTrack Central Laboratory",
    orderingDoctor: "Dr. Robert Chen",
    status: "Final",
    results: [
      { parameter: "Total Cholesterol", value: 215, unit: "mg/dL", referenceRange: "< 200", status: "HIGH" },
      { parameter: "Triglycerides", value: 145, unit: "mg/dL", referenceRange: "< 150", status: "NORMAL" },
      { parameter: "HDL (Good) Cholesterol", value: 52, unit: "mg/dL", referenceRange: "> 40", status: "NORMAL" },
      { parameter: "LDL (Bad) Cholesterol", value: 134, unit: "mg/dL", referenceRange: "< 100", status: "HIGH" }
    ],
    doctorNotes: "Borderline elevated LDL. Recommended low-saturated fat diet and 30 min daily exercise."
  },
  {
    id: "lab-503",
    testName: "Hemoglobin A1c (HbA1c)",
    category: "Endocrinology",
    date: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
    labName: "LabCorp Diagnostics",
    orderingDoctor: "Dr. Robert Chen",
    status: "Final",
    results: [
      { parameter: "HbA1c Percentage", value: 5.6, unit: "%", referenceRange: "< 5.7", status: "NORMAL" }
    ],
    doctorNotes: "Excellent glycemic control maintained over past 3 months."
  }
];

export const getLabResults = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LAB_RESULTS));
      return INITIAL_LAB_RESULTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading lab results from storage", err);
    return INITIAL_LAB_RESULTS;
  }
};

export const exportToFhirJson = (labRecords) => {
  const fhirBundle = {
    resourceType: "Bundle",
    type: "collection",
    timestamp: new Date().toISOString(),
    entry: labRecords.map((lab) => ({
      resource: {
        resourceType: "DiagnosticReport",
        id: lab.id,
        status: lab.status.toLowerCase(),
        code: { text: lab.testName },
        subject: { display: "Patient John Smith" },
        effectiveDateTime: lab.date,
        performer: [{ display: lab.labName }],
        result: lab.results.map((r) => ({
          display: `${r.parameter}: ${r.value} ${r.unit} (Ref: ${r.referenceRange}) [${r.status}]`
        })),
        conclusion: lab.doctorNotes
      }
    }))
  };
  return JSON.stringify(fhirBundle, null, 2);
};

export const exportEhrToCSV = (records) => {
  if (!records || records.length === 0) return "";
  const headers = ["Lab ID", "Test Name", "Category", "Date", "Lab Name", "Ordering Doctor", "Status", "Notes"];
  const rows = records.map((r) => [
    r.id,
    `"${r.testName}"`,
    r.category,
    r.date,
    `"${r.labName}"`,
    `"${r.orderingDoctor}"`,
    r.status,
    `"${(r.doctorNotes || "").replace(/"/g, '""')}"`
  ]);
  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
};
