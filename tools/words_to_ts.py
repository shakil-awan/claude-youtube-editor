"""words.json -> remotion/src/shots/short-NNN/words.ts   (python tools/words_to_ts.py 143 144)"""
import json
import sys

for n in sys.argv[1:]:
    w = json.load(open(f"videos/short-{n}/work/voiceover/words.json"))["words"]
    rows = ",\n".join(
        f'  {{ word: {json.dumps(x["word"])}, start_s: {x["start_s"]}, end_s: {x["end_s"]} }}' for x in w
    )
    open(f"remotion/src/shots/short-{n}/words.ts", "w").write(
        "// GENERATED from words.json — do not hand-edit.\n"
        "import type { CaptionWord } from '../../lib/shorts';\n\n"
        f"export const WORDS: readonly CaptionWord[] = [\n{rows},\n];\n"
    )
