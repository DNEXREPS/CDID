#!/usr/bin/env python3
"""
Build the website's structured datasets in /data from the research snapshots in /research/raw.

Inputs (all captured 2026-11-14, see research/RESEARCH_REPORT.md):
  research/raw/cdidrepo-cars.json        CDID Repo (unofficial community database) vehicle records
  research/raw/wiki-car-infoboxes.json   Car infobox fields from the CDID Fandom wiki
  research/raw/wiki/Cars.txt             Wiki "Cars" page (brand -> dealership listing)
  research/raw/wiki/Limited_Cars.txt     Wiki limited-vehicle log per update version

Outputs:
  data/vehicles.json      full vehicle records (used for detail pages)
  data/vehicle-index.json slim records for the client-side catalogue
  data/brands.json        in-game brand names and their real-life counterparts (as stated by the wiki)
  data/limited-log.json   limited / event vehicles per update version

Run:  python3 scripts/build_data.py
Hand-curated files (dealerships, updates, sources, social, guides, timeline, maps) live in /data
and are not touched by this script.
"""
import json, os, re, unicodedata, collections

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "research", "raw")
OUT = os.path.join(ROOT, "data")
IMG_DIR = os.path.join(ROOT, "public", "images", "vehicles")
ACCESSED = "2026-11-14"


