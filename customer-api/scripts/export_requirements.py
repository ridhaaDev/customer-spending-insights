"""Write src/requirements.txt from poetry.lock (main group only), for `sam build`.

Run after changing dependencies:  poetry run python scripts/export_requirements.py
"""
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
lock = tomllib.loads((ROOT / "poetry.lock").read_text())

lines = []
for pkg in lock["package"]:
    if "main" not in pkg.get("groups", ["main"]):
        continue
    line = f"{pkg['name']}=={pkg['version']}"
    markers = pkg.get("markers")
    if isinstance(markers, str) and markers:
        line += f" ; {markers}"
    lines.append(line)

out = ROOT / "src" / "requirements.txt"
out.write_text("# Generated from poetry.lock by scripts/export_requirements.py. Do not edit.\n" + "\n".join(sorted(lines)) + "\n")
print(f"wrote {out.relative_to(ROOT)} with {len(lines)} packages")
