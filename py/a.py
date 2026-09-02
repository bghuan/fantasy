# capture_chrome_yolo.py
import time
import ctypes
import cv2
import numpy as np
import mss
import win32gui
from ultralytics import YOLO

# ---- DPI aware (减少缩放导致的坐标不对) ----
try:
    ctypes.windll.user32.SetProcessDPIAware()
except Exception:
    pass

# ---- 选择模型（轻量 seg 模型） ----
MODEL_PATH = "yolov8n-seg.pt"  # 改成你的模型路径
model = YOLO(MODEL_PATH)

sct = mss.mss()

def enum_windows_by_keyword(keyword="Chrome"):
    """返回匹配关键词的 (hwnd, title) 列表"""
    matches = []
    def cb(hwnd, extra):
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if title and keyword.lower() in title.lower():
                matches.append((hwnd, title))
    win32gui.EnumWindows(cb, None)
    return matches

def client_rect_to_screen(hwnd):
    """
    返回窗口客户区在屏幕坐标的 (left, top, right, bottom)
    （不含标题栏/边框）
    """
    # client rect (left, top, right, bottom) — usually (0,0,w,h)
    crect = win32gui.GetClientRect(hwnd)
    left_top = win32gui.ClientToScreen(hwnd, (crect[0], crect[1]))
    right_bottom = win32gui.ClientToScreen(hwnd, (crect[2], crect[3]))
    left, top = left_top
    right, bottom = right_bottom
    return int(left), int(top), int(right), int(bottom)

def choose_window_interactive(keyword="Chrome"):
    matches = enum_windows_by_keyword(keyword)
    if not matches:
        print(f"没有找到包含 `{keyword}` 的窗口。")
        return None
    print("找到以下窗口：")
    for i, (_, title) in enumerate(matches):
        print(f"[{i}] {title}")
    if len(matches) == 1:
        idx = 0
    else:
        try:
            idx = int(input(f"输入要抓取的窗口编号 (0-{len(matches)-1}): ").strip())
            if idx < 0 or idx >= len(matches):
                print("编号超范围，默认 0")
                idx = 0
        except Exception:
            print("输入无效，默认 0")
            idx = 0
    hwnd, title = matches[idx]
    print(f"选择：[{idx}] {title} (hwnd={hwnd})")
    return hwnd

def grab_client_region(hwnd, crop_top=70, crop_bottom=0, crop_left=0, crop_right=0):
    """返回裁剪后的监视区域 dict 或 None（如果窗口不可见或尺寸异常）"""
    try:
        left, top, right, bottom = client_rect_to_screen(hwnd)
    except Exception:
        return None
    w = right - left
    h = bottom - top
    if w <= 0 or h <= 0:
        return None
    # apply internal cropping (去掉浏览器内部 UI，如地址栏)
    top += crop_top
    bottom -= crop_bottom
    left += crop_left
    right -= crop_right
    w = right - left
    h = bottom - top
    if w <= 0 or h <= 0:
        return None
    return {"left": int(left), "top": int(top), "width": int(w), "height": int(h)}

def draw_overlay(frame, results, alpha=0.35):
    """把 mask 半透明叠加并画轮廓与 bbox"""
    overlay = frame.copy()
    for r in results:
        # boxes
        if hasattr(r, "boxes") and r.boxes is not None:
            for box in r.boxes.xyxy.cpu().numpy():
                x1, y1, x2, y2 = map(int, box[:4])
                cv2.rectangle(overlay, (x1, y1), (x2, y2), (0,255,0), 2)

        # masks: r.masks.xy 是多边形点集列表（相对原图）
        if hasattr(r, "masks") and r.masks is not None:
            try:
                for poly in r.masks.xy:
                    pts = poly.astype(np.int32)
                    if pts.size == 0:
                        continue
                    cv2.fillPoly(overlay, [pts], color=(0,0,255))
                    cv2.polylines(overlay, [pts], isClosed=True, color=(0,0,180), thickness=2)
            except Exception:
                pass
    # blend
    cv2.addWeighted(overlay, alpha, frame, 1-alpha, 0, frame)
    return frame

def main():
    print(">>> 开始：枚举 Chrome 窗口并选择要抓取的窗口")
    hwnd = choose_window_interactive("Edit")
    if not hwnd:
        return

    crop_top = 70    # 默认裁掉浏览器顶部 UI（可按键调节）
    crop_bottom = 0
    crop_left = 0
    crop_right = 0

    paused = False
    last_time = time.time()
    fps = 0.0

    print("说明：按 q 退出；按 r 重新选择窗口；w/s 增减 crop_top (地址栏高度)；p 暂停/继续。")
    while True:
        # 每帧重新读取客户端坐标（支持窗口移动/缩放）
        region = grab_client_region(hwnd, crop_top, crop_bottom, crop_left, crop_right)
        if region is None:
            # 窗口可能被最小化或关闭，提示并等待 or 重选
            cv2.imshow("YOLOv8 Window Capture", np.zeros((200,600,3), dtype=np.uint8))
            key = cv2.waitKey(1) & 0xFF
            if key == ord('r'):
                print("重新选择窗口...")
                hwnd = choose_window_interactive("Chrome")
                continue
            if key == ord('q'):
                break
            continue

        # 抓屏
        sct_img = sct.grab(region)
        frame = np.array(sct_img)  # BGRA
        frame = cv2.cvtColor(frame, cv2.COLOR_BGRA2BGR)

        if not paused:
            # 推理（只检测 person 类）
            try:
                results = model(frame, classes=[0], stream=True, verbose=False)
            except Exception as e:
                print("模型推理错误：", e)
                results = []

            # 绘制 overlay
            frame = draw_overlay(frame, results, alpha=0.35)

        # FPS
        now = time.time()
        fps = 0.9*fps + 0.1*(1.0/(now - last_time + 1e-6))
        last_time = now
        cv2.putText(frame, f"FPS: {fps:.1f}", (10,25), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255,255,0), 2)
        cv2.putText(frame, f"crop_top: {crop_top}px (w/s adjust)", (10,55), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200,200,200), 1)

        cv2.imshow("YOLOv8 Window Capture", frame)
        key = cv2.waitKey(1) & 0xFF

        if key == ord('q'):
            break
        elif key == ord('r'):
            print("重新选择窗口...")
            hwnd = choose_window_interactive("Chrome") or hwnd
        elif key == ord('p'):
            paused = not paused
            print("paused:", paused)
        elif key == ord('w'):
            crop_top = max(0, crop_top - 5)
        elif key == ord('s'):
            crop_top += 5
        elif key == ord('a'):
            crop_left = max(0, crop_left - 5)
        elif key == ord('d'):
            crop_left += 5
        elif key == ord('o'):
            crop_bottom = max(0, crop_bottom - 5)
        elif key == ord('l'):
            crop_bottom += 5

    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
