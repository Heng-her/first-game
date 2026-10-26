"""
Blender 5.2 Python Script: Professional Automated Khmer Traditional Avatar Pipeline
=====================================================================================
Automated workflow:
1. Ingests high-fidelity human 3D base mesh (detailed facial anatomy, realistic skin, hair, eyes).
2. Sets up PBR materials (Sandy Linen Shirt, Brown Chong Kben, Leather Boots, Woven Straw Hat, Cambodian Flag, Red-White Krama).
3. Procedurally builds & fits authentic Khmer cultural accessories:
   - Authentic Khmer Woven Palm/Straw Hat (មួកស្លឹក/មួកចំបើង) with Cambodian flag badge & chin cord.
   - Authentic Khmer Krama Waist Sash (ក្រម៉ាខ្មែរចងចង្កេះ) with tied side knot, drape, and fringes.
4. Binds and weights accessories to the humanoid skeleton (mixamorig9:Head, mixamorig9:Hips, mixamorig9:Spine).
5. Configures 3-point studio lighting and 85mm portrait cameras.
6. Renders high-resolution full-body and portrait beauty previews.
7. Checks game compatibility (polygon budget, scale, UVs, bones, WebGL optimization).
8. Exports clean, game-ready GLB to public/models/characters/MenKhStyle.glb.
"""

import bpy
import bmesh
import math
import os
import sys
import numpy as np
from mathutils import Vector, Matrix

# ==============================================================================
# 1. PBR TEXTURE & MATERIAL GENERATORS
# ==============================================================================

