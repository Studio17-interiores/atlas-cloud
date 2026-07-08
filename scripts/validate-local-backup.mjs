import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-local-backup.mjs backup.json");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(file, "utf8"));
const data = payload.data || payload;

console.log({
  clients: data.clients?.length ?? 0,
  projects: data.projects?.length ?? 0,
  tasks: data.tasks?.length ?? 0,
  decisions: data.decisions?.length ?? 0,
  documents: data.projectDocuments?.length ?? 0,
  templates: data.templates?.length ?? 0
});

