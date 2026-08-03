// Professional profile — sourced from https://meghanabv19.github.io/
// Powers the About section. Static (career data changes rarely).

export const profile = {
  name: "Meghana BV",
  role: "Senior Data Engineer",
  focus: "SQL · ETL · Data Migration",
  tagline: "Data pipelines that ship — and stay clean.",
  summary:
    "7 years designing and delivering enterprise ETL/ELT pipelines, SQL data-quality frameworks and large-scale SAP data migrations.",
  location: "London, United Kingdom",
  workRight: "Full UK right to work — no sponsorship needed.",
  links: {
    email: "meghanalondon1@gmail.com",
    phone: "+44 7343 059777",
    linkedin: "https://linkedin.com/in/meghana-bv-data-consultant/",
    github: "https://github.com/meghanabv19",
    site: "https://meghanabv19.github.io/",
    leetcode: "https://leetcode.com/u/meghanabv/",
    hackerrank: "https://www.hackerrank.com/profile/meghanabv11",
  },
};

export const experience = [
  {
    company: "Syniti",
    title: "Senior Data Migration Consultant",
    period: "Feb 2022 – Aug 2026",
    clients: [
      {
        name: "BP",
        period: "Jan 2025 – Aug 2026",
        points: [
          "Led SAP Material Master migration to S/4HANA — 80,000+ records",
          "Built automated pre/post-load validation and self-service reports",
        ],
      },
      {
        name: "IKEA",
        period: "Dec 2023 – Jan 2025",
        points: [
          "Optimised Business Partner pipelines — 60,000+ records across 15+ tables",
          "Implemented field-level comparison logic for reconciliation",
        ],
      },
      {
        name: "Corning Inc.",
        period: "Feb 2022 – Dec 2023",
        points: [
          "End-to-end ADM solution for Production Planning objects",
          "SQL data-quality reports + Python profiling automation",
        ],
      },
    ],
  },
  {
    company: "Infosys",
    title: "ETL Developer / DataStage",
    period: "Nov 2019 – Feb 2022",
    clients: [
      {
        name: "Bank of America",
        period: "Nov 2019 – Feb 2022",
        points: [
          "Designed IBM DataStage ETL for DB2 → Teradata migration",
          "Automated reconciliation; AutoSys job scheduling",
        ],
      },
    ],
  },
];

export const skills: Record<string, string[]> = {
  "SQL & Databases": [
    "SQL", "CTEs", "Window Functions", "Stored Procedures", "Query Optimization",
    "SQL Server", "PostgreSQL", "Teradata", "DB2", "AWS Aurora/RDS",
  ],
  "ETL / Data Engineering": [
    "ETL/ELT", "Data Integration", "Dimensional Modeling", "IBM DataStage",
    "dbt", "Apache Airflow", "AutoSys", "Data Warehousing",
  ],
  "SAP & Migration": [
    "Syniti ADM/ADMM", "SAP S/4HANA", "LTMC", "LSMW", "IDoc",
    "Material Master", "Business Partner", "Production Planning",
  ],
  "Programming & Cloud": [
    "Python", "Pandas", "NumPy", "SQLAlchemy", "FastAPI", "UNIX Shell",
    "AWS (S3, Glue, Athena, EC2)", "Redshift", "BigQuery",
  ],
  "Data Quality": [
    "Data Profiling", "Cleansing", "Pre/Post-Load Validation", "Reconciliation", "Access Controls",
  ],
  "BI / AI Tools": [
    "Tableau", "Self-Service Reporting", "Claude Code", "OpenAI Codex", "Gemini CLI",
  ],
};

export const certifications = [
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "Jul 2026" },
  { name: "AWS Certified AI Practitioner", issuer: "Amazon Web Services", date: "Jul 2026" },
  { name: "AWS Certified Data Engineer", issuer: "Amazon Web Services", date: "In progress" },
  { name: "Certified Syniti ADM Developer", issuer: "Syniti (ID 12585089)", date: "Aug 2023" },
  { name: "Advanced Data Migration / ADMM", issuer: "Syniti (ID 15682601)", date: "Dec 2024" },
  { name: "SQL (Advanced)", issuer: "HackerRank", date: "Jan 2026" },
];

export const education = {
  degree: "B.E. — Computer Science",
  school: "Visvesvaraya Technological University",
  date: "Jun 2019",
};

export const impact = [
  { value: "80,000+", label: "SAP Material Master records migrated at BP" },
  { value: "60,000+", label: "Business Partner records integrated at IKEA" },
  { value: "15+", label: "source tables reconciled per object" },
  { value: "7+ yrs", label: "enterprise ETL / migration delivery" },
];