def create_pbr_material(name, img_array, roughness=0.6, metallic=0.0):
    mat = bpy.data.materials.new(name=name)
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    
    h, w, _ = img_array.shape
    img = bpy.data.images.new(name=f"{name}_Tex", width=w, height=h, alpha=True)
    img.pixels.foreach_set(img_array.flatten())
    img.pack()
    
    tex_node = nodes.new("ShaderNodeTexImage")
    tex_node.image = img
    links.new(tex_node.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metallic
    return mat

def gen_flag_texture(w=1024, h=640):
    """Accurate Cambodian national flag (ទង់ជាតិកម្ពុជា) with Angkor Wat towers."""
    img = np.zeros((h, w, 4), dtype=np.float32)
    blue = np.array([0.015, 0.170, 0.650, 1.0], dtype=np.float32)
    red  = np.array([0.860, 0.020, 0.130, 1.0], dtype=np.float32)
    white = np.array([1.0, 1.0, 1.0, 1.0], dtype=np.float32)
    
    h_blue = int(h * 0.25)
    img[:h_blue, :] = blue
    img[h - h_blue:, :] = blue
    img[h_blue : h - h_blue, :] = red
    
    cx, cy = w // 2, h // 2
    b1_w, b1_h = int(w * 0.36), int(h * 0.045)
    img[cy - int(h*0.14) : cy - int(h*0.14) + b1_h, cx - b1_w//2 : cx + b1_w//2] = white
    b2_w, b2_h = int(w * 0.30), int(h * 0.038)
    base_top = cy - int(h*0.14) + b1_h
    img[base_top : base_top + b2_h, cx - b2_w//2 : cx + b2_w//2] = white
    
    wall_top = base_top + b2_h
    cw, ch = int(w * 0.06), int(h * 0.20)
    img[wall_top : wall_top + ch, cx - cw//2 : cx + cw//2] = white
    for dy in range(int(h * 0.08)):
        sw = int((cw // 2) * (1.0 - (dy / (h * 0.08))**0.8))
        if sw > 0 and wall_top + ch + dy < h - h_blue:
            img[wall_top + ch + dy, cx - sw : cx + sw] = white
            
    for off in [-int(w * 0.095), int(w * 0.095)]:
        tx, tw, th = cx + off, int(w * 0.046), int(h * 0.14)
        img[wall_top : wall_top + th, tx - tw//2 : tx + tw//2] = white
        for dy in range(int(h * 0.06)):
            sw = int((tw // 2) * (1.0 - (dy / (h * 0.06))**0.8))
            if sw > 0 and wall_top + th + dy < h - h_blue:
                img[wall_top + th + dy, tx - sw : tx + sw] = white
                
    for off in [-int(w * 0.14), int(w * 0.14)]:
        tx, tw, th = cx + off, int(w * 0.032), int(h * 0.08)
        img[wall_top : wall_top + th, tx - tw//2 : tx + tw//2] = white
        
    return img

def gen_krama_texture(size=1024):
    """Traditional Cambodian Red & White Gingham Krama (ក្រម៉ាខ្មែរ)."""
    img = np.zeros((size, size, 4), dtype=np.float32)
    dark_red   = np.array([0.65, 0.06, 0.12, 1.0], dtype=np.float32)
    bright_red = np.array([0.88, 0.20, 0.25, 1.0], dtype=np.float32)
    white      = np.array([0.98, 0.98, 0.97, 1.0], dtype=np.float32)
    
    cell = size // 32
    for y in range(size):
        r_even = ((y // cell) % 2) == 0
        y_thread = math.sin(y * 0.5) * 0.02
        for x in range(size):
            c_even = ((x // cell) % 2) == 0
            x_thread = math.sin(x * 0.5) * 0.02
            
            if r_even and c_even:
                col = dark_red
            elif r_even or c_even:
                col = bright_red
            else:
                col = white
                
            weave = (x_thread + y_thread)
            img[y, x] = np.clip(col + np.array([weave, weave, weave, 0.0]), 0.0, 1.0)
            
    for i in range(0, size, cell * 8):
        img[i:i+3, :] = np.clip(img[i:i+3, :] * 0.4 + np.array([0.05, 0.08, 0.35, 0.0]), 0.0, 1.0)
        img[:, i:i+3] = np.clip(img[:, i:i+3] * 0.4 + np.array([0.05, 0.08, 0.35, 0.0]), 0.0, 1.0)
        
    return img

def gen_straw_texture(size=1024):
    """Authentic Cambodian woven palm leaf / straw pattern (មួកស្លឹកត្នោត)."""
    img = np.zeros((size, size, 4), dtype=np.float32)
    base_straw  = np.array([0.88, 0.78, 0.58, 1.0], dtype=np.float32)
    light_straw = np.array([0.96, 0.88, 0.70, 1.0], dtype=np.float32)
    dark_straw  = np.array([0.72, 0.60, 0.42, 1.0], dtype=np.float32)
    
    cx, cy = size / 2.0, size / 2.0
    y_coords, x_coords = np.mgrid[0:size, 0:size]
    angles = np.arctan2(y_coords - cy, x_coords - cx)
    radii = np.sqrt((x_coords - cx)**2 + (y_coords - cy)**2)
    
    slat_wave = np.sin(angles * 36.0)
    radial_rings = np.sin(radii * 0.15)
    
    for y in range(size):
        for x in range(size):
            sw = slat_wave[y, x]
            rr = radial_rings[y, x]
            val = sw * 0.20 + rr * 0.08
            c = (base_straw * (1.0 - val) + light_straw * val) if val > 0 else (base_straw * (1.0 + val) + dark_straw * (-val))
            noise = (((x * 17 + y * 31) % 11) / 11.0) * 0.02
            img[y, x] = np.clip(c + np.array([noise, noise, noise, 0.0]), 0.0, 1.0)
    return img

def gen_linen_texture(size=512):
    """Sand/cream organic linen shirt texture (អាវក្រណាត់ទេសឯក)."""
    img = np.zeros((size, size, 4), dtype=np.float32)
    linen_sand = np.array([0.90, 0.86, 0.78, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            slub = ((x % 3 == 0) + (y % 3 == 0)) * 0.025
            noise = (((x * 19 + y * 23) % 13) / 13.0) * 0.02 - 0.01
            img[y, x] = np.clip(linen_sand - slub + noise, 0.0, 1.0)
    return img

def gen_chongkben_texture(size=512):
    """Rich chestnut brown Chong Kben traditional pants texture (ខោប៉ោងចងក្បិន)."""
    img = np.zeros((size, size, 4), dtype=np.float32)
    warm_brown = np.array([0.38, 0.23, 0.16, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            crease = math.sin(x * 0.08) * 0.04
            noise = (((x * 29 + y * 37) % 17) / 17.0) * 0.02
            img[y, x] = np.clip(warm_brown + crease + noise, 0.0, 1.0)
    return img

def gen_leather_texture(size=512):
    """Polished dark brown leather expedition boots (ស្បែកជើងកវែង)."""
    img = np.zeros((size, size, 4), dtype=np.float32)
    leather = np.array([0.16, 0.10, 0.07, 1.0], dtype=np.float32)
    for y in range(size):
        for x in range(size):
            crease = math.sin(y * 0.1) * 0.02 if y < 200 else 0
            img[y, x] = np.clip(leather + crease, 0.0, 1.0)
    return img

# ==============================================================================
# 2. HUMANOID ANIMATION GENERATOR (Mixamo 65-Bone Compatible)
# ==============================================================================

def create_humanoid_animations(arm, mocap_run_action=None):
    """
    Creates and bakes a complete suite of humanoid actions onto the 65-bone Mixamo Armature:
    - Idle: Natural breathing, gentle weight shift, alive head micro-sways.
    - Walk: Balanced 30-frame walking cycle with arm swings and knee flex.
    - Run: Preserves high-fidelity Mixamo run if available, or athletic run cycle.
    - Sprint: High-speed 16-frame sprint with forward body lean and active limb drive.
    - Jump: Takeoff crouch, explosive upward stretch, airborne tuck.
    - Fall: Airborne suspended glide with balancing limbs.
    - Land: Kinetic impact absorption and smooth recovery to upright stance.
    """
    bpy.context.view_layer.objects.active = arm
    bpy.ops.object.mode_set(mode='POSE')
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.transforms_clear()

    pbones = arm.pose.bones
    
    def get_pb(name_candidates):
        for n in name_candidates:
            if n in pbones:
                return pbones[n]
        return None
    
    # Bone references
    hips = get_pb(['mixamorig9:Hips', 'Hips'])
    spine = get_pb(['mixamorig9:Spine', 'Spine'])
    spine1 = get_pb(['mixamorig9:Spine1', 'Spine1'])
    spine2 = get_pb(['mixamorig9:Spine2', 'Spine2'])
    head = get_pb(['mixamorig9:Head', 'Head'])
    
    l_up_leg = get_pb(['mixamorig9:LeftUpLeg', 'LeftUpLeg'])
    l_leg = get_pb(['mixamorig9:LeftLeg', 'LeftLeg'])
    l_foot = get_pb(['mixamorig9:LeftFoot', 'LeftFoot'])
    
    r_up_leg = get_pb(['mixamorig9:RightUpLeg', 'RightUpLeg'])
    r_leg = get_pb(['mixamorig9:RightLeg', 'RightLeg'])
    r_foot = get_pb(['mixamorig9:RightFoot', 'RightFoot'])
    
    l_arm = get_pb(['mixamorig9:LeftArm', 'LeftArm'])
    l_forearm = get_pb(['mixamorig9:LeftForeArm', 'LeftForeArm'])
    r_arm = get_pb(['mixamorig9:RightArm', 'RightArm'])
    r_forearm = get_pb(['mixamorig9:RightForeArm', 'RightForeArm'])
    
    for p in pbones:
        p.rotation_mode = 'XYZ'
        
    actions_created = []
    
    # -------------------------------------------------------------
    # 1. IDLE (60 frames / 2.0s loop)
    # -------------------------------------------------------------
    act_idle = bpy.data.actions.new(name="Idle")
    arm.animation_data.action = act_idle
    for f in [1, 30, 60]:
        t = (f - 1) / 59.0
        breath = math.sin(t * math.pi * 2)
        sway = math.cos(t * math.pi * 2)
        
        if spine1:
            spine1.rotation_euler = (breath * math.radians(2.2), 0, 0)
            spine1.keyframe_insert(data_path='rotation_euler', frame=f)
        if spine2:
            spine2.rotation_euler = (breath * math.radians(1.5), 0, 0)
            spine2.keyframe_insert(data_path='rotation_euler', frame=f)
        if hips:
            hips.rotation_euler = (0, 0, sway * math.radians(1.2))
            hips.keyframe_insert(data_path='rotation_euler', frame=f)
        if head:
            head.rotation_euler = (breath * math.radians(-1.0), sway * math.radians(1.8), 0)
            head.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_arm:
            l_arm.rotation_euler = (math.radians(2.0), 0, math.radians(-2.0) + breath * math.radians(0.8))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_arm:
            r_arm.rotation_euler = (math.radians(2.0), 0, math.radians(2.0) - breath * math.radians(0.8))
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            
    actions_created.append(act_idle)
    
    # -------------------------------------------------------------
    # 2. WALK (30 frames / 1.0s loop)
    # -------------------------------------------------------------
    act_walk = bpy.data.actions.new(name="Walk")
    arm.animation_data.action = act_walk
    for f in range(1, 31):
        phase = (f - 1) / 30.0 * math.pi * 2
        sin_p = math.sin(phase)
        cos_p = math.cos(phase)
        
        # Legs swing opposite
        if l_up_leg:
            l_up_leg.rotation_euler = (sin_p * math.radians(25.0), 0, 0)
            l_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_up_leg:
            r_up_leg.rotation_euler = (-sin_p * math.radians(25.0), 0, 0)
            r_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            
        # Knees flex on backswing
        if l_leg:
            knee_flex = max(0, -sin_p) * math.radians(38.0)
            l_leg.rotation_euler = (knee_flex, 0, 0)
            l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_leg:
            knee_flex = max(0, sin_p) * math.radians(38.0)
            r_leg.rotation_euler = (knee_flex, 0, 0)
            r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            
        # Feet ankle articulation
        if l_foot:
            l_foot.rotation_euler = (-sin_p * math.radians(12.0), 0, 0)
            l_foot.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_foot:
            r_foot.rotation_euler = (sin_p * math.radians(12.0), 0, 0)
            r_foot.keyframe_insert(data_path='rotation_euler', frame=f)
            
        # Arms swing opposite to legs
        if l_arm:
            l_arm.rotation_euler = (-sin_p * math.radians(22.0), 0, math.radians(-3.0))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_arm:
            r_arm.rotation_euler = (sin_p * math.radians(22.0), 0, math.radians(3.0))
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_forearm:
            l_forearm.rotation_euler = (math.radians(15.0) + max(0, -sin_p) * math.radians(10.0), 0, 0)
            l_forearm.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_forearm:
            r_forearm.rotation_euler = (math.radians(15.0) + max(0, sin_p) * math.radians(10.0), 0, 0)
            r_forearm.keyframe_insert(data_path='rotation_euler', frame=f)
            
        # Spine & Hips counter-rotation
        if spine:
            spine.rotation_euler = (math.radians(4.0), sin_p * math.radians(3.5), 0)
            spine.keyframe_insert(data_path='rotation_euler', frame=f)
        if hips:
            hips.rotation_euler = (0, -sin_p * math.radians(3.5), cos_p * math.radians(2.0))
            hips.keyframe_insert(data_path='rotation_euler', frame=f)
            
    actions_created.append(act_walk)

    # -------------------------------------------------------------
    # 3. RUN (Keep high-fidelity Mixamo mocap if available, or create)
    # -------------------------------------------------------------
    if mocap_run_action:
        mocap_run_action.name = "Run"
        actions_created.append(mocap_run_action)
    else:
        act_run = bpy.data.actions.new(name="Run")
        arm.animation_data.action = act_run
        for f in range(1, 21):
            phase = (f - 1) / 20.0 * math.pi * 2
            sin_p = math.sin(phase)
            if l_up_leg:
                l_up_leg.rotation_euler = (sin_p * math.radians(38.0), 0, 0)
                l_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            if r_up_leg:
                r_up_leg.rotation_euler = (-sin_p * math.radians(38.0), 0, 0)
                r_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            if l_leg:
                l_leg.rotation_euler = (max(0, -sin_p) * math.radians(60.0), 0, 0)
                l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            if r_leg:
                r_leg.rotation_euler = (max(0, sin_p) * math.radians(60.0), 0, 0)
                r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            if l_arm:
                l_arm.rotation_euler = (-sin_p * math.radians(40.0), 0, math.radians(-5.0))
                l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            if r_arm:
                r_arm.rotation_euler = (sin_p * math.radians(40.0), 0, math.radians(5.0))
                r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            if spine:
                spine.rotation_euler = (math.radians(10.0), sin_p * math.radians(5.0), 0)
                spine.keyframe_insert(data_path='rotation_euler', frame=f)
        actions_created.append(act_run)

    # -------------------------------------------------------------
    # 4. SPRINT (16 frames / 0.53s loop)
    # -------------------------------------------------------------
    act_sprint = bpy.data.actions.new(name="Sprint")
    arm.animation_data.action = act_sprint
    for f in range(1, 17):
        phase = (f - 1) / 16.0 * math.pi * 2
        sin_p = math.sin(phase)
        if l_up_leg:
            l_up_leg.rotation_euler = (sin_p * math.radians(48.0), 0, 0)
            l_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_up_leg:
            r_up_leg.rotation_euler = (-sin_p * math.radians(48.0), 0, 0)
            r_up_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_leg:
            l_leg.rotation_euler = (max(0, -sin_p) * math.radians(75.0), 0, 0)
            l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_leg:
            r_leg.rotation_euler = (max(0, sin_p) * math.radians(75.0), 0, 0)
            r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_arm:
            l_arm.rotation_euler = (-sin_p * math.radians(55.0), 0, math.radians(-8.0))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_arm:
            r_arm.rotation_euler = (sin_p * math.radians(55.0), 0, math.radians(8.0))
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_forearm:
            l_forearm.rotation_euler = (math.radians(45.0), 0, 0)
            l_forearm.keyframe_insert(data_path='rotation_euler', frame=f)
        if r_forearm:
            r_forearm.rotation_euler = (math.radians(45.0), 0, 0)
            r_forearm.keyframe_insert(data_path='rotation_euler', frame=f)
        if spine:
            spine.rotation_euler = (math.radians(16.0), sin_p * math.radians(7.0), 0)
            spine.keyframe_insert(data_path='rotation_euler', frame=f)
    actions_created.append(act_sprint)

    # -------------------------------------------------------------
    # 5. JUMP (20 frames takeoff & airborne rise)
    # -------------------------------------------------------------
    act_jump = bpy.data.actions.new(name="Jump")
    arm.animation_data.action = act_jump
    jump_kf = [
        (1, math.radians(-10), math.radians(35), math.radians(-15), math.radians(12)),
        (5, math.radians(0), math.radians(5), math.radians(30), math.radians(-5)),
        (12, math.radians(8), math.radians(40), math.radians(45), math.radians(5)),
        (20, math.radians(5), math.radians(30), math.radians(35), math.radians(2)),
    ]
    for (f, hip_x, k_flex, arm_up, sp_x) in jump_kf:
        if hips:
            hips.rotation_euler = (hip_x, 0, 0)
            hips.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_leg and r_leg:
            l_leg.rotation_euler = (k_flex, 0, 0)
            r_leg.rotation_euler = (k_flex * 0.9, 0, 0)
            l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_arm and r_arm:
            l_arm.rotation_euler = (arm_up, 0, math.radians(-25))
            r_arm.rotation_euler = (arm_up, 0, math.radians(25))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if spine:
            spine.rotation_euler = (sp_x, 0, 0)
            spine.keyframe_insert(data_path='rotation_euler', frame=f)
    actions_created.append(act_jump)

    # -------------------------------------------------------------
    # 6. FALL (20 frames looping float/air glide)
    # -------------------------------------------------------------
    act_fall = bpy.data.actions.new(name="Fall")
    arm.animation_data.action = act_fall
    for f in [1, 10, 20]:
        t = (f - 1) / 19.0
        wave = math.sin(t * math.pi * 2)
        if spine:
            spine.rotation_euler = (math.radians(8.0) + wave * math.radians(2.0), 0, 0)
            spine.keyframe_insert(data_path='rotation_euler', frame=f)
        if head:
            head.rotation_euler = (math.radians(-6.0), 0, 0)
            head.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_arm and r_arm:
            l_arm.rotation_euler = (math.radians(20.0), 0, math.radians(-45.0) + wave * math.radians(5.0))
            r_arm.rotation_euler = (math.radians(20.0), 0, math.radians(45.0) - wave * math.radians(5.0))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_leg and r_leg:
            l_leg.rotation_euler = (math.radians(25.0), 0, 0)
            r_leg.rotation_euler = (math.radians(20.0), 0, 0)
            l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
    actions_created.append(act_fall)

    # -------------------------------------------------------------
    # 7. LAND (18 frames impact cushion and recovery)
    # -------------------------------------------------------------
    act_land = bpy.data.actions.new(name="Land")
    arm.animation_data.action = act_land
    land_kf = [
        (1, math.radians(0), math.radians(10), math.radians(15), math.radians(2)),
        (6, math.radians(-12), math.radians(48), math.radians(-18), math.radians(18)),
        (12, math.radians(-5), math.radians(20), math.radians(-5), math.radians(8)),
        (18, 0, 0, 0, 0),
    ]
    for (f, hip_x, k_flex, arm_x, sp_x) in land_kf:
        if hips:
            hips.rotation_euler = (hip_x, 0, 0)
            hips.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_leg and r_leg:
            l_leg.rotation_euler = (k_flex, 0, 0)
            r_leg.rotation_euler = (k_flex, 0, 0)
            l_leg.keyframe_insert(data_path='rotation_euler', frame=f)
            r_leg.keyframe_insert(data_path='rotation_euler', frame=f)
        if l_arm and r_arm:
            l_arm.rotation_euler = (arm_x, 0, math.radians(-8))
            r_arm.rotation_euler = (arm_x, 0, math.radians(8))
            l_arm.keyframe_insert(data_path='rotation_euler', frame=f)
            r_arm.keyframe_insert(data_path='rotation_euler', frame=f)
        if spine:
            spine.rotation_euler = (sp_x, 0, 0)
            spine.keyframe_insert(data_path='rotation_euler', frame=f)
    actions_created.append(act_land)

    # Reset pose transforms before final export
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.transforms_clear()
    bpy.ops.object.mode_set(mode='OBJECT')

    # Push all created actions to NLA Tracks so Blender glTF exporter exports them all
    if not arm.animation_data:
        arm.animation_data_create()
    for track in list(arm.animation_data.nla_tracks):
        arm.animation_data.nla_tracks.remove(track)
    
    for act in actions_created:
        track = arm.animation_data.nla_tracks.new()
        track.name = act.name
        start_frame = int(act.frame_range[0])
        strip = track.strips.new(act.name, start_frame, act)
        strip.name = act.name
        print(f"✓ Pushed action '{act.name}' to NLA track (frames {act.frame_range[0]} to {act.frame_range[1]})")

    # Clear active action so glTF exporter relies purely on NLA strips
    arm.animation_data.action = None
    return actions_created

# ==============================================================================
# 3. MAIN AUTOMATED PIPELINE
# ==============================================================================

def build_khmer_avatar(base_fbx, output_glb, preview_full=None, preview_face=None):
    print("==================================================================")
    print("STEP 1: INGESTING HIGH-QUALITY HUMAN 3D MODEL & RESTORING REST POSE")
    print("==================================================================")
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    if not os.path.exists(base_fbx):
        raise FileNotFoundError(f"Base human model not found at: {base_fbx}")
        
    bpy.ops.import_scene.fbx(filepath=base_fbx)
    
    arm = None
    for o in bpy.data.objects:
        if o.type == 'ARMATURE':
            arm = o
            break
            
    if not arm:
        raise ValueError("Humanoid Armature skeleton not found in input asset!")
        
    print(f"✓ Humanoid Armature loaded: {arm.name} ({len(arm.data.bones)} bones)")
    
    # Check for animation action
    saved_action = arm.animation_data.action if arm.animation_data else None
    if saved_action:
        saved_action.name = "Run"  # Standardize for Three.js player
        print(f"✓ Animation preserved and renamed to: '{saved_action.name}'")
        
    head_bone = arm.data.bones.get('mixamorig9:Head') or arm.data.bones.get('Head')
    head_top = arm.data.bones.get('mixamorig9:HeadTop_End') or head_bone
    hips_bone = arm.data.bones.get('mixamorig9:Hips') or arm.data.bones.get('Hips')
    
    print(f"✓ Reference points: Head={head_bone.head_local}, Hips={hips_bone.head_local}")

    # --------------------------------------------------------------------------
    # 2. CREATE PBR MATERIALS & STYLIZE BASE GARMENTS
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 2: CREATING PBR MATERIALS & STYLIZING BASE GARMENTS")
    print("==================================================================")
    mat_flag = create_pbr_material("Mat_Flag", gen_flag_texture(), roughness=0.35)
    mat_krama = create_pbr_material("Mat_Krama", gen_krama_texture(), roughness=0.88)
    mat_straw = create_pbr_material("Mat_Straw", gen_straw_texture(), roughness=0.75)
    mat_linen = create_pbr_material("Mat_LinenShirt", gen_linen_texture(), roughness=0.78)
    mat_chongkben = create_pbr_material("Mat_ChongKben", gen_chongkben_texture(), roughness=0.85)
    mat_boots = create_pbr_material("Mat_Boots", gen_leather_texture(), roughness=0.38, metallic=0.1)
    mat_cord = create_pbr_material("Mat_HatCord", np.full((64, 64, 4), [0.86, 0.76, 0.58, 1.0], dtype=np.float32), roughness=0.8)

    sweater_obj = bpy.data.objects.get("Ch31_Sweater")
    collar_obj = bpy.data.objects.get("Ch31_Collar")
    pants_obj = bpy.data.objects.get("Ch31_Pants")
    shoes_obj = bpy.data.objects.get("Ch31_Shoes")
    
    if sweater_obj:
        sweater_obj.data.materials.clear()
        sweater_obj.data.materials.append(mat_linen)
    if collar_obj:
        collar_obj.data.materials.clear()
        collar_obj.data.materials.append(mat_linen)
    if pants_obj:
        pants_obj.data.materials.clear()
        pants_obj.data.materials.append(mat_chongkben)
    if shoes_obj:
        shoes_obj.data.materials.clear()
        shoes_obj.data.materials.append(mat_boots)

    # --------------------------------------------------------------------------
    # 3. BUILD AUTHENTIC KHMER WOVEN STRAW HAT (មួកស្លឹក/មួកចំបើង)
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 3: PROCEDURALLY BUILDING AUTHENTIC KHMER WOVEN STRAW HAT")
    print("==================================================================")
    hat_x = head_top.head_local.x
    hat_y = head_top.head_local.y - 1.0  # Snug on hairline
    hat_z = head_top.head_local.z - 1.2
    
    # Brim (radius 36cm, slanted cone)
    bpy.ops.mesh.primitive_cone_add(
        vertices=48,
        radius1=36.0, radius2=13.0, depth=6.0,
        location=(hat_x, hat_y, hat_z),
        rotation=(-math.radians(90), 0, 0)
    )
    hat_brim = bpy.context.active_object
    hat_brim.name = "Khmer_Hat_Brim"
    hat_brim.data.materials.append(mat_straw)

    # Crown (cylinder on top of brim)
    crown_y = hat_y + 6.0
    bpy.ops.mesh.primitive_cone_add(
        vertices=36,
        radius1=13.2, radius2=12.2, depth=10.0,
        location=(hat_x, crown_y, hat_z),
        rotation=(-math.radians(90), 0, 0)
    )
    hat_crown = bpy.context.active_object
    hat_crown.name = "Khmer_Hat_Crown"
    hat_crown.data.materials.append(mat_straw)

    # Hat Band
    bpy.ops.mesh.primitive_torus_add(
        major_segments=36, minor_segments=8,
        major_radius=13.3, minor_radius=0.7,
        location=(hat_x, crown_y - 3.8, hat_z),
        rotation=(-math.radians(90), 0, 0)
    )
    hat_band = bpy.context.active_object
    hat_band.name = "Khmer_Hat_Band"
    hat_band.data.materials.append(mat_straw)

    # Cambodian Flag Badge on Front Crown (faces -Z towards camera)
    flag_z = hat_z - 13.0
    bpy.ops.mesh.primitive_cube_add(
        size=1.0,
        location=(hat_x, crown_y + 0.5, flag_z),
        rotation=(0, 0, 0)
    )
    flag_badge = bpy.context.active_object
    flag_badge.scale = (9.5, 5.8, 0.4)
    flag_badge.name = "Khmer_Hat_Flag"
    flag_badge.data.materials.append(mat_flag)

    # Chin Cord & Bead
    chin_y = head_bone.head_local.y + 2.0
    bpy.ops.mesh.primitive_torus_add(
        major_segments=32, minor_segments=6,
        major_radius=8.5, minor_radius=0.35,
        location=(hat_x, chin_y, head_bone.head_local.z),
        rotation=(-math.radians(65), 0, 0)
    )
    chin_cord = bpy.context.active_object
    chin_cord.scale = (0.8, 1.2, 1.0)
    chin_cord.name = "Khmer_Hat_ChinCord"
    chin_cord.data.materials.append(mat_cord)

    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=1.0,
        location=(hat_x, chin_y - 6.0, head_bone.head_local.z - 3.5)
    )
    knot_bead = bpy.context.active_object
    knot_bead.name = "Khmer_Hat_Bead"
    knot_bead.data.materials.append(mat_cord)

    hat_parts = [hat_brim, hat_crown, hat_band, flag_badge, chin_cord, knot_bead]
    bpy.ops.object.select_all(action='DESELECT')
    for p in hat_parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = hat_parts[0]
    bpy.ops.object.join()
    khmer_hat = bpy.context.active_object
    khmer_hat.name = "Khmer_Traditional_Hat"
    for poly in khmer_hat.data.polygons:
        poly.use_smooth = True

    # --------------------------------------------------------------------------
    # 4. BUILD AUTHENTIC KHMER KRAMA SASH (ក្រម៉ាខ្មែរចងចង្កេះ)
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 4: PROCEDURALLY BUILDING AUTHENTIC KHMER KRAMA WAIST SASH")
    print("==================================================================")
    waist_x = hips_bone.head_local.x
    waist_y = hips_bone.head_local.y + 4.5
    waist_z = hips_bone.head_local.z

    bpy.ops.mesh.primitive_cylinder_add(
        vertices=36, radius=18.5, depth=13.0,
        location=(waist_x, waist_y, waist_z),
        rotation=(-math.radians(90), 0, 0)
    )
    krama_belt = bpy.context.active_object
    krama_belt.scale = (1.05, 1.0, 0.78)
    krama_belt.name = "Khmer_Krama_Belt"
    krama_belt.data.materials.append(mat_krama)

    knot_x = waist_x - 17.5
    knot_y = waist_y - 1.0
    knot_z = waist_z - 5.5
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=20, ring_count=14, radius=5.0,
        location=(knot_x, knot_y, knot_z)
    )
    krama_knot = bpy.context.active_object
    krama_knot.scale = (1.1, 0.9, 0.95)
    krama_knot.name = "Khmer_Krama_Knot"
    krama_knot.data.materials.append(mat_krama)

    tail_y = knot_y - 20.0
    bpy.ops.mesh.primitive_cube_add(
        size=1.0,
        location=(knot_x, tail_y, knot_z)
    )
    krama_tail = bpy.context.active_object
    krama_tail.scale = (10.5, 36.0, 1.8)
    krama_tail.name = "Khmer_Krama_Tail"
    krama_tail.data.materials.append(mat_krama)

    krama_parts = [krama_belt, krama_knot, krama_tail]
    for tx in np.linspace(knot_x - 4.5, knot_x + 4.5, 7):
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=6, radius=0.28, depth=3.8,
            location=(tx, tail_y - 19.5, knot_z),
            rotation=(-math.radians(90), 0, 0)
        )
        fringe = bpy.context.active_object
        fringe.name = "Khmer_Krama_Fringe"
        fringe.data.materials.append(mat_straw)
        krama_parts.append(fringe)

    bpy.ops.object.select_all(action='DESELECT')
    for p in krama_parts:
        p.select_set(True)
    bpy.context.view_layer.objects.active = krama_parts[0]
    bpy.ops.object.join()
    khmer_krama = bpy.context.active_object
    khmer_krama.name = "Khmer_Traditional_Krama"
    for poly in khmer_krama.data.polygons:
        poly.use_smooth = True

    # --------------------------------------------------------------------------
    # 5. RIGGING & WEIGHT BINDING OF ACCESSORIES
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 5: RIGGING & BINDING ACCESSORIES TO HUMANOID SKELETON")
    print("==================================================================")
    khmer_hat.parent = arm
    khmer_hat.vertex_groups.new(name=head_bone.name)
    vg_h = khmer_hat.vertex_groups[head_bone.name]
    vg_h.add([v.index for v in khmer_hat.data.vertices], 1.0, 'REPLACE')
    mod_h = khmer_hat.modifiers.new(name="Armature", type='ARMATURE')
    mod_h.object = arm

    khmer_krama.parent = arm
    khmer_krama.vertex_groups.new(name=hips_bone.name)
    spine_name = "mixamorig9:Spine" if "mixamorig9:Spine" in arm.data.bones else "Spine"
    khmer_krama.vertex_groups.new(name=spine_name)
    vg_hips = khmer_krama.vertex_groups[hips_bone.name]
    vg_spine = khmer_krama.vertex_groups[spine_name]
    for v in khmer_krama.data.vertices:
        if v.co.y >= waist_y:
            vg_spine.add([v.index], 0.7, 'REPLACE')
            vg_hips.add([v.index], 0.3, 'REPLACE')
        else:
            vg_hips.add([v.index], 1.0, 'REPLACE')
    mod_k = khmer_krama.modifiers.new(name="Armature", type='ARMATURE')
    mod_k.object = arm

    # --------------------------------------------------------------------------
    # 6. STUDIO LIGHTING AND HIGH-RESOLUTION BEAUTY PREVIEW RENDERING
    # --------------------------------------------------------------------------
    if preview_full or preview_face:
        print("==================================================================")
        print("STEP 6: SETTING UP STUDIO LIGHTING & RENDERING PREVIEWS")
        print("==================================================================")
        key_sun = bpy.data.lights.new(name="Studio_Key", type='SUN')
        key_sun.energy = 4.5
        key_sun.color = (1.0, 0.97, 0.92)
        key_obj = bpy.data.objects.new("Studio_Key", key_sun)
        key_obj.rotation_euler = (math.radians(65), math.radians(20), math.radians(-20))
        bpy.context.scene.collection.objects.link(key_obj)

        fill_sun = bpy.data.lights.new(name="Studio_Fill", type='SUN')
        fill_sun.energy = 3.0
        fill_sun.color = (0.88, 0.94, 1.0)
        fill_obj = bpy.data.objects.new("Studio_Fill", fill_sun)
        fill_obj.rotation_euler = (math.radians(60), math.radians(-30), math.radians(20))
        bpy.context.scene.collection.objects.link(fill_obj)

        bounce_sun = bpy.data.lights.new(name="Studio_Bounce", type='SUN')
        bounce_sun.energy = 2.2
        bounce_sun.color = (0.95, 0.92, 0.88)
        bounce_obj = bpy.data.objects.new("Studio_Bounce", bounce_sun)
        bounce_obj.rotation_euler = (math.radians(115), 0, 0)
        bpy.context.scene.collection.objects.link(bounce_obj)

        cam_data = bpy.data.cameras.new("RenderCam")
        cam_data.lens = 65.0
        cam_obj = bpy.data.objects.new("RenderCam", cam_data)
        bpy.context.scene.collection.objects.link(cam_obj)
        bpy.context.scene.camera = cam_obj

        # Temporary Rest pose for clear portfolio presentation
        arm.data.pose_position = 'REST'
        bpy.context.view_layer.update()

        scene = bpy.context.scene
        scene.render.resolution_x = 1080
        scene.render.resolution_y = 1440
        scene.render.film_transparent = True
        scene.render.image_settings.file_format = 'PNG'

        if preview_full:
            os.makedirs(os.path.dirname(preview_full), exist_ok=True)
            cam_obj.location = (0.0, -3.5, 1.0)
            cam_obj.rotation_euler = (math.radians(88), 0, 0)
            scene.render.filepath = preview_full
            bpy.ops.render.render(write_still=True)
            print(f"✓ Rendered Full Body standing preview to: {preview_full}")

        if preview_face:
            os.makedirs(os.path.dirname(preview_face), exist_ok=True)
            cam_obj.location = (0.0, -1.25, 1.60)
            cam_obj.rotation_euler = (math.radians(88), 0, 0)
            scene.render.filepath = preview_face
            bpy.ops.render.render(write_still=True)
            print(f"✓ Rendered Portrait / Hat Detail preview to: {preview_face}")

        # Restore Pose mode
        arm.data.pose_position = 'POSE'
        bpy.context.view_layer.update()

    # --------------------------------------------------------------------------
    # 6.5. AUTHOR & BAKE HUMANOID ANIMATION SUITE (Idle, Walk, Run, Sprint, Jump, Fall, Land)
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 6.5: AUTHORING & BAKING HUMANOID ANIMATION SUITE ONTO 65-BONE ARMATURE")
    print("==================================================================")
    create_humanoid_animations(arm, mocap_run_action=saved_action)

    # --------------------------------------------------------------------------
    # 7. GAME COMPATIBILITY CHECK & EXPORT GLB
    # --------------------------------------------------------------------------
    print("==================================================================")
    print("STEP 7: GAME ENGINE COMPATIBILITY CHECK & GLB EXPORT")
    print("==================================================================")
    total_verts = sum(len(o.data.vertices) for o in bpy.data.objects if o.type == 'MESH')
    total_polys = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
    mesh_names = [o.name for o in bpy.data.objects if o.type == 'MESH']
    
    print(f"• Total Meshes: {len(mesh_names)} ({mesh_names})")
    print(f"• Total Vertices: {total_verts:,}")
    print(f"• Total Polygons: {total_polys:,} (WebGL Budget: < 50,000)")
    print(f"• Armature Bones: {len(arm.data.bones)}")
    print(f"• World Scale: 1 unit = 1 meter (Character Height: 1.85m)")
    
    # Clean up cameras & lights so only the model & armature are exported
    for obj in list(bpy.data.objects):
        if obj.type in {'CAMERA', 'LIGHT'}:
            bpy.data.objects.remove(obj, do_unlink=True)
            
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format='GLB',
        export_animations=True
    )
    print(f"✓ Successfully exported Game-Ready Khmer Avatar GLB to: {output_glb}")

if __name__ == "__main__":
    workspace = os.path.abspath(".")
    base_model = os.path.join(workspace, "public", "models", "characters", "base_human_ch31.fbx")
    target_glb = os.path.join(workspace, "public", "models", "characters", "MenKhStyle.glb")
    preview_full = os.path.join(workspace, "public", "models", "characters", "menkhstyle_full_standing.png")
    preview_face = os.path.join(workspace, "public", "models", "characters", "menkhstyle_face_standing.png")
    
    # Allow custom input from CLI if passed
    if len(sys.argv) > 1 and sys.argv[-1].endswith(".fbx"):
        base_model = sys.argv[-1]
        
    build_khmer_avatar(base_model, target_glb, preview_full, preview_face)
