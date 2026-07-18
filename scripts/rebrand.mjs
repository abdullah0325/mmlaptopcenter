import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const root = join(import.meta.dirname, "..");
const dirs = ["src", "public"];
const exts = new Set([".tsx", ".ts", ".jsx", ".js", ".css", ".json", ".html"]);

const replacements = [
  ["#1F6B4F", "#f6a45d"],
  ["#1f6b4f", "#f6a45d"],
  ["#17513D", "#d8861f"],
  ["#17513d", "#d8861f"],
  ["#C6A24A", "#d8a928"],
  ["#c6a24a", "#d8a928"],
  ["#F6F1E7", "#fcf5e8"],
  ["#f6f1e7", "#fcf5e8"],
  ["bg-[#1E1F1C]", "bg-[#1a1308]"],
  ["bg-[#1e1f1c]", "bg-[#1a1308]"],
  ["text-[#1E1F1C]", "text-[#0a0a0a]"],
  ["text-[#1e1f1c]", "text-[#0a0a0a]"],
  ["OrganoCity", "MM Laptop Center"],
  ["Organocity", "MM Laptop Center"],
  ["organocity.com", "mmlaptopcenter.com"],
  ["organocitypk@gmail.com", "info@mmlaptopcenter.com"],
  [
    "/logo/organocityBackup-white.png",
    "https://placehold.co/200x60/1a1308/d8a928?text=MM+Laptop+Center",
  ],
  [
    "/logo/organocityBackup.png",
    "https://placehold.co/200x80/1a1308/f6a45d?text=MM+Laptop+Center",
  ],
  ["organocity-cart", "mmlaptop-cart"],
  ["organocity-v1", "mmlaptop-v1"],
  ["organocity/", "mmlaptop/"],
  ["organocity-dev-secret", "mmlaptop-dev-secret"],
  ["Himalayan", "Premium"],
  ["himalayan", "premium"],
  ["Pink Salt", "Laptops"],
  ["pink salt", "laptops"],
  ["Shilajit", "Gaming Gear"],
  ["shilajit", "gaming gear"],
];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === ".next") continue;
      walk(full, files);
    } else if (exts.has(extname(full))) {
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
for (const dir of dirs) {
  for (const file of walk(join(root, dir))) {
    let content = readFileSync(file, "utf8");
    const original = content;
    for (const [from, to] of replacements) {
      content = content.split(from).join(to);
    }
    if (content !== original) {
      writeFileSync(file, content, "utf8");
      changed++;
    }
  }
}
console.log(`Updated ${changed} files`);
