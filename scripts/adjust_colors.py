#!/usr/bin/env python3
"""
adjust_colors.py
Adjusts and normalizes the 7 website images (hero background + 6 benefit cards):
1. Normalizes lightness and saturation so no image stands out as too pale or too dark.
2. Shifts the color palette from bright neon/scarlet red to a cohesive brown-orange-red / terracotta tone.
3. Preserves watercolor texture and gradients with smooth gamut protection.
"""

import os
import cv2
import numpy as np
from PIL import Image

def match_percentiles(channel, p_points, target_p):
    """Piecewise linear mapping matching source percentiles to target percentiles."""
    src_vals = np.percentile(channel, p_points)
    for i in range(1, len(src_vals)):
        if src_vals[i] <= src_vals[i-1]:
            src_vals[i] = src_vals[i-1] + 1e-4
    return np.interp(channel, src_vals, target_p)

def process_images():
    base_dir = '/home/jira_pit/Documents/morflow-website/public/assets'
    files = ['Background.png', '01.png', '02.png', '03.png', '04.png', '05.png', '06.png']

    # Percentile control points
    p_points = [0, 5, 15, 30, 50, 70, 85, 95, 100]
    
    # Target Lightness profile: median 170, balanced highlights and rich earthy shadows
    target_L_p = [0, 95, 126, 148, 170, 192, 214, 235, 255]
    
    # Target Saturation profile: median 148, harmonizes pale and hyper-saturated images
    target_S_p = [0, 55, 90, 120, 148, 175, 200, 218, 255]

    for f in files:
        img_path = os.path.join(base_dir, f)
        img = Image.open(img_path).convert('RGB')
        arr = np.array(img, dtype=np.uint8)

        # 1. HSV: Shift hue towards brown-orange-red & normalize saturation
        hsv = cv2.cvtColor(arr, cv2.COLOR_RGB2HSV).astype(np.float32)
        h, s, v = hsv[:,:,0], hsv[:,:,1], hsv[:,:,2]

        # Shift red hues (~8-10 in OpenCV / 16°-20°) by +3.5 to warm amber/terracotta (~12-14 / 24°-28°)
        h_wrap = np.where(h > 150, h - 180, h)
        h_shifted = h_wrap + 3.5
        h_new = np.clip(np.where(h_shifted < 0, h_shifted + 180, h_shifted), 0, 180)
        
        # Match saturation distribution
        s_new = match_percentiles(s, p_points, target_S_p)

        hsv_new = np.stack([h_new, s_new, v], axis=-1).astype(np.uint8)
        rgb_hsv = cv2.cvtColor(hsv_new, cv2.COLOR_HSV2RGB)

        # 2. LAB: Normalize Lightness & tune earthy warmth
        lab = cv2.cvtColor(rgb_hsv, cv2.COLOR_RGB2LAB).astype(np.float32)
        l, a, b_ch = lab[:,:,0], lab[:,:,1], lab[:,:,2]
        
        # Match lightness distribution
        l_new = match_percentiles(l, p_points, target_L_p)

        # Gamut protection for shadows to prevent flat clipping and maintain watercolor nuances
        chroma_scale = np.clip(l_new / 120.0, 0.4, 1.0)
        a_centered = (a - 128.0) * 0.95 * chroma_scale
        b_centered = (b_ch - 128.0) * 1.06 * chroma_scale

        lab_final = np.stack([l_new, 128.0 + a_centered, 128.0 + b_centered], axis=-1).astype(np.uint8)
        rgb_final = cv2.cvtColor(lab_final, cv2.COLOR_LAB2RGB)

        # Save back to target file
        Image.fromarray(rgb_final).save(img_path)
        print(f"Processed and updated {f}")

if __name__ == '__main__':
    process_images()
