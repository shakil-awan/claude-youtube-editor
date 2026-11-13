"""Attach a stored thumbnail to an already-uploaded video.  python tools/set_thumb.py <video_id> <jpg>
(YPP-gated for Shorts display — stored for the day the channel is monetized.)"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from googleapiclient.http import MediaFileUpload

import yt_upload

vid, jpg = sys.argv[1], sys.argv[2]
yt = yt_upload.service()
yt.thumbnails().set(videoId=vid, media_body=MediaFileUpload(jpg, mimetype="image/jpeg")).execute()
print("thumbnail set:", vid)