def fix_text(s: str) -> str:
    if s is None:
        return ""
    try:  # repair UTF-8 that was decoded as Latin-1 (e.g. "AtrusÃ©")
        if "Ã" in s or "â" in s:
            s = s.encode("latin-1").decode("utf-8")
    except Exception:
        pass
    s = s.replace("‐", "-").replace("‑", "-").replace("\n", " ")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def norm(s: str) -> str:
    s = fix_text(s).lower()
    s = re.sub(r"\[(limited|exclusive[^\]]*)\]", "", s)
    s = s.replace("murcezo", "murceso").replace("denzu", "densu")
    s = re.sub(r"[^a-z0-9+]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "vehicle"


# ---------------------------------------------------------------- brands
wiki_cars = open(os.path.join(RAW, "wiki", "Cars.txt"), encoding="utf-8").read()
brands = {}  # in-game brand -> real-life counterpart (only when the wiki states one)
wiki_rows = []
cur_brand, cur_dealer = None, None
for line in wiki_cars.splitlines():
    m = re.match(r"^==\s*(.+?)\s*==\s*$", line)
    if m and not line.startswith("==="):
        b = m.group(1)
        mm = re.match(r"(.+?)\s*\((.+)\)", b)
        cur_brand = (mm.group(1) if mm else b).strip()
        brands[cur_brand] = mm.group(2).strip() if mm else None
        cur_dealer = None
        continue
    m = re.match(r"^'''(.+?)'''\s*$", line.strip())
    if m:
        cur_dealer = m.group(1)
        continue
    m = re.match(r"^\*\s*''?\[\[([^\]|]+)(?:\|([^\]]+))?\]\]''?(.*)", line.strip()) or re.match(
        r"^\*\s*\[\[([^\]|]+)(?:\|([^\]]+))?\]\](.*)", line.strip())
    if m and cur_brand:
        wiki_rows.append({
            "name": fix_text(m.group(2) or m.group(1)),
            "page": fix_text(m.group(1)),
            "brand": cur_brand,
            "dealer": cur_dealer,
            "new": "[NEW!]" in m.group(3),
        })
# Wulling typo on the wiki
if brands.get("Wuliuz") == "Wulling":
    brands["Wuliuz"] = "Wuling"

# Additional in-game brand spellings found in vehicle names (no real-life counterpart claimed)
EXTRA_BRANDS = ["BMR", "Henry-Rolls", "Fresco", "Pagagini", "Kronenvik", "Palmera", "Busch", "Walden",
                "Nusad", "Athena", "Morrison", "NUF", "Gumball", "Lukic", "Motorsaurus", "Rinaldi", "SVX",
                "Julmann", "Hina", "Tiny"]
ALIASES = {
    "Murceso": "Murceso-Venz", "Murcezo-Venz": "Murceso-Venz", "Murceso Venz": "Murceso-Venz",
    "Murcezo Venz": "Murceso-Venz", "Murceso-AMG": "Murceso-Venz", "Cia": "CIA", "WeltWagen": "Weltwagen",
    "Henry Rolls": "Henry-Rolls", "Henri": "Henry-Rolls", "OverLander": "Overlander", "SUZI": "Suzi",
    "Aten": "ATEN", "Astonhill": "Aston Hill", "Wuliz": "Wuliuz", "Vinflash": "VinFlash", "Cortëon": "Corteon",
    "Atrusé": "Atruse", "Over Lander": "Overlander", "BUSCH": "Busch", "Denzu": "Densu", "Daihatsu": "Densu",
}
KNOWN = sorted(set(list(brands) + EXTRA_BRANDS + list(ALIASES)), key=len, reverse=True)

DEALER_BRAND = {"Toyota": "Tokoma", "Honda": "Honade", "Hyundai": "Hyunson", "Suzuki": "Sanziky", "KIA": "CIA",
                "Daihatsu": "Densu", "Wuling": "Wuliuz", "Mitsubishi": "Mestibis", "Lexus": "Liaxe",
                "Nissan": "Naisen", "Mazda": "Mizada", "MercedesBenz": "Murceso-Venz", "DIR": "DIR",
                "Chery": "Citrus", "Jaecoo": "Haekoo", "Shehua": "Shehua", "Geely": "Shufu", "SLM": "SLM",
                "BMW": "Buffermacht"}


def split_name(full: str, dealer_key):
    """Return (year, brand, model) from an in-game name such as '2004 Tokoma Avanza 1.3 G'."""
    s = re.sub(r"^\[(limited|exclusive)\]\s*", "", full, flags=re.I)
    year = None
    m = re.match(r"^(\d{4})\s+(.*)$", s)
    if m:
        year, s = int(m.group(1)), m.group(2)
    else:
        m = re.search(r"\s(\d{4})$", s)
        if m:
            year, s = int(m.group(1)), s[: m.start()]
    for b in KNOWN:
        if s == b or s.startswith(b + " "):
            return year, ALIASES.get(b, b), s[len(b):].strip()
    fallback = DEALER_BRAND.get(dealer_key or "")
    return year, fallback, s


# ---------------------------------------------------------------- dealership keys
DEALER_ID = {
    "Premium": "premium", "77": "sumber-jaya", "Retro": "retro", "Otnas": "otnas-esprit-works",
    "Toyota": "tokoma", "Komersial": "komercial", "BMW": "buffermacht", "Hyundai": "hyunson",
    "Honda": "honade", "MercedesBenz": "murceso-venz", "Suzuki": "sanziky", "KIA": "cia", "SLM": "slm",
    "Daihatsu": "densu", "Wuling": "wuliuz", "Mitsubishi": "mestibis", "Lexus": "liaxe", "Nissan": "naisen",
    "Audi": "atruse-weltwagen", "VW": "atruse-weltwagen", "Mazda": "mizada", "DIR": "dir", "Chery": "citrus",
    "Jaecoo": "haekoo", "Shehua": "shehua", "Geely": "shufu",
}

GAMEPASS = {"Luxury": "luxury", "Rare Import": "rare-imports", "Retro": "retro", "Emergency": "emergency"}

# ---------------------------------------------------------------- categories from wiki classification
def category_of(cls: str):
    c = (cls or "").lower()
    if not c or c in ("n/a", "tba", "bmr"):
        return None
    if re.search(r"tractor|truck|bus|lorry", c) and "pickup" not in c:
        return "Commercial"
    if "pickup" in c or "ute" in c:
        return "Pickup"
    if "suv" in c:
        return "SUV"
    if re.search(r"mpv|minivan|microvan|multi-purpose|minibus", c):
        return "MPV & Van"
    if "van" in c:
        return "MPV & Van"
    if re.search(r"hypercar|supercar", c):
        return "Supercar"
    if re.search(r"coupe|roadster|convertible|targa|fastback|spider|speedster", c):
        return "Coupé & Sports"
    if re.search(r"wagon|estate|shooting brake", c):
        return "Wagon"
    if re.search(r"hatch|liftback|microcar|lcgc", c):
        return "Hatchback"
    if re.search(r"sedan|saloon", c):
        return "Sedan"
    return None


def clean_wiki(v: str):
    if not v:
        return None
    v = re.sub(r"<br\s*/?>", "; ", v)
    v = re.sub(r"\[\[(?:[^\]|]*\|)?([^\]]+)\]\]", r"\1", v)
    v = re.sub(r"\[https?://\S+\s+([^\]]+)\]", r"\1", v)
    v = re.sub(r"'''?", "", v)
    v = re.sub(r"\{\{.*?\}\}", "", v)
    v = re.sub(r"\n\*\s*", "; ", v).lstrip("* ").strip()
    v = re.sub(r"\[(DEALERSHIP|LIMITED|EXCLUSIVE|EVENT)\];?\s*", "", v)
    v = re.sub(r"\s+", " ", v).strip(" ;")
    if v.lower() in ("", "n/a", "tba", "none", "-"):
        return None
    return v


def powertrain_of(engine: str):
    e = (engine or "").lower()
    if not e:
        return None
    if re.search(r"hev|hybrid|phev|e-turbo|\+\s*electric", e):
        return "Hybrid"
    if re.search(r"electric|motor|ev\b|kwh", e) and not re.search(r"litre|liter|\d\.\d\s*l", e):
        return "Electric"
    return "Combustion"


# ---------------------------------------------------------------- limited log
lim_txt = open(os.path.join(RAW, "wiki", "Limited_Cars.txt"), encoding="utf-8").read()
limited_log = []
cur = None
for line in lim_txt.splitlines():
    m = re.match(r"^=+\s*'*\s*CDID UPDATE LOG (V[\d.]+)\s*'*\s*=+", line)
    if m:
        cur = {"version": m.group(1), "vehicles": []}
        limited_log.append(cur)
        continue
    if cur and line.startswith("* ") and len(line.strip()) > 3:
        raw = fix_text(re.sub(r"'''''\(removed\)'''''", "(removed)", line[2:]))
        parts = [p.strip() for p in re.split(r"\s+-\s+", raw)]
        name = parts[0]
        rest = " - ".join(parts[1:])
        kind = "timed"
        if "EVENT" in rest.upper():
            kind = "event"
        elif "minigame" in rest.lower():
            kind = "minigame-box"
        elif "points" in rest.lower():
            kind = "event-points"
        elif "EXCLUSIVE" in rest.upper():
            kind = "exclusive"
        cur["vehicles"].append({
            "name": name,
            "availability": rest or None,
            "kind": kind,
            "weeklyDrop": "weekly drop" in rest.lower(),
            "removed": "(removed)" in raw,
        })
lim_by_norm = {}
for entry in limited_log:
    for v in entry["vehicles"]:
        lim_by_norm.setdefault(norm(v["name"]), (entry["version"], v))

# ---------------------------------------------------------------- wiki infobox matching
info = json.load(open(os.path.join(RAW, "wiki-car-infoboxes.json"), encoding="utf-8"))
pages, redirects = info["pages"], info["redirects"]
page_norm = {norm(t): t for t in pages}
row_by_norm = {}
for r in wiki_rows:
    row_by_norm.setdefault(norm(r["name"]), r)


def find_page(name: str):
    n = norm(name)
    r = row_by_norm.get(n)
    if r:
        p = redirects.get(r["page"], r["page"])
        if p in pages:
            return p, r
    best = None
    for pn, t in page_norm.items():
        if n == pn or n.startswith(pn + " "):
            if best is None or len(pn) > len(best[0]):
                best = (pn, t)
    return (best[1], r) if best else (None, r)


# ---------------------------------------------------------------- build
raw = json.load(open(os.path.join(RAW, "cdidrepo-cars.json"), encoding="utf-8"))
vehicles, used_ids = [], set()
stats = collections.Counter()
for c in sorted(raw, key=lambda x: fix_text(x["CarName"]).lower()):
    name = fix_text(c["CarName"])
    name = re.sub(r"^\[(limited|exclusive)\]\s*", "", name, flags=re.I)
    dealer_key = c.get("Dealership")
    year, brand, model = split_name(name, dealer_key)
    page, row = find_page(name)
    ib = pages.get(page, {}) if page else {}
    cls = clean_wiki(ib.get("classification"))
    if cls and "}}" in (ib.get("classification") or ""):
        cls = cls.split("}}")[0]
    category = category_of(cls)
    sid = slugify(name)
    base, i = sid, 2
    while sid in used_ids:
        sid = f"{base}-{i}"
        i += 1
    used_ids.add(sid)

    if c.get("Legacy"):
        availability = "removed"
    elif c.get("event"):
        availability = "event"
    elif c.get("minigame"):
        availability = "minigame-box"
    elif dealer_key:
        availability = "dealership"
    else:
        availability = "unlisted"
    limited = {"Limited": "limited", "Exclusive": "exclusive"}.get(c.get("Limited"))
    lim = lim_by_norm.get(norm(name))
    img_file = f"{c['_id']}.webp"
    has_img = os.path.exists(os.path.join(IMG_DIR, img_file))
    price = c.get("Price") or c.get("Cost") or None
    if not price or price <= 1:
        price = None

    sources = ["src-cdidrepo"]
    if page:
        sources.append("src-wiki-cars")
    if lim:
        sources.append("src-wiki-limited")
    verification = "community" if page else "partial"

    v = {
        "id": sid,
        "sourceRecordId": c["_id"],
        "name": name,
        "manufacturer": brand,
        "realLifeBrand": brands.get(brand) if brand else None,
        "model": model or None,
        "year": year,
        "category": category,
        "bodyStyle": cls,
        "powertrain": powertrain_of(c.get("Engine")),
        "price": price,
        "horsepower": None,
        "engine": fix_text(c.get("Engine")) or None,
        "drivetrain": clean_wiki(ib.get("drivetrain")),
        "transmission": clean_wiki(ib.get("transmission")),
        "realLifeCounterpart": clean_wiki(ib.get("real-life_counterpart")),
        "dealershipId": DEALER_ID.get(dealer_key) if dealer_key else None,
        "gamepass": GAMEPASS.get(c.get("Gamepass")),
        "limited": limited,
        "availability": availability,
        "limitedWindow": lim[1]["availability"] if lim else None,
        "introducedVersion": lim[0] if lim else None,
        "isNew": bool(c.get("New")) or bool(row and row.get("new")),
        "flaggedInaccurate": bool(c.get("Inaccurate")),
        "image": f"/images/vehicles/{img_file}" if has_img else None,
        "wikiPage": f"https://cardrivingindonesia.fandom.com/wiki/{page.replace(' ', '_')}" if page else None,
        "lastVerified": ACCESSED,
        "verification": verification,
        "sourceIds": sources,
    }
    stats["wiki" if page else "nowiki"] += 1
    stats["img" if has_img else "noimg"] += 1
    stats["brand" if brand else "nobrand"] += 1
    stats["cat" if category else "nocat"] += 1
    stats["intro" if lim else "nointro"] += 1
    vehicles.append(v)

os.makedirs(OUT, exist_ok=True)
json.dump(vehicles, open(os.path.join(OUT, "vehicles.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=0)

INDEX_KEYS = ["id", "name", "manufacturer", "year", "category", "powertrain", "price", "dealershipId", "gamepass",
              "limited", "availability", "isNew", "image", "introducedVersion"]
index = [[v[k] for k in INDEX_KEYS] for v in vehicles]
json.dump({"keys": INDEX_KEYS, "rows": index}, open(os.path.join(OUT, "vehicle-index.json"), "w", encoding="utf-8"),
          ensure_ascii=False, separators=(",", ":"))

brand_count = collections.Counter(v["manufacturer"] for v in vehicles if v["manufacturer"])
brand_list = [{"name": b, "realLifeCounterpart": brands.get(b), "vehicleCount": n,
               "inWikiBrandList": b in brands} for b, n in sorted(brand_count.items())]
json.dump(brand_list, open(os.path.join(OUT, "brands.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(limited_log, open(os.path.join(OUT, "limited-log.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

print(len(vehicles), "vehicles", dict(stats))
print(collections.Counter(v["availability"] for v in vehicles))
print(collections.Counter(v["category"] for v in vehicles))
print(collections.Counter(v["dealershipId"] for v in vehicles).most_common())
print(len(limited_log), "limited log versions")
